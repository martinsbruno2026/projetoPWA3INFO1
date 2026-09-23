import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import tasksApi from '../api/tasksApi.js'

const META_KEY = 'task-manager-metadata-v2'
const readMeta = () => {
  try { return JSON.parse(localStorage.getItem(META_KEY) || '{}') } catch { return {} }
}
const writeMeta = (value) => localStorage.setItem(META_KEY, JSON.stringify(value))

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref(null)
  const search = ref('')
  const filter = ref('all')
  const priorityFilter = ref('all')
  const categoryFilter = ref('all')
  const sortBy = ref('created')

  const categories = computed(() => [...new Set(tasks.value.map(t => t.category).filter(Boolean))].sort())
  const filteredTasks = computed(() => {
    const q = search.value.trim().toLowerCase()
    let result = tasks.value.filter(t => {
      if (filter.value === 'pending' && t.done) return false
      if (filter.value === 'completed' && !t.done) return false
      if (priorityFilter.value !== 'all' && t.priority !== priorityFilter.value) return false
      if (categoryFilter.value !== 'all' && t.category !== categoryFilter.value) return false
      if (q && !`${t.title} ${t.notes || ''} ${t.category || ''}`.toLowerCase().includes(q)) return false
      return true
    })
    return [...result].sort((a, b) => {
      if (sortBy.value === 'due') return (a.dueDate || '9999') .localeCompare(b.dueDate || '9999')
      if (sortBy.value === 'priority') return ({ high: 0, medium: 1, low: 2 }[a.priority] ?? 3) - ({ high: 0, medium: 1, low: 2 }[b.priority] ?? 3)
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    })
  })
  const pendingTasks = computed(() => filteredTasks.value.filter(t => !t.done))
  const completedTasks = computed(() => filteredTasks.value.filter(t => t.done))
  const total = computed(() => tasks.value.length)
  const completedCount = computed(() => tasks.value.filter(t => t.done).length)
  const pendingCount = computed(() => total.value - completedCount.value)
  const highPriorityCount = computed(() => tasks.value.filter(t => !t.done && t.priority === 'high').length)
  const overdueCount = computed(() => tasks.value.filter(t => !t.done && t.dueDate && t.dueDate < new Date().toISOString().slice(0, 10)).length)
  const completionRate = computed(() => total.value ? Math.round(completedCount.value / total.value * 100) : 0)

  function mergeMeta(list) {
    const meta = readMeta()
    return list.map(task => ({
      ...task,
      priority: task.priority || meta[task.id]?.priority || 'medium',
      category: task.category || meta[task.id]?.category || 'Geral',
      dueDate: task.dueDate || meta[task.id]?.dueDate || '',
      notes: task.notes || meta[task.id]?.notes || '',
      location: task.location || meta[task.id]?.location || null,
      img_url: task.img_url || meta[task.id]?.img_url || null,
      createdAt: task.createdAt || meta[task.id]?.createdAt || new Date().toISOString(),
    }))
  }

  function saveTaskMeta(task) {
    const meta = readMeta()
    meta[task.id] = {
      priority: task.priority, category: task.category, dueDate: task.dueDate,
      notes: task.notes, location: task.location, img_url: task.img_url, createdAt: task.createdAt,
    }
    writeMeta(meta)
  }

  async function fetchTasks() {
    loading.value = true; error.value = null
    try {
      const response = await tasksApi.getAll()
      const data = Array.isArray(response.data) ? response.data : (response.data?.results || [])
      tasks.value = mergeMeta(data)
    } catch (err) {
      error.value = 'Não foi possível carregar as tarefas. Verifique se a API está ligada.'
    } finally { loading.value = false }
  }

  async function addTask(taskData) {
    if (!taskData.title?.trim()) return
    saving.value = true; error.value = null
    const payload = { ...taskData, title: taskData.title.trim(), done: false }
    try {
      let response
      try { response = await tasksApi.create(payload) }
      catch { response = await tasksApi.create(payload.title) }
      const task = { ...response.data, ...payload }
      tasks.value.unshift(task); saveTaskMeta(task)
      return task
    } catch (err) { error.value = 'Erro ao adicionar tarefa.'; throw err }
    finally { saving.value = false }
  }

  async function updateTask(id, changes) {
    saving.value = true; error.value = null
    const current = tasks.value.find(t => t.id === id)
    if (!current) return
    try {
      let response
      try { response = await tasksApi.update(id, changes) }
      catch { response = await tasksApi.update(id, { title: changes.title, done: changes.done }) }
      const updated = { ...current, ...response.data, ...changes }
      const index = tasks.value.findIndex(t => t.id === id)
      if (index !== -1) tasks.value[index] = updated
      saveTaskMeta(updated)
      return updated
    } catch (err) { error.value = 'Erro ao salvar a tarefa.'; throw err }
    finally { saving.value = false }
  }

  async function toggleTask(id) {
    const task = tasks.value.find(t => t.id === id)
    if (task) await updateTask(id, { done: !task.done })
  }

  async function removeTask(id) {
    error.value = null
    try {
      await tasksApi.remove(id)
      tasks.value = tasks.value.filter(t => t.id !== id)
      const meta = readMeta(); delete meta[id]; writeMeta(meta)
    } catch (err) { error.value = 'Erro ao remover tarefa.'; throw err }
  }

  function clearFilters() {
    search.value = ''; filter.value = 'all'; priorityFilter.value = 'all'; categoryFilter.value = 'all'; sortBy.value = 'created'
  }

  return { tasks, loading, saving, error, search, filter, priorityFilter, categoryFilter, sortBy, categories, filteredTasks, pendingTasks, completedTasks, total, completedCount, pendingCount, highPriorityCount, overdueCount, completionRate, fetchTasks, addTask, updateTask, toggleTask, removeTask, clearFilters }
})
