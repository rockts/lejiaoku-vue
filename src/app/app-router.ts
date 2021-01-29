import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import UserLogin from '@/components/UserLogin.vue';
import Resources from '@/views/Resources.vue';
import ResourcesDetail from '@/views/ResourcesDetail.vue';
import CreateResources from '@/views/CreateResources.vue';
import About from '@/views/About.vue';
import Test from '@/views/Test.vue';
import store from '@/app/app-store';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/categorys',
    name: 'Catagorys',
    component: Resources,
  },
  {
    path: '/category/:id',
    name: 'CategoryDetail',
    component: ResourcesDetail,
  },
  {
    path: '/create',
    name: 'Create',
    component: CreateResources,
    meta: { requiredLogin: true },
  },
  {
    path: '/test/:id',
    name: 'Test',
    component: Test,
  },
  {
    path: '/login',
    name: 'login',
    component: UserLogin,
    meta: { redirectAlreadyLogin: true },
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  console.log(to.meta);

  if (to.meta.requiredLogin && !store.state.user.isLogin) {
    next({ name: 'login' });
  } else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin) {
    next('/');
  } else {
    next();
  }
});

export default router;
