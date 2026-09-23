<script setup>
import { reactive, ref, watch } from 'vue'
import tasksApi from '../api/tasksApi.js'
import CameraCapture from './CameraCapture.vue'

const props = defineProps({ editingTask: { type: Object, default: null }, saving: Boolean })
const emit = defineEmits(['submit', 'cancel'])
const showAdvanced = ref(false)
const showCamera = ref(false)
const uploading = ref(false)
const previewUrl = ref(null)
const form = reactive({ title: '', dueDate: '', priority: 'medium', category: 'Geral', notes: '', location: null, img_attachment_key: null, img_url: null })

watch(() => props.editingTask, task => {
  Object.assign(form, task ? { title: task.title || '', dueDate: task.dueDate || '', priority: task.priority || 'medium', category: task.category || 'Geral', notes: task.notes || '', location: task.location || null, img_attachment_key: null, img_url: task.img_url || null } : { title: '', dueDate: '', priority: 'medium', category: 'Geral', notes: '', location: null, img_attachment_key: null, img_url: null })
  previewUrl.value = null
  showAdvanced.value = !!task
}, { immediate: true })

function useLocation() {
  if (!navigator.geolocation) return alert('Seu navegador não oferece geolocalização.')
  navigator.geolocation.getCurrentPosition(pos => {
    form.location = { latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy, label: 'Local salvo da tarefa' }
  }, () => alert('Não foi possível obter sua localização.'))
}
async function handleImage(event) {
  const file = event.target.files?.[0]; if (!file) return
  previewUrl.value = URL.createObjectURL(file); uploading.value = true
  try { const { data } = await tasksApi.uploadImage(file); form.img_attachment_key = data.attachment_key; form.img_url = data.url || data.img_url || previewUrl.value }
  catch { alert('Não foi possível enviar a imagem.') }
  finally { uploading.value = false }
}
function handleCameraCapture(data) { previewUrl.value = data; showCamera.value = false }
function submit() { if (!form.title.trim()) return; emit('submit', { ...form, title: form.title.trim() }) }
function cancel() { emit('cancel') }
</script>

<template>
  <form class="task-form card" @submit.prevent="submit">
    <div class="form-title">{{ editingTask ? '✏️ Editar tarefa' : '➕ Nova tarefa' }}</div>
    <div class="main-row">
      <input v-model="form.title" class="task-input" placeholder="O que você precisa fazer?" maxlength="180" autofocus />
      <button class="primary-btn" :disabled="saving || uploading">{{ editingTask ? 'Salvar' : 'Adicionar' }}</button>
    </div>
    <div class="quick-fields">
      <label><span>📅 Prazo</span><input v-model="form.dueDate" type="date" /></label>
      <label><span>⭐ Prioridade</span><select v-model="form.priority"><option value="low">Baixa</option><option value="medium">Média</option><option value="high">Alta</option></select></label>
      <label><span>🏷️ Categoria</span><input v-model="form.category" list="categories" placeholder="Geral" /><datalist id="categories"><option>Escola</option><option>Trabalho</option><option>Pessoal</option><option>Estudos</option></datalist></label>
    </div>
    <button type="button" class="advanced-toggle" @click="showAdvanced = !showAdvanced">{{ showAdvanced ? 'Ocultar opções' : 'Mais opções' }}</button>
    <div v-if="showAdvanced" class="advanced">
      <textarea v-model="form.notes" rows="3" placeholder="Observações da tarefa..."></textarea>
      <div class="media-actions">
        <label class="secondary-btn">🖼️ {{ uploading ? 'Enviando...' : 'Adicionar imagem' }}<input type="file" accept="image/*" hidden @change="handleImage" /></label>
        <button type="button" class="secondary-btn" @click="showCamera = !showCamera">📷 Câmera</button>
        <button type="button" class="secondary-btn" @click="useLocation">📍 {{ form.location ? 'Local salvo' : 'Salvar localização' }}</button>
      </div>
      <img v-if="previewUrl || form.img_url" :src="previewUrl || form.img_url" class="preview" alt="Imagem da tarefa" />
      <CameraCapture v-if="showCamera" @captured="handleCameraCapture" />
    </div>
    <button v-if="editingTask" type="button" class="cancel-btn" @click="cancel">Cancelar edição</button>
  </form>
</template>
