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
  path: '/posts',
  name: 'postIndex',
  component: PostIndex,
 },
 {
  path: '/posts/:postId',
  name: 'postShow',
  component: PostShow,
  props: true,
 },
 {
  path: '/posts/create',
  name: 'postCreate',
  component: PostCreate,
 },
];

export default routes;
