<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

const tabs = [
  { name: 'home', label: 'Início', icon: 'home' },
  { name: 'registro-novo', label: 'Novo', icon: 'add_circle' },
  { name: 'configuracoes', label: 'Config', icon: 'settings' },
];

function isActive(tabName) {
  return route.name === tabName;
}
</script>

<template>
  <nav class="bottom-nav">
    <router-link
      v-for="tab in tabs"
      :key="tab.name"
      :to="{ name: tab.name }"
      class="nav-tab"
      :class="{ active: isActive(tab.name) }"
    >
      <span class="material-icons">{{ tab.icon }}</span>
      <span class="nav-label">{{ tab.label }}</span>
    </router-link>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  background: #fff;
  border-top: 1px solid #e0e0e0;
  padding: 8px 0;
  z-index: 100;
}

.nav-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #999;
  font-size: 0.75rem;
  min-width: 64px;
  padding: 4px 0;
}

.nav-tab.active {
  color: #0b5cff;
}

.nav-label {
  margin-top: 2px;
}
</style>