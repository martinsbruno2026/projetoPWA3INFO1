<script setup>
defineProps({
  sticky: { type: Boolean, default: true },
});
</script>

<template>
  <div class="bottom-actions" :class="{ sticky }">
    <slot />
  </div>
</template>

<style scoped>
.bottom-actions {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: #fff;
  border-top: 1px solid var(--color-border, #e0e0e0);
}

.bottom-actions.sticky {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
}
</style>