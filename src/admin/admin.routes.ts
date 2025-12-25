/**
 * 管理后台路由
 */
import AdminIndex from './AdminIndex.vue';
import AdminUsers from './AdminUsers.vue';
import AdminResources from './AdminResources.vue';

export default [
    {
        path: '/admin',
        name: 'AdminIndex',
        component: AdminIndex,
    },
    {
        path: '/admin/users',
        name: 'AdminUsers',
        component: AdminUsers,
    },
    {
        path: '/admin/resources',
        name: 'AdminResources',
        component: AdminResources,
    },
];
