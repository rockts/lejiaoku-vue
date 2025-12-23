<template>
  <div class="resource-card" @click="onPreview">
    <!-- 封面图 -->
    <div class="resource-cover" v-if="coverUrl">
      <img :src="coverUrl" :alt="item.title" />
    </div>
    <div class="resource-cover placeholder" v-else>
      <i class="bi bi-file-earmark"></i>
    </div>

    <div class="resource-title">{{ item.title }}</div>
    <div class="resource-meta">
      <span class="badge category">{{ item.category }}</span>
      <span class="badge format">{{ item.format }}</span>
      <span class="muted">{{ item.subject }} · {{ item.grade }}</span>
    </div>
    <div class="resource-actions">
      <button class="btn btn-sm btn-outline-primary" @click.stop="onPreview">
        预览
      </button>
      <button
        class="btn btn-sm btn-primary"
        @click.stop="showDownloadModal = true"
      >
        下载
      </button>
      <span class="downloads">⬇ {{ item.downloads }}</span>
    </div>

    <!-- 下载确认弹窗 - 使用 Teleport 挂载到 body -->
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
              <h5 class="modal-title">
                <i class="bi bi-download"></i> 确认下载
              </h5>
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
                <strong>{{ item.title }}</strong>
                <div class="text-muted small mt-1">
                  {{ item.category }} · {{ item.format }}
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
      showDownloadModal: false,
    };
  },
  computed: {
    coverUrl() {
      // 如果后端返回了 cover_url，直接使用
      if (this.item.coverUrl) {
        // 修正端口号
        return this.item.coverUrl.replace("localhost:8080", "localhost:3333");
      }
      return null;
    },
  },
  methods: {
    onPreview() {
      this.$router.push(`/posts/${this.item.id}`);
    },
    confirmDownload() {
      // 使用后端下载接口
      const downloadUrl = `${API_BASE_URL}/api/resources/${this.item.id}/download`;
      console.log("[ResourceCard] 下载文件:", downloadUrl);
      window.open(downloadUrl, "_blank");
      this.showDownloadModal = false;
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
}
.resource-card:hover {
  transform: translateY(-2px);
}
.resource-cover {
  width: 100%;
  height: 160px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
  background: rgba(var(--surface-rgb), 1);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
}
.resource-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.resource-cover.placeholder {
  background: linear-gradient(
    135deg,
    rgba(79, 140, 255, 0.1) 0%,
    rgba(155, 123, 255, 0.1) 100%
  );
}
.resource-cover.placeholder i {
  font-size: 48px;
  color: var(--muted);
  opacity: 0.3;
}
.resource-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.resource-meta {
  margin-top: 6px;
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
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
.resource-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 10px;
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
