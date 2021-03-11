<template>
 <div class="PostList my-3">
  <div v-if="loading">加载中...</div>
  <div class="container">
   <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
    <PostListItem v-for="post in posts.data" :item="post" :key="post.id" />
    <!-- {{ posts.headers['x-total-count'] }} -->

    <h3>{{ getCount(posts) }}</h3>
    <!-- {{ getCount() }} -->
   </div>
  </div>
 </div>
</template>

<script>
 import { defineComponent } from 'vue';
 import { mapGetters, mapActions } from 'vuex';
 import PostListItem from './PostListItem.vue';

 export default defineComponent({
  name: 'PostList',

  async created() {
   this.getPosts();
  },

  computed: {
   ...mapGetters({
    loading: 'post/index/loading',
    posts: 'post/index/posts',
    totalcount: 'post/index/totalcount',
   }),
  },

  methods: {
   ...mapActions({
    getPosts: 'post/index/getPosts',
   }),
   getCount(posts) {
    return posts.headers;
   },
  },

  components: {
   PostListItem,
  },
 });
</script>
