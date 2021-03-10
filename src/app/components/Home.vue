<template>
 <div class="home  pt-3">
  <PostList />
  <HomeJoin />
 </div>
</template>

<script lang="ts">
 import { defineComponent } from 'vue';
 import PostList from '@/post/index/components/post-list.vue';
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
