import { Module } from 'vuex';
import { apiHttpClient } from '../../app/app.service';
import { RootState } from '../../app/app.store';

export interface Cover {
 id: number;
}

export interface PostCoverStoreState {
 loading: boolean;
 cover: Cover;
}

export const postCoverStoreModule: Module<PostCoverStoreState, RootState> = {
 namespaced: true,

 state: {
  loading: false,
  cover: {},
 } as PostCoverStoreState,

 getters: {
  loading(state) {
   return state.loading;
  },

  cover(state) {
   return Object.keys(state.cover).length ? state.cover : null;
  },
 },

 mutations: {
  setLoading(state, data) {
   state.cover = data;
  },

  setCover(state, data) {
   state.cover = data;
  },
 },

 actions: {
  async getCoverUrl({ commit }, coverId) {
   commit('setLoading', true);

   try {
    const response = await apiHttpClient.get(`/covers/${coverId}`);
    commit('setLoading', false);
    commit('setCover', response.data);

    return response;
   } catch (error) {
    commit('setLoading', false);

    throw error.response;
   }
  },
 },
};
