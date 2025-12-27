<template>
  <div class="catalog-index">
    <div class="container py-4">
      <!-- 页面标题 -->
      <div class="catalog-header mb-4">
        <h1 class="catalog-title">
          <i class="bi bi-book-half me-2"></i>教材目录
        </h1>
        <p class="catalog-subtitle text-muted">
          选择教材，浏览对应资源
        </p>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">加载中...</span>
        </div>
        <p class="mt-3 text-muted">正在加载教材目录...</p>
      </div>

      <!-- 教材列表（文档要求：必须显示所有教材列表） -->
      <div v-else>
        <!-- 筛选器 -->
        <div class="filters mb-4 mx-auto">
          <div class="row g-3">
            <div class="col-6 col-md-2 text-center">
              <label class="form-label small mb-1 d-block">学段</label>
              <select
                v-model="filters.education_level"
                class="form-select form-select-sm text-center"
                @change="handleFilterChange"
              >
                <option value="">全部学段</option>
                <option
                  v-for="level in availableEducationLevels"
                  :key="level"
                  :value="level"
                >
                  {{ level }}
                </option>
              </select>
            </div>
            <div class="col-6 col-md-2 text-center">
              <label class="form-label small mb-1 d-block">年级</label>
              <select
                v-model="filters.grade"
                class="form-select form-select-sm text-center"
                @change="handleFilterChange"
              >
                <option value="">全部年级</option>
                <option
                  v-for="grade in availableGrades"
                  :key="grade.value"
                  :value="grade.value"
                >
                  {{ grade.label }}
                </option>
              </select>
            </div>
            <div class="col-6 col-md-2 text-center">
              <label class="form-label small mb-1 d-block">学科</label>
              <select
                v-model="filters.subject"
                class="form-select form-select-sm text-center"
                @change="handleFilterChange"
              >
                <option value="">全部学科</option>
                <option
                  v-for="subject in availableSubjects"
                  :key="subject"
                  :value="subject"
                >
                  {{ subject }}
                </option>
              </select>
            </div>
            <div class="col-6 col-md-2 text-center">
              <label class="form-label small mb-1 d-block">版本</label>
              <select
                v-model="filters.textbook_version"
                class="form-select form-select-sm text-center"
                @change="handleFilterChange"
              >
                <option value="">全部版本</option>
                <option
                  v-for="version in availableVersions"
                  :key="version"
                  :value="version"
                >
                  {{ version }}
                </option>
              </select>
            </div>
            <div class="col-6 col-md-2 text-center">
              <label class="form-label small mb-1 d-block">每页显示</label>
              <select
                v-model.number="pageSize"
                class="form-select form-select-sm text-center"
                @change="handlePageSizeChange"
              >
                <option :value="50">50 条</option>
                <option :value="100">100 条</option>
                <option :value="300">300 条</option>
                <option :value="500">500 条</option>
              </select>
            </div>
            <div class="col-12 col-md-2 text-center">
              <label class="form-label small mb-1 d-block" style="visibility: hidden;">操作</label>
              <button
                v-if="hasActiveFilters"
                class="btn btn-outline-secondary btn-sm w-100"
                @click="clearFilters"
              >
                <i class="bi bi-x-circle me-1"></i>清除筛选
              </button>
            </div>
          </div>
        </div>

        <!-- 结果统计 -->
        <div v-if="pagination && pagination.total > 0" class="result-stats mb-3 text-muted small text-center">
          共 {{ pagination.total }} 条结果，当前第 {{ pagination.page }} / {{ pagination.total_pages }} 页
        </div>

        <!-- 教材列表 -->
        <div v-if="catalogs.length > 0" class="catalog-list mb-4 catalog-list-container">
          <div
            v-for="catalog in catalogs"
            :key="catalog.id"
            class="catalog-item"
            @click="goToCatalog(catalog.id)"
          >
            {{ catalog.subject }} {{ formatGrade(catalog.grade) }}{{ catalog.volume }} {{ catalog.textbook_version }}
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="!loading" class="text-center py-5">
          <i class="bi bi-inbox display-1 text-muted"></i>
          <p class="mt-3 text-muted">暂无教材目录数据</p>
        </div>

        <!-- 分页器 -->
        <nav v-if="pagination && pagination.total_pages > 1" class="pagination-container">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: pagination.page <= 1 }">
              <button
                class="page-link"
                @click="changePage(pagination.page - 1)"
                :disabled="pagination.page <= 1"
              >
                上一页
              </button>
            </li>
            <li
              v-for="page in displayPages"
              :key="page"
              class="page-item"
              :class="{ active: page === pagination.page }"
            >
              <button class="page-link" @click="changePage(page)">
                {{ page }}
              </button>
            </li>
            <li
              class="page-item"
              :class="{ disabled: pagination.page >= pagination.total_pages }"
            >
              <button
                class="page-link"
                @click="changePage(pagination.page + 1)"
                :disabled="pagination.page >= pagination.total_pages"
              >
                下一页
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { apiHttpClient } from "@/app/app.service";

export default defineComponent({
  name: "CatalogIndex",

  data() {
    return {
      catalogs: [], // 当前页的教材目录数据
      allCatalogs: [], // 所有教材目录数据（用于提取筛选选项）
      loading: false,
      pagination: null, // 分页信息
      filters: {
        education_level: "",
        grade: "",
        subject: "",
        textbook_version: "",
      },
      pageSize: 50, // 每页显示数量（默认 50）
    };
  },

  computed: {
    // 计算要显示的分页页码
    displayPages() {
      if (!this.pagination) return [];
      const pages = [];
      const maxDisplay = 5;
      let start = Math.max(1, this.pagination.page - 2);
      let end = Math.min(this.pagination.total_pages, start + maxDisplay - 1);

      if (end - start < maxDisplay - 1) {
        start = Math.max(1, end - maxDisplay + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },

    // 从所有数据中提取可用的学段列表（去重并排序）
    availableEducationLevels() {
      const levels = this.allCatalogs
        .map((c) => c.education_level)
        .filter((l) => l && l.trim() !== "");
      const uniqueLevels = [...new Set(levels)];
      // 按照固定顺序排序：小学在前，初中在后
      const order = ["小学", "初中"];
      return uniqueLevels.sort((a, b) => {
        const indexA = order.indexOf(a);
        const indexB = order.indexOf(b);
        if (indexA === -1 && indexB === -1) return a.localeCompare(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
    },

    // 从所有数据中提取可用的年级列表（去重并排序）
    availableGrades() {
      const grades = this.allCatalogs
        .map((c) => c.grade)
        .filter((g) => g && g.toString().trim() !== "");
      const uniqueGrades = [...new Set(grades)];
      // 转换为数字并排序
      const numericGrades = uniqueGrades
        .map((g) => parseInt(g))
        .filter((g) => !isNaN(g))
        .sort((a, b) => a - b);
      
      // 转换为显示格式
      return numericGrades.map((g) => ({
        value: g.toString(),
        label: this.formatGrade(g),
      }));
    },

    // 从所有数据中提取可用的学科列表（去重并排序）
    availableSubjects() {
      const subjects = this.allCatalogs
        .map((c) => c.subject)
        .filter((s) => s && s.trim() !== "");
      return [...new Set(subjects)].sort();
    },

    // 从所有数据中提取可用的版本列表（去重并排序）
    availableVersions() {
      if (!this.allCatalogs || this.allCatalogs.length === 0) {
        console.warn("[CatalogIndex] allCatalogs 为空，无法提取版本列表");
        return [];
      }
      
      const versions = this.allCatalogs
        .map((c) => {
          // 确保正确提取 textbook_version 字段
          return c?.textbook_version || c?.version || null;
        })
        .filter((v) => v !== null && v !== undefined && v.toString().trim() !== "");
      
      const uniqueVersions = [...new Set(versions)];
      const sorted = uniqueVersions.sort();
      
      console.log("[CatalogIndex] 提取的版本列表（从后端数据）:", sorted);
      return sorted;
    },

    // 检查是否有激活的筛选条件
    hasActiveFilters() {
      return !!(
        this.filters.education_level ||
        this.filters.grade ||
        this.filters.subject ||
        this.filters.textbook_version
      );
    },
  },

  created() {
    // 从 URL query 参数读取筛选条件和页码
    this.loadFiltersFromQuery();
    // 先获取所有数据（用于提取筛选选项），然后再获取分页数据
    this.fetchAllCatalogsForFilters();
    this.fetchCatalogs();
  },

  watch: {
    // 监听路由 query 参数变化
    "$route.query": {
      handler() {
        this.loadFiltersFromQuery();
        this.fetchCatalogs();
      },
      deep: true,
    },
  },

  methods: {
    /**
     * 获取所有教材目录数据（用于提取筛选选项）
     * 获取足够多的数据来提取所有可用的学段、年级、学科和版本
     */
    async fetchAllCatalogsForFilters() {
      try {
        // 先获取第一页，查看总数
        const firstResponse = await apiHttpClient.get("/api/catalogs", {
          params: {
            page: 1,
            limit: 1000, // 使用较大的limit值
          },
        });

        console.log("[CatalogIndex] 筛选选项API响应:", firstResponse.data);

        if (firstResponse.data) {
          let allData = [];
          // 处理响应数据结构：可能是 { data: [...], pagination: {...} } 或直接是数组
          if (firstResponse.data.data && Array.isArray(firstResponse.data.data)) {
            allData = firstResponse.data.data;
          } else if (Array.isArray(firstResponse.data)) {
            allData = firstResponse.data;
          }

          const pagination = firstResponse.data?.pagination;
          const total = pagination?.total || allData.length;
          
          console.log("[CatalogIndex] 数据总数:", total, "已获取:", allData.length);

          // 如果总数超过已获取的数量，需要分页获取所有数据
          if (pagination && total > allData.length) {
            console.log("[CatalogIndex] 需要获取更多数据，开始分页获取...");
            const limit = pagination.limit || 1000;
            const totalPages = pagination.total_pages || Math.ceil(total / limit);
            
            // 获取剩余页面的数据
            const promises = [];
            for (let page = 2; page <= totalPages; page++) {
              promises.push(
                apiHttpClient.get("/api/catalogs", {
                  params: {
                    page,
                    limit,
                  },
                })
              );
            }

            // 等待所有请求完成
            const responses = await Promise.all(promises);
            
            // 合并所有数据
            responses.forEach((response) => {
              if (response.data) {
                let pageData = [];
                if (response.data.data && Array.isArray(response.data.data)) {
                  pageData = response.data.data;
                } else if (Array.isArray(response.data)) {
                  pageData = response.data;
                }
                allData = [...allData, ...pageData];
              }
            });

            console.log("[CatalogIndex] 分页获取完成，总数据量:", allData.length);
          }

          // 去重（根据id）
          const uniqueData = [];
          const seenIds = new Set();
          for (const item of allData) {
            if (item.id && !seenIds.has(item.id)) {
              seenIds.add(item.id);
              uniqueData.push(item);
            }
          }

          this.allCatalogs = uniqueData;
          console.log("[CatalogIndex] 去重后数据量:", this.allCatalogs.length);
          
          // 检查数据样本
          if (this.allCatalogs.length > 0) {
            console.log("[CatalogIndex] 数据样本（第一条）:", this.allCatalogs[0]);
            
            // 检查各个学段
            const educationLevels = [...new Set(this.allCatalogs.map(c => c.education_level).filter(Boolean))];
            console.log("[CatalogIndex] 包含的学段:", educationLevels);
            
            // 检查年级范围
            const grades = [...new Set(this.allCatalogs.map(c => c.grade).filter(Boolean))].sort();
            console.log("[CatalogIndex] 包含的年级:", grades);
            
            // 检查学科
            const subjects = [...new Set(this.allCatalogs.map(c => c.subject).filter(Boolean))].sort();
            console.log("[CatalogIndex] 包含的学科:", subjects);
            
            // 检查版本
            const versions = [...new Set(this.allCatalogs.map(c => c.textbook_version).filter(Boolean))].sort();
            console.log("[CatalogIndex] 包含的版本:", versions);
          }
          
          // 使用 $nextTick 确保计算属性已更新
          this.$nextTick(() => {
            console.log("[CatalogIndex] 提取的版本列表:", this.availableVersions);
            console.log("[CatalogIndex] 提取的学科列表:", this.availableSubjects);
            console.log("[CatalogIndex] 提取的学段列表:", this.availableEducationLevels);
            console.log("[CatalogIndex] 提取的年级列表:", this.availableGrades);
          });
        }
      } catch (error) {
        console.warn("[CatalogIndex] 获取所有教材目录失败（用于筛选）:", error);
        // 失败不影响主流程，只是筛选选项可能不完整
        this.allCatalogs = [];
      }
    },

    /**
     * 从 URL query 参数读取筛选条件和每页显示数量
     */
    loadFiltersFromQuery() {
      const query = this.$route.query;
      if (query.education_level) {
        this.filters.education_level = decodeURIComponent(query.education_level);
      } else {
        this.filters.education_level = "";
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
      // 读取每页显示数量
      if (query.limit) {
        const limit = parseInt(query.limit);
        if ([50, 100, 300, 500].includes(limit)) {
          this.pageSize = limit;
        }
      }
    },

    /**
     * 获取教材目录数据（支持分页和筛选）
     */
    async fetchCatalogs() {
      this.loading = true;
      try {
        // 构建查询参数
        const params = {
          page: this.$route.query.page || 1,
          limit: this.pageSize,
        };

        // 添加筛选参数
        if (this.filters.education_level) {
          params.education_level = this.filters.education_level;
        }
        if (this.filters.grade) {
          params.grade = this.filters.grade;
        }
        if (this.filters.subject) {
          params.subject = this.filters.subject;
        }
        if (this.filters.textbook_version) {
          // 根据文档，API 可能不支持 textbook_version 参数
          // 但先尝试传递，如果后端不支持，需要后端添加支持
          params.textbook_version = this.filters.textbook_version;
          console.log("[CatalogIndex] 添加版本筛选参数:", this.filters.textbook_version);
        }

        console.log("[CatalogIndex] 请求参数:", params);
        console.log("[CatalogIndex] 当前筛选条件:", this.filters);

        const response = await apiHttpClient.get("/api/catalogs", { params });

        console.log("[CatalogIndex] 响应数据:", response.data);

        // 根据文档，接口返回的是对象，包含 data 和 pagination 字段
        if (response.data) {
          let catalogsData = [];
          // 从 result.data 获取数据
          if (response.data.data && Array.isArray(response.data.data)) {
            catalogsData = response.data.data;
          } else if (Array.isArray(response.data)) {
            // 兼容旧格式（直接返回数组）
            catalogsData = response.data;
          }

          // 如果后端不支持 textbook_version 参数，在前端进行客户端筛选
          if (this.filters.textbook_version && catalogsData.length > 0) {
            console.log("[CatalogIndex] 后端可能不支持版本筛选，进行客户端筛选");
            catalogsData = catalogsData.filter((catalog) => {
              const version = catalog?.textbook_version || catalog?.version || "";
              return version === this.filters.textbook_version;
            });
            console.log("[CatalogIndex] 客户端筛选后数量:", catalogsData.length);
          }

          this.catalogs = catalogsData;

          // 从 result.data.pagination 获取分页信息
          if (response.data.pagination) {
            // 如果进行了客户端筛选，需要更新分页信息
            if (this.filters.textbook_version && catalogsData.length !== response.data.pagination.total) {
              this.pagination = {
                ...response.data.pagination,
                total: catalogsData.length,
                total_pages: Math.ceil(catalogsData.length / this.pageSize),
              };
            } else {
              this.pagination = response.data.pagination;
            }
          } else {
            this.pagination = null;
          }
        } else {
          this.catalogs = [];
          this.pagination = null;
        }

        console.log("[CatalogIndex] 获取到教材目录数量:", this.catalogs.length);
        console.log("[CatalogIndex] 分页信息:", this.pagination);
        
        // 更新筛选选项（从当前页数据中提取，如果 allCatalogs 为空则使用当前页数据）
        if (this.allCatalogs.length === 0 && this.catalogs.length > 0) {
          this.allCatalogs = [...this.catalogs];
          console.log("[CatalogIndex] 使用当前页数据作为筛选选项来源");
          // 使用 $nextTick 确保计算属性已更新
          this.$nextTick(() => {
            console.log("[CatalogIndex] 从当前页数据提取的版本列表:", this.availableVersions);
          });
        }
      } catch (error) {
        console.error("[CatalogIndex] 获取教材目录失败:", error);
        const { notification } = await import("@/utils/notification");
        notification.error(
          error.response?.data?.message || error.message || "获取教材目录失败"
        );
        this.catalogs = [];
        this.pagination = null;
      } finally {
        this.loading = false;
      }
    },

    /**
     * 筛选条件变化时重新获取数据
     */
    handleFilterChange() {
      console.log("[CatalogIndex] 筛选条件变化:", this.filters);
      // 筛选时重置到第一页
      this.$router.push({
        query: {
          ...this.filters,
          page: 1,
          limit: this.pageSize,
        },
      });
    },

    /**
     * 每页显示数量变化时重新获取数据
     */
    handlePageSizeChange() {
      // 改变每页显示数量时重置到第一页
      this.$router.push({
        query: {
          ...this.filters,
          page: 1,
          limit: this.pageSize,
        },
      });
    },

    /**
     * 切换页码
     */
    changePage(page) {
      if (page < 1 || (this.pagination && page > this.pagination.total_pages)) {
        return;
      }
      this.$router.push({
        query: {
          ...this.filters,
          page,
          limit: this.pageSize,
        },
      });
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
     * 清除所有筛选条件
     */
    clearFilters() {
      this.filters = {
        education_level: "",
        grade: "",
        subject: "",
        textbook_version: "",
      };
      this.$router.push({
        query: {
          page: 1,
          limit: this.pageSize,
        },
      });
    },

    /**
     * 跳转到教材目录页
     * 文档要求：点击某个教材 → 跳转到 /catalog/:catalogId
     */
    goToCatalog(catalogId) {
      this.$router.push({
        path: `/catalog/${catalogId}`,
      });
    },
  },
});
</script>

<style scoped>
.catalog-index {
  min-height: calc(100vh - 200px);
  background: var(--bg, #ffffff);
}

.catalog-header {
  text-align: center;
  padding: 2rem 0;
}

.catalog-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--text, #212529);
  margin-bottom: 0.5rem;
}

.catalog-subtitle {
  font-size: 1.1rem;
}

.catalog-list-container {
  max-width: 1200px;
  margin: 0 auto;
}

.filters {
  background: var(--surface, #ffffff);
  border: 1px solid var(--border, #e9ecef);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: var(--shadow, 0 2px 8px rgba(0, 0, 0, 0.05));
  max-width: 1200px;
}

.filters .form-label {
  font-weight: 500;
  color: var(--text, #495057);
  white-space: nowrap;
  display: block;
  margin-bottom: 0.25rem;
  text-align: center !important;
}

.filters .form-select-sm {
  font-size: 0.875rem;
  text-align: center !important;
  text-align-last: center !important;
  /* 通过调整padding让文本视觉上居中，考虑右侧箭头占用的空间 */
  padding-left: 1.5rem !important;
  padding-right: 1.5rem !important;
  direction: ltr;
  background-position: right 0.5rem center;
  /* 确保文本在视觉上居中 */
  text-indent: 0;
}

/* 选择框下拉选项文本居中 */
.filters .form-select-sm option {
  text-align: center;
  direction: ltr;
}

/* 确保容器内容居中 */
.filters .col-md-2,
.filters .col-6 {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.filters .col-md-2 > *,
.filters .col-6 > * {
  width: 100%;
}

/* 确保筛选器在一行显示（中等屏幕及以上） */
@media (min-width: 768px) {
  .filters .row {
    flex-wrap: nowrap;
  }
  
  .filters .col-md-2,
  .filters .col-md-3 {
    flex: 0 0 auto;
    width: auto;
    min-width: 0;
  }
}

/* 小屏幕下允许换行 */
@media (max-width: 767px) {
  .filters .row {
    flex-wrap: wrap;
  }
}

.result-stats {
  font-size: 0.9rem;
}

.pagination-container {
  margin-top: 2rem;
}

.catalog-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.catalog-item {
  background: var(--surface, #ffffff);
  border: 1px solid var(--border, #e9ecef);
  border-radius: 8px;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
  color: var(--text, #212529);
}

.catalog-item:hover {
  border-color: var(--primary, #4f8cff);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 140, 255, 0.15);
  background: var(--primary-light, #f0f7ff);
}

/* 深色主题适配 */
[data-theme="dark"] .catalog-index {
  background: var(--bg, #1a1d29);
}

[data-theme="dark"] .catalog-title {
  color: #ffffff;
}

[data-theme="dark"] .group-title {
  color: #ffffff;
  border-bottom-color: rgba(255, 255, 255, 0.15);
}

[data-theme="dark"] .catalog-item {
  background: var(--surface, #1e222d);
  border-color: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

[data-theme="dark"] .catalog-item:hover {
  border-color: var(--primary, #4f8cff);
  background: rgba(79, 140, 255, 0.1);
}
</style>


