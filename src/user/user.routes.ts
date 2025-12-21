/**
 * @FileDescription: User router
 * @Author: gaopeng(gaopeng@lekee.cc)
 * @Date: 2021-2-4 22:52
 * @LastEditors: gaopeng(gaopeng@lekee.cc)
 * @LastEditTime: 2021-2-25 12:28
 */

import { RouteRecordRaw } from 'vue-router';
import UserLogin from './login/user-login.vue';
import UserRegister from './register/user-register.vue';

/**
 * 定义路由
 */
const routes: Array<RouteRecordRaw> = [
 {
  path: '/login',
  name: 'UserLogin',
  component: UserLogin,
 },
 {
  path: '/register',
  name: 'UserRegister',
  component: UserRegister,
 },
];

export default routes;
