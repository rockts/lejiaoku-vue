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
                <option>教材</option>
                <option>课件</option>
                <option>教案</option>
                <option>教辅</option>
                <option>其他</option>
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
            <h5 class="mb-0"><i class="bi bi-image"></i> 封面 URL（可选）</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-4">
                <div v-if="editForm.cover_url" class="mb-3">
                  <img
                    :src="editForm.cover_url"
                    class="img-thumbnail img-fluid"
                    alt="封面"
                  />
                </div>
              </div>
              <div class="col-md-8">
                <div class="mb-3">
                  <label class="form-label">封面 URL</label>
                  <input
                    v-model="editForm.cover_url"
                    type="text"
                    class="form-control"
                    placeholder="https://example.com/cover.jpg"
                  />
                  <small class="form-text text-muted">输入图片 URL 地址</small>
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
