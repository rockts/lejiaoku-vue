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
      try {
        const response = await apiHttpClient.get("/posts");
        // 转换后端数据格式为前端需要的格式
        this.resources = response.data.map((item) => ({
          id: item.id,
          title: item.title,
          category: item.category || "其他",
          format: this.guessFormat(item.file?.filename),
          subject: item.subject || "未分类",
          grade: item.grade || "未分级",
          downloads: item.totalDownloads || 0,
          createdAt: new Date(item.created_at).getTime(),
          recommended: false, // 后端暂无推荐字段
        }));
      } catch (error) {
        console.error("获取资源列表失败:", error);
        // 如果API失败,使用mock数据作为后备
        this.resources = this.getMockData();
      } finally {
        this.loading = false;
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
    getMockData() {
      return [
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
      ];
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
