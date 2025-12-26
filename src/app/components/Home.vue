<template>
  <div class="home">
    <!-- Hero 区域：全屏背景 -->
    <div class="hero-section-fullwidth">
      <div class="container">
        <SearchBar
          :filterState="filterState"
          @update:filterState="onUpdateFilter"
        />
      </div>
    </div>
    
    <!-- 内容区域：正常 container -->
    <div class="container pt-3">
      <CategoryNav
        :activeCategory="filterState.category"
        @update:category="onUpdateCategory"
      />
      <ActiveFilters
        :filterState="filterState"
        @clear="clearFilter"
        @clearAll="clearAllFilters"
      />
      <ResourceList :resources="filteredResources" />
    </div>
    
    <!-- CTA 区域：全屏背景 -->
    <div class="cta-section-fullwidth">
      <div class="container">
        <div class="cta">
          <div class="cta-title">
            <template v-if="isAuthenticated">
              想上传自己的教学资源？加入我们，成为教师贡献者
            </template>
            <template v-else>
              登录后可上传和管理教学资源
            </template>
          </div>
          <div class="cta-actions">
            <!-- 上传按钮：仅 contributor / editor / admin 显示 -->
            <div v-if="canUpload" class="qr-wrapper-center">
              <router-link
                to="/resources/create"
                class="btn upload-btn"
              >
                <i class="bi bi-upload me-2"></i> 上传资源
              </router-link>
            </div>
            
            <!-- 申请成为贡献者按钮：已登录 && role === user（替换原来的二维码位置） -->
            <div
              v-else-if="canApplyContributor"
              class="qr-wrapper qr-wrapper-center"
            >
              <button
                type="button"
                class="btn btn-apply-contributor"
                :class="{
                  'btn-apply-contributor-disabled': isApplying || applicationStatus === 'pending' || applicationStatus === 'approved'
                }"
                @click.stop.prevent="handleApplyContributorClick"
                @mousedown.stop.prevent="handleMouseDown"
                :disabled="isApplying || applicationStatus === 'pending' || applicationStatus === 'approved'"
                :style="(isApplying || applicationStatus === 'pending' || applicationStatus === 'approved') ? 'pointer-events: none; cursor: not-allowed;' : ''"
              >
                <span v-if="isApplying">
                  <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                  提交中...
                </span>
                <span v-else-if="applicationStatus === 'pending'">
                  <i class="bi bi-hourglass-split me-2"></i> 审核中
                </span>
                <span v-else>
                  <i class="bi bi-person-plus-fill me-2"></i> 申请成为贡献者
                </span>
              </button>
            </div>
            
            <!-- 未登录：显示登录按钮 -->
            <div
              v-else
              class="qr-wrapper-center"
            >
              <button
                type="button"
                class="btn btn-apply-contributor"
                @click="showLoginModal = true"
              >
                <i class="bi bi-person-plus-fill me-2"></i> 申请成为贡献者
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <LoginModal
      v-model="showLoginModal"
      @switch-to-register="handleSwitchToRegister"
    />
    <RegisterModal
      v-model="showRegisterModal"
      @switch-to-login="handleSwitchToLogin"
    />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import { apiHttpClient } from "@/app/app.service";
import notification from "@/utils/notification";
import SearchBar from "./SearchBar.vue";
import ResourceList from "./ResourceList.vue";
import CategoryNav from "./CategoryNav.vue";
import ActiveFilters from "./ActiveFilters.vue";
import LoginModal from "./LoginModal.vue";
import RegisterModal from "./RegisterModal.vue";

export default defineComponent({
  name: "Home",
  props: ["user"],

  components: { SearchBar, ResourceList, CategoryNav, ActiveFilters, LoginModal, RegisterModal },
  data() {
    return {
      filterState: {
        keyword: "",
        category: null,
        subjects: [],
        grades: [],
      },
      resources: [],
      showLoginModal: false,
      showRegisterModal: false,
      isApplying: false, // 是否正在提交申请
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
    
    // 是否可以申请成为贡献者：已登录 && role === user
    canApplyContributor() {
      const result = this.isAuthenticated && this.isUser;
      console.log('[Home] canApplyContributor 计算:', result, {
        isAuthenticated: this.isAuthenticated,
        isUser: this.isUser,
        currentUser: this.currentUser,
        userRole: this.currentUser?.role
      });
      return result;
    },
    
    filteredResources() {
      const k = this.filterState.keyword.toLowerCase();
      const c = this.filterState.category;
      const s = this.filterState.subjects;
      const g = this.filterState.grades;
      return this.resources.filter((r) => {
        const byK = !k || r.title.toLowerCase().includes(k);
        const byC = !c || r.category === c;
        const byS = !s.length || s.includes(r.subject);
        const byG = !g.length || g.includes(r.grade);
        return byK && byC && byS && byG;
      });
    },
  },

  watch: {
    "$route.query.q"(newVal) {
      this.filterState.keyword = newVal || "";
    },
    // 监听用户状态变化，重新检查申请状态
    currentUser: {
      handler(newUser) {
        if (newUser && this.canApplyContributor) {
          this.$store.dispatch('auth/checkContributorApplicationStatus');
        }
      },
      immediate: false
    },
    // 监听登录状态变化
    isAuthenticated: {
      handler(isAuth) {
        if (isAuth && this.canApplyContributor) {
          this.$store.dispatch('auth/checkContributorApplicationStatus');
        }
      },
      immediate: false
    }
  },

  async created() {
    // 确保 auth store 已初始化
    if (!this.$store.state.auth?.isAuthenticated) {
      this.$store.dispatch('auth/initAuth');
    }
    
    // 检查申请状态（如果是 user 角色）
    // 使用 setTimeout 确保在下一个事件循环中执行，给 store 足够时间初始化
    setTimeout(async () => {
      if (this.canApplyContributor) {
        console.log('[Home] created - 检查申请状态');
        await this.$store.dispatch('auth/checkContributorApplicationStatus');
        console.log('[Home] created - 申请状态:', this.applicationStatus);
      }
    }, 50);
    
    if (this.$route.query.q) {
      this.filterState.keyword = this.$route.query.q;
    }
    try {
      const response = await apiHttpClient.get("/api/resources");
      // 后端已经做了权限过滤，只返回用户可以查看的资源
      // 前端不需要再次过滤，直接显示后端返回的资源
      // 如果后端返回了资源，说明用户有权限查看（包括未登录用户）
      console.log("[Home] 后端返回的资源数量:", response.data.length);
      this.resources = response.data;
    } catch (error) {
      console.error("获取资源数据失败:", error);
      // 如果 API 调用失败，使用默认数据作为后备
      this.resources = [
        {
          id: 1,
          title: "三年级数学上册第一单元课件",
          category: "课件",
          format: "PPT",
          subject: "数学",
          grade: "三年级",
          downloads: 230,
          createdAt: Date.now() - 3600e3,
          recommended: true,
        },
        {
          id: 2,
          title: "语文一年级识字教案",
          category: "教案",
          format: "DOC",
          subject: "语文",
          grade: "一年级",
          downloads: 540,
          createdAt: Date.now() - 7200e3,
        },
        {
          id: 3,
          title: "英语四年级口语练习试题",
          category: "习题",
          format: "PDF",
          subject: "英语",
          grade: "四年级",
          downloads: 120,
          createdAt: Date.now() - 1800e3,
        },
        {
          id: 5,
          title: "数学六年级毕业总复习教案",
          category: "教案",
          format: "PDF",
          subject: "数学",
          grade: "六年级",
          downloads: 880,
          createdAt: Date.now() - 2600e3,
          recommended: true,
        },
        {
          id: 6,
          title: "语文二年级字词练习试题",
          category: "习题",
          format: "DOC",
          subject: "语文",
          grade: "二年级",
          downloads: 95,
          createdAt: Date.now() - 1600e3,
        },
        {
          id: 7,
          title: "英语三年级自然拼读课件",
          category: "课件",
          format: "PPT",
          subject: "英语",
          grade: "三年级",
          downloads: 412,
          createdAt: Date.now() - 8600e3,
        },
        {
          id: 9,
          title: "语文六年级古诗文资料",
          category: "教材",
          format: "PDF",
          subject: "语文",
          grade: "六年级",
          downloads: 699,
          createdAt: Date.now() - 22600e3,
        },
        {
          id: 10,
          title: "数学一年级认识数字课件",
          category: "课件",
          format: "PPT",
          subject: "数学",
          grade: "一年级",
          downloads: 332,
          createdAt: Date.now() - 9600e3,
        },
      ];
    }
  },
  
  async mounted() {
    // 组件挂载后再次检查申请状态，确保数据已准备好
    if (this.canApplyContributor) {
      await this.$store.dispatch('auth/checkContributorApplicationStatus');
      console.log('[Home] mounted - 申请状态:', this.applicationStatus);
    }
  },
  
  methods: {
    onUpdateFilter(next) {
      this.filterState = next;
    },
    onUpdateCategory(category) {
      this.filterState = { ...this.filterState, category };
    },
    clearFilter(key, value) {
      if (key === "category") {
        this.filterState.category = null;
      } else if (key === "keyword") {
        this.filterState.keyword = "";
      } else if (Array.isArray(this.filterState[key])) {
        this.filterState[key] = this.filterState[key].filter(
          (v) => v !== value
        );
      }
    },
    clearAllFilters() {
      this.filterState = {
        keyword: "",
        category: null,
        subjects: [],
        grades: [],
      };
    },
    handleSwitchToRegister() {
      this.showLoginModal = false;
      // 直接打开注册弹窗
      this.showRegisterModal = true;
    },
    handleSwitchToLogin() {
      this.showRegisterModal = false;
      this.showLoginModal = true;
    },
    
    
    // 处理 mousedown 事件（在 click 之前触发，用于额外防护）
    handleMouseDown(event) {
      if (this.isApplying || this.applicationStatus === 'pending' || this.applicationStatus === 'approved') {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    
    // 处理按钮点击（包装方法，用于阻止禁用状态下的点击）
    handleApplyContributorClick(event) {
      // 如果按钮处于禁用状态，阻止事件
      const isDisabled = this.isApplying || this.applicationStatus === 'pending' || this.applicationStatus === 'approved';
      
      if (isDisabled) {
        event.preventDefault();
        event.stopPropagation();
        console.log('[Home] 按钮处于禁用状态，阻止点击，状态:', this.applicationStatus);
        return;
      }
      
      // 调用实际的处理方法
      this.handleApplyContributor();
    },
    
    // 处理申请成为贡献者
    async handleApplyContributor() {
      // 首先检查状态，如果已申请，直接返回，不显示任何弹窗
      const currentStatus = this.applicationStatus;
      
      if (currentStatus === 'pending' || currentStatus === 'approved') {
        console.log('[Home] 已有申请，阻止点击，状态:', currentStatus);
        return; // 直接返回，不显示任何提示
      }
      
      // 双重检查：防止在禁用状态下仍然被点击
      if (this.isApplying) {
        console.log('[Home] 正在提交中，阻止重复点击');
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
        console.log('[Home] 提交贡献者申请...');
        const response = await apiHttpClient.post('/api/contributor-applications', {});
        console.log('[Home] 申请提交成功:', response.data);
        
        notification.success('已提交申请，等待管理员审核');
        // 立即更新 store 中的状态并保存到 localStorage
        this.$store.dispatch('auth/setContributorApplicationStatus', 'pending');
        console.log('[Home] 申请提交成功，状态已更新为 pending');
      } catch (error) {
        console.error('[Home] 提交申请失败:', error);
        
        // 处理 400 错误：已存在申请
        if (error.response?.status === 400) {
          notification.warning('你已有申请，请勿重复提交');
          // 立即设置为 pending 状态，然后重新检查申请状态，确保前端状态同步
          this.$store.dispatch('auth/setContributorApplicationStatus', 'pending');
          // 使用 nextTick 确保状态更新后再继续
          await this.$nextTick();
          await this.$store.dispatch('auth/checkContributorApplicationStatus');
          console.log('[Home] 检测到已有申请，状态已更新:', this.applicationStatus);
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
  },
});
</script>

<style scoped>
/* Hero 区域：全屏背景，带图案 */
.hero-section-fullwidth {
  width: 100%;
  position: relative;
  padding: 60px 0;
  margin-bottom: 0;
  overflow: hidden;
  /* 浅色主题：渐变背景 + 柔和图案 */
  background: linear-gradient(135deg, rgba(79, 140, 255, 0.1) 0%, rgba(155, 123, 255, 0.1) 100%);
  /* 几何图案叠加 - 浅色主题使用更明显的图案 */
  background-image: 
    radial-gradient(circle at 15% 40%, rgba(79, 140, 255, 0.2) 0%, transparent 60%),
    radial-gradient(circle at 85% 70%, rgba(155, 123, 255, 0.2) 0%, transparent 60%),
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(79, 140, 255, 0.03) 10px,
      rgba(79, 140, 255, 0.03) 20px
    );
  background-size: 100% 100%, 100% 100%, 40px 40px;
  background-position: 0 0, 0 0, 0 0;
}

[data-theme="dark"] .hero-section-fullwidth {
  /* 深色主题：使用更柔和的渐变和图案 */
  background: linear-gradient(135deg, rgba(79, 140, 255, 0.15) 0%, rgba(155, 123, 255, 0.15) 100%);
  /* 深色主题使用更柔和的图案，避免过于突兀 */
  background-image: 
    radial-gradient(circle at 15% 40%, rgba(79, 140, 255, 0.12) 0%, transparent 70%),
    radial-gradient(circle at 85% 70%, rgba(155, 123, 255, 0.12) 0%, transparent 70%),
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 15px,
      rgba(255, 255, 255, 0.02) 15px,
      rgba(255, 255, 255, 0.02) 16px
    );
  background-size: 100% 100%, 100% 100%, 50px 50px;
}

/* 内容区域：增强对比 */
.home > .container.pt-3 {
  background: var(--bg);
  padding-top: 40px;
  padding-bottom: 40px;
  position: relative;
  z-index: 1;
}

/* CTA 区域：全屏背景，带图案 */
.cta-section-fullwidth {
  width: 100%;
  position: relative;
  padding: 50px 0;
  margin-top: 0;
  overflow: hidden;
  /* 浅色主题：渐变背景 + 柔和图案 */
  background: linear-gradient(135deg, rgba(79, 140, 255, 0.08) 0%, rgba(155, 123, 255, 0.08) 100%);
  /* 几何图案叠加 - 浅色主题使用更明显的图案，方向与 Hero 相反 */
  background-image: 
    radial-gradient(circle at 80% 30%, rgba(79, 140, 255, 0.18) 0%, transparent 60%),
    radial-gradient(circle at 20% 70%, rgba(155, 123, 255, 0.18) 0%, transparent 60%),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 10px,
      rgba(155, 123, 255, 0.03) 10px,
      rgba(155, 123, 255, 0.03) 20px
    );
  background-size: 100% 100%, 100% 100%, 40px 40px;
  background-position: 0 0, 0 0, 0 0;
  border-top: 2px solid var(--border);
  border-bottom: 2px solid var(--border);
}

[data-theme="dark"] .cta-section-fullwidth {
  /* 深色主题：使用更柔和的渐变和图案 */
  background: linear-gradient(135deg, rgba(79, 140, 255, 0.12) 0%, rgba(155, 123, 255, 0.12) 100%);
  /* 深色主题使用更柔和的图案，避免过于突兀 */
  background-image: 
    radial-gradient(circle at 80% 30%, rgba(79, 140, 255, 0.1) 0%, transparent 70%),
    radial-gradient(circle at 20% 70%, rgba(155, 123, 255, 0.1) 0%, transparent 70%),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 15px,
      rgba(255, 255, 255, 0.015) 15px,
      rgba(255, 255, 255, 0.015) 16px
    );
  background-size: 100% 100%, 100% 100%, 50px 50px;
}

.cta {
  margin: 0;
  padding: 20px;
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
}

.cta-title {
  font-size: 16px;
  margin-bottom: 12px;
}
.cta-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  position: relative;
}

.qr-wrapper-center {
  width: 100%;
  display: flex;
  justify-content: center;
}

.upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 10px;
  background: linear-gradient(90deg, var(--primary), #2563eb);
  color: #fff;
  border: none;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.12);
  font-weight: 600;
}
.upload-btn i {
  font-size: 18px;
}

/* 申请成为贡献者按钮 - 更醒目的样式 */
.btn-apply-contributor {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4f8cff 0%, #9b7bff 100%);
  color: white;
  border: none;
  box-shadow: 0 8px 24px rgba(79, 140, 255, 0.35),
              0 4px 12px rgba(155, 123, 255, 0.25);
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.btn-apply-contributor::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.btn-apply-contributor:hover:not(:disabled)::before {
  left: 100%;
}

.btn-apply-contributor:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 12px 32px rgba(79, 140, 255, 0.45),
              0 6px 16px rgba(155, 123, 255, 0.35);
  background: linear-gradient(135deg, #5a9aff 0%, #a88bff 100%);
}

.btn-apply-contributor:active:not(:disabled) {
  transform: translateY(-1px) scale(1.01);
  box-shadow: 0 6px 16px rgba(79, 140, 255, 0.35),
              0 3px 8px rgba(155, 123, 255, 0.25);
}

.btn-apply-contributor i {
  font-size: 18px;
}

.btn-apply-contributor:disabled,
.btn-apply-contributor-disabled {
  opacity: 0.7;
  cursor: not-allowed !important;
  pointer-events: none !important;
  transform: none !important;
  box-shadow: 0 4px 12px rgba(79, 140, 255, 0.2) !important;
  background: linear-gradient(135deg, #7ba3ff 0%, #b89fff 100%) !important;
  user-select: none;
}

.btn-apply-contributor:disabled:hover,
.btn-apply-contributor-disabled:hover {
  transform: none !important;
  box-shadow: 0 4px 12px rgba(79, 140, 255, 0.2) !important;
  cursor: not-allowed !important;
  pointer-events: none !important;
}

.btn-apply-contributor:disabled:active,
.btn-apply-contributor-disabled:active {
  transform: none !important;
  pointer-events: none !important;
}
</style>
