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

                <!-- 申请成为贡献者选项 -->
                <div class="mb-3">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="applyContributor"
                      v-model="applyContributor"
                    />
                    <label class="form-check-label" for="applyContributor">
                      <strong>申请成为贡献者</strong>
                    </label>
                  </div>
                  <small class="text-muted d-block mt-2 ms-4">
                    注册时选择成为贡献者的
                    <a 
                      href="/legal/contributor-responsibilities" 
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-primary"
                      @click.stop
                    >
                      《贡献者义务与责任》
                    </a>
                  </small>
                </div>

                <div class="mb-3">
                  <small class="text-muted">
                    点击 "注册" 即表示您同意并愿意遵守乐教库
                    <router-link to="/legal/user-agreement">《用户协议》</router-link> 和
                    <router-link to="/legal/privacy-policy">《隐私政策》</router-link>。
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
      applyContributor: false, // 是否申请成为贡献者
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
      this.applyContributor = false;
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

        console.log("[RegisterModal] 注册响应 user:", user);
        console.log("[RegisterModal] 用户 nickname:", user?.nickname);

        // 先保存 token（用于后续 API 调用）
        localStorage.setItem("token", token);
        localStorage.setItem("auth_token", token);
        this.$store.commit("auth/setToken", token);

        // 注册成功后，立即从 /user 接口获取完整的用户信息（包含 nickname）
        let finalUserData = user; // 默认使用注册接口返回的用户数据
        try {
          console.log("[RegisterModal] 获取完整用户信息...");
          const userResponse = await apiHttpClient.get("/user");
          const fullUserData = userResponse.data;
          console.log("[RegisterModal] 完整用户信息:", fullUserData);
          console.log("[RegisterModal] 完整用户信息 nickname:", fullUserData?.nickname);

          // 使用完整的用户信息
          if (fullUserData && fullUserData.id) {
            finalUserData = fullUserData;
            console.log("[RegisterModal] 已获取完整用户信息");
          } else {
            // 如果获取失败，使用注册接口返回的用户数据
            console.warn("[RegisterModal] 获取完整用户信息失败，使用注册接口返回的数据");
          }
        } catch (error) {
          console.error("[RegisterModal] 获取完整用户信息失败:", error);
          // 如果获取失败，使用注册接口返回的用户数据
          console.warn("[RegisterModal] 使用注册接口返回的用户数据");
        }
        
        // 确保用户数据包含必要的字段
        if (!finalUserData.role) {
          finalUserData.role = 'user'; // 默认角色
        }
        
        // 保存完整的用户信息到 localStorage 和 store
        console.log("[RegisterModal] 保存用户信息到 localStorage 和 store:", finalUserData);
        localStorage.setItem("user_info", JSON.stringify(finalUserData));
        this.$store.commit("auth/setUser", finalUserData);
        console.log("[RegisterModal] 用户信息已保存，当前登录状态:", this.$store.getters["auth/isAuthenticated"]);

        // 如果用户选择了申请成为贡献者，提交申请
        // 注意：必须在 token 和用户信息保存之后才能调用 API
        if (this.applyContributor) {
          try {
            console.log("[RegisterModal] 用户选择了申请成为贡献者，提交申请...");
            console.log("[RegisterModal] 当前 token:", token);
            console.log("[RegisterModal] 当前用户 ID:", finalUserData.id);
            
            // 确保 token 已经设置到 apiHttpClient 中（通过设置 Authorization header）
            // apiHttpClient 应该已经自动从 localStorage 读取 token，但为了确保，我们显式设置
            console.log("[RegisterModal] 准备调用贡献者申请 API...");
            console.log("[RegisterModal] API 路径: /api/contributor-applications");
            const response = await apiHttpClient.post('/api/contributor-applications', {});
            console.log("[RegisterModal] 贡献者申请响应:", response);
            console.log("[RegisterModal] 贡献者申请响应数据:", response.data);
            console.log("[RegisterModal] 贡献者申请已提交");
            
            // 更新 store 中的状态
            await this.$store.dispatch('auth/setContributorApplicationStatus', 'pending');
            console.log("[RegisterModal] 申请状态已更新为 pending");
            
            // 验证状态是否已保存
            const savedStatus = localStorage.getItem('contributor_application_status');
            console.log("[RegisterModal] 验证：localStorage 中的申请状态:", savedStatus);
            console.log("[RegisterModal] 验证：store 中的申请状态:", this.$store.getters["auth/contributorApplicationStatus"]);
            
            notification.success("🎉 注册成功！已自动登录，贡献者申请已提交，等待审核", 5000);
          } catch (error) {
            console.error("[RegisterModal] 提交贡献者申请失败:", error);
            console.error("[RegisterModal] 错误详情:", {
              message: error.message,
              status: error.response?.status,
              statusText: error.response?.statusText,
              data: error.response?.data,
              headers: error.response?.headers,
            });
            
            // 检查是否是网络错误或 token 问题
            if (!error.response) {
              console.error("[RegisterModal] 网络错误或请求未发送");
              notification.error("贡献者申请提交失败：网络错误，请稍后重试");
            } else if (error.response.status === 401) {
              console.error("[RegisterModal] 401 未授权，token 可能无效");
              notification.error("贡献者申请提交失败：登录状态已失效，请重新登录");
            } else if (error.response.status === 400) {
              // 如果已经申请过（不应该发生，因为是新注册），更新状态
              console.log("[RegisterModal] 收到 400 错误，可能是已申请过，检查状态...");
              await this.$store.dispatch('auth/checkContributorApplicationStatus');
              notification.warning("贡献者申请可能已存在，请检查申请状态");
            } else {
              // 其他错误，提示用户但继续注册流程
              console.warn("[RegisterModal] 贡献者申请提交失败，但注册成功");
              const errorMsg = error.response?.data?.message || error.message || "未知错误";
              notification.warning(`贡献者申请提交失败：${errorMsg}，可稍后手动申请`);
            }
            notification.success("🎉 注册成功！已自动登录", 5000);
          }
        } else {
          // 显示成功提示（显示时间稍长一些，确保用户能看到）
          notification.success("🎉 注册成功！已自动登录", 5000);
        }

        // 确保 isAuthenticated 状态正确
        // setToken 已经设置了 isAuthenticated，但为了确保，再次检查
        if (!this.$store.getters["auth/isAuthenticated"]) {
          console.warn("[RegisterModal] isAuthenticated 状态异常，重新设置");
          this.$store.commit("auth/setToken", token);
        }
        
        // 确保用户信息已保存到 store
        if (!this.$store.getters["auth/user"]) {
          console.warn("[RegisterModal] 用户信息未保存到 store，重新设置");
          this.$store.commit("auth/setUser", finalUserData);
        }
        
        // 验证所有数据都已保存
        const savedToken = localStorage.getItem('auth_token');
        const savedUserInfo = localStorage.getItem('user_info');
        const storeToken = this.$store.getters["auth/token"];
        const storeUser = this.$store.getters["auth/user"];
        const storeIsAuthenticated = this.$store.getters["auth/isAuthenticated"];
        
        console.log("[RegisterModal] 注册完成，验证数据保存状态:");
        console.log("[RegisterModal] - localStorage token:", savedToken ? "已保存" : "未保存");
        console.log("[RegisterModal] - localStorage user_info:", savedUserInfo ? "已保存" : "未保存");
        console.log("[RegisterModal] - store token:", storeToken ? "已保存" : "未保存");
        console.log("[RegisterModal] - store user:", storeUser ? "已保存" : "未保存");
        console.log("[RegisterModal] - store isAuthenticated:", storeIsAuthenticated);
        
        if (!savedToken || !savedUserInfo || !storeToken || !storeUser || !storeIsAuthenticated) {
          console.error("[RegisterModal] 数据保存不完整，尝试重新保存");
          // 重新保存所有数据
          localStorage.setItem("auth_token", token);
          localStorage.setItem("user_info", JSON.stringify(finalUserData));
          this.$store.commit("auth/setToken", token);
          this.$store.commit("auth/setUser", finalUserData);
        }
        
        // 关闭弹窗
        this.closeModal();

        // 延迟一小段时间后跳转到首页，确保所有状态都已保存
        // 跳转到首页可以确保所有组件都重新初始化，使用最新的登录状态
        setTimeout(() => {
          console.log("[RegisterModal] 注册成功，跳转到首页");
          this.$router.push('/');
          // 使用 nextTick 确保路由跳转完成后再刷新，这样可以确保首页正确显示登录状态
          this.$nextTick(() => {
            // 如果还在当前页面，强制刷新
            if (this.$route.path !== '/') {
              window.location.href = '/';
            }
          });
        }, 500);
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
  color: var(--primary);
  text-decoration: none;
  transition: color 0.2s;
}

a:hover {
  color: #3d7ae8;
  text-decoration: underline;
}

/* 贡献者申请选项样式 */
.form-check {
  padding-left: 0;
}

.form-check-input {
  margin-top: 0.25rem;
  margin-right: 0.5rem;
  cursor: pointer;
}

.form-check-label {
  cursor: pointer;
  user-select: none;
}

.form-check-label strong {
  color: #212529;
  font-weight: 600;
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
