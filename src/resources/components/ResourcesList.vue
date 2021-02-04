<template>
  <div class="resources-list my-3">
    <div class="card mb-3">
      <article v-for="resources in list" :key="resources.id" class="card mb-3">
        <div class="row g-0">
          <div class="col-md-4" v-if="resources.cover">
            <img
              :src="resources.cover"
              alt="resources.title"
              class="cover  img-fluid img-thumbnail my-4"
            />
          </div>
          <div class="col-md-8 ">
            <div class="card-body">
              <h5 class="card-title">
                <router-link :to="`/resources/${resources.id}`">
                  {{ resources.title }}
                </router-link>
              </h5>
              <p class="card-text">
                资源介绍：
                {{ resources.description }}
              </p>
              <p class="text-muted">
                <ul class="attr">
                  <li>年级：{{resources.grade}}</li>
                  <li>学科：{{resources.subject}}</li>
                  <li>版本：{{resources.version}}</li>
                  <li>资源类型：{{resources.category}}</li>
                  <li>贡献者：{{resources.user.name}}</li>
                </ul>
              </p>
            </div>
            <div class="card-footer text-muted">
              <small class="text-muted">{{ resources.createdAt }}</small>
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
  name: 'ResourcesList',
  data() {
    return {
      list: [],
    };
  },

  created() {
    // 获取内容列表数据
    this.getResources();
  },

  methods: {
    async getResources() {
      try {
        // 请求内容列表接口
        const response = await apiHttpClient.get('/resources');

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
  //     type: Array as PropType<ResourcesProps[]>,
  //     required: true,
  //   },
  // },
  // setup(props) {
  //   const resourcesList = computed(() => {
  //     return props.list.map((resources) => {
  //       if (!resources.cover) {
  //         resources.cover = require('@/assets/catagory.png');
  //       }
  //       return resources;
  //     });
  //   });
  //   return { resourcesList };
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
