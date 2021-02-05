<template>
  <div class="post-list my-3">
    <div class="card mb-3">
      <article v-for="post in list" :key="post.id" class="card mb-3">
        <div class="row g-0">
          <div class="col-md-4" v-if="post.cover">
            <img
              :src="post.cover"
              alt="post.title"
              class="cover  img-fluid img-thumbnail my-4"
            />
          </div>
          <div class="col-md-8 ">
            <div class="card-body">
              <h5 class="card-title">
                <router-link :to="`/post/${post.id}`">
                  {{ post.title }}
                </router-link>
              </h5>
              <p class="card-text">
                资源介绍：
                {{ post.description }}
              </p>
              <p class="text-muted">
                <ul class="attr">
                  <li>年级：{{post.grade}}</li>
                  <li>学科：{{post.subject}}</li>
                  <li>版本：{{post.version}}</li>
                  <li>资源类型：{{post.category}}</li>
                  <li>贡献者：{{post.user.name}}</li>
                </ul>
              </p>
            </div>
            <div class="card-footer text-muted">
              <small class="text-muted">{{ post.createdAt }}</small>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script lang="ts">
import { apiHttpClient } from '@/app/app.service';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PostList',
  data() {
    return {
      list: [],
    };
  },

  async created() {
    // 获取内容列表数据
    this.getPost();
  },

  methods: {
    async getPost() {
      try {
        // 请求内容列表接口
        const response = await apiHttpClient.get('/posts');

        // 设置组件的数据
        this.list = response.data;
      } catch (error) {
        console.log(error.response);
      }
    },
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

<style scoped>
.card .card-title,
.card-text {
  text-align: left;
}

.attr > li {
  list-style: none;
  text-align: left;
}
</style>
