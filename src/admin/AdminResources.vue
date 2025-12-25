<template>
  <div class="admin-container">
    <!-- 页面头部 -->
    <div class="admin-header">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h2 class="admin-title">
            <i class="bi bi-file-earmark-text-fill me-2"></i>资源管理
          </h2>
          <p class="admin-subtitle text-muted mb-0">审核和管理系统资源</p>
        </div>
        <button
          class="btn btn-outline-primary"
          @click="fetchResources"
          :disabled="loading"
        >
          <i class="bi bi-arrow-clockwise me-2"></i>刷新
        </button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon bg-secondary">
            <i class="bi bi-list-ul"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ totalResources }}</div>
            <div class="stat-label">总资源数</div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon bg-warning">
            <i class="bi bi-clock-history"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ pendingCount }}</div>
            <div class="stat-label">待审核</div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon bg-success">
            <i class="bi bi-check-circle"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ approvedCount }}</div>
            <div class="stat-label">已通过</div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon bg-danger">
            <i class="bi bi-x-circle"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ rejectedCount }}</div>
            <div class="stat-label">已拒绝</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选条件 -->
    <div class="admin-card mb-4">
      <div class="d-flex align-items-center gap-3">
        <label class="form-label mb-0 fw-bold">状态筛选：</label>
        <select 
          v-model="statusFilter" 
          @change="fetchResources" 
          class="form-select"
          style="width: 200px;"
        >
          <option value="">全部状态</option>
          <option value="pending">待审核</option>
          <option value="approved">已通过</option>
          <option value="rejected">已拒绝</option>
        </select>
        <span class="text-muted small">
          共 {{ totalResources }} 条资源
        </span>
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
        <p class="mt-3 text-muted">暂无资源数据</p>
        <button class="btn btn-primary mt-2" @click="statusFilter = ''; fetchResources()">
          查看全部
        </button>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th style="width: 80px;">ID</th>
              <th>标题</th>
              <th style="width: 120px;">上传者ID</th>
              <th style="width: 120px;">状态</th>
              <th style="width: 150px;">创建时间</th>
              <th style="width: 180px;">操作</th>
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
                  <small v-if="resource.category" class="text-muted d-block">
                    {{ resource.category }}
                  </small>
                </div>
              </td>
              <td>
                <span class="badge bg-info">#{{ resource.user_id || '-' }}</span>
              </td>
              <td>
                <span class="badge" :class="getStatusClass(resource.status)">
                  {{ getStatusText(resource.status) }}
                </span>
              </td>
              <td>
                <small class="text-muted">{{ formatDate(resource.created_at) }}</small>
              </td>
              <td>
                <template v-if="resource.status === 'pending'">
                  <button
                    class="btn btn-sm btn-success me-2"
                    @click="updateStatus(resource.id, 'approved')"
                    :disabled="processing[resource.id]"
                  >
                    <i class="bi bi-check-lg me-1"></i>
                    {{ processing[resource.id] ? '处理中...' : '通过' }}
                  </button>
                  <button
                    class="btn btn-sm btn-danger"
                    @click="updateStatus(resource.id, 'rejected')"
                    :disabled="processing[resource.id]"
                  >
                    <i class="bi bi-x-lg me-1"></i>
                    {{ processing[resource.id] ? '处理中...' : '拒绝' }}
                  </button>
                </template>
                <span v-else class="text-muted small">
                  <i class="bi bi-dash-circle"></i> 无需操作
                </span>
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
  name: "AdminResources",

  data() {
    return {
      resources: [],
      loading: false,
      statusFilter: "",
      processing: {},
    };
  },

  computed: {
    totalResources() {
      return this.resources.length;
    },
    
    pendingCount() {
      return this.resources.filter(r => r.status === 'pending').length;
    },
    
    approvedCount() {
      return this.resources.filter(r => r.status === 'approved').length;
    },
    
    rejectedCount() {
      return this.resources.filter(r => r.status === 'rejected').length;
    },
  },

  created() {
    this.fetchResources();
  },

  methods: {
    async fetchResources() {
      this.loading = true;
      try {
        const params = {};
        if (this.statusFilter) {
          params.status = this.statusFilter;
        }
        
        const response = await apiHttpClient.get("/api/admin/resources", {
          params,
        });

        // 处理不同的响应格式
        const resources = response.data?.resources || response.data || [];
        this.resources = Array.isArray(resources) ? resources : [];
        
        console.log("[AdminResources] 获取到资源数量:", this.resources.length);
        if (this.resources.length > 0) {
          console.log("[AdminResources] 资源数据示例:", this.resources[0]);
        }
      } catch (error) {
        console.error("[AdminResources] 获取资源列表失败:", error);
        console.error("[AdminResources] 错误详情:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        notification.error(
          error.response?.data?.message || 
          error.response?.data?.error ||
          "获取资源列表失败，请检查网络连接"
        );
      } finally {
        this.loading = false;
      }
    },

    async updateStatus(resourceId, status) {
      if (!confirm(`确定要${status === 'approved' ? '通过' : '拒绝'}该资源吗？`)) {
        return;
      }

      this.$set(this.processing, resourceId, true);
      try {
        await apiHttpClient.patch(`/api/admin/resources/${resourceId}/status`, {
          status,
        });

        notification.success(
          status === "approved" ? "资源已通过审核" : "资源已拒绝"
        );

        await this.fetchResources();
      } catch (error) {
        console.error("[AdminResources] 更新状态失败:", error);
        notification.error(
          error.response?.data?.message || "操作失败，请重试"
        );
      } finally {
        this.$set(this.processing, resourceId, false);
      }
    },

    getStatusText(status) {
      const statusMap = {
        pending: "待审核",
        approved: "已通过",
        rejected: "已拒绝",
      };
      return statusMap[status] || status || "未知";
    },

    getStatusClass(status) {
      const classMap = {
        pending: "bg-warning text-dark",
        approved: "bg-success",
        rejected: "bg-danger",
      };
      return classMap[status] || "bg-secondary";
    },

    formatDate(date) {
      if (!date) return "未知";
      try {
        return new Date(date).toLocaleDateString("zh-CN", {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return "未知";
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
  border-bottom: 2px solid #e9ecef;
}

.admin-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

.admin-subtitle {
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #212529;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

.admin-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
}

.table {
  margin: 0;
}

.table thead th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  color: #6c757d;
  border-bottom: 2px solid #e9ecef;
  padding: 1rem;
}

.table tbody td {
  padding: 1rem;
  vertical-align: middle;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

.resource-title {
  max-width: 400px;
}

.badge {
  font-size: 0.875rem;
  padding: 0.4em 0.8em;
  font-weight: 500;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}
</style>
