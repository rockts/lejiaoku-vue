<template>
  <validate-form @form-submit="onFormSubmit">
    <div class="mb-3">
      <label class="form-label">邮箱地址</label>
      <validate-input
        :rules="emailRules"
        v-model="emailVal"
        placeholder="请输入邮箱地址"
        type="text"
        ref="inputRef"
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
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

import ValidateInput, { RulesProp } from './ValidateInput.vue';
import ValidateForm from './ValidateForm.vue';

export default defineComponent({
  name: 'UserLogin',
  components: {
    ValidateInput,
    ValidateForm,
  },

  setup() {
    const emailVal = ref('');
    const router = useRouter();
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' },
    ];
    const passwordVal = ref('');
    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' },
    ];

    const onFormSubmit = (result: boolean) => {
      console.log('result', result);
      if (result) {
        router.push({ name: 'test', params: { id: 1 } });
      }
    };

    return {
      emailRules,
      emailVal,
      passwordVal,
      passwordRules,
      onFormSubmit,
    };
  },
});
</script>
