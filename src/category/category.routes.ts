/**
 * @FileDescription: Categorys router
 * @Author: gaopeng(gaopeng@lekee.cc)
 * @Date: 2021-2-4 16:02
 * @LastEditors: gaopeng(gaopeng@lekee.cc)
 * @LastEditTime: 2021-2-4 16:02
 */

import { RouteRecordRaw } from 'vue-router';
import CategoryIndex from './category-index.vue';
import CategoryShow from './category-show.vue';

/**
 * 定义路由
 */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/categorys',
    name: 'categoryIndex',
    component: CategoryIndex,
  },
  {
    path: '/categorys/:categoryId',
    name: 'categoryShow',
    component: CategoryShow,
  },
];

export default routes;
