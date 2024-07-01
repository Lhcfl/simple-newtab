import { createRouter, createWebHashHistory } from 'vue-router';
import NewPage from '@/pages/NewPage.vue';
import { storage } from '@/store';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: storage.defaultHome.value.startsWith('/bookmarks')
        ? storage.defaultHome.value
        : '/local',
    },
    {
      path: '/bookmarks/:id',
      name: 'bookmark',
      component: NewPage,
      props: (route) => ({
        source: 'bookmark',
        id: route.params.id,
      }),
    },
    {
      path: '/local',
      name: 'local',
      component: NewPage,
      props: {
        source: 'local',
      },
    },
  ],
});

router.beforeEach((to) => {
  if (to.path !== '/') storage.defaultHome.value = to.path;
  return true;
});

export default router;
