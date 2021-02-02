<template>
  <!-- Extra large modal -->
  <div class="container my-5"></div>
  <div class="container">
    <nav>
      <div class="nav nav-tabs" id="nav-tab" role="tablist">
        <a
          class="nav-item nav-link active"
          id="sign-in-tab"
          data-toggle="tab"
          href="#sign-in"
          role="tab"
          aria-controls="nav-home"
          aria-selected="true"
          >登录</a
        >
        <a
          class="nav-item nav-link"
          id="sign-up-tab"
          data-toggle="tab"
          href="#sign-up"
          role="tab"
          aria-controls="nav-profile"
          aria-selected="false"
          >注册</a
        >
      </div>
    </nav>
    <div class="tab-content" id="nav-tabContent">
      <div
        class="tab-pane fade show active"
        id="sign-in"
        role="tabpanel"
        aria-labelledby="sign-in-tab"
      >
        <sign-in></sign-in>
      </div>
      <div
        class="tab-pane fade"
        id="nav-profile"
        role="tabpanel"
        aria-labelledby="nav-profile-tab"
      >
        ...
      </div>
      <div
        class="tab-pane fade"
        id="nav-contact"
        role="tabpanel"
        aria-labelledby="nav-contact-tab"
      >
        ...
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import SignIn from './sign_in.vue';

export default defineComponent({
  name: 'UserLogin',
  components: { SignIn },

  setup() {
    const emailVal = ref('');
    const router = useRouter();
    const store = useStore();
    // const emailRules: RulesProp = [
    //   { type: 'required', message: '电子邮箱地址不能为空' },
    //   { type: 'email', message: '请输入正确的电子邮箱格式' },
    // ];
    const passwordVal = ref('');
    // const passwordRules: RulesProp = [
    //   { type: 'required', message: '密码不能为空' },
    // ];

    const onFormSubmit = (result: boolean) => {
      if (result) {
        router.push('/');
        store.commit('login');
      }
    };

    return {
      // emailRules,
      emailVal,
      passwordVal,
      // passwordRules,
      onFormSubmit,
    };
  },
});
</script>
