import { Module } from 'vuex';
import { RootState } from '../app/app.store';
import {
 postCreateStoreModule,
 PostCreateStoreState,
} from './create/post-create.store';
import {
 postIndexStoreModule,
 PostIndexStoreState,
} from './index/post-index.store';
import { postShowStoreModule } from './show/post-show.store';

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
