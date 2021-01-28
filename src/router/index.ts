import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import UserLogin from '../components/UserLogin.vue';
import Resources from '../views/Resources.vue';
import ResourcesDetail from '../views/ResourcesDetail.vue';
import About from '../views/About.vue';
import Test from '../views/Test.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/category/:alias',
    name: 'ResourcesDetail',
    component: ResourcesDetail,
  },
  {
    path: '/test/:id',
    name: 'Test',
    component: Test,
  },
  {
    path: '/login',
    name: 'UserLogin',
    component: UserLogin,
  },
  {
    path: '/res',
    name: 'Resources',
    component: Resources,
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

export default router;
