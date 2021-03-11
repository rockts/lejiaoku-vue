import { Module } from 'vuex';

import { RootState } from '../../app/app.store';

export interface Post {
 id: number;
 title: string;
 description: string;
 grade: string;
 subject: string;
 version: string;
 category: string;
 minetype: string;
 updatedAt: Date;
 cover: string;
 file: string;
}

export interface PostCreateStoreState {
 loading: boolean;
 post: Post;
}

export const postCreateStoreModule: Module<PostCreateStoreState, RootState> = {
 namespaced: true,
};
