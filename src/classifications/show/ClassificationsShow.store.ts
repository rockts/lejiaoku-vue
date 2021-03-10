import { Module } from 'vuex';
import { apiHttpClient } from '../../app/app.service';
import { RootState } from '../../app/app.store';

export interface Classifications {
      Classifications: string;
}

export interface ClassificationsShowStoreState {
      loading: boolean;
      classifications: Classifications;
}

export const classificationsShowStoreModule: Module<
      ClassificationsShowStoreState,
      RootState
> = {
      namespaced: true,

      state: {
            loading: false,
            classifications: {},
      } as ClassificationsShowStoreState,

      getters: {
            loading(state) {
                  return state.loading;
            },

            classification(state) {
                  return Object.keys(state.classifications).length ? state.classifications : null;
            },
      },

      mutations: {
            setLoading(state, data) {
                  state.classifications = data;
            },

            setClassification(state, data) {
                  state.classifications = data;
            },
      },

      actions: {
            async getClassificationById({ commit }, Ds) {
                  commit('setLoading', true);

                  try {
                        const response = await apiHttpClient.get('/classifications/Ds');
                        commit('setLoading', false);
                        commit('setClassification', response.data);

                        return response;
                  } catch (error) {
                        commit('setLoading', false);
                        throw error.response;
                  }
            },
      },
};
