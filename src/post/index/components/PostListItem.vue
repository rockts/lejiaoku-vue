/* 列表页卡片封面自适应且居中 */
.cover {
  width: 100%;
  height: 220px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border, #e9ecef);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}
.cover img {
  max-width: 100%;
  max-height: 100%;
  display: block;
  background: #fff;
  margin: auto;
  object-fit: contain;
  object-position: center;
.fit-cover { object-fit: cover; object-position: center; }
.fit-contain { object-fit: contain; object-position: center; }
  display: block;
  background: #fff;
  margin: auto;
}
<template>
  <div class="card">
    <div class="container">
      <div class="row">
        <div class="col-md-4 cover">
          <template v-if="resolvedCover && !coverFailed">
            <img
              :src="resolvedCover"
              :alt="item.title"
              class="img-fluid img-thumbnail"
              @load="onCoverLoad"
              @error="coverFailed = true"
              :class="coverClass"
            />
          </template>
          <template v-else>
            <img
              :src="resourceCoverURL"
              :alt="item.title"
              class="img-fluid img-thumbnail"
              @load="onCoverLoad"
              @error="coverFailed = true"
            />
          </template>
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5>
              <span class="posttype badge badge-success">
                {{ item.category }}
              </span>
            </h5>
            <h5 class="card-title text-justify">
              <router-link
                :to="{ name: 'resourceShow', params: { id: item.id } }"
              >
                {{ item.title }}
              </router-link>
            </h5>

            <div class="content">
              <p class="card-text text-justify">
                资源介绍：{{ item.description || "暂无介绍" }}
              </p>
              <div class="text-muted">
                <ul class="attr">
                  <li>
                    <span style="font-weight: bold">教材：</span
                    >{{ textbookInfo }}
                  </li>
                  <li v-if="unitCount">
                    <span style="font-weight: bold">单元数：</span
                    >{{ unitCount }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="author" v-if="item.user">
              <img
                v-if="item.user.avatar === null"
                src="@/assets/img/avatar.png"
                :alt="item.user.name"
                class="avatar"
              />
              <img
                v-if="item.user.avatar === 1"
                :src="userAvatarURL"
                :alt="item.user.name"
                class="avatar"
              />
              <div class="author__text">
                <p>贡献者：{{ item.user.name }}</p>
                <small>更新于：{{ moment(item.updated_at).fromNow() }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- <div class="col sm-6 mb-4 lg-3">
  <div class="card">
    <img v-if="item.cover" :src="postCoverURL" class="card-img-top img-fluid img-thumbnail" :alt="item.title">
    <img  v-else src="@/assets/img/catagory.png" alt="默认封面" class="img-fluid img-thumbnail" />
    <div class="card-body p-3">

        <h5>
            <span class="posttype  badge badge-success">
                {{item.category}}
            </span>
        </h5>
        <h5 class="card-title" >
            <router-link :to="{name: 'resourceShow', params: {id: item.id}}">
                {{ item.title }}
            </router-link>
        </h5>
        <p class="card-text text-justify">
            <span class="d-inline-block">
            资源介绍：
            <br>{{ item.description }}</span>
        </p>
        <p class="card-text">
            <ul class="attr">
                <li><span  style="font-weight: bold">年级：</span>{{item.grade}}</li>
                <li><span  style="font-weight: bold">学科：</span>{{item.subject}}</li>
                <li><span  style="font-weight: bold">版本：</span>{{item.version}}</li>
            </ul>
        </p>
         <router-link :to="{name: 'resourceShow', params: {id: item.id}}" class="btn btn-outline-primary btn-sm">查看详情</router-link>
    </div>
    <div class="card-footer">
        <div class="author">  
            <img
                v-if="item.user.avatar === null"
                src="@/assets/img/avatar.png"
                :alt="item.user.name"
                class="avatar"
            />
            <img v-if="item.user.avatar === 1" :src="userAvatarURL" :alt="item.user.name" class="avatar">
            <div class="author__text">
                <p>贡献者：{{item.user.name}}</p>
                <small>更新于：{{ moment(item.updated_at).fromNow() }}</small>
                 {{ item.totalcount }}
            </div>
        </div>   
    </div>
  </div>
</div> -->
</template>

<script>
import { defineComponent } from "vue";
import { API_BASE_URL } from "@/app/app.config";
import moment from "moment";

export default defineComponent({
  props: {
    item: Object,
  },
  data() {
    return {
      coverFit: "cover",
      resolvedCover: "",
      coverFailed: false,
    };
  },
  mounted() {
    this.resolveCoverUrl();
  },
  methods: {
    moment(...args) {
      return moment(...args);
    },
    onCoverLoad(e) {
      try {
        const img = e.target;
        const ratio = img.naturalWidth / img.naturalHeight;
        this.coverFit = ratio < 0.9 ? "contain" : "cover";
      } catch (err) {
        this.coverFit = "cover";
      }
    },
    // auto-resolve cover when component mounts or props change
    resolvedCoverComputed() {
      return this.resolvedCover;
    },
    async resolveCoverUrl() {
      this.resolvedCover = "";
      this.coverFailed = false;
      const candidates = [];
      const cv = this.item?.cover_url;
      if (cv) {
        if (cv.startsWith("http")) candidates.push(cv);
        else {
          const m =
            cv.match(/(?:\/)??uploads\/cover\/(.+)$/) ||
            cv.match(/uploads\/cover\/(.+)$/);
          if (m) {
            const filename = m[1];
            const extMatch = filename.match(/^(.+)\.(\w+)$/);
            if (extMatch) {
              const name = extMatch[1];
              const ext = extMatch[2];
              candidates.push(
                `${API_BASE_URL}/uploads/cover/resized/${name}-thumbnail.${ext}`
              );
            }
            candidates.push(
              `${API_BASE_URL}/uploads/cover/resized/${filename}-thumbnail`
            );
          }
          candidates.push(`${API_BASE_URL}${cv}`);
        }
      }
      if (this.item?.cover?.id)
        candidates.push(
          `${API_BASE_URL}/covers/${this.item.cover.id}?size=thumbnail`
        );

      console.debug('[PostListItem] probe candidates for', this.item.id, candidates);
      for (const url of candidates) {
        if (!url) continue;
        const ok = await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = url;
        });
        if (ok) {
          this.resolvedCover = url;
          console.debug('[PostListItem] resolved cover for', this.item.id, url);
          return;
        }
      }
      console.debug('[PostListItem] no valid cover found for', this.item.id);
      this.coverFailed = true;
    },
  },
  computed: {
    coverClass() {
      return this.coverFit === "contain" ? "fit-contain" : "fit-cover";
    },
    resourceCoverURL() {
      if (this.item.cover_url) {
        // 如果是完整URL，直接返回；如果是相对路径，拼接 API_BASE_URL
        if (this.item.cover_url.startsWith("http")) {
          return this.item.cover_url;
        }
        // 如果是上传目录的原始封面，优先使用后端约定的 resized 路径（thumbnail）
        const m =
          this.item.cover_url.match(/(?:\/)??uploads\/cover\/(.+)$/) ||
          this.item.cover_url.match(/uploads\/cover\/(.+)$/);
        if (m) {
          const filename = m[1];
          const extMatch = filename.match(/^(.+)\.(\w+)$/);
          if (extMatch) {
            const name = extMatch[1];
            const ext = extMatch[2];
            return `${API_BASE_URL}/uploads/cover/resized/${name}-thumbnail.${ext}`;
          }
          return `${API_BASE_URL}/uploads/cover/resized/${filename}-thumbnail`;
        }
        return `${API_BASE_URL}${this.item.cover_url}`;
      }
      // 兼容旧数据格式
      if (this.item.cover?.id) {
        return `${API_BASE_URL}/covers/${this.item.cover.id}?size=thumbnail`;
      }
      return "";
    },
    userAvatarURL() {
      if (this.item.user?.id) {
        return `${API_BASE_URL}/users/${this.item.user.id}/avatar`;
      }
      return "";
    },
    textbookInfo() {
      // 优先使用 catalog_info，fallback 到 auto_meta_result
      const info = this.item.catalog_info || this.item.auto_meta_result || {};
      const grade = info.grade || this.item.grade || "-";
      const volume = info.volume || "";
      const subject = info.subject || this.item.subject || "-";
      const version =
        info.textbook_version || info.version || this.item.textbook || "";
      return version
        ? `${version} · ${grade}${volume} · ${subject}`
        : `${grade}${volume} · ${subject}`;
    },
    unitCount() {
      // 显示单元数量
      const structure =
        this.item.catalog_info?.structure ||
        this.item.auto_meta_result?.structure ||
        [];
      return structure.length > 0 ? `${structure.length} 个` : null;
    },
  },
});
</script>

<style scoped>
.attr > li {
  list-style: none;
  text-align: left;
}

.posttype {
  float: right;
}
</style>
