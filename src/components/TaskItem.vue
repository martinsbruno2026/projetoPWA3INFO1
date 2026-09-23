<script setup>
import { computed } from 'vue'
const props = defineProps({ task: { type: Object, required: true } })
const emit = defineEmits(['toggle', 'remove', 'edit'])
const priorityLabel = computed(() => ({ high: 'Alta', medium: 'Média', low: 'Baixa' }[props.task.priority] || 'Média'))
const overdue = computed(() => !props.task.done && props.task.dueDate && props.task.dueDate < new Date().toISOString().slice(0,10))
function formatDate(value) { return value ? new Date(`${value}T00:00:00`).toLocaleDateString('pt-BR') : '' }
function remove() { if (confirm(`Excluir a tarefa "${props.task.title}"?`)) emit('remove', props.task.id) }
</script>
<template>
  <article class="task-card" :class="[{ done: task.done }, `priority-${task.priority}`]">
    <input class="check" type="checkbox" :checked="task.done" @change="emit('toggle', task.id)" />
    <div class="task-content">
      <div class="task-title-row"><h3>{{ task.title }}</h3><span v-if="task.category" class="tag">{{ task.category }}</span></div>
      <p v-if="task.notes" class="notes">{{ task.notes }}</p>
      <div class="meta">
        <span v-if="task.dueDate" :class="{ overdue }">📅 {{ formatDate(task.dueDate) }}{{ overdue ? ' · atrasada' : '' }}</span>
        <span>⭐ {{ priorityLabel }}</span>
        <span v-if="task.location">📍 Local salvo</span>
      </div>
      <img v-if="task.img_url" :src="task.img_url" class="task-image" alt="Imagem da tarefa" />
    </div>
    <div class="task-actions"><button @click="emit('edit', task)" aria-label="Editar">✏️</button><button @click="remove" aria-label="Excluir">🗑️</button></div>
  </article>
</template>
