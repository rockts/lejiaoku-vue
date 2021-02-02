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
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SignIn',
});
</script>
<style>
.main {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
  border-radius: 4px;
  box-shadow: 0 0 8px rgb(0 0 0 / 10%);
  vertical-align: middle;
  display: inline-block;
}

.main input {
  margin-bottom: -1px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.main .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
  padding-left: 30px;
}

.main i {
  color: #999;
  position: relative;
  left: -135px;
  top: -37px;
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
