<template>
  <div class="catalog-unit-resources">
    <div class="container pb-3">
      <!-- 面包屑导航 -->
      <nav aria-label="breadcrumb" class="mb-2">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item">
            <router-link to="/catalog">教材目录</router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link :to="`/catalog/${catalogId}`">
              {{ catalogInfo.displayName || `教材 #${catalogId}` }}
            </router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            {{ unit }}
          </li>
        </ol>
      </nav>

      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">加载中...</span>
        </div>
        <p class="mt-3 text-muted">正在加载资源...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="text-center py-5">
        <i class="bi bi-exclamation-triangle display-1 text-danger"></i>
        <p class="mt-3 text-danger">{{ error }}</p>
        <div class="mt-4">
          <button 
            class="btn btn-outline-primary me-2" 
            @click="fetchResources"
            :disabled="loading"
          >
            <i class="bi bi-arrow-clockwise me-2"></i>重试
          </button>
          <router-link :to="`/catalog/${catalogId}`" class="btn btn-primary">
            <i class="bi bi-arrow-left me-2"></i>返回教材目录
          </router-link>
        </div>
      </div>

      <!-- 资源列表 -->
      <div v-else>
        <!-- 页面标题 -->
        <div class="page-header mb-4">
          <h2 class="page-title">
            {{ catalogInfo.displayName || `教材 #${catalogId}` }} - {{ unit }}
          </h2>
          <p v-if="pagination" class="text-muted">
            共 {{ pagination.total }} 个资源
          </p>
        </div>

        <!-- 资源列表 -->
        <div v-if="resources.length > 0" class="resources-list">
          <div class="row g-3">
            <div
              v-for="resource in resources"
              :key="resource.id"
              class="col-md-6 col-lg-4"
            >
              <ResourceCard :item="resource" />
            </div>
          </div>

          <!-- 分页 -->
          <nav v-if="pagination && pagination.total_pages > 1" class="mt-4">
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
                :class="{ disabled: currentPage === pagination.total_pages }"
              >
                <button
                  class="page-link"
                  @click="changePage(currentPage + 1)"
                  :disabled="currentPage === pagination.total_pages"
                >
                  下一页
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-5">
          <i class="bi bi-inbox display-1 text-muted"></i>
          <p class="mt-3 text-muted">该单元暂无资源</p>
          <!-- 上传资源按钮已删除，统一从 /catalog/:catalogId 页面进入 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { apiHttpClient } from "@/app/app.service";
import ResourceCard from "@/app/components/ResourceCard.vue";

export default defineComponent({
  name: "CatalogUnitResources",

  components: {
    ResourceCard,
  },

  props: {
    catalogId: {
      type: [String, Number],
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      loading: false,
      error: null,
      resources: [],
      catalogInfo: null,
      pagination: null,
      currentPage: 1,
      pageSize: 30,
    };
  },

  computed: {
    displayPages() {
      if (!this.pagination) return [];
      const pages = [];
      const maxDisplay = 5;
      let start = Math.max(1, this.currentPage - 2);
      let end = Math.min(this.pagination.total_pages, start + maxDisplay - 1);

      if (end - start < maxDisplay - 1) {
        start = Math.max(1, end - maxDisplay + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },
  },

  created() {
    this.fetchCatalogInfo();
    this.fetchResources();
  },

  watch: {
    catalogId: {
      handler() {
        this.fetchCatalogInfo();
        this.fetchResources();
      },
    },
    unit: {
      handler() {
        this.fetchResources();
      },
    },
    '$route.query.page': {
      handler(newPage) {
        if (newPage) {
          this.currentPage = parseInt(newPage) || 1;
          this.fetchResources();
        }
      },
    },
  },

  methods: {
    /**
     * 获取 Catalog 信息
     */
    async fetchCatalogInfo() {
      try {
        const response = await apiHttpClient.get(`/api/catalogs/${this.catalogId}/info`).catch(() => {
          // 如果 /info 接口不存在，尝试使用旧的接口
          return apiHttpClient.get(`/api/catalogs/${this.catalogId}`).catch(() => null);
        });

        if (response && response.data) {
          let catalogData = null;
          if (response.data.data) {
            catalogData = response.data.data;
          } else if (response.data.catalog) {
            catalogData = response.data.catalog;
          } else {
            catalogData = response.data;
          }

          if (catalogData) {
            this.catalogInfo = {
              id: catalogData.catalog_id || catalogData.id || this.catalogId,
              subject: catalogData.subject,
              grade: catalogData.grade,
              volume: catalogData.volume,
              textbook_version: catalogData.textbook_version,
              education_level: catalogData.education_level,
              displayName: this.buildDisplayName(catalogData),
            };
          }
        }
      } catch (error) {
        console.warn("[CatalogUnitResources] 获取 catalog 信息失败:", error);
        // 不阻止页面显示，只是没有 catalog 信息
      }
    },

    /**
     * 获取单元资源列表
     * 根据文档要求，调用 GET /api/catalogs/:catalogId/units/:unit/resources
     */
    async fetchResources() {
      this.loading = true;
      this.error = null;

      try {
        const page = this.$route.query.page || this.currentPage;
        const limit = this.pageSize;

        const response = await apiHttpClient.get(
          `/api/catalogs/${this.catalogId}/units/${encodeURIComponent(this.unit)}/resources`,
          {
            params: {
              page,
              limit,
            },
          }
        );

        // 处理响应数据
        let data = null;
        if (response.data) {
          if (response.data.data && Array.isArray(response.data.data)) {
            data = response.data.data;
            this.pagination = response.data.pagination;
          } else if (Array.isArray(response.data)) {
            data = response.data;
          } else {
            data = [];
          }
        }

        this.resources = data || [];
        this.currentPage = this.pagination?.page || parseInt(page) || 1;

        console.log("[CatalogUnitResources] 获取资源成功:", {
          count: this.resources.length,
          pagination: this.pagination,
        });
      } catch (error) {
        console.error("[CatalogUnitResources] 获取资源失败:", error);
        
        if (error.response?.status === 404) {
          this.error = `单元 "${this.unit}" 不存在或暂无资源`;
        } else {
          this.error =
            error.response?.data?.message ||
            error.message ||
            "获取资源列表失败";
        }
      } finally {
        this.loading = false;
      }
    },

    /**
     * 构建显示名称
     */
    buildDisplayName(catalog) {
      const parts = [];
      if (catalog.education_level) parts.push(catalog.education_level);
      if (catalog.subject) parts.push(catalog.subject);
      if (catalog.grade) parts.push(this.formatGrade(catalog.grade));
      if (catalog.volume) parts.push(catalog.volume);
      if (catalog.textbook_version) parts.push(catalog.textbook_version);
      return parts.join(" ") || `教材 #${catalog.id || this.catalogId}`;
    },

    /**
     * 格式化年级显示
     */
    formatGrade(grade) {
      if (typeof grade === "number") {
        const gradeNames = [
          "",
          "一年级",
          "二年级",
          "三年级",
          "四年级",
          "五年级",
          "六年级",
          "七年级",
          "八年级",
          "九年级",
          "高一",
          "高二",
          "高三",
        ];
        return gradeNames[grade] || `${grade}年级`;
      }
      return grade;
    },

    /**
     * 切换页码
     */
    changePage(page) {
      if (page < 1 || (this.pagination && page > this.pagination.total_pages)) {
        return;
      }
      this.currentPage = page;
      this.$router.push({
        query: { ...this.$route.query, page },
      });
    },
  },
});
</script>

<style scoped>
.catalog-unit-resources {
  min-height: calc(100vh - 200px);
  background: var(--bg, #ffffff);
}

.catalog-unit-resources .container {
  padding-top: 0.5rem !important;
}

.catalog-unit-resources .breadcrumb {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.page-header {
  border-bottom: 1px solid var(--border, #e9ecef);
  padding-bottom: 1rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text, #212529);
  margin-bottom: 0.5rem;
}

.resources-list {
  margin-top: 1.5rem;
}

/* 深色主题适配 */
[data-theme="dark"] .catalog-unit-resources {
  background: var(--bg, #1a1d29);
}

[data-theme="dark"] .page-title {
  color: #ffffff;
}

[data-theme="dark"] .page-header {
  border-bottom-color: rgba(255, 255, 255, 0.15);
}
</style>

