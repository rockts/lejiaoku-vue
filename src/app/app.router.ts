/**
 * @FileDescription: app router
 * @Author: gaopeng(gaopeng@lekee.cc)
 * @Date: 2021-2-2 20:47
 * @LastEditors: gaopeng(gaopeng@lekee.cc)
 * @LastEditTime: 2021-2-22 04:38
 */
import { createRouter, createWebHistory } from 'vue-router';
import appRoutes from './app.routes';
import postRoutes from '@/post/post.routes';
import categoryRoutes from '@/category/category.routes';
import userRoutes from '@/user/user.routes';

/**
 * 创建路由器
 */

const router = createRouter({
 history: createWebHistory(),
 routes: [...appRoutes, ...postRoutes, ...categoryRoutes, ...userRoutes],
});

// const HAS_LOGINED = true;

/**
 * 导航守卫
 */

// router.beforeEach((to, from, next) => {
//   console.log('👮‍♀️');

//   if (to.name !== 'signIn') {
//     if (HAS_LOGINED) next();
//     else next({ name: 'signIn' });
//   } else {
//     if (HAS_LOGINED) next({ name: 'Home' });
//     else next();
//   }
// });

export default router;
