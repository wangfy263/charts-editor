import { createRouter, createWebHistory } from 'vue-router';
// 还有 createWebHashHistory 和 createMemoryHistory

import buildPage from '@/view/build/buildPage.vue';
// import buildApplication from '@/view/build/buildApplication.vue';
// import pageList from '@/view/build/appList.vue';
// import preview from '@/view/preview/preview.vue';
// import iframe from '@/view/preview/iframe.vue';
// import iframeApp from '@/view/preview/iframeApp.vue';
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
  ],
});

export default router;
