/**
 * @FileDescription: app store
 * @Author: gaopeng(gaopeng@lekee.cc)
 * @Date: 2021-2-1 11:52
 * @LastEditors: gaopeng(gaopeng@lekee.cc)
 * @LastEditTime: 2021-3-10 14:39
 */

import { createStore } from 'vuex';
import { postStoreModule, PostStoreState } from '../post/post.store';
import { userStoreModule } from '../user/user.store';
import { authStoreModule, AuthStoreState } from './modules/auth.store';

export interface RootState {
    appName: string;
    post: PostStoreState;
    auth: AuthStoreState;
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
        auth: authStoreModule,
    },
});

// 应用启动时恢复认证状态
store.dispatch('auth/initAuth');

/**
 * 默认导出
 */
export default store;
