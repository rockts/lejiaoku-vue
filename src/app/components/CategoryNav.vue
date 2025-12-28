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
        { value: "教材", label: "教材", icon: '<i class="bi bi-book"></i>' },
        {
          value: "课件",
          label: "课件",
          icon: '<i class="bi bi-file-earmark-play"></i>',
        },
        {
          value: "教案",
          label: "教案",
          icon: '<i class="bi bi-file-earmark-text"></i>',
        },
        {
          value: "习题",
          label: "习题",
          icon: '<i class="bi bi-question-circle"></i>',
        },
        { value: "其他", label: "其他", icon: '<i class="bi bi-puzzle"></i>' },
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
  gap: 6px;
  padding: 12px 20px;
  background: rgba(var(--surface-rgb), 0.95);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  transition: transform 140ms ease, box-shadow 140ms ease,
    border-color 140ms ease;
  cursor: pointer;
  min-width: 100px;
}
.category-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(16, 24, 40, 0.06);
  border-color: rgba(59, 130, 246, 0.15);
}
.category-item.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}
.category-icon {
  font-size: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.03);
}
.category-label {
  font-size: 14px;
  font-weight: 600;
}
</style>
