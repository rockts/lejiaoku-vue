<template>
  <div class="admin-container">
    <!-- 页面头部 -->
    <div class="admin-header">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h2 class="admin-title">
            <i class="bi bi-book-half me-2"></i>教材版本待确认
          </h2>
          <p class="admin-subtitle text-muted mb-0">人工处理教材版本不确定的资源</p>
        </div>
        <div class="d-flex align-items-center header-actions">
          <router-link to="/admin/users" class="btn btn-header btn-primary me-2">
            <i class="bi bi-people me-2"></i>用户管理
          </router-link>
          <router-link to="/admin/resources" class="btn btn-header btn-success me-2">
            <i class="bi bi-file-earmark-text me-2"></i>资源管理
          </router-link>
          <router-link to="/admin/contributor-applications" class="btn btn-header btn-warning me-2">
            <i class="bi bi-person-check me-2"></i>贡献者申请
          </router-link>
          <router-link to="/admin" class="btn btn-header btn-outline-secondary me-2">
            <i class="bi bi-house me-2"></i>管理首页
          </router-link>
          <button
            class="btn btn-header btn-outline-primary"
            @click="fetchResources"
            :disabled="loading"
          >
            <i class="bi bi-arrow-clockwise me-2" :class="{ 'spinning': loading }"></i>刷新
          </button>
        </div>
      </div>
    </div>

    <!-- 资源表格 -->
    <div class="admin-card">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">加载中...</span>
        </div>
        <p class="mt-3 text-muted">正在加载资源数据...</p>
      </div>

      <div v-else-if="resources.length === 0" class="text-center py-5">
        <i class="bi bi-inbox display-1 text-muted"></i>
        <p class="mt-3 text-muted">暂无待确认教材版本的资源</p>
        <button class="btn btn-primary mt-2" @click="fetchResources">
          <i class="bi bi-arrow-clockwise me-2"></i>刷新
        </button>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th style="width: 80px;">ID</th>
              <th>资源标题</th>
              <th style="width: 100px;">学科</th>
              <th style="width: 100px;">年级</th>
              <th style="width: 100px;">册别</th>
              <th style="width: 150px;">当前教材版本</th>
              <th style="width: 200px;">教材版本选择</th>
              <th style="width: 120px;">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="resource in resources" :key="resource.id">
              <td>
                <span class="badge bg-secondary">#{{ resource.id }}</span>
              </td>
              <td>
                <div class="resource-title">
                  <strong>{{ resource.title || '无标题' }}</strong>
                </div>
              </td>
              <td>
                <span class="badge bg-info" v-if="resource.subject">
                  {{ resource.subject }}
                </span>
                <span class="text-muted small" v-else>未设置</span>
              </td>
              <td>
                <span class="badge bg-primary" v-if="resource.grade">
                  {{ resource.grade }}
                </span>
                <span class="text-muted small" v-else>未设置</span>
              </td>
              <td>
                <span class="badge bg-warning" v-if="resource.volume">
                  {{ resource.volume }}
                </span>
                <span class="text-muted small" v-else>未设置</span>
              </td>
              <td>
                <span v-if="getCurrentCatalogVersion(resource)" class="text-success">
                  {{ getCurrentCatalogVersion(resource) }}
                </span>
                <span v-else class="text-danger">未识别</span>
              </td>
              <td>
                <select
                  v-if="hasCandidateCatalogs(resource)"
                  v-model="selectedCatalogs[resource.id]"
                  class="form-select form-select-sm"
                  :disabled="processing[resource.id]"
                >
                  <option value="">请选择教材版本</option>
                  <option
                    v-for="catalog in resource.candidate_catalogs"
                    :key="catalog.id || catalog.catalog_id"
                    :value="catalog.id || catalog.catalog_id"
                  >
                    {{ catalog.textbook_version || catalog.version || '未知版本' }}
                  </option>
                </select>
                <span v-else class="text-danger small">
                  <i class="bi bi-exclamation-triangle me-1"></i>无法匹配教材目录
                </span>
              </td>
              <td>
                <button
                  v-if="hasCandidateCatalogs(resource)"
                  class="btn btn-sm btn-primary"
                  @click="handleBindCatalog(resource)"
                  :disabled="!selectedCatalogs[resource.id] || processing[resource.id]"
                >
                  <span v-if="processing[resource.id]" class="spinner-border spinner-border-sm me-1"></span>
                  <i v-else class="bi bi-check-circle me-1"></i>
                  确认绑定
                </button>
                <span v-else class="text-muted small">无法操作</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { apiHttpClient } from "@/app/app.service";
import { notification } from "@/utils/notification";

export default defineComponent({
  name: "AdminCatalogBinding",

  data() {
    return {
      resources: [],
      loading: false,
      processing: {},
      selectedCatalogs: {}, // { resourceId: catalogId }
    };
  },

  created() {
    this.fetchResources();
  },

  methods: {
    /**
     * 获取未绑定教材版本的资源列表
     */
    async fetchResources() {
      this.loading = true;
      try {
        const response = await apiHttpClient.get("/api/admin/resources/unbound-catalog");

        console.log("[AdminCatalogBinding] 响应数据:", response.data);

        // 处理不同的响应格式
        let resources = [];
        if (response.data) {
          if (response.data.data && Array.isArray(response.data.data)) {
            resources = response.data.data;
          } else if (response.data.resources && Array.isArray(response.data.resources)) {
            resources = response.data.resources;
          } else if (Array.isArray(response.data)) {
            resources = response.data;
          }
        }

        this.resources = resources;
        console.log("[AdminCatalogBinding] 获取到资源数量:", this.resources.length);

        // 初始化选中状态
        this.selectedCatalogs = {};
        this.resources.forEach((resource) => {
          this.selectedCatalogs[resource.id] = "";
        });
      } catch (error) {
        console.error("[AdminCatalogBinding] 获取资源列表失败:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "获取资源列表失败";
        notification.error(errorMessage);
      } finally {
        this.loading = false;
      }
    },

    /**
     * 获取当前教材版本（从 auto_meta_result 中提取）
     */
    getCurrentCatalogVersion(resource) {
      if (!resource.auto_meta_result) {
        return null;
      }

      // 尝试从 auto_meta_result 中提取教材版本
      // 可能是字符串（JSON）或对象
      let metaResult = resource.auto_meta_result;
      if (typeof metaResult === "string") {
        try {
          metaResult = JSON.parse(metaResult);
        } catch (e) {
          console.warn("[AdminCatalogBinding] 解析 auto_meta_result 失败:", e);
          return null;
        }
      }

      // 可能的字段名：textbook_version, version, catalog_version
      return (
        metaResult?.textbook_version ||
        metaResult?.version ||
        metaResult?.catalog_version ||
        null
      );
    },

    /**
     * 检查是否有候选教材版本
     */
    hasCandidateCatalogs(resource) {
      return (
        resource.candidate_catalogs &&
        Array.isArray(resource.candidate_catalogs) &&
        resource.candidate_catalogs.length > 0
      );
    },

    /**
     * 处理教材版本绑定
     */
    async handleBindCatalog(resource) {
      const catalogId = this.selectedCatalogs[resource.id];
      if (!catalogId) {
        notification.warning("请先选择教材版本");
        return;
      }

      // 二次确认
      const confirmed = await notification.confirm(
        `确定将资源「${resource.title || "无标题"}」绑定到所选教材版本吗？`,
        "确认绑定教材版本"
      );

      if (!confirmed) {
        return;
      }

      // 设置处理状态
      this.processing = { ...this.processing, [resource.id]: true };

      try {
        await apiHttpClient.post(`/api/admin/resources/${resource.id}/bind-catalog`, {
          catalog_id: catalogId,
        });

        console.log("[AdminCatalogBinding] 绑定成功:", resource.id, catalogId);

        // 成功提示
        notification.success("绑定成功");

        // 从列表中移除
        this.resources = this.resources.filter((r) => r.id !== resource.id);
        delete this.selectedCatalogs[resource.id];
      } catch (error) {
        console.error("[AdminCatalogBinding] 绑定失败:", error);

        // 处理不同的错误情况
        let errorMessage = "绑定失败";
        if (error.response?.status === 400) {
          const message = error.response?.data?.message || "";
          if (message.includes("已绑定") || message.includes("already")) {
            errorMessage = "该资源已绑定教材目录";
          } else {
            errorMessage = message || "绑定失败，请检查数据";
          }
        } else if (error.response?.status === 404) {
          errorMessage = "资源不存在";
        } else if (error.response?.status === 403) {
          errorMessage = "无权限执行此操作";
        } else {
          errorMessage =
            error.response?.data?.message || error.message || "绑定失败";
        }

        notification.error(errorMessage);
      } finally {
        this.processing = { ...this.processing, [resource.id]: false };
      }
    },
  },
});
</script>

<style scoped>
.admin-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.admin-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border, #e9ecef);
}

.admin-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text, #212529);
  margin: 0;
}

.admin-subtitle {
  font-size: 1rem;
  margin-top: 0.5rem;
}

.header-actions {
  flex-wrap: wrap;
  gap: 0.5rem;
}

.btn-header {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  white-space: nowrap;
}

.admin-card {
  background: var(--surface, white);
  border: 1px solid var(--border, #e9ecef);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow, 0 2px 8px rgba(0, 0, 0, 0.1));
}

.table {
  margin-bottom: 0;
  color: var(--text, #212529);
}

.table thead th {
  background-color: var(--surface, #f8f9fa);
  border-bottom: 2px solid var(--border, #dee2e6);
  font-weight: 600;
  color: var(--text, #212529);
}

.table tbody td {
  vertical-align: middle;
}

.resource-title {
  max-width: 300px;
}

.resource-title strong {
  color: var(--text, #212529);
  word-break: break-word;
}

.form-select {
  font-size: 0.875rem;
  border-color: var(--border, #ced4da);
}

.form-select:focus {
  border-color: #4f8cff;
  box-shadow: 0 0 0 0.2rem rgba(79, 140, 255, 0.25);
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.spinner-border-sm {
  width: 0.875rem;
  height: 0.875rem;
  border-width: 0.15em;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 深色主题适配 */
[data-theme="dark"] .admin-card {
  background-color: var(--surface, #1e222d);
  border-color: rgba(255, 255, 255, 0.15);
}

[data-theme="dark"] .table {
  background-color: var(--surface, #1e222d);
  color: #ffffff;
}

[data-theme="dark"] .table thead th {
  background-color: rgba(255, 255, 255, 0.05);
  border-bottom-color: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

[data-theme="dark"] .table tbody td {
  color: #ffffff;
  border-top-color: rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .table tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

[data-theme="dark"] .resource-title strong {
  color: #ffffff;
}

[data-theme="dark"] .form-select {
  background-color: var(--surface, #1e222d);
  border-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

[data-theme="dark"] .form-select:focus {
  background-color: var(--surface, #1e222d);
  border-color: #4f8cff;
  color: #ffffff;
}

[data-theme="dark"] .form-select option {
  background-color: var(--surface, #1e222d);
  color: #ffffff;
}
</style>

