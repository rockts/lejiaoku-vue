import { Module } from 'vuex';
import { apiHttpClient } from '../../app/app.service';
import { RootState } from '../../app/app.store';
import { ClassificationsItem } from '../classifications.store';

export interface ClassificationsIndexStoreState {
      loading: boolean;
      classifications: Array<ClassificationsItem>;
}

export const classificationsIndexStoreModule: Module<
      ClassificationsIndexStoreState,
      RootState
> = {
      namespaced: true,

      state: {
            loading: false,
            classifications: [],
      } as ClassificationsIndexStoreState,

      getters: {
            loading(state) {
                  return state.loading;
            },

            classifications(state) {
                  return state.classifications;
            },
      },

      mutations: {
            setLoading(state, data) {
                  state.loading = data;
            },

            setClassifications(state, data) {
                  state.classifications = data;
            },
      },

      actions: {
            async getClassifications({ commit }) {
                  commit('setLoading', true);

                  try {
                        const response = await apiHttpClient.get('/classifications');
                        commit('setClassifications', response.data);
                        commit('setLoading', false);

                        return response;
                  } catch (error) {
                        commit('setloading', false);
                        throw error.response;
                  }
            },
      },
};
