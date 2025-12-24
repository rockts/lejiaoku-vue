import { Module } from 'vuex';
import { apiHttpClient } from '../../app/app.service';
import { RootState } from '../../app/app.store';

export interface Post {
    id: number;
    title: string;
    description: string;
    grade: string;
    subject: string;
    version: string;
    category: string;
    created_at: Date;
    updated_at: Date;
    file?: string;
}

export interface PostShowStoreState {
    loading: boolean;
    resource: Post;
}

export const postShowStoreModule: Module<PostShowStoreState, RootState> = {
    namespaced: true,

    state: {
        loading: false,
        resource: {},
    } as PostShowStoreState,

    getters: {
        loading(state) {
            return state.loading;
        },

        resource(state) {
            return Object.keys(state.resource).length ? state.resource : null;
        },
    },

    mutations: {
        setLoading(state, data) {
            state.loading = data;
        },

        setResource(state, data) {
            console.log('[PostShow.store] setResource 被调用，数据:', data);
            state.resource = data;
            console.log('[PostShow.store] state.resource 已设置:', state.resource);
        },
    },

    actions: {
        async getResourceById({ commit }, resourceId) {
            commit('setLoading', true);

            try {
                const response = await apiHttpClient.get(`/api/resources/${resourceId}`);
                commit('setLoading', false);
                commit('setResource', response.data);

                console.log('返回数据：', response);

                return response;
            } catch (error: any) {
                commit('setLoading', false);

                throw error.response;
            }
        },
    },
};
