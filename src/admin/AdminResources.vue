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
        <div class="d-flex">
          <router-link to="/admin/users" class="btn btn-primary mr-2">
            <i class="bi bi-people me-2"></i>用户管理
          </router-link>
          <router-link to="/admin" class="btn btn-outline-secondary mr-2">
            <i class="bi bi-house me-2"></i>管理首页
          </router-link>
          <button
            class="btn btn-outline-primary"
            @click="fetchResources"
            :disabled="loading"
          >
            <i class="bi bi-arrow-clockwise me-2"></i>刷新
          </button>
        </div>
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
                <div class="d-flex align-items-center">
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
                      class="btn btn-sm btn-warning me-2"
                      @click="updateStatus(resource.id, 'rejected')"
                      :disabled="processing[resource.id]"
                    >
                      <i class="bi bi-x-lg me-1"></i>
                      {{ processing[resource.id] ? '处理中...' : '拒绝' }}
                    </button>
                  </template>
                  <button
                    class="btn btn-sm btn-danger"
                    @click="deleteResource(resource.id, resource.title || '无标题')"
                    :disabled="deleting[resource.id]"
                    title="删除资源"
                  >
                    <span v-if="deleting[resource.id]">
                      <span class="spinner-border spinner-border-sm me-1"></span>
                      删除中
                    </span>
                    <span v-else>
                      <i class="bi bi-trash me-1"></i>删除
                    </span>
                  </button>
                </div>
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
      deleting: {},
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
        // 检查 token
        const token = localStorage.getItem('auth_token');
        console.log("[AdminResources] Token 存在:", !!token);
        
        const params = {};
        if (this.statusFilter) {
          params.status = this.statusFilter;
        }
        
        const response = await apiHttpClient.get("/api/admin/resources", {
          params,
        });

        console.log("[AdminResources] 响应状态:", response.status);
        console.log("[AdminResources] 响应数据:", response.data);

        // 后端返回格式: { success: true, data: [...] }
        // 需要访问 response.data.data 获取数组
        let resources = [];
        if (response.data) {
          if (response.data.data && Array.isArray(response.data.data)) {
            resources = response.data.data;
            console.log("[AdminResources] 从 response.data.data 获取数据");
          } else if (response.data.resources && Array.isArray(response.data.resources)) {
            resources = response.data.resources;
            console.log("[AdminResources] 从 response.data.resources 获取数据");
          } else if (Array.isArray(response.data)) {
            resources = response.data;
            console.log("[AdminResources] 从 response.data 获取数据（直接数组）");
          }
        }
        this.resources = resources;
        
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
      const confirmed = await notification.confirm(
        `确定要${status === 'approved' ? '通过' : '拒绝'}该资源吗？`,
        status === 'approved' ? '通过审核' : '拒绝审核'
      );
      if (!confirmed) {
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

    async deleteResource(resourceId, resourceTitle) {
      const confirmed = await notification.confirm(
        `确定要删除资源 "${resourceTitle}" (ID: ${resourceId}) 吗？\n\n此操作不可恢复！`,
        '删除资源'
      );
      if (!confirmed) {
        console.log(`[AdminResources] 用户取消删除资源 ${resourceId}`);
        return;
      }

      console.log(`[AdminResources] 开始删除资源 ${resourceId} (${resourceTitle})`);
      
      this.deleting[resourceId] = true;
      
      try {
        // 尝试多个可能的 API 路径
        let response;
        let lastError;
        
        const deleteEndpoints = [
          `/api/resources/${resourceId}`,
          `/resources/${resourceId}`,
        ];

        for (const endpoint of deleteEndpoints) {
          try {
            console.log(`[AdminResources] 尝试删除接口: ${endpoint}`);
            response = await apiHttpClient.delete(endpoint);
            console.log(`[AdminResources] 删除成功，响应:`, response.data);
            break;
          } catch (error) {
            console.log(`[AdminResources] 接口失败: ${endpoint}`, {
              status: error.response?.status,
              message: error.response?.data?.message || error.message,
            });
            lastError = error;
            if (error.response?.status === 404 || error.response?.status === 405) {
              continue;
            }
            if (error.response?.status === 401 || error.response?.status === 403) {
              throw error;
            }
            continue;
          }
        }

        if (!response) {
          const errorMsg = lastError?.response?.data?.message || 
                          lastError?.response?.data?.error ||
                          lastError?.message ||
                          "所有删除接口都失败";
          throw new Error(errorMsg);
        }

        notification.success(`资源 "${resourceTitle}" 已删除`);
        
        // 从列表中移除该资源
        this.resources = this.resources.filter(r => r.id !== resourceId);
        
        console.log(`[AdminResources] 资源 ${resourceId} 已从列表中移除`);
        
      } catch (error) {
        console.error("[AdminResources] 删除资源失败:", error);
        console.error("[AdminResources] 错误详情:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
        
        let errorMessage = "删除资源失败";
        
        if (error.response) {
          const status = error.response.status;
          const data = error.response.data;
          
          if (status === 400) {
            errorMessage = data?.message || "无效的资源ID";
          } else if (status === 401) {
            errorMessage = "未登录或登录已过期，请重新登录";
          } else if (status === 403) {
            errorMessage = "无权限删除资源，仅管理员可以删除资源";
          } else if (status === 404) {
            errorMessage = "资源不存在";
          } else if (data?.message) {
            errorMessage = data.message;
          } else if (data?.error) {
            errorMessage = data.error;
          } else {
            errorMessage = `删除失败 (${status})，请重试或联系管理员`;
          }
        } else if (error.message) {
          if (error.message.includes("Network Error") || error.message.includes("timeout")) {
            errorMessage = "网络连接失败，请检查网络后重试";
          } else {
            errorMessage = error.message;
          }
        }
        
        notification.error(errorMessage);
      } finally {
        this.deleting[resourceId] = false;
        console.log(`[AdminResources] 删除操作完成，资源 ${resourceId}`);
      }
    },
  },
});
</script>

<style scoped>
/* 扁平化设计 - 统一风格 */
.admin-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;
  background: #f8f9fa;
}

.admin-header {
  margin-bottom: 1.5rem;
  padding: 1.25rem 1.5rem;
  background: white;
  border: 1px solid #dee2e6;
}

.admin-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

.admin-subtitle {
  font-size: 0.875rem;
  margin-top: 0.25rem;
  color: #6c757d;
}

.stat-card {
  background: white;
  border: 1px solid #dee2e6;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: background-color 0.15s ease;
}

.stat-card:hover {
  background-color: #f8f9fa;
}

.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 600;
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
  border: 1px solid #dee2e6;
  padding: 1.5rem;
}

.table {
  margin: 0;
}

.table thead {
  background: #f8f9fa;
}

.table thead th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
  padding: 0.75rem;
}

.table tbody td {
  padding: 0.75rem;
  vertical-align: middle;
}

.table tbody tr {
  border-bottom: 1px solid #f0f0f0;
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
