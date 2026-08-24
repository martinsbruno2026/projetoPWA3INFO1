<template>
  <div class="about">
    <h2>Sobre o aplicativo</h2>
    <p>
      Este é um gerenciador de tarefas desenvolvido como Progressive Web App
      (PWA) utilizando Vue.js 3 e Vite.
    </p>
    <p>
      O aplicativo funciona offline, pode ser instalado no seu dispositivo e
      carrega rapidamente mesmo em conexões lentas.
    </p>

    <h3>Tecnologias utilizadas</h3>
    <ul>
      <li>Vue.js 3 com Composition API</li>
      <li>Vite como ferramenta de build</li>
      <li>Vue Router para navegação</li>
      <li>vite-plugin-pwa para suporte a PWA</li>
      <li>Workbox para gerenciamento de cache</li>
    </ul>
  </div>
</template>

<style scoped>
.about {
  line-height: 1.6;
}

.about h2 {
  font-size: 1.3rem;
  color: #4a90d9;
  margin-bottom: 12px;
}

.about h3 {
  font-size: 1.1rem;
  margin-top: 20px;
  margin-bottom: 8px;
}

.about p {
  margin-bottom: 12px;
  color: #555;
}

.about ul {
  padding-left: 20px;
}

.about li {
  margin-bottom: 6px;
  color: #555;
}
</style>
