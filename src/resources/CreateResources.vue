<template>
  <div class="create-resources-page">
    <h4>发布资源</h4>
    <!-- <form> -->
    <div class="mb-3">
      <label class="form-label">资源标题：</label>
      <input
        v-model="title"
        @keyup.enter="createResources"
        placeholder="请输入资源标题"
        type="text"
      />
    </div>
    <div class="mb-3">
      <!-- <label for="" class="form-label">资源介绍：</label>
        <input
          rows="10"
          type="text"
          tag="textarea"
          placeholder="请输入资源说明"
        /> -->
    </div>

    <!-- <button class="btn btn-primary btn-large">发布资源</button> -->
    <!-- </form> -->
  </div>
</template>

<script lang="ts">
import { axios } from '@/app/app.service';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CreateResources',
  data() {
    return {
      errorMessage: '',
      user: {
        name: '高鹏',
        password: '123123',
      },
      token: '',
      title: '',
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
    async createResources() {
      try {
        const response = await axios.post(
          '/resources',
          {
            title: this.title,
          },
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );

        console.log(response.data);

        this.title = '';
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
  },
});
</script>
