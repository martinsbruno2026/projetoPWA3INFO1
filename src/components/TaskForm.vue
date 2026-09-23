<template>
  <form class="task-form" @submit.prevent="handleSubmit">
    <div class="task-row">
      <input
        v-model="newTask"
        type="text"
        placeholder="Nova tarefa..."
        class="task-input"
      />
      <button type="submit" class="task-button" :disabled="uploading">
        {{ editingTask ? 'Alterar' : 'Adicionar' }}
      </button>
      <button
        v-if="editingTask"
        type="button"
        class="task-button-cancel"
        @click="handleCancel"
      >
        Cancelar
      </button>
    </div>

   <div class="image-section">
  <img
    v-if="previewUrl || editingTask?.img_url"
    :src="previewUrl || editingTask?.img_url"
    class="image-preview"
    alt="Imagem da tarefa"
  />
  <label class="image-label" :class="{ disabled: uploading }">
    <span v-if="uploading" class="upload-status">Enviando...</span>
    <span v-else>
      {{ previewUrl || editingTask?.img_url
        ? 'Trocar imagem'
        : 'Adicionar imagem'
      }}
    </span>
    <input
      type="file"
      accept="image/jpeg,image/png"
      capture="environment"
      class="image-input"
      :disabled="uploading"
      @change="handleImageChange"
    />
  </label>
  <p class="image-help">
    Em celular, o botão pode abrir a câmera.
    Em notebook, abre o seletor de arquivos.
  </p>
</div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'
import tasksApi from '../api/tasksApi.js'

const props = defineProps({
  editingTask: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['add', 'update', 'cancel'])
const newTask = ref('')
const previewUrl = ref(null)
const imgAttachmentKey = ref(null)
const uploading = ref(false)

watch(
  () => props.editingTask,
  (task) => {
    newTask.value = task ? task.title : '';
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
    imgAttachmentKey.value = null;
  },
);

async function handleImageChange(event) {
  const file = event.target.files[0]
  if (!file) return 
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = URL.createObjectURL(file)
 
  
  
  uploading.value = true
  try {
    const response = await tasksApi.uploadImage(file)
    imgAttachmentKey.value = response.data.attachment_key
  } catch (err) {
    console.error('Erro ao fazer upload da imagem', err)
    previewUrl.value = null
    imgAttachmentKey.value = null
  } finally {
    uploading.value = false
  }
}

function handleSubmit() {
  if (!newTask.value.trim()) return
  if (props.editingTask) {
    emit(
      'update',
      props.editingTask.id,
      newTask.value.trim(),
      imgAttachmentKey.value
    )
      if (props.editingTask) {
    emit('update', props.editingTask.id, payload);
  } else {
    emit('add', payload);
  }
  } else {
    emit( 'add', newTask.value.trim() )
  }
  newTask.value = ''
  previewUrl.value = null
  imgAttachmentKey.value = null
}

function handleCancel() {
  newTask.value = '';
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = null;
  imgAttachmentKey.value = null;
  emit('cancel');
}
</script>

<style scoped>
.task-form {
  margin-bottom: 24px;
}

.task-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.task-input {
  flex: 1;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.task-input:focus {
  border-color: #4a90d9;
}

.task-button {
  padding: 12px 20px;
  background-color: #4a90d9;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.task-button:hover:not(:disabled) {
  background-color: #357abd;
}

.task-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.task-button-cancel {
  padding: 12px 16px;
  background-color: transparent;
  color: #666;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.2s;
}

.task-button-cancel:hover {
  border-color: #aaa;
}

.image-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px dashed #ccc;
}

.image-preview {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ddd;
  flex-shrink: 0;
}

.image-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: white;
  border: 1.5px solid #4a90d9;
  color: #4a90d9;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.image-label:hover:not(.disabled) {
  background: #eaf2fb;
}

.image-label.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.image-input {
  display: none;
}

.upload-status {
  color: #888;
}
</style>

