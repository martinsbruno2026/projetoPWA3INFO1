<script setup>
defineProps({
  title: { type: String, default: 'Nenhum item ainda' },
  description: { type: String, default: '' },
  actionLabel: { type: String, default: '' },
});

const emit = defineEmits(['action']);
</script>

<template>
  <div class="empty-state">
    <p class="empty-title">{{ title }}</p>
    <p v-if="description" class="empty-description">{{ description }}</p>
    <button v-if="actionLabel" class="empty-action" @click="emit('action')">
      {{ actionLabel }}
    </button>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.empty-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.empty-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 16px;
}

.empty-action {
  background: #0b5cff;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 0.9rem;
  min-height: 44px;
  cursor: pointer;
}
</style>