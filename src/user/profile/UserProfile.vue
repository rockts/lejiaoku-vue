<template>
  <div class="container my-5">
    <div class="row">
      <!-- 侧边栏 -->
      <div class="col-md-3">
        <div class="card">
          <div class="card-body text-center">
            <div class="avatar-container mb-3">
              <img
                v-if="displayUser?.avatar_url"
                :src="avatarDisplayUrl"
                alt="头像"
                class="avatar-image"
              />
              <i
                v-else
                class="bi bi-person-circle avatar-icon"
              ></i>
            </div>
            <h5 class="mt-3">{{ displayUser?.username || displayUser?.name || '未知用户' }}</h5>
            <p class="text-muted small mb-2">{{ displayUser?.email || '未设置邮箱' }}</p>
            <div v-if="displayUser?.nickname" class="text-muted small mb-2">
              <i class="bi bi-at"></i> {{ displayUser.nickname }}
            </div>
            <span v-if="displayUser?.role === 'admin'" class="badge bg-danger">
              管理员
            </span>
            <span v-else-if="displayUser?.role === 'editor'" class="badge bg-primary">
              编辑
            </span>
            <span v-else class="badge user-badge">普通用户</span>
          </div>
        </div>

        <div class="list-group mt-3" v-if="isCurrentUser">
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
        <!-- 查看其他用户资料（只读） -->
        <div v-if="!isCurrentUser" class="card">
          <div class="card-header">
            <h5 class="mb-0"><i class="bi bi-person me-2"></i>用户资料</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label text-muted">用户名</label>
                <div class="form-control-plaintext">{{ displayUser?.username || displayUser?.name || '未知用户' }}</div>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label text-muted">邮箱</label>
                <div class="form-control-plaintext">{{ displayUser?.email || '未设置' }}</div>
              </div>
              <div class="col-md-6 mb-3" v-if="displayUser?.nickname">
                <label class="form-label text-muted">昵称</label>
                <div class="form-control-plaintext">{{ displayUser.nickname }}</div>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label text-muted">角色</label>
                <div class="form-control-plaintext">
                  <span v-if="displayUser?.role === 'admin'" class="badge bg-danger">管理员</span>
                  <span v-else-if="displayUser?.role === 'editor'" class="badge bg-primary">编辑</span>
                  <span v-else class="badge user-badge">普通用户</span>
                </div>
              </div>
              <div class="col-12 mb-3" v-if="displayUser?.description">
                <label class="form-label text-muted">个人简介</label>
                <div class="form-control-plaintext">{{ displayUser.description }}</div>
              </div>
              <div class="col-12 mb-3">
                <label class="form-label text-muted">注册时间</label>
                <div class="form-control-plaintext">{{ formatDate(displayUser?.created_at) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 基本信息（仅自己的资料可编辑） -->
        <div v-if="isCurrentUser && activeTab === 'info'" class="card">
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
                  :value="displayUser?.username || displayUser?.name || ''"
                  disabled
                  placeholder="用户名"
                />
                <small class="text-muted">用户名注册后不可修改</small>
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
                <label class="form-label">昵称</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="profileForm.nickname"
                  placeholder="输入昵称"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">个人简介</label>
                <textarea
                  class="form-control"
                  rows="3"
                  v-model="profileForm.description"
                  placeholder="介绍一下自己..."
                ></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">头像</label>
                <div class="avatar-upload-section">
                  <div class="avatar-preview mb-3">
                    <img
                      v-if="avatarPreviewUrl || displayUser?.avatar_url"
                      :src="avatarPreviewUrl || avatarDisplayUrl"
                      alt="头像预览"
                      class="avatar-preview-image"
                    />
                    <div v-else class="avatar-placeholder">
                      <i class="bi bi-person-circle"></i>
                      <span>暂无头像</span>
                    </div>
                  </div>
                  <div class="d-flex gap-2">
                    <input
                      type="file"
                      ref="avatarFileInput"
                      @change="handleAvatarUpload"
                      accept="image/png,image/jpg,image/jpeg,image/gif"
                      class="form-control"
                      style="display: none"
                    />
                    <button
                      type="button"
                      class="btn btn-outline-primary"
                      @click="$refs.avatarFileInput.click()"
                    >
                      <i class="bi bi-upload me-2"></i>选择图片
                    </button>
                    <button
                      v-if="avatarPreviewUrl || displayUser?.avatar_url"
                      type="button"
                      class="btn btn-outline-danger"
                      @click="removeAvatar"
                    >
                      <i class="bi bi-trash me-2"></i>移除
                    </button>
                  </div>
                  <small class="text-muted d-block mt-2">
                    支持 JPG、PNG、GIF 格式，建议尺寸 200x200 像素
                  </small>
                </div>
              </div>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="updating"
              >
                <span
                  v-if="updating"
                  class="spinner-border spinner-border-sm me-2"
                ></span>
                {{ updating ? "保存中..." : "保存修改" }}
              </button>
            </form>
          </div>
        </div>

        <!-- 修改密码（仅自己的资料） -->
        <div v-if="isCurrentUser && activeTab === 'password'" class="card">
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
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="changingPassword"
              >
                <span
                  v-if="changingPassword"
                  class="spinner-border spinner-border-sm me-2"
                ></span>
                {{ changingPassword ? "修改中..." : "修改密码" }}
              </button>
            </form>
          </div>
        </div>

        <!-- 账号安全（仅自己的资料） -->
        <div v-if="isCurrentUser && activeTab === 'security'" class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-shield-check me-2"></i>账号安全
            </h5>
          </div>
          <div class="card-body">
            <div class="list-group">
              <div
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <h6 class="mb-1">登录密码</h6>
                  <small class="text-muted"
                    >定期更改密码可以提高账号安全性</small
                  >
                </div>
                <button
                  class="btn btn-sm btn-outline-primary"
                  @click="activeTab = 'password'"
                >
                  修改
                </button>
              </div>
              <div
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <h6 class="mb-1">邮箱验证</h6>
                  <small class="text-muted">{{ currentUser?.email }}</small>
                </div>
                <span class="badge bg-success">已验证</span>
              </div>
              <div
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <h6 class="mb-1">账号注册时间</h6>
                  <small class="text-muted">{{
                    formatDate(currentUser?.created_at)
                  }}</small>
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
  props: {
    userId: {
      type: [String, Number],
      default: null,
    },
    isMyProfile: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeTab: "info",
      updating: false,
      changingPassword: false,
      loading: false,
      uploadingAvatar: false,
      avatarFile: null,
      avatarPreviewUrl: null,
      profileUser: null, // 当前查看的用户信息
      profileForm: {
        email: "",
        nickname: "",
        description: "",
        avatar_url: "",
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
    // 判断是否为当前登录用户的资料
    isCurrentUser() {
      if (this.isMyProfile) return true;
      if (!this.profileUser || !this.currentUser) return false;
      return this.profileUser.id === this.currentUser.id;
    },
    // 显示的用户信息（优先使用 profileUser，否则使用 currentUser）
    displayUser() {
      return this.profileUser || this.currentUser;
    },
    // 头像显示URL
    avatarDisplayUrl() {
      const user = this.displayUser;
      if (user?.avatar_url) {
        // 如果是完整URL，直接返回
        if (user.avatar_url.startsWith("http")) {
          return user.avatar_url;
        }
        // 如果是相对路径（以/开头），直接使用（通过代理访问）
        if (user.avatar_url.startsWith("/")) {
          return user.avatar_url;
        }
        // 其他情况，添加API基础URL
        const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || "";
        return `${API_BASE_URL}${user.avatar_url}`;
      }
      return null;
    },
  },
  async created() {
    await this.fetchUser();
  },
  watch: {
    // 监听路由参数变化（仅当 userId 实际改变时）
    userId: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal && newVal) {
          this.fetchUser();
        }
      },
      immediate: false,
    },
  },
  methods: {
    async fetchUser() {
      // 防止重复请求
      if (this.loading) {
        return;
      }

      this.loading = true;
      try {
        let user;

        if (this.isMyProfile) {
          // 获取当前登录用户信息
          const response = await apiHttpClient.get("/user");
          user = response.data;
          
          // 更新 store 和 localStorage
          this.$store.commit("auth/setUser", user);
          localStorage.setItem("user_info", JSON.stringify(user));
        } else if (this.userId) {
          // 获取指定用户信息
          const response = await apiHttpClient.get(`/users/${this.userId}`);
          user = response.data;
        } else {
          // 如果没有 userId 且不是我的资料，使用当前用户
          if (this.currentUser) {
            user = this.currentUser;
          } else {
            const response = await apiHttpClient.get("/user");
            user = response.data;
            this.$store.commit("auth/setUser", user);
            localStorage.setItem("user_info", JSON.stringify(user));
          }
        }

        this.profileUser = user;

        // 只有是自己的资料时才填充表单（可编辑）
        if (this.isCurrentUser) {
          this.profileForm = {
            email: user.email || "",
            nickname: user.nickname || "",
            description: user.description || "",
            avatar_url: user.avatar_url || "",
          };
        }
      } catch (error) {
        console.error("[UserProfile] 获取用户信息失败:", error);
        notification.error(
          error.response?.data?.message || "获取用户信息失败"
        );
        
        // 如果是查看其他用户失败，跳转到首页
        if (!this.isMyProfile && this.userId) {
          this.$router.push("/");
        }
      } finally {
        this.loading = false;
      }
    },
    handleAvatarUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // 检查文件类型
      if (!file.type.startsWith("image/")) {
        notification.error("请选择图片文件");
        return;
      }

      // 检查文件大小（5MB）
      if (file.size > 5 * 1024 * 1024) {
        notification.error("图片大小不能超过 5MB");
        return;
      }

      this.avatarFile = file;

      // 生成预览
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarPreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    removeAvatar() {
      this.avatarFile = null;
      this.avatarPreviewUrl = null;
      this.profileForm.avatar_url = "";
      if (this.$refs.avatarFileInput) {
        this.$refs.avatarFileInput.value = "";
      }
    },

    async uploadAvatar() {
      if (!this.avatarFile) {
        return null;
      }

      this.uploadingAvatar = true;
      try {
        const formData = new FormData();
        formData.append("file", this.avatarFile);
        formData.append("type", "avatar"); // 标识为头像上传

        console.log("[UserProfile] 开始上传头像，文件:", {
          name: this.avatarFile.name,
          size: this.avatarFile.size,
          type: this.avatarFile.type,
        });

        // 尝试多个可能的上传接口
        let response;
        let lastError;
        
        // 尝试接口列表
        const uploadEndpoints = [
          "/api/upload/avatar",
          "/upload/avatar",
          "/api/upload",
          "/upload",
        ];

        for (const endpoint of uploadEndpoints) {
          try {
            console.log("[UserProfile] 尝试上传接口:", endpoint);
            response = await apiHttpClient.post(endpoint, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            console.log("[UserProfile] 上传成功，响应:", response.data);
            break; // 成功则跳出循环
          } catch (error) {
            console.log("[UserProfile] 接口失败:", endpoint, error.response?.status);
            lastError = error;
            // 如果是 404，继续尝试下一个接口
            if (error.response?.status === 404) {
              continue;
            }
            // 其他错误直接抛出
            throw error;
          }
        }

        if (!response) {
          throw lastError || new Error("所有上传接口都失败");
        }

        // 返回头像URL（根据后端实际返回的字段调整）
        const avatarUrl = response.data.url || 
                         response.data.avatar_url || 
                         response.data.path || 
                         response.data.file_url ||
                         response.data.data?.url ||
                         response.data.data?.avatar_url;
        
        if (!avatarUrl) {
          console.error("[UserProfile] 上传响应中没有找到URL:", response.data);
          notification.error("上传成功但未获取到文件URL，请检查后端响应格式");
          return null;
        }

        console.log("[UserProfile] 头像URL:", avatarUrl);
        return avatarUrl;
      } catch (error) {
        console.error("[UserProfile] 头像上传失败:", error);
        console.error("[UserProfile] 错误详情:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        notification.error(
          error.response?.data?.message || 
          error.response?.data?.error ||
          "头像上传失败，请检查网络连接或联系管理员"
        );
        return null;
      } finally {
        this.uploadingAvatar = false;
      }
    },

    async updateProfile() {
      this.updating = true;
      try {
        // 如果有新上传的头像，先上传头像
        if (this.avatarFile) {
          const avatarUrl = await this.uploadAvatar();
          if (avatarUrl) {
            this.profileForm.avatar_url = avatarUrl;
          } else {
            this.updating = false;
            return;
          }
        }

        // 根据 API 文档，使用 PATCH /user/profile
        // 构建更新数据（只包含有值的字段）
        const updateData = {};
        if (this.profileForm.email) updateData.email = this.profileForm.email;
        if (this.profileForm.nickname) updateData.nickname = this.profileForm.nickname;
        if (this.profileForm.description) updateData.description = this.profileForm.description;
        if (this.profileForm.avatar_url) updateData.avatar_url = this.profileForm.avatar_url;

        if (Object.keys(updateData).length === 0) {
          notification.warning("请至少填写一个要更新的字段");
          this.updating = false;
          return;
        }

        const response = await apiHttpClient.patch("/user/profile", {
          update: updateData,
        });

        // 更新本地用户信息
        const updatedUser = response.data.user || response.data;
        localStorage.setItem("user_info", JSON.stringify(updatedUser));
        this.$store.commit("auth/setUser", updatedUser);

        // 清除预览和文件
        this.avatarFile = null;
        this.avatarPreviewUrl = null;
        if (this.$refs.avatarFileInput) {
          this.$refs.avatarFileInput.value = "";
        }

        notification.success("个人信息更新成功！");
      } catch (error) {
        console.error("[UserProfile] 更新失败:", error);
        notification.error(
          error.response?.data?.message || "更新失败，请稍后重试"
        );
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

      if (this.passwordForm.oldPassword === this.passwordForm.newPassword) {
        notification.warning("新密码不能与当前密码相同");
        return;
      }

      this.changingPassword = true;
      try {
        // 根据 API 文档，密码更新需要使用 validate 和 update 结构
        await apiHttpClient.patch("/user/profile", {
          validate: {
            password: this.passwordForm.oldPassword,
          },
          update: {
            password: this.passwordForm.newPassword,
          },
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
        notification.error(
          error.response?.data?.message || "修改密码失败，请检查当前密码"
        );
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

/* 头像样式 */
.avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.avatar-icon {
  font-size: 5rem;
  color: #667eea;
}

.avatar-upload-section {
  border: 1px dashed #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  background-color: #f8f9fa;
}

.avatar-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 150px;
}

.avatar-preview-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.avatar-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #e9ecef;
  color: #6c757d;
}

.avatar-placeholder i {
  font-size: 4rem;
  margin-bottom: 0.5rem;
}

.gap-2 {
  gap: 0.5rem;
}

/* 用户角色标签样式 - 普通用户使用柔和的浅绿色 */
.user-badge {
  background: linear-gradient(135deg, #a8e6cf 0%, #88d8a3 100%);
  color: #2d5016;
  border: none;
  font-weight: 500;
  padding: 0.5em 1em;
}
</style>
