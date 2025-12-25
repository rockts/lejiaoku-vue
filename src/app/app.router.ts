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
import userRoutes from '@/user/user.routes';
import testRoutes from '@/test/test.routes';
import adminRoutes from '@/admin/admin.routes';

/**
 * 创建路由器
 */

const router = createRouter({
    history: createWebHistory(),
    routes: [...appRoutes, ...postRoutes, ...userRoutes, ...testRoutes, ...adminRoutes],
});

/**
 * 路由守卫
 * 保护需要登录的路由
 */
router.beforeEach((to, from, next) => {
  // 需要登录的路由
  const requiresAuth = ['resourceCreate', 'resourceEdit'];
  
  if (requiresAuth.includes(to.name)) {
    // 检查是否已登录
    const token = localStorage.getItem('auth_token');
    const userInfo = localStorage.getItem('user_info');
    
    if (!token || !userInfo) {
      // 未登录，跳转到登录页
      console.log('[Router] 未登录，跳转到登录页');
      // 保存目标路由，登录后可以跳转回来
      next({ 
        path: '/login',
        query: { redirect: to.fullPath }
      });
      return;
    }
  }
  
  next();
});

export default router;
