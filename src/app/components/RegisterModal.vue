<template>
  <Teleport to="body">
    <div
      class="modal fade"
      :class="{ show: modelValue }"
      :style="{ display: modelValue ? 'block' : 'none' }"
      tabindex="-1"
      @click.self="closeModal"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-person-plus-fill"></i> 注册用户
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label class="form-label">昵称</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-person-fill"></i>
                  </span>
                  <input
                    type="text"
                    class="form-control"
                    v-model="name"
                    placeholder="输入昵称"
                    required
                  />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">邮箱</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-envelope-fill"></i>
                  </span>
                  <input
                    type="email"
                    class="form-control"
                    v-model="email"
                    placeholder="输入邮箱"
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
                  <button type="button" class="btn btn-outline-secondary btn-sm">
                    <img
                      src="@/assets/img/weixin.png"
                      style="width: 20px; height: 20px"
                      alt="微信"
                    />
                    微信
                  </button>
                  <button type="button" class="btn btn-outline-secondary btn-sm">
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
    <div
      class="modal-backdrop fade show"
      v-if="modelValue"
      @click="closeModal"
    ></div>
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
      name: "",
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
      this.name = "";
      this.email = "";
      this.password = "";
      this.loading = false;
    },
    async handleSubmit() {
      if (!this.name || !this.email || !this.password) {
        notification.warning("请填写完整信息");
        return;
      }

      if (this.password.length < 6) {
        notification.warning("密码至少需要6位");
        return;
      }

      this.loading = true;
      try {
        await apiHttpClient.post("/register", {
          name: this.name,
          email: this.email,
          password: this.password,
        });

        notification.success("注册成功！请登录");
        this.$emit("switch-to-login");
      } catch (error) {
        console.error("[RegisterModal] 注册失败:", error);
        notification.error(
          error.response?.data?.message || "注册失败，请稍后重试"
        );
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>

<style scoped>
.modal-content {
  border-radius: 8px;
}

.input-group-text {
  background-color: #f8f9fa;
}

.gap-3 {
  gap: 0.75rem;
}
</style>
