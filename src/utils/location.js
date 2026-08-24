export function extractAddressLabel(result) {
  const address = result?.address ?? {}
  return (
    address.road ||
    address.pedestrian ||
    address.path ||
    result?.display_name ||
    'Endereço não identificado'
  )
}

export function locationCacheKey(latitude, longitude) {
  if (latitude == null || longitude == null) return null
  return `${Number(latitude).toFixed(4)},${Number(longitude).toFixed(4)}`
}

export function buildLocationPayload(location) {
  if (!location) {
    return {
      latitude: null,
      longitude: null,
      geolocation_accuracy: null,
      geolocation_timestamp: null,
      location_label: null,
    }
  }

  return {
    latitude: location.latitude ?? null,
    longitude: location.longitude ?? null,
    geolocation_accuracy: location.accuracy ?? null,
    geolocation_timestamp: location.timestamp
      ? new Date(location.timestamp).toISOString()
      : null,
    location_label: location.label?.trim() || null,
  }
}