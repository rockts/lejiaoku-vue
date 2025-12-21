/**
 * @FileDescription: app router
 * @Author: gaopeng(gaopeng@lekee.cc)
 * @Date: 2021-2-2 20:47
 * @LastEditors: gaopeng(gaopeng@lekee.cc)
 * @LastEditTime: 2021-3-10 14:46
 */
import { createRouter, createWebHistory } from 'vue-router';
import appRoutes from './app.routes';
import postRoutes from '@/post/post.routes';
import classificationsRoutes from '@/classifications/classifications.routes';
import userRoutes from '@/user/user.routes';

/**
 * 创建路由器
 */

const router = createRouter({
    history: createWebHistory(),
    routes: [...appRoutes, ...postRoutes, ...classificationsRoutes, ...userRoutes],
});

// const HAS_LOGINED = false;

/**
 * 导航守卫
 */

// router.beforeEach((to, from, next) => {
//  console.log('👮‍♀️');

//  if (to.name !== 'UserLogin') {
//   if (HAS_LOGINED) next();
//   else next({ name: 'UserLogin' });
//  } else {
//   if (HAS_LOGINED) next({ name: 'Home' });
//   else next();
//  }
// });

export default router;
