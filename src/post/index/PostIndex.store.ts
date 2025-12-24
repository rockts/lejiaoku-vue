import { Module } from 'vuex';
import { apiHttpClient } from '../../app/app.service';
import { RootState } from '../../app/app.store';
import { PostItem } from '../post.store';

export interface PostIndexStoreState {
 loading: boolean;
 posts: Array<PostItem>;
 totalcount: 0;
}

export const postIndexStoreModule: Module<PostIndexStoreState, RootState> = {
 namespaced: true,

 state: {
  loading: false,
  posts: [],
  totalcount: 0,
 } as PostIndexStoreState,

 getters: {
  loading(state) {
   return state.loading;
  },

  posts(state) {
   return state.posts;
  },

  totalcount(state) {
   return state.totalcount;
  },
 },

 mutations: {
  setLoading(state, data) {
   state.loading = data;
  },

  setPosts(state, data) {
   state.posts = data;
  },
  setTotalcount(state, data) {
   state.totalcount = data;
  },
 },

 actions: {
  async getPosts({ commit }) {
   commit('setLoading', true);

   try {
    const response = await apiHttpClient.get('/posts');
    commit('setPosts', response.data);
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
