<template>
  <BreadCrumbs />
  <div class="post-create-page">
    <div class="container post-create-page-body">
      <form>
        <div class="create-post-title mb-3">
          <label class="sr-only" for="id_name">资源标题</label>
          <input
            v-model="title"
            placeholder="请输入资源标题..."
            type="text"
            class=""
          />

          <div class="upload-cover">
            <div
              :class="['drag-zone', { active: dragZoneActive }]"
              @dragover.prevent
              @drop.prevent="onDropDragZone"
              @dragenter="dragZoneActive = true"
              @dragleave="dragZoneActive = false"
            >
              <div v-if="coverUploadProgress">
                <span class="cover-upload-progress">
                  {{ coverUploadProgress + "%" }}
                </span>
              </div>
              <div v-if="coverPreviewUrl">
                <img
                  class="cover-preview img-fluid"
                  :src="coverPreviewUrl"
                  alt=""
                />
              </div>
              <div v-else>
                <label for="id_cover" class="coverUploadBox">
                  <div class="upload-cover-icons">
                    <p>封面拖放到这里</p>
                    <i class="bi bi-card-image"></i>
                  </div>
                  <p>大小限制: 5 MB</p>
                </label>
              </div>
            </div>

            <!-- 上传封面 input -->
            <div>
              <input
                type="file"
                ref="cover"
                @change="onChangeCover"
                id="id_cover"
                accept="image/png, image/jpg, image/gif, image/jpge"
              />
            </div>
          </div>

          <div class="row create-post-attr mt-2">
            <div class="col-md-3">
              <select class="form-control" v-model="grade">
                <option value="" selected>年级</option>
                <option>一年级上册</option>
                <option>一年级下册</option>
                <option>二年级上册</option>
                <option>二年级下册</option>
                <option>三年级上册</option>
                <option>三年级下册</option>
                <option>四年级上册</option>
                <option>四年级下册</option>
                <option>五年级上册</option>
                <option>五年级下册</option>
                <option>六年级上册</option>
                <option>六年级下册</option>
              </select>
            </div>
            <div class="col-md-3">
              <select class="form-control" v-model="subject">
                <option value="" selected>学科</option>
                <option>语文</option>
                <option>数学</option>
                <option>英语</option>
                <option>道德与法治</option>
                <option>科学</option>
                <option>物理</option>
                <option>化学</option>
                <option>生物</option>
                <option>地理</option>
                <option>历史</option>
                <option>政治</option>
              </select>
            </div>
            <div class="col-md-3">
              <select class="form-control" v-model="version">
                <option value="" selected>版本</option>
                <option>人教版</option>
              </select>
            </div>
            <div class="col-md-3">
              <select class="form-control" v-model="category">
                <option value="" selected>类型</option>
                <option>教材</option>
                <option>课件</option>
                <option>教案</option>
                <option>教辅</option>
                <option>其他</option>
                <ClassificationsOption />
              </select>
            </div>
          </div>
        </div>

        <!-- <input
     v-model="categoryId"
     @keyup.enter="createPost"
     placeholder="输入类型 Id"
     type="text"
    />
    <input
     v-model="grade"
     @keyup.enter="createPost"
     placeholder="输入年级"
     type="text"
    />
    <input
     v-model="subject"
     @keyup.enter="createPost"
     placeholder="输入学科"
     type="text"
    />
    <input
     v-model="version"
     @keyup.enter="createPost"
     placeholder="输入版本"
     type="text"
    /> -->

        <div class="mb-3 input-description">
          <label>资源介绍：</label>
          <textarea
            v-model="description"
            rows="5"
            tag="textarea"
            placeholder="请输入资源说明..."
          />
        </div>

        <div class="uplopadFile">
          <label>资源文件：</label>
          <input
            type="file"
            ref="file"
            @change="onChangeFile"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
        application/pdf,
        application/msword,
        application/vnd.ms-excel,
        application/vnd.ms-powerpoint,
        application/vnd.openxmlformats-officedocument.wordprocessingml.document,
        application/vnd.openxmlformats-officedocument.presentationml.presentation"
          />
        </div>

        <div class="post-create-page-btn">
          <button
            type="button"
            @click="createPost"
            class="btn btn-primary btn-large"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "提交中..." : "发布资源" }}
          </button>
        </div>

        <!-- 成功提示 -->
        <div
          v-if="successMessage"
          class="alert alert-success mt-3"
          role="alert"
        >
          {{ successMessage }}
        </div>

        <!-- 错误提示 -->
        <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { apiHttpClient } from "@/app/app.service";
import { defineComponent } from "vue";
import BreadCrumbs from "@/app/components/BreadCrumbs.vue";
import ClassificationsOption from "@/classifications/index/components/ClassificationsOption.vue";

export default defineComponent({
  title() {
    return "发布资源";
  },
  components: {
    BreadCrumbs,
    ClassificationsOption,
  },
  name: "PostCreate",
  props: {
    user: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      errorMessage: "",
      successMessage: "",
      isSubmitting: false,
      token: "",
      title: "",
      category: "",
      grade: "",
      subject: "",
      version: "",
      description: "",
      file: null,
      cover: null,
      coverPreviewUrl: null,
      coverUploadProgress: null,
      dragZoneActive: false,
    };
  },

  async created() {},

  methods: {
    onChangeFile(event) {
      const file = event.target.files[0];
      if (file) {
        this.file = file;
        console.log("[PostCreate] 选择文件:", {
          name: file.name,
          size: file.size,
          type: file.type,
        });
      }
    },

    onDropDragZone(event) {
      console.log(event.dataTransfer.files);

      this.dragZoneActive = false;

      const cover = event.dataTransfer.files[0];

      if (cover) {
        this.cover = cover;

        // 设置资源标题
        this.title = cover.name.split(".")[0];

        // 生成预览图像
        this.createCoverPreview(cover);
      }
    },
    async createCover(cover, postId) {
      // 创建表单
      const formData = new FormData();

      // 添加字段
      formData.append("file", cover);

      // 上传封面
      try {
        const response = await apiHttpClient.post(
          `/covers?post=${postId}`,
          formData,
          {
            onUploadProgress: (event) => {
              console.log(event);

              const { loaded, total } = event;

              this.coverUploadProgress = Math.round((loaded * 100) / total);
            },
          }
        );

        // 清理
        this.cover = null;
        this.coverPreviewUrl = null;
        this.$refs.cover.value = "";
        this.coverUploadProgress = null;

        console.log(response.data);
      } catch (error) {
        this.errorMessage = error.message;
      }
    },

    // 上传封面预览
    createCoverPreview(cover) {
      const reader = new FileReader();

      reader.readAsDataURL(cover);

      reader.onload = (event) => {
        this.coverPreviewUrl = event.target.result;
      };
    },

    onChangeCover(event) {
      console.log(event.target.files);

      const cover = event.target.files[0];

      if (cover) {
        this.cover = cover;

        // 用封面名作为资源标题
        this.title = cover.name.split(".")[0];

        // 生成预览封面
        this.createCoverPreview(cover);
      }
    },

    async createPost() {
      console.log("[PostCreate] 开始创建资源...");
      console.log("[PostCreate] 当前表单数据:", {
        title: this.title,
        category: this.category,
        grade: this.grade,
        subject: this.subject,
        version: this.version,
        description: this.description,
        hasFile: !!this.file,
        hasCover: !!this.cover,
      });

      // 清空之前的消息
      this.errorMessage = "";
      this.successMessage = "";
      this.isSubmitting = true;

      try {
        // 使用 FormData 上传文件
        const formData = new FormData();

        // 添加元数据字段 - 只添加有值的字段
        formData.append("title", this.title || "未命名资源");

        if (this.category) {
          formData.append("category", this.category);
        }

        if (this.grade) {
          formData.append("grade", this.grade);
        }

        if (this.subject) {
          formData.append("subject", this.subject);
        }

        if (this.version) {
          formData.append("version", this.version);
        }

        if (this.description) {
          formData.append("description", this.description);
        }

        // 添加文件（如果有）
        if (this.file) {
          formData.append("file", this.file);
          console.log("[PostCreate] 上传文件:", {
            name: this.file.name,
            size: this.file.size,
            type: this.file.type,
          });
        } else {
          console.warn("[PostCreate] 没有选择文件，无法上传");
          this.errorMessage = "请选择要上传的文件";
          this.isSubmitting = false;
          return;
        }

        // 添加封面文件（如果有）
        if (this.cover) {
          formData.append("cover", this.cover);
          console.log("[PostCreate] 上传封面:", {
            name: this.cover.name,
            size: this.cover.size,
            type: this.cover.type,
          });
        } else {
          console.log("[PostCreate] 没有选择封面，将使用默认封面");
        }

        // 打印 FormData 内容（调试用）
        console.log("[PostCreate] FormData 内容:");
        for (let pair of formData.entries()) {
          console.log(`  ${pair[0]}:`, pair[1]);
        }

        console.log("[PostCreate] 请求接口: POST /api/resources");
        console.log("[PostCreate] 使用 multipart/form-data 格式");

        const response = await apiHttpClient.post("/api/resources", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("[PostCreate] 创建成功:", response.data);

        // 显示成功消息
        this.successMessage = `✓ 资源上传成功! ID: ${
          response.data.id || response.data.insertId || "N/A"
        }`;

        // 清空表单
        this.title = "";
        this.category = "";
        this.grade = "";
        this.subject = "";
        this.version = "";
        this.description = "";
        this.file = null;
        this.cover = null;
        this.coverPreviewUrl = null;
        if (this.$refs.file) this.$refs.file.value = "";
        if (this.$refs.cover) this.$refs.cover.value = "";

        // 通知首页刷新资源列表
        console.log("[PostCreate] 触发首页刷新...");
        window.dispatchEvent(new CustomEvent("resource-created"));

        // 3秒后清除成功消息
        setTimeout(() => {
          this.successMessage = "";
        }, 3000);
      } catch (error) {
        console.error("[PostCreate] 创建失败:", error);
        console.error("[PostCreate] 错误详情:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });

        this.errorMessage = `上传失败: ${
          error.response?.data?.message || error.message
        }`;
      } finally {
        this.isSubmitting = false;
        console.log("[PostCreate] 上传流程结束");
      }
    },
    async createFile(file, postId) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        await apiHttpClient.post(`/files?post=${postId}`, formData, {});
        this.file = null;
        if (this.$refs.file) {
          this.$refs.file.value = "";
        }
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
  },
});
</script>

<style>
@import "./styles/style.css";
</style>
