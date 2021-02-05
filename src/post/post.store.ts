import { Module } from 'vuex';
import { RootState } from '../app/app.store';
import {
  postCreateStoreModule,
  PostCreateStoreState,
} from './create/post-create.store';
import { postIndexStoreModule } from './index/post-index.store';

export interface PostItem {
  id: number;
  title: string;
  description: string;
  grade: string;
  subject: string;
  version: string;
  category: string;
  updatedAt: Date;
}

export interface PostStoreState {
  create: PostCreateStoreState;
}

export const postStoreModule: Module<PostStoreState, RootState> = {
  namespaced: true,

  modules: {
    create: postCreateStoreModule,
    index: postIndexStoreModule,
  },
};
