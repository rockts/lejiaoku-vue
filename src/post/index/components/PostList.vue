<template>
 <div class="PostList my-3">
  <div v-if="loading">加载中...</div>
  <div class="container">
   <!-- <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4"> -->
   <PostListItem
    v-for="post in posts"
    :item="post"
    :key="post.id"
    class="shadow p-3 mb-5 bg-body rounded"
   />
   <!-- </div> -->
   <!-- <h1>{{ totalcount['x-total-count'] }}</h1> -->
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
  },

  components: {
   PostListItem,
  },
 });
</script>
