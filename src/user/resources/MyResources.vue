<template>
  <div class="container mt-4">
    <h2>我上传的资源</h2>

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
          <td>{{ resource.category || '-' }}</td>
          <td>
            <span 
              class="badge" 
              :class="getStatusClass(resource.status)"
            >
              {{ getStatusText(resource.status) }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { apiHttpClient } from '@/app/app.service';

export default defineComponent({
  name: 'MyResources',

  data() {
    return {
      resources: [],
      loading: false,
    };
  },

  created() {
    this.fetchMyResources();
  },

  methods: {
    async fetchMyResources() {
      this.loading = true;
      try {
        const response = await apiHttpClient.get('/api/my/resources');
        this.resources = response.data;
        console.log('[MyResources] 获取资源:', this.resources.length);
      } catch (error) {
        console.error('[MyResources] 获取资源失败:', error);
        alert('获取资源列表失败: ' + (error.response?.data?.message || error.message));
      } finally {
        this.loading = false;
      }
    },

    getStatusText(status) {
      const statusMap = {
        'pending': '待审核',
        'approved': '已通过',
        'rejected': '已拒绝',
      };
      return statusMap[status] || status || '未知';
    },

    getStatusClass(status) {
      const classMap = {
        'pending': 'badge-warning',
        'approved': 'badge-success',
        'rejected': 'badge-danger',
      };
      return classMap[status] || 'badge-secondary';
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
