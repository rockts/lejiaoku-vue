import { Module } from 'vuex';
import { apiHttpClient } from '../../app/app.service';
import { RootState } from '../../app/app.store';
import { CategoryItem } from '../category.store';

export interface CategoryIndexStoreState {
 loading: boolean;
 categorys: Array<CategoryItem>;
}

export const categoryIndexStoreModule: Module<
 CategoryIndexStoreState,
 RootState
> = {
 namespaced: true,

 state: {
  loading: false,
  categorys: [],
 } as CategoryIndexStoreState,

 getters: {
  loading(state) {
   return state.loading;
  },

  categorys(state) {
   return state.categorys;
  },
 },

 mutations: {
  setLoading(state, data) {
   state.loading = data;
  },

  setCategorys(state, data) {
   state.categorys = data;
  },
 },

 actions: {
  async getCategorys({ commit }) {
   commit('setLoading', true);

   try {
    const response = await apiHttpClient.get('/categorys');
    commit('setCategorys', response.data);
    commit('setLoading', false);

    return response;
   } catch (error) {
    commit('setloading', false);
    throw error.response;
   }
  },
 },
};
