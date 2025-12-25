<template>
  <div class="admin-container">
    <!-- 页面头部 -->
    <div class="admin-header">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h2 class="admin-title">
            <i class="bi bi-people-fill me-2"></i>用户管理
          </h2>
          <p class="admin-subtitle text-muted mb-0">管理系统用户角色和权限</p>
        </div>
        <button
          class="btn btn-outline-primary"
          @click="fetchUsers"
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
          <div class="stat-icon bg-primary">
            <i class="bi bi-people"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ totalUsers }}</div>
            <div class="stat-label">总用户数</div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon bg-success">
            <i class="bi bi-shield-check"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ adminCount }}</div>
            <div class="stat-label">管理员</div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon bg-info">
            <i class="bi bi-pencil-square"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ editorCount }}</div>
            <div class="stat-label">编辑</div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon bg-warning">
            <i class="bi bi-person-plus"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ contributorCount }}</div>
            <div class="stat-label">贡献者</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户表格 -->
    <div class="admin-card">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">加载中...</span>
        </div>
        <p class="mt-3 text-muted">正在加载用户数据...</p>
      </div>

      <div v-else-if="users.length === 0" class="text-center py-5">
        <i class="bi bi-inbox display-1 text-muted"></i>
        <p class="mt-3 text-muted">暂无用户数据</p>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th style="width: 80px;">ID</th>
              <th>用户名</th>
              <th>昵称</th>
              <th>邮箱</th>
              <th style="width: 150px;">角色</th>
              <th style="width: 120px;">注册时间</th>
              <th style="width: 120px;">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>
                <span class="badge bg-secondary">#{{ user.id }}</span>
              </td>
              <td>
                <strong>{{ user.username || user.name || '-' }}</strong>
              </td>
              <td>{{ user.nickname || '-' }}</td>
              <td>
                <span v-if="user.email">{{ user.email }}</span>
                <span v-else class="text-muted">未设置</span>
              </td>
              <td>
                <select
                  v-model="userEdits[user.id]"
                  :disabled="isCurrentUser(user.id)"
                  class="form-select form-select-sm"
                  :class="{ 'border-warning': userEdits[user.id] !== user.role && !isCurrentUser(user.id) }"
                >
                  <option value="user">普通用户</option>
                  <option value="contributor">贡献者</option>
                  <option value="editor">编辑</option>
                  <option value="admin">管理员</option>
                </select>
              </td>
              <td>
                <small class="text-muted">{{ formatDate(user.created_at) }}</small>
              </td>
              <td>
                <button
                  v-if="!isCurrentUser(user.id)"
                  class="btn btn-sm btn-primary"
                  @click="saveRole(user.id)"
                  :disabled="saving[user.id] || userEdits[user.id] === user.role"
                >
                  <span v-if="saving[user.id]">
                    <span class="spinner-border spinner-border-sm me-1"></span>
                    保存中
                  </span>
                  <span v-else>
                    <i class="bi bi-check-lg me-1"></i>保存
                  </span>
                </button>
                <span v-else class="badge bg-info">
                  <i class="bi bi-person-check me-1"></i>当前用户
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
import { mapGetters } from "vuex";

export default defineComponent({
  name: "AdminUsers",

  data() {
    return {
      users: [],
      loading: false,
      userEdits: {},
      saving: {},
    };
  },

  computed: {
    ...mapGetters({
      currentUser: "auth/user",
    }),
    
    totalUsers() {
      return this.users.length;
    },
    
    adminCount() {
      return this.users.filter(u => u.role === 'admin').length;
    },
    
    editorCount() {
      return this.users.filter(u => u.role === 'editor').length;
    },
    
    contributorCount() {
      return this.users.filter(u => u.role === 'contributor').length;
    },
  },

  created() {
    this.fetchUsers();
  },

  methods: {
    async fetchUsers() {
      this.loading = true;
      try {
        let response;
        try {
          response = await apiHttpClient.get("/api/admin/users");
        } catch (error) {
          if (error.response?.status === 404) {
            response = await apiHttpClient.get("/admin/users");
          } else {
            throw error;
          }
        }
        
        const users = response.data?.users || response.data || [];
        this.users = Array.isArray(users) ? users : [];
        
        this.users.forEach((user) => {
          this.$set(this.userEdits, user.id, user.role || 'user');
        });
        
        console.log("[AdminUsers] 获取到用户数量:", this.users.length);
      } catch (error) {
        console.error("[AdminUsers] 获取用户列表失败:", error);
        console.error("[AdminUsers] 错误详情:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        notification.error(
          error.response?.data?.message || 
          error.response?.data?.error ||
          "获取用户列表失败，请检查网络连接"
        );
      } finally {
        this.loading = false;
      }
    },

    isCurrentUser(userId) {
      return this.currentUser && String(this.currentUser.id) === String(userId);
    },

    async saveRole(userId) {
      const newRole = this.userEdits[userId];
      if (!newRole) {
        notification.warning("请选择角色");
        return;
      }

      this.$set(this.saving, userId, true);
      try {
        await apiHttpClient.patch(`/api/admin/users/${userId}/role`, {
          role: newRole,
        });

        notification.success("角色已更新");
        
        const user = this.users.find((u) => u.id === userId);
        if (user) {
          user.role = newRole;
        }
      } catch (error) {
        console.error("[AdminUsers] 更新角色失败:", error);
        notification.error(
          error.response?.data?.message || "更新角色失败"
        );
        const user = this.users.find((u) => u.id === userId);
        if (user) {
          this.$set(this.userEdits, userId, user.role);
        }
      } finally {
        this.$set(this.saving, userId, false);
      }
    },

    formatDate(date) {
      if (!date) return "未知";
      try {
        return new Date(date).toLocaleDateString("zh-CN", {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
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

.form-select-sm {
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
}

.border-warning {
  border-color: #ffc107 !important;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}
</style>
