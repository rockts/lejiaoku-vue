import axios from 'axios';

/**
 * axios 实例
 */
export const apiHttpClient = axios.create({
  baseURL: 'http://localhost:3000',
});
