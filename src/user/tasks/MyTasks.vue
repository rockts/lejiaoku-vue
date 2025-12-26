<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2><i class="bi bi-list-check me-2"></i>我的任务</h2>
        <p class="text-muted small mb-0">
          <i class="bi bi-info-circle me-1"></i>
          点击"查看"按钮跳转到教材章节页，在教材页面可以创建任务或上传资源
        </p>
      </div>
      <button 
        class="btn btn-outline-primary" 
        @click="fetchTasks"
        :disabled="loading"
      >
        <i class="bi bi-arrow-clockwise me-2"></i>刷新
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">加载中...</span>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="tasks.length === 0 && !apiNotFound" class="text-center py-5">
      <i class="bi bi-inbox display-1 text-muted"></i>
      <p class="mt-3 text-muted">暂无任务</p>
      <p class="text-muted small">创建的任务将显示在这里</p>
    </div>

    <!-- API 不存在提示 -->
    <div v-else-if="apiNotFound" class="text-center py-5">
      <i class="bi bi-exclamation-triangle display-1 text-warning"></i>
      <h4 class="mt-3">任务功能暂未启用</h4>
      <p class="text-muted mt-2">
        后端尚未实现任务相关接口，该功能正在开发中。
      </p>
      <div class="alert alert-info mt-4 text-start" style="max-width: 600px; margin: 0 auto;">
        <h6 class="alert-heading">后端需要实现的接口：</h6>
        <ul class="mb-0">
          <li><code>POST /api/tasks</code> - 创建任务</li>
          <li><code>GET /my/tasks</code> 或 <code>GET /api/tasks/my</code> - 获取我的任务列表</li>
        </ul>
        <hr>
        <p class="mb-0 small">
          <strong>请求参数示例（创建任务）：</strong><br>
          <code>{ task_type: "add_resources", catalog_id: 123, unit: "第一单元" }</code>
        </p>
      </div>
    </div>

    <!-- 任务列表 -->
    <div v-else class="tasks-list">
      <div 
        v-for="task in tasks" 
        :key="task.id" 
        class="task-card card mb-3"
        :class="{ 'task-card-clickable': task.catalog_id }"
        @click="handleTaskClick(task)"
      >
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start">
            <div class="task-content flex-grow-1">
              <h5 class="card-title mb-2">
                <i class="bi" :class="getTaskIcon(task.task_type)"></i>
                <span class="ms-2">{{ getTaskTypeText(task.task_type) }}</span>
              </h5>
              <p class="card-text text-muted mb-2" v-if="task.catalog_info || task.catalog_id">
                <strong>教材：</strong>
                <span v-if="task.catalog_info">{{ task.catalog_info.displayName || task.catalog_info.textbook_version || `教材 #${task.catalog_id}` }}</span>
                <span v-else>教材 #{{ task.catalog_id }}</span>
              </p>
              <p class="card-text text-muted mb-2" v-if="task.unit">
                <strong>单元：</strong>{{ task.unit }}
              </p>
              <p class="card-text mb-0">
                <small class="text-muted">
                  <i class="bi bi-clock me-1"></i>
                  创建时间：{{ formatDate(task.created_at) }}
                </small>
              </p>
            </div>
            <div class="task-status ms-3 d-flex flex-column align-items-end gap-2">
              <span class="badge" :class="getStatusClass(task.status)">
                {{ getStatusText(task.status) }}
              </span>
              <div class="d-flex gap-2">
                <button
                  v-if="task.catalog_id"
                  class="btn btn-sm btn-outline-primary"
                  @click.stop="goToCatalog(task)"
                  title="查看教材章节"
                >
                  <i class="bi bi-arrow-right me-1"></i>查看
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click.stop="deleteTask(task)"
                  title="删除任务"
                  :disabled="deletingTaskId === task.id"
                >
                  <i v-if="deletingTaskId !== task.id" class="bi bi-trash"></i>
                  <span v-else class="spinner-border spinner-border-sm" role="status"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { apiHttpClient } from "@/app/app.service";

export default defineComponent({
  name: "MyTasks",

  data() {
    return {
      tasks: [],
      loading: false,
      apiNotFound: false, // API 不存在标志
    };
  },

  created() {
    this.fetchTasks();
  },

  methods: {
    /**
     * 获取任务列表
     */
    async fetchTasks() {
      this.loading = true;
      try {
        // 尝试多个可能的 API 路径
        let response = null;
        const possiblePaths = [
          "/my/tasks",           // 参考 /my/resources 的格式
          "/api/my/tasks",       // 带 /api 前缀
          "/api/tasks/my",       // 原始路径
          "/api/tasks",          // 获取所有任务（可能需要过滤）
        ];

        let lastError = null;
        for (const path of possiblePaths) {
          try {
            console.log(`[MyTasks] 尝试 API 路径: ${path}`);
            response = await apiHttpClient.get(path);
            console.log(`[MyTasks] ${path} 响应成功:`, response.data);
            break; // 成功则跳出循环
          } catch (error) {
            console.warn(`[MyTasks] ${path} 失败:`, error.response?.status, error.message);
            lastError = error;
            // 如果是 404，继续尝试下一个路径
            if (error.response?.status === 404) {
              continue;
            }
            // 其他错误直接抛出
            throw error;
          }
        }

        // 如果所有路径都失败，抛出最后一个错误
        if (!response && lastError) {
          throw lastError;
        }

        if (!response) {
          throw new Error("无法连接到后端服务");
        }

        console.log("[MyTasks] 任务列表响应:", response.data);

        // 处理不同的响应格式
        if (response.data) {
          if (response.data.data && Array.isArray(response.data.data)) {
            this.tasks = response.data.data;
          } else if (response.data.tasks && Array.isArray(response.data.tasks)) {
            this.tasks = response.data.tasks;
          } else if (Array.isArray(response.data)) {
            this.tasks = response.data;
          } else {
            this.tasks = [];
          }
        } else {
          this.tasks = [];
        }

        // 如果是获取所有任务，需要过滤出当前用户的任务
        if (this.tasks.length > 0 && this.tasks[0].user_id) {
          const currentUser = this.$store.getters["auth/user"];
          if (currentUser && currentUser.id) {
            this.tasks = this.tasks.filter(
              (task) => task.user_id === currentUser.id
            );
          }
        }

        // 过滤掉用户已删除的任务（从 localStorage 读取）
        const deletedTaskIds = this.getDeletedTaskIds();
        const beforeFilter = this.tasks.length;
        this.tasks = this.tasks.filter(task => !deletedTaskIds.includes(String(task.id)));
        const afterFilter = this.tasks.length;
        if (beforeFilter !== afterFilter) {
          console.log(`[MyTasks] 过滤掉 ${beforeFilter - afterFilter} 个已删除的任务`);
        }

        console.log("[MyTasks] 任务数量:", this.tasks.length);
      } catch (error) {
        console.error("[MyTasks] 获取任务列表失败:", error);
        const { notification } = await import("@/utils/notification");
        
        if (error.response?.status === 404) {
          // 所有路径都返回 404，说明 API 不存在
          this.apiNotFound = true;
          // 不显示通知，因为页面会显示友好的提示
          console.warn("[MyTasks] 任务列表 API 不存在，后端需要实现该接口");
        } else {
          this.apiNotFound = false;
          notification.error(
            error.response?.data?.message || error.message || "获取任务列表失败"
          );
        }
      } finally {
        this.loading = false;
      }
    },

    /**
     * 获取任务类型文本
     */
    getTaskTypeText(taskType) {
      const typeMap = {
        add_resources: "补充教材资源",
        organize_units: "整理教材单元",
      };
      return typeMap[taskType] || taskType;
    },

    /**
     * 获取任务图标
     */
    getTaskIcon(taskType) {
      const iconMap = {
        add_resources: "bi-plus-circle-fill text-primary",
        organize_units: "bi-list-check text-info",
      };
      return iconMap[taskType] || "bi-circle";
    },

    /**
     * 获取状态样式类
     */
    getStatusClass(status) {
      const classMap = {
        pending: "text-bg-warning",
        in_progress: "text-bg-info",
        completed: "text-bg-success",
        cancelled: "text-bg-secondary",
      };
      return classMap[status] || "text-bg-secondary";
    },

    /**
     * 获取状态文本
     */
    getStatusText(status) {
      const textMap = {
        pending: "待处理",
        in_progress: "进行中",
        completed: "已完成",
        cancelled: "已取消",
      };
      return textMap[status] || status;
    },

    /**
     * 格式化日期
     */
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

    /**
     * 处理任务卡片点击
     */
    handleTaskClick(task) {
      if (task.catalog_id) {
        this.goToCatalog(task);
      }
    },

    /**
     * 跳转到教材章节页
     */
    goToCatalog(task) {
      if (!task.catalog_id) {
        console.warn("[MyTasks] 任务没有 catalog_id，无法跳转:", task);
        const { notification } = require("@/utils/notification");
        notification.warning("该任务没有关联的教材信息");
        return;
      }
      
      console.log("[MyTasks] 跳转到教材章节页:", {
        catalog_id: task.catalog_id,
        unit: task.unit,
        task_type: task.task_type,
        task: task
      });
      
      const routeParams = {
        path: `/catalog/${task.catalog_id}`,
      };
      
      // 如果有单元信息，添加到 query 参数
      if (task.unit) {
        routeParams.query = { 
          unit: task.unit,
          from_task: task.id // 标记来自任务跳转
        };
      } else {
        routeParams.query = { 
          from_task: task.id // 标记来自任务跳转
        };
      }
      
      this.$router.push(routeParams).catch(err => {
        // 忽略导航重复的错误
        if (err.name !== 'NavigationDuplicated') {
          console.error("[MyTasks] 路由跳转失败:", err);
        }
      });
    },

    /**
     * 删除任务
     */
    async deleteTask(task) {
      if (!task.id) {
        console.warn("[MyTasks] 任务没有 ID，无法删除:", task);
        return;
      }

      const { notification } = await import("@/utils/notification");
      const confirmed = await notification.confirm(
        `确定要删除任务"${this.getTaskTypeText(task.task_type)}"吗？`,
        {
          requireAgreement: false,
        }
      );

      if (!confirmed) return;

      this.deletingTaskId = task.id;
      try {
        // 尝试多个可能的 API 路径
        let response = null;
        const possiblePaths = [
          `/api/tasks/${task.id}`,      // 标准 RESTful 路径
          `/my/tasks/${task.id}`,       // 参考 /my/resources 的格式
          `/api/my/tasks/${task.id}`,   // 带 /api 前缀
        ];

        let lastError = null;
        for (const path of possiblePaths) {
          try {
            console.log(`[MyTasks] 尝试删除任务 API 路径: ${path}`);
            response = await apiHttpClient.delete(path);
            console.log(`[MyTasks] ${path} 删除任务成功:`, response.data);
            break; // 成功则跳出循环
          } catch (error) {
            console.warn(`[MyTasks] ${path} 删除任务失败:`, error.response?.status, error.message);
            lastError = error;
            // 如果是 404，继续尝试下一个路径
            if (error.response?.status === 404) {
              continue;
            }
            // 其他错误直接抛出
            throw error;
          }
        }

        // 如果所有路径都失败，抛出最后一个错误
        if (!response && lastError) {
          throw lastError;
        }

        if (!response) {
          throw new Error("无法连接到后端服务");
        }

        // 从列表中移除任务
        this.tasks = this.tasks.filter(t => t.id !== task.id);
        notification.success("任务已删除");
      } catch (error) {
        console.error("[MyTasks] 删除任务失败:", error);
        const { notification } = await import("@/utils/notification");
        
        if (error.response?.status === 404) {
          // 如果 API 不存在，保存到 localStorage，这样刷新后也不会显示
          this.addDeletedTaskId(task.id);
          this.tasks = this.tasks.filter(t => t.id !== task.id);
          notification.success("任务已删除（本地记录，刷新后不会显示）");
        } else {
          notification.error(
            error.response?.data?.message || error.message || "删除任务失败"
          );
        }
      } finally {
        this.deletingTaskId = null;
      }
    },

    /**
     * 获取已删除的任务 ID 列表（从 localStorage）
     */
    getDeletedTaskIds() {
      try {
        const deleted = localStorage.getItem('deleted_task_ids');
        return deleted ? JSON.parse(deleted) : [];
      } catch (error) {
        console.error("[MyTasks] 读取已删除任务列表失败:", error);
        return [];
      }
    },

    /**
     * 添加已删除的任务 ID（保存到 localStorage）
     */
    addDeletedTaskId(taskId) {
      try {
        const deleted = this.getDeletedTaskIds();
        if (!deleted.includes(String(taskId))) {
          deleted.push(String(taskId));
          localStorage.setItem('deleted_task_ids', JSON.stringify(deleted));
          console.log("[MyTasks] 已保存删除的任务 ID:", taskId);
        }
      } catch (error) {
        console.error("[MyTasks] 保存已删除任务列表失败:", error);
      }
    },
  },
});
</script>

<style scoped>
.tasks-list {
  max-width: 100%;
}

.task-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.task-card-clickable {
  cursor: pointer;
}

.task-card-clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-color: var(--primary, #0d6efd);
}

.task-content {
  min-width: 0;
}

.task-status {
  flex-shrink: 0;
}

[data-theme="dark"] .task-card {
  background-color: var(--surface);
  border-color: var(--border);
}

[data-theme="dark"] .card-title {
  color: var(--text);
}

[data-theme="dark"] .card-text {
  color: var(--muted);
}
</style>

