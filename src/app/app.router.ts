/**
 * @FileDescription: app router
 * @Author: gaopeng(gaopeng@lekee.cc)
 * @Date: 2021-2-2 20:47
 * @LastEditors: gaopeng(gaopeng@lekee.cc)
 * @LastEditTime: 2021-2-3 21:02
 */

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/home/Home.vue';
import About from '@/app/components/About.vue';
import resourcesRoutes from '@/resources/resources.routes';
import categorysRoutes from '@/categorys/categorys.routes';
import UserLogin from '@/app/components/UserLogin.vue';
import CreateResources from '@/resources/CreateResources.vue';
import Test from '@/app/Test.vue';
import store from '@/app/app.store';
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
    meta: { redirectAlreadyLogin: true },
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
  ...categorysRoutes,
];

/**
 * 创建路由器
 */

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
 * 导航守卫
 */

router.beforeEach((to, from, next) => {
  console.log('👮‍♀️');
  console.log(to.meta);

  if (to.meta.requiredLogin && !store.state.user.isLogin) {
    next({ name: 'signIn' });
  } else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin) {
    next('/');
  } else {
    next();
  }
});

export default router;
