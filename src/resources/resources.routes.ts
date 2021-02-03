/**
 * @FileDescription: Resources router
 * @Author: gaopeng(gaopeng@lekee.cc)
 * @Date: 2021-2-3 19:45
 * @LastEditors: gaopeng(gaopeng@lekee.cc)
 * @LastEditTime: 2021-2-3 21:02
 */

import { RouteRecordRaw } from 'vue-router';
import ResourcesIndex from './index/resources-index.vue';
import ResourcesShow from './show/resources-show.vue';

/**
 * 定义路由
 */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/resources',
    name: 'resourcesIndex',
    component: ResourcesIndex,
  },
  {
    path: '/resources/:resourcesId',
    name: 'resourcesShow',
    component: ResourcesShow,
  },
];

export default routes;
