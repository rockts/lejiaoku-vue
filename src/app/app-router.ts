import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/home/Home.vue';
import UserLogin from '@/components/UserLogin.vue';
import Categorys from '@/views/Categorys.vue';
import CategoryDetail from '@/views/CategoryDetail.vue';
import CreateResources from '@/views/CreateResources.vue';
import ResourcesDetail from '@/resources/ResourcesDetail.vue';
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
    component: Categorys,
  },
  {
    path: '/category/:id',
    name: 'CategoryDetail',
    component: CategoryDetail,
  },
  {
    path: '/resources/:id',
    name: 'ResourcesDetail',
    component: ResourcesDetail,
  },
  {
    path: '/create',
    name: 'Create',
    component: CreateResources,
    meta: { requiredLogin: true },
  },
  {
    path: '/test',
    name: 'Test',
    component: Test,
  },
  {
    path: '/test/:id',
    name: 'TestID',
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
