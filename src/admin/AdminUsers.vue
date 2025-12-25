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
        <div class="d-flex align-items-center header-actions">
          <router-link to="/admin/resources" class="btn btn-header btn-success mr-2">
            <i class="bi bi-file-earmark-text me-2"></i>资源管理
          </router-link>
          <router-link to="/admin" class="btn btn-header btn-outline-secondary mr-2">
            <i class="bi bi-house me-2"></i>管理首页
          </router-link>
          <button
            class="btn btn-header btn-outline-primary"
            @click="fetchUsers"
            :disabled="loading"
          >
            <i class="bi bi-arrow-clockwise me-2" :class="{ 'spinning': loading }"></i>刷新
          </button>
        </div>
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
        <table class="table table-hover align-middle user-table">
          <thead>
            <tr>
              <th class="col-id">ID</th>
              <th class="col-username">用户名</th>
              <th class="col-nickname">昵称</th>
              <th class="col-email">邮箱</th>
              <th class="col-role">角色</th>
              <th class="col-date">注册时间</th>
              <th class="col-actions">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="user-row">
              <td>
                <span class="user-id-badge">#{{ user.id }}</span>
              </td>
              <td>
                <strong class="user-name">{{ getUserName(user) }}</strong>
              </td>
              <td>
                <span class="user-nickname">{{ user.nickname || '-' }}</span>
              </td>
              <td>
                <span v-if="user.email">{{ user.email }}</span>
                <span v-else class="text-muted">未设置</span>
              </td>
              <td>
                <div class="role-select-wrapper">
                  <select
                    v-model="userEdits[user.id]"
                    :disabled="isCurrentUser(user.id)"
                    class="form-select form-select-sm role-select"
                    :class="{ 
                      'role-changed': userEdits[user.id] !== user.role && !isCurrentUser(user.id)
                    }"
                  >
                    <option value="user">普通用户</option>
                    <option value="contributor">贡献者</option>
                    <option value="editor">编辑</option>
                    <option value="admin">管理员</option>
                  </select>
                  <span v-if="isCurrentUser(user.id)" class="current-user-badge">
                    当前用户
                  </span>
                </div>
              </td>
              <td>
                <small class="text-muted">{{ formatDate(user.created_at) }}</small>
              </td>
              <td>
                <div class="action-buttons">
                  <button
                    v-if="!isCurrentUser(user.id)"
                    class="btn btn-sm btn-save"
                    @click="saveRole(user.id)"
                    :disabled="saving[user.id] || userEdits[user.id] === user.role"
                    :title="userEdits[user.id] === user.role ? '角色未变化' : '保存角色变更'"
                  >
                    <span v-if="saving[user.id]">
                      <span class="spinner-border spinner-border-sm me-1"></span>
                      保存中
                    </span>
                    <span v-else>
                      <i class="bi bi-check-lg me-1"></i>保存
                    </span>
                  </button>
                  <button
                    v-if="!isCurrentUser(user.id)"
                    class="btn btn-sm btn-delete"
                    @click="deleteUser(user.id, getUserName(user))"
                    :disabled="deleting[user.id]"
                    title="删除用户"
                  >
                    <span v-if="deleting[user.id]">
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
import { mapGetters } from "vuex";

export default defineComponent({
  name: "AdminUsers",

  data() {
    return {
      users: [],
      loading: false,
      userEdits: {},
      saving: {},
      deleting: {},
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
        // 检查 token
        const token = localStorage.getItem('auth_token');
        console.log("[AdminUsers] Token 存在:", !!token);
        
        let response;
        try {
          response = await apiHttpClient.get("/api/admin/users");
        } catch (error) {
          // 如果 404，尝试另一个路径
          if (error.response?.status === 404) {
            try {
              response = await apiHttpClient.get("/admin/users");
            } catch (retryError) {
              throw retryError; // 重试失败，抛出错误
            }
          } else {
            throw error; // 其他错误直接抛出
          }
        }
        
        console.log("[AdminUsers] 响应状态:", response.status);
        console.log("[AdminUsers] 响应数据:", response.data);
        
        // 后端返回格式: { success: true, data: [...] }
        // 需要访问 response.data.data 获取数组
        let users = [];
        if (response.data) {
          if (response.data.data && Array.isArray(response.data.data)) {
            users = response.data.data;
            console.log("[AdminUsers] 从 response.data.data 获取数据");
          } else if (response.data.users && Array.isArray(response.data.users)) {
            users = response.data.users;
            console.log("[AdminUsers] 从 response.data.users 获取数据");
          } else if (Array.isArray(response.data)) {
            users = response.data;
            console.log("[AdminUsers] 从 response.data 获取数据（直接数组）");
          }
        }
        
        if (users.length === 0) {
          console.warn("[AdminUsers] 未获取到用户数据，响应结构:", response.data);
          this.users = [];
        } else {
          this.users = users;
          
          // 初始化 userEdits，确保角色正确显示
          // 先清空旧的编辑状态
          const newUserEdits = {};
          
          this.users.forEach((user) => {
            // 确保使用正确的角色值，必须是 'user', 'contributor', 'editor', 'admin' 之一
            // 如果没有 role 或 role 无效，默认为 'user'
            const role = (user.role && ['user', 'contributor', 'editor', 'admin'].includes(user.role)) 
              ? user.role 
              : 'user';
            // 使用原始 ID（可能是数字或字符串），Vue 的 v-model 应该能处理
            newUserEdits[user.id] = role;
            console.log(`[AdminUsers] 用户 ${user.id} (${user.username || user.name || '未知'}): 原始角色=${user.role || 'undefined'}, 设置角色=${role}, userEdits[${user.id}]=${newUserEdits[user.id]}`);
          });
          
          // 一次性更新 userEdits，确保 Vue 响应式更新
          this.userEdits = newUserEdits;
          
          console.log("[AdminUsers] 获取到用户数量:", this.users.length);
          if (this.users.length > 0) {
            console.log("[AdminUsers] 用户数据示例（完整）:", JSON.stringify(this.users[0], null, 2));
            console.log("[AdminUsers] userEdits 状态:", JSON.stringify(this.userEdits));
            // 验证每个用户的角色和用户名
            this.users.forEach((user) => {
              const expectedRole = user.role || 'user';
              const actualRole = this.userEdits[user.id];
              const displayName = this.getUserName(user);
              console.log(`[AdminUsers] 用户 ${user.id}:`, {
                id: user.id,
                username: user.username,
                name: user.name,
                nickname: user.nickname,
                role: user.role,
                userEdits_role: actualRole,
                displayName: displayName
              });
            });
          }
        }
      } catch (error) {
        console.error("[AdminUsers] 获取用户列表失败:", error);
        console.error("[AdminUsers] 错误详情:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        
        // 只有在真正出错时才显示错误提示（如果已经有数据了，可能是部分失败）
        if (this.users.length === 0) {
          notification.error(
            error.response?.data?.message || 
            error.response?.data?.error ||
            "获取用户列表失败，请检查网络连接"
          );
        } else {
          // 有部分数据，只显示警告
          console.warn("[AdminUsers] 获取用户列表时出现错误，但已有部分数据");
        }
      } finally {
        this.loading = false;
      }
    },

    isCurrentUser(userId) {
      return this.currentUser && String(this.currentUser.id) === String(userId);
    },

    getUserRole(userId) {
      // 获取用户在 userEdits 中的角色，如果没有则使用原始角色
      const user = this.users.find(u => String(u.id) === String(userId));
      if (!user) return 'user';
      
      // 优先使用 userEdits 中的值（用户可能已修改）
      const userIdStr = String(userId);
      if (this.userEdits[userIdStr] !== undefined) {
        return this.userEdits[userIdStr];
      }
      
      // 否则使用用户的原始角色
      const role = user.role || 'user';
      // 确保角色值有效
      return ['user', 'contributor', 'editor', 'admin'].includes(role) ? role : 'user';
    },

    onRoleChange(userId, event) {
      // 当用户修改角色时，更新 userEdits
      const newRole = event.target.value;
      // Vue 3 不需要 $set，直接赋值即可
      this.userEdits[userId] = newRole;
      console.log(`[AdminUsers] 用户 ${userId} 角色已修改为: ${newRole}`);
    },

    async saveRole(userId) {
      console.log(`[AdminUsers] 开始保存用户 ${userId} 的角色`);
      
      const newRole = this.userEdits[userId];
      const user = this.users.find((u) => u.id === userId);
      const oldRole = user?.role;
      
      console.log(`[AdminUsers] 用户 ${userId} 角色变更: ${oldRole} -> ${newRole}`);
      
      if (!newRole) {
        console.warn("[AdminUsers] 未选择角色");
        notification.warning("请选择角色");
        return;
      }

      // 如果角色没有变化，不需要保存
      if (newRole === oldRole) {
        console.log(`[AdminUsers] 用户 ${userId} 角色未变化，跳过保存`);
        notification.info("角色未发生变化");
        return;
      }

      // Vue 3 不需要 $set，直接赋值即可
      this.saving[userId] = true;
      try {
        console.log(`[AdminUsers] 发送 PATCH 请求: /api/admin/users/${userId}/role`, { role: newRole });
        
        const response = await apiHttpClient.patch(`/api/admin/users/${userId}/role`, {
          role: newRole,
        });

        console.log(`[AdminUsers] 更新角色成功:`, response.data);

        notification.success(`角色已更新为：${this.getRoleText(newRole)}`);
        
        if (user) {
          // 更新本地数据
          user.role = newRole;
          console.log(`[AdminUsers] 已更新本地用户数据，新角色: ${user.role}`);
        }
      } catch (error) {
        console.error("[AdminUsers] 更新角色失败:", error);
        console.error("[AdminUsers] 错误详情:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
        
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error ||
                            `更新角色失败: ${error.message || '未知错误'}`;
        notification.error(errorMessage);
        
        // 恢复原始角色
        if (user) {
          this.userEdits[userId] = user.role;
          console.log(`[AdminUsers] 已恢复用户 ${userId} 的角色为: ${user.role}`);
        }
      } finally {
        // Vue 3 不需要 $set，直接赋值即可
        this.saving[userId] = false;
        console.log(`[AdminUsers] 保存操作完成，用户 ${userId}`);
      }
    },

    getRoleText(role) {
      const roleMap = {
        'user': '普通用户',
        'contributor': '贡献者',
        'editor': '编辑',
        'admin': '管理员'
      };
      return roleMap[role] || role;
    },

    async deleteUser(userId, userName) {
      // 确认删除
      const confirmMessage = `确定要删除用户 "${userName}" (ID: ${userId}) 吗？\n\n此操作不可恢复！`;
      const confirmed = await notification.confirm(confirmMessage, '删除用户');
      if (!confirmed) {
        console.log(`[AdminUsers] 用户取消删除用户 ${userId}`);
        return;
      }

      console.log(`[AdminUsers] 开始删除用户 ${userId} (${userName})`);
      
      // 设置删除状态
      this.deleting[userId] = true;
      
      try {
        // 尝试多个可能的 API 路径
        let response;
        let lastError;
        
        const deleteEndpoints = [
          `/api/users/${userId}`,
          `/users/${userId}`,
        ];

        for (const endpoint of deleteEndpoints) {
          try {
            console.log(`[AdminUsers] 尝试删除接口: ${endpoint}`);
            response = await apiHttpClient.delete(endpoint);
            console.log(`[AdminUsers] 删除成功，响应:`, response.data);
            break; // 成功则跳出循环
          } catch (error) {
            console.log(`[AdminUsers] 接口失败: ${endpoint}`, {
              status: error.response?.status,
              message: error.response?.data?.message || error.message,
            });
            lastError = error;
            // 如果是 404 或 405，继续尝试下一个接口
            if (error.response?.status === 404 || error.response?.status === 405) {
              continue;
            }
            // 如果是 401 或 403，说明是权限问题，直接抛出
            if (error.response?.status === 401 || error.response?.status === 403) {
              throw error;
            }
            // 其他错误也继续尝试下一个接口
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

        // 删除成功
        notification.success(`用户 "${userName}" 已删除`);
        
        // 从列表中移除该用户
        this.users = this.users.filter(u => u.id !== userId);
        // 清理 userEdits 中的该用户
        delete this.userEdits[userId];
        
        console.log(`[AdminUsers] 用户 ${userId} 已从列表中移除`);
        
      } catch (error) {
        console.error("[AdminUsers] 删除用户失败:", error);
        console.error("[AdminUsers] 错误详情:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
        
        // 根据错误类型显示更详细的错误信息
        let errorMessage = "删除用户失败";
        
        if (error.response) {
          const status = error.response.status;
          const data = error.response.data;
          
          if (status === 400) {
            errorMessage = data?.message || "无效的用户ID或禁止删除最后一个管理员";
          } else if (status === 401) {
            errorMessage = "未登录或登录已过期，请重新登录";
          } else if (status === 403) {
            errorMessage = "无权限删除用户，仅管理员可以删除用户";
          } else if (status === 404) {
            errorMessage = "用户不存在";
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
        // 清除删除状态
        this.deleting[userId] = false;
        console.log(`[AdminUsers] 删除操作完成，用户 ${userId}`);
      }
    },

    getUserName(user) {
      // 根据后端实际返回的字段来显示用户名
      if (!user) return '-';
      
      // 优先显示 username（如果存在）
      if (user.username !== undefined && user.username !== null && user.username !== '') {
        return String(user.username);
      }
      
      // 其次显示 nickname（后端实际返回的字段）
      if (user.nickname !== undefined && user.nickname !== null && user.nickname !== '') {
        return String(user.nickname);
      }
      
      // 再次显示 name（如果存在）
      if (user.name !== undefined && user.name !== null && user.name !== '') {
        return String(user.name);
      }
      
      // 最后才显示 ID
      return user.id ? `用户 #${user.id}` : '-';
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

.user-table {
  margin: 0;
}

.user-table thead {
  background: #f8f9fa;
}

.user-table thead th {
  font-weight: 600;
  font-size: 0.75rem;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
  padding: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.user-table tbody tr {
  border-bottom: 1px solid #f0f0f0;
}

.user-table tbody tr:hover {
  background-color: #f8f9fa;
}

.user-table tbody td {
  padding: 0.75rem;
  vertical-align: middle;
}

.user-id-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: #6c757d;
  color: white;
  font-weight: 500;
  font-size: 0.75rem;
}

.user-name {
  color: #212529;
  font-size: 0.875rem;
  font-weight: 600;
}

.user-nickname {
  color: #6c757d;
  font-size: 0.875rem;
}

.user-email {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #495057;
}

.role-select-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.role-select {
  min-width: 120px;
  font-size: 0.875rem;
  padding: 0.375rem 0.5rem;
  border: 1px solid #ced4da;
}

.role-select:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.role-select.role-changed {
  border-color: #ffc107;
  background-color: #fff3cd;
}

.role-select:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}

.current-user-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: #17a2b8;
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
}

.date-info {
  display: flex;
  align-items: center;
  color: #6c757d;
  font-size: 0.875rem;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-save {
  background: #28a745;
  border: 1px solid #28a745;
  color: white;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.btn-save:hover:not(:disabled) {
  background: #218838;
  border-color: #1e7e34;
}

.btn-save:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-delete {
  background: #dc3545;
  border: 1px solid #dc3545;
  color: white;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.btn-delete:hover:not(:disabled) {
  background: #c82333;
  border-color: #bd2130;
}

.btn-delete:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.col-id { width: 80px; }
.col-username { min-width: 150px; }
.col-nickname { min-width: 120px; }
.col-email { min-width: 200px; }
.col-role { width: 180px; }
.col-date { width: 140px; }
.col-actions { width: 180px; }

@media (max-width: 1200px) {
  .admin-container {
    padding: 1rem;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .btn-save,
  .btn-delete {
    width: 100%;
  }
}
</style>
