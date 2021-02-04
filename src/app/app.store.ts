/**
 * @FileDescription: app store
 * @Author: gaopeng(gaopeng@lekee.cc)
 * @Date: 2021-2-1 11:52
 * @LastEditors: gaopeng(gaopeng@lekee.cc)
 * @LastEditTime: 2021-2-4 11:23
 */

import { createStore } from 'vuex';
import user from '@/user/user.store';

/**
 * 创建 Store
 */
export default createStore({
  state: {},
  mutations: {},

  actions: {},
  modules: {
    user,
  },
});
