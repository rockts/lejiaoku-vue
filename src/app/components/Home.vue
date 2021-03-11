<template>
 <div class="home  pt-3">
  <PostList />
  <HomeJoin />
 </div>
</template>

<script>
 import { defineComponent } from 'vue';
 import PostList from '@/post/index/components/PostList.vue';
 import HomeJoin from './HomeJoin.vue';

 export default defineComponent({
  name: 'Home',
  props: ['user'],

  components: {
   PostList,
   HomeJoin,
  },
 });
</script>
