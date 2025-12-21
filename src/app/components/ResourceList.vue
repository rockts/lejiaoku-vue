<template>
  <div class="resource-list">
    <div class="section">
      <div class="section-title">最新上传</div>
      <div class="grid">
        <ResourceCard v-for="r in latest" :key="r.id" :item="r" />
      </div>
    </div>
    <div class="section">
      <div class="section-title">下载最多</div>
      <div class="grid">
        <ResourceCard v-for="r in most" :key="r.id" :item="r" />
      </div>
    </div>
    <div class="section">
      <div class="section-title">推荐资源</div>
      <div class="grid">
        <ResourceCard v-for="r in recommended" :key="r.id" :item="r" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import ResourceCard from './ResourceCard.vue';
export default defineComponent({
  name: 'ResourceList',
  components: { ResourceCard },
  props: { resources: { type: Array, required: true } },
  computed: {
    latest() {
      return [...this.resources].sort((a, b) => b.createdAt - a.createdAt).slice(0, 8);
    },
    most() {
      return [...this.resources].sort((a, b) => b.downloads - a.downloads).slice(0, 8);
    },
    recommended() {
      const rec = this.resources.filter((r) => r.recommended);
      return (rec.length ? rec : this.most).slice(0, 8);
    },
  },
});
</script>

<style scoped>
.section {
  margin-top: 24px;
}
.section-title {
  font-size: 18px;
  font-weight: 600;
  text-align: left;
  margin-bottom: 12px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
@media (max-width: 992px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 576px) {
  .grid { grid-template-columns: repeat(1, 1fr); }
}
</style>
