import { Module } from 'vuex';
import { apiHttpClient } from '../../app/app.service';
import { RootState } from '../../app/app.store';
import { ClassificationsItem } from '../classifications.store';

export interface ClassificationsIndexStoreState {
 loading: boolean;
 classifications: Array<ClassificationsItem>;
 categorys: string;
 versions: string;
 grades: string;
 subjects: string;
}

export const classificationsIndexStoreModule: Module<
 ClassificationsIndexStoreState,
 RootState
> = {
 namespaced: true,

 state: {
  loading: false,
  classifications: [],
  categorys: '',
  versions: '',
  grades: '',
  subjects: '',
 } as ClassificationsIndexStoreState,

 getters: {
  loading(state) {
   return state.loading;
  },

  classifications(state) {
   return state.classifications;
  },
  categorys(state) {
   return state.categorys;
  },
  grades(state) {
   return state.grades;
  },
  subjects(state) {
   return state.subjects;
  },
  versions(state) {
   return state.versions;
  },
 },

 mutations: {
  setLoading(state, data) {
   state.loading = data;
  },

  setClassifications(state, data) {
   state.classifications = data;
  },
  setCategorys(state, data) {
   state.categorys = data;
  },
  setGrades(state, data) {
   state.grades = data;
  },
  setSubjects(state, data) {
   state.subjects = data;
  },
  setVersions(state, data) {
   state.versions = data;
  },
 },

 actions: {
  // 获取全部分类名称
  async getClassifications({ commit }) {
   commit('setLoading', true);

   try {
    const response = await apiHttpClient.get('/classifications');
    commit('setClassifications', response.data);
    commit('setLoading', false);

    return response;
   } catch (error) {
    commit('setloading', false);
    throw error.response;
   }
  },

  // 获取资源类型名称
  async getCategory({ commit }) {
   commit('setLoading', true);

   try {
    const response = await apiHttpClient.get('/classifications/category');
    commit('setCategorys', response.data);
    commit('setLoading', false);

    return response;
   } catch (error) {
    commit('setloading', false);
    throw error.response;
   }
  },

  // 获取年级名称
  async getGrade({ commit }) {
   commit('setLoading', true);

   try {
    const response = await apiHttpClient.get('/classifications/grade');
    commit('setGrades', response.data);
    commit('setLoading', false);

    return response;
   } catch (error) {
    commit('setloading', false);
    throw error.response;
   }
  },
  // 获取学科名称
  async getSubject({ commit }) {
   commit('setLoading', true);

   try {
    const response = await apiHttpClient.get('/classifications/subject');
    commit('setSubjects', response.data);
    commit('setLoading', false);

    return response;
   } catch (error) {
    commit('setloading', false);
    throw error.response;
   }
  },
  // 获取版本名称
  async getVersion({ commit }) {
   commit('setLoading', true);

   try {
    const response = await apiHttpClient.get('/classifications/version');
    commit('setVersions', response.data);
    commit('setLoading', false);

    return response;
   } catch (error) {
    commit('setloading', false);
    throw error.response;
   }
  },
 },
};
