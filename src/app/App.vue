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
    
    // 如果已登录，从后端获取最新用户信息并更新 store
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const response = await apiHttpClient.get("/user");
        const userData = response.data;
        console.log("[App] 从 /user 接口获取的用户数据:", userData);
        // 确保至少包含 id 和 role
        if (userData && userData.id && userData.role) {
          // 如果新数据中没有 nickname 或 username，保留 store 中的旧数据
          const currentStoreUser = this.$store.state.auth.user;
          if (currentStoreUser) {
            // 合并数据：优先使用新数据，如果新数据缺少字段则使用旧数据
            const mergedUserData = {
              ...currentStoreUser,
              ...userData,
              // 确保 nickname 和 username 不被覆盖为空
              nickname: userData.nickname !== undefined && userData.nickname !== null && userData.nickname !== '' 
                ? userData.nickname 
                : currentStoreUser.nickname,
              username: userData.username !== undefined && userData.username !== null && userData.username !== '' 
                ? userData.username 
                : currentStoreUser.username,
            };
            console.log("[App] 合并后的用户数据:", mergedUserData);
            // 更新 store
            this.$store.commit("auth/setUser", mergedUserData);
            // 更新 localStorage
            localStorage.setItem("user_info", JSON.stringify(mergedUserData));
            this.user = mergedUserData;
          } else {
            // 如果 store 中没有数据，直接使用新数据
            this.$store.commit("auth/setUser", userData);
            localStorage.setItem("user_info", JSON.stringify(userData));
            this.user = userData;
          }
        }
      } catch (error) {
        console.log("获取用户信息失败:", error);
        this.user = null;
      }
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
