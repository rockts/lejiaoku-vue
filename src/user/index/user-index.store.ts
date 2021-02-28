import { Module } from 'vuex';
import { apiHttpClient } from '../../app/app.service';
import { RootState } from '../../app/app.store';

export interface UserIndexStoreState {
 loading: boolean;
 user: null;
}

export const userIndexStoreModule: Module<UserIndexStoreState, RootState> = {
 namespaced: true,
 state: {
  user: null,
 } as UserIndexStoreState,
 getters: {
  loading(state) {
   return state.loading;
  },

  user(state) {
   return state.user;
  },
 },

 mutations: {
  setLoading(state, data) {
   state.loading = data;
  },

  setUser(state, data) {
   state.user = data;
  },
 },

 actions: {
  async getUser({ commit }) {
   commit('setLoading', true);

   try {
    const response = await apiHttpClient.get('/user');
    commit('setUser', response.data);
    commit('setLoading', false);

    return response;
   } catch (error) {
    commit('setLoading', false);
    throw error.response;
   }
  },
 },
};
