<template>
  <section class="stats-grid">
    <div class="stat"><strong>{{ total }}</strong><span>Total</span></div>
    <div class="stat"><strong>{{ pending }}</strong><span>Pendentes</span></div>
    <div class="stat"><strong>{{ completed }}</strong><span>Concluídas</span></div>
    <div class="stat"><strong>{{ rate }}%</strong><span>Progresso</span></div>
  </section>
</template>
<script setup>
defineProps({ total: Number, pending: Number, completed: Number, rate: Number })
</script>
