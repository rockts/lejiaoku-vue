import { Module } from 'vuex';
import { RootState } from '../../app/app.store';

export interface AuthUser {
    id?: string | number;
    username: string;
    role: 'user' | 'admin';
}

export interface AuthStoreState {
    token: string | null;
    user: AuthUser | null;
    isAuthenticated: boolean;
}

export const authStoreModule: Module<AuthStoreState, RootState> = {
    namespaced: true,

    state: {
        token: null,
        user: null,
        isAuthenticated: false,
    } as AuthStoreState,

    getters: {
        token(state) {
            return state.token;
        },

        user(state) {
            return state.user;
        },

        isAuthenticated(state) {
            return state.isAuthenticated;
        },

        isAdmin(state) {
            return state.user?.role === 'admin';
        },

        username(state) {
            return state.user?.username || '';
        },
    },

    mutations: {
        setToken(state, token: string | null) {
            state.token = token;
            state.isAuthenticated = !!token;
        },

        setUser(state, user: AuthUser | null) {
            state.user = user;
        },

        logout(state) {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
        },

        // 从 localStorage 恢复身份信息
        restoreAuth(state) {
            const token = localStorage.getItem('auth_token');
            const userInfo = localStorage.getItem('user_info');

            if (token && userInfo) {
                try {
                    state.token = token;
                    state.user = JSON.parse(userInfo);
                    state.isAuthenticated = true;
                    console.log('[Auth Store] 身份信息已恢复，用户:', state.user?.username);
                } catch (error) {
                    console.error('[Auth Store] 恢复身份信息失败:', error);
                    state.token = null;
                    state.user = null;
                    state.isAuthenticated = false;
                }
            }
        },
    },

    actions: {
        // 初始化认证状态（应用启动时调用）
        initAuth({ commit }) {
            commit('restoreAuth');
        },

        // 登出
        logout({ commit }) {
            console.log('[Auth Store] 执行登出');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_info');
            commit('logout');
        },

        // 检查用户是否是资源创建者或管理员
        canEditResource({ state }, creatorId: string | number) {
            if (!state.isAuthenticated) {
                return false;
            }
            // 管理员或资源创建者可以编辑
            return state.user?.role === 'admin' || state.user?.id === creatorId;
        },

        // 检查用户是否是资源创建者或管理员
        canDeleteResource({ state }, creatorId: string | number) {
            if (!state.isAuthenticated) {
                return false;
            }
            // 管理员或资源创建者可以删除
            return state.user?.role === 'admin' || state.user?.id === creatorId;
        },
    },
};
