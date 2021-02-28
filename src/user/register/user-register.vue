<template>
 <div class="main my-5">
  <form @submit.prevent="handleSubmit">
   <input
    type="text"
    class="form-control"
    v-model="name"
    placeholder="输入昵称"
   /><i class="bi bi-person-fill"></i>

   <input
    type="email"
    class="form-control"
    v-model="email"
    placeholder="输入邮箱"
   /><i class="bi bi-envelope-fill"></i>

   <input
    type="password"
    v-model="password"
    class="form-control"
    placeholder="设置密码"
   /><i class="bi bi-bag-fill"></i>

   <button type="submit" class="w-100 btn btn-lg btn-primary">
    注册
   </button>
   <small
    >点击 “注册” 即表示您同意并愿意遵守乐教库
    <router-link to="/">用户协议</router-link> 和
    <router-link to="/">隐私政策</router-link>。</small
   >

   <div class="sign-more">
    <h6>社交账号直接注册</h6>
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
 import { defineComponent } from 'vue';
 import { apiHttpClient } from '@/app/app.service';

 export default defineComponent({
  name: 'SignUp',
  data() {
   return {
    name: '',
    email: '',
    password: '',
   };
  },
  methods: {
   async handleSubmit() {
    await apiHttpClient.post('/register', {
     name: this.name,
     email: this.email,
     password: this.password,
    });

    this.$router.push('/user/login');
   },
  },
 });
</script>
