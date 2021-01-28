<template>
  <nav class="navbar navbar-dark  bg-primary">
    <router-link to="/" class="navbar-brand px-5">
      <img alt="LeJiaoKu-logo" src="../assets/logo.png"
    /></router-link>
    <ul class="list-inline  mb-0">
      <li class="list-inline-item px-4">
        <router-link to="/">主页</router-link>
      </li>
      <li class="list-inline-item px-4">
        <router-link to="/res">教材</router-link>
      </li>
      <li class="list-inline-item px-4">
        <router-link to="/res">课件</router-link>
      </li>
      <li class="list-inline-item px-4">
        <router-link to="/res">教案</router-link>
      </li>
      <li class="list-inline-item px-4">
        <router-link to="/res">同步练习</router-link>
      </li>
      <li class="list-inline-item px-4">
        <router-link to="/res">文档资源</router-link>
      </li>
      <li class="list-inline-item px-4">
        <router-link to="/about">关于</router-link>
      </li>
    </ul>

    <form class="d-flex">
      <input
        class="form-control me-2"
        type="search"
        placeholder="输入搜索资源"
        aria-label="Search"
      />
      <button class="btn btn-outline-light" type="submit">Search</button>
    </form>

    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item">
        <router-link to="/login" class="btn btn-outline-light"
          >登录</router-link
        >
      </li>
      <li class="list-inline-item me-5">
        <router-link to="/login" class="btn btn-outline-light"
          >注册</router-link
        >
      </li>
    </ul>
    <ul v-else class="list-inline mb-0 px-5">
      <li class="list-inline-item">
        <dropdown :title="`${user.name}`">
          <dropdown-item
            ><a href="#" class="dropdown-item">个人中心</a></dropdown-item
          >
          <dropdown-item
            ><a href="#" class="dropdown-item">设置账户</a></dropdown-item
          >
          <dropdown-item
            ><a href="#" class="dropdown-item">退出登录</a></dropdown-item
          >
        </dropdown>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Dropdown from './Dropdown.vue';
import DropdownItem from './DropdownItem.vue';

export interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
}

export const currentUser: UserProps = {
  isLogin: true,
  name: '乐可高鹏',
};

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
    return {
      currentUser,
    };
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
    DropdownItem,
  },
});
</script>

<style scoped></style>
