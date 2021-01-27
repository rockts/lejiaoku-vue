<template>
  <global-haeder :user="currentUser"></global-haeder>
  <div class="container-fluid text-center">
    <form action="">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input :rules="emailRules" v-model="emailVal"></validate-input>
        {{ emailVal }}
      </div>
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label">邮箱地址</label>
        <input
          type="email"
          class="form-control"
          id="exampleInputEmail1"
          v-model="emailRef.val"
          @blur="validateEmail"
        />
        <div class="form-text" v-if="emailRef.error">
          {{ emailRef.message }}
        </div>
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">密码</label>
        <input
          type="password"
          class="form-control"
          id="exampleInputPassword1"
        />
      </div>
    </form>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import ValidateInput, { RulesProp } from './components/ValidateInput.vue';
import GlobalHaeder, { UserProps } from './components/GlobalHaeder.vue';

const currentUser: UserProps = {
  isLogin: true,
  name: '乐可高鹏',
};

// eslint-disable-next-line no-useless-escape
const emailReg = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;

export default defineComponent({
  name: 'App',
  components: {
    GlobalHaeder,
    ValidateInput,
  },

  setup() {
    const emailVal = ref('rockts');
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' },
    ];
    const emailRef = reactive({
      val: '',
      error: false,
      message: '',
    });
    const validateEmail = () => {
      if (emailRef.val.trim() == '') {
        emailRef.error = true;
        emailRef.message = 'can not be empty';
      } else if (!emailReg.test(emailRef.val)) {
        emailRef.error = true;
        emailRef.message = 'should be valid email';
      }
    };
    return {
      currentUser,
      emailRef,
      validateEmail,
      emailRules,
      emailVal,
    };
  },
});
</script>

<style>
a {
  color: #999999;
}

a:hover {
  color: #e9e916;
}
.avatar {
  /* height: 5vh; */
  width: 32px;
  margin-right: 10px;
}

.content {
  text-align: center;
  margin: 20px 0;
}
</style>
