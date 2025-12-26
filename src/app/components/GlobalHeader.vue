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
          <!-- 资源下拉菜单 -->
          <li class="nav-item dropdown dropdown-hover">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="resourceDropdown"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
            >
              资源
            </a>
            <div class="dropdown-menu" aria-labelledby="resourceDropdown">
              <router-link class="dropdown-item" to="/posts">
                <i class="bi bi-grid me-2"></i>全部资源
              </router-link>
              <div class="dropdown-divider"></div>
              <router-link 
                v-for="category in resourceCategories" 
                :key="category"
                class="dropdown-item" 
                :to="`/posts?category=${encodeURIComponent(category)}`"
              >
                <i class="bi bi-file-earmark me-2"></i>{{ category }}
              </router-link>
            </div>
          </li>

          <!-- 管理后台：仅管理员可见，带下拉菜单 -->
          <li
            v-if="canAccessAdmin"
            class="nav-item dropdown dropdown-hover"
          >
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="adminDropdown"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i class="bi bi-shield-check"></i> 管理后台
            </a>
            <div class="dropdown-menu" aria-labelledby="adminDropdown">
              <router-link class="dropdown-item" to="/admin">
                <i class="bi bi-house me-2"></i>管理首页
              </router-link>
              <div class="dropdown-divider"></div>
              <router-link class="dropdown-item" to="/admin/users">
                <i class="bi bi-people me-2"></i>用户管理
              </router-link>
              <router-link class="dropdown-item" to="/admin/resources">
                <i class="bi bi-file-earmark-text me-2"></i>资源管理
              </router-link>
              <router-link class="dropdown-item" to="/admin/contributor-applications">
                <i class="bi bi-person-check me-2"></i>贡献者申请
              </router-link>
            </div>
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
                     <li class="nav-item dropdown dropdown-hover">
                       <button
                         class="nav-link dropdown-toggle btn btn-link user-dropdown-btn"
                         type="button"
                         aria-expanded="false"
                       >
                         <div class="user-avatar-wrapper">
                           <img
                             v-if="userAvatarUrl && !avatarError"
                             :src="userAvatarUrl"
                             alt="头像"
                             class="user-avatar-img"
                             @error="handleAvatarError"
                           />
                           <i v-else class="bi bi-person-circle user-avatar-icon"></i>
                         </div>
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
            >
              <li class="dropdown-header">
                <div class="user-info">
                  <div class="user-avatar-large-wrapper">
                    <img
                      v-if="userAvatarUrl && !avatarError"
                      :src="userAvatarUrl"
                      alt="头像"
                      class="user-avatar-large-img"
                      @error="handleAvatarError"
                    />
                    <i v-else class="bi bi-person-circle user-avatar-large-icon"></i>
                  </div>
                  <div>
                    <div class="user-name-large">
                      {{ displayName }}
                    </div>
                    <div class="user-email">{{ currentUser.email || '未设置邮箱' }}</div>
                    <div v-if="currentUser.nickname" class="user-nickname">
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
                >
                  <i class="bi bi-file-earmark-text me-2"></i>我的资源
                </router-link>
              </li>
              <!-- 申请成为贡献者：仅 user 角色显示 -->
              <li v-if="isUser">
                <a
                  href="javascript:void(0)"
                  class="dropdown-item"
                  :class="{ 
                    'text-muted': applicationStatus === 'pending',
                    'disabled': isApplying || applicationStatus === 'pending'
                  }"
                  @click="handleApplyContributor"
                  :style="(isApplying || applicationStatus === 'pending') ? 'pointer-events: none; cursor: not-allowed;' : ''"
                >
                  <i class="bi bi-person-plus me-2"></i>
                  <span v-if="isApplying">提交中...</span>
                  <span v-else-if="applicationStatus === 'pending'">审核中</span>
                  <span v-else>申请成为贡献者</span>
                </a>
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
import { RESOURCE_CATEGORIES } from "@/utils/constants";
import { apiHttpClient } from "@/app/app.service";
import notification from "@/utils/notification";
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
                 avatarError: false, // 头像加载错误标志
                 isApplying: false, // 是否正在提交申请
                 resourceCategories: RESOURCE_CATEGORIES, // 资源分类列表
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
      applicationStatus: "auth/contributorApplicationStatus",
    }),

    // 是否可以上传资源：contributor / editor / admin
    canUpload() {
      return this.isContributor || this.isEditor || this.isAdmin;
    },

    // 是否可以访问管理后台：admin
    canAccessAdmin() {
      return this.isAdmin;
    },

    // 显示名称：优先显示 nickname（昵称），如果没有则显示 username
    displayName() {
      // 只从 store 读取（确保数据是最新的，不读取 localStorage 中的旧数据）
      const user = this.currentUser;
      
      if (!user) {
        console.log("[GlobalHeader] displayName - store 中没有用户数据");
        return '用户';
      }
      
      console.log("[GlobalHeader] displayName - 用户 ID:", user.id);
      console.log("[GlobalHeader] displayName - user.nickname:", user.nickname);
      console.log("[GlobalHeader] displayName - user.username:", user.username);
      console.log("[GlobalHeader] displayName - user.name:", user.name);
      
      // 优先显示 nickname（昵称）
      if (user.nickname !== undefined && user.nickname !== null && String(user.nickname).trim() !== '') {
        console.log("[GlobalHeader] displayName - 使用 nickname:", user.nickname);
        return String(user.nickname).trim();
      }
      
      // 如果没有 nickname，显示 username
      if (user.username !== undefined && user.username !== null && String(user.username).trim() !== '') {
        console.log("[GlobalHeader] displayName - 使用 username:", user.username);
        return String(user.username).trim();
      }
      
      // 兼容 name 字段（旧数据）
      if (user.name !== undefined && user.name !== null && String(user.name).trim() !== '') {
        console.log("[GlobalHeader] displayName - 使用 name:", user.name);
        return String(user.name).trim();
      }
      
      // 最后显示 '用户'
      console.log("[GlobalHeader] displayName - 没有找到名称，返回 '用户'");
      return '用户';
    },

    // 用户头像URL
    userAvatarUrl() {
      const user = this.currentUser;
      if (!user || !user.id) {
        this.avatarError = false; // 重置错误标志
        return null;
      }
      
      console.log("[GlobalHeader] userAvatarUrl - 用户 ID:", user.id);
      console.log("[GlobalHeader] userAvatarUrl - user.avatar_url:", user.avatar_url);
      
      // 如果用户有 avatar_url，重置错误标志并返回URL
      if (user.avatar_url && String(user.avatar_url).trim() !== '') {
        // 如果之前有错误，但用户现在有头像URL，重置错误标志
        if (this.avatarError) {
          this.avatarError = false;
        }
        
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
      
      // 如果没有 avatar_url，尝试使用默认的头像路径（即使后端没有返回 avatar_url，也可能有头像文件）
      // 根据 API 文档，头像访问路径是 /api/users/:userId/avatar
      if (user.id) {
        const defaultAvatarUrl = `/api/users/${user.id}/avatar?t=${Date.now()}`;
        console.log("[GlobalHeader] userAvatarUrl - 使用默认头像路径:", defaultAvatarUrl);
        return defaultAvatarUrl;
      }
      
      // 如果都没有，返回 null 以显示默认图标
      this.avatarError = false; // 重置错误标志
      return null;
    },

    themeIcon() {
      return this.theme === "dark" ? "bi bi-sun" : "bi bi-moon";
    },

    isHomePage() {
      return this.$route.path === "/";
    },
  },
  watch: {
    // 监听 currentUser 的变化，特别是用户 ID 的变化
    'currentUser.id'(newId, oldId) {
      console.log("[GlobalHeader] 检测到用户 ID 变化:", { oldId, newId });
      if (oldId && newId && String(oldId) !== String(newId)) {
        console.log("[GlobalHeader] 用户切换，强制刷新数据");
        // 用户切换，强制刷新数据
        this.refreshUserData();
      }
    },
    // 监听 currentUser 对象的变化
    currentUser: {
      handler(newUser, oldUser) {
        if (newUser && oldUser && String(newUser.id) !== String(oldUser.id)) {
          console.log("[GlobalHeader] 检测到用户切换（通过对象监听）:", { 
            oldUserId: oldUser.id, 
            newUserId: newUser.id,
            oldNickname: oldUser.nickname,
            newNickname: newUser.nickname
          });
        }
      },
      deep: true,
      immediate: true
    }
  },
  async mounted() {
    // 组件挂载时，如果已登录但 currentUser 为空，尝试刷新用户数据
    if (this.isAuthenticated && !this.currentUser) {
      this.refreshUserData();
    }
    
    // 检查 localStorage 和 store 中的用户 ID 是否一致
    try {
      const storedUserInfo = localStorage.getItem('user_info');
      if (storedUserInfo) {
        const parsedStoredUser = JSON.parse(storedUserInfo);
        const storeUserId = this.currentUser?.id;
        const storedUserId = parsedStoredUser?.id;
        
        console.log("[GlobalHeader] mounted - localStorage 用户 ID:", storedUserId);
        console.log("[GlobalHeader] mounted - store 用户 ID:", storeUserId);
        
        if (storeUserId && storedUserId && String(storeUserId) !== String(storedUserId)) {
          console.log("[GlobalHeader] 检测到 localStorage 和 store 中的用户 ID 不一致，同步数据");
          // 使用 localStorage 中的数据更新 store
          this.$store.commit("auth/setUser", parsedStoredUser);
        }
      }
    } catch (e) {
      console.error("[GlobalHeader] 检查用户数据失败:", e);
    }
    
    // 检查申请状态（如果是 user 角色）
    // 使用 setTimeout 确保在下一个事件循环中执行，给 store 足够时间初始化
    setTimeout(async () => {
      if (this.isAuthenticated && this.isUser) {
        console.log('[GlobalHeader] mounted - 检查申请状态');
        await this.$store.dispatch('auth/checkContributorApplicationStatus');
        console.log('[GlobalHeader] mounted - 申请状态:', this.applicationStatus);
      }
    }, 50);
  },
  
  methods: {
    handleLogout() {
      console.log("[GlobalHeader] 执行退出登录");
      this.$store.dispatch("auth/logout");
      this.$router.push("/");
    },
    
    // 检查申请状态（使用 store 的 action）
    async checkApplicationStatus() {
      if (!this.isAuthenticated || !this.isUser) {
        return;
      }
      
      await this.$store.dispatch('auth/checkContributorApplicationStatus');
      console.log('[GlobalHeader] 申请状态已更新:', this.applicationStatus);
    },
    
    // 处理申请成为贡献者
    async handleApplyContributor() {
      // 首先检查状态，如果已申请，直接返回，不显示任何弹窗
      const currentStatus = this.applicationStatus;
      if (currentStatus === 'pending' || currentStatus === 'approved') {
        console.log('[GlobalHeader] 已有申请，阻止点击，状态:', currentStatus);
        return; // 直接返回，不显示任何提示
      }
      
      // 双重检查：防止在禁用状态下仍然被点击
      if (this.isApplying) {
        console.log('[GlobalHeader] 正在提交中，阻止重复点击');
        return;
      }
      
      if (!this.isAuthenticated || !this.isUser) {
        notification.warning('请先登录');
        return;
      }
      
      // 确认弹窗（带同意复选框）
      const confirmed = await notification.confirm(
        '申请成为贡献者后，您将可以上传和管理教学资源。\n\n提交申请后，管理员将审核您的申请。\n\n确认提交申请吗？',
        '申请成为贡献者',
        {
          requireAgreement: true,
          agreementText: '我已阅读并同意遵守<a href="/legal/contributor-responsibilities" target="_blank" style="color: #4f8cff; text-decoration: underline;">《贡献者义务与责任》</a>'
        }
      );
      
      if (!confirmed) {
        return;
      }
      
      this.isApplying = true;
      try {
        console.log('[GlobalHeader] 提交贡献者申请...');
        const response = await apiHttpClient.post('/api/contributor-applications', {});
        console.log('[GlobalHeader] 申请提交成功:', response.data);
        
        notification.success('已提交申请，等待管理员审核');
        // 立即更新 store 中的状态并保存到 localStorage
        this.$store.dispatch('auth/setContributorApplicationStatus', 'pending');
        console.log('[GlobalHeader] 申请提交成功，状态已更新为 pending');
      } catch (error) {
        console.error('[GlobalHeader] 提交申请失败:', error);
        
        // 处理 400 错误：已存在申请
        if (error.response?.status === 400) {
          notification.warning('你已有申请，请勿重复提交');
          // 立即设置为 pending 状态，然后重新检查申请状态，确保前端状态同步
          this.$store.dispatch('auth/setContributorApplicationStatus', 'pending');
          // 使用 nextTick 确保状态更新后再继续
          await this.$nextTick();
          await this.$store.dispatch('auth/checkContributorApplicationStatus');
          console.log('[GlobalHeader] 检测到已有申请，状态已更新:', this.applicationStatus);
          // 不设置 isApplying = false，保持按钮禁用状态
          return;
        }
        
        // 其他错误
        const errorMsg = error.response?.data?.message || 
                        error.response?.data?.error ||
                        error.message ||
                        '提交申请失败，请稍后重试';
        notification.error(errorMsg);
        // 其他错误时，重置 isApplying
        this.isApplying = false;
      }
      // 注意：400 错误时已经在 catch 中 return，不会执行到这里
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
          const currentUser = this.$store.state.auth.user;
          // 检查是否是同一个用户
          const isSameUser = currentUser && String(currentUser.id) === String(userData.id);
          
          let mergedUserData;
          
          if (isSameUser) {
            // 同一个用户：如果后端不返回某些字段，保留旧数据中的这些字段
            mergedUserData = {
              ...userData,
              nickname: (userData.nickname !== undefined && userData.nickname !== null && String(userData.nickname).trim() !== '') 
                ? String(userData.nickname).trim()
                : (currentUser?.nickname && String(currentUser.nickname).trim() !== '' 
                    ? String(currentUser.nickname).trim() 
                    : ''),
              username: (userData.username !== undefined && userData.username !== null && String(userData.username).trim() !== '') 
                ? String(userData.username).trim()
                : (currentUser?.username && String(currentUser.username).trim() !== '' 
                    ? String(currentUser.username).trim() 
                    : ''),
              name: userData.name || currentUser?.name || '',
              // avatar_url: 如果后端返回了有效值，使用后端数据；如果后端返回 null/undefined，保留旧数据
              avatar_url: (userData.avatar_url !== undefined && userData.avatar_url !== null && String(userData.avatar_url).trim() !== '') 
                ? String(userData.avatar_url).trim()
                : (currentUser?.avatar_url && String(currentUser.avatar_url).trim() !== '' 
                    ? String(currentUser.avatar_url).trim() 
                    : null),
            };
          } else {
            // 不同用户：完全使用新用户的数据
            mergedUserData = {
              ...userData,
              nickname: userData.nickname || '',
              username: userData.username || '',
              name: userData.name || '',
              // 确保 avatar_url 字段被保留
              avatar_url: userData.avatar_url || null,
            };
          }
          
          console.log("[GlobalHeader] userData.avatar_url:", userData?.avatar_url);
          console.log("[GlobalHeader] currentUser.avatar_url:", currentUser?.avatar_url);
          console.log("[GlobalHeader] 刷新后的 avatar_url:", mergedUserData.avatar_url);
          
          this.$store.commit("auth/setUser", mergedUserData);
          localStorage.setItem("user_info", JSON.stringify(mergedUserData));
          console.log("[GlobalHeader] 用户数据已刷新:", mergedUserData);
          console.log("[GlobalHeader] 刷新后的 nickname:", mergedUserData.nickname);
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
      // 标记头像加载失败，显示默认图标
      this.avatarError = true;
      // 隐藏图片
      if (event.target) {
        event.target.style.display = 'none';
      }
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

/* 管理后台下拉菜单样式 */
.navbar-nav .nav-item.dropdown .dropdown-menu {
  min-width: 200px;
  margin-top: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid #dee2e6;
  left: 0;
  right: auto;
}

.navbar-nav .nav-item.dropdown .dropdown-toggle {
  cursor: pointer;
}

.navbar-nav .nav-item.dropdown .dropdown-toggle::after {
  margin-left: 0.5rem;
  vertical-align: 0.15em;
}

.navbar-nav .nav-item.dropdown .dropdown-item {
  padding: 0.75rem 1.25rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  color: #495057;
}

.navbar-nav .nav-item.dropdown .dropdown-item:hover {
  background-color: #f8f9fa;
  color: var(--primary, #4f8cff);
}

.navbar-nav .nav-item.dropdown .dropdown-item i {
  width: 20px;
  text-align: center;
  margin-right: 0.5rem;
}

.navbar-nav .nav-item.dropdown .dropdown-divider {
  margin: 0.5rem 0;
  border-top: 1px solid #e9ecef;
}

nav {
  box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 5%), inset 0 -1px 0 rgb(0 0 0 / 10%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  position: relative;
  z-index: 1050;
}
/* 上传按钮 - 使用主题蓝色 */
.btn-upload {
  background: var(--primary);
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
  box-shadow: 0 2px 8px rgba(79, 140, 255, 0.3);
  margin-right: 0.5rem;
}

.btn-upload:hover {
  background: #3d7ae8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 140, 255, 0.4);
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

/* 用户头像容器 */
.user-avatar-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  flex-shrink: 0;
}

/* 用户头像图片 */
.user-avatar-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e9ecef;
  display: block;
}

/* 用户头像默认图标 */
.user-avatar-icon {
  font-size: 2rem;
  color: var(--primary, #4f8cff);
  display: block;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
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
  background: var(--primary);
  color: white;
  border-radius: 12px 12px 0 0;
  margin: -0.5rem 0 0 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* 下拉菜单头像容器 */
.user-avatar-large-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 60px;
  height: 60px;
}

/* 下拉菜单大头像图片 */
.user-avatar-large-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: block;
}

/* 下拉菜单大头像默认图标 */
.user-avatar-large-icon {
  font-size: 3.5rem;
  color: rgba(255, 255, 255, 0.95);
  display: block;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
}

.user-name-large {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
  color: #ffffff;
}

[data-theme="dark"] .user-name-large {
  color: #ffffff;
}

.user-email {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 0.25rem;
}

[data-theme="dark"] .user-email {
  color: rgba(255, 255, 255, 0.9);
}

.user-nickname {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.85);
}

[data-theme="dark"] .user-nickname {
  color: rgba(255, 255, 255, 0.8);
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
  color: var(--primary);
}

.dropdown-item.text-danger:hover {
  background-color: #fff5f5;
  color: #dc3545;
}

.dropdown-divider {
  margin: 0.5rem 0;
}
</style>
