<template>
  <div
    class="register-page min-vh-100 d-flex align-items-center justify-content-center bg-light"
  >
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow">
            <div class="card-body p-5">
              <h2 class="card-title text-center mb-4">
                <i class="bi bi-person-plus me-2"></i>用户注册
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

              <!-- 注册表单 -->
              <form @submit.prevent="handleRegister">
                <div class="mb-3">
                  <label class="form-label">用户名</label>
                  <input
                    v-model="form.username"
                    type="text"
                    class="form-control"
                    placeholder="请输入用户名（3-20个字符）"
                    minlength="3"
                    maxlength="20"
                    required
                  />
                  <small class="form-text text-muted"
                    >用户名用于登录和展示</small
                  >
                </div>

                <div class="mb-3">
                  <label class="form-label">密码</label>
                  <input
                    v-model="form.password"
                    type="password"
                    class="form-control"
                    placeholder="请输入密码（至少6个字符）"
                    minlength="6"
                    required
                  />
                  <small class="form-text text-muted"
                    >建议使用复杂密码提高安全性</small
                  >
                </div>

                <div class="mb-3">
                  <label class="form-label">确认密码</label>
                  <input
                    v-model="form.confirmPassword"
                    type="password"
                    class="form-control"
                    placeholder="请再次输入密码"
                    minlength="6"
                    required
                  />
                </div>

                <!-- 注册提示：新用户默认为普通用户 -->
                <div class="mb-4 alert alert-info" role="alert">
                  <i class="bi bi-info-circle me-2"></i>
                  <small
                    >新用户默认为普通用户。若需管理员权限，请联系现有管理员。</small
                  >
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
                    注册中...
                  </span>
                  <span v-else>注册</span>
                </button>
              </form>

              <!-- 登录链接 -->
              <div class="text-center">
                <p class="text-muted mb-0">
                  已有账户？
                  <router-link
                    to="/login"
                    class="text-primary text-decoration-none"
                  >
                    立即登录
                  </router-link>
                </p>
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
  name: "UserRegister",

  data() {
    return {
      form: {
        username: "",
        password: "",
        confirmPassword: "",
        // role 已移除，新用户默认为 'user'
      },
      isLoading: false,
      errorMessage: "",
      successMessage: "",
    };
  },

  methods: {
    async handleRegister() {
      if (!this.form.username || !this.form.password) {
        this.errorMessage = "请填写所有必填项";
        return;
      }

      if (this.form.password !== this.form.confirmPassword) {
        this.errorMessage = "两次输入的密码不一致";
        return;
      }

      if (this.form.password.length < 6) {
        this.errorMessage = "密码长度至少6个字符";
        return;
      }

      this.isLoading = true;
      this.errorMessage = "";
      this.successMessage = "";

      try {
        console.log("[UserRegister] 注册请求，用户名:", this.form.username);

        const response = await apiHttpClient.post("/api/register", {
          username: this.form.username,
          password: this.form.password,
        });

        console.log("[UserRegister] 注册成功:", response.data);

        this.successMessage = "注册成功，正在跳转到登录页面...";

        // 2秒后跳转到登录页
        setTimeout(() => {
          this.$router.push("/login");
        }, 2000);
      } catch (error) {
        console.error("[UserRegister] 注册失败:", error);
        this.errorMessage =
          error.response?.data?.message || "注册失败，请稍后重试";
      } finally {
        this.isLoading = false;
      }
    },
  },

  mounted() {
    // 如果已经登录，直接跳转到首页
    const token = localStorage.getItem("auth_token");
    if (token) {
      console.log("[UserRegister] 用户已登录，跳转到首页");
      this.$router.push("/");
    }
  },
});
</script>

<style scoped>
.register-page {
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
