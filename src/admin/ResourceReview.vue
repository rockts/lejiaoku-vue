<template>
  <div class="container mt-4">
    <h2>资源审核</h2>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border" role="status">
        <span class="sr-only">加载中...</span>
      </div>
    </div>

    <div v-else-if="resources.length === 0" class="alert alert-info">
      暂无待审核资源
    </div>

    <table v-else class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>标题</th>
          <th>分类</th>
          <th>学科</th>
          <th>年级</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="resource in resources" :key="resource.id">
          <td>{{ resource.id }}</td>
          <td>{{ resource.title }}</td>
          <td>{{ resource.category || "-" }}</td>
          <td>{{ resource.subject || "-" }}</td>
          <td>{{ resource.grade || "-" }}</td>
          <td>
            <button
              class="btn btn-sm btn-success mr-2"
              @click="approve(resource.id)"
              :disabled="processing"
            >
              ✅ 通过
            </button>
            <button
              class="btn btn-sm btn-danger"
              @click="reject(resource.id)"
              :disabled="processing"
            >
              ❌ 拒绝
            </button>
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
  name: "ResourceReview",

  data() {
    return {
      resources: [],
      loading: false,
      processing: false,
    };
  },

  created() {
    this.fetchPendingResources();
  },

  methods: {
    async fetchPendingResources() {
      this.loading = true;
      try {
        const response = await apiHttpClient.get("/api/admin/resources", {
          params: { status: "pending" },
        });

        // 过滤视频资源
        this.resources = response.data.filter((item) => {
          if (item.category === "视频" || item.category === "video") {
            console.log(
              "[ResourceReview] 过滤掉视频资源:",
              item.id,
              item.title
            );
            return false;
          }
          return true;
        });

        console.log("[ResourceReview] 获取待审核资源:", this.resources.length);
        console.log("[ResourceReview] 资源详情:", this.resources);
        // 检查每个资源的 grade 字段
        this.resources.forEach((r, index) => {
          console.log(`[ResourceReview] 资源 ${index + 1}:`, {
            id: r.id,
            title: r.title,
            grade: r.grade,
            subject: r.subject,
            description: r.description,
          });
        });
      } catch (error) {
        console.error("[ResourceReview] 获取资源失败:", error);
        console.error("[ResourceReview] 错误详情:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
        const { notification } = await import("@/utils/notification");
        notification.error(
          "获取资源列表失败: " +
            (error.response?.data?.message || error.message)
        );
      } finally {
        this.loading = false;
      }
    },

    async approve(id) {
      const { notification } = await import("@/utils/notification");
      const confirmed = await notification.confirm("确定通过该资源？", "通过审核");
      if (!confirmed) return;

      this.processing = true;
      try {
        await apiHttpClient.patch(`/api/admin/resources/${id}/status`, {
          status: "approved",
        });
        console.log("[ResourceReview] 资源已通过:", id);
        // 从列表中移除
        this.resources = this.resources.filter((r) => r.id !== id);
        notification.success("资源已通过审核");
      } catch (error) {
        console.error("[ResourceReview] 审核失败:", error);
        notification.error("操作失败");
      } finally {
        this.processing = false;
      }
    },

    async reject(id) {
      const { notification } = await import("@/utils/notification");
      const confirmed = await notification.confirm("确定拒绝该资源？", "拒绝审核");
      if (!confirmed) return;

      this.processing = true;
      try {
        await apiHttpClient.patch(`/api/admin/resources/${id}/status`, {
          status: "rejected",
        });
        console.log("[ResourceReview] 资源已拒绝:", id);
        // 从列表中移除
        this.resources = this.resources.filter((r) => r.id !== id);
        notification.success("资源已拒绝");
      } catch (error) {
        console.error("[ResourceReview] 操作失败:", error);
        notification.error("操作失败");
      } finally {
        this.processing = false;
      }
    },
  },
});
</script>

<style scoped>
.table {
  background: white;
}
</style>
