import { createRouter, createWebHistory } from 'vue-router';
import NewPage from '@/pages/NewPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: NewPage,
    },
  ],
});

export default router;
