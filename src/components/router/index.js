import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Registros' },
  },
  {
    path: '/registro/:id',
    name: 'registro-detalhe',
    component: () => import('@/views/RegistroDetalheView.vue'),
    meta: { title: 'Detalhes' },
  },
  {
    path: '/registro/:id/editar',
    name: 'registro-editar',
    component: () => import('@/views/RegistroEditarView.vue'),
    meta: { title: 'Editar' },
  },
  {
    path: '/novo',
    name: 'registro-novo',
    component: () => import('@/views/RegistroNovoView.vue'),
    meta: { title: 'Novo Registro' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;