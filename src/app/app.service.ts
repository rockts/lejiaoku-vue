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
// axios.interceptors.request.use(
//   (config) => {
//     console.log('axios 请求拦截器', config);

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

/**
 * 响应拦截器
 */
// axios.interceptors.response.use(
//   (response) => {
//     console.log('axios 响应拦截器', response);

//     return response;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
