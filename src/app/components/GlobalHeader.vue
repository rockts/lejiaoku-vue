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

          <!-- 管理后台：仅管理员可见 -->
          <li
            v-if="canAccessAdmin"
            class="nav-item"
          >
            <router-link class="nav-link" to="/admin">
              <i class="bi bi-shield-check"></i> 管理后台
            </router-link>
          </li>
        </ul>

        <HeaderSearch v-if="!isHomePage" />

        <button
          class="btn btn-link btn-theme"
          @click="toggleTheme"
          title="切换主题"
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
          <!-- 上传资源按钮：contributor / editor / admin 显示 -->
          <li v-if="canUpload" class="nav-item">
            <router-link
              to="/resources/create"
              class="btn btn-upload"
              title="上传资源"
            >
              <i class="bi bi-cloud-upload-fill"></i>
            </router-link>
          </li>
          <li class="nav-item dropdown">
            <button
              class="nav-link dropdown-toggle btn btn-link user-dropdown-btn"
              type="button"
              @click="toggleDropdown"
              aria-expanded="false"
            >
              <img
                v-if="userAvatarUrl"
                :src="userAvatarUrl"
                alt="头像"
                class="user-avatar-img"
                @error="handleAvatarError"
              />
              <i v-else class="bi bi-person-circle user-avatar"></i>
              <span class="user-name">{{ displayName }}</span>
              <span
                v-if="isAdmin"
                class="badge badge-admin ms-1"
              >
                <i class="bi bi-shield-check me-1"></i>管理员
              </span>
              <span
                v-else-if="currentUser.role === 'editor'"
                class="badge badge-editor ms-1"
              >
                <i class="bi bi-pencil me-1"></i>编辑
              </span>
              <span
                v-else-if="currentUser.role === 'contributor'"
                class="badge badge-contributor ms-1"
              >
                <i class="bi bi-person-plus me-1"></i>贡献者
              </span>
            </button>
            <ul
              class="dropdown-menu dropdown-menu-end"
              :class="{ show: showUserDropdown }"
            >
              <li class="dropdown-header">
                <div class="user-info">
                  <img
                    v-if="userAvatarUrl"
                    :src="userAvatarUrl"
                    alt="头像"
                    class="user-avatar-large-img"
                    @error="handleAvatarError"
                  />
                  <i v-else class="bi bi-person-circle user-avatar-large"></i>
                  <div>
                    <div class="user-name-large">
                      {{ displayName }}
                    </div>
                    <div class="user-email">{{ currentUser.email || '未设置邮箱' }}</div>
                    <div v-if="currentUser.nickname" class="user-nickname text-muted small">
                      <i class="bi bi-at"></i> {{ currentUser.nickname }}
                    </div>
                  </div>
                </div>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <router-link
                  :to="currentUser ? `/users/${currentUser.id}` : '/me/profile'"
                  class="dropdown-item"
                  @click="closeDropdown"
                >
                  <i class="bi bi-person-gear me-2"></i>个人中心
                </router-link>
              </li>
              <li>
                <router-link
                  :to="currentUser ? `/users/${currentUser.id}/resources` : '/me/resources'"
                  class="dropdown-item"
                  @click="closeDropdown"
                >
                  <i class="bi bi-file-earmark-text me-2"></i>我的资源
                </router-link>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <a
                  href="javascript:void(0)"
                  @click="handleLogout"
                  class="dropdown-item text-danger"
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
import { apiHttpClient } from "@/app/app.service";
import HeaderSearch from "./form/HeaderSearch.vue";
import LoginModal from "./LoginModal.vue";
import RegisterModal from "./RegisterModal.vue";

export default defineComponent({
  name: "GlobalHeader",
  props: ["user"],
  emits: ["show-login"],
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
      isUser: "auth/isUser",
      isContributor: "auth/isContributor",
      isEditor: "auth/isEditor",
      isAdmin: "auth/isAdmin",
    }),

    // 是否可以上传资源：contributor / editor / admin
    canUpload() {
      return this.isContributor || this.isEditor || this.isAdmin;
    },

    // 是否可以访问管理后台：admin
    canAccessAdmin() {
      return this.isAdmin;
    },

    // 显示名称：直接显示 nickname（昵称），如果没有则显示 username
    displayName() {
      // 如果 store 中没有 currentUser，尝试从 localStorage 读取
      let user = this.currentUser;
      if (!user) {
        try {
          const userInfo = localStorage.getItem('user_info');
          if (userInfo) {
            user = JSON.parse(userInfo);
            console.log("[GlobalHeader] 从 localStorage 读取用户数据:", user);
          }
        } catch (e) {
          console.error("[GlobalHeader] 读取 localStorage 失败:", e);
        }
      }
      
      if (!user) {
        console.log("[GlobalHeader] displayName - 没有用户数据，返回 '用户'");
        return '用户';
      }
      
      console.log("[GlobalHeader] displayName - 用户数据:", user);
      console.log("[GlobalHeader] displayName - nickname:", user.nickname);
      console.log("[GlobalHeader] displayName - username:", user.username);
      
      // 直接显示 nickname（昵称），与后台用户管理页面一致
      if (user.nickname !== undefined && user.nickname !== null && user.nickname !== '') {
        console.log("[GlobalHeader] displayName - 使用 nickname:", user.nickname);
        return String(user.nickname);
      }
      
      // 如果没有 nickname，显示 username
      if (user.username !== undefined && user.username !== null && user.username !== '') {
        console.log("[GlobalHeader] displayName - 使用 username:", user.username);
        return String(user.username);
      }
      
      // 最后显示 '用户'
      console.log("[GlobalHeader] displayName - nickname 和 username 都不存在，返回 '用户'");
      return '用户';
    },

    // 用户头像URL
    userAvatarUrl() {
      const user = this.currentUser;
      if (!user || !user.id) {
        return null;
      }
      
      // 如果用户有 avatar_url，使用它
      if (user.avatar_url) {
        let url = String(user.avatar_url).trim();
        // 如果是完整URL，直接返回
        if (url.startsWith("http://") || url.startsWith("https://")) {
          return `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;
        }
        // 如果是相对路径，直接使用
        if (url.startsWith("/")) {
          return `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;
        }
        // 其他情况，添加API基础URL
        const baseURL = API_BASE_URL || "";
        return `${baseURL}${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;
      }
      
      // 如果没有 avatar_url，使用默认头像URL
      const baseURL = API_BASE_URL || "";
      return `${baseURL}/api/users/${user.id}/avatar?t=${Date.now()}`;
    },

    themeIcon() {
      return this.theme === "dark" ? "bi bi-sun" : "bi bi-moon";
    },

    isHomePage() {
      return this.$route.path === "/";
    },
  },
  mounted() {
    // 组件挂载时，如果已登录但 currentUser 为空，尝试刷新用户数据
    if (this.isAuthenticated && !this.currentUser) {
      this.refreshUserData();
    }
  },
  methods: {
    handleLogout() {
      console.log("[GlobalHeader] 执行退出登录");
      this.$store.dispatch("auth/logout");
      this.$router.push("/");
    },
    
    // 刷新用户数据
    async refreshUserData() {
      if (!this.isAuthenticated) {
        return;
      }
      try {
        const response = await apiHttpClient.get("/user");
        const userData = response.data;
        if (userData && userData.id) {
          this.$store.commit("auth/setUser", userData);
          localStorage.setItem("user_info", JSON.stringify(userData));
          console.log("[GlobalHeader] 用户数据已刷新:", userData);
        }
      } catch (error) {
        console.error("[GlobalHeader] 刷新用户数据失败:", error);
      }
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

    handleAvatarError(event) {
      console.error("[GlobalHeader] 头像加载失败:", event.target.src);
      // 如果加载失败，隐藏图片，显示默认图标
      event.target.style.display = 'none';
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
.dropdown .dropdown-menu {
  min-width: 280px;
  z-index: 1100;
}

nav {
  box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 5%), inset 0 -1px 0 rgb(0 0 0 / 10%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  position: relative;
  z-index: 1050;
}
/* 上传按钮 */
.btn-upload {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  margin-right: 0.5rem;
}

.btn-upload:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
  color: white;
}

/* 主题切换按钮 */
.btn-theme {
  background: none;
  border: none;
  color: rgba(0, 0, 0, 0.55);
  font-size: 1.2rem;
  padding: 0.5rem;
  margin: 0 0.5rem;
  transition: all 0.2s;
  border-radius: 8px;
}

.btn-theme:hover {
  color: rgba(0, 0, 0, 0.9);
  background-color: rgba(0, 0, 0, 0.05);
}

/* 
/* 用户下拉菜单按钮样式 */
.user-dropdown-btn {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(0, 0, 0, 0.55);
  transition: all 0.2s;
}

.user-dropdown-btn:hover {
  color: rgba(0, 0, 0, 0.9);
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}

/* 用户头像 */
.user-avatar {
  font-size: 1.8rem;
  color: #667eea;
}

.user-avatar-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: none;
  margin-right: 0.5rem;
}

.user-name {
  color: inherit;
  font-weight: 500;
  font-size: 0.95rem;
}

/* 角色标签样式 - 扁平化设计，更醒目 */
.badge-admin,
.badge-editor,
.badge-contributor {
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  letter-spacing: 0.5px;
  border: 1px solid transparent;
}

.badge-admin {
  background: #dc3545;
  color: white;
  border-color: #c82333;
}

.badge-editor {
  background: #007bff;
  color: white;
  border-color: #0056b3;
}

.badge-contributor {
  background: #28a745;
  color: white;
  border-color: #1e7e34;
}

/* 下拉菜单 */
.dropdown-menu {
  position: absolute;
  right: 0;
  left: auto;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  z-index: 1100;
}

/* 用户信息头部 */
.dropdown-header {
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;
  margin: -0.5rem 0 0 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar-large {
  font-size: 3rem;
  color: white;
  opacity: 0.9;
}

.user-avatar-large-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.user-name-large {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.user-email {
  font-size: 0.85rem;
  opacity: 0.9;
}

/* 下拉菜单项 */
.dropdown-item {
  padding: 0.6rem 1.5rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
}

.dropdown-item:hover {
  background-color: #f8f9ff;
  color: #667eea;
}

.dropdown-item.text-danger:hover {
  background-color: #fff5f5;
  color: #dc3545;
}

.dropdown-divider {
  margin: 0.5rem 0;
}
</style>
