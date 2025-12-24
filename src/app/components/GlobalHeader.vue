<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light ml-auto nav-glass">
    <div class="container">
      <router-link class="navbar-brand" to="/">
        <img alt="LeJiaoKulogo" src="@/assets/img/logo.png" />
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/posts">资源 </router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" to="/">贡献者</router-link>
          </li>

          <!-- API测试：仅管理员可见 -->
          <li
            v-if="isAuthenticated && currentUser?.role === 'admin'"
            class="nav-item"
          >
            <router-link class="nav-link" to="/test-api">
              <i class="bi bi-wrench"></i> API测试
            </router-link>
          </li>
        </ul>

        <HeaderSearch v-if="!isHomePage" />

        <button
          class="btn btn-outline-secondary btn-theme ml-2"
          @click="toggleTheme"
        >
          <i :class="themeIcon"></i>
        </button>

        <!-- 未登录：显示登录注册按钮 -->
        <ul v-if="!isAuthenticated" class="navbar-nav">
          <li class="nav-item px-1 py-1">
            <button
              type="button"
              @click="showLoginModal = true"
              class="btn btn-outline-primary"
            >
              登录
            </button>
          </li>
          <li class="nav-item px-1 py-1">
            <button
              type="button"
              @click="showRegisterModal = true"
              class="btn btn-primary"
            >
              注册
            </button>
          </li>
        </ul>

        <!-- 已登录：显示用户菜单 -->
        <ul v-if="isAuthenticated && currentUser" class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link to="/resources/create" class="nav-link me-2">
              <i class="bi bi-cloud-upload"></i> 上传资源
            </router-link>
          </li>
          <li class="nav-item dropdown">
            <button
              class="nav-link dropdown-toggle btn btn-link user-dropdown-btn"
              type="button"
              @click="toggleDropdown"
              aria-expanded="false"
            >
              <i class="bi bi-person-circle me-1"></i
              ><span class="user-name">{{ currentUser.username }}</span>
              <span
                v-if="currentUser.role === 'admin'"
                class="badge bg-danger ms-1"
                >管理员</span
              >
            </button>
            <ul class="dropdown-menu" :class="{ show: showUserDropdown }">
              <li>
                <router-link to="/me/profile" class="dropdown-item" @click="closeDropdown">
                  <i class="bi bi-person-gear me-2"></i>个人中心
                </router-link>
              </li>
              <li>
                <router-link to="/me/resources" class="dropdown-item" @click="closeDropdown">
                  <i class="bi bi-file-earmark-text me-2"></i>我的资源
                </router-link>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <a
                  href="javascript:void(0)"
                  @click="handleLogout"
                  class="dropdown-item"
                >
                  <i class="bi bi-box-arrow-right me-2"></i>退出登录
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- 登录弹窗 -->
  <LoginModal
    v-model="showLoginModal"
    @switch-to-register="
      showLoginModal = false;
      showRegisterModal = true;
    "
  />

  <!-- 注册弹窗 -->
  <RegisterModal
    v-model="showRegisterModal"
    @switch-to-login="
      showRegisterModal = false;
      showLoginModal = true;
    "
  />
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import { API_BASE_URL } from "@/app/app.config";
import HeaderSearch from "./form/HeaderSearch.vue";
import LoginModal from "./LoginModal.vue";
import RegisterModal from "./RegisterModal.vue";

export default defineComponent({
  name: "GlobalHeader",
  props: ["user"],
  data() {
    return {
      theme: "light",
      showLoginModal: false,
      showRegisterModal: false,
      showUserDropdown: false,
    };
  },
  computed: {
    ...mapGetters({
      isAuthenticated: "auth/isAuthenticated",
      currentUser: "auth/user",
    }),

    userAvatarURL() {
      return `${API_BASE_URL}/users/${this.user?.id}/avatar`;
    },

    themeIcon() {
      return this.theme === "dark" ? "bi bi-sun" : "bi bi-moon";
    },

    isHomePage() {
      return this.$route.path === "/";
    },
  },
  methods: {
    handleLogout() {
      console.log("[GlobalHeader] 执行退出登录");
      this.$store.dispatch("auth/logout");
      this.$router.push("/");
    },

    toggleTheme() {
      const next = this.theme === "dark" ? "light" : "dark";
      this.theme = next;
      localStorage.setItem("theme", next);
      document.documentElement.setAttribute("data-theme", next);
    },

    toggleDropdown() {
      this.showUserDropdown = !this.showUserDropdown;
    },

    closeDropdown() {
      this.showUserDropdown = false;
    },
  },
  created() {
    const saved = localStorage.getItem("theme") || "light";
    this.theme = saved;
    document.documentElement.setAttribute("data-theme", saved);
  },
  components: { HeaderSearch, LoginModal, RegisterModal },
});
</script>

<style scoped>

/* 用户下拉菜单样式 */
.user-dropdown-btn {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.55);
}

.user-dropdown-btn:hover {
  color: rgba(0, 0, 0, 0.7);
}

.user-name {
  color: inherit;
  font-weight: 500;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  left: auto;
}
.dropdown .dropdown-menu {
  min-width: 6rem;
}

nav {
  box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 5%), inset 0 -1px 0 rgb(0 0 0 / 10%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}
</style>
