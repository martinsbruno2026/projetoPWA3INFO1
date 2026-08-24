import { extractAddressLabel, locationCacheKey } from '../utils/location.js'

const REVERSE_URL =
  import.meta.env.VITE_GEOCODING_BASE_URL ?? 'https://nominatim.openstreetmap.org/reverse'

const CACHE_PREFIX = 'reverse-geocode:'

function readCache(key) {
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${key}`)
    return cached ? JSON.parse(cached) : null
  } catch {
    return null
  }
}

function writeCache(key, value) {
  try {
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(value))
  } catch {
    // O cache é opcional; não deve impedir o salvamento da tarefa.
  }
}

const geocodingApi = {
  async reverse(latitude, longitude) {
    const key = locationCacheKey(latitude, longitude)
    if (!key) return null

    const cached = readCache(key)
    if (cached) return cached

    const params = new URLSearchParams({
      format: 'jsonv2',
      lat: String(latitude),
      lon: String(longitude),
      zoom: '18',
      addressdetails: '1',
    })
    const response = await fetch(`${REVERSE_URL}?${params}`)
    if (!response.ok) throw new Error(`Falha HTTP ${response.status}`)

    const result = await response.json()
    const location = {
      label: extractAddressLabel(result),
      displayName: result.display_name ?? null,
    }
    writeCache(key, location)
    return location
  },
}

export default geocodingApi