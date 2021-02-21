import { RouteRecordRaw } from 'vue-router';
import Home from '@/app/components/Home.vue';
import About from '@/app/components/About.vue';

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
  path: '/about',
  name: 'About',
  component: About,
 },
];

/**
 * 默认导出
 */
export default routes;
