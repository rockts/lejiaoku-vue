import axios from 'axios';
import { API_BASE_URL } from './app.config';

/**
 * axios 实例
 */

export const apiHttpClient = axios.create({
  baseURL: API_BASE_URL,
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
    return Promise.reject(error);
  }
);
