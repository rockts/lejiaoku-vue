import { createStore } from 'vuex';
import axios from 'axios';
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
    fetchCategory(context) {
      axios.get('/categorys').then((resp) => {
        context.commit('fetchCategory', resp.data);
      });
    },
  },
  modules: {},
});
