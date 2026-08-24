import { ref } from 'vue'
import api from '../api/config'

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY // 

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

export function usePushNotifications() {
  const isSupported = ref('Notification' in window && 'PushManager' in window) // 
  const permission = ref(isSupported.value ? Notification.permission : 'denied')

  async function requestPermission() {
    if (!isSupported.value) return false
    const result = await Notification.requestPermission()
    permission.value = result
    return result === 'granted'
  }

  async function subscribe(swRegistration) {
    if (!isSupported.value || !swRegistration) return null

    try {
      // Fallback: busca a chave no backend se não estiver no .env
      let vapidKey = VAPID_PUBLIC_KEY
      if (!vapidKey) {
        const { data } = await api.get('/api/vapid-public-key')
        vapidKey = data.publicKey
      }

      const subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true, // 
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      })

      // Serializa as chaves de ArrayBuffer para base64
      await api.post('/api/subscriptions', {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')))),
          auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')))),
        },
      })

      // Salva o endpoint para o interceptor Axios enviar no header X-Push-Endpoint
      localStorage.setItem('push_endpoint', subscription.endpoint)
      return subscription
    } catch (err) {
      console.error('[Push] subscribe failed:', err)
      return null
    }
  }

  async function unsubscribe() {
    if (!isSupported.value) return
    try {
      const reg = await navigator.serviceWorker.ready
      const subscription = await reg.pushManager.getSubscription()
      if (!subscription) return

      await api.delete('/api/subscriptions', {
        data: { endpoint: subscription.endpoint },
      })
      await subscription.unsubscribe()
      localStorage.removeItem('push_endpoint') // 
    } catch (err) {
      console.error('[Push] unsubscribe failed:', err)
    }
  }

  return { isSupported, permission, requestPermission, subscribe, unsubscribe }
}