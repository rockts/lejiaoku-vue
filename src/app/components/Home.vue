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

      <!-- 加载状态 -->
      <div v-if="loading" class="text-center my-5">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">加载中...</span>
        </div>
        <p class="mt-2 text-muted">正在加载资源...</p>
      </div>

      <!-- 资源列表 -->
      <ResourceList v-else :resources="filteredResources" />

      <div class="cta">
        <div class="cta-title">
          想上传自己的教学资源？加入我们，成为教师贡献者
        </div>
        <div class="cta-actions">
          <router-link to="/posts/create" class="btn btn-primary"
            >上传资源</router-link
          >
          <router-link to="#" class="btn btn-outline-primary"
            >申请成为贡献者</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import SearchBar from "./SearchBar.vue";
import ResourceList from "./ResourceList.vue";
import CategoryNav from "./CategoryNav.vue";
import ActiveFilters from "./ActiveFilters.vue";
import { apiHttpClient } from "@/app/app.service";

export default defineComponent({
  name: "Home",
  props: ["user"],

  components: { SearchBar, ResourceList, CategoryNav, ActiveFilters },
  data() {
    return {
      loading: false,
      filterState: {
        keyword: "",
        category: null,
        subjects: [],
        grades: [],
      },
      resources: [],
    };
  },
  async created() {
    await this.fetchResources();

    // 监听资源创建事件
    window.addEventListener("resource-created", this.handleResourceCreated);
  },
  beforeUnmount() {
    // 清理事件监听
    window.removeEventListener("resource-created", this.handleResourceCreated);
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
    async fetchResources() {
      this.loading = true;
      console.log("[Home] 开始获取资源列表...");
      console.log("[Home] 请求接口: GET /api/resources");

      try {
        const response = await apiHttpClient.get("/api/resources");

        console.log("[Home] 接口响应状态:", response.status);
        console.log("[Home] 接口返回数据:", response.data);
        console.log(
          "[Home] 返回数据类型:",
          Array.isArray(response.data) ? "数组" : typeof response.data
        );
        console.log(
          "[Home] 返回数据数量:",
          Array.isArray(response.data) ? response.data.length : "N/A"
        );

        if (!Array.isArray(response.data)) {
          console.error("[Home] 错误: 接口返回数据不是数组", response.data);
          this.resources = [];
          return;
        }

        if (response.data.length === 0) {
          console.warn(
            "[Home] 接口返回空数组 - 这是正常的数据状态(暂无approved资源)"
          );
          this.resources = [];
          return;
        }

        // 转换后端数据格式为前端需要的格式，并过滤非 approved 状态的资源
        this.resources = response.data
          .filter((item) => {
            // 只显示已审核通过的资源
            if (item.status !== "approved") {
              console.log(
                "[Home] 过滤掉未审核资源:",
                item.id,
                item.title,
                "status:",
                item.status
              );
              return false;
            }
            return true;
          })
          .map((item) => {
            console.log("[Home] 处理资源项:", {
              id: item.id,
              title: item.title,
              category: item.category,
            });
            return {
              id: item.id,
              title: item.title,
              category: item.category || "其他",
              format: this.guessFormat(item.file?.filename || item.file_format),
              subject: item.subject || "未分类",
              grade: item.grade || "未分级",
              downloads: item.totalDownloads || 0,
              createdAt: new Date(item.created_at).getTime(),
              recommended: false,
              fileUrl: item.file?.url || item.file_url, // 文件下载 URL
              coverUrl: item.cover_url, // 封面图 URL
            };
          });

        console.log("[Home] 成功加载资源数量:", this.resources.length);
        console.log("[Home] 转换后的资源数据:", this.resources);
      } catch (error) {
        console.error("[Home] 接口请求失败:", error);
        console.error("[Home] 错误详情:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });

        // 明确说明这是接口问题,不使用mock数据
        if (error.response?.status === 404) {
          console.error("[Home] 接口问题: /api/resources 不存在 (404)");
        } else if (error.response?.status === 500) {
          console.error("[Home] 接口问题: 服务器内部错误 (500)");
        } else if (error.response?.status === 401) {
          console.error("[Home] 接口问题: 未授权 (401) - 可能需要登录");
        } else if (!error.response) {
          console.error("[Home] 接口问题: 网络错误或后端未启动");
        } else {
          console.error("[Home] 接口问题: 未知错误");
        }

        this.resources = [];
      } finally {
        this.loading = false;
        console.log("[Home] 资源加载流程结束");
      }
    },
    guessFormat(filename) {
      if (!filename) return "未知";
      const ext = filename.split(".").pop().toUpperCase();
      const formatMap = {
        PPTX: "PPT",
        PPT: "PPT",
        DOCX: "DOC",
        DOC: "DOC",
        PDF: "PDF",
        MP4: "MP4",
        AVI: "MP4",
        JPG: "图片",
        PNG: "图片",
        JPEG: "图片",
      };
      return formatMap[ext] || ext;
    },
    async handleResourceCreated() {
      console.log("[Home] 收到资源创建事件,开始刷新列表...");
      await this.fetchResources();
      console.log("[Home] 资源列表刷新完成");
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
}
</style>
