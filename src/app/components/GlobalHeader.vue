<template>
 <nav class="navbar navbar-expand-lg navbar-light bg-light ml-auto">
  <div class="container">
   <router-link class="navbar-brand" to="/">
    <img alt="LeJiaoKulogo" src="@/assets/img/logo.png" />
   </router-link>
   <button
    class="navbar-toggler"
    type="button"
    data-toggle="collapse"
    data-target="#navbarSupportedContent"
    aria-controls="navbarSupportedContent"
    aria-expanded="false"
    aria-label="Toggle navigation"
   >
    <span class="navbar-toggler-icon"></span>
   </button>

   <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
     <li class="nav-item">
      <router-link class="nav-link" to="/posts">资源 </router-link>
     </li>
     <li class="nav-item">
      <router-link class="nav-link" to="/classifications">分类 </router-link>
     </li>

     <li class="nav-item">
      <router-link class="nav-link" to="/">贡献者</router-link>
     </li>
    </ul>

    <HeaderSearch />

    <ul v-if="!user" class="navbar-nav">
     <li class="nav-item px-1 py-1">
      <router-link type="button" to="/login" class="btn btn-outline-primary"
       >登录</router-link
      >
     </li>
     <li class="nav-item px-1 py-1">
      <router-link type="button" to="/register" class="btn btn-primary"
       >注册</router-link
      >
     </li>
    </ul>

    <ul v-if="user" class="list-inline mb-0 px-5">
     <li class="nav-item dropdown" :title="user.name">
      <router-link
       class="nav-link dropdown-toggle"
       to="#"
       id="usersDropdown"
       role="button"
       data-toggle="dropdown"
       aria-haspopup="true"
       aria-expanded="false"
      >
       <!-- <img
        v-if="(code = 404)"
        class="img-circle avatar"
        src="@/assets/img/avatar.png"
       /> -->
       <img class="img-circle avatar" :src="userAvatarURL" />
       {{ user.name }}
      </router-link>
      <div class="dropdown-menu" aria-labelledby="usersDropdown">
       <router-link to="/posts/create" class="dropdown-item"
        >发布文章</router-link
       >
       <router-link to="#" class="dropdown-item">个人中心</router-link>
       <router-link to="#" class="dropdown-item">设置账户</router-link>
       <a href="javascript:void(0)" @click="handleClick" class="dropdown-item"
        >退出账户</a
       >
      </div>
     </li>
    </ul>
   </div>
  </div>
 </nav>
</template>

<script>
 import { defineComponent } from 'vue';
 import { API_BASE_URL } from '@/app/app.config';
 import HeaderSearch from './form/HeaderSearch.vue';

 export default defineComponent({
  name: 'GlobalHeader',
  props: ['user'],
  methods: {
   handleClick() {
    localStorage.removeItem('token');
    this.$router.push('/');
   },
  },
  computed: {
   userAvatarURL() {
    return `${API_BASE_URL}/users/${this.user.id}/avatar`;
   },
  },

  components: { HeaderSearch },
 });
</script>

<style>
 .dropdown .dropdown-menu {
  min-width: 6rem;
 }
</style>
