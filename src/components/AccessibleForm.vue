<script setup>
import { ref } from 'vue';

const titulo = ref('');
const duracao = ref('');
const erros = ref({});

function validar() {
  erros.value = {};
  if (!titulo.value.trim()) {
    erros.value.titulo = 'Informe o título da atividade.';
  }
  if (!duracao.value || Number(duracao.value) <= 0) {
    erros.value.duracao = 'Informe uma duração válida (em minutos).';
  }
  return Object.keys(erros.value).length === 0;
}

function salvar() {
  if (validar()) {
    // lógica de salvar
  }
}
</script>

<template>
  <form @submit.prevent="salvar" class="form" novalidate>
    <div class="field">
      <label for="titulo" class="label">Título da atividade</label>
      <input
        id="titulo"
        v-model="titulo"
        type="text"
        class="input"
        :class="{ 'input-error': erros.titulo }"
        :aria-invalid="!!erros.titulo"
        :aria-describedby="erros.titulo ? 'titulo-erro' : undefined"
        placeholder="Ex.: Estudo de Vue.js"
      />
      <p v-if="erros.titulo" id="titulo-erro" class="error-msg" role="alert">
        {{ erros.titulo }}
      </p>
    </div>

    <div class="field">
      <label for="duracao" class="label">Duração (minutos)</label>
      <input
        id="duracao"
        v-model="duracao"
        type="number"
        inputmode="numeric"
        class="input"
        :class="{ 'input-error': erros.duracao }"
        :aria-invalid="!!erros.duracao"
        :aria-describedby="erros.duracao ? 'duracao-erro' : undefined"
        placeholder="Ex.: 30"
      />
      <p v-if="erros.duracao" id="duracao-erro" class="error-msg" role="alert">
        {{ erros.duracao }}
      </p>
    </div>

    <button type="submit" class="btn-submit">Salvar</button>
  </form>
</template>

<style scoped>
.form {
  padding: 16px;
}

.field {
  margin-bottom: 16px;
}

.label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
}

.input {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  min-height: 44px;
}

.input:focus {
  outline: 2px solid #0b5cff;
  outline-offset: 2px;
  border-color: #0b5cff;
}

.input-error {
  border-color: #c62828;
}

.input-error:focus {
  outline-color: #c62828;
}

.error-msg {
  color: #c62828;
  font-size: 0.85rem;
  margin-top: 4px;
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background: #0b5cff;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  min-height: 48px;
  cursor: pointer;
}

.btn-submit:focus-visible {
  outline: 2px solid #0b5cff;
  outline-offset: 2px;
}
</style>