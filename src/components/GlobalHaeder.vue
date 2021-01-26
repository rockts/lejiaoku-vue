<template>
  <nav class="navbar navbar-light  bg-primary">
    <a href="#" class="navbar-brand px-5">
      <img alt="LeJiaoKu logo" src="../assets/logo.png"
    /></a>
    <ul class="list-inline  mb-0">
      <li class="list-inline-item px-4">
        <router-link to="/">主页</router-link>
      </li>
      <li class="list-inline-item px-4">
        <router-link to="/res">资源</router-link>
      </li>
      <li class="list-inline-item px-4">
        <router-link to="/about">关于</router-link>
      </li>
    </ul>

    <form class="d-flex">
      <input
        class="form-control me-2"
        type="search"
        placeholder="Search"
        aria-label="Search"
      />
      <button class="btn btn-outline-light" type="submit">Search</button>
    </form>

    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item">
        <a href="" class="btn btn-outline-light">登录</a>
      </li>
      <li class="list-inline-item me-5">
        <a href="" class="btn btn-outline-light">注册</a>
      </li>
    </ul>
    <ul v-else class="list-inline mb-0 px-5">
      <li class="list-inline-item">
        <dropdown :title="`你好， ${user.name}`"></dropdown>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Dropdown from './Dropdown.vue';

export interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
}

export default defineComponent({
  name: 'GlobalHaeder',

  /**
   * 属性
   */
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true,
    },
  },

  /**
   * 数据
   */
  data() {
    return {};
  },

  /**
   * 计算属性
   */
  computed: {},

  /**
   * 已创建
   */
  created() {
    //
  },

  /**
   * 组件方法
   */
  methods: {},

  /**
   * 使用组件
   */
  components: {
    Dropdown,
  },
});
</script>

<style scoped></style>
