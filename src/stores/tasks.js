import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import tasksApi from '../api/tasksApi.js'

const LOCAL_KEY = 'task-manager-local-v3'
const META_KEY = 'task-manager-metadata-v3'

function readJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)) } catch { return fallback }
}
function writeJson(key, value) { localStorage.setItem(key, JSON.stringify(value)) }

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref(null)
  const usingLocal = ref(false)
  const search = ref('')
  const filter = ref('all')
  const priorityFilter = ref('all')
  const categoryFilter = ref('all')
  const sortBy = ref('created')

  const categories = computed(() => [...new Set(tasks.value.map(t => t.category).filter(Boolean))].sort((a,b) => a.localeCompare(b)))
  const filteredTasks = computed(() => {
    const q = search.value.trim().toLowerCase()
    const result = tasks.value.filter(t => {
      if (filter.value === 'pending' && t.done) return false
      if (filter.value === 'completed' && !t.done) return false
      if (priorityFilter.value !== 'all' && t.priority !== priorityFilter.value) return false
      if (categoryFilter.value !== 'all' && t.category !== categoryFilter.value) return false
      if (q && !`${t.title} ${t.notes || ''} ${t.category || ''}`.toLowerCase().includes(q)) return false
      return true
    })
    return [...result].sort((a,b) => {
      if (sortBy.value === 'due') return (a.dueDate || '9999-12-31').localeCompare(b.dueDate || '9999-12-31')
      if (sortBy.value === 'priority') return ({high:0,medium:1,low:2}[a.priority] ?? 3) - ({high:0,medium:1,low:2}[b.priority] ?? 3)
      if (sortBy.value === 'title') return a.title.localeCompare(b.title)
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    })
  })
  const total = computed(() => tasks.value.length)
  const completedCount = computed(() => tasks.value.filter(t => t.done).length)
  const pendingCount = computed(() => total.value - completedCount.value)
  const highPriorityCount = computed(() => tasks.value.filter(t => !t.done && t.priority === 'high').length)
  const overdueCount = computed(() => tasks.value.filter(t => !t.done && t.dueDate && t.dueDate < new Date().toISOString().slice(0,10)).length)
  const completionRate = computed(() => total.value ? Math.round(completedCount.value / total.value * 100) : 0)

  function normalize(task, meta = {}) {
    return {
      ...task,
      id: task.id ?? crypto.randomUUID(),
      title: task.title || 'Sem título',
      done: Boolean(task.done),
      priority: task.priority || meta.priority || 'medium',
      category: task.category || meta.category || 'Geral',
      dueDate: task.dueDate || meta.dueDate || '',
      notes: task.notes || meta.notes || '',
      location: task.location || meta.location || null,
      img_url: task.img_url || meta.img_url || null,
      img_attachment_key: task.img_attachment_key || meta.img_attachment_key || null,
      createdAt: task.createdAt || meta.createdAt || new Date().toISOString(),
    }
  }

  function saveLocal() { writeJson(LOCAL_KEY, tasks.value) }
  function saveMeta(task) {
    const meta = readJson(META_KEY, {})
    meta[task.id] = { priority: task.priority, category: task.category, dueDate: task.dueDate, notes: task.notes, location: task.location, img_url: task.img_url, img_attachment_key: task.img_attachment_key, createdAt: task.createdAt }
    writeJson(META_KEY, meta)
  }

  async function fetchTasks() {
    loading.value = true; error.value = null
    try {
      const response = await tasksApi.getAll()
      const data = Array.isArray(response.data) ? response.data : (response.data?.results || [])
      const meta = readJson(META_KEY, {})
      tasks.value = data.map(t => normalize(t, meta[t.id] || {}))
      usingLocal.value = false
      saveLocal()
    } catch {
      tasks.value = readJson(LOCAL_KEY, []).map(t => normalize(t))
      usingLocal.value = true
      if (!tasks.value.length) error.value = 'API indisponível: as novas tarefas serão salvas localmente até a API voltar.'
    } finally { loading.value = false }
  }

  async function addTask(data) {
    if (!data.title?.trim()) return
    saving.value = true; error.value = null
    const payload = normalize({ ...data, title: data.title.trim(), done: false, createdAt: new Date().toISOString() })
    try {
      const response = await tasksApi.create(payload)
      const task = normalize({ ...response.data, ...payload })
      tasks.value.unshift(task); saveMeta(task); saveLocal(); usingLocal.value = false
      return task
    } catch {
      tasks.value.unshift(payload); saveMeta(payload); saveLocal(); usingLocal.value = true
      return payload
    } finally { saving.value = false }
  }

  async function updateTask(id, changes) {
    const current = tasks.value.find(t => String(t.id) === String(id))
    if (!current) return
    saving.value = true; error.value = null
    const updated = normalize({ ...current, ...changes })
    try {
      const response = await tasksApi.update(id, changes)
      Object.assign(updated, response.data || {})
      usingLocal.value = false
    } catch { usingLocal.value = true }
    const index = tasks.value.findIndex(t => String(t.id) === String(id))
    if (index !== -1) tasks.value[index] = updated
    saveMeta(updated); saveLocal(); saving.value = false
    return updated
  }

  async function toggleTask(id) {
    const task = tasks.value.find(t => String(t.id) === String(id))
    if (task) return updateTask(id, { done: !task.done })
  }

  async function removeTask(id) {
    try { await tasksApi.remove(id); usingLocal.value = false } catch { usingLocal.value = true }
    tasks.value = tasks.value.filter(t => String(t.id) !== String(id)); saveLocal()
    const meta = readJson(META_KEY, {}); delete meta[id]; writeJson(META_KEY, meta)
  }

  function clearFilters() { search.value=''; filter.value='all'; priorityFilter.value='all'; categoryFilter.value='all'; sortBy.value='created' }

  return { tasks, loading, saving, error, usingLocal, search, filter, priorityFilter, categoryFilter, sortBy, categories, filteredTasks, total, completedCount, pendingCount, highPriorityCount, overdueCount, completionRate, fetchTasks, addTask, updateTask, toggleTask, removeTask, clearFilters }
})
