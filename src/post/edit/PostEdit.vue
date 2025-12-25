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
              <div class="col-md-4">
                <div v-if="editForm.cover_url" class="mb-3 text-center">
                  <img
                    :src="editForm.cover_url"
                    class="img-thumbnail img-fluid mb-2"
                    alt="封面"
                  />
                  <div>
                    <a
                      :href="editForm.cover_url"
                      target="_blank"
                      class="btn btn-link btn-sm"
                      >新窗口预览</a
                    >
                  </div>
                </div>
                <div
                  v-else
                  class="mb-3 text-center text-muted"
                  style="
                    height: 120px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px dashed #ccc;
                    border-radius: 8px;
                  "
                >
                  <span>暂无封面</span>
                </div>
              </div>
              <div class="col-md-8">
                <div class="mb-3">
                  <label class="form-label">封面图片</label>
                  
                  <!-- 拖拽上传区域 -->
                  <div
                    :class="['cover-upload-zone', { 'drag-active': coverDragActive }]"
                    @dragover.prevent
                    @drop.prevent="onDropCover"
                    @dragenter="coverDragActive = true"
                    @dragleave="coverDragActive = false"
                  >
                    <div v-if="coverFile || coverPreviewUrl" class="cover-preview">
                      <img
                        :src="coverPreviewUrl || editForm.cover_url"
                        alt="封面预览"
                        class="cover-preview-img"
                      />
                      <div class="cover-preview-actions">
                        <button
                          type="button"
                          class="btn btn-sm btn-outline-danger"
                          @click="removeCover"
                        >
                          <i class="bi bi-trash"></i> 移除
                        </button>
                      </div>
                    </div>
                    <div v-else class="cover-upload-placeholder">
                      <i class="bi bi-cloud-upload display-4 text-muted"></i>
                      <p class="mt-2 mb-1">将封面图片拖放到这里</p>
                      <p class="text-muted small">或点击下方按钮选择文件</p>
                    </div>
                  </div>
                  
                  <input
                    ref="coverFileInput"
                    type="file"
                    accept="image/*"
                    class="form-control mt-2"
                    style="max-width: 300px"
                    @change="handleCoverUpload"
                  />
                  
                  <div class="d-flex align-items-center mt-2 mb-2">
                    <span class="me-2">或输入图片 URL：</span>
                    <input
                      v-model="editForm.cover_url"
                      type="text"
                      class="form-control"
                      placeholder="https://example.com/cover.jpg"
                      style="max-width: 300px"
                    />
                  </div>
                  
                  <div v-if="uploadingCover" class="mt-2">
                    <div class="progress">
                      <div
                        class="progress-bar progress-bar-striped progress-bar-animated"
                        :style="{ width: coverUploadProgress + '%' }"
                      >
                        {{ coverUploadProgress }}%
                      </div>
                    </div>
                    <small class="text-muted">正在上传封面...</small>
                  </div>
                  
                  <small class="form-text text-muted d-block mt-2"
                    >支持 JPG、PNG、GIF 格式，建议尺寸 800x600 像素</small
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="mb-4">
          <button
            type="button"
            @click="submitEdit"
            class="btn btn-primary btn-lg"
            :disabled="isSaving || !isEditFormValid"
          >
            {{ isSaving ? "保存中..." : "保存修改" }}
          </button>
          <button
            type="button"
            @click="$router.back()"
            class="btn btn-secondary btn-lg ms-2"
          >
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
        const formData = new FormData();
        formData.append("file", this.coverFile);
        formData.append("type", "cover");

        console.log("[PostEdit] 开始上传封面:", {
          name: this.coverFile.name,
          size: this.coverFile.size,
          type: this.coverFile.type,
        });

        // 尝试多个可能的上传接口
        let response;
        const uploadEndpoints = [
          "/api/upload/cover",
          "/upload/cover",
          "/api/upload",
          "/upload",
          `/api/resources/${this.id}/cover`,
          `/covers?post=${this.id}`,
        ];

        for (const endpoint of uploadEndpoints) {
          try {
            console.log("[PostEdit] 尝试上传接口:", endpoint);
            response = await apiHttpClient.post(endpoint, formData, {
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
            console.log("[PostEdit] 上传成功，响应:", response.data);
            break;
          } catch (error) {
            console.log("[PostEdit] 接口失败:", endpoint, error.response?.status);
            if (error.response?.status === 404) {
              continue;
            }
            throw error;
          }
        }

        if (!response) {
          throw new Error("所有上传接口都失败");
        }

        // 获取封面URL
        const coverUrl =
          response.data.url ||
          response.data.cover_url ||
          response.data.path ||
          response.data.file_url ||
          response.data.data?.url ||
          response.data.data?.cover_url;

        if (coverUrl) {
          this.editForm.cover_url = coverUrl;
          notification.success("封面上传成功");
        } else {
          console.error("[PostEdit] 上传响应中没有找到URL:", response.data);
          notification.warning("上传成功但未获取到文件URL");
        }
      } catch (error) {
        console.error("[PostEdit] 封面上传失败:", error);
        notification.error(
          error.response?.data?.message || "封面上传失败，请重试"
        );
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

    async submitEdit() {
      if (!this.isEditFormValid) {
        notification.warning("请填写必填项：标题、分类");
        return;
      }

      // 如果有新上传的封面文件但还没上传完成，先上传
      if (this.coverFile && !this.editForm.cover_url) {
        await this.uploadCover();
        // 等待一下确保上传完成
        await new Promise((resolve) => setTimeout(resolve, 500));
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
  border-radius: 8px;
}

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
}

.cover-upload-zone.drag-active {
  border-color: #007bff;
  background: #e7f1ff;
}

.cover-upload-placeholder {
  color: #6c757d;
}

.cover-preview {
  position: relative;
  display: inline-block;
}

.cover-preview-img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cover-preview-actions {
  margin-top: 1rem;
}

.progress {
  height: 8px;
  border-radius: 4px;
}
</style>
