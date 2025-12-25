<template>
  <div class="resource-card" @click="onPreview">
    <!-- 封面图 -->
    <div class="resource-cover">
      <template v-if="resolvedCover && !coverFailed">
        <img
          :src="resolvedCover"
          :alt="item.title"
          @load="onCoverLoad"
          @error="coverFailed = true"
          :class="coverFitClass"
        />
      </template>
      <template v-else>
        <template v-if="coverUrl">
          <img
            :src="coverUrl"
            :alt="item.title"
            @load="onCoverLoad"
            @error="coverFailed = true"
            :class="coverFitClass"
          />
        </template>
        <template v-else>
          <i class="bi bi-file-earmark"></i>
        </template>
      </template>
    </div>

    <div class="resource-title">{{ item.title }}</div>
    <div class="resource-meta">
      <span class="badge category">{{ item.category }}</span>
      <span class="badge format">{{ item.format }}</span>
      <span class="muted">{{ textbookInfo }}</span>
    </div>
    <!-- 教材信息和单元数 -->
    <div class="resource-chapter" v-if="unitCount">
      <i class="bi bi-bookmark"></i> {{ unitCount }}
    </div>
    <div class="resource-actions">
      <button class="btn btn-sm btn-outline-primary" @click.stop="onPreview">
        预览
      </button>
      <a
        class="btn btn-sm btn-primary"
        :href="downloadUrl"
        target="_blank"
        rel="noopener"
        @click.stop
      >
        下载
      </a>
      <span class="downloads">⬇ {{ item.downloads }}</span>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { API_BASE_URL } from "@/app/app.config";

export default defineComponent({
  name: "ResourceCard",
  props: { item: { type: Object, required: true } },
  data() {
    return {
      coverFit: "cover",
      resolvedCover: "",
      coverFailed: false,
    };
  },
  watch: {
    "item.cover_url": {
      handler() {
        this.resolveCoverUrl();
      },
      immediate: true,
    },
    "item.cover.id": {
      handler() {
        this.resolveCoverUrl();
      },
      immediate: true,
    },
  },
  computed: {
    coverFitClass() {
      return {
        "fit-contain": this.coverFit === "contain",
        "fit-cover": this.coverFit === "cover",
      };
    },
    coverUrl() {
      // 如果后端返回了 cover_url，拼接完整 URL
      if (this.item.cover_url) {
        // 如果是完整URL，直接返回；如果是相对路径，拼接 API_BASE_URL
        if (this.item.cover_url.startsWith("http")) {
          return this.item.cover_url;
        }
        // 如果是上传目录的原始封面，优先使用后端约定的 resized 路径
        // 支持带或不带前导斜杠的路径
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
      return null;
    },
    downloadUrl() {
      if (!this.item?.file_url) return "";
      if (this.item.file_url.startsWith("http")) return this.item.file_url;
      return `${API_BASE_URL}${this.item.file_url}`;
    },
    textbookInfo() {
      // 优先使用 catalog_info，fallback 到 auto_meta_result
      const info = this.item.catalog_info || this.item.auto_meta_result || {};
      const grade = info.grade || this.item.grade || "-";
      const volume = info.volume || "";
      const subject = info.subject || this.item.subject || "-";
      return `${grade}${volume} · ${subject}`;
    },
    unitCount() {
      // 显示单元数量
      const structure =
        this.item.catalog_info?.structure ||
        this.item.auto_meta_result?.structure ||
        [];
      return structure.length > 0 ? `${structure.length} 个单元` : null;
    },
  },
  methods: {
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

      console.debug('[ResourceCard] probe candidates for', this.item.id, candidates);
      for (const url of candidates) {
        if (!url) continue;
        const ok = await this.probeImage(url);
        if (ok) {
          this.resolvedCover = url;
          console.debug('[ResourceCard] resolved cover for', this.item.id, url);
          return;
        }
      }
      console.debug('[ResourceCard] no valid cover found for', this.item.id);
      this.coverFailed = true;
    },

    probeImage(url) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });
    },
    onCoverLoad(e) {
      try {
        const img = e.target;
        const ratio = img.naturalWidth / img.naturalHeight;
        // 纵向偏高（如书籍封面），使用 contain；否则使用 cover
        this.coverFit = ratio < 0.9 ? "contain" : "cover";
      } catch (err) {
        this.coverFit = "cover";
      }
    },
    onPreview() {
      this.$router.push(`/resources/${this.item.id}`);
    },
  },
  mounted() {
    // when component mounts, try to resolve the actual cover URL
    this.resolveCoverUrl();
  },
});
</script>

<style scoped>
.resource-card {
  padding: 16px;
  background: rgba(var(--surface-rgb), 0.9);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow);
  transition: transform 160ms ease, box-shadow 160ms ease;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 340px;
  height: 100%;
}
.resource-card:hover {
  transform: translateY(-2px);
}
.resource-card .resource-cover {
  width: 100%;
  height: 220px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
}
.resource-card .resource-cover img {
  max-width: 100%;
  max-height: 100%;
  display: block;
  background: #fff;
  margin: auto;
  position: static;
}
.resource-card .resource-cover img.fit-cover {
  object-fit: cover;
  object-position: center;
}
.resource-card .resource-cover img.fit-contain {
  object-fit: contain;
  object-position: center;
}
.resource-card .resource-cover i {
  font-size: 48px;
  color: var(--muted);
  opacity: 0.3;
}
.resource-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
  min-height: 44px;
  max-height: 44px;
}
.resource-meta {
  margin-top: 6px;
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  min-height: 28px;
}
.badge.category {
  background: var(--primary);
  color: #fff;
  border-radius: 6px;
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 500;
}
.badge.format {
  background: rgba(var(--surface-rgb), 1);
  color: var(--muted);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 12px;
}
.muted {
  color: var(--muted);
  font-size: 13px;
}
.resource-chapter {
  margin-top: 6px;
  font-size: 12px;
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-height: 20px;
}
.resource-chapter i {
  font-size: 11px;
  flex-shrink: 0;
}
.resource-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: auto;
  padding-top: 10px;
}
.downloads {
  margin-left: auto;
  color: var(--muted);
  font-size: 13px;
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
  border-left: 3px solid var(--primary);
}
.modal-header .bi {
  margin-right: 8px;
  color: var(--primary);
}
.modal-footer .btn .bi {
  margin-right: 4px;
}
</style>
