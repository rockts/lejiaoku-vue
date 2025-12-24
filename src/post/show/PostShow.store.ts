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
    post: Post;
}

export const postShowStoreModule: Module<PostShowStoreState, RootState> = {
    namespaced: true,

    state: {
        loading: false,
        post: {},
    } as PostShowStoreState,

    getters: {
        loading(state) {
            return state.loading;
        },

        post(state) {
            return Object.keys(state.post).length ? state.post : null;
        },
    },

    mutations: {
        setLoading(state, data) {
            state.loading = data;
        },

        setPost(state, data) {
            console.log('[PostShow.store] setPost 被调用，数据:', data);
            state.post = data;
            console.log('[PostShow.store] state.post 已设置:', state.post);
        },
    },

    actions: {
        async getPostById({ commit }, postId) {
            commit('setLoading', true);

            try {
                const response = await apiHttpClient.get(`/api/resources/${postId}`);
                commit('setLoading', false);
                commit('setPost', response.data);

                console.log('返回数据：', response);

                return response;
            } catch (error: any) {
                commit('setLoading', false);

                throw error.response;
            }
        },
    },
};
