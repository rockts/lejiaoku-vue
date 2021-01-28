<template>
  <nav class="navbar navbar-dark  bg-primary">
    <router-link to="/" class="navbar-brand px-5">
      <img alt="LeJiaoKu-logo" src="../assets/logo.png"
    /></router-link>
    <ul class="list-inline  mb-0">
      <li class="list-inline-item px-4">
        <router-link to="/category/1">教材</router-link>
      </li>
      <li class="list-inline-item px-4">
        <router-link to="/category/2">课件</router-link>
      </li>
      <li class="list-inline-item px-4">
        <router-link to="/category/3">教案</router-link>
      </li>
      <li class="list-inline-item px-4">
        <router-link to="/category/4">练习</router-link>
      </li>
      <li class="list-inline-item px-4">
        <router-link to="/category/5">其他</router-link>
      </li>
      <li class="list-inline-item px-4">
        <router-link to="/category/6">视频</router-link>
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

export default defineComponent({
  name: 'GlobalHaeder',

  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true,
    },
  },

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
