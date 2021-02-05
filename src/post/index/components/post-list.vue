<template>
  <div class="post-list my-3">
    <div v-if="loading">加载中...</div>
    <PostListItem v-for="post in posts" :item="post" :key="post.id" />
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

    // postCoverURL() {
    //   return `${API_BASE_URL}/cover/${this.item.file.id}/serve?size=thumbnail`;
    // },
  },

  methods: {
    ...mapActions({
      getPosts: 'post/index/getPosts',
    }),
  },

  components: {
    PostListItem,
  },

  // props: {
  //   list: {
  //     type: Array as PropType<PostProps[]>,
  //     required: true,
  //   },
  // },
  // setup(props) {
  //   const postList = computed(() => {
  //     return props.list.map((post) => {
  //       if (!post.cover) {
  //         post.cover = require('@/assets/catagory.png');
  //       }
  //       return post;
  //     });
  //   });
  //   return { postList };
  // },
});
</script>
