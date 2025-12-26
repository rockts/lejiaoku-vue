<template>
  <div class="container my-5">
    <div class="row">
      <!-- 侧边栏 -->
      <div class="col-md-3">
        <div class="card">
          <div class="card-body text-center">
            <div class="avatar-container mb-3">
              <div class="avatar-wrapper">
                <img
                  v-if="avatarDisplayUrl && !avatarLoadError"
                  :src="avatarDisplayUrl"
                  alt="头像"
                  class="avatar-image"
                  @error="handleAvatarError"
                />
                <i
                  v-else
                  class="bi bi-person-circle avatar-icon"
                ></i>
              </div>
            </div>
            <h5 class="mt-3">{{ displayUser?.username || displayUser?.name || '未知用户' }}</h5>
            <p class="text-muted small mb-2">{{ displayUser?.email || '未设置邮箱' }}</p>
            <div v-if="displayUser?.nickname" class="text-muted small mb-2">
              <i class="bi bi-at"></i> {{ displayUser.nickname }}
            </div>
            <span v-if="displayUser?.role === 'admin'" class="badge rounded-pill text-bg-danger">
              管理员
            </span>
            <span v-else-if="displayUser?.role === 'editor'" class="badge rounded-pill text-bg-warning">
              编辑
            </span>
            <span v-else-if="displayUser?.role === 'contributor'" class="badge rounded-pill text-bg-info">
              贡献者
            </span>
            <span v-else class="badge rounded-pill text-bg-secondary">普通用户</span>
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
                  <span v-if="displayUser?.role === 'admin'" class="badge rounded-pill text-bg-danger">管理员</span>
                  <span v-else-if="displayUser?.role === 'editor'" class="badge rounded-pill text-bg-warning">编辑</span>
                  <span v-else-if="displayUser?.role === 'contributor'" class="badge rounded-pill text-bg-info">贡献者</span>
                  <span v-else class="badge rounded-pill text-bg-secondary">普通用户</span>
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
                      v-if="avatarPreviewUrl || avatarDisplayUrl"
                      :src="avatarPreviewUrl || avatarDisplayUrl"
                      alt="头像预览"
                      class="avatar-preview-image"
                      @error="handleAvatarError"
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
                      v-if="avatarPreviewUrl || avatarDisplayUrl"
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
      avatarLoadError: false, // 头像加载错误标志
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
      // 优先使用预览URL（上传后立即显示）
      if (this.avatarPreviewUrl) {
        // 有预览URL时，重置错误标志
        this.avatarLoadError = false;
        return this.avatarPreviewUrl;
      }
      
      const user = this.displayUser;
      
      if (user?.avatar_url && String(user.avatar_url).trim() !== '') {
        // 如果用户有头像URL，重置错误标志
        if (this.avatarLoadError) {
          this.avatarLoadError = false;
        }
        
        let url = String(user.avatar_url).trim();
        
        // 如果是完整URL，直接返回（添加时间戳防止缓存）
        if (url.startsWith("http://") || url.startsWith("https://")) {
          return `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;
        }
        
        // 如果是相对路径（以/开头），直接使用（通过代理访问）
        if (url.startsWith("/")) {
          const finalUrl = `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;
          return finalUrl;
        }
        
        // 其他情况，添加API基础URL
        const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || "";
        const finalUrl = `${API_BASE_URL}${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;
        return finalUrl;
      }
      
      // 如果没有 avatar_url，尝试使用默认的头像路径（即使后端没有返回 avatar_url，也可能有头像文件）
      // 根据 API 文档，头像访问路径是 /api/users/:userId/avatar
      if (user?.id) {
        const defaultAvatarUrl = `/api/users/${user.id}/avatar?t=${Date.now()}`;
        console.log("[UserProfile] avatarDisplayUrl - 使用默认头像路径:", defaultAvatarUrl);
        return defaultAvatarUrl;
      }
      
      // 如果都没有，返回 null 以显示默认图标
      // 重置错误标志
      this.avatarLoadError = false;
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
        
        // 重置头像加载错误标志
        this.avatarLoadError = false;

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

    handleAvatarError(event) {
      console.error("[UserProfile] 头像加载失败:", event.target.src);
      // 标记头像加载失败，显示默认图标
      this.avatarLoadError = true;
      // 隐藏图片
      if (event.target) {
        event.target.style.display = 'none';
      }
    },

    async uploadAvatar() {
      if (!this.avatarFile) {
        return null;
      }

      this.uploadingAvatar = true;
      try {
        // 根据 API 文档，使用 POST /api/avatar 或 POST /avatar，字段名是 avatar
        const formData = new FormData();
        formData.append("avatar", this.avatarFile);

        console.log("[UserProfile] 开始上传头像，文件:", {
          name: this.avatarFile.name,
          size: this.avatarFile.size,
          type: this.avatarFile.type,
        });

        // 尝试两个接口（按 API 文档）
        let response;
        let lastError;
        const uploadEndpoints = [
          "/api/avatar",
          "/avatar",
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
            console.log("[UserProfile] 接口失败:", endpoint, {
              status: error.response?.status,
              message: error.response?.data?.message || error.message,
              data: error.response?.data,
            });
            lastError = error;
            // 如果是 404 或 405，继续尝试下一个接口
            if (error.response?.status === 404 || error.response?.status === 405) {
              continue;
            }
            // 如果是 401 或 403，说明是权限问题，直接抛出
            if (error.response?.status === 401 || error.response?.status === 403) {
              throw error;
            }
            // 如果是网络错误（没有 response），也继续尝试
            if (!error.response) {
              console.warn("[UserProfile] 网络错误，继续尝试下一个接口");
              continue;
            }
            // 其他错误也继续尝试下一个接口
            continue;
          }
        }

        if (!response) {
          const errorMsg = lastError?.response?.data?.message || 
                          lastError?.response?.data?.error ||
                          lastError?.message ||
                          "头像上传失败";
          console.error("[UserProfile] 所有接口都失败，最后错误:", {
            status: lastError?.response?.status,
            message: errorMsg,
            data: lastError?.response?.data,
          });
          throw new Error(errorMsg);
        }

        // 根据 API 文档，成功响应格式：{ success: true, message: "...", data: {...} }
        // 优先从响应中获取头像URL（后端可能返回实际的文件路径）
        console.log("[UserProfile] 上传响应数据:", response.data);
        
        let avatarUrl = null;
        
        // 尝试从响应中获取头像URL（多种可能的字段名）
        if (response.data) {
          avatarUrl = response.data.url || 
                     response.data.avatar_url || 
                     response.data.avatarUrl ||
                     response.data.data?.url ||
                     response.data.data?.avatar_url ||
                     response.data.data?.avatarUrl;
        }
        
        // 如果响应中没有URL，尝试构建URL
        if (!avatarUrl) {
          const currentUser = this.$store.state.auth.user || this.profileUser;
          if (currentUser && currentUser.id) {
            // 使用用户 ID 构建头像 URL（根据 API 文档，使用 /api/users/:userId/avatar）
            avatarUrl = `/api/users/${currentUser.id}/avatar`;
            console.log("[UserProfile] 从用户ID构建头像URL:", avatarUrl);
          } else {
            console.warn("[UserProfile] 无法获取用户ID，无法构建头像URL");
            return null;
          }
        } else {
          console.log("[UserProfile] 从响应中获取头像URL:", avatarUrl);
        }
        
        return avatarUrl;
      } catch (error) {
        console.error("[UserProfile] 头像上传失败:", error);
        console.error("[UserProfile] 错误详情:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url,
        });
        
        // 根据错误类型显示更详细的错误信息
        let errorMessage = "头像上传失败";
        
        if (error.response) {
          // 有响应，说明请求已发送但服务器返回错误
          const status = error.response.status;
          const data = error.response.data;
          
          if (status === 401) {
            errorMessage = "未登录或登录已过期，请重新登录";
          } else if (status === 403) {
            errorMessage = "无权限上传头像";
          } else if (status === 413) {
            errorMessage = "文件太大，请选择小于 5MB 的图片";
          } else if (status === 415) {
            errorMessage = "不支持的图片格式，请使用 JPG、PNG 或 GIF";
          } else if (status === 404) {
            errorMessage = "上传接口不存在，请联系管理员";
          } else if (data?.message) {
            errorMessage = data.message;
          } else if (data?.error) {
            errorMessage = data.error;
          } else {
            errorMessage = `上传失败 (${status})，请重试或联系管理员`;
          }
        } else if (error.message) {
          // 网络错误或其他错误
          if (error.message.includes("Network Error") || error.message.includes("timeout")) {
            errorMessage = "网络连接失败，请检查网络后重试";
          } else if (error.message.includes("所有上传接口都失败")) {
            errorMessage = "所有上传接口都失败，请检查后端服务是否正常运行";
          } else {
            errorMessage = error.message;
          }
        } else {
          errorMessage = "头像上传失败，请检查网络连接或联系管理员";
        }
        
        notification.error(errorMessage);
        return null;
      } finally {
        this.uploadingAvatar = false;
      }
    },

    async updateProfile() {
      this.updating = true;
      try {
        let avatarUrl = null;
        
        // 如果有新上传的头像，先尝试上传头像
        if (this.avatarFile) {
          avatarUrl = await this.uploadAvatar();
          if (avatarUrl) {
            this.profileForm.avatar_url = avatarUrl;
            // 上传成功后，需要更新用户资料以保存头像URL
            try {
              const updateResponse = await apiHttpClient.patch("/user/profile", {
                update: {
                  avatar_url: avatarUrl,
                },
              });
              console.log("[UserProfile] 头像URL已保存到用户资料:", avatarUrl);
              
              // 更新本地用户信息
              const updatedUser = updateResponse.data.user || updateResponse.data;
              
              // 无论响应中是否有用户信息，都直接更新 profileUser
              // 使用对象展开运算符创建新对象，确保 Vue 响应式系统能检测到变化
              if (this.profileUser) {
                this.profileUser = { ...this.profileUser, avatar_url: avatarUrl };
              } else {
                // 如果没有 profileUser，从 store 获取并创建
                const currentUser = this.$store.state.auth.user;
                this.profileUser = currentUser ? { ...currentUser, avatar_url: avatarUrl } : { avatar_url: avatarUrl };
              }
              
              // 更新 profileForm
              this.profileForm.avatar_url = avatarUrl;
              
              // 更新 store 和 localStorage
              if (updatedUser) {
                updatedUser.avatar_url = avatarUrl;
                localStorage.setItem("user_info", JSON.stringify(updatedUser));
                this.$store.commit("auth/setUser", updatedUser);
              } else {
                // 如果响应中没有用户信息，从 store 获取并更新
                const currentUser = this.$store.state.auth.user;
                if (currentUser) {
                  const userWithAvatar = { ...currentUser, avatar_url: avatarUrl };
                  localStorage.setItem("user_info", JSON.stringify(userWithAvatar));
                  this.$store.commit("auth/setUser", userWithAvatar);
                }
              }
              
              console.log("[UserProfile] 更新后的 profileUser:", this.profileUser);
              console.log("[UserProfile] profileUser.avatar_url:", this.profileUser?.avatar_url);
              console.log("[UserProfile] displayUser:", this.displayUser);
              console.log("[UserProfile] displayUser.avatar_url:", this.displayUser?.avatar_url);
              console.log("[UserProfile] avatarDisplayUrl:", this.avatarDisplayUrl);
              
              // 显示成功消息
              notification.success("头像上传成功！");
              
              // 立即重新获取用户信息，确保头像URL从数据库获取并显示
              await this.fetchUser();
              
              // 清除文件选择
              this.avatarFile = null;
              // 延迟清除预览，让新头像有时间加载
              setTimeout(() => {
                this.avatarPreviewUrl = null;
              }, 2000);
              
              if (this.$refs.avatarFileInput) {
                this.$refs.avatarFileInput.value = "";
              }
              
              this.updating = false;
              return; // 头像已上传并保存，直接返回
            } catch (updateError) {
              console.error("[UserProfile] 保存头像URL失败:", updateError);
              notification.error("头像上传成功，但保存到用户资料失败：" + (updateError.response?.data?.message || updateError.message));
              this.updating = false;
              return;
            }
          } else {
            // 如果所有上传接口都失败，尝试直接通过 PATCH /user/profile 上传
            console.log("[UserProfile] 所有上传接口失败，尝试通过更新接口直接上传");
            try {
              const formData = new FormData();
              // 尝试多个可能的字段名
              formData.append("file", this.avatarFile);
              formData.append("avatar", this.avatarFile);
              formData.append("avatar_file", this.avatarFile);
              
              // 如果有其他字段，也添加到 FormData
              if (this.profileForm.email) formData.append("email", this.profileForm.email);
              if (this.profileForm.nickname) formData.append("nickname", this.profileForm.nickname);
              if (this.profileForm.description) formData.append("description", this.profileForm.description);
              
              // 尝试不同的请求格式
              let uploadResponse;
              try {
                // 方式1: 直接发送 FormData
                uploadResponse = await apiHttpClient.patch("/user/profile", formData, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                });
              } catch (error1) {
                // 方式2: 使用 update 包装
                const formData2 = new FormData();
                formData2.append("file", this.avatarFile);
                formData2.append("update", JSON.stringify({
                  avatar_file: "uploading" // 占位符，后端可能需要这个字段
                }));
                
                uploadResponse = await apiHttpClient.patch("/user/profile", formData2, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                });
              }
              
              // 从响应中获取头像URL
              const updatedUser = uploadResponse.data.user || uploadResponse.data;
              if (updatedUser.avatar_url) {
                avatarUrl = updatedUser.avatar_url;
                this.profileForm.avatar_url = avatarUrl;
                console.log("[UserProfile] 通过更新接口上传头像成功:", avatarUrl);
              } else {
                throw new Error("上传成功但未获取到头像URL");
              }
            } catch (uploadError) {
              console.error("[UserProfile] 通过更新接口上传头像也失败:", uploadError);
              const errorMsg = uploadError.response?.data?.message || 
                              uploadError.response?.data?.error ||
                              uploadError.message ||
                              "头像上传失败，后端可能不支持文件上传";
              notification.error(errorMsg);
              this.updating = false;
              return;
            }
          }
        }

        // 根据 API 文档，使用 PATCH /user/profile
        // 构建更新数据（只包含有值的字段）
        const updateData = {};
        if (this.profileForm.email) updateData.email = this.profileForm.email;
        if (this.profileForm.nickname) updateData.nickname = this.profileForm.nickname;
        if (this.profileForm.description) updateData.description = this.profileForm.description;
        if (this.profileForm.avatar_url) updateData.avatar_url = this.profileForm.avatar_url;

        // 如果头像已经通过上传接口成功上传，且没有其他字段需要更新，则跳过更新接口
        let updatedUser;
        if (avatarUrl && Object.keys(updateData).length === 1 && updateData.avatar_url) {
          console.log("[UserProfile] 头像已上传，无需再次更新");
          // 从上传响应中获取用户信息（如果之前通过更新接口上传）
          // 否则需要重新获取用户信息
          if (!this.profileUser || !this.profileUser.avatar_url) {
            const userResponse = await apiHttpClient.get("/user");
            updatedUser = userResponse.data;
          } else {
            updatedUser = { ...this.profileUser, avatar_url: avatarUrl };
          }
        } else if (Object.keys(updateData).length === 0) {
          notification.warning("请至少填写一个要更新的字段");
          this.updating = false;
          return;
        } else {
          // 调用更新接口
          const response = await apiHttpClient.patch("/user/profile", {
            update: updateData,
          });
          updatedUser = response.data.user || response.data;
        }

        // 更新本地用户信息
        // 合并数据，确保 nickname 和 username 不被覆盖
        const currentStoreUser = this.$store.state.auth.user;
        const mergedUserData = {
          ...updatedUser, // 先使用后端返回的数据
          ...currentStoreUser, // 然后用旧数据覆盖，保留旧数据中的字段
          // 如果后端返回了 nickname，使用后端的；否则保留旧数据
          nickname: (updatedUser.nickname !== undefined && updatedUser.nickname !== null && String(updatedUser.nickname).trim() !== '') 
            ? String(updatedUser.nickname).trim()
            : (currentStoreUser?.nickname || ''),
          // 如果后端返回了 username，使用后端的；否则保留旧数据
          username: (updatedUser.username !== undefined && updatedUser.username !== null && String(updatedUser.username).trim() !== '') 
            ? String(updatedUser.username).trim()
            : (currentStoreUser?.username || ''),
          // 确保其他字段使用后端返回的最新值
          email: updatedUser.email || currentStoreUser?.email || '',
          description: updatedUser.description || currentStoreUser?.description || '',
          avatar_url: updatedUser.avatar_url || currentStoreUser?.avatar_url || '',
        };
        
        console.log("[UserProfile] 更新后的合并数据:", mergedUserData);
        console.log("[UserProfile] 合并后的 nickname:", mergedUserData.nickname);
        
        localStorage.setItem("user_info", JSON.stringify(mergedUserData));
        this.$store.commit("auth/setUser", mergedUserData);
        
        // 更新 profileUser 以反映最新数据
        this.profileUser = mergedUserData;

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
  background: var(--primary);
  color: white;
  border-radius: 8px 8px 0 0;
}

.list-group-item.active {
  background: var(--primary);
  border-color: var(--primary);
}

/* 按钮样式已移至全局 app.css */

/* 头像样式 */
.avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
}

.avatar-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: block;
}

.avatar-icon {
  font-size: 6rem;
  color: var(--primary, #4f8cff); /* 使用主题蓝色 */
  display: block;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8f0ff 100%); /* 浅蓝色背景 */
  border-radius: 50%;
  border: 2px solid rgba(79, 140, 255, 0.2); /* 浅蓝色边框 */
}

.avatar-upload-section {
  border: 1px dashed #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  background-color: #f8f9fa;
}

/* 深色主题下的上传区域 */
[data-theme="dark"] .avatar-upload-section {
  border-color: rgba(255, 255, 255, 0.3);
  background-color: rgba(255, 255, 255, 0.05);
}

[data-theme="dark"] .avatar-upload-section .text-muted {
  color: rgba(255, 255, 255, 0.7) !important;
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
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

/* 用户角色标签样式 - 更醒目 */
.user-badge {
  background: #28a745;
  color: white;
  border: none;
  font-weight: 600;
  padding: 0.5em 1em;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
}

/* 所有角色标签统一样式 - 更醒目 */
.badge.bg-danger,
.badge.bg-primary,
.badge.bg-success,
.badge.user-badge {
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.5em 1em;
  letter-spacing: 0.5px;
  border: 1px solid transparent;
}

.badge.bg-danger {
  background: #dc3545 !important;
  color: white !important;
  border-color: #c82333;
}

.badge.bg-primary {
  background: #007bff !important;
  color: white !important;
  border-color: #0056b3;
}

.badge.bg-success {
  background: #28a745 !important;
  color: white !important;
  border-color: #1e7e34;
}

/* 深色主题下的不可修改字段 */
[data-theme="dark"] .form-control:disabled,
[data-theme="dark"] input:disabled,
[data-theme="dark"] .form-control[readonly] {
  background-color: rgba(255, 255, 255, 0.05) !important;
  color: rgba(255, 255, 255, 0.7) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}

[data-theme="dark"] .form-control-plaintext {
  color: rgba(255, 255, 255, 0.9) !important;
}

[data-theme="dark"] .form-label {
  color: rgba(255, 255, 255, 0.9) !important;
}

[data-theme="dark"] small.text-muted {
  color: rgba(255, 255, 255, 0.6) !important;
}
</style>
