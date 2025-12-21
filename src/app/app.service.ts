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
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
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
