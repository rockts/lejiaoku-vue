<template>
  <div class="container mt-4">
    <h2>{{ isMyResources ? '我上传的资源' : '用户资源' }}</h2>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border" role="status">
        <span class="sr-only">加载中...</span>
      </div>
    </div>

    <div v-else-if="resources.length === 0" class="alert alert-info">
      暂无资源
    </div>

    <table v-else class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>标题</th>
          <th>分类</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="resource in resources" :key="resource.id">
          <td>{{ resource.id }}</td>
          <td>{{ resource.title }}</td>
          <td>{{ resource.category || "-" }}</td>
          <td>
            <span class="badge" :class="getStatusClass(resource.status)">
              {{ getStatusText(resource.status) }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { apiHttpClient } from "@/app/app.service";

export default defineComponent({
  name: "MyResources",

  props: {
    userId: {
      type: String,
      default: null,
    },
    isMyResources: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      resources: [],
      loading: false,
    };
  },

  created() {
    this.fetchMyResources();
  },

  watch: {
    userId: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal && newVal) {
          this.fetchMyResources();
        }
      },
      immediate: false,
    },
  },

  methods: {
    async fetchMyResources() {
      this.loading = true;
      try {
        let response;
        
        // 判断是否为当前用户
        const currentUser = this.$store.getters["auth/user"];
        const isCurrentUser = currentUser && String(currentUser.id) === String(this.userId);
        
        if (this.isMyResources || !this.userId || isCurrentUser) {
          // 获取当前用户的资源（需要登录，返回所有状态）
          // GET /my/resources
          response = await apiHttpClient.get("/my/resources");
        } else {
          // 获取指定用户的资源（公开访问，只返回已审核的资源）
          // GET /users/:userId/resources
          response = await apiHttpClient.get(`/users/${this.userId}/resources`);
        }

        // 过滤视频资源
        this.resources = response.data.filter((item) => {
          if (item.category === "视频" || item.category === "video") {
            console.log("[MyResources] 过滤掉视频资源:", item.id, item.title);
            return false;
          }
          return true;
        });

        console.log("[MyResources] 获取资源:", this.resources.length);
      } catch (error) {
        console.error("[MyResources] 获取资源失败:", error);
        alert(
          "获取资源列表失败: " +
            (error.response?.data?.message || error.message)
        );
      } finally {
        this.loading = false;
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
        pending: "badge-warning",
        approved: "badge-success",
        rejected: "badge-danger",
      };
      return classMap[status] || "badge-secondary";
    },
  },
});
</script>

<style scoped>
.table {
  background: white;
}

.badge {
  font-size: 0.9em;
  padding: 0.4em 0.8em;
}
</style>
