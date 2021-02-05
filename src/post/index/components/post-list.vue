<template>
  <div class="post-list my-3">
    <PostListItem v-for="post in posts" :item="post" :key="post.id" />
  </div>
</template>

<script>
import { apiHttpClient } from '@/app/app.service';
import { defineComponent } from 'vue';
import PostListItem from './post-list-item';

export default defineComponent({
  name: 'PostList',
  data() {
    return {
      posts: [],
    };
  },

  async created() {
    const response = await apiHttpClient.get('/posts');
    this.posts = response.data;
  },

  components: {
    PostListItem,
  },

  //   computed: {
  // postImageURL () {
  //   return `${API_BASE_URL}/files/${this.item.file.id}/serve?size=large`
  // },
  // },

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
