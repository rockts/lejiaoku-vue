import { RouteRecordRaw } from 'vue-router';
import Home from '@/home/Home.vue';
import About from '@/app/components/About.vue';
import Test from '@/app/Test.vue';

/**
 * 定义路由
 */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/test',
    name: 'Test',
    component: Test,
  },
  {
    path: '/test/:id',
    name: 'TestID',
    component: Test,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
];

/**
 * 默认导出
 */
export default routes;
