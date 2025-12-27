/**
 * 教材目录路由
 */
import { RouteRecordRaw } from 'vue-router';
import CatalogIndex from './CatalogIndex.vue';
import CatalogUnits from './CatalogUnits.vue';
import CatalogUnitResources from './CatalogUnitResources.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/catalog',
        name: 'catalogIndex',
        component: CatalogIndex,
    },
    {
        path: '/catalog/:catalogId',
        name: 'catalogUnits',
        component: CatalogUnits,
        props: true,
    },
    {
        path: '/catalog/:catalogId/unit/:unit',
        name: 'catalogUnitResources',
        component: CatalogUnitResources,
        props: true,
    },
    // 别名：/textbooks 也指向教材目录页
    {
        path: '/textbooks',
        redirect: '/catalog',
    },
];

export default routes;

