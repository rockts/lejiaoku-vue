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
import adminRoutes from '@/admin/admin.routes';
import catalogRoutes from '@/catalog/catalog.routes';

/**
 * 创建路由器
 */

const router = createRouter({
    history: createWebHistory(),
  routes: [
    ...appRoutes, 
    ...postRoutes, 
    ...userRoutes, 
    ...adminRoutes,
    ...catalogRoutes,
    // 404 处理：所有未匹配的路由都跳转到首页
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
});

/**
 * 路由守卫
 * 保护需要登录的路由
 */
router.beforeEach((to, from, next) => {
  // 需要登录的路由
  const requiresAuth = ['resourceCreate', 'resourceEdit'];

  // 需要 admin 权限的路由
  const requiresAdmin = to.path.startsWith('/admin');

  // user 角色受限的路由
  const restrictedForUser = ['resourceCreate'];

  // 获取用户信息（从 store 或 localStorage）
  const token = localStorage.getItem('auth_token');
  const userInfo = localStorage.getItem('user_info');
  let user = null;

  if (userInfo) {
    try {
      user = JSON.parse(userInfo);
    } catch (error) {
      console.error('[Router] 解析用户信息失败:', error);
    }
  }

  // 如果已登录用户访问登录页，重定向到首页
  if (to.path === '/login' && token && user) {
    console.log('[Router] 已登录用户访问登录页，重定向到首页');
    next({ path: '/' });
    return;
  }

  // 检查登录状态
  if (to.name && requiresAuth.includes(to.name as string)) {
    if (!token || !userInfo || !user) {
      // 未登录，跳转到登录页
      console.log('[Router] 未登录，跳转到登录页');
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
      return;
    }

    // 检查 user 角色访问受限路由
    if (user.role === 'user' && restrictedForUser.includes(to.name as string)) {
      console.log('[Router] user 角色无权限访问，跳转首页');
      const { notification } = require('@/utils/notification');
      notification.warning('无权限');
      next({ path: '/' });
      return;
    }
  }

  // 检查 admin 权限
  if (requiresAdmin) {
    // 未登录，跳转首页
    if (!token || !userInfo || !user) {
      console.log('[Router] 未登录，跳转首页');
      next({ path: '/' });
      return;
    }

    // 检查是否为 admin
    if (user.role !== 'admin') {
      console.log('[Router] 非 admin 用户，跳转首页');
      const { notification } = require('@/utils/notification');
      notification.warning('无权限');
      next({ path: '/' });
      return;
    }
  }

  // 检查路由是否存在（避免显示加载中）
  const matched = router.resolve(to.path).matched;
  if (matched.length === 0 && to.path !== '/') {
    console.log('[Router] 路由不存在，跳转首页:', to.path);
    next({ path: '/' });
    return;
  }

  next();
});

export default router;
