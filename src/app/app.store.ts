/**
 * @FileDescription: app store
 * @Author: gaopeng(gaopeng@lekee.cc)
 * @Date: 2021-2-1 11:52
 * @LastEditors: gaopeng(gaopeng@lekee.cc)
 * @LastEditTime: 2021-2-10 02:26
 */

import { createStore } from 'vuex';
import { postStoreModule, PostStoreState } from '../post/post.store';
import { userStoreModule } from '../user/user.store';
import { categoryStoreModule } from '../category/category.store';

export interface RootState {
 appName: string;
 post: PostStoreState;
}

/**
 * 创建 Store
 */
const store = createStore({
 state: {
  appName: '乐教库',
 } as RootState,

 modules: {
  post: postStoreModule,
  user: userStoreModule,
  category: categoryStoreModule,
 },
});

/**
 * 默认导出
 */
export default store;
