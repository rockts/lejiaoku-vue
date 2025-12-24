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
              <i class="bi bi-box-arrow-in-right"></i> 用户登录
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
    switchToRegister() {
      this.$emit("switch-to-register");
    },
    resetForm() {
      this.email = "";
      this.password = "";
      this.loading = false;
    },
    async handleSubmit() {
      if (!this.email || !this.password) {
        notification.warning("请填写完整信息");
        return;
      }

      this.loading = true;
      try {
        const response = await apiHttpClient.post("/login", {
          email: this.email,
          password: this.password,
        });

        localStorage.setItem("token", response.data.token);
        notification.success("登录成功！");

        // 刷新页面状态
        await this.$store.dispatch("auth/getCurrentUser");

        this.closeModal();

        // 如果在登录页，跳转到首页
        if (this.$route.path === "/login") {
          this.$router.push("/");
        }
      } catch (error) {
        console.error("[LoginModal] 登录失败:", error);
        notification.error(
          error.response?.data?.message || "登录失败，请检查邮箱和密码"
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
