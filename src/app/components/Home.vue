<template>
  <div class="home pt-3">
    <div class="container">
      <SearchBar
        :filterState="filterState"
        @update:filterState="onUpdateFilter"
      />
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
      <div class="cta">
        <div class="cta-title">
          <template v-if="isAuthenticated">
            想上传自己的教学资源？加入我们，成为教师贡献者
          </template>
          <template v-else>
            登录后可上传和管理教学资源
          </template>
        </div>
        <div class="cta-actions" :class="{ 'justify-center': !canUpload }">
          <!-- 上传按钮：仅 contributor / editor / admin 显示 -->
          <router-link
            v-if="canUpload"
            to="/resources/create"
            class="btn upload-btn"
          >
            <i class="bi bi-upload me-2"></i> 上传资源
          </router-link>
          
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
              @click="handleApplyContributor"
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
          
          <!-- 未登录：显示二维码 -->
          <div
            v-else
            class="qr-wrapper"
            @mouseenter="showQR = true"
            @mouseleave="showQR = false"
          >
            <router-link to="#" class="btn btn-outline-primary"
              >申请成为贡献者</router-link
            >
            <div v-if="showQR" class="qr-popover">
              <img
                class="qr-image"
                :src="qrSrc"
                alt="扫码成为贡献者"
                @error="qrError = true"
              />
              <div class="qr-caption">
                {{
                  qrError
                    ? "未找到二维码，请在 public/ 放置 qr-contributor.jpg"
                    : "申请成为贡献者"
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <LoginModal
      v-model="showLoginModal"
      @switch-to-register="handleSwitchToRegister"
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

export default defineComponent({
  name: "Home",
  props: ["user"],

  components: { SearchBar, ResourceList, CategoryNav, ActiveFilters, LoginModal },
  data() {
    return {
      filterState: {
        keyword: "",
        category: null,
        subjects: [],
        grades: [],
      },
      resources: [],
      showQR: false,
      qrError: false,
      qrSrc: process.env.BASE_URL + "qr-contributor.jpg",
      showLoginModal: false,
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
      await this.checkApplicationStatus();
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
      // 跳转到注册页面（如果存在）或显示提示
      notification.info("请通过首页右上角注册按钮进行注册");
    },
    
    
    // 处理申请成为贡献者
    async handleApplyContributor() {
      // 双重检查：防止在禁用状态下仍然被点击
      if (this.isApplying || this.applicationStatus === 'pending' || this.applicationStatus === 'approved') {
        if (this.applicationStatus === 'pending' || this.applicationStatus === 'approved') {
          notification.info('您的申请正在审核中，请耐心等待');
        }
        return;
      }
      
      if (!this.isAuthenticated || !this.isUser) {
        notification.warning('请先登录');
        return;
      }
      
      // 确认弹窗
      const confirmed = await notification.confirm(
        '申请成为贡献者后，您将可以上传和管理教学资源。\n\n提交申请后，管理员将审核您的申请。\n\n确认提交申请吗？',
        '申请成为贡献者'
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
        // 更新 store 中的状态
        this.$store.dispatch('auth/setContributorApplicationStatus', 'pending');
      } catch (error) {
        console.error('[Home] 提交申请失败:', error);
        
        // 处理 400 错误：已存在申请
        if (error.response?.status === 400) {
          notification.warning('你已有申请，请勿重复提交');
          // 重新检查申请状态，确保前端状态同步
          await this.$store.dispatch('auth/checkContributorApplicationStatus');
          return;
        }
        
        // 其他错误
        const errorMsg = error.response?.data?.message || 
                        error.response?.data?.error ||
                        error.message ||
                        '提交申请失败，请稍后重试';
        notification.error(errorMsg);
      } finally {
        this.isApplying = false;
      }
    },
  },
});
</script>

<style scoped>
.cta {
  margin: 32px 0;
  padding: 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow);
}
.cta-title {
  font-size: 16px;
  margin-bottom: 12px;
}
.cta-actions {
  display: flex;
  gap: 12px;
  position: relative;
}
.cta-actions.justify-center {
  justify-content: center;
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

.qr-wrapper {
  position: relative;
  display: inline-block;
}

.qr-popover {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 12px;
  z-index: 10;
}

.qr-image {
  width: 240px;
  height: auto;
  display: block;
}

.qr-caption {
  text-align: center;
  font-size: 14px;
  color: var(--text-secondary, #666);
  margin-top: 8px;
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
