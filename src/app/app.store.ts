/**
 * @FileDescription: app store
 * @Author: gaopeng(gaopeng@lekee.cc)
 * @Date: 2021-2-1 11:52
 * @LastEditors: gaopeng(gaopeng@lekee.cc)
 * @LastEditTime: 2021-2-4 11:23
 */

import { createStore } from 'vuex';
import { postStoreModule } from '../post/post.store';
import { userStoreModule } from '../user/user.store';

/**
 * 创建 Store
 */
const store = createStore({
  state: {
    appName: '乐教库',
  },

  modules: {
    post: postStoreModule,
    user: userStoreModule,
  },
});

/**
 * 默认导出
 */
export default store;
