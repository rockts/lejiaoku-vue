/**
 * @FileDescription: Classifications router
 * @Author: gaopeng(gaopeng@lekee.cc)
 * @Date: 2021-2-4 16:02
 * @LastEditors: gaopeng(gaopeng@lekee.cc)
 * @LastEditTime: 2021-3-10 10:46
 */

import { RouteRecordRaw } from 'vue-router';
import ClassificationsIndex from './index/ClassificationsIndex.vue';
import ClassificationsShow from './show/ClassificationsShow.vue';

/**
 * 定义路由
 */
const routes: Array<RouteRecordRaw> = [
      {
            path: '/classifications',
            name: 'classificationsIndex',
            component: ClassificationsIndex,
      },
      {
            path: '/classifications/dd',
            name: 'classificationsShow',
            component: ClassificationsShow,
            props: true,
      },
];

export default routes;
