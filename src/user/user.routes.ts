/**
 * @FileDescription: User router
 * @Author: gaopeng(gaopeng@lekee.cc)
 * @Date: 2021-2-4 22:52
 * @LastEditors: gaopeng(gaopeng@lekee.cc)
 * @LastEditTime: 2021-2-25 12:28
 */

import { RouteRecordRaw } from 'vue-router';
import MyResources from './resources/MyResources.vue';

/**
 * 定义路由
 */
const routes: Array<RouteRecordRaw> = [
    {
        path: '/me/resources',
        name: 'MyResources',
        component: MyResources,
    },
];

export default routes;
