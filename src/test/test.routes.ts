import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/test-api',
        name: 'TestApi',
        component: () => import('./TestApi.vue'),
        meta: {
            title: 'API 测试',
        },
    },
];

export default routes;
