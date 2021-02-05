/**
 * @FileDescription: app router
 * @Author: gaopeng(gaopeng@lekee.cc)
 * @Date: 2021-2-2 20:47
 * @LastEditors: gaopeng(gaopeng@lekee.cc)
 * @LastEditTime: 2021-2-5 22:12
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

export default router;

/**
 * 导航守卫
 */

// router.beforeEach((to, from, next) => {
//   console.log('👮‍♀️');
//   console.log(to.meta);

//   if (to.meta.requiredLogin && !store.state.user.isLogin) {
//     next({ name: 'signIn' });
//   } else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin) {
//     next('/');
//   } else {
//     next();
//   }
// });
