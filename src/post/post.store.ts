import { Module } from 'vuex';
import { RootState } from '../app/app.store';
import {
 postCreateStoreModule,
 PostCreateStoreState,
} from './create/PostCreate.store';
import {
 postIndexStoreModule,
 PostIndexStoreState,
} from './index/PostIndex.store';
import { postShowStoreModule } from './show/PostShow.store';

export interface PostItem {
 id: number;
 title: string;
 description: string;
 grade: string;
 subject: string;
 version: string;
 category: string;
 created_at: Date;
 updated_at: Date;
 cover: string;
}

export interface PostStoreState {
 create: PostCreateStoreState;
 index: PostIndexStoreState;
}

export const postStoreModule: Module<PostStoreState, RootState> = {
 namespaced: true,

 modules: {
  create: postCreateStoreModule,
  index: postIndexStoreModule,
  show: postShowStoreModule,
 },
};
