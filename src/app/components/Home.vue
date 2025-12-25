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
        <div class="cta-actions" :class="{ 'justify-center': !isAuthenticated }">
          <!-- 已登录：显示上传按钮 -->
          <router-link
            v-if="isAuthenticated"
            to="/resources/create"
            class="btn upload-btn"
          >
            <i class="bi bi-upload me-2"></i> 上传资源
          </router-link>
          <!-- 未登录：不显示上传按钮 -->
          <div
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
    };
  },
  computed: {
    isAuthenticated() {
      // 检查 localStorage（最可靠的方式）
      const token = localStorage.getItem('auth_token');
      const userInfo = localStorage.getItem('user_info');
      
      // 只有当 token 和 userInfo 都存在时才认为已登录
      if (!token || !userInfo) {
        return false;
      }
      
      // 如果 localStorage 有值，再检查 store 状态（如果 store 已初始化）
      try {
        const storeAuth = this.$store?.state?.auth?.isAuthenticated;
        // 如果 store 显示未登录，以 store 为准（可能刚登出）
        if (storeAuth === false) {
          return false;
        }
        // 如果 store 显示已登录，返回 true
        if (storeAuth === true) {
          return true;
        }
      } catch (e) {
        // store 未初始化，使用 localStorage 的值
      }
      
      // 默认：有 token 和 userInfo 就认为已登录
      return true;
    },
  },

  watch: {
    "$route.query.q"(newVal) {
      this.filterState.keyword = newVal || "";
    },
  },

  async created() {
    // 确保 auth store 已初始化
    if (!this.$store.state.auth?.isAuthenticated) {
      this.$store.dispatch('auth/initAuth');
    }
    
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
  computed: {
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
</style>
