<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()
const isAbout = computed(() => route.name === 'about')
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <div class="topbar-inner">
        <RouterLink to="/" class="brand">
          <span class="brand-icon">✓</span>
          <span>Minhas Tarefas</span>
        </RouterLink>
        <nav class="desktop-nav">
          <RouterLink to="/">Tarefas</RouterLink>
          <RouterLink to="/about">Sobre</RouterLink>
        </nav>
      </div>
    </header>

    <main :class="{ 'main-about': isAbout }">
      <RouterView />
    </main>

    <nav class="bottom-nav">
      <RouterLink to="/" class="nav-item">
        <span>☑</span><small>Tarefas</small>
      </RouterLink>
      <RouterLink to="/about" class="nav-item">
        <span>ℹ</span><small>Sobre</small>
      </RouterLink>
    </nav>
  </div>
</template>
