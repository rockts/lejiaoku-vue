<template>
  <div class="resource-card" @click="onPreview">
    <!-- 封面图 -->
    <div class="resource-cover">
      <template v-if="coverUrl">
        <img :src="coverUrl" :alt="item.title" />
      </template>
      <template v-else>
        <i class="bi bi-file-earmark"></i>
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
  computed: {
    coverUrl() {
      // 如果后端返回了 cover_url，拼接完整 URL
      if (this.item.cover_url) {
        // 如果是完整URL，直接返回；如果是相对路径，拼接 API_BASE_URL
        if (this.item.cover_url.startsWith("http")) {
          return this.item.cover_url;
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
    onPreview() {
      this.$router.push(`/posts/${this.item.id}`);
    },
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
  width: 150px;
  height: 200px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
  border: 1px solid var(--border);
  position: relative;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  /* 保证图片始终居中 */
  text-align: center;
  position: relative;
}
.resource-card .resource-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  background: #fff;
  margin: auto;
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
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
