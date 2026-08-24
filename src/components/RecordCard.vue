<script setup>
// Props serão explicadas na próxima seção
</script>

<template>
  <div class="record-card">
    <div class="record-header">
      <h3 class="record-title">
        <slot name="title">Sem título</slot>
      </h3>
    </div>
    <div class="record-body">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.record-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  transition: transform 0.1s;
}

.record-card:active {
  transform: scale(0.98);
}

.record-header {
  margin-bottom: 8px;
}

.record-title {
  font-size: 18px;
  font-weight: 600;
  color: #111;
}

.record-body {
  font-size: 14px;
  color: #666;
}
</style>