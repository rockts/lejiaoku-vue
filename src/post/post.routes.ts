/**
 * @FileDescription: Resources router
 * @Author: gaopeng(gaopeng@lekee.cc)
 * @Date: 2021-2-3 19:45
 * @LastEditors: gaopeng(gaopeng@lekee.cc)
 * @LastEditTime: 2021-3-11 13:58
 */

import { RouteRecordRaw } from 'vue-router';
import PostIndex from './index/PostIndex.vue';
import PostShow from './show/PostShow.vue';
import PostCreate from './create/PostCreate.vue';

/**
 * 定义路由
 */
const routes: Array<RouteRecordRaw> = [
    {
        path: '/resources',
        name: 'resourceIndex',
        component: PostIndex,
    },
    {
        path: '/resources/:id',
        name: 'resourceShow',
        component: PostShow,
        props: true,
    },
    {
        path: '/resources/create',
        name: 'resourceCreate',
        component: PostCreate,
    },
    // 历史兼容重定向
    {
        path: '/posts',
        redirect: '/resources',
    },
    {
        path: '/posts/:id',
        redirect: (to) => ({ path: `/resources/${to.params.id}` }),
    },
    {
        path: '/posts/create',
        redirect: '/resources/create',
    },
    // Admin 历史路径重定向
    {
        path: '/admin/resources',
        redirect: '/resources',
    },
    {
        path: '/admin/resources/:id',
        redirect: (to) => ({ path: `/resources/${to.params.id}` }),
    },
];

export default routes;
