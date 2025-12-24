<template>
  <bread-crumbs />
  <div class="post-show-page my-3" v-if="showPost">
    <div class="container">
      <div class="res__header shadow bg-body rounded">
        <div class="row">
          <div class="col-md-4">
            <div v-if="postCoverURL" class="cover">
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
                    @click="showDownloadModal = true"
                    class="btn btn-outline-success"
                    alt="100"
                  >
                    点击下载
                  </button>
                </li>
              </ul>
            </div>
            <div class="author" v-if="post.user">
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
                <small>更新于：{{ moment(post.updated_at).fromNow() }}</small>
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
          <p class="card-text" v-if="post.description">
            {{ post.description }}
          </p>
          <p class="card-text text-muted" v-else>暂无资源介绍</p>

          <!-- AI 识别状态提示（仅 pending 时显示） -->
          <div v-if="post.auto_meta_status === 'pending'" class="mt-2">
            <p class="text-muted small mb-0">
              <i class="bi bi-hourglass-split"></i>
              系统正在分析资源元信息，稍后可能自动补全封面和教材信息
            </p>
          </div>

          <!-- 章节信息（可选） -->
          <div v-if="post.chapter_info" class="mt-3">
            <h5>章节信息</h5>
            <p class="text-muted">
              <i class="bi bi-bookmark"></i> {{ post.chapter_info }}
            </p>
          </div>

          <!-- 教材信息（可选） -->
          <div v-if="post.textbook_info" class="mt-3">
            <h5>教材信息</h5>
            <ul class="res__attr">
              <li v-if="post.textbook_info.stage">
                <span style="font-weight: bold">学段：</span
                >{{ post.textbook_info.stage }}
              </li>
              <li v-if="post.textbook_info.grade">
                <span style="font-weight: bold">年级：</span
                >{{ post.textbook_info.grade }}
              </li>
              <li v-if="post.textbook_info.subject">
                <span style="font-weight: bold">学科：</span
                >{{ post.textbook_info.subject }}
              </li>
              <li v-if="post.textbook_info.volume">
                <span style="font-weight: bold">册别：</span
                >{{ post.textbook_info.volume }}
              </li>
              <li v-if="post.textbook_info.version">
                <span style="font-weight: bold">教材版本：</span
                >{{ post.textbook_info.version }}
              </li>
            </ul>
          </div>

          <!-- 教材结构（MVP） -->
          <div
            v-if="post.auto_meta_status === 'done' && post.auto_meta_result"
            class="mt-3"
          >
            <h5><i class="bi bi-book"></i> 教材结构</h5>

            <!-- 教材基本信息 -->
            <p class="text-muted">
              {{ post.auto_meta_result.textbook_info?.version || "-" }} ·
              {{ post.auto_meta_result.textbook_info?.subject || "-" }} ·
              {{ post.auto_meta_result.textbook_info?.grade || "-" }} ·
              {{ post.auto_meta_result.textbook_info?.volume || "-" }}
            </p>

            <!-- 教材结构列表 -->
            <div
              v-if="post.auto_meta_result.textbook_structure"
              class="textbook-structure"
            >
              <div
                v-for="unit in post.auto_meta_result.textbook_structure"
                :key="unit.id || unit.name"
                class="structure-item mb-2"
              >
                <div class="unit-title fw-bold">
                  {{ unit.name }}
                </div>

                <!-- 单元下的课/章节 -->
                <div
                  v-for="lesson in unit.children || []"
                  :key="lesson.id || lesson.name"
                  class="lesson-item ms-3 mt-1"
                >
                  <div class="lesson-title">
                    {{ lesson.name }}
                  </div>

                  <!-- 课下的子目 -->
                  <div
                    v-for="subtopic in lesson.children || []"
                    :key="subtopic.id || subtopic.name"
                    class="subtopic-item ms-3 mt-1"
                  >
                    <div class="subtopic-title">
                      {{ subtopic.name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 无结构信息提示 -->
            <div v-else class="text-muted small">暂无教材结构信息</div>
          </div>

          <!-- 教材结构未生成提示 -->
          <div v-else-if="post.auto_meta_status !== 'done'" class="mt-3">
            <h5><i class="bi bi-book"></i> 教材结构</h5>
            <p class="text-muted small">教材结构尚未生成</p>
          </div>

          <div>
            <ul class="res__attr">
              <li v-if="post.subject">
                <span style="font-weight: bold">学科：</span>{{ post.subject }}
              </li>
              <li v-if="post.grade">
                <span style="font-weight: bold">年级：</span>{{ post.grade }}
              </li>
              <li v-if="post.textbook">
                <span style="font-weight: bold">版本：</span>{{ post.textbook }}
              </li>
              <li v-if="post.category">
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
              <li v-if="post.file && post.file.size">
                <span style="font-weight: bold">文件大小：</span
                >{{ fileSizeFormat() }}
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

  <!-- 下载确认弹窗 -->
  <Teleport to="body">
    <div
      class="modal fade"
      :class="{ show: showDownloadModal }"
      :style="{ display: showDownloadModal ? 'block' : 'none' }"
      tabindex="-1"
      @click.self="showDownloadModal = false"
      v-if="showDownloadModal"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><i class="bi bi-download"></i> 确认下载</h5>
            <button
              type="button"
              class="close"
              @click="showDownloadModal = false"
            >
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p class="mb-2">您确定要下载以下资源吗？</p>
            <div class="download-info">
              <strong>{{ post.title }}</strong>
              <div class="text-muted small mt-1" v-if="post.category">
                {{ post.category }} · {{ post.file_format || "PDF" }}
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showDownloadModal = false"
            >
              取消
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="confirmDownload"
            >
              <i class="bi bi-download"></i> 确认下载
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal-backdrop fade show"
      v-if="showDownloadModal"
      @click="showDownloadModal = false"
    ></div>
  </Teleport>
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
  title() {
    if (this.showPost) {
      return this.post.title;
    }
  },

  props: {
    postId: String,
    user: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      showDownloadModal: false,
      resource: null,  // 存储从 API 获取的资源数据
      loading: false,  // 加载状态
    };
  },

  created() {
    this.getPostById(this.postId);
  },

  computed: {
    // 由于不再使用 store，post 现在是本地数据
    post() {
      return this.resource;
    },
    
    postCoverURL() {
      console.log("[PostShow] resource 对象:", this.resource);
      console.log("[PostShow] description 值:", this.resource?.description);
      console.log("[PostShow] grade 值:", this.resource?.grade);
      console.log("[PostShow] auto_meta_result 值:", this.resource?.auto_meta_result);

      if (this.resource?.cover_url) {
        console.log("[PostShow] 封面URL:", this.resource.cover_url);
        return this.resource.cover_url;
      }
      console.log("[PostShow] 没有封面URL");
      return "";
    },
    postFileURL() {
      if (this.resource?.file?.id) {
        return `${API_BASE_URL}/files/${this.resource.file.id}`;
      }
      return this.resource?.file_url || "";
    },
    userAvatarURL() {
      if (this.resource?.user?.id) {
        return `${API_BASE_URL}/users/${this.resource.user.id}/avatar`;
      }
      return "";
    },

    showPost() {
      console.log("[PostShow.vue] showPost 计算:", {
        loading: this.loading,
        resource: this.resource,
      });
      return !this.loading && this.resource;
    },
  },

  methods: {
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
      return getReadableFileSizeString(this.post.file.size);
    },
    moment(...args) {
      return moment(...args);
    },
    
    // 直接调用 API 获取资源详情
    async getPostById(postId) {
      this.loading = true;
      try {
        console.log(`[PostShow] 请求资源详情: /api/resources/${postId}`);
        const response = await apiHttpClient.get(`/api/resources/${postId}`);
        this.resource = response.data;
        
        // 暴露资源对象到 window 用于调试
        window.__RESOURCE__ = response.data;
        
        console.log('[PostShow] 资源详情获取成功:', response.data);
        console.log('[PostShow] auto_meta_result:', response.data.auto_meta_result);
        console.log('[PostShow] chapter_info:', response.data.chapter_info);
        
      } catch (error) {
        console.error('[PostShow] 获取资源详情失败:', error);
      } finally {
        this.loading = false;
      }
    },

    onClick() {
      // 确认下载
      if (confirm(`确定要下载《${this.resource.title}》吗？`)) {
        // 使用后端下载接口
        const downloadUrl = `${API_BASE_URL}/api/resources/${this.resource.id}/download`;
        console.log("[PostShow] 下载文件:", downloadUrl);
        window.open(downloadUrl, "_blank");
      }
    },
    confirmDownload() {
      // 使用后端下载接口
      const downloadUrl = `${API_BASE_URL}/api/resources/${this.resource.id}/download`;
      console.log("[PostShow] 下载文件:", downloadUrl);
      window.open(downloadUrl, "_blank");
      this.showDownloadModal = false;
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

/* Modal 样式 */
.modal {
  z-index: 1050;
  overflow: auto;
}
.modal.show {
  display: block !important;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
}
.modal-dialog {
  margin: 1.75rem auto;
  max-width: 500px;
}
.modal-dialog-centered {
  display: flex;
  align-items: center;
  min-height: calc(100vh - 3.5rem);
}
.modal-content {
  border: none;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}
.modal-header {
  border-bottom: 1px solid #e9ecef;
  padding: 1.25rem 1.5rem;
}
.modal-header .close {
  padding: 0;
  margin: -1rem -1rem -1rem auto;
  background: transparent;
  border: 0;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  color: #000;
  opacity: 0.5;
  cursor: pointer;
}
.modal-header .close:hover {
  opacity: 0.75;
}
.modal-body {
  padding: 1.5rem;
}
.modal-footer {
  border-top: 1px solid #e9ecef;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
.download-info {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #007bff;
}
.modal-header .bi {
  margin-right: 8px;
  color: #007bff;
}
.modal-footer .btn .bi {
  margin-right: 4px;
}

/* 教材结构样式 */
.textbook-structure {
  background-color: #f8f9fa;
  border-radius: 6px;
  padding: 12px;
  margin-top: 8px;
}

.structure-item {
  border-left: 3px solid #007bff;
  padding-left: 12px;
  background-color: white;
  border-radius: 4px;
}

.unit-title {
  color: #007bff;
  font-size: 14px;
}

.lesson-item {
  color: #6c757d;
  font-size: 13px;
}

.subtopic-item {
  color: #868e96;
  font-size: 12px;
}

.lesson-title,
.subtopic-title {
  padding: 2px 0;
}
</style>
