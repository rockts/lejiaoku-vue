/**
 * @FileDescription: User router
 * @Author: gaopeng(gaopeng@lekee.cc)
 * @Date: 2021-2-4 22:52
 * @LastEditors: gaopeng(gaopeng@lekee.cc)
 * @LastEditTime: 2021-2-4 22:52
 */

import { RouteRecordRaw } from 'vue-router';
import SignIn from './components/sign-in.vue';
import SignUp from './components/sign-up.vue';
import UserLogin from './components/UserLogin.vue';

/**
 * 定义路由
 */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/sign-in',
    name: 'signIn',
    component: SignIn,
    meta: { redirectAlreadyLogin: true },
  },
  {
    path: '/sign-up',
    name: 'signUp',
    component: SignUp,
  },
  {
    path: '/login',
    name: 'UserLogin',
    component: UserLogin,
    meta: { redirectAlreadyLogin: true },
  },
];

export default routes;
