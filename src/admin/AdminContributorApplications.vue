<template>
  <div class="admin-container">
    <div class="admin-header">
      <h2 class="admin-title">
        <i class="bi bi-person-check-fill me-2"></i>贡献者申请审核
      </h2>
      <p class="admin-subtitle text-muted mb-0">审核用户提交的贡献者申请</p>
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
        <div class="col-md-8 text-end">
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
            <td>{{ app.user?.username || app.user?.name || '未知用户' }}</td>
            <td>{{ app.user?.email || '-' }}</td>
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
              <button
                v-if="app.status === 'pending'"
                type="button"
                class="btn btn-sm btn-success me-2"
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
        const params = this.statusFilter ? { status: this.statusFilter } : {};
        const response = await apiHttpClient.get("/api/contributor-applications", { params });
        console.log("[AdminContributorApplications] 申请列表:", response.data);
        
        this.applications = Array.isArray(response.data) 
          ? response.data 
          : (response.data?.data || response.data?.applications || []);
      } catch (error) {
        console.error("[AdminContributorApplications] 获取申请列表失败:", error);
        notification.error(
          error.response?.data?.message || "获取申请列表失败"
        );
      } finally {
        this.loading = false;
      }
    },
    
    async handleApprove(applicationId) {
      if (!confirm("确认通过该申请吗？")) {
        return;
      }
      
      this.processing = true;
      try {
        console.log("[AdminContributorApplications] 通过申请:", applicationId);
        await apiHttpClient.post(`/api/contributor-applications/${applicationId}/approve`);
        console.log("[AdminContributorApplications] 申请已通过");
        
        notification.success("申请已通过");
        await this.fetchApplications(); // 刷新列表
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
      if (!confirm("确认拒绝该申请吗？")) {
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
.admin-container {
  padding: 2rem;
}

.admin-header {
  margin-bottom: 2rem;
}

.admin-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.filter-section {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}

.table {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.table th {
  background: #f8f9fa;
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
}

.badge {
  padding: 0.35em 0.65em;
  font-weight: 500;
}
</style>

