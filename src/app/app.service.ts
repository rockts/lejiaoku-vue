import axios from 'axios';
import { API_BASE_URL } from './app.config';

/**
 * axios 实例
 */

export const apiHttpClient = axios.create({
  // 如果 API_BASE_URL 未设置，使用空字符串（相对路径），通过代理转发
  baseURL: API_BASE_URL || '',
});

/**
 * 请求拦截器
 */
apiHttpClient.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token 并添加到请求头
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[APIClient] 已添加 Authorization 头');
    }
    // 确保 API 请求设置正确的 Accept 头，以便代理能正确识别
    if (!config.headers.Accept) {
      config.headers.Accept = 'application/json';
    }
    return config;
  },
  (error) => {
    console.error('[APIClient] 请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
apiHttpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 处理 401 未授权错误
    if (error.response?.status === 401) {
      console.log('[APIClient] 401 未授权，清除登录态并跳转登录');
      // 清除本地存储的 token 和用户信息
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
      localStorage.removeItem('token');
      // 触发自定义事件，通知 App 组件清除 store 状态
      window.dispatchEvent(new CustomEvent('auth:logout'));
      // 跳转到登录页
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    // 处理 403 无权限错误
    else if (error.response?.status === 403) {
      console.log('[APIClient] 403 无权限');
      // 检查是否是资源上传相关的接口，这些接口的错误会在组件中处理
      const url = error.config?.url || '';
      const isResourceUploadRelated = url.includes('/api/resources') && 
        (url.includes('/auto-parse') || url.includes('/bind-textbook'));
      
      // 如果是资源上传相关的接口，不在全局拦截器中显示错误，让组件自己处理
      if (!isResourceUploadRelated) {
        const { notification } = require('@/utils/notification');
        notification.error('无权限');
      }
    }
    return Promise.reject(error);
  }
);
