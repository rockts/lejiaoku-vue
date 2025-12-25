<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="bi bi-person-plus-fill"></i> 注册用户
              </h5>
              <button
                type="button"
                class="close-btn"
                @click="closeModal"
                aria-label="Close"
              >
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                  <label class="form-label">用户名 <span class="text-danger">*</span></label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-person-fill"></i>
                    </span>
                    <input
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': usernameError }"
                      v-model="username"
                      placeholder="输入用户名"
                      required
                      @blur="validateUsername"
                      @input="clearUsernameError"
                    />
                  </div>
                  <small class="text-muted d-block mt-1">
                    用户名将用于登录，注册后不可修改
                  </small>
                  <small class="text-muted d-block mt-1">
                    格式要求：4-20位，以字母开头，可包含字母、数字、下划线(_)或短横线(-)
                  </small>
                  <div v-if="usernameError" class="invalid-feedback d-block">
                    {{ usernameError }}
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">邮箱 <span class="text-muted">(可选)</span></label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-envelope-fill"></i>
                    </span>
                    <input
                      type="email"
                      class="form-control"
                      v-model="email"
                      placeholder="输入邮箱（可选）"
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
                      placeholder="设置密码（至少6位）"
                      required
                      minlength="6"
                    />
                  </div>
                </div>

                <div class="mb-3">
                  <small class="text-muted">
                    点击 "注册" 即表示您同意并愿意遵守乐教库
                    <router-link to="/user-agreement">用户协议</router-link> 和
                    <router-link to="/privacy-policy">隐私政策</router-link>。
                  </small>
                </div>

                <div class="d-flex justify-content-end mb-3">
                  <a href="#" @click.prevent="switchToLogin" class="small"
                    >已有账号？立即登录</a
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
                  {{ loading ? "注册中..." : "注册" }}
                </button>

                <div class="text-center mt-4">
                  <p class="text-muted small mb-2">社交账号直接注册</p>
                  <div class="d-flex justify-content-center gap-3">
                    <button
                      type="button"
                      class="btn btn-outline-secondary btn-sm"
                    >
                      <img
                        src="@/assets/img/weixin.png"
                        style="width: 20px; height: 20px"
                        alt="微信"
                      />
                      微信
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-secondary btn-sm"
                    >
                      <img
                        src="@/assets/img/qq.png"
                        style="width: 20px; height: 20px"
                        alt="QQ"
                      />
                      QQ
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { defineComponent } from "vue";
import { apiHttpClient } from "@/app/app.service";
import notification from "@/utils/notification";

export default defineComponent({
  name: "RegisterModal",
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["update:modelValue", "switch-to-login"],
  data() {
    return {
      username: "",
      email: "",
      password: "",
      loading: false,
    };
  },
  methods: {
    closeModal() {
      this.$emit("update:modelValue", false);
      this.resetForm();
    },
    switchToLogin() {
      this.$emit("switch-to-login");
    },
    resetForm() {
      this.username = "";
      this.email = "";
      this.password = "";
      this.loading = false;
      this.usernameError = "";
    },
    validateUsername() {
      if (!this.username) {
        this.usernameError = "";
        return true;
      }

      // 用户名格式验证：4-20位，以字母开头，可包含字母、数字、下划线(_)或短横线(-)
      const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_-]{3,19}$/;
      
      if (!usernameRegex.test(this.username)) {
        this.usernameError = "用户名格式错误！必须是4-20位，以字母开头，可包含字母、数字、下划线(_)或短横线(-)";
        return false;
      }

      this.usernameError = "";
      return true;
    },
    clearUsernameError() {
      if (this.usernameError) {
        this.usernameError = "";
      }
    },
    async handleSubmit() {
      if (!this.username || !this.password) {
        notification.warning("请填写用户名和密码");
        return;
      }

      // 验证用户名格式
      if (!this.validateUsername()) {
        return;
      }

      if (this.password.length < 6) {
        notification.warning("密码至少需要6位");
        return;
      }

      this.loading = true;
      try {
        // 根据 API 文档，注册接口支持 username 或 name
        const registerData = {
          username: this.username,
          password: this.password,
        };
        
        // 邮箱是可选的
        if (this.email) {
          registerData.email = this.email;
        }

        const response = await apiHttpClient.post("/register", registerData);

        // API 响应格式：{ success, message, token, user }
        const { token, user } = response.data;

        // 保存 token 和用户信息
        localStorage.setItem("token", token);
        localStorage.setItem("auth_token", token);
        localStorage.setItem("user_info", JSON.stringify(user));

        // 更新 store
        this.$store.commit("auth/setToken", token);
        this.$store.commit("auth/setUser", user);

        notification.success("注册成功！已自动登录");

        // 关闭弹窗
        this.closeModal();

        // 刷新页面以更新UI状态
        window.location.reload();
      } catch (error) {
        console.error("[RegisterModal] 注册失败:", error);
        const errorMessage = error.response?.data?.message || error.message || "注册失败，请稍后重试";
        notification.error(errorMessage);
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-container {
  width: 90%;
  max-width: 450px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content {
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  border: none;
}

.modal-header {
  border-bottom: 1px solid #e9ecef;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px 12px 0 0;
}

.modal-title {
  color: white;
  font-weight: 600;
  font-size: 1.25rem;
  margin: 0;
}

.modal-title i {
  margin-right: 0.5rem;
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 2rem 1.5rem;
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

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 0.75rem;
  font-weight: 500;
  transition: transform 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
}

.btn-outline-secondary {
  border-radius: 8px;
  padding: 0.5rem 1rem;
  transition: all 0.2s;
}

.btn-outline-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.gap-3 {
  gap: 0.75rem;
}

a {
  color: #667eea;
  text-decoration: none;
  transition: color 0.2s;
}

a:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* 动画效果 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}
</style>
