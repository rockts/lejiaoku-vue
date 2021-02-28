<template>
 <div class="main my-5">
  <form @submit.prevent="handleSubmit">
   <input
    type="email"
    class="form-control"
    v-model="email"
    placeholder="输入邮箱"
   /><i class="bi bi-envelope-fill"></i>

   <input
    type="password"
    class="form-control"
    placeholder="输入密码"
    v-model="password"
   /><i class="bi bi-bag-fill"></i>

   <div class="sign-btn">
    <a href="#">忘记密码？</a> <a href="/user/register">注册</a>
   </div>

   <button type="submit" @click="signIn" class="w-100 btn btn-lg btn-primary">
    登录
   </button>

   <div class="sign-more">
    <h6>社交账号登录</h6>
    <ul>
     <li>
      <img
       src="@/assets/img/weixin.png"
       class="rounded w-25 px-2"
       alt=""
      />微信登录
     </li>
     <li>
      <img src="@/assets/img/qq.png" class="rounded w-25 px-2" alt="" />腾讯账号
     </li>
    </ul>
   </div>
  </form>
 </div>
</template>
<script>
 import { apiHttpClient } from '@/app/app.service';
 import { defineComponent } from 'vue';
 import { mapGetters } from 'vuex';

 export default defineComponent({
  name: 'UserLogin',
  data() {
   return {
    email: '',
    password: '',
   };
  },

  computed: {
   ...mapGetters({
    loading: 'user/login/loading',
    posts: 'user/login/user',
   }),
  },

  methods: {
   async handleSubmit() {
    const response = await apiHttpClient.post('/login', {
     email: this.email,
     password: this.password,
    });

    localStorage.setItem('token', response.data.token);

    this.$router.push('/');
   },
  },
 });
</script>
<style>
 @import '../styles/user.css';
</style>
