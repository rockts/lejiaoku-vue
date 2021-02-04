/**
 * @FileDescription: app store
 * @Author: gaopeng(gaopeng@lekee.cc)
 * @Date: 2021-2-1 11:52
 * @LastEditors: gaopeng(gaopeng@lekee.cc)
 * @LastEditTime: 2021-2-4 11:23
 */

import { createStore } from 'vuex';
import axios from 'axios';
import user from '@/user/user.store';
import { testData, testResources } from '@/data/testData';

interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
  categoryId?: number;
}

export interface CategoryProps {
  id: number;
  name?: string;
  cover?: string;
  alias: string;
}

export interface ResourcesProps {
  id: number;
  title: string;
  content: string;
  cover?: string;
  createdAt: string;
  categoryId: number;
}

export interface GlobalDataOProps {
  categorys: CategoryProps[];
  resources: ResourcesProps[];
  user: UserProps;
}

/**
 * 创建 Store
 */
export default createStore<GlobalDataOProps>({
  state: {
    categorys: testData,
    resources: testResources,
    user: { isLogin: true, name: 'lekeopen', categoryId: 1 },
  },
  mutations: {
    login(state) {
      state.user = {
        ...state.user,
        isLogin: true,
        name: 'lekeopen',
      };
    },
    CreateResources(state, newResources) {
      state.resources.push(newResources);
    },
    fetchCategory(state, rawData) {
      state.categorys = rawData.data.list;
    },
  },

  actions: {
    getName({ commit, rootState }) {
      console.log(rootState);

      commit('setLoading', true);
    },
    fetchCategory(context) {
      axios.get('/categorys').then((resp) => {
        context.commit('fetchCategory', resp.data);
      });
    },
  },
  modules: {
    user,
  },
});
