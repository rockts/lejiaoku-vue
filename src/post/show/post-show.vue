<template>
 <bread-crumbs />
 <div class="post-show-page mb-3" v-if="showPost">
  <div class="container">
   <div class="res__header">
    <div class="row">
     <div class="col-md-4">
      <div v-if="post.cover" class="cover">
       <img
        :src="postCoverURL"
        :alt="`${post.title}`"
        class="img-fluid img-thumbnail"
       />
      </div>
      <div v-else class="cover">
       <img
        src="@/assets/img/catagory.png"
        :alt="`${post.title}`"
        class="img-fluid img-thumbnail"
       />
      </div>
     </div>
     <div class="col-md-8">
      <h4 class="pt-3">{{ post.title }}</h4>
      <div class="res__btn my-4">
       <ul>
        <li>
         <router-link
          to="#"
          class="btn btn-outline-success"
          type="button"
          data-toggle="collapse"
          data-target="#demo"
          >点击阅览
         </router-link>
        </li>
        <li>
         <button @click="onClick()" class="btn btn-outline-success" alt="100">
          点击下载
         </button>
        </li>
       </ul>
      </div>
      <div class="author">
       <img
        v-if="post.user.avatar === null"
        src="@/assets/img/avatar.png"
        :alt="post.user.name"
        class="avatar"
       />
       <img
        v-if="post.user.avatar === 1"
        :src="userAvatarURL"
        :alt="post.user.name"
        class="avatar"
       />
       <div class="author__text">
        <p>贡献者：{{ post.user.name }}</p>
        <small>更新于 14天以前</small>
       </div>
      </div>
      <div class="res__operating">
       <a href="mailto:rockts@sina.com" target="_blank"
        ><i class="bi bi-flag-fill"></i>报告</a
       >
      </div>
     </div>
    </div>
   </div>
   <div id="demo" class="collapse">
    <iframe
     :src="postFileURL"
     width="100%"
     height="800px"
     frameborder="0"
    ></iframe>
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
        <span style="font-weight: bold">资源类型：</span>{{ post.category }}
       </li>
       <li v-if="post.file.mimetype.indexOf(`png`) > -1">
        <span style="font-weight: bold">文件类型：</span>
        <img src="@/assets/icon/filetype/png.png" class="filetypeicon" />
       </li>
       <li v-if="post.file.mimetype.indexOf(`bmp`) > -1">
        <span style="font-weight: bold">文件类型：</span>
        <img src="@/assets/icon/filetype/bmp.png" class="filetypeicon" />
       </li>
       <li v-if="post.file.mimetype.indexOf(`jpeg`) > -1">
        <span style="font-weight: bold">文件类型：</span>
        <img src="@/assets/icon/filetype/jpg.png" class="filetypeicon" />
       </li>
       <li v-if="post.file.mimetype.indexOf(`jpg`) > -1">
        <span style="font-weight: bold">文件类型：</span>
        <img src="@/assets/icon/filetype/jpg.png" class="filetypeicon" />
       </li>
       <li v-if="post.file.mimetype.indexOf(`gif`) > -1">
        <span style="font-weight: bold">文件类型：</span>
        <img src="@/assets/icon/filetype/gif.png" class="filetypeicon" />
       </li>
       <li v-if="post.file.mimetype.indexOf(`spreadsheetml.sheet`) > -1">
        <span style="font-weight: bold">文件类型：</span>
        <img src="@/assets/icon/filetype/xlsx.png" class="filetypeicon" />
       </li>
       <li v-if="post.file.mimetype.indexOf(`msword`) > -1">
        <span style="font-weight: bold">文件类型：</span>
        <img src="@/assets/icon/filetype/doc.png" class="filetypeicon" />
       </li>
       <li v-if="post.file.mimetype.indexOf(`wordprocessingml.document`) > -1">
        <span style="font-weight: bold">文件类型：</span>
        <img src="@/assets/icon/filetype/docx.png" class="filetypeicon" />
       </li>
       <li
        v-if="post.file.mimetype.indexOf(`presentationml.presentation`) > -1"
       >
        <span style="font-weight: bold">文件类型：</span>
        <img src="@/assets/icon/filetype/ppt.png" class="filetypeicon" />
       </li>
       <li v-if="post.file.mimetype.indexOf(`pdf`) > -1">
        <span style="font-weight: bold">文件类型：</span>
        <img src="@/assets/icon/filetype/pdf.png" class="filetypeicon" />
       </li>
       <li v-if="post.file.mimetype.indexOf(`ms-powerpoint`) > -1">
        <span style="font-weight: bold">文件类型：</span>
        <img src="@/assets/icon/filetype/ppt.png" class="filetypeicon" />
       </li>
       <li v-if="post.file.mimetype.indexOf(`ms-excel`) > -1">
        <span style="font-weight: bold">文件类型：</span>
        <img src="@/assets/icon/filetype/xls.png" class="filetypeicon" />
       </li>
       <li>
        <span style="font-weight: bold">文件大小：</span>{{ fileSizeFormat() }}
       </li>
      </ul>
     </div>
     <div class="container">
      <div class="statistics">
       <div class="statistics-item">
        <div class="statistics-item__btn">
         <a href="#" class="btn btn-outline-info editBtn"
          ><i class="bi bi-hand-thumbs-up-fill"></i
         ></a>
        </div>
        <div class="statistics-item__text">{{ post.totalLikes }} 赞</div>
       </div>
       <div class="statistics-item">
        <div class="statistics-item__btn">
         <a href="#" class="btn btn-outline-info editBtn"
          ><i class="bi bi-bookmark-heart-fill"></i
         ></a>
        </div>
        <div class="statistics-item__text">30 收藏</div>
       </div>
       <div class="statistics-item">
        <div class="statistics-item__btn">
         <a href="" class="btn btn-outline-info editBtn"
          ><i class="bi bi-cursor-fill"></i
         ></a>
        </div>
        <div class="statistics-item__text">
         分享
        </div>
       </div>

       <div class="statistics-item">
        <div class="statistics-item__btn">
         <a href="" class="btn btn-outline-info editBtn">
          <i class="bi bi-chat-fill"></i
         ></a>
        </div>
        <div class="statistics-item__text">{{ post.totalComments }} 评论</div>
       </div>
      </div>
     </div>
    </div>
    <div class="card-footer">
     <i class="bi bi-tags-fill"></i> Tags:
     <span
      class="badge badge-pill badge-primary mx-2"
      v-for="item in post.tags"
      :key="item.id"
      >{{ item.name }}</span
     >
    </div>
   </div>
  </div>
 </div>
</template>

<script>
 import { defineComponent } from 'vue';
 import BreadCrumbs from '@/app/components/BreadCrumbs.vue';
 import { mapGetters, mapActions } from 'vuex';
 import { API_BASE_URL } from '@/app/app.config';
 import axios from 'axios';
 import moment from 'moment';
 import { getReadableFileSizeString } from '@/utils/utils';

 export default defineComponent({
  title() {
   if (this.showPost) {
    return this.post.title;
   }
  },

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
   postCoverURL() {
    return `${API_BASE_URL}/covers/${this.post.cover.id}?size=thumbnail`;
   },
   postFileURL() {
    return `${API_BASE_URL}/files/${this.post.file.id}`;
   },
   userAvatarURL() {
    return `${API_BASE_URL}/users/${this.post.user.id}/avatar`;
   },

   showPost() {
    return !this.loading && this.post;
   },
  },

  methods: {
   getTagsByName(items) {
    console.log('item:' + items);
    let result = '';
    if (items) {
     items.forEach((ele) => {
      result += ' ' + ele.name;
     });
    }
    return result;
   },
   fileSizeFormat() {
    return getReadableFileSizeString(this.post.file.size);
   },
   moment(...args) {
    return moment(...args);
   },
   ...mapActions({
    getPostById: 'post/show/getPostById',
   }),

   onClick() {
    axios({
     url: `${API_BASE_URL}/files/${this.post.file.id}`,
     method: 'GET',
     responseType: 'blob',
    }).then((response) => {
     const fileURL = window.URL.createObjectURL(new Blob([response.data]));
     const fileLink = document.createElement('a');

     fileLink.href = fileURL;
     fileLink.setAttribute('download', `${this.post.file.filename}`);
     document.body.appendChild(fileLink);

     fileLink.click();
    });
   },
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
  background: #d7cfcf;
  text-align: left;
  border-bottom: 1px solid #ccc;
  box-shadow: rgb(0, 0, 0);
  margin-bottom: 10px;
  padding: 10px;
 }
 .res__attr li {
  text-decoration: none; /*去掉前面的圆点*/
  list-style: none;
  padding-right: 14px;
 }

 .res__btn li {
  list-style: none;
  display: inline-flex;
  padding: 10px;
 }
 .res__operating {
  text-align: right;
  margin-right: 20px;
 }
 .res__operating i {
  padding-right: 5px;
 }

 .editBtn {
  border-radius: 50%;
  width: 45px;
  height: 45px;
 }

 .cover {
  text-align: center;
 }

 .filetypeicon {
  width: 50px;
  margin: 10px;
 }
</style>
