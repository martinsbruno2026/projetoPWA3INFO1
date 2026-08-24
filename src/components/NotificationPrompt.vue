<template>
  <Transition name="slide-up">
    <div v-if="visible" class="notification-prompt">
      <div class="prompt-content">
        <span class="prompt-icon">🔔</span>
        <div class="prompt-text">
          <strong>Ativar notificações?</strong>
          <p>Seja avisado quando tarefas forem criadas ou atualizadas em outros dispositivos.</p>
        </div>
      </div>
      <div class="prompt-actions">
        <button class="btn-allow" @click="allow">Ativar</button>
        <button class="btn-dismiss" @click="dismiss">Agora não</button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const visible = ref(false)
const authStore = useAuthStore()

onMounted(() => {
  if (
    authStore.isAuthenticated &&
    'Notification' in window &&
    Notification.permission === 'default' && // 
    !localStorage.getItem('push_prompt_dismissed')
  ) {
    setTimeout(() => { visible.value = true }, 2000) // 
  }
})

async function allow() {
  visible.value = false
  const granted = await authStore.requestPermission()
  if (granted) {
    const reg = await navigator.serviceWorker.ready
    await authStore.subscribe(reg) // 
  }
}

function dismiss() {
  visible.value = false
  localStorage.setItem('push_prompt_dismissed', '1') // 
}
</script>

<style scoped>
.notification-prompt {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: min(480px, calc(100vw - 2rem));
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 1rem 1.25rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.prompt-content { display: flex; align-items: flex-start; gap: 0.75rem; }
.prompt-icon { font-size: 1.5rem; flex-shrink: 0; }
.prompt-text strong { display: block; font-size: 0.95rem; color: #1a202c; }
.prompt-text p { margin: 0.2rem 0 0; font-size: 0.85rem; color: #718096; line-height: 1.4; }
.prompt-actions { display: flex; gap: 0.5rem; justify-content: flex-end; }
.btn-allow {
  padding: 0.4rem 1rem; background: #4a90d9; color: #fff;
  border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem;
}
.btn-dismiss {
  padding: 0.4rem 1rem; background: transparent; color: #718096;
  border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer; font-size: 0.85rem;
}
/* Animação slide-up */
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateX(-50%) translateY(1rem); }
</style>