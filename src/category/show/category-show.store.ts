import { Module } from 'vuex';
import { apiHttpClient } from '../../app/app.service';
import { RootState } from '../../app/app.store';

export interface Category {
 id: number;
 name: string;
 alias: string;
}

export interface CategoryShowStoreState {
 loading: boolean;
 category: Category;
}

export const categoryShowStoreModule: Module<
 CategoryShowStoreState,
 RootState
> = {
 namespaced: true,

 state: {
  loading: false,
  category: {},
 } as CategoryShowStoreState,

 getters: {
  loading(state) {
   return state.loading;
  },

  category(state) {
   return Object.keys(state.category).length ? state.category : null;
  },
 },

 mutations: {
  setLoading(state, data) {
   state.category = data;
  },

  setCategory(state, data) {
   state.category = data;
  },
 },

 actions: {
  async getCategoryById({ commit }, categoryId) {
   commit('setLoading', true);

   try {
    const response = await apiHttpClient.get(`/categorys/${categoryId}`);
    commit('setLoading', false);
    commit('setCategory', response.data);

    return response;
   } catch (error) {
    commit('setLoading', false);
    throw error.response;
   }
  },
 },
};
