<template>
  <div class="category-nav">
    <button
      v-for="cat in categories"
      :key="cat.value"
      class="category-item"
      :class="{ active: activeCategory === cat.value }"
      @click="toggle(cat.value)"
    >
      <span class="category-icon" v-html="cat.icon"></span>
      <span class="category-label">{{ cat.label }}</span>
    </button>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "CategoryNav",
  props: {
    activeCategory: { type: String, default: null },
  },
  emits: ["update:category"],
  data() {
    return {
      categories: [
        { value: "教材", label: "教材", icon: "📘" },
        { value: "课件", label: "课件", icon: "🎞" },
        { value: "教案", label: "教案", icon: "✏️" },
        { value: "习题", label: "习题", icon: "❓" },
        { value: "视频", label: "视频", icon: "🎬" },
        { value: "其他", label: "其他", icon: "🧩" },
      ],
    };
  },
  methods: {
    toggle(value) {
      const next = this.activeCategory === value ? null : value;
      this.$emit("update:category", next);
    },
  },
});
</script>

<style scoped>
.category-nav {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 24px 0;
  flex-wrap: wrap;
}
.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  background: rgba(var(--surface-rgb), 0.85);
  border: 1px solid var(--border);
  border-radius: 12px;
  transition: all 160ms ease;
  cursor: pointer;
  min-width: 100px;
}
.category-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(79, 140, 255, 0.18);
  border-color: var(--primary);
}
.category-item.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}
.category-icon {
  font-size: 28px;
}
.category-label {
  font-size: 15px;
  font-weight: 500;
}
</style>
