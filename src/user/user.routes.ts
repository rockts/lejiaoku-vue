/**
 * @FileDescription: User router
 * @Author: gaopeng(gaopeng@lekee.cc)
 * @Date: 2021-2-4 22:52
 * @LastEditors: gaopeng(gaopeng@lekee.cc)
 * @LastEditTime: 2021-2-25 12:28
 */

import { RouteRecordRaw } from 'vue-router';
import SignIn from './components/sign-in.vue';
import SignUp from './components/sign-up.vue';

/**
 * 定义路由
 */
const routes: Array<RouteRecordRaw> = [
 {
  path: '/sign-in',
  name: 'signIn',
  component: SignIn,
 },
 {
  path: '/sign-up',
  name: 'signUp',
  component: SignUp,
 },
];

export default routes;
