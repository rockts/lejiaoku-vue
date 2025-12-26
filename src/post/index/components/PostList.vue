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
            @input="debouncedApplyFilters"
          />
        </div>
        <div class="col-md-2">
          <label class="form-label small">学科</label>
          <input
            v-model="filters.subject"
            type="text"
            class="form-control form-control-sm"
            placeholder="如：语文"
            @input="debouncedApplyFilters"
          />
        </div>
        <div class="col-md-2">
          <label class="form-label small">教材版本</label>
          <input
            v-model="filters.textbook_version"
            type="text"
            class="form-control form-control-sm"
            placeholder="如：人教版"
            @input="debouncedApplyFilters"
          />
        </div>
        <div class="col-md-2">
          <label class="form-label small">册别</label>
          <input
            v-model="filters.volume"
            type="text"
            class="form-control form-control-sm"
            placeholder="如：上册"
            @input="debouncedApplyFilters"
          />
        </div>
        <div class="col-md-2">
          <label class="form-label small">章节关键词</label>
          <input
            v-model="filters.chapter_keyword"
            type="text"
            class="form-control form-control-sm"
            placeholder="如：春天"
            @input="debouncedApplyFilters"
          />
        </div>
        <div class="col-md-2 d-flex align-items-end" style="gap: 0.75rem;">
          <button @click="applyFilters" class="btn btn-primary btn-sm flex-fill">
            <i class="bi bi-search me-1"></i>搜索
          </button>
          <button
            @click="clearFilters"
            class="btn btn-outline-secondary btn-sm flex-fill"
          >
            <i class="bi bi-arrow-counterclockwise me-1"></i>重置
          </button>
        </div>
      </div>
      <!-- 结果统计 -->
      <div v-if="!loading && total > 0" class="mt-2 text-muted small">
        共 {{ total }} 条结果，当前第 {{ currentPage }}/{{ totalPages }} 页
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">加载中...</span>
      </div>
      <p class="mt-3 text-muted">加载中...</p>
    </div>
    
    <!-- 空状态占位符 -->
    <div v-else-if="!loading && resources.length === 0" class="container">
      <div class="empty-state text-center py-5">
        <div class="empty-icon mb-4">
          <i class="bi bi-inbox" style="font-size: 4rem; color: var(--muted, #6c757d);"></i>
        </div>
        <h4 class="empty-title mb-3" style="color: var(--text, #1f2937);">
          {{ getEmptyStateTitle() }}
        </h4>
        <p class="empty-description text-muted mb-4" style="color: var(--muted, #6c757d);">
          {{ getEmptyStateDescription() }}
        </p>
        <div class="empty-actions">
          <button 
            v-if="hasFilters" 
            @click="clearFilters" 
            class="btn btn-outline-primary me-2"
          >
            <i class="bi bi-arrow-counterclockwise me-1"></i>清除筛选条件
          </button>
          <router-link to="/" class="btn btn-primary">
            <i class="bi bi-house me-1"></i>返回首页
          </router-link>
        </div>
      </div>
    </div>
    
    <!-- 资源列表 -->
    <div v-else class="container">
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
            <button
              class="page-link"
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
            >
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
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
          >
            <button
              class="page-link"
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
            >
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
import { debounce } from "@/utils/utils";

export default defineComponent({
  name: "PostList",

  data() {
    return {
      filters: {
        category: "",
        grade: "",
        subject: "",
        textbook_version: "",
        volume: "",
        chapter_keyword: "",
      },
      currentPage: 1,
      pageSize: 30,
      total: 0,
      debouncedApplyFilters: null, // 防抖函数实例
    };
  },

  async created() {
    // 创建防抖函数实例（延迟600ms执行搜索）
    this.debouncedApplyFilters = debounce(() => {
      this.applyFilters();
    }, 600);

    // 初始加载
    this.loadFiltersFromQuery();
    this.loadResources();
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

    // 检查是否有筛选条件
    hasFilters() {
      return !!(
        this.filters.category ||
        this.filters.grade ||
        this.filters.subject ||
        this.filters.textbook_version ||
        this.filters.volume ||
        this.filters.chapter_keyword
      );
    },
  },

  watch: {
    // 监听路由变化，当 URL query 参数变化时重新加载数据
    '$route.query': {
      handler(newQuery, oldQuery) {
        // 检查 category 或其他筛选参数是否变化
        const queryChanged = 
          newQuery.category !== oldQuery?.category ||
          newQuery.grade !== oldQuery?.grade ||
          newQuery.subject !== oldQuery?.subject ||
          newQuery.textbook_version !== oldQuery?.textbook_version ||
          newQuery.volume !== oldQuery?.volume ||
          newQuery.chapter_keyword !== oldQuery?.chapter_keyword ||
          newQuery.page !== oldQuery?.page;
        
        if (queryChanged) {
          console.log("[PostList] 检测到路由 query 参数变化，重新加载数据");
          this.loadFiltersFromQuery();
          this.loadResources();
        }
      },
      deep: true,
      immediate: false
    }
  },

  methods: {
    ...mapActions({
      getResources: "post/index/getResources",
    }),

    // 从 URL query 参数读取筛选条件
    loadFiltersFromQuery() {
      const query = this.$route.query;
      if (query.category) {
        this.filters.category = decodeURIComponent(query.category);
      } else {
        this.filters.category = "";
      }
      if (query.grade) {
        this.filters.grade = decodeURIComponent(query.grade);
      } else {
        this.filters.grade = "";
      }
      if (query.subject) {
        this.filters.subject = decodeURIComponent(query.subject);
      } else {
        this.filters.subject = "";
      }
      if (query.textbook_version) {
        this.filters.textbook_version = decodeURIComponent(query.textbook_version);
      } else {
        this.filters.textbook_version = "";
      }
      if (query.volume) {
        this.filters.volume = decodeURIComponent(query.volume);
      } else {
        this.filters.volume = "";
      }
      if (query.chapter_keyword) {
        this.filters.chapter_keyword = decodeURIComponent(query.chapter_keyword);
      } else {
        this.filters.chapter_keyword = "";
      }
      if (query.page) {
        this.currentPage = parseInt(query.page) || 1;
      } else {
        this.currentPage = 1;
      }
      console.log("[PostList] loadFiltersFromQuery - 筛选条件:", this.filters);
    },

    // 加载资源数据
    loadResources() {
      const params = {
        page: this.currentPage,
        limit: this.pageSize,
      };
      Object.keys(this.filters).forEach((key) => {
        const value = this.filters[key];
        if (value && String(value).trim()) {
          params[key] = String(value).trim();
        }
      });
      console.log("[PostList] loadResources - 请求参数:", params);
      this.fetchFilteredResources(params);
    },

    applyFilters() {
      // 构建查询参数
      const params = {
        page: 1, // 搜索时重置到第一页
        limit: this.pageSize,
      };

      const query = {};
      Object.keys(this.filters).forEach((key) => {
        const value = this.filters[key];
        if (value && String(value).trim()) {
          params[key] = String(value).trim();
          query[key] = String(value).trim();
        }
      });

      console.log("[PostList] 应用筛选，参数:", params);

      this.currentPage = 1;
      // 更新 URL query 参数
      this.$router.replace({ path: '/posts', query });
      // 调用 API 获取过滤后的资源
      this.fetchFilteredResources(params);
    },

    clearFilters() {
      this.filters = {
        category: "",
        grade: "",
        subject: "",
        textbook_version: "",
        volume: "",
        chapter_keyword: "",
      };
      this.currentPage = 1;
      console.log("[PostList] 清除筛选");
      // 清除 URL 参数
      this.$router.replace({ path: '/posts', query: {} });
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

      const query = { page: String(page) };
      Object.keys(this.filters).forEach((key) => {
        const value = this.filters[key];
        if (value && String(value).trim()) {
          params[key] = String(value).trim();
          query[key] = String(value).trim();
        }
      });

      console.log(`[PostList] 切换到第 ${page} 页，参数:`, params);
      
      // 更新 URL query 参数
      this.$router.replace({ path: '/posts', query });
      this.fetchFilteredResources(params);

      // 滚动到顶部
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    // 获取空状态标题
    getEmptyStateTitle() {
      if (this.hasFilters) {
        if (this.filters.category) {
          return `暂无${this.filters.category}类型的资源`;
        }
        return "未找到符合条件的资源";
      }
      return "暂无资源";
    },

    // 获取空状态描述
    getEmptyStateDescription() {
      if (this.hasFilters) {
        if (this.filters.category) {
          return `当前筛选条件下没有找到${this.filters.category}类型的资源，请尝试调整筛选条件或返回首页浏览其他资源。`;
        }
        return "当前筛选条件下没有找到符合条件的资源，请尝试调整筛选条件或返回首页浏览其他资源。";
      }
      return "目前还没有资源，请稍后再来查看。";
    },

    async fetchFilteredResources(params) {
      this.$store.commit("post/index/setLoading", true);
      try {
        const { apiHttpClient } = await import("@/app/app.service");
        console.log("[PostList] fetchFilteredResources - 请求参数:", JSON.stringify(params, null, 2));
        const response = await apiHttpClient.get("/api/resources", { params });
        console.log("[PostList] 过滤结果:", response.data);
        console.log("[PostList] 响应头:", response.headers);
        
        // 检查返回的资源类型
        if (params.category && response.data.length > 0) {
          const categories = [...new Set(response.data.map(r => r.category))];
          console.log(`[PostList] 返回的资源类型:`, categories);
          console.log(`[PostList] 请求的类型:`, params.category);
        }
        try {
          // 输出前 5 条资源的关键封面字段，方便排查前端封面逻辑
          console.debug(
            "[PostList] sample resources (id, cover_url, cover.id, auto_cover_url, textbook_info):",
            JSON.stringify(
              response.data.slice(0, 5).map((r) => ({
                id: r.id,
                cover_url: r.cover_url,
                cover_id: r.cover && r.cover.id,
                auto_cover_url: r.auto_cover_url,
                textbook_info_cover:
                  r.textbook_info && r.textbook_info.cover_url,
              })),
              null,
              2
            )
          );
        } catch (err) {
          console.debug("[PostList] sample logging failed", err);
        }

        // 从响应中获取总数
        const totalCount =
          response.headers["x-total-count"] || response.data.length;
        this.total = parseInt(totalCount) || response.data.length;

        console.log(
          `[PostList] 总计 ${this.total} 条，当前第 ${this.currentPage}/${this.totalPages} 页`
        );

        // 后端已经做了权限过滤，只返回用户可以查看的资源
        // 如果后端支持 category 参数，则已经过滤；如果不支持，前端需要再次过滤
        console.log("[PostList] 后端返回的资源数量:", response.data.length);
        let filteredResources = response.data;
        
        // 前端过滤：如果后端不支持 category 参数，则在前端过滤
        // 检查是否有 category 参数，但返回的资源中包含其他类型
        if (params.category && filteredResources.length > 0) {
          const requestedCategory = params.category;
          const allMatchCategory = filteredResources.every(r => r.category === requestedCategory);
          
          if (!allMatchCategory) {
            console.log(`[PostList] 后端可能不支持 category 参数，前端过滤 category=${requestedCategory}`);
            filteredResources = filteredResources.filter(r => r.category === requestedCategory);
            console.log(`[PostList] 前端过滤后资源数量:`, filteredResources.length);
          }
        }

        this.$store.commit("post/index/setResources", filteredResources);
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
  border: 1px solid var(--border, #dee2e6);
}
</style>
