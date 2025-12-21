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

export default defineComponent({
  name: "Home",
  props: ["user"],

  components: { SearchBar, ResourceList, CategoryNav, ActiveFilters },
  data() {
    return {
      filterState: {
        keyword: "",
        category: null,
        subjects: [],
        grades: [],
        formats: [],
      },
      resources: [
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
          id: 4,
          title: "科学二年级观察视频",
          category: "视频",
          format: "MP4",
          subject: "科学",
          grade: "二年级",
          downloads: 310,
          createdAt: Date.now() - 5400e3,
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
          id: 8,
          title: "科学五年级项目式学习视频",
          category: "视频",
          format: "MP4",
          subject: "科学",
          grade: "五年级",
          downloads: 267,
          createdAt: Date.now() - 12600e3,
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
      ],
    };
  },
  computed: {
    filteredResources() {
      const k = this.filterState.keyword.toLowerCase();
      const c = this.filterState.category;
      const s = this.filterState.subjects;
      const g = this.filterState.grades;
      const f = this.filterState.formats;
      return this.resources.filter((r) => {
        const byK = !k || r.title.toLowerCase().includes(k);
        const byC = !c || r.category === c;
        const byS = !s.length || s.includes(r.subject);
        const byG = !g.length || g.includes(r.grade);
        const byF = !f.length || f.includes(r.format);
        return byK && byC && byS && byG && byF;
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
        formats: [],
      };
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
