<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2><i class="bi bi-list-check me-2"></i>我的任务</h2>
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
    <div v-else-if="tasks.length === 0" class="text-center py-5">
      <i class="bi bi-inbox display-1 text-muted"></i>
      <p class="mt-3 text-muted">暂无任务</p>
      <p class="text-muted small">创建的任务将显示在这里</p>
    </div>

    <!-- 任务列表 -->
    <div v-else class="tasks-list">
      <div 
        v-for="task in tasks" 
        :key="task.id" 
        class="task-card card mb-3"
      >
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start">
            <div class="task-content flex-grow-1">
              <h5 class="card-title mb-2">
                <i class="bi" :class="getTaskIcon(task.task_type)" me-2></i>
                {{ getTaskTypeText(task.task_type) }}
              </h5>
              <p class="card-text text-muted mb-2" v-if="task.catalog_info">
                <strong>教材：</strong>{{ task.catalog_info.displayName || `教材 #${task.catalog_id}` }}
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
            <div class="task-status ms-3">
              <span class="badge" :class="getStatusClass(task.status)">
                {{ getStatusText(task.status) }}
              </span>
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
        const response = await apiHttpClient.get("/api/tasks/my");
        console.log("[MyTasks] 任务列表响应:", response.data);

        // 处理不同的响应格式
        if (response.data) {
          if (response.data.data && Array.isArray(response.data.data)) {
            this.tasks = response.data.data;
          } else if (response.data.tasks && Array.isArray(response.data.tasks)) {
            this.tasks = response.data.tasks;
          } else if (Array.isArray(response.data)) {
            this.tasks = response.data;
          }
        }

        console.log("[MyTasks] 任务数量:", this.tasks.length);
      } catch (error) {
        console.error("[MyTasks] 获取任务列表失败:", error);
        const { notification } = await import("@/utils/notification");
        notification.error(
          error.response?.data?.message || error.message || "获取任务列表失败"
        );
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

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

