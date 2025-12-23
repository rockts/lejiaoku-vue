<template>
  <div class="test-api-page container mt-5">
    <h2 class="mb-4">后端 API 测试页面</h2>

    <!-- 测试状态显示 -->
    <div class="alert" :class="statusClass" v-if="statusMessage">
      {{ statusMessage }}
    </div>

    <!-- 测试按钮组 -->
    <div class="mb-4">
      <h4>API 测试</h4>
      <div class="btn-group" role="group">
        <button
          @click="testUserApi"
          class="btn btn-primary"
          :disabled="loading"
        >
          测试 /user
        </button>
        <button
          @click="testPostsApi"
          class="btn btn-primary"
          :disabled="loading"
        >
          测试 /posts
        </button>
        <button
          @click="testClassificationsApi"
          class="btn btn-primary"
          :disabled="loading"
        >
          测试 /classifications
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="text-center my-4">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">加载中...</span>
      </div>
    </div>

    <!-- 用户信息 -->
    <div v-if="userData" class="card mb-4">
      <div class="card-header bg-success text-white">
        <h5 class="mb-0">用户信息 (/user)</h5>
      </div>
      <div class="card-body">
        <pre class="bg-light p-3 rounded">{{
          JSON.stringify(userData, null, 2)
        }}</pre>
      </div>
    </div>

    <!-- 资源列表 -->
    <div v-if="postsData" class="card mb-4">
      <div class="card-header bg-info text-white">
        <h5 class="mb-0">资源列表 (/posts)</h5>
      </div>
      <div class="card-body">
        <p class="text-muted">共 {{ postsData.length }} 条数据</p>
        <pre
          class="bg-light p-3 rounded"
          style="max-height: 400px; overflow-y: auto"
          >{{ JSON.stringify(postsData, null, 2) }}</pre
        >
      </div>
    </div>

    <!-- 分类信息 -->
    <div v-if="classificationsData" class="card mb-4">
      <div class="card-header bg-warning text-dark">
        <h5 class="mb-0">分类信息 (/classifications)</h5>
      </div>
      <div class="card-body">
        <pre
          class="bg-light p-3 rounded"
          style="max-height: 400px; overflow-y: auto"
          >{{ JSON.stringify(classificationsData, null, 2) }}</pre
        >
      </div>
    </div>

    <!-- 错误信息 -->
    <div v-if="errorData" class="card mb-4 border-danger">
      <div class="card-header bg-danger text-white">
        <h5 class="mb-0">错误信息</h5>
      </div>
      <div class="card-body">
        <p><strong>状态码:</strong> {{ errorData.status }}</p>
        <p><strong>错误消息:</strong> {{ errorData.message }}</p>
        <pre class="bg-light p-3 rounded">{{
          JSON.stringify(errorData.data, null, 2)
        }}</pre>
      </div>
    </div>

    <!-- 环境信息 -->
    <div class="card mb-4">
      <div class="card-header bg-secondary text-white">
        <h5 class="mb-0">环境配置</h5>
      </div>
      <div class="card-body">
        <p><strong>API Base URL:</strong> {{ apiBaseUrl }}</p>
        <p><strong>Token:</strong> {{ token || "未登录" }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { apiHttpClient } from "@/app/app.service";

export default defineComponent({
  name: "TestApi",
  setup() {
    const loading = ref(false);
    const statusMessage = ref("");
    const statusType = ref<"success" | "error" | "info">("info");

    const userData = ref<any>(null);
    const postsData = ref<any>(null);
    const classificationsData = ref<any>(null);
    const errorData = ref<any>(null);

    const apiBaseUrl = process.env.VUE_APP_API_BASE_URL;
    const token = localStorage.getItem("token");

    const statusClass = computed(() => {
      return {
        "alert-success": statusType.value === "success",
        "alert-danger": statusType.value === "error",
        "alert-info": statusType.value === "info",
      };
    });

    const clearResults = () => {
      userData.value = null;
      postsData.value = null;
      classificationsData.value = null;
      errorData.value = null;
    };

    const testUserApi = async () => {
      loading.value = true;
      clearResults();
      statusMessage.value = "正在请求 /user...";
      statusType.value = "info";

      try {
        const response = await apiHttpClient.get("/user");
        userData.value = response.data;
        statusMessage.value = "✓ 成功获取用户信息";
        statusType.value = "success";
      } catch (error: any) {
        errorData.value = {
          status: error.response?.status || "Unknown",
          message: error.message,
          data: error.response?.data || error,
        };
        statusMessage.value = `✗ 请求失败: ${error.message}`;
        statusType.value = "error";
      } finally {
        loading.value = false;
      }
    };

    const testPostsApi = async () => {
      loading.value = true;
      clearResults();
      statusMessage.value = "正在请求 /posts...";
      statusType.value = "info";

      try {
        const response = await apiHttpClient.get("/posts");
        postsData.value = response.data;
        statusMessage.value = `✓ 成功获取资源列表 (${response.data.length} 条)`;
        statusType.value = "success";
      } catch (error: any) {
        errorData.value = {
          status: error.response?.status || "Unknown",
          message: error.message,
          data: error.response?.data || error,
        };
        statusMessage.value = `✗ 请求失败: ${error.message}`;
        statusType.value = "error";
      } finally {
        loading.value = false;
      }
    };

    const testClassificationsApi = async () => {
      loading.value = true;
      clearResults();
      statusMessage.value = "正在请求 /classifications...";
      statusType.value = "info";

      try {
        const response = await apiHttpClient.get("/classifications");
        classificationsData.value = response.data;
        statusMessage.value = "✓ 成功获取分类信息";
        statusType.value = "success";
      } catch (error: any) {
        errorData.value = {
          status: error.response?.status || "Unknown",
          message: error.message,
          data: error.response?.data || error,
        };
        statusMessage.value = `✗ 请求失败: ${error.message}`;
        statusType.value = "error";
      } finally {
        loading.value = false;
      }
    };

    return {
      loading,
      statusMessage,
      statusClass,
      userData,
      postsData,
      classificationsData,
      errorData,
      apiBaseUrl,
      token,
      testUserApi,
      testPostsApi,
      testClassificationsApi,
    };
  },
});
</script>

<style scoped>
.test-api-page {
  max-width: 1200px;
}

.btn-group .btn {
  margin-right: 10px;
}

pre {
  font-size: 12px;
  margin: 0;
}

.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
