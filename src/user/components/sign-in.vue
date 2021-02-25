<template>
 <div class="main my-5">
  <form>
   <input
    type="text"
    class="form-control"
    v-model="name"
    placeholder="用户名"
   /><i class="bi bi-person-fill"></i>

   <input
    type="password"
    class="form-control"
    placeholder="密码"
    v-model="password"
   /><i class="bi bi-bag-fill"></i>

   <div class="sign-btn">
    <a href="#">忘记密码？</a> <a href="/sign-up">注册</a>
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

 export default defineComponent({
  name: 'SignIn',
  data() {
   return {
    name: '',
    password: '',
   };
  },

  created() {
   if (
    JSON.parse(localStorage.getItem('user')) &&
    JSON.parse(localStorage.getItem('user')).name
   ) {
    this.name = JSON.parse(localStorage.getItem('user')).name;
    this.password = JSON.parse(localStorage.getItem('user')).password;
   }
  },

  methods: {
   async signIn() {
    console.log(this.name, this.password);

    try {
     const response = await apiHttpClient.post('/login', {
      name: this.name,
      password: this.password,
     });

     console.log(response.data);
    } catch (error) {
     console.log(error.response);

     this.$emit('login-error', error.response);
    }
   },
  },
 });
</script>
<style>
 @import './styles/sign.css';
</style>
