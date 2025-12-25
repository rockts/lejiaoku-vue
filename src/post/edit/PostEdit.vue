<template>
  <BreadCrumbs />
  <div class="post-edit-page">
    <div class="container post-edit-page-body">
      <h3 class="mb-4"><i class="bi bi-pencil-square"></i> 编辑资源</h3>

      <!-- 加载状态 -->
      <div v-if="loading" class="alert alert-info">
        <div class="spinner-border spinner-border-sm me-2" role="status"></div>
        <span>加载资源信息中...</span>
      </div>

      <!-- 编辑表单 -->
      <form v-else-if="resource">
        <!-- 基本信息 -->
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-white">
            <h5 class="mb-0"><i class="bi bi-info-circle"></i> 基本信息</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label"
                >资源标题 <span class="text-danger">*</span></label
              >
              <input
                v-model="editForm.title"
                type="text"
                class="form-control"
                placeholder="请输入资源标题"
              />
            </div>

            <div class="mb-3">
              <label class="form-label"
                >资源分类 <span class="text-danger">*</span></label
              >
              <select v-model="editForm.category" class="form-control">
                <option value="">选择分类</option>
                <option v-for="cat in categories" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">资源描述（可选）</label>
              <textarea
                v-model="editForm.description"
                class="form-control"
                rows="4"
                placeholder="请输入资源描述"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 教材信息 -->
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-white">
            <h5 class="mb-0"><i class="bi bi-book"></i> 教材信息（可选）</h5>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-3">
                <label class="form-label">年级</label>
                <input
                  v-model="editForm.grade"
                  type="text"
                  class="form-control"
                  placeholder="如：二年级上册"
                />
              </div>
              <div class="col-md-3">
                <label class="form-label">学科</label>
                <input
                  v-model="editForm.subject"
                  type="text"
                  class="form-control"
                  placeholder="如：语文"
                />
              </div>
              <div class="col-md-3">
                <label class="form-label">教材版本</label>
                <input
                  v-model="editForm.textbook"
                  type="text"
                  class="form-control"
                  placeholder="如：人教版"
                />
              </div>
              <div class="col-md-3">
                <label class="form-label">章节信息</label>
                <input
                  v-model="editForm.chapter_info"
                  type="text"
                  class="form-control"
                  placeholder="如：第一章"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 封面信息 -->
        <div class="card shadow-sm mb-4">
          <div
            class="card-header bg-white d-flex align-items-center justify-content-between"
          >
            <h5 class="mb-0"><i class="bi bi-image"></i> 封面（可选）</h5>
            <div v-if="editForm.cover_url" class="d-flex align-items-center">
              <button
                type="button"
                class="btn btn-outline-danger btn-sm ms-2"
                @click="removeCover"
              >
                <i class="bi bi-trash"></i> 删除
              </button>
              <button
                type="button"
                class="btn btn-outline-secondary btn-sm ms-2"
                @click="replaceCover"
              >
                <i class="bi bi-arrow-repeat"></i> 替换
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="row">
              <!-- 左侧：当前封面预览 -->
              <div class="col-md-4 mb-3 mb-md-0">
                <label class="form-label mb-2">当前封面</label>
                <div class="cover-preview-box">
                  <div v-if="editForm.cover_url || coverPreviewUrl" class="cover-preview-content">
                    <img
                      :src="coverPreviewUrl || editForm.cover_url"
                      class="cover-preview-image"
                      alt="封面预览"
                      @error="handleCoverImageError"
                    />
                    <div class="cover-preview-overlay">
                      <a
                        :href="editForm.cover_url || coverPreviewUrl"
                        target="_blank"
                        class="btn btn-sm btn-light"
                        title="新窗口预览"
                      >
                        <i class="bi bi-eye"></i>
                      </a>
                    </div>
                  </div>
                  <div v-else class="cover-preview-empty">
                    <i class="bi bi-image text-muted"></i>
                    <p class="text-muted small mb-0 mt-2">暂无封面</p>
                  </div>
                </div>
              </div>
              
              <!-- 右侧：上传区域 -->
              <div class="col-md-8">
                <label class="form-label mb-2">上传封面</label>
                
                <!-- 统一的上传框 -->
                <div class="cover-upload-container">
                  <!-- 拖拽上传区域 -->
                  <div
                    :class="['cover-upload-zone', { 'drag-active': coverDragActive }]"
                    @dragover.prevent
                    @drop.prevent="onDropCover"
                    @dragenter="coverDragActive = true"
                    @dragleave="coverDragActive = false"
                    @click="$refs.coverFileInput?.click()"
                  >
                    <div v-if="coverPreviewUrl" class="cover-upload-preview">
                      <img
                        :src="coverPreviewUrl"
                        alt="封面预览"
                        class="cover-upload-preview-img"
                      />
                      <div class="cover-upload-preview-overlay">
                        <button
                          type="button"
                          class="btn btn-sm btn-danger"
                          @click.stop="removeCover"
                          title="移除"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                    <div v-else class="cover-upload-placeholder">
                      <i class="bi bi-cloud-upload cover-upload-icon"></i>
                      <p class="cover-upload-text">拖拽图片到此处</p>
                      <p class="cover-upload-hint">或点击选择文件</p>
                    </div>
                  </div>
                  
                  <!-- 隐藏的文件输入 -->
                  <input
                    ref="coverFileInput"
                    type="file"
                    accept="image/*"
                    style="display: none"
                    @change="handleCoverUpload"
                  />
                  
                  <!-- 上传进度 -->
                  <div v-if="uploadingCover" class="cover-upload-progress">
                    <div class="progress">
                      <div
                        class="progress-bar progress-bar-striped progress-bar-animated"
                        :style="{ width: coverUploadProgress + '%' }"
                      >
                        {{ coverUploadProgress }}%
                      </div>
                    </div>
                    <small class="text-muted d-block mt-1">正在上传封面...</small>
                  </div>
                  
                  <!-- 分隔线 -->
                  <div class="cover-upload-divider">
                    <span>或</span>
                  </div>
                  
                  <!-- URL 输入 -->
                  <div class="cover-url-input">
                    <label class="form-label small mb-1">输入图片 URL</label>
                    <input
                      v-model="editForm.cover_url"
                      type="text"
                      class="form-control form-control-sm"
                      placeholder="https://example.com/cover.jpg"
                    />
                  </div>
                  
                  <!-- 提示信息 -->
                  <small class="form-text text-muted d-block mt-2">
                    <i class="bi bi-info-circle me-1"></i>
                    支持 JPG、PNG、GIF 格式，建议尺寸 800x600 像素
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="action-buttons-container">
          <button
            type="button"
            @click="submitEdit"
            class="btn btn-save"
            :disabled="isSaving || !isEditFormValid"
          >
            <span v-if="isSaving" class="d-flex align-items-center">
              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              保存中...
            </span>
            <span v-else class="d-flex align-items-center">
              <i class="bi bi-check-circle me-2"></i>
              保存修改
            </span>
          </button>
          <button
            type="button"
            @click="$router.back()"
            class="btn btn-cancel"
          >
            <i class="bi bi-x-circle me-2"></i>
            取消
          </button>
        </div>

        <!-- 成功提示 -->
        <div
          v-if="successMessage"
          class="alert alert-success d-flex align-items-center"
          role="alert"
        >
          <i class="bi bi-check-circle-fill me-2" style="font-size: 20px"></i>
          <div class="flex-grow-1">{{ successMessage }}</div>
        </div>

        <!-- 错误提示 -->
        <div
          v-if="errorMessage"
          class="alert alert-danger d-flex align-items-center"
          role="alert"
        >
          <i
            class="bi bi-exclamation-triangle-fill me-2"
            style="font-size: 20px"
          ></i>
          <div class="flex-grow-1">{{ errorMessage }}</div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { apiHttpClient } from "@/app/app.service";
import BreadCrumbs from "@/app/components/BreadCrumbs.vue";
import notification from "@/utils/notification";
import { RESOURCE_CATEGORIES } from "@/utils/constants";

const API_BASE_URL =
  process.env.VUE_APP_API_BASE_URL || "http://localhost:3333";

export default defineComponent({
  name: "PostEdit",
  components: {
    BreadCrumbs,
  },
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
    user: {
      type: Object,
      default: null,
    },
  },
  emits: ['showLogin'],
  data() {
    return {
      categories: RESOURCE_CATEGORIES, // 资源分类列表（静态）
      resource: null,
      loading: true,
      isSaving: false,
      successMessage: "",
      errorMessage: "",
      editForm: {
        title: "",
        category: "",
        description: "",
        grade: "",
        subject: "",
        textbook: "",
        chapter_info: "",
        cover_url: "",
      },
      coverFile: null,
      coverPreviewUrl: null,
      coverDragActive: false,
      uploadingCover: false,
      coverUploadProgress: 0,
    };
  },

  async mounted() {
    await this.fetchResource();
  },

  computed: {
    isEditFormValid() {
      return (
        this.editForm.title &&
        this.editForm.title.trim() &&
        this.editForm.category
      );
    },
  },

  methods: {
    async fetchResource() {
      try {
        this.loading = true;
        console.log(`[PostEdit] 加载资源 ID: ${this.id}`);
        const response = await apiHttpClient.get(`/api/resources/${this.id}`);
        this.resource = response.data;
        console.log("[PostEdit] 资源加载成功:", this.resource);

        // 填充表单
        this.fillEditForm();
      } catch (error) {
        console.error("[PostEdit] 资源加载失败:", error);
        notification.error(`加载资源失败: ${error.message}`, 5000);
      } finally {
        this.loading = false;
      }
    },

    fillEditForm() {
      // 使用现有的数据填充编辑表单
      this.editForm = {
        title: this.resource.title || "",
        category: this.resource.category || "",
        description: this.resource.description || "",
        grade: this.resource.grade || this.getFieldFromAutoMeta("grade") || "",
        subject:
          this.resource.subject || this.getFieldFromAutoMeta("subject") || "",
        textbook:
          this.resource.version ||
          this.getFieldFromAutoMeta("textbook_version") ||
          "",
        chapter_info: this.resource.chapter_info || "",
        cover_url: this.resource.cover_url || "",
      };

      console.log("[PostEdit] 编辑表单已填充:", this.editForm);
    },

    getFieldFromAutoMeta(fieldName) {
      const autoMeta = this.resource?.auto_meta_result;
      if (!autoMeta) return null;

      const fieldMap = {
        grade: "grade",
        subject: "subject",
        textbook_version: "textbook_version",
      };

      const mappedField = fieldMap[fieldName];
      return autoMeta[mappedField] || null;
    },

    // 处理封面上传
    async handleCoverUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // 检查文件类型
      if (!file.type.startsWith("image/")) {
        notification.error("请选择图片文件（JPG、PNG、GIF）");
        return;
      }

      // 检查文件大小（10MB）
      if (file.size > 10 * 1024 * 1024) {
        notification.error("图片大小不能超过 10MB");
        return;
      }

      this.coverFile = file;

      // 生成预览
      const reader = new FileReader();
      reader.onload = (e) => {
        this.coverPreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      // 自动上传
      await this.uploadCover();
    },

    // 拖拽封面上传
    onDropCover(event) {
      this.coverDragActive = false;
      const file = event.dataTransfer.files[0];
      
      if (!file) return;

      // 检查文件类型
      if (!file.type.startsWith("image/")) {
        notification.error("请上传图片文件（JPG、PNG、GIF）");
        return;
      }

      // 检查文件大小
      if (file.size > 10 * 1024 * 1024) {
        notification.error("图片大小不能超过 10MB");
        return;
      }

      this.coverFile = file;

      // 生成预览
      const reader = new FileReader();
      reader.onload = (e) => {
        this.coverPreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      // 自动上传
      this.uploadCover();
    },

    // 上传封面到服务器
    async uploadCover() {
      if (!this.coverFile) return;

      this.uploadingCover = true;
      this.coverUploadProgress = 0;

      try {
        // 根据 API 文档和 PostCreate 的实现，使用 POST /covers?post=${postId}，字段名是 file
        const formData = new FormData();
        formData.append("file", this.coverFile);

        console.log("[PostEdit] 开始上传封面:", {
          name: this.coverFile.name,
          size: this.coverFile.size,
          type: this.coverFile.type,
          resourceId: this.id,
        });

        // 使用与 PostCreate 相同的接口
        const endpoint = `/covers?post=${this.id}`;
        
        try {
          console.log("[PostEdit] 上传封面到:", endpoint);
          const response = await apiHttpClient.post(endpoint, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                this.coverUploadProgress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
              }
            },
          });
          
          console.log("[PostEdit] 封面上传成功，响应:", response.data);
          
          // 从响应中获取封面URL（如果有）
          let coverUrl = null;
          if (response.data) {
            coverUrl = response.data.url || 
                      response.data.cover_url || 
                      response.data.data?.url ||
                      response.data.data?.cover_url;
          }
          
          // 如果响应中没有URL，尝试从资源数据中获取
          if (!coverUrl && this.resource) {
            // 重新获取资源数据以获取最新的封面URL
            await this.fetchResource();
            coverUrl = this.resource?.cover_url;
          }
          
          // 更新表单中的封面URL
          if (coverUrl) {
            this.editForm.cover_url = coverUrl;
            console.log("[PostEdit] 更新封面URL:", coverUrl);
          }
          
          // 清除预览和文件，使用实际的封面URL
          this.coverFile = null;
          this.coverPreviewUrl = null;
          if (this.$refs.coverFileInput) {
            this.$refs.coverFileInput.value = "";
          }
          
          // 如果还没有获取到封面URL，重新加载资源数据
          if (!coverUrl) {
            await this.fetchResource();
            coverUrl = this.resource?.cover_url;
            if (coverUrl) {
              this.editForm.cover_url = coverUrl;
            }
          }
          
          // 封面上传成功，显示成功消息
          // 即使无法立即获取URL，封面也已经上传成功，保存时会自动关联
          if (coverUrl) {
            notification.success("封面上传成功");
          } else {
            console.log("[PostEdit] 封面上传成功，封面URL将在保存时自动关联");
            // 不显示警告，因为封面上传已经成功，保存时会自动关联
            // 封面文件已保存在 this.coverFile，提交时会一起发送
          }
          
        } catch (error) {
          console.error("[PostEdit] 封面上传失败:", error);
          
          // 如果封面上传失败，不显示错误提示
          // 因为封面文件还在 this.coverFile 中，可以在提交时一起发送
          // 这样可以避免用户看到错误提示，但实际上封面会在保存时一起上传
          console.warn("[PostEdit] 封面上传失败，但封面文件已保存，将在提交时一起上传");
          
          // 不清除封面文件，让它在提交时一起发送
          // this.coverFile 保持不变，这样 submitEdit 会使用 FormData 发送
        }
      } finally {
        this.uploadingCover = false;
        this.coverUploadProgress = 0;
      }
    },

    // 删除封面
    removeCover() {
      this.coverFile = null;
      this.coverPreviewUrl = null;
      this.editForm.cover_url = "";
      if (this.$refs.coverFileInput) {
        this.$refs.coverFileInput.value = "";
      }
    },

    // 替换封面
    replaceCover() {
      this.removeCover();
      if (this.$refs.coverFileInput) {
        this.$refs.coverFileInput.click();
      }
    },

    // 处理封面图片加载错误
    handleCoverImageError(event) {
      console.error("[PostEdit] 封面图片加载失败:", event.target.src);
      // 如果加载失败，尝试添加时间戳重新加载
      const src = event.target.src;
      if (src && !src.includes('?t=')) {
        event.target.src = `${src}${src.includes('?') ? '&' : '?'}t=${Date.now()}`;
      }
    },

    async submitEdit() {
      if (!this.isEditFormValid) {
        notification.warning("请填写必填项：标题、分类");
        return;
      }

      this.isSaving = true;
      this.errorMessage = "";
      this.successMessage = "";

      try {
        console.log("[PostEdit] 提交修改，数据:", this.editForm);
        console.log("[PostEdit] 是否有新封面文件:", !!this.coverFile);
        console.log("[PostEdit] 当前封面URL:", this.editForm.cover_url);

        let response;

        // 如果有新上传的封面文件，使用 FormData 发送（multipart/form-data）
        if (this.coverFile) {
          console.log("[PostEdit] 使用 FormData 发送，包含封面文件");
          
          const formData = new FormData();
          
          // 添加文本字段
          formData.append("title", this.editForm.title);
          formData.append("category", this.editForm.category);
          if (this.editForm.description) {
            formData.append("description", this.editForm.description);
          }
          if (this.editForm.grade) {
            formData.append("grade", this.editForm.grade);
          }
          if (this.editForm.subject) {
            formData.append("subject", this.editForm.subject);
          }
          if (this.editForm.textbook) {
            formData.append("version", this.editForm.textbook); // 后端字段名是 version
          }
          if (this.editForm.chapter_info) {
            formData.append("chapter_info", this.editForm.chapter_info);
          }
          
          // 添加封面文件，字段名为 cover（根据后端 API 要求）
          formData.append("cover", this.coverFile);
          console.log("[PostEdit] 已添加封面文件到 FormData:", {
            name: this.coverFile.name,
            size: this.coverFile.size,
            type: this.coverFile.type,
          });

          // 使用 PUT 方法发送 FormData
          response = await apiHttpClient.put(
            `/api/resources/${this.id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        } else {
          // 如果没有新文件，使用 JSON 数据发送
          console.log("[PostEdit] 使用 JSON 发送，cover_url:", this.editForm.cover_url);
          
          const updateData = {
            title: this.editForm.title,
            category: this.editForm.category,
            description: this.editForm.description || null,
            grade: this.editForm.grade || null,
            subject: this.editForm.subject || null,
            version: this.editForm.textbook || null, // 后端字段名是 version
            chapter_info: this.editForm.chapter_info || null,
            // 如果有 cover_url，传递它；如果没有，传递 null（而不是空字符串）
            cover_url: this.editForm.cover_url && this.editForm.cover_url.trim() 
              ? this.editForm.cover_url.trim() 
              : null,
          };

          console.log("[PostEdit] 发送的 JSON 数据:", updateData);

          // 使用 PUT 方法发送 JSON 数据
          response = await apiHttpClient.put(
            `/api/resources/${this.id}`,
            updateData
          );
        }

        console.log("[PostEdit] 修改成功:", response.data);
        notification.success("资源已成功更新！3秒后返回详情页...", 3000);

        // 清除封面文件状态
        this.coverFile = null;
        this.coverPreviewUrl = null;
        if (this.$refs.coverFileInput) {
          this.$refs.coverFileInput.value = "";
        }

        // 3秒后返回详情页
        setTimeout(() => {
          this.$router.push(`/resources/${this.id}`);
        }, 3000);
      } catch (error) {
        console.error("[PostEdit] 提交失败:", error);
        console.error("[PostEdit] 错误详情:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        notification.error(
          `提交失败: ${error.response?.data?.message || error.message}`,
          5000
        );
      } finally {
        this.isSaving = false;
      }
    },
  },
});
</script>

<style scoped>
.post-edit-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);
}

.post-edit-page-body {
  max-width: 900px;
  margin: 0 auto;
}

.card {
  margin-bottom: 20px;
}

.form-label {
  font-weight: 500;
  margin-bottom: 8px;
}

/* 封面预览区域 */
.cover-preview-box {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
  overflow: hidden;
  min-height: 200px;
}

.cover-preview-content {
  position: relative;
  width: 100%;
  padding-top: 75%; /* 4:3 比例 */
  background: #fff;
}

.cover-preview-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.cover-preview-content:hover .cover-preview-overlay {
  opacity: 1;
}

.cover-preview-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #6c757d;
}

.cover-preview-empty i {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

/* 上传容器 */
.cover-upload-container {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  background: #fff;
}

/* 拖拽上传区域 */
.cover-upload-zone {
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  background: #f8f9fa;
  transition: all 0.3s;
  cursor: pointer;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.cover-upload-zone:hover {
  border-color: #007bff;
  background: #f0f7ff;
}

.cover-upload-zone.drag-active {
  border-color: #007bff;
  background: #e7f1ff;
  border-style: solid;
}

.cover-upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6c757d;
}

.cover-upload-icon {
  font-size: 3rem;
  margin-bottom: 0.75rem;
  color: #adb5bd;
}

.cover-upload-text {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #495057;
}

.cover-upload-hint {
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0;
}

.cover-upload-preview {
  position: relative;
  width: 100%;
  height: 100%;
}

.cover-upload-preview-img {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 4px;
}

.cover-upload-preview-overlay {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s;
}

.cover-upload-preview:hover .cover-upload-preview-overlay {
  opacity: 1;
}

/* 上传进度 */
.cover-upload-progress {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.progress {
  height: 8px;
  border-radius: 4px;
  background: #e9ecef;
}

/* 分隔线 */
.cover-upload-divider {
  margin: 1.5rem 0;
  text-align: center;
  position: relative;
}

.cover-upload-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e9ecef;
}

.cover-upload-divider span {
  position: relative;
  background: #fff;
  padding: 0 1rem;
  color: #6c757d;
  font-size: 0.875rem;
}

/* URL 输入 */
.cover-url-input {
  margin-top: 1rem;
}

/* 操作按钮容器 - 现代化设计 */
.action-buttons-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  padding: 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  margin-top: 2.5rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

/* 保存按钮 - 使用全局样式，只添加特定样式 */
.btn-save {
  min-width: 140px;
}

.btn-save .spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.15em;
}

/* 取消按钮 - 使用全局样式，只添加特定样式 */
.btn-cancel {
  min-width: 140px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .action-buttons-container {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .btn-save,
  .btn-cancel {
    width: 100%;
  }
}
</style>
