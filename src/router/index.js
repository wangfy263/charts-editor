import { createRouter, createWebHistory } from 'vue-router';
// θΏζ createWebHashHistory ε createMemoryHistory

import buildPage from '@/view/build/buildPage.vue';
import buildPage1 from '@/view/build/buildPage1.vue';
import editorBig from '@/view/editorBig/designer-big.vue';

const base = import.meta.env.BASE_URL;
const router = createRouter({
  history: createWebHistory(base),
  routes: [
    {
      path: '/',
      redirect: '/page'
    },
    {
      path: '/page',
      component: buildPage,
      // component: () => import('../view/build/buildPage.vue'),
    },
    {
      path: '/page1',
      component: buildPage1,
      // component: () => import('../view/build/buildPage.vue'),
    },
    {
      path: '/big',
      component: editorBig,
      // component: () => import('../view/build/buildPage.vue'),
    },
  ],
});

export default router;
