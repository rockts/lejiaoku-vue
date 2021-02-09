<template>
  <bread-crumbs></bread-crumbs>
  <div class="category-show-page">
    <div class="container">
      <div class="category-info  border-bottom py-5 align-items-center">
        <!-- <h3>{{ category.name }}</h3>
        <p class="text-muted">{{ category.alias }}</p> -->
        <pre>{{ currnetId }}</pre>
      </div>

      <PostList />
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue';
import { apiHttpClient } from '@/app/app.service';

import BreadCrumbs from '@/app/components/BreadCrumbs.vue';
import PostList from '@/post/index/components/post-list';

export default defineComponent({
  data() {
    return {
      Category: [],
    };
  },
  created() {
    this.getCategory();
  },

  methods: {
    async getCategory() {
      try {
        // 请求类型列表接口
        const response = await apiHttpClient.get('/categorys');

        this.Category = response.data;
      } catch (error) {
        console.log(error.response);
      }
    },
  },

  components: {
    BreadCrumbs,
    PostList,
  },
});
</script>

<style>
.category-info {
  background: #ccc;
}
</style>
