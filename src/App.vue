<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const isLogin = computed(() => route.name === 'login')

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="app-shell">
    <header v-if="!isLogin" class="topbar">
      <div class="topbar-inner">
        <RouterLink to="/" class="brand">
          <span class="brand-icon">✓</span>
          <span>Minhas Tarefas</span>
        </RouterLink>
        <nav class="desktop-nav">
          <RouterLink to="/">Tarefas</RouterLink>
          <RouterLink to="/about">Sobre</RouterLink>
          <button @click="logout">Sair</button>
        </nav>
      </div>
    </header>

    <main :class="{ 'main-login': isLogin }">
      <RouterView />
    </main>

    <nav v-if="!isLogin" class="bottom-nav">
      <RouterLink to="/" class="nav-item"><span>☑</span><small>Tarefas</small></RouterLink>
      <RouterLink to="/about" class="nav-item"><span>ℹ</span><small>Sobre</small></RouterLink>
      <button class="nav-item" @click="logout"><span>↪</span><small>Sair</small></button>
    </nav>
  </div>
</template>
