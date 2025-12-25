<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="bi bi-box-arrow-in-right"></i> 用户登录
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
                  <a href="#" @click.prevent="switchToRegister" class="small"
                    >还没有账号？立即注册</a
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

                <div class="text-center mt-4">
                  <p class="text-muted small mb-2">社交账号登录</p>
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
  name: "LoginModal",
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["update:modelValue", "switch-to-register"],
  data() {
    return {
      account: "",
      password: "",
      loading: false,
    };
  },
  methods: {
    closeModal() {
      this.$emit("update:modelValue", false);
      this.resetForm();
    },
    switchToRegister() {
      this.$emit("switch-to-register");
    },
    resetForm() {
      this.account = "";
      this.password = "";
      this.loading = false;
    },
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

        console.log("[LoginModal] 登录请求数据:", loginData);

        const response = await apiHttpClient.post("/login", loginData);

        console.log("[LoginModal] 登录响应:", response.data);

        // 处理响应数据（兼容不同的响应格式）
        const responseData = response.data;
        const token = responseData.token || responseData.data?.token;
        const user = responseData.user || responseData.data?.user;

        if (!token || !user) {
          console.error("[LoginModal] 响应数据格式错误:", responseData);
          notification.error("登录响应数据格式错误，请稍后重试");
          return;
        }

        console.log("[LoginModal] 提取的 token 和 user:", { token, user });
        console.log("[LoginModal] 用户 ID:", user?.id);
        console.log("[LoginModal] 用户 nickname:", user?.nickname);
        console.log("[LoginModal] 用户 username:", user?.username);

        // 检查是否是切换用户
        const currentUserId = this.$store.state.auth.user?.id;
        const newUserId = user?.id;
        const isUserSwitch = currentUserId && String(currentUserId) !== String(newUserId);
        
        if (isUserSwitch) {
          console.log("[LoginModal] 检测到用户切换，清除旧数据");
          // 切换用户时，先清除旧数据
          localStorage.removeItem("token");
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user_info");
          // 清除 store
          this.$store.commit("auth/logout");
        }

        // 先保存 token（用于后续 API 调用）
        localStorage.setItem("token", token);
        localStorage.setItem("auth_token", token);
        this.$store.commit("auth/setToken", token);

        // 登录成功后，立即从 /user 接口获取完整的用户信息（包含 nickname）
        try {
          console.log("[LoginModal] 获取完整用户信息...");
          const userResponse = await apiHttpClient.get("/user");
          const fullUserData = userResponse.data;
          console.log("[LoginModal] 完整用户信息:", fullUserData);
          console.log("[LoginModal] 完整用户信息 nickname:", fullUserData?.nickname);
          console.log("[LoginModal] 完整用户信息 username:", fullUserData?.username);
          console.log("[LoginModal] 完整用户信息 avatar_url:", fullUserData?.avatar_url);

          // 使用完整的用户信息
          if (fullUserData && fullUserData.id) {
            // 保存完整的用户信息到 localStorage 和 store
            localStorage.setItem("user_info", JSON.stringify(fullUserData));
            this.$store.commit("auth/setUser", fullUserData);
            console.log("[LoginModal] 已保存完整用户信息");
          } else {
            // 如果获取失败，使用登录接口返回的用户数据
            console.warn("[LoginModal] 获取完整用户信息失败，使用登录接口返回的数据");
            localStorage.setItem("user_info", JSON.stringify(user));
            this.$store.commit("auth/setUser", user);
          }
        } catch (error) {
          console.error("[LoginModal] 获取完整用户信息失败:", error);
          // 如果获取失败，使用登录接口返回的用户数据
          localStorage.setItem("user_info", JSON.stringify(user));
          this.$store.commit("auth/setUser", user);
        }

        notification.success("登录成功！");
        this.closeModal();

        // 刷新页面以更新UI状态
        window.location.reload();
      } catch (error) {
        console.error("[LoginModal] 登录失败:", error);
        console.error("[LoginModal] 错误详情:", {
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
  background: var(--primary);
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

/* 按钮样式已移至全局 app.css */

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
