<template>
  <div class="main my-5  py-4">
    <form>
      <div class="form-group sign-input-prepend">
        <input
          type="email"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="手机号或邮箱"
        /><i class="bi bi-person-fill"></i>
      </div>
      <div class="form-group sign-input-prepend">
        <input
          type="password"
          class="form-control"
          id="exampleInputPassword1"
          placeholder="密码"
        /><i class="bi bi-bag-fill"></i>
      </div>

      <div class="sign-btn">
        <a href="#">忘记密码？</a> <a href="/sign-up">注册</a>
      </div>

      <div class="my-2">
        <button type="submit" class="btn btn-outline-primary btn-block">
          登录
        </button>
      </div>
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
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SignIn',
});
</script>
<style>
.main {
  width: 400px;
  margin: 10px auto;
  padding: 50px 50px 30px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 0 8px rgb(0 0 0 / 10%);
  vertical-align: middle;
  display: inline-block;
}
.sign-input-prepend {
  height: 60px;
  margin: 5px 0;
}
.sign-input-prepend i {
  color: #999;
  position: relative;
  left: -130px;
  top: -52px;
  line-height: 50px;
}

.sign-input-prepend input {
  padding: 0 40px;
  height: 50px;
}

.sign-btn {
  position: relative;
  margin: 15px 0;
}
.sign-btn a {
  padding: auto 40px;
  text-decoration: none;
}

.sign-more {
  position: relative;
  margin: 0 0 10px;
  font-size: 12px;
  color: #b5b5b5;
  padding-top: 40px;
}

.sign-more h6 {
  font-size: 18px;
}

.sign-more li {
  list-style: none;
  display: inline;
  padding-right: 10px;
}
</style>
