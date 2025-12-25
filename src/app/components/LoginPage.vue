<template>
  <div class="login-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="login-card">
            <div class="login-header">
              <h2><i class="bi bi-box-arrow-in-right"></i> 用户登录</h2>
              <p class="text-muted">登录后即可上传和管理资源</p>
            </div>
            <div class="login-body">
              <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                  <label class="form-label">用户名/邮箱</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-person-fill"></i>
                    </span>
                    <input
                      type="text"
                      class="form-control"
                      v-model="account"
                      placeholder="输入用户名或邮箱"
                      required
                    />
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">密码</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-lock-fill"></i>
                    </span>
                    <input
                      type="password"
                      class="form-control"
                      v-model="password"
                      placeholder="输入密码"
                      required
                    />
                  </div>
                </div>

                <div class="d-flex justify-content-between mb-3">
                  <a href="#" class="text-muted small">忘记密码？</a>
                  <router-link to="/register" class="small"
                    >还没有账号？立即注册</router-link
                  >
                </div>

                <button
                  type="submit"
                  class="w-100 btn btn-primary"
                  :disabled="loading"
                >
                  <span
                    v-if="loading"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  {{ loading ? "登录中..." : "登录" }}
                </button>
              </form>
            </div>
          </div>
          <div class="text-center mt-3">
            <router-link to="/" class="text-muted small"
              ><i class="bi bi-arrow-left"></i> 返回首页</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { apiHttpClient } from "@/app/app.service";
import notification from "@/utils/notification";

export default defineComponent({
  name: "LoginPage",
  data() {
    return {
      account: "",
      password: "",
      loading: false,
    };
  },
  methods: {
    async handleSubmit() {
      if (!this.account || !this.password) {
        notification.warning("请填写完整信息");
        return;
      }

      this.loading = true;
      try {
        // 支持用户名或邮箱登录
        const loginData = this.account.includes("@")
          ? { email: this.account, password: this.password }
          : { username: this.account, password: this.password };

        console.log("[LoginPage] 登录请求数据:", loginData);

        const response = await apiHttpClient.post("/login", loginData);

        console.log("[LoginPage] 登录响应:", response.data);

        // 处理响应数据（兼容不同的响应格式）
        const responseData = response.data;
        const token = responseData.token || responseData.data?.token;
        const user = responseData.user || responseData.data?.user;

        if (!token || !user) {
          console.error("[LoginPage] 响应数据格式错误:", responseData);
          notification.error("登录响应数据格式错误，请稍后重试");
          return;
        }

        console.log("[LoginPage] 提取的 token 和 user:", { token, user });

        // 保存 token 和用户信息
        localStorage.setItem("token", token);
        localStorage.setItem("auth_token", token);
        localStorage.setItem("user_info", JSON.stringify(user));

        // 更新 store
        this.$store.commit("auth/setToken", token);
        this.$store.commit("auth/setUser", user);

        notification.success("登录成功！");

        // 跳转到目标页面或首页
        const redirect = this.$route.query.redirect;
        if (redirect && typeof redirect === "string") {
          this.$router.push(redirect);
        } else {
          this.$router.push("/");
        }
      } catch (error) {
        console.error("[LoginPage] 登录失败:", error);
        console.error("[LoginPage] 错误详情:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        notification.error(
          error.response?.data?.message || 
          error.response?.data?.error ||
          "登录失败，请检查用户名/邮箱和密码"
        );
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  padding: 2rem 0;
}

.login-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.login-header {
  background: var(--primary);
  color: white;
  padding: 2rem;
  text-align: center;
}

.login-header h2 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
}

.login-header h2 i {
  margin-right: 0.5rem;
}

.login-header p {
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
}

.login-body {
  padding: 2rem;
}

.form-label {
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.5rem;
}

.input-group-text {
  background-color: #f8f9fa;
  border-right: none;
  color: #6c757d;
}

.input-group .form-control {
  border-left: none;
}

.input-group .form-control:focus {
  box-shadow: none;
  border-color: #ced4da;
}

.input-group:focus-within .input-group-text {
  border-color: #80bdff;
  background-color: #e7f1ff;
}

.input-group:focus-within .form-control {
  border-color: #80bdff;
}

/* 按钮样式已移至全局 app.css */

a {
  color: var(--primary);
  text-decoration: none;
  transition: color 0.2s;
}

a:hover {
  color: #3d7ae8;
  text-decoration: underline;
}
</style>

