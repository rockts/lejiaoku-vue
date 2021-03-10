<template>
 <div class="post-list my-3">
  <div class="container m-auto">
   <div v-if="loading">加载中...</div>
   <div class="row  row-cols-1 row-cols-xs-2 row-cols-md-4">
    <PostListItem
     v-for="post in posts"
     :item="post"
     :key="post.id"
     class="shadow p-3 bg-white rounded  m-2 col"
    />
   </div>
  </div>
 </div>
</template>

<script>
 import { defineComponent } from 'vue';
 import { mapGetters, mapActions } from 'vuex';
 import PostListItem from './post-list-item';

 export default defineComponent({
  name: 'PostList',

  async created() {
   this.getPosts();
  },

  computed: {
   ...mapGetters({
    loading: 'post/index/loading',
    posts: 'post/index/posts',
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
