<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  message: { type: String, default: '' },
  type: { type: String, default: 'info' }, // 'info', 'success', 'error'
  duration: { type: Number, default: 3000 },
});

const emit = defineEmits(['close']);
const visible = ref(false);

watch(
  () => props.message,
  (newVal) => {
    if (newVal) {
      visible.value = true;
      setTimeout(() => {
        visible.value = false;
        emit('close');
      }, props.duration);
    }
  },
);
</script>

<template>
  <Transition name="toast">
    <div v-if="visible" class="toast" :class="type">
      {{ message }}
    </div>
  </Transition>
</template>

<style scoped>
.toast {
  position: fixed;
  bottom: 80px;
  left: 16px;
  right: 16px;
  padding: 14px 16px;
  border-radius: 8px;
  color: #fff;
  font-size: 0.9rem;
  text-align: center;
  z-index: 1000;
}

.toast.success {
  background: #2e7d32;
}
.toast.error {
  background: #c62828;
}
.toast.info {
  background: #1565c0;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    transform 0.3s,
    opacity 0.3s;
}

.toast-enter-from,
.toast-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>