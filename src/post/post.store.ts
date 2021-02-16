import { Module } from 'vuex';
import { RootState } from '../app/app.store';
import {
 postCoverStoreModule,
 PostCoverStoreState,
} from './cover/post-cover.store';
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
 updatedAt: Date;
 cover: string;
}

export interface PostStoreState {
 create: PostCreateStoreState;
 index: PostIndexStoreState;
 cover: PostCoverStoreState;
}

export const postStoreModule: Module<PostStoreState, RootState> = {
 namespaced: true,

 modules: {
  create: postCreateStoreModule,
  index: postIndexStoreModule,
  show: postShowStoreModule,
  cover: postCoverStoreModule,
 },
};
