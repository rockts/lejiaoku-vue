<template>
  <nav class="navbar   navbar-light bg-light">
    <router-link to="/" class="navbar-brand mb-0 px-5">
      <img alt="LeJiaoKulogo" src="@/assets/logo.png"
    /></router-link>
    <ul v-if="!user.isLogin" class="list-inline mb-0  px-5">
      <li class="list-inline-item">
        <router-link to="/categorys">资源</router-link>
      </li>
      <li class="list-inline-item"><router-link to="/">贡献者</router-link></li>
      <li class="list-inline-item">
        <router-link to="/login" class="btn btn-outline-primary"
          >登录</router-link
        >
      </li>
      <li class="list-inline-item">
        <router-link to="/login" class="btn btn-outline-primary"
          >注册</router-link
        >
      </li>
    </ul>
    <ul v-else class="list-inline mb-0 px-5">
      <li class="list-inline-item">
        <router-link to="/categorys">资源</router-link>
      </li>
      <li class="list-inline-item"><router-link to="/">贡献者</router-link></li>
      <li class="list-inline-item">
        <dropdown :title="`${user.name}`">
          <dropdown-item
            ><a href="/create" class="dropdown-item">发布文章</a></dropdown-item
          >
          <dropdown-item
            ><a href="/create" class="dropdown-item">个人中心</a></dropdown-item
          >
          <dropdown-item
            ><a href="/create" class="dropdown-item">设置账户</a></dropdown-item
          >
          <dropdown-item
            ><a href="/create" class="dropdown-item">退出登录</a></dropdown-item
          >
        </dropdown>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Dropdown from '@/components/Dropdown.vue';
import DropdownItem from '@/components/DropdownItem.vue';

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

<style>
.list-inline-item {
  padding: 0 15px;
}
.menu a {
  float: left;
  text-align: left;
  padding: 0 20px;
}
</style>
