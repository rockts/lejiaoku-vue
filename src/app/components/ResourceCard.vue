<template>
  <div class="resource-card" @click="onPreview">
    <!-- 封面图 -->
    <div class="resource-cover">
      <template v-if="resolvedCover && !coverFailed">
        <img
          :src="resolvedCover"
          :alt="item.title"
          @load="onCoverLoad"
          @error="onCoverError"
          :class="coverFitClass"
        />
      </template>
      <template v-else>
        <template v-if="coverUrl && !coverFailed">
          <img
            :src="coverUrl"
            :alt="item.title"
            @load="onCoverLoad"
            @error="onCoverError"
            :class="coverFitClass"
          />
        </template>
        <template v-else>
          <div class="cover-placeholder">
            <i class="bi bi-file-earmark-text"></i>
          </div>
        </template>
      </template>
    </div>

    <div class="resource-title">{{ item.title }}</div>
    <div class="resource-meta">
      <span class="badge category">{{ item.category }}</span>
      <span class="badge format">{{ item.format }}</span>
      <span class="muted">{{ textbookInfo }}</span>
      <span v-if="item.source_attribution" class="badge bg-info ms-1" style="font-size: 0.75rem;">
        📌 {{ item.source_attribution }}
      </span>
    </div>
    <!-- 所属单元 -->
    <div class="resource-unit" v-if="item.unit">
      <i class="bi bi-bookmark"></i> 所属单元：{{ item.unit }}
      <span v-if="item.unit_index" class="text-muted small ms-1">
        (序号: {{ item.unit_index }})
      </span>
    </div>
    <div class="resource-unit-pending" v-else-if="item.catalog_id">
      <i class="bi bi-exclamation-circle"></i> <span class="text-muted">待整理</span>
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
        // 如果是完整URL，直接返回
        if (this.item.cover_url.startsWith("http")) {
          return this.item.cover_url;
        }
        // 优先返回原始封面路径（更可靠），缩略图可能不存在
        // 确保路径以 / 开头（使用代理）
        const path = this.item.cover_url.startsWith("/")
          ? this.item.cover_url
          : `/${this.item.cover_url}`;
        return path;
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
      let grade = info.grade || this.item.grade || "";
      const volume = info.volume || "";
      const subject = info.subject || this.item.subject || "-";
      
      // 格式化年级：如果是数字，转换为"X年级"
      if (typeof grade === "number") {
        const gradeNames = [
          "",
          "一年级",
          "二年级",
          "三年级",
          "四年级",
          "五年级",
          "六年级",
          "七年级",
          "八年级",
          "九年级",
          "高一",
          "高二",
          "高三",
        ];
        grade = gradeNames[grade] || `${grade}年级`;
      } else if (grade && !grade.includes("年级") && !grade.includes("年")) {
        // 如果是字符串但不包含"年级"，添加"年级"
        grade = `${grade}年级`;
      }
      
      // 组合显示：年级 + 上下册 + 学科
      const parts = [];
      if (grade) parts.push(grade);
      if (volume) parts.push(volume);
      if (subject) parts.push(subject);
      
      return parts.length > 0 ? parts.join(" · ") : "-";
    },
  },
  methods: {
    async resolveCoverUrl() {
      this.coverFailed = false;
      // 先使用计算好的 coverUrl 作为快速展示（如果有），避免首页/卡片空白
      if (this.coverUrl) {
        this.resolvedCover = this.coverUrl;
        console.log(
          "[ResourceCard] initial resolvedCover set to coverUrl for",
          this.item.id,
          this.resolvedCover
        );
      } else {
        this.resolvedCover = "";
      }
      const candidates = [];
      const cv = this.item?.cover_url;
      if (cv) {
        if (cv.startsWith("http")) {
          candidates.push(cv);
        } else {
          // 确保路径以 / 开头（使用代理）
          const path = cv.startsWith("/") ? cv : `/${cv}`;
          // 先尝试原始封面（更可靠），再尝试缩略图
          candidates.push(path);
          
          const m =
            cv.match(/(?:\/)??uploads\/cover\/(.+)$/) ||
            cv.match(/uploads\/cover\/(.+)$/);
          if (m) {
            const filename = m[1]; // 完整文件名，例如 "1766517324895-cover.jpg"
            // 根据文档，格式应该是：/uploads/cover/resized/{filename}-thumbnail
              candidates.push(
              `/uploads/cover/resized/${filename}-thumbnail`
              );
            }
        }
      }
      if (this.item?.cover?.id) {
        // 使用 API 路径（需要 API_BASE_URL）
        if (API_BASE_URL) {
        candidates.push(
          `${API_BASE_URL}/covers/${this.item.cover.id}?size=thumbnail`
        );
        }
      }

      console.log(
        "[ResourceCard] probe candidates for",
        this.item.id,
        candidates
      );
      let found = false;
      for (const url of candidates) {
        if (!url) continue;
        const ok = await this.probeImage(url);
        if (ok) {
          this.resolvedCover = url;
          found = true;
          console.log("[ResourceCard] resolved cover for", this.item.id, url);
          break;
        }
      }
      // 如果所有候选都失败，但有原始 cover_url，则兜底显示原图
      if (!found && this.item.cover_url) {
        if (this.item.cover_url.startsWith("http")) {
          this.resolvedCover = this.item.cover_url;
        } else {
          // 使用代理路径
          const path = this.item.cover_url.startsWith("/")
            ? this.item.cover_url
            : `/${this.item.cover_url}`;
          this.resolvedCover = path;
        }
        console.log(
          "[ResourceCard] fallback to raw cover_url for",
          this.item.id,
          this.resolvedCover
        );
      }
      if (!this.resolvedCover) {
        this.coverFailed = true;
        console.log("[ResourceCard] no valid cover found for", this.item.id);
      }
    },

    onCoverError(e) {
      try {
        const failedUrl = e.target && e.target.src;
        console.log(
          "[ResourceCard] cover load error for",
          this.item.id,
          failedUrl
        );
        
        // 如果失败的是缩略图，尝试回退到原始封面
        if (failedUrl && failedUrl.includes("/resized/") && this.item.cover_url) {
          const originalPath = this.item.cover_url.startsWith("/")
            ? this.item.cover_url
            : `/${this.item.cover_url}`;
          // 避免重复尝试
          if (this.resolvedCover !== originalPath) {
            console.log(
              "[ResourceCard] retrying with original cover for",
              this.item.id,
              originalPath
            );
            this.resolvedCover = originalPath;
            this.coverFailed = false;
            return;
          }
        }
      } catch (err) {
        console.log(
          "[ResourceCard] cover load error (no src available) for",
          this.item.id
        );
      }
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
  background: var(--surface, #fff);
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
  background: var(--surface, #fff);
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
.resource-card .resource-cover .cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--bg, #f5f7fa) 0%, var(--surface, #e8ecf1) 100%);
  border: none;
}

.resource-card .resource-cover .cover-placeholder i {
  font-size: 56px;
  color: var(--muted, #94a3b8);
  opacity: 0.6;
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
  color: var(--text, #1f2937);
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
.resource-unit,
.resource-unit-pending {
  margin-top: 6px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-height: 20px;
}
.resource-unit {
  color: var(--text, #212529);
}
.resource-unit i {
  font-size: 11px;
  flex-shrink: 0;
}
.resource-unit-pending {
  color: var(--muted, #6c757d);
}
.resource-unit-pending i {
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
  color: var(--text, #000);
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
  border-top: 1px solid var(--border, #e9ecef);
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
.download-info {
  padding: 12px;
  background: var(--bg, #f8f9fa);
  border-radius: 8px;
  border-left: 3px solid var(--primary);
  color: var(--text, #1f2937);
}
.modal-header .bi {
  margin-right: 8px;
  color: var(--primary);
}
.modal-footer .btn .bi {
  margin-right: 4px;
}
</style>
