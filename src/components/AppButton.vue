<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'danger'].includes(v),
  },
  fullWidth: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});
</script>

<template>
  <button
    class="app-btn"
    :class="[variant, { 'full-width': fullWidth }]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.app-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: 12px var(--space-md);
  border: none;
  border-radius: var(--radius);
  font-size: var(--font-size-base);
  font-weight: 600;
  min-height: var(--touch-min);
  cursor: pointer;
  transition: background-color 0.2s;
}

.app-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.primary {
  background: var(--color-primary);
  color: #fff;
}

.primary:active:not(:disabled) {
  background: var(--color-primary-dark);
}

.secondary {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.danger {
  background: var(--color-error);
  color: #fff;
}

.full-width {
  width: 100%;
}
</style>