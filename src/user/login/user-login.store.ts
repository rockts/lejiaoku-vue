import { Module } from 'vuex';
import { RootState } from '../../app/app.store';

export interface UserLoginStoreState {
 loading: boolean;
}

export const userLoginStoreModule: Module<UserLoginStoreState, RootState> = {
 namespaced: true,

 state: {
  loading: false,
 } as UserLoginStoreState,

 getters: {
  loading(state) {
   return state.loading;
  },
 },
 mutations: {
  setLoading(state, data) {
   state.loading = data;
  },
 },
};
