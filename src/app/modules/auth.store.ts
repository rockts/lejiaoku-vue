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
    contributorApplicationStatus: 'pending' | 'approved' | 'rejected' | null;
}

export const authStoreModule: Module<AuthStoreState, RootState> = {
    namespaced: true,

    state: {
        token: null,
        user: null,
        isAuthenticated: false,
        contributorApplicationStatus: null,
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
        
        // 贡献者申请状态
        contributorApplicationStatus(state) {
            return state.contributorApplicationStatus;
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
            state.contributorApplicationStatus = null;
        },
        
        // 设置贡献者申请状态
        setContributorApplicationStatus(state, status: 'pending' | 'approved' | 'rejected' | null) {
            state.contributorApplicationStatus = status;
        },

        // 从 localStorage 恢复身份信息
        restoreAuth(state) {
            const token = localStorage.getItem('auth_token');
            const userInfo = localStorage.getItem('user_info');

            if (token && userInfo) {
                try {
                    state.token = token;
                    const parsedUser = JSON.parse(userInfo);
                    console.log('[Auth Store] 从 localStorage 解析的用户数据:', parsedUser);
                    console.log('[Auth Store] parsedUser.nickname:', parsedUser.nickname);
                    console.log('[Auth Store] parsedUser.username:', parsedUser.username);
                    console.log('[Auth Store] parsedUser.avatar_url:', parsedUser.avatar_url);
                    
                    // 直接使用解析后的用户数据，不进行任何转换
                    // 确保所有字段都被保留（包括 avatar_url）
                    state.user = parsedUser;
                    state.isAuthenticated = true;
                    console.log('[Auth Store] 身份信息已恢复，用户对象:', state.user);
                    console.log('[Auth Store] 用户 username:', state.user?.username);
                    console.log('[Auth Store] 用户 nickname:', state.user?.nickname);
                    console.log('[Auth Store] 用户 name:', state.user?.name);
                    console.log('[Auth Store] 用户 avatar_url:', state.user?.avatar_url);
                    
                    // 恢复申请状态
                    const savedStatus = localStorage.getItem('contributor_application_status');
                    if (savedStatus && ['pending', 'approved', 'rejected'].includes(savedStatus)) {
                        state.contributorApplicationStatus = savedStatus as 'pending' | 'approved' | 'rejected';
                        console.log('[Auth Store] 恢复申请状态:', state.contributorApplicationStatus);
                    }
                } catch (error) {
                    console.error('[Auth Store] 恢复身份信息失败:', error);
                    state.token = null;
                    state.user = null;
                    state.isAuthenticated = false;
                    state.contributorApplicationStatus = null;
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
            localStorage.removeItem('contributor_application_status');
            commit('logout');
        },

        // 检查贡献者申请状态
        async checkContributorApplicationStatus({ commit, state, rootState }) {
            if (!state.isAuthenticated || state.user?.role !== 'user') {
                commit('setContributorApplicationStatus', null);
                return;
            }
            
            try {
                const { apiHttpClient } = await import('../../app/app.service');
                const response = await apiHttpClient.get('/api/contributor-applications/my');
                const application = response.data;
                if (application && application.status) {
                    commit('setContributorApplicationStatus', application.status);
                    // 保存到 localStorage
                    localStorage.setItem('contributor_application_status', application.status);
                } else {
                    commit('setContributorApplicationStatus', null);
                    localStorage.removeItem('contributor_application_status');
                }
            } catch (error: any) {
                if (error.response?.status === 404) {
                    commit('setContributorApplicationStatus', null);
                    localStorage.removeItem('contributor_application_status');
                } else {
                    console.error('[Auth Store] 检查申请状态失败:', error);
                }
            }
        },
        
        // 设置贡献者申请状态（用于提交申请后）
        setContributorApplicationStatus({ commit }, status: 'pending' | 'approved' | 'rejected' | null) {
            commit('setContributorApplicationStatus', status);
            if (status) {
                localStorage.setItem('contributor_application_status', status);
            } else {
                localStorage.removeItem('contributor_application_status');
            }
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
