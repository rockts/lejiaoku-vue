<template>
 <BreadCrumbs />
 <div class="post-index-page">
  <PostList />
 </div>
</template>

<script>
 import { defineComponent } from 'vue';
 import BreadCrumbs from '@/app/components/BreadCrumbs.vue';
 import PostList from './components/PostList';

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
