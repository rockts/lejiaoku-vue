<template>
  <div class="admin-container">
    <!-- 页面头部 -->
    <div class="admin-header">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h2 class="admin-title">
            <i class="bi bi-person-check-fill me-2"></i>贡献者申请审核
          </h2>
          <p class="admin-subtitle text-muted mb-0">审核用户提交的贡献者申请</p>
        </div>
        <div class="d-flex align-items-center header-actions">
          <router-link to="/admin/users" class="btn btn-header btn-primary me-2">
            <i class="bi bi-people me-2"></i>用户管理
          </router-link>
          <router-link to="/admin/resources" class="btn btn-header btn-success me-2">
            <i class="bi bi-file-earmark-text me-2"></i>资源管理
          </router-link>
          <router-link to="/admin" class="btn btn-header btn-outline-secondary me-2">
            <i class="bi bi-house me-2"></i>管理首页
          </router-link>
          <button
            class="btn btn-header btn-outline-primary"
            @click="fetchApplications"
            :disabled="loading"
          >
            <i class="bi bi-arrow-clockwise me-2" :class="{ 'spinning': loading }"></i>刷新
          </button>
        </div>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="filter-section mt-4 mb-3">
      <div class="row align-items-center">
        <div class="col-md-4">
          <label class="form-label">状态筛选</label>
          <select v-model="statusFilter" class="form-select" @change="fetchApplications">
            <option value="">全部</option>
            <option value="pending">待审核</option>
            <option value="approved">已通过</option>
            <option value="rejected">已拒绝</option>
          </select>
        </div>
        <div class="col-md-8 text-center">
          <button
            type="button"
            class="btn btn-outline-primary"
            @click="fetchApplications"
            :disabled="loading"
          >
            <i class="bi bi-arrow-clockwise me-2"></i>刷新
          </button>
        </div>
      </div>
    </div>

    <!-- 申请列表 -->
    <div class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>邮箱</th>
            <th>申请时间</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="6" class="text-center py-4">
              <span class="spinner-border spinner-border-sm me-2"></span>
              加载中...
            </td>
          </tr>
          <tr v-else-if="applications.length === 0">
            <td colspan="6" class="text-center py-4 text-muted">
              暂无申请记录
            </td>
          </tr>
          <tr v-else v-for="app in applications" :key="app.id">
            <td>{{ app.id }}</td>
            <td>
              <template v-if="app.user">
                {{ app.user.username || app.user.name || app.user.nickname || '未知用户' }}
              </template>
              <template v-else-if="app.user_id">
                用户ID: {{ app.user_id }} (用户信息缺失)
              </template>
              <template v-else>
                未知用户
              </template>
            </td>
            <td>
              <template v-if="app.user">
                {{ app.user.email || '-' }}
              </template>
              <template v-else>
                -
              </template>
            </td>
            <td>{{ formatDate(app.created_at) }}</td>
            <td>
              <span
                class="badge"
                :class="{
                  'bg-warning': app.status === 'pending',
                  'bg-success': app.status === 'approved',
                  'bg-danger': app.status === 'rejected',
                }"
              >
                {{ getStatusText(app.status) }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button
                  v-if="app.status === 'pending'"
                  type="button"
                  class="btn btn-sm btn-success"
                  @click="handleApprove(app.id)"
                  :disabled="processing"
                >
                  <i class="bi bi-check-circle me-1"></i>同意
                </button>
                <button
                  v-if="app.status === 'pending'"
                  type="button"
                  class="btn btn-sm btn-danger"
                  @click="handleReject(app.id)"
                  :disabled="processing"
                >
                  <i class="bi bi-x-circle me-1"></i>拒绝
                </button>
                <span v-else class="text-muted">-</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import { apiHttpClient } from "@/app/app.service";
import notification from "@/utils/notification";

export default defineComponent({
  name: "AdminContributorApplications",
  data() {
    return {
      applications: [],
      loading: false,
      processing: false,
      statusFilter: "",
    };
  },
  computed: {
    ...mapGetters({
      isAdmin: "auth/isAdmin",
    }),
  },
  async created() {
    // 权限检查
    if (!this.isAdmin) {
      notification.error("无权限访问");
      this.$router.push("/");
      return;
    }
    
    await this.fetchApplications();
  },
  methods: {
    async fetchApplications() {
      this.loading = true;
      try {
        console.log("[AdminContributorApplications] 获取申请列表...");
        console.log("[AdminContributorApplications] 当前筛选状态:", this.statusFilter);
        const params = this.statusFilter ? { status: this.statusFilter } : {};
        console.log("[AdminContributorApplications] 请求参数:", params);
        const response = await apiHttpClient.get("/api/contributor-applications", { params });
        console.log("[AdminContributorApplications] API 响应:", response);
        console.log("[AdminContributorApplications] response.data:", response.data);
        console.log("[AdminContributorApplications] response.data 类型:", typeof response.data);
        console.log("[AdminContributorApplications] response.data 是否为数组:", Array.isArray(response.data));
        
        let applications = [];
        if (Array.isArray(response.data)) {
          applications = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          applications = response.data.data;
        } else if (response.data?.applications && Array.isArray(response.data.applications)) {
          applications = response.data.applications;
        } else if (response.data && typeof response.data === 'object') {
          // 如果是单个对象，转换为数组
          applications = [response.data];
        }
        
        console.log("[AdminContributorApplications] 解析后的申请列表:", applications);
        console.log("[AdminContributorApplications] 申请数量:", applications.length);
        
        // 检查每个申请是否包含用户信息
        applications.forEach((app, index) => {
          console.log(`[AdminContributorApplications] 申请 ${index + 1}:`, {
            id: app.id,
            status: app.status,
            user: app.user,
            userId: app.user_id,
            createdAt: app.created_at
          });
        });
        
        this.applications = applications;
      } catch (error) {
        console.error("[AdminContributorApplications] 获取申请列表失败:", error);
        console.error("[AdminContributorApplications] 错误详情:", {
          message: error.message,
          response: error.response,
          status: error.response?.status,
          data: error.response?.data
        });
        notification.error(
          error.response?.data?.message || error.message || "获取申请列表失败"
        );
      } finally {
        this.loading = false;
      }
    },
    
    async handleApprove(applicationId) {
      const confirmed = await notification.confirm(
        "确认通过该申请吗？",
        "通过申请"
      );
      if (!confirmed) {
        return;
      }
      
      this.processing = true;
      try {
        console.log("[AdminContributorApplications] 通过申请:", applicationId);
        await apiHttpClient.post(`/api/contributor-applications/${applicationId}/approve`);
        console.log("[AdminContributorApplications] 申请已通过");
        
        notification.success("申请已通过");
        // 如果当前筛选的是"已通过"，保持筛选状态；否则刷新全部列表
        await this.fetchApplications();
      } catch (error) {
        console.error("[AdminContributorApplications] 通过申请失败:", error);
        notification.error(
          error.response?.data?.message || "操作失败"
        );
      } finally {
        this.processing = false;
      }
    },
    
    async handleReject(applicationId) {
      const confirmed = await notification.confirm(
        "确认拒绝该申请吗？",
        "拒绝申请"
      );
      if (!confirmed) {
        return;
      }
      
      this.processing = true;
      try {
        console.log("[AdminContributorApplications] 拒绝申请:", applicationId);
        await apiHttpClient.post(`/api/contributor-applications/${applicationId}/reject`);
        console.log("[AdminContributorApplications] 申请已拒绝");
        
        notification.success("申请已拒绝");
        await this.fetchApplications(); // 刷新列表
      } catch (error) {
        console.error("[AdminContributorApplications] 拒绝申请失败:", error);
        notification.error(
          error.response?.data?.message || "操作失败"
        );
      } finally {
        this.processing = false;
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return "-";
      const date = new Date(dateString);
      return date.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    
    getStatusText(status) {
      const statusMap = {
        pending: "待审核",
        approved: "已通过",
        rejected: "已拒绝",
      };
      return statusMap[status] || status;
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
  background: var(--bg, #f8f9fa);
}

.admin-header {
  margin-bottom: 1.5rem;
  padding: 1.25rem 1.5rem;
  background: var(--surface, white);
  border: 1px solid var(--border, #dee2e6);
  border-radius: 12px;
}

.admin-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text, #212529);
  margin: 0;
}

.admin-subtitle {
  font-size: 0.875rem;
  margin-top: 0.25rem;
  color: var(--muted, #6c757d);
}

.header-actions {
  gap: 0.5rem;
}

.btn-header {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-header:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.filter-section {
  background: var(--surface, white);
  border: 1px solid var(--border, #dee2e6);
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.admin-card {
  background: var(--surface, white);
  border: 1px solid var(--border, #dee2e6);
  padding: 1.5rem;
  border-radius: 8px;
}

.table-responsive {
  border-radius: 8px;
  overflow: hidden;
}

.table {
  margin: 0;
  background: var(--surface, white);
}

.table thead {
  background: var(--bg, #f8f9fa);
}

.table thead th {
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--muted, #495057);
  border-bottom: 2px solid var(--border, #dee2e6);
  padding: 0.75rem;
}

.table tbody tr {
  border-bottom: 1px solid var(--border, #f0f0f0);
}

.table tbody tr:hover {
  background-color: var(--bg, #f8f9fa);
}

.table tbody td {
  padding: 0.75rem;
  vertical-align: middle;
}

.badge {
  padding: 0.4em 0.8em;
  font-weight: 500;
  font-size: 0.875rem;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-sm:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.btn-success {
  background: #28a745;
  border-color: #28a745;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #218838;
  border-color: #1e7e34;
}

.btn-danger {
  background: #dc3545;
  border-color: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
  border-color: #bd2130;
}

.btn-sm:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* 页面底部按钮容器始终居中 */
.admin-container > *:last-child .btn,
.admin-container > *:last-child button,
.admin-container .text-center .btn,
.admin-container .text-center button {
  display: inline-block;
}

/* 确保空状态时的按钮居中 */
.admin-card .text-center,
.table-responsive .text-center {
  text-align: center !important;
}

/* 底部操作区域居中 */
.admin-container .action-area-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #dee2e6;
}

@media (max-width: 768px) {
  .admin-container {
    padding: 1rem;
  }
  
  .admin-header {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 1rem;
  }
  
  .header-actions {
    flex-wrap: wrap;
    width: 100%;
  }
  
  .btn-header {
    flex: 1;
    min-width: 120px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .btn-sm {
    width: 100%;
  }
  
  .action-area-bottom {
    flex-direction: column;
  }
}
</style>


