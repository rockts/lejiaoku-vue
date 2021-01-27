<template>
  <global-haeder :user="currentUser"></global-haeder>
  <div class="container-fluid text-center">
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input
          :rules="emailRules"
          v-model="emailVal"
          placeholder="请输入邮箱地址"
          type="text"
        ></validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input
          type="password"
          placeholder="请输入密码"
          :rules="passwordRules"
          v-model="passwordVal"
        >
        </validate-input>
      </div>
    </validate-form>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import ValidateInput, { RulesProp } from './components/ValidateInput.vue';
import ValidateForm from './components/ValidateForm.vue';
import GlobalHaeder, { UserProps } from './components/GlobalHaeder.vue';

const currentUser: UserProps = {
  isLogin: true,
  name: '乐可高鹏',
};

export default defineComponent({
  name: 'App',
  components: {
    GlobalHaeder,
    ValidateInput,
    ValidateForm,
  },

  setup() {
    const emailVal = ref('');
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' },
    ];
    const passwordVal = ref('');
    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' },
    ];

    const onFormSubmit = (result: boolean) => {
      console.log('1234', result);
    };

    return {
      currentUser,
      emailRules,
      emailVal,
      passwordVal,
      passwordRules,
      onFormSubmit,
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
