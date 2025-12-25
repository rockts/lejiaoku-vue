import { Module } from 'vuex';
import { RootState } from '../../app/app.store';

export interface AuthUser {
    id?: string | number;
    username?: string;
    nickname?: string;
    name?: string; // 保留以兼容旧数据
    email?: string;
    role: 'user' | 'contributor' | 'editor' | 'admin';
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

        // 统一权限判断方法
        isUser(state) {
            return state.user?.role === 'user';
        },

        isContributor(state) {
            return state.user?.role === 'contributor';
        },

        isEditor(state) {
            return state.user?.role === 'editor';
        },

        isAdmin(state) {
            return state.user?.role === 'admin';
        },

        // 兼容旧代码
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
                    console.log('[Auth Store] 身份信息已恢复，用户对象:', state.user);
                    console.log('[Auth Store] 用户 username:', state.user?.username);
                    console.log('[Auth Store] 用户 nickname:', state.user?.nickname);
                    console.log('[Auth Store] 用户 name:', state.user?.name);
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

        // 检查用户是否可以编辑资源
        // 参数：resource.user_id
        canEditResource({ state }, userId: string | number) {
            if (!state.isAuthenticated) {
                return false;
            }
            // admin、editor 或资源创建者可以编辑
            return (
                state.user?.role === 'admin' ||
                state.user?.role === 'editor' ||
                state.user?.id === userId
            );
        },

        // 检查用户是否可以删除资源
        // 参数：resource.user_id
        canDeleteResource({ state }, userId: string | number) {
            if (!state.isAuthenticated) {
                return false;
            }
            // admin 永远可以删除
            if (state.user?.role === 'admin') {
                return true;
            }
            // 非 admin 仅当是资源创建者时可以删除
            return state.user?.id === userId;
        },
    },
};
