<template>
  <div
    class="login-page min-vh-100 d-flex align-items-center justify-content-center bg-light"
  >
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow">
            <div class="card-body p-5">
              <h2 class="card-title text-center mb-4">
                <i class="bi bi-box-arrow-in-right me-2"></i>用户登录
              </h2>

              <!-- 成功提示 -->
              <div
                v-if="successMessage"
                class="alert alert-success d-flex align-items-center"
                role="alert"
              >
                <i class="bi bi-check-circle-fill me-2"></i>
                <div>{{ successMessage }}</div>
              </div>

              <!-- 错误提示 -->
              <div
                v-if="errorMessage"
                class="alert alert-danger d-flex align-items-center"
                role="alert"
              >
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                <div>{{ errorMessage }}</div>
              </div>

              <!-- 登录表单 -->
              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label class="form-label">用户名</label>
                  <input
                    v-model="form.username"
                    type="text"
                    class="form-control"
                    placeholder="请输入用户名"
                    required
                  />
                </div>

                <div class="mb-4">
                  <label class="form-label">密码</label>
                  <input
                    v-model="form.password"
                    type="password"
                    class="form-control"
                    placeholder="请输入密码"
                    required
                  />
                </div>

                <button
                  type="submit"
                  class="btn btn-primary w-100 mb-3"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading">
                    <span
                      class="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    登录中...
                  </span>
                  <span v-else>登录</span>
                </button>
              </form>

              <!-- 注册链接 -->
              <div class="text-center">
                <p class="text-muted mb-0">
                  还没有账户？
                  <router-link
                    to="/register"
                    class="text-primary text-decoration-none"
                  >
                    立即注册
                  </router-link>
                </p>
              </div>
            </div>
          </div>

          <!-- 提示信息 -->
          <div class="alert alert-info mt-4" role="alert">
            <i class="bi bi-info-circle me-2"></i>
            <small>
              <strong>演示账户：</strong>
              username: demo | password: demo123（若无后端，可手动设置）
            </small>
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
  name: "UserLogin",

  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      isLoading: false,
      errorMessage: "",
      successMessage: "",
    };
  },

  methods: {
    async handleLogin() {
      if (!this.form.username || !this.form.password) {
        this.errorMessage = "请输入用户名和密码";
        return;
      }

      this.isLoading = true;
      this.errorMessage = "";
      this.successMessage = "";

      try {
        console.log("[UserLogin] 登录请求，用户名:", this.form.username);

        const response = await apiHttpClient.post("/api/login", {
          username: this.form.username,
          password: this.form.password,
        });

        console.log("[UserLogin] 登录成功:", response.data);

        // 保存 token 和用户信息
        const { token, user } = response.data;
        if (token) {
          localStorage.setItem("auth_token", token);
          localStorage.setItem("user_info", JSON.stringify(user));

          // 更新 Vuex store
          this.$store.commit("auth/setToken", token);
          this.$store.commit("auth/setUser", user);

          console.log("[UserLogin] Token 已保存，用户角色:", user.role);

          this.successMessage = "登录成功，正在跳转...";

          // 2秒后跳转到首页或之前访问的页面
          setTimeout(() => {
            const redirect = this.$route.query.redirect || "/";
            this.$router.push(redirect);
          }, 2000);
        }
      } catch (error) {
        console.error("[UserLogin] 登录失败:", error);
        this.errorMessage =
          error.response?.data?.message || "登录失败，请检查用户名和密码";
      } finally {
        this.isLoading = false;
      }
    },
  },

  mounted() {
    // 如果已经登录，直接跳转到首页
    const token = localStorage.getItem("auth_token");
    if (token) {
      console.log("[UserLogin] 用户已登录，跳转到首页");
      this.$router.push("/");
    }
  },
});
</script>

<style scoped>
.login-page {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.card {
  border: none;
  border-radius: 12px;
}

.card-body {
  background: #fff;
}

.form-control {
  border-radius: 8px;
  border: 1px solid #dee2e6;
  padding: 10px 12px;
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.btn-primary {
  border-radius: 8px;
  padding: 10px;
  font-weight: 500;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0b5ed7;
}

.btn-primary:disabled {
  opacity: 0.6;
}
</style>
