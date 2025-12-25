<template>
  <div id="app">
    <GlobalHeader :user="user" @show-login="showLoginModal = true" />
    <router-view :user="user" @show-login="showLoginModal = true" />
    <!-- <backTop /> -->
    <GlobalFooter />
    <LoginModal v-model="showLoginModal" @switch-to-register="switchToRegister" />
    <RegisterModal v-model="showRegisterModal" @switch-to-login="switchToLogin" />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import GlobalHeader from "./components/GlobalHeader.vue";
import GlobalFooter from "./components/GlobalFooter.vue";
import LoginModal from "./components/LoginModal.vue";
import RegisterModal from "./components/RegisterModal.vue";
import { apiHttpClient } from "./app.service";

//  import backTop from '@/app/components/BackTop';

export default defineComponent({
  name: "App",

  data() {
    return {
      user: null,
      showLoginModal: false,
      showRegisterModal: false,
    };
  },

  async created() {
    // 初始化 auth store（从 localStorage 恢复登录状态）
    this.$store.dispatch("auth/initAuth");
    
    // 监听登出事件（由 401 响应触发）
    window.addEventListener('auth:logout', () => {
      this.$store.dispatch('auth/logout');
    });
    
    try {
      const response = await apiHttpClient.get("/user");
      this.user = response.data;
    } catch (error) {
      console.log("获取用户信息失败:", error);
      this.user = null;
    }
  },

  methods: {
    switchToRegister() {
      this.showLoginModal = false;
      this.showRegisterModal = true;
    },
    switchToLogin() {
      this.showRegisterModal = false;
      this.showLoginModal = true;
    },
  },

  components: {
    GlobalHeader,
    GlobalFooter,
    LoginModal,
    RegisterModal,
    //    backTop,
  },
});
</script>

<style>
@import "./styles/app.css";
</style>
