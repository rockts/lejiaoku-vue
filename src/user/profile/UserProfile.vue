<template>
  <div class="container my-5">
    <div class="row">
      <!-- 侧边栏 -->
      <div class="col-md-3">
        <div class="card">
          <div class="card-body text-center">
            <i class="bi bi-person-circle" style="font-size: 5rem; color: #667eea"></i>
            <h5 class="mt-3">{{ currentUser?.username }}</h5>
            <p class="text-muted small mb-2">{{ currentUser?.email }}</p>
            <span
              v-if="currentUser?.role === 'admin'"
              class="badge bg-danger"
            >
              管理员
            </span>
            <span v-else class="badge bg-secondary">普通用户</span>
          </div>
        </div>

        <div class="list-group mt-3">
          <a
            href="#"
            class="list-group-item list-group-item-action"
            :class="{ active: activeTab === 'info' }"
            @click.prevent="activeTab = 'info'"
          >
            <i class="bi bi-person me-2"></i>基本信息
          </a>
          <a
            href="#"
            class="list-group-item list-group-item-action"
            :class="{ active: activeTab === 'password' }"
            @click.prevent="activeTab = 'password'"
          >
            <i class="bi bi-key me-2"></i>修改密码
          </a>
          <a
            href="#"
            class="list-group-item list-group-item-action"
            :class="{ active: activeTab === 'security' }"
            @click.prevent="activeTab = 'security'"
          >
            <i class="bi bi-shield-check me-2"></i>账号安全
          </a>
        </div>
      </div>

      <!-- 主内容区 -->
      <div class="col-md-9">
        <!-- 基本信息 -->
        <div v-if="activeTab === 'info'" class="card">
          <div class="card-header">
            <h5 class="mb-0"><i class="bi bi-person me-2"></i>基本信息</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="updateProfile">
              <div class="mb-3">
                <label class="form-label">用户名</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="profileForm.username"
                  placeholder="输入用户名"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">邮箱</label>
                <input
                  type="email"
                  class="form-control"
                  v-model="profileForm.email"
                  placeholder="输入邮箱"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">个人简介</label>
                <textarea
                  class="form-control"
                  rows="3"
                  v-model="profileForm.bio"
                  placeholder="介绍一下自己..."
                ></textarea>
              </div>
              <button type="submit" class="btn btn-primary" :disabled="updating">
                <span v-if="updating" class="spinner-border spinner-border-sm me-2"></span>
                {{ updating ? "保存中..." : "保存修改" }}
              </button>
            </form>
          </div>
        </div>

        <!-- 修改密码 -->
        <div v-if="activeTab === 'password'" class="card">
          <div class="card-header">
            <h5 class="mb-0"><i class="bi bi-key me-2"></i>修改密码</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="changePassword">
              <div class="mb-3">
                <label class="form-label">当前密码</label>
                <input
                  type="password"
                  class="form-control"
                  v-model="passwordForm.oldPassword"
                  placeholder="输入当前密码"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">新密码</label>
                <input
                  type="password"
                  class="form-control"
                  v-model="passwordForm.newPassword"
                  placeholder="输入新密码（至少6位）"
                  required
                  minlength="6"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">确认新密码</label>
                <input
                  type="password"
                  class="form-control"
                  v-model="passwordForm.confirmPassword"
                  placeholder="再次输入新密码"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary" :disabled="changingPassword">
                <span v-if="changingPassword" class="spinner-border spinner-border-sm me-2"></span>
                {{ changingPassword ? "修改中..." : "修改密码" }}
              </button>
            </form>
          </div>
        </div>

        <!-- 账号安全 -->
        <div v-if="activeTab === 'security'" class="card">
          <div class="card-header">
            <h5 class="mb-0"><i class="bi bi-shield-check me-2"></i>账号安全</h5>
          </div>
          <div class="card-body">
            <div class="list-group">
              <div class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="mb-1">登录密码</h6>
                  <small class="text-muted">定期更改密码可以提高账号安全性</small>
                </div>
                <button
                  class="btn btn-sm btn-outline-primary"
                  @click="activeTab = 'password'"
                >
                  修改
                </button>
              </div>
              <div class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="mb-1">邮箱验证</h6>
                  <small class="text-muted">{{ currentUser?.email }}</small>
                </div>
                <span class="badge bg-success">已验证</span>
              </div>
              <div class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="mb-1">账号注册时间</h6>
                  <small class="text-muted">{{ formatDate(currentUser?.created_at) }}</small>
                </div>
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
import { mapGetters } from "vuex";
import { apiHttpClient } from "@/app/app.service";
import notification from "@/utils/notification";

export default defineComponent({
  name: "UserProfile",
  data() {
    return {
      activeTab: "info",
      updating: false,
      changingPassword: false,
      profileForm: {
        username: "",
        email: "",
        bio: "",
      },
      passwordForm: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/user",
    }),
  },
  created() {
    if (this.currentUser) {
      this.profileForm.username = this.currentUser.username;
      this.profileForm.email = this.currentUser.email;
      this.profileForm.bio = this.currentUser.bio || "";
    }
  },
  methods: {
    async updateProfile() {
      this.updating = true;
      try {
        const response = await apiHttpClient.put("/user/profile", this.profileForm);
        
        // 更新本地用户信息
        const updatedUser = { ...this.currentUser, ...response.data };
        localStorage.setItem("user_info", JSON.stringify(updatedUser));
        this.$store.commit("auth/setUser", updatedUser);
        
        notification.success("个人信息更新成功！");
      } catch (error) {
        console.error("[UserProfile] 更新失败:", error);
        notification.error(error.response?.data?.message || "更新失败，请稍后重试");
      } finally {
        this.updating = false;
      }
    },
    async changePassword() {
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        notification.warning("两次输入的密码不一致");
        return;
      }

      if (this.passwordForm.newPassword.length < 6) {
        notification.warning("新密码至少需要6位");
        return;
      }

      this.changingPassword = true;
      try {
        await apiHttpClient.put("/user/password", {
          oldPassword: this.passwordForm.oldPassword,
          newPassword: this.passwordForm.newPassword,
        });

        notification.success("密码修改成功！");
        
        // 清空表单
        this.passwordForm = {
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        };
      } catch (error) {
        console.error("[UserProfile] 修改密码失败:", error);
        notification.error(error.response?.data?.message || "修改密码失败，请检查当前密码");
      } finally {
        this.changingPassword = false;
      }
    },
    formatDate(date) {
      if (!date) return "未知";
      return new Date(date).toLocaleDateString("zh-CN");
    },
  },
});
</script>

<style scoped>
.card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px 8px 0 0;
}

.list-group-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
</style>
