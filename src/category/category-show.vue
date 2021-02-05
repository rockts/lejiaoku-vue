<template>
  <bread-crumbs></bread-crumbs>
  <div class="category-show-page">
    <div class="container">
      <div class="category-info  border-bottom py-5 align-items-center">
        <!-- <h3>{{ category.name }}</h3>
        <p class="text-muted">{{ category.alias }}</p> -->
        <pre>{{ currnetId }}</pre>
      </div>

      <post-list />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { axios } from '@/app/app.service';
// import { useRoute } from 'vue-router';

import BreadCrumbs from '@/app/components/BreadCrumbs.vue';
import PostList from '@/post/components/PostList.vue';

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
        const response = await axios.get('/categorys');

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
