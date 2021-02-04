/**
 * @FileDescription: Categorys router
 * @Author: gaopeng(gaopeng@lekee.cc)
 * @Date: 2021-2-4 16:02
 * @LastEditors: gaopeng(gaopeng@lekee.cc)
 * @LastEditTime: 2021-2-4 16:02
 */

import { RouteRecordRaw } from 'vue-router';
import CategorysIndex from './categorys-index.vue';
import CategorysShow from './categorys-show.vue';

/**
 * 定义路由
 */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/categorys',
    name: 'categorysIndex',
    component: CategorysIndex,
  },
  {
    path: '/category/:categoryId',
    name: 'categorysShow',
    component: CategorysShow,
  },
];

export default routes;
