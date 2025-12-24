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
          <div class="card-header bg-white">
            <h5 class="mb-0"><i class="bi bi-image"></i> 资源封面</h5>
          </div>
          <div class="card-body">
            <div v-if="editForm.cover_url" class="cover-preview-container mb-3">
              <div class="cover-preview">
                <img
                  :src="getCoverUrl(editForm.cover_url)"
                  class="cover-image"
                  alt="封面预览"
                  @error="handleImageError"
                />
                <div class="cover-actions">
                  <button
                    type="button"
                    class="btn btn-sm btn-light"
                    @click="previewCover"
                    title="预览"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-light"
                    @click="$refs.coverInput.click()"
                    title="替换"
                  >
                    <i class="bi bi-arrow-repeat"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-danger"
                    @click="removeCover"
                    title="删除"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>

            <div v-else class="upload-area" @click="$refs.coverInput.click()">
              <i class="bi bi-cloud-upload upload-icon"></i>
              <p class="mb-1">点击上传封面图片</p>
              <small class="text-muted">支持 JPG、PNG 格式，建议尺寸 800x600</small>
            </div>

            <input
              ref="coverInput"
              type="file"
              class="d-none"
              accept="image/*"
              @change="handleCoverUpload"
            />

            <div v-if="coverUploading" class="mt-2">
              <div class="progress">
                <div
                  class="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  :style="{ width: coverUploadProgress + '%' }"
                >
                  {{ coverUploadProgress }}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 资源文件信息 -->
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-white">
            <h5 class="mb-0"><i class="bi bi-file-earmark"></i> 资源文件</h5>
          </div>
          <div class="card-body">
            <div v-if="resource.file_url" class="file-info-container">
              <div class="file-info">
                <div class="file-icon">
                  <i :class="getFileIcon(resource.format)"></i>
                </div>
                <div class="file-details">
                  <div class="file-name">{{ resource.filename || '资源文件' }}</div>
                  <div class="file-meta">
                    <span class="badge bg-secondary me-2">{{ resource.format }}</span>
                    <span class="text-muted">{{ formatFileSize(resource.size) }}</span>
                  </div>
                </div>
                <div class="file-actions">
                  <a
                    :href="getFileUrl(resource.file_url)"
                    target="_blank"
                    class="btn btn-sm btn-outline-primary me-2"
                    title="预览/下载"
                  >
                    <i class="bi bi-eye"></i> 预览
                  </a>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-secondary"
                    @click="$refs.fileInput.click()"
                    title="替换文件"
                  >
                    <i class="bi bi-arrow-repeat"></i> 替换
                  </button>
                </div>
              </div>
            </div>

            <input
              ref="fileInput"
              type="file"
              class="d-none"
              @change="handleFileUpload"
            />

            <div v-if="fileUploading" class="mt-3">
              <div class="progress">
                <div
                  class="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  :style="{ width: fileUploadProgress + '%' }"
                >
                  {{ fileUploadProgress }}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="mb-4 d-flex gap-3">
          <button
            type="button"
            @click="submitEdit"
            class="btn btn-primary btn-lg px-5"
            :disabled="isSaving || !isEditFormValid"
          >
            <i class="bi bi-check-circle me-2"></i>
            {{ isSaving ? "保存中..." : "保存修改" }}
          </button>
          <button
            type="button"
            @click="$router.back()"
            class="btn btn-outline-secondary btn-lg px-5"
          >
            <i class="bi bi-x-circle me-2"></i>取消
          </button>
        </div>
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
  },
  data() {
    return {
      categories: RESOURCE_CATEGORIES, // 资源分类列表（静态）
      resource: null,
      loading: true,
      isSaving: false,
      successMessage: "",
      errorMessage: "",
      coverUploading: false,
      coverUploadProgress: 0,
      fileUploading: false,
      fileUploadProgress: 0,
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

    getCoverUrl(url) {
      if (!url) return "";
      if (url.startsWith("http")) return url;
      return `${API_BASE_URL}${url}`;
    },

    getFileUrl(url) {
      if (!url) return "";
      if (url.startsWith("http")) return url;
      return `${API_BASE_URL}${url}`;
    },

    getFileIcon(format) {
      const iconMap = {
        pdf: "bi bi-file-pdf-fill text-danger",
        doc: "bi bi-file-word-fill text-primary",
        docx: "bi bi-file-word-fill text-primary",
        ppt: "bi bi-file-ppt-fill text-warning",
        pptx: "bi bi-file-ppt-fill text-warning",
        xls: "bi bi-file-excel-fill text-success",
        xlsx: "bi bi-file-excel-fill text-success",
        zip: "bi bi-file-zip-fill text-secondary",
        rar: "bi bi-file-zip-fill text-secondary",
      };
      return iconMap[format?.toLowerCase()] || "bi bi-file-earmark-fill";
    },

    formatFileSize(bytes) {
      if (!bytes) return "未知大小";
      const mb = bytes / (1024 * 1024);
      return mb.toFixed(2) + " MB";
    },

    handleImageError(e) {
      e.target.src = "https://via.placeholder.com/400x300?text=封面加载失败";
    },

    previewCover() {
      window.open(this.getCoverUrl(this.editForm.cover_url), "_blank");
    },

    removeCover() {
      if (confirm("确定要删除封面吗？")) {
        this.editForm.cover_url = "";
        notification.info("封面已删除，记得保存修改");
      }
    },

    async handleCoverUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // 验证文件类型
      if (!file.type.startsWith("image/")) {
        notification.error("请选择图片文件");
        return;
      }

      // 验证文件大小（限制5MB）
      if (file.size > 5 * 1024 * 1024) {
        notification.error("封面图片不能超过5MB");
        return;
      }

  border-radius: 8px;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px 8px 0 0;
}

.card-header h5 {
  color: white;
  margin: 0;
}

.form-label {
  font-weight: 500;
  margin-bottom: 8px;
}

/* 封面预览容器 */
.cover-preview-container {
  display: flex;
  justify-content: center;
}

.cover-preview {
  position: relative;
  width: 400px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cover-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  display: block;
}

.cover-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
}

.cover-actions .btn {
  opacity: 0.9;
  backdrop-filter: blur(5px);
}

.cover-actions .btn:hover {
  opacity: 1;
}

/* 上传区域 */
.upload-area {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 60px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-area:hover {
  border-color: #667eea;
  background-color: #f8f9ff;
}

.upload-icon {
  font-size: 4rem;
  color: #667eea;
  margin-bottom: 1rem;
}

/* 文件信息容器 */
.file-info-container {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.file-details {
  flex-grow: 1;
}

.file-name {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.file-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.file-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

/* 按钮样式统一 */
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  font-weight: 500;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-outline-secondary {
  border-color: #6c757d;
  color: #6c757d;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  color: white;
  transform: translateY(-1px);
}

.gap-3 {
  gap: 1rem;
}

/* 进度条 */
.progress {
  height: 24px;
  border-radius: 12px;
}

.progress-bar {
  font-weight: 600
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              this.coverUploadProgress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
            },
          }
        );

        this.editForm.cover_url = response.data.cover_url;
        notification.success("封面上传成功！");
      } catch (error) {
        console.error("[PostEdit] 封面上传失败:", error);
        notification.error(
          error.response?.data?.message || "封面上传失败，请重试"
        );
      } finally {
        this.coverUploading = false;
        event.target.value = ""; // 清空input
      }
    },

    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // 验证文件大小（限制100MB）
      if (file.size > 100 * 1024 * 1024) {
        notification.error("文件不能超过100MB");
        return;
      }

      if (
        !confirm(
          `确定要替换当前资源文件吗？\n新文件：${file.name}\n大小：${this.formatFileSize(file.size)}`
        )
      ) {
        return;
      }

      this.fileUploading = true;
      this.fileUploadProgress = 0;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await apiHttpClient.post(
          `/api/resources/${this.id}/file`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              this.fileUploadProgress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
            },
          }
        );

        // 更新资源文件信息
        this.resource.file_url = response.data.file_url;
        this.resource.filename = response.data.filename;
        this.resource.format = response.data.format;
        this.resource.size = response.data.size;

        notification.success("资源文件替换成功！");
      } catch (error) {
        console.error("[PostEdit] 文件上传失败:", error);
        notification.error(
          error.response?.data?.message || "文件上传失败，请重试"
        );
      } finally {
        this.fileUploading = false;
        event.target.value = ""; // 清空input
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

        const updateData = {
          title: this.editForm.title,
          category: this.editForm.category,
          description: this.editForm.description,
          grade: this.editForm.grade || null,
          subject: this.editForm.subject || null,
          version: this.editForm.textbook || null, // 后端字段名是 version
          chapter_info: this.editForm.chapter_info || null,
          cover_url: this.editForm.cover_url || null,
        };

        // 尝试 PUT 方法（后端可能使用 PUT 而不是 PATCH）
        const response = await apiHttpClient.put(
          `/api/resources/${this.id}`,
          updateData
        );

        console.log("[PostEdit] 修改成功:", response.data);
        notification.success("资源已成功更新！3秒后返回详情页...", 3000);

        // 3秒后返回详情页
        setTimeout(() => {
          this.$router.push(`/resources/${this.id}`);
        }, 3000);
      } catch (error) {
        console.error("[PostEdit] 提交失败:", error);
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

.img-thumbnail {
  max-height: 200px;
  object-fit: cover;
}
</style>
