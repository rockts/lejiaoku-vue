import { Module } from 'vuex';
import { RootState } from '../../app/app.store';
import { UserItem } from '../user.store';

export interface UserLoginStoreState {
 loading: boolean;
 user: Array<UserItem>;
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
