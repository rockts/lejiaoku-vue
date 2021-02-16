<template>
 <bread-crumbs />
 <div class="post-show-page mb-3" v-if="showPost">
  <div class="container">
   <div class="res__header">
    <div class="row">
     <div class="col-md-4">
      <div v-if="post.cover" class="cover">
       <img
        :src="getCoverUrl"
        :alt="`${post.title}`"
        class="cover  img-fluid img-thumbnail"
       />
       {{ post.cover.id }}
      </div>
      <div v-else class="cover">
       <img
        src="@/assets/catagory.png"
        :alt="`${post.title}`"
        class="cover  img-fluid img-thumbnail"
       />
      </div>
      <div class="statistics">
       <ul>
        <li><i class="bi bi-eye-fill"></i>100</li>
        <li><i class="bi bi-file-arrow-down-fill"></i>200</li>
        <li><i class="bi bi-star-fill"></i>{{ post.totalLikes }}</li>
       </ul>
      </div>
     </div>
     <div class="col-md-8">
      <h4 class="pt-2">{{ post.title }}</h4>
      <div class="res__btn text-left my-5">
       <router-link to="/" class="btn btn-primary ">点击阅览</router-link>
       <router-link to="/" class="btn btn-primary ">点击下载</router-link>
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
   <div class="card">
    <div class="card-body">
     <h5>资源介绍</h5>
     <p class="card-text">
      {{ post.description }}
     </p>
     <div>
      <ul class="res__attr">
       <li><span style="font-weight: bold">学科：</span>{{ post.subject }}</li>
       <li><span style="font-weight: bold">年级：</span>{{ post.grade }}</li>
       <li><span style="font-weight: bold">版本：</span>{{ post.version }}</li>
       <li>
        <span style="font-weight: bold">文件类型：</span
        >{{ post.file.mimetype }}
       </li>
       <li>
        <span style="font-weight: bold">资源类型：</span>{{ post.category }}
       </li>
       <li>
        <span style="font-weight: bold">大小：</span>{{ post.file.size }}
       </li>
       <li>
        <span style="font-weight: bold">贡献者：</span>{{ post.user.name }}
       </li>
       <li>
        <span style="font-weight: bold">更新时间：</span>{{ post.createdAt }}
       </li>
      </ul>
     </div>
    </div>
    <div class="card-footer">
     <i class="bi bi-tags-fill"></i> Tags:
     <span>{{ post.tags }}</span>
    </div>
   </div>
  </div>
 </div>
</template>
<script>
 import { defineComponent } from 'vue';
 import BreadCrumbs from '@/app/components/BreadCrumbs.vue';
 import { mapGetters, mapActions } from 'vuex';

 export default defineComponent({
  title() {
   if (this.showPost) {
    return this.post.title;
   }
  },

  props: {
   postId: String,
   coverId: String,
  },

  created() {
   this.getPostById(this.postId);
   this.getCoverUrl(this.getCoverUrl);
  },

  computed: {
   ...mapGetters({
    loading: 'post/show/loading',
    post: 'post/show/post',
    cover: 'post/cover/cover',
   }),

   showPost() {
    return !this.loading && this.post;
   },
   showCover() {
    return !this.loading && this.cover;
   },
  },

  methods: {
   ...mapActions({
    getPostById: 'post/show/getPostById',
    getCoverUrl: 'post/cover/getCoverUrl',
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

 .res__header {
  background: rgb(228, 228, 228);
  text-align: left;
  border-bottom: 1px solid #ccc;
  box-shadow: rgb(0, 0, 0);
  margin-bottom: 20px;
  padding: 20px 10px;
 }
 .res__attr,
 .res__operating li {
  text-decoration: none; /*去掉前面的圆点*/
  list-style: none;
  display: inline;
  padding-right: 20px;
 }
 .res__attr li {
  text-indent: 2em;
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
