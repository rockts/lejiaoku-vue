/**
 * @FileDescription: app router
 * @Author: gaopeng(gaopeng@lekee.cc)
 * @Date: 2021-2-2 20:47
 * @LastEditors: gaopeng(gaopeng@lekee.cc)
 * @LastEditTime: 2021-2-3
 */

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/home/Home.vue';
import About from '@/views/About.vue';
import resourcesRoutes from '@/resources/resources.routes';
import UserLogin from '@/app/components/UserLogin.vue';
import Categorys from '@/views/Categorys.vue';
import CategoryDetail from '@/views/CategoryDetail.vue';
import CreateResources from '@/views/CreateResources.vue';
import ResourcesDetail from '@/resources/ResourcesDetail.vue';
import Test from '@/views/Test.vue';
import store from '@/app/app-store';
import signIn from '@/app/components/sign-in.vue';
import signUp from '@/app/components/sign-up.vue';

/**
 * 定义路由
 */
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
    path: '/sign-in',
    name: 'signIn',
    component: signIn,
  },
  {
    path: '/sign-up',
    name: 'signUp',
    component: signUp,
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
  ...resourcesRoutes,
];

/**
 * 创建路由器
 */

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
