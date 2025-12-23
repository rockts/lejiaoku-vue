<template>
  <div class="resource-card" @click="onPreview">
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
      <button class="btn btn-sm btn-primary" @click.stop="onDownload">
        下载
      </button>
      <span class="downloads">⬇ {{ item.downloads }}</span>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "ResourceCard",
  props: { item: { type: Object, required: true } },
  methods: {
    onPreview() {
      this.$router.push(`/posts/${this.item.id}`);
    },
    onDownload() {
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
}
.resource-card:hover {
  transform: translateY(-2px);
}
.resource-title {
  font-size: 16px;
  font-weight: 600;
}
.resource-meta {
  margin-top: 6px;
  display: flex;
  gap: 8px;
  align-items: center;
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
}
</style>
