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
              <select class="form-control">
                <option selected>年级</option>
                <option>一年级上册</option>
              </select>
            </div>
            <div class="col-md-3">
              <select class="form-control">
                <option selected>学科</option>
                <option>语文</option>
              </select>
            </div>
            <div class="col-md-3">
              <select class="form-control">
                <option selected>版本</option>
                <option>人教版</option>
              </select>
            </div>
            <div class="col-md-3">
              <select class="form-control">
                <option selected>类型</option>
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
  data() {
    return {
      errorMessage: "",
      successMessage: "",
      isSubmitting: false,
      user: {
        email: "",
        password: "",
      },
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
  onChangeFile(event) {
    const file = event.target.files[0];
    if (file) {
      this.file = file;
    }
  },

  methods: {
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

      // 清空之前的消息
      this.errorMessage = "";
      this.successMessage = "";
      this.isSubmitting = true;

      try {
        // 准备资源数据
        const resourceData = {
          title: this.title || "未命名资源",
          category: this.category || "其他",
          grade: this.grade || "未分级",
          subject: this.subject || "未分类",
          version: this.version || "通用版",
          description: this.description || "",
          file_format: this.file
            ? this.file.name.split(".").pop().toUpperCase()
            : "PDF",
          file_url: "https://placeholder.example.com/file.pdf", // 开发期占位
        };

        console.log("[PostCreate] 提交数据:", resourceData);
        console.log("[PostCreate] 请求接口: POST /api/resources");

        const response = await apiHttpClient.post(
          "/api/resources",
          resourceData
        );

        console.log("[PostCreate] 创建成功:", response.data);

        // 显示成功消息
        this.successMessage = `✓ 资源创建成功! ID: ${
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

        this.errorMessage = `创建失败: ${
          error.response?.data?.message || error.message
        }`;
      } finally {
        this.isSubmitting = false;
        console.log("[PostCreate] 创建流程结束");
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
