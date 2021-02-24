<template>
 <nav class="navbar navbar-expand-lg navbar-light bg-light">
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
     <li class="nav-item dropdown">
      <router-link
       class="nav-link dropdown-toggle"
       to="#"
       id="navbarDropdown"
       role="button"
       data-toggle="dropdown"
       aria-haspopup="true"
       aria-expanded="false"
       >资源<span class="sr-only">(current)</span>
      </router-link>

      <CategoryMenu />
     </li>

     <li class="nav-item">
      <router-link class="nav-link" to="/">贡献者</router-link>
     </li>
    </ul>
    <form class="form-inline my-2 my-lg-0  d-sm-block d-md-none">
     <input
      class="form-control mr-sm-2"
      type="search"
      placeholder="Search"
      aria-label="Search"
     />
     <button class="btn btn-outline-success my-2 my-sm-0" type="submit">
      搜索
     </button>
    </form>

    <!-- Button trigger modal -->

    <ul v-if="!isLoginIn" class="navbar-nav">
     <li class="nav-item px-1 py-1">
      <router-link
       type="button"
       to="/sign-in"
       data-toggle="modal"
       data-target="#SignInModal"
       class="btn  btn-outline-primary"
       >登录</router-link
      >
     </li>
     <li class="nav-item px-1 py-1">
      <router-link
       type="button"
       data-toggle="modal"
       data-target="#SignUpModal"
       to="/sign-up"
       class="btn btn-primary"
       >注册</router-link
      >
     </li>
    </ul>

    <ul v-if="isLoginIn" class="list-inline mb-0 px-5">
     <li class="nav-item dropdown" title="`${currentUser.name}`">
      <router-link
       class="nav-link dropdown-toggle"
       to="#"
       id="usersDropdown"
       role="button"
       data-toggle="dropdown"
       aria-haspopup="true"
       aria-expanded="false"
      >
       <img class="img-circle avatar" src="@/assets/img/avatar.png" />
       {{ currentUser.name }}
      </router-link>
      <div class="dropdown-menu" aria-labelledby="usersDropdown">
       <router-link to="/create" class="dropdown-item">发布文章</router-link>
       <router-link to="/create" class="dropdown-item">个人中心</router-link>
       <router-link to="/create" class="dropdown-item">设置账户</router-link>
       <router-link to="#" @click="signOut" class="dropdown-item"
        >退出账户</router-link
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
 import { apiHttpClient } from '@/app/app.service';
 import CategoryMenu from '@/category/index/components/category-menu.vue';

 export default defineComponent({
  name: 'GlobalHaeder',

  data() {
   return {
    errorMessage: '',
    token: '',
    title: '',
    currentUser: null,
   };
  },

  computed: {
   isLoginIn() {
    return this.token ? true : false;
   },
  },

  async created() {
   // 用户登录
   try {
    const response = await apiHttpClient.post('/login', this.user);
    this.token = response.data.token;

    console.log(response.data);
   } catch (error) {
    this.errorMessage = error.message;
   }
   const tid = localStorage.getItem('tid');
   const uid = localStorage.getItem('uid');

   if (tid) {
    this.token = tid;
   }

   if (uid) {
    this.getCurrentUser(uid);
   }
  },

  methods: {
   signOut() {
    this.token = '';
    this.currentUser = null;

    localStorage.removeItem('tid');
    localStorage.removeItem('uid');
   },

   async getCurrentUser(userId) {
    try {
     const response = await apiHttpClient.get(`/users/${userId}`);

     this.currentUser = response.data;
    } catch (error) {
     this.errorMessage = error.message;
    }
   },
   onLoginSuccess(data) {
    this.token = data.token;
    this.getCurrentUser(data.id);

    localStorage.setItem('tid', data.token);
    localStorage.setItem('uid', data.id);
   },

   onLoginError(error) {
    this.errorMessage = error.data.message;
   },
  },

  components: {
   CategoryMenu,
  },
 });
</script>

<style>
 .dropdown .dropdown-menu {
  min-width: 6rem;
 }
</style>
