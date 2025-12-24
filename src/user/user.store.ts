import { Module } from 'vuex';
import { RootState } from '../app/app.store';

import {
 userIndexStoreModule,
 UserIndexStoreState,
} from './index/user-index.store';

export interface UserItem {
 id: number;
 name: string;
 email: string;
 password: string;
 avatar: string;
 created_at: Date;
 updated_at: Date;
}

export interface UserStoreState {
 index: UserIndexStoreState;
}

export const userStoreModule: Module<UserStoreState, RootState> = {
 namespaced: true,

 modules: {
  index: userIndexStoreModule,
 },
};
