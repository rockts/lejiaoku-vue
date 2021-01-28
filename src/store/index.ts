import { createStore } from 'vuex';
import {
  testData,
  testResources,
  CategoryProps,
  ResourcesProps,
} from '@/data/testData';

interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
  categoryId?: number;
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
  },
  getters: {
    biggerColumnsLen(state) {
      return state.categorys.filter((c) => c.id > 2).length;
    },
    getCategoryById: (state) => (id: number) => {
      return state.categorys.find((c) => c.id === id);
    },
    getResourcesByCid: (state) => (cid: number) => {
      return state.resources.filter((resources) => resources.id == cid);
    },
  },
  actions: {},
  modules: {},
});
