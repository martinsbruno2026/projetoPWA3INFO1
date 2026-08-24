<script setup>
defineProps({
  clickable: { type: Boolean, default: false },
});
</script>

<template>
  <div class="app-card" :class="{ clickable }" v-bind="$attrs">
    <slot />
  </div>
</template>

<style scoped>
.app-card {
  background: var(--color-surface);
  border-radius: var(--radius);
  padding: var(--space-md);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.app-card.clickable {
  cursor: pointer;
  transition:
    transform 0.1s,
    box-shadow 0.1s;
}

.app-card.clickable:active {
  transform: scale(0.98);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}
</style>