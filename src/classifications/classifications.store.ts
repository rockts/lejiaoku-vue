import { Module } from 'vuex';
import { RootState } from '../app/app.store';
import {
 classificationsIndexStoreModule,
 ClassificationsIndexStoreState,
} from './index/ClassificationsIndex.store';

export interface ClassificationsItem {
 item: string;
}

export interface ClassificationsStoreState {
 index: ClassificationsIndexStoreState;
}

export const classificationsStoreModule: Module<
 ClassificationsStoreState,
 RootState
> = {
 namespaced: true,

 modules: {
  index: classificationsIndexStoreModule,
 },
};
