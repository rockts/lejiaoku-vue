/**
 * @FileDescription: User router
 * @Author: gaopeng(gaopeng@lekee.cc)
 * @Date: 2021-2-4 22:52
 * @LastEditors: gaopeng(gaopeng@lekee.cc)
 * @LastEditTime: 2021-2-25 12:28
 */

import { RouteRecordRaw } from 'vue-router';
import MyResources from './resources/MyResources.vue';
import UserProfile from './profile/UserProfile.vue';

/**
 * 定义路由
 */
const routes: Array<RouteRecordRaw> = [
    {
        path: '/me/profile',
        name: 'MyProfile',
        component: UserProfile,
        props: { isMyProfile: true },
    },
    {
        path: '/users/:userId',
        name: 'UserProfile',
        component: UserProfile,
        props: true,
    },
    {
        path: '/me/resources',
        name: 'MyResources',
        component: MyResources,
        props: { isMyResources: true },
    },
    {
        path: '/users/:userId/resources',
        name: 'UserResources',
        component: MyResources,
        props: true,
    },
];

export default routes;
