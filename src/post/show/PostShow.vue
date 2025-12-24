<template>
  <bread-crumbs />
  <div v-if="loadError" class="container mt-4">
    <div class="alert alert-warning" role="alert">
      <h4 class="alert-heading">资源不存在!</h4>
      <p>抱歉，找不到ID为 {{ id }} 的资源。可能该资源已被删除或ID不正确。</p>
      <router-link to="/" class="btn btn-primary">返回首页</router-link>
    </div>
  </div>
  <div class="post-show-page my-3" v-else-if="showPost">
    <div class="container">
      <div class="res__header shadow bg-body rounded">
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
            <div class="post__title">
              <h5 class="title_tags">
                <span
                  class="badge badge-pill badge-primary mx-2"
                  v-for="item in post.tags"
                  :key="item.id"
                >
                  {{ item.name }}
                </span>
              </h5>
              <h4 class="pt-3">{{ post.title }}</h4>
            </div>
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
                  <button
                    @click="onClick()"
                    class="btn btn-outline-success"
                    alt="100"
                  >
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
                <small>更新于：{{ formatTime(post.updated_at) }}</small>
              </div>
            </div>
            <div class="res__operating">
              <a href="mailto:rockts@sina.com" target="_blank"
                ><i class="bi bi-flag-fill"></i>报告</a
              >
            </div>
          </div>
        </div>

        <div id="demo" class="collapse">
          <iframe
            :src="postFileURL"
            width="100%"
            height="100%"
            frameborder="0"
          ></iframe>
        </div>
        <hr />
        <div class="card-body">
          <h5>资源介绍</h5>
          <p class="card-text">
            {{ post.description }}
          </p>
          <div>
            <ul class="res__attr">
              <li>
                <span style="font-weight: bold">学科：</span>{{ post.subject }}
              </li>
              <li>
                <span style="font-weight: bold">年级：</span>{{ post.grade }}
              </li>
              <li>
                <span style="font-weight: bold">版本：</span>{{ post.version }}
              </li>
              <li>
                <span style="font-weight: bold">资源类型：</span
                >{{ post.category }}
              </li>
              <li
                v-if="
                  post.file &&
                  post.file.mimetype &&
                  post.file.mimetype.indexOf(`png`) > -1
                "
              >
                <span style="font-weight: bold">文件类型：</span>
                <img
                  src="@/assets/icon/filetype/png.png"
                  class="filetypeicon"
                />
              </li>
              <li
                v-if="
                  post.file &&
                  post.file.mimetype &&
                  post.file.mimetype.indexOf(`bmp`) > -1
                "
              >
                <span style="font-weight: bold">文件类型：</span>
                <img
                  src="@/assets/icon/filetype/bmp.png"
                  class="filetypeicon"
                />
              </li>
              <li
                v-if="
                  post.file &&
                  post.file.mimetype &&
                  post.file.mimetype.indexOf(`jpeg`) > -1
                "
              >
                <span style="font-weight: bold">文件类型：</span>
                <img
                  src="@/assets/icon/filetype/jpg.png"
                  class="filetypeicon"
                />
              </li>
              <li
                v-if="
                  post.file &&
                  post.file.mimetype &&
                  post.file.mimetype.indexOf(`jpg`) > -1
                "
              >
                <span style="font-weight: bold">文件类型：</span>
                <img
                  src="@/assets/icon/filetype/jpg.png"
                  class="filetypeicon"
                />
              </li>
              <li
                v-if="
                  post.file &&
                  post.file.mimetype &&
                  post.file.mimetype.indexOf(`gif`) > -1
                "
              >
                <span style="font-weight: bold">文件类型：</span>
                <img
                  src="@/assets/icon/filetype/gif.png"
                  class="filetypeicon"
                />
              </li>
              <li
                v-if="
                  post.file &&
                  post.file.mimetype &&
                  post.file.mimetype.indexOf(`spreadsheetml.sheet`) > -1
                "
              >
                <span style="font-weight: bold">文件类型：</span>
                <img
                  src="@/assets/icon/filetype/xlsx.png"
                  class="filetypeicon"
                />
              </li>
              <li
                v-if="
                  post.file &&
                  post.file.mimetype &&
                  post.file.mimetype.indexOf(`msword`) > -1
                "
              >
                <span style="font-weight: bold">文件类型：</span>
                <img
                  src="@/assets/icon/filetype/doc.png"
                  class="filetypeicon"
                />
              </li>
              <li
                v-if="
                  post.file &&
                  post.file.mimetype &&
                  post.file.mimetype.indexOf(`wordprocessingml.document`) > -1
                "
              >
                <span style="font-weight: bold">文件类型：</span>
                <img
                  src="@/assets/icon/filetype/docx.png"
                  class="filetypeicon"
                />
              </li>
              <li
                v-if="
                  post.file &&
                  post.file.mimetype &&
                  post.file.mimetype.indexOf(`presentationml.presentation`) > -1
                "
              >
                <span style="font-weight: bold">文件类型：</span>
                <img
                  src="@/assets/icon/filetype/ppt.png"
                  class="filetypeicon"
                />
              </li>
              <li
                v-if="
                  post.file &&
                  post.file.mimetype &&
                  post.file.mimetype.indexOf(`pdf`) > -1
                "
              >
                <span style="font-weight: bold">文件类型：</span>
                <img
                  src="@/assets/icon/filetype/pdf.png"
                  class="filetypeicon"
                />
              </li>
              <li
                v-if="
                  post.file &&
                  post.file.mimetype &&
                  post.file.mimetype.indexOf(`ms-powerpoint`) > -1
                "
              >
                <span style="font-weight: bold">文件类型：</span>
                <img
                  src="@/assets/icon/filetype/ppt.png"
                  class="filetypeicon"
                />
              </li>
              <li
                v-if="
                  post.file &&
                  post.file.mimetype &&
                  post.file.mimetype.indexOf(`ms-excel`) > -1
                "
              >
                <span style="font-weight: bold">文件类型：</span>
                <img
                  src="@/assets/icon/filetype/xls.png"
                  class="filetypeicon"
                />
              </li>
              <li>
                <span style="font-weight: bold">文件大小：</span
                >{{ fileSizeFormat() }}
              </li>
            </ul>
          </div>

          <!-- 教材结构展示区块 -->
          <div v-if="post.auto_meta_result" class="textbook-structure mt-4">
            <h5>📘 教材结构</h5>
            <div class="textbook-header">
              {{ post.auto_meta_result.textbook_version }} ·
              {{ post.auto_meta_result.subject }} ·
              {{ post.auto_meta_result.grade }} ·
              {{ post.auto_meta_result.volume }}
            </div>
            <ul
              class="structure-list"
              v-if="
                post.auto_meta_result.structure &&
                post.auto_meta_result.structure.length
              "
            >
              <li
                v-for="(item, index) in post.auto_meta_result.structure"
                :key="index"
              >
                {{ item.unit }}：{{ item.title }}
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
                <div class="statistics-item__text">
                  {{ post.totalLikes }} 赞
                </div>
              </div>
              <div class="statistics-item">
                <div class="statistics-item__btn">
                  <a href="#" class="btn btn-outline-info editBtn"
                    ><i class="bi bi-bookmark-heart-fill"></i
                  ></a>
                </div>
                <div class="statistics-item__text">
                  {{ post.totalSaves }} 收藏
                </div>
              </div>
              <div class="statistics-item">
                <div class="statistics-item__btn">
                  <a href="" class="btn btn-outline-info editBtn"
                    ><i class="bi bi-cursor-fill"></i
                  ></a>
                </div>
                <div class="statistics-item__text">分享</div>
              </div>

              <div class="statistics-item">
                <div class="statistics-item__btn">
                  <a href="" class="btn btn-outline-info editBtn">
                    <i class="bi bi-chat-fill"></i
                  ></a>
                </div>
                <div class="statistics-item__text">
                  {{ post.totalComments }} 评论
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import BreadCrumbs from "@/app/components/BreadCrumbs.vue";
import { mapGetters, mapActions } from "vuex";
import { API_BASE_URL } from "@/app/app.config";
import axios from "axios";
import moment from "moment";
import { getReadableFileSizeString } from "@/utils/utils";

export default defineComponent({
  data() {
    return {
      loadError: false,
      localPost: null,
    };
  },

  title() {
    if (this.showPost) {
      return this.post.title;
    }
  },

  props: {
    id: String,
  },

  async created() {
    try {
      await this.getPostById(this.id);
    } catch (error) {
      console.error("获取资源详情失败:", error);
      // 如果获取失败，使用本地模拟数据（针对开发/演示环境）
      this.mockPostData();
    }
  },

  mounted() {
    // 挂载资源对象到 window 以便调试
    if (this.post) {
      window.__RESOURCE__ = this.post;
      console.log("resource:", this.post);
      console.log("resource.chapter_info:", this.post.chapter_info);
      console.log("resource.auto_meta_result:", this.post.auto_meta_result);
    }
  },

  updated() {
    // 数据更新后重新挂载并记录
    if (this.post) {
      window.__RESOURCE__ = this.post;
      console.log("resource (updated):", this.post);
    }
  },

  computed: {
    ...mapGetters({
      loading: "post/show/loading",
      postFromStore: "post/show/post",
    }),
    post() {
      // 优先使用 store 中的数据，如果没有则使用本地模拟数据
      return this.postFromStore || this.localPost;
    },
    // resource 别名，统一对外接口
    resource() {
      return this.post;
    },
    postCoverURL() {
      if (!this.post) return "";
      if (this.post.cover && this.post.cover.id) {
        return `${API_BASE_URL}/covers/${this.post.cover.id}?size=thumbnail`;
      }
      return "";
    },
    postFileURL() {
      if (!this.post) return "";
      if (this.post.file && this.post.file.id) {
        return `${API_BASE_URL}/files/${this.post.file.id}`;
      }
      return "";
    },
    userAvatarURL() {
      if (!this.post || !this.post.user) return "";
      return `${API_BASE_URL}/users/${this.post.user.id}/avatar`;
    },

    showPost() {
      return !this.loading && this.post;
    },
  },

  methods: {
    ...mapActions({
      getPostById: "post/show/getPostById",
    }),

    mockPostData() {
      // 模拟数据，结构需与真实数据一致
      this.localPost = {
        id: this.id,
        title: "三年级数学上册第一单元课件",
        description:
          "这是三年级数学上册第一单元的优秀课件，包含完整的教学流程和互动环节。",
        grade: "三年级",
        subject: "数学",
        version: "人教版",
        category: "课件",
        created_at: new Date(),
        updated_at: new Date(),
        totalLikes: 128,
        totalSaves: 56,
        totalComments: 12,
        user: {
          id: 1,
          name: "张老师",
          avatar: null,
        },
        file: {
          id: 101,
          filename: "第一单元.ppt",
          mimetype: "application/vnd.ms-powerpoint",
          size: 2048000,
        },
        cover: null,
        tags: [
          { id: 1, name: "第一单元" },
          { id: 2, name: "公开课" },
        ],
      };
      // 清除错误状态，显示模拟数据
      this.loadError = false;
    },

    getTagsByName(items) {
      let result = "";
      if (items) {
        items.forEach((ele) => {
          result += " " + ele.name;
        });
      }
      return result;
    },
    fileSizeFormat() {
      if (
        !this.post ||
        !this.post.file ||
        typeof this.post.file.size !== "number"
      ) {
        return "-";
      }
      return getReadableFileSizeString(this.post.file.size);
    },
    formatTime(time) {
      return moment(time).fromNow();
    },
    ...mapActions({
      getPostById: "post/show/getPostById",
    }),

    onClick() {
      if (!this.post.file || !this.post.file.id) {
        alert("模拟下载：" + this.post.file.filename);
        return;
      }
      axios({
        url: `${API_BASE_URL}/files/${this.post.file.id}`,
        method: "GET",
        responseType: "blob",
      }).then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement("a");

        fileLink.href = fileURL;
        fileLink.setAttribute("download", `${this.post.file.filename}`);
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
.card {
  padding: 20px;
  border: 1px solid rgba(19, 7, 7, 0.125);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}
.card-title,
.card-text,
.card-footer,
.card-header,
.card-body {
  text-align: left;
}

.res__header {
  text-align: left;
  border-bottom: 1px solid #fff;
  box-shadow: rgb(0, 0, 0);
  margin-bottom: 10px;
  padding: 10px;
  background: #fff;
}

.title_tags {
  float: right;
  margin: 10px;
}
.res__attr li {
  text-decoration: none; /*去掉前面的圆点*/
  list-style: none;
  padding-right: 14px;
}

/* 教材结构样式 */
.textbook-structure {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.textbook-structure h5 {
  margin-bottom: 12px;
  color: #333;
  font-weight: 600;
}

.textbook-header {
  font-size: 15px;
  color: #555;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ddd;
}

.structure-list {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.structure-list li {
  padding: 6px 0;
  color: #444;
  font-size: 14px;
  line-height: 1.6;
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

.collapse {
  height: 500px;
  max-height: 800px;
  margin-bottom: 10px;
}

.embed {
  height: 500px;
}
</style>
