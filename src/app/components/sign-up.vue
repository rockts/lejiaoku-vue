<template>
  <div class="main my-5  py-4">
    <form>
      <div class="form-group sign-input-prepend">
        <input
          type="username"
          class="form-control"
          id="exampleInputEmail1"
          placeholder="输入昵称"
        /><i class="bi bi-person-fill"></i>
      </div>
      <div class="form-group sign-input-prepend">
        <input
          type="number"
          class="form-control"
          id="exampleInputEmail1"
          placeholder="输入手机号"
        /><i class="bi bi-phone-fill"></i>
      </div>
      <div class="form-group sign-input-prepend">
        <input
          type="password"
          class="form-control"
          id="exampleInputPassword1"
          placeholder="设置密码"
        /><i class="bi bi-bag-fill"></i>
      </div>

      <div class="form-check my-2">
        <button type="submit" class="btn btn-outline-primary  btn-block">
          注册
        </button>
        <small
          >点击 “注册” 即表示您同意并愿意遵守乐教库
          <router-link to="/">用户协议</router-link> 和
          <router-link to="/">隐私政策</router-link>。</small
        >
      </div>
      <div class="sign-more">
        <h6>社交账号直接注册</h6>
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
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SignUp',
});
</script>
