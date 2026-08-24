<script setup>
defineProps({
  label: { type: String, default: '' },
});

const emit = defineEmits(['click']);
</script>

<template>
  <button
    class="fab"
    :aria-label="label || 'Ação principal'"
    @click="emit('click')"
  >
    <span class="fab-icon">+</span>
  </button>
</template>

<style scoped>
.fab {
  position: fixed;
  bottom: 80px; /* acima da barra de navegação */
  right: 16px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-primary, #0b5cff);
  color: #fff;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.fab:active {
  transform: scale(0.92);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.fab-icon {
  font-size: 1.5rem;
  font-weight: 300;
  line-height: 1;
}
</style>