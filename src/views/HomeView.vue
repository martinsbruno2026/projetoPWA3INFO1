<script setup>
import { onMounted, ref } from 'vue'
import TaskForm from '../components/TaskForm.vue'
import TaskItem from '../components/TaskItem.vue'
import TaskStats from '../components/TaskStats.vue'
import TaskLocationMap from '../components/TaskLocationMap.vue'
import { useTasksStore } from '../stores/tasks.js'

const store = useTasksStore()
const editingTask = ref(null)
const selectedLocation = ref(null)

onMounted(() => store.fetchTasks())
async function submit(data) { await (editingTask.value ? store.updateTask(editingTask.value.id, data) : store.addTask(data)); editingTask.value = null }
function edit(task) { editingTask.value = task; window.scrollTo({ top: 0, behavior: 'smooth' }) }
async function remove(id) { if (editingTask.value?.id === id) editingTask.value = null; await store.removeTask(id) }
function showLocation(task) { selectedLocation.value = task.location }
</script>
<template>
  <div class="page-container">
    <section class="hero"><div><p class="eyebrow">ORGANIZAÇÃO</p><h1>Olá! 👋</h1><p>Organize suas tarefas e acompanhe seu progresso.</p></div><div class="progress-ring"><strong>{{ store.completionRate }}%</strong><span>feito</span></div></section>
    <TaskStats :total="store.total" :pending="store.pendingCount" :completed="store.completedCount" :rate="store.completionRate" />
    <TaskForm :editing-task="editingTask" :saving="store.saving" @submit="submit" @cancel="editingTask = null" />

    <div class="toolbar card">
      <div class="search"><span>🔎</span><input v-model="store.search" placeholder="Pesquisar tarefas..." /></div>
      <div class="filters"><select v-model="store.filter"><option value="all">Todas</option><option value="pending">Pendentes</option><option value="completed">Concluídas</option></select><select v-model="store.priorityFilter"><option value="all">Todas prioridades</option><option value="high">Alta</option><option value="medium">Média</option><option value="low">Baixa</option></select><select v-model="store.categoryFilter"><option value="all">Todas categorias</option><option v-for="category in store.categories" :key="category">{{ category }}</option></select><select v-model="store.sortBy"><option value="created">Mais recentes</option><option value="due">Por prazo</option><option value="priority">Por prioridade</option></select><button class="clear" @click="store.clearFilters">Limpar</button></div>
    </div>

    <div v-if="store.error" class="alert">⚠️ {{ store.error }}</div>
    <div v-if="store.loading" class="loading">Carregando tarefas...</div>
    <template v-else>
      <div class="list-header"><h2>{{ store.filteredTasks.length ? 'Minhas tarefas' : 'Nenhuma tarefa encontrada' }}</h2><span v-if="store.overdueCount" class="overdue-badge">{{ store.overdueCount }} atrasada(s)</span></div>
      <div class="task-list">
        <TaskItem v-for="task in store.filteredTasks" :key="task.id" :task="task" @toggle="store.toggleTask" @remove="remove" @edit="edit" />
      </div>
      <div v-if="!store.filteredTasks.length && store.tasks.length" class="empty">🔎<strong>Nada encontrado</strong><span>Tente mudar os filtros ou a pesquisa.</span></div>
      <div v-if="!store.tasks.length" class="empty">📋<strong>Comece sua organização</strong><span>Adicione sua primeira tarefa acima.</span></div>
    </template>

    <section v-if="selectedLocation" class="card map-section"><div class="section-head"><h2>📍 Local da tarefa</h2><button @click="selectedLocation = null">Fechar</button></div><TaskLocationMap :location="selectedLocation" /></section>
    <div v-if="store.tasks.some(t => t.location)" class="location-links"><button v-for="task in store.tasks.filter(t => t.location)" :key="task.id" @click="showLocation(task)">📍 {{ task.title }}</button></div>
  </div>
</template>
