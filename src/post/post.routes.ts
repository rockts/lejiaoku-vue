/**
 * @FileDescription: Resources router
 * @Author: gaopeng(gaopeng@lekee.cc)
 * @Date: 2021-2-3 19:45
 * @LastEditors: gaopeng(gaopeng@lekee.cc)
 * @LastEditTime: 2021-2-3 21:02
 */

import { RouteRecordRaw } from 'vue-router';
import PostIndex from './index/post-index.vue';
import PostShow from './show/post-show.vue';
import PostCreate from './create/post-create.vue';

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
