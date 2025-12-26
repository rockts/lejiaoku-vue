/**
 * 教材目录路由
 */
import { RouteRecordRaw } from 'vue-router';
import CatalogIndex from './CatalogIndex.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/catalog',
        name: 'catalogIndex',
        component: CatalogIndex,
    },
    // 别名：/textbooks 也指向教材目录页
    {
        path: '/textbooks',
        redirect: '/catalog',
    },
];

export default routes;

