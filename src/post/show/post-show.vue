<template>
  <bread-crumbs></bread-crumbs>
  <div class="post-show-page mb-3">
    <div class="container">
      <div class="card" v-if="showPost">
        <div class="card-header ">
          <div class="row">
            <div class="col-md-4">
              <div class="cover">
                <img
                  :src="post.cover"
                  :alt="`${post.title}`"
                  class="cover  img-fluid img-thumbnail"
                />
              </div>
              <div class="statistics">
                <ul>
                  <li><i class="bi bi-eye-fill"></i>100</li>
                  <li><i class="bi bi-file-arrow-down-fill"></i>200</li>
                  <li><i class="bi bi-star-fill"></i>50</li>
                </ul>
              </div>
            </div>
            <div class="col-md-8">
              <h4 class="card-title pt-2">{{ post.title }}</h4>
              <div class="res__btn text-left my-5">
                <router-link to="/" class="btn btn-primary "
                  >点击阅览</router-link
                >
                <router-link to="/" class="btn btn-primary "
                  >点击下载</router-link
                >
              </div>
              <div class="res__operating">
                <ul>
                  <li>
                    <a href=""><i class="bi bi-share-fill"></i>分享</a>
                  </li>
                  <li>
                    <a href=""><i class="bi bi-bookmark-heart-fill"></i>收藏</a>
                  </li>
                  <li>
                    <a href=""><i class="bi bi-flag-fill"></i>报告</a>
                  </li>
                  <li>
                    <a href=""><i class="bi bi-link"></i>复制网址</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="card-body">
          <h5>资源介绍</h5>
          <p class="card-text">
            {{ post.description }}
          </p>
          <div class="res__attr">
            <ul class="res__attr">
              <li>学科：{{ post.subject }}</li>
              <li>年级：{{ post.grade }}</li>
              <li>版本：{{ post.version }}</li>
              <li>文件类型：ppt</li>
              <li><span>资源类型：</span>{{ post.category }}</li>
              <li>大小：15KB</li>
              <li>
                <router-link to="/users/1"
                  >贡献者：{{ post.user.name }}</router-link
                >
              </li>
              <li>发布时间：{{ post.createdAt }}</li>
            </ul>
          </div>
        </div>
        <div class="card-footer"><i class="bi bi-tags-fill"></i> Tags:</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import BreadCrumbs from '@/app/components/BreadCrumbs.vue';
import { mapGetters, mapActions } from 'vuex';

export default defineComponent({
  props: {
    postId: String,
  },

  created() {
    this.getPostById(this.postId);
  },

  computed: {
    ...mapGetters({
      loading: 'post/show/loading',
      post: 'post/show/post',
    }),

    showPost() {
      return !this.loading && this.post;
    },
  },

  methods: {
    ...mapActions({
      getPostById: 'post/show/getPostById',
    }),
  },
  components: {
    BreadCrumbs,
  },
});
</script>

<style scoped>
.card-title,
.card-text,
.card-footer,
.card-header,
.card-text,
.card-body {
  text-align: left;
  background: #fff;
}

.res__attr,
.res__operating li {
  text-decoration: none; /*去掉前面的圆点*/
  list-style: none;
  display: inline;
  padding-right: 20px;
}

.res__operating li {
  float: right;
}

.res__operating i {
  padding-right: 5px;
}

.res__btn a {
  margin: 5px 20px;
}

.statistics li {
  list-style: none;
  display: inline;
  padding-right: 10px;
}

.statistics .bi {
  position: relative;
  left: 5px;
  top: -5px;
  padding-right: 10px;
}
</style>
