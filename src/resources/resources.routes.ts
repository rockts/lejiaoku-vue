/**
 * @FileDescription: Resources router
 * @Author: gaopeng(gaopeng@lekee.cc)
 * @Date: 2021-2-3 19:45
 * @LastEditors: gaopeng(gaopeng@lekee.cc)
 * @LastEditTime: 2021-2-3
 */

import { RouteRecordRaw } from 'vue-router';
import ResourcesIndex from './index/resources-index.vue';

/**
 * 定义路由
 */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/resources',
    name: 'resourcesIndex',
    component: ResourcesIndex,
  },
];

export default routes;
