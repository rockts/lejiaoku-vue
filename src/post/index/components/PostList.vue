<template>
  <div class="PostList my-3">
    <div v-if="loading">加载中...</div>
    <div v-else-if="!posts || !posts.length" class="empty">
      <div class="empty__box">暂无数据</div>
    </div>
    <div v-else class="container">
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
import { defineComponent } from "vue";
import { mapGetters, mapActions } from "vuex";
import PostListItem from "./PostListItem.vue";

export default defineComponent({
  name: "PostList",

  async created() {
    this.getPosts();
  },

  computed: {
    ...mapGetters({
      loading: "post/index/loading",
      posts: "post/index/posts",
      totalcount: "post/index/totalcount",
    }),
  },

  methods: {
    ...mapActions({
      getPosts: "post/index/getPosts",
    }),
  },

  components: {
    PostListItem,
  },
});
</script>

<style scoped>
.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}
.empty__box {
  color: var(--muted, #888);
  border: 1px dashed var(--border, #ddd);
  border-radius: 8px;
  padding: 16px 24px;
}
</style>
