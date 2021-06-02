import { createRouter, createWebHistory } from 'vue-router';
// 还有 createWebHashHistory 和 createMemoryHistory

import buildPage from '@/view/build/buildPage.vue';
import buildPage1 from '@/view/build/buildPage1.vue';
import designerBig from '@/view/build/designer-big.vue';

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
      component: designerBig,
      // component: () => import('../view/build/buildPage.vue'),
    },
  ],
});

export default router;
