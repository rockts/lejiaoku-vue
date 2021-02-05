<template>
  <div class="create-Post-page">
    <h4>发布资源</h4>
    <!-- <form> -->
    <div class="mb-3">
      <label class="form-label">资源标题：</label>
      <input
        v-model="title"
        @keyup.enter="createPost"
        placeholder="请输入资源标题"
        type="text"
      />
      <input
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
      />
      <input
        type="file"
        ref="file"
        @change="onChangeFile"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
        application/vnd.ms-powerpoint,
        application/pdf,
        application/msword,
        application/vnd.ms-excel,
        application/vnd.openxmlformats-officedocument.wordprocessingml.document,
        application/vnd.openxmlformats-officedocument.presentationml.presentation,
        application/octet-stream,
        application/vnd.apple.numbers,
        application/vnd.apple.page,
        image/png"
      />

      <div
        :class="['drag-zone', { active: dragZoneActive }]"
        @dragover.prevent
        @drop.prevent="onDropDragZone"
        @dragenter="dragZoneActive = true"
        @dragleave="dragZoneActive = false"
      >
        <div>把文件拖放到这里</div>
      </div>

      <div v-if="imageUploadProgress">
        <span class="image-upload-progress">
          {{ imageUploadProgress + '%' }}
        </span>
      </div>

      <div v-if="imagePreviewUrl">
        <img class="image-preview" :src="imagePreviewUrl" alt="" />
      </div>
    </div>
    <div class="mb-3">
      <label for="" class="form-label">资源介绍：</label>
      <input
        v-model="description"
        rows="10"
        type="text"
        tag="textarea"
        placeholder="请输入资源说明"
      />
    </div>

    <!-- <button class="btn btn-primary btn-large">发布资源</button> -->
    <!-- </form> -->
  </div>
</template>

<script>
import { axios } from '@/app/app.service';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CreatePost',
  data() {
    return {
      errorMessage: '',
      user: {
        name: '高鹏',
        password: '123123',
      },
      token: '',
      title: '',
      categoryId: '',
      grade: '',
      subject: '',
      version: '',
      description: '',
      file: null,
      imagePreviewUrl: null,
      imageUploadProgress: null,
      dragZoneActive: false,
    };
  },

  async created() {
    // 用户登录
    try {
      const response = await axios.post('/login', this.user);
      this.token = response.data.token;

      console.log(response.data);
    } catch (error) {
      this.errorMessage = error.message;
    }
  },

  methods: {
    onDropDragZone(event) {
      console.log(event.dataTransfer.files);

      this.dragZoneActive = false;

      const file = event.dataTransfer.files[0];

      if (file) {
        this.file = file;

        // 设置资源标题
        this.title = file.name.split('.')[0];

        // 生成预览图像
        this.createImagePreview(file);
      }
    },
    async createFile(file, PostId) {
      // 创建表单
      const formData = new FormData();

      // 添加字段
      formData.append('file', file);

      // 上传文件
      try {
        const response = await axios.post(`/files?Post=${PostId}`, formData, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },

          onUploadProgress: (event) => {
            console.log(event);

            const { loaded, total } = event;

            this.imageUploadProgress = Math.round((loaded * 100) / total);
          },
        });

        // 清理
        this.file = null;
        this.imagePreviewUrl = null;
        this.$refs.file.value = '';
        this.imageUploadProgress = null;

        console.log(response.data);
      } catch (error) {
        this.errorMessage = error.message;
      }
    },

    // 上传文件预览
    createImagePreview(file) {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = (event) => {
        this.imagePreviewUrl = event.target.result;
      };
    },

    onChangeFile(event) {
      console.log(event.target.files);

      const file = event.target.files[0];

      if (file) {
        this.file = file;

        // 用图像名作为资源标题
        this.title = file.name.split('.')[0];

        // 生成预览图像
        this.createImagePreview(file);
      }
    },
    async createPost() {
      try {
        const response = await axios.post(
          '/Post',
          {
            title: this.title,
            categoryId: this.categoryId,
            grade: this.grade,
            subject: this.subject,
            version: this.version,
            description: this.description,
          },
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );

        console.log(response.data);

        if (this.file) {
          this.createFile(this.file, response.data.insertId);
        }

        this.title = '';
        this.categoryId = '';
        this.grade = '';
        this.subject = '';
        this.version = '';
        this.description = '';
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
  },
});
</script>

<style>
.image-preview {
  max-width: 360px;
}
.image-upload-progress {
  font-size: 32px;
  font-weight: 300;
}

.drag-zone {
  width: 360px;
  height: 250px;
  background: #f8f8f8;
  color: #ababab;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drag-zone.active {
  background: #83c7f7;
  color: #1790e9;
}
</style>
