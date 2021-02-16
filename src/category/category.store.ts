import { Module } from 'vuex';
import { RootState } from '../app/app.store';
import {
 categoryIndexStoreModule,
 CategoryIndexStoreState,
} from './index/category-index.store';
import { categoryShowStoreModule } from './show/category-show.store';

export interface CategoryItem {
 id: number;
 name: string;
 alias: string;
}
export interface CategoryStoreState {
 index: CategoryIndexStoreState;
}

export const categoryStoreModule: Module<CategoryStoreState, RootState> = {
 namespaced: true,

 modules: {
  index: categoryIndexStoreModule,
  show: categoryShowStoreModule,
 },
};
