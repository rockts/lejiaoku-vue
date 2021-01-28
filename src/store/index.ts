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
    user: { isLogin: false },
  },
  mutations: {
    login(state) {
      state.user = { ...state.user, isLogin: true, name: 'lekeopen' };
    },
  },
  actions: {},
  modules: {},
});
