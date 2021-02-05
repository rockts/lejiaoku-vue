<template>
  <bread-crumbs></bread-crumbs>
  <div class="post-index-page">
    <div class="container">
      <post-list />
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue';
import BreadCrumbs from '@/app/components/BreadCrumbs.vue';
import PostList from '@/post/components/PostList.vue';

export default defineComponent({
  components: {
    BreadCrumbs,
    PostList,
  },
});
</script>

<style></style>
