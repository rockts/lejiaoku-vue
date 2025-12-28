import { Module } from 'vuex';
import { apiHttpClient } from '../../app/app.service';
import { RootState } from '../../app/app.store';
import { PostItem } from '../post.store';

export interface PostIndexStoreState {
    loading: boolean;
    resources: Array<PostItem>;
    totalcount: 0;
}

export const postIndexStoreModule: Module<PostIndexStoreState, RootState> = {
    namespaced: true,

    state: {
        loading: false,
        resources: [],
        totalcount: 0,
    } as PostIndexStoreState,

    getters: {
        loading(state) {
            return state.loading;
        },

        resources(state) {
            return state.resources;
        },

        totalcount(state) {
            return state.totalcount;
        },
    },

    mutations: {
        setLoading(state, data) {
            state.loading = data;
        },

        setResources(state, data) {
            state.resources = data;
        },
        setTotalcount(state, data) {
            state.totalcount = data;
        },
    },

    actions: {
        async getResources({ commit }) {
            commit('setLoading', true);

            try {
                const response = await apiHttpClient.get('/api/resources');
                commit('setResources', response.data);
                commit('setTotalcount', response.headers);
                commit('setLoading', false);

                return response;
            } catch (error) {
                commit('setLoading', false);
                throw error.response;
            }
        },
    },
};
