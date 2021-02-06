<template>
 <BreadCrumbs />
 <div class="post-index-page">
  <div class="container">
   <post-list />
  </div>
 </div>
</template>
<script>
 import { defineComponent } from 'vue';
 import BreadCrumbs from '@/app/components/BreadCrumbs.vue';
 import PostList from './components/post-list';

 export default defineComponent({
  title() {
   return '资源列表';
  },
  components: {
   BreadCrumbs,
   PostList,
  },
 });
</script>

<style></style>
