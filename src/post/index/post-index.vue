<template>
  <bread-crumbs></bread-crumbs>
  <div class="post-page">
    <div class="container">
      <post-list />
    </div>
  </div>
</template>
<script lang="ts">
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
