<template>
  <div class="main my-2">
    <form>
      <input
        type="email"
        class="form-control"
        id="exampleInputEmail1"
        aria-describedby="emailHelp"
        placeholder="手机号或邮箱"
      /><i class="bi bi-person-fill"></i>

      <input
        type="password"
        class="form-control"
        id="exampleInputPassword1"
        placeholder="密码"
      /><i class="bi bi-bag-fill"></i>

      <div class="sign-btn">
        <a href="#">忘记密码？</a> <a href="/sign-up">注册</a>
      </div>

      <button type="submit" class="w-100 btn btn-lg btn-primary">
        登录
      </button>

      <div class="sign-more">
        <h6>社交账号登录</h6>
        <ul>
          <li>
            <img
              src="@/assets/weixin.png"
              class="rounded w-25 px-2"
              alt=""
            />微信登录
          </li>
          <li>
            <img
              src="@/assets/qq.png"
              class="rounded w-25 px-2"
              alt=""
            />腾讯账号
          </li>
        </ul>
      </div>
    </form>
  </div>
</template>
<script lang="ts">
import { axios } from '@/app/app.service';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SignIn',
  data() {
    return {
      errorMessage: '',
      user: {
        name: '高鹏',
        password: '123123',
      },
      token: '',
    };
  },

  async created() {
    // 用户登录
    try {
      const response = await axios.post('/login', this.user);
      this.token = response.data.token;

      console.log(response.data);
    } catch (error) {
      this.errorMessage = error.message;
    }
  },
});
</script>
<style>
@import './styles/sign.css';
</style>
