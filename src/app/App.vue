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
    
    // 检查路由参数，如果是从登录页跳转过来要打开注册弹窗
    if (this.$route.query.register === 'true') {
      this.showRegisterModal = true;
      // 清除 query 参数，避免刷新后再次打开
      this.$router.replace({ path: '/', query: {} });
    }
    
    // 如果已登录，从后端获取最新用户信息并更新 store
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const response = await apiHttpClient.get("/user");
        const userData = response.data;
        console.log("[App] 从 /user 接口获取的用户数据:", userData);
        console.log("[App] userData.id:", userData?.id);
        console.log("[App] userData.nickname:", userData?.nickname);
        console.log("[App] userData.username:", userData?.username);
        
        // 确保至少包含 id 和 role
        if (userData && userData.id && userData.role) {
          const currentStoreUser = this.$store.state.auth.user;
          console.log("[App] 当前 store 中的用户数据:", currentStoreUser);
          console.log("[App] currentStoreUser.id:", currentStoreUser?.id);
          
          // 检查是否是同一个用户
          const isSameUser = currentStoreUser && String(currentStoreUser.id) === String(userData.id);
          console.log("[App] 是否是同一个用户:", isSameUser);
          
          // 完全使用后端返回的数据（后端数据是最新的，包含最新的 nickname）
          // 但对于 avatar_url，如果后端返回 null，保留旧数据中的 avatar_url（如果存在）
          
          // 尝试从 localStorage 读取原始数据中的 avatar_url（作为最后的备选）
          let storedAvatarUrl = null;
          try {
            const storedUserInfo = localStorage.getItem('user_info');
            if (storedUserInfo) {
              const parsedStoredUser = JSON.parse(storedUserInfo);
              if (parsedStoredUser.avatar_url && String(parsedStoredUser.avatar_url).trim() !== '') {
                storedAvatarUrl = String(parsedStoredUser.avatar_url).trim();
              }
            }
          } catch (e) {
            console.error("[App] 读取 localStorage 中的 avatar_url 失败:", e);
          }
          
          const mergedUserData = {
            ...userData,
            // 确保字段存在
            nickname: userData.nickname || '',
            username: userData.username || '',
            name: userData.name || '',
            // avatar_url: 优先级：后端数据 > store 数据 > localStorage 数据 > null
            avatar_url: (userData.avatar_url !== undefined && userData.avatar_url !== null && String(userData.avatar_url).trim() !== '') 
              ? String(userData.avatar_url).trim()
              : (currentStoreUser?.avatar_url && String(currentStoreUser.avatar_url).trim() !== '' 
                  ? String(currentStoreUser.avatar_url).trim() 
                  : (storedAvatarUrl || null)),
          };
          
          console.log("[App] userData.avatar_url:", userData?.avatar_url);
          console.log("[App] currentStoreUser.avatar_url:", currentStoreUser?.avatar_url);
          console.log("[App] storedAvatarUrl (from localStorage):", storedAvatarUrl);
          console.log("[App] mergedUserData.avatar_url:", mergedUserData.avatar_url);
          
          if (!isSameUser) {
            // 不同用户（切换用户）：清除旧数据
            console.log("[App] 检测到用户切换，清除旧数据并使用新用户数据");
            localStorage.removeItem("token");
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user_info");
          }
          
          // 保存最新的用户数据到 localStorage 和 store
          localStorage.setItem("token", token);
          localStorage.setItem("auth_token", token);
          localStorage.setItem("user_info", JSON.stringify(mergedUserData));
          
          console.log("[App] 保存的用户数据:", mergedUserData);
          console.log("[App] 保存的 nickname:", mergedUserData.nickname);
          console.log("[App] 保存的 username:", mergedUserData.username);
          
          // 更新 store
          this.$store.commit("auth/setUser", mergedUserData);
          this.user = mergedUserData;
        }
      } catch (error) {
        console.log("获取用户信息失败:", error);
        this.user = null;
      }
    }
  },

  watch: {
    '$route'(to) {
      // 检查路由参数，如果是从登录页跳转过来要打开注册弹窗
      if (to.query.register === 'true') {
        this.showRegisterModal = true;
        // 清除 query 参数，避免刷新后再次打开
        this.$router.replace({ path: to.path, query: {} });
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
