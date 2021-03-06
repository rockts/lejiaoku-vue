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
   state.post = data;
  },

  setPost(state, data) {
   state.post = data;
  },
 },

 actions: {
  async getPostById({ commit }, postId) {
   commit('setLoading', true);

   try {
    const response = await apiHttpClient.get(`/posts/${postId}`);
    commit('setLoading', false);
    commit('setPost', response.data);

    console.log('返回数据：', response);

    return response;
   } catch (error) {
    commit('setLoading', false);

    throw error.response;
   }
  },
 },
};
