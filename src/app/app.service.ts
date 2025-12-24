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
    return Promise.reject(error);
  }
);
