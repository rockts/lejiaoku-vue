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
import { defineComponent } from "vue";
import ResourceCard from "./ResourceCard.vue";
export default defineComponent({
  name: "ResourceList",
  components: { ResourceCard },
  props: { resources: { type: Array, required: true } },
  computed: {
    latest() {
      // 最新上传：按创建时间倒序，取前8条
      return [...this.resources]
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 8);
    },
    most() {
      // 下载最多：按下载量倒序，排除已在"最新上传"中的资源
      const latestIds = new Set(this.latest.map((r) => r.id));
      return [...this.resources]
        .filter((r) => !latestIds.has(r.id))
        .sort((a, b) => b.downloads - a.downloads)
        .slice(0, 8);
    },
    recommended() {
      // 推荐资源：排除已在前两个区块的资源
      const usedIds = new Set([
        ...this.latest.map((r) => r.id),
        ...this.most.map((r) => r.id),
      ]);

      // 优先使用标记为推荐的资源
      const markedAsRecommended = this.resources.filter(
        (r) => r.recommended && !usedIds.has(r.id)
      );

      // 如果推荐资源不足，从剩余资源中顺序补充
      if (markedAsRecommended.length < 8) {
        const remaining = this.resources.filter((r) => !usedIds.has(r.id));
        return [...markedAsRecommended, ...remaining].slice(0, 8);
      }

      return markedAsRecommended.slice(0, 8);
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
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 576px) {
  .grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
