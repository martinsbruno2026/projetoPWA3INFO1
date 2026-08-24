<template>
  <div class="record-list">
    <div v-for="record in records" :key="record.id" class="record-card">
      <h3 class="record-title">{{ record.title }}</h3>
      <span class="record-duration">{{ record.duration }} min</span>
    </div>
  </div>
</template>

<style scoped>
/* Base: mobile (uma coluna, espaçamento compacto) */
.record-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
}

.record-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.record-title {
  font-size: 1rem;
  margin-bottom: 4px;
}

.record-duration {
  font-size: 0.875rem;
  color: #666;
}

/* Tablet: duas colunas */
@media (min-width: 768px) {
  .record-list {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .record-card {
    flex: 0 0 calc(50% - 6px);
  }
}

/* Desktop: três colunas com largura máxima */
@media (min-width: 1024px) {
  .record-list {
    max-width: 960px;
    margin: 0 auto;
  }

  .record-card {
    flex: 0 0 calc(33.333% - 8px);
  }
}
</style>