<template>
  <div class="PostList my-3">
    <!-- 搜索和筛选面板 -->
    <div class="container filter-panel mb-4 p-3 bg-light rounded">
      <div class="row g-2">
        <div class="col-md-2">
          <label class="form-label small">年级</label>
          <input
            v-model="filters.grade"
            type="text"
            class="form-control form-control-sm"
            placeholder="如：二年级"
          />
        </div>
        <div class="col-md-2">
          <label class="form-label small">学科</label>
          <input
            v-model="filters.subject"
            type="text"
            class="form-control form-control-sm"
            placeholder="如：语文"
          />
        </div>
        <div class="col-md-2">
          <label class="form-label small">教材版本</label>
          <input
            v-model="filters.textbook_version"
            type="text"
            class="form-control form-control-sm"
            placeholder="如：人教版"
          />
        </div>
        <div class="col-md-2">
          <label class="form-label small">册别</label>
          <input
            v-model="filters.volume"
            type="text"
            class="form-control form-control-sm"
            placeholder="如：上册"
          />
        </div>
        <div class="col-md-2">
          <label class="form-label small">章节关键词</label>
          <input
            v-model="filters.chapter_keyword"
            type="text"
            class="form-control form-control-sm"
            placeholder="如：春天"
          />
        </div>
        <div class="col-md-2 d-flex align-items-end">
          <button @click="applyFilters" class="btn btn-primary btn-sm w-100">
            搜索
          </button>
          <button
            @click="clearFilters"
            class="btn btn-outline-secondary btn-sm w-100 ms-2"
          >
            重置
          </button>
        </div>
      </div>
      <!-- 结果统计 -->
      <div v-if="!loading && total > 0" class="mt-2 text-muted small">
        共 {{ total }} 条结果，当前第 {{ currentPage }}/{{ totalPages }} 页
      </div>
    </div>

    <div v-if="loading">加载中...</div>
    <div class="container">
      <!-- <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4"> -->
      <PostListItem
        v-for="resource in resources"
        :item="resource"
        :key="resource.id"
        class="shadow p-3 mb-5 bg-body rounded"
      />
      <!-- </div> -->
      
      <!-- 分页控件 -->
      <nav v-if="!loading && totalPages > 1" aria-label="分页" class="mt-4">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
              上一页
            </button>
          </li>
          <li
            v-for="page in displayPages"
            :key="page"
            class="page-item"
            :class="{ active: page === currentPage }"
          >
            <button class="page-link" @click="changePage(page)">
              {{ page }}
            </button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
              下一页
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters, mapActions } from "vuex";
import PostListItem from "./PostListItem.vue";

export default defineComponent({
  name: "PostList",

  data() {
    return {
      filters: {
        grade: "",
        subject: "",
        textbook_version: "",
        volume: "",
        chapter_keyword: "",
      },
      currentPage: 1,
      pageSize: 30,
      total: 0,
    };
  },

  async created() {
    // 初始加载时使用分页参数
    this.fetchFilteredResources({ page: 1, limit: this.pageSize });
  },

  computed: {
    ...mapGetters({
      loading: "post/index/loading",
      resources: "post/index/resources",
      totalcount: "post/index/totalcount",
    }),

    totalPages() {
      return Math.ceil(this.total / this.pageSize);
    },

    displayPages() {
      const pages = [];
      const maxDisplay = 5;
      let start = Math.max(1, this.currentPage - 2);
      let end = Math.min(this.totalPages, start + maxDisplay - 1);
      
      if (end - start < maxDisplay - 1) {
        start = Math.max(1, end - maxDisplay + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },
  },

  methods: {
    ...mapActions({
      getResources: "post/index/getResources",
    }),

    applyFilters() {
      // 构建查询参数
      const params = {
        page: 1, // 搜索时重置到第一页
        limit: this.pageSize,
      };
      
      Object.keys(this.filters).forEach((key) => {
        if (this.filters[key].trim()) {
          params[key] = this.filters[key].trim();
        }
      });

      console.log("[PostList] 应用筛选，参数:", params);

      this.currentPage = 1;
      // 调用 API 获取过滤后的资源
      this.fetchFilteredResources(params);
    },

    clearFilters() {
      this.filters = {
        grade: "",
        subject: "",
        textbook_version: "",
        volume: "",
        chapter_keyword: "",
      };
      this.currentPage = 1;
      console.log("[PostList] 清除筛选");
      this.fetchFilteredResources({ page: 1, limit: this.pageSize });
    },

    changePage(page) {
      if (page < 1 || page > this.totalPages || page === this.currentPage) {
        return;
      }
      this.currentPage = page;
      
      const params = {
        page: this.currentPage,
        limit: this.pageSize,
      };
      
      Object.keys(this.filters).forEach((key) => {
        if (this.filters[key].trim()) {
          params[key] = this.filters[key].trim();
        }
      });
      
      console.log(`[PostList] 切换到第 ${page} 页，参数:`, params);
      this.fetchFilteredResources(params);
      
      // 滚动到顶部
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    async fetchFilteredResources(params) {
      this.$store.commit("post/index/setLoading", true);
      try {
        const { apiHttpClient } = await import("@/app/app.service");
        const response = await apiHttpClient.get("/api/resources", { params });
        console.log("[PostList] 过滤结果:", response.data);
        console.log("[PostList] 响应头:", response.headers);
        
        // 从响应中获取总数
        const totalCount = response.headers['x-total-count'] || response.data.length;
        this.total = parseInt(totalCount) || response.data.length;
        
        console.log(`[PostList] 总计 ${this.total} 条，当前第 ${this.currentPage}/${this.totalPages} 页`);
        
        this.$store.commit("post/index/setResources", response.data);
      } catch (error) {
        console.error("[PostList] 过滤失败:", error);
      } finally {
        this.$store.commit("post/index/setLoading", false);
      }
    },
  },

  components: {
    PostListItem,
  },
});
</script>

<style scoped>
.filter-panel {
  border: 1px solid #dee2e6;
}
</style>
