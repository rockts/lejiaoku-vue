<template>
  <div class="tag-filter">
    <div class="tag-filter__label">{{ label }}</div>
    <div class="tag-filter__pills">
      <button
        v-for="opt in options"
        :key="opt"
        type="button"
        class="pill"
        :class="{ active: selected.includes(opt) }"
        @click="toggle(opt)"
      >
        {{ opt }}
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "TagFilter",
  props: {
    label: { type: String, required: true },
    options: { type: Array, required: true },
    selected: { type: Array, required: true },
  },
  emits: ["update:selected"],
  methods: {
    toggle(opt) {
      const next = this.selected.includes(opt)
        ? this.selected.filter((o) => o !== opt)
        : [...this.selected, opt];
      this.$emit("update:selected", next);
    },
  },
});
</script>

<style scoped>
.tag-filter {
  margin: 10px 0;
}
.tag-filter__label {
  color: var(--muted);
  margin-bottom: 6px;
}
.tag-filter__pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.pill {
  border: 1px solid var(--border);
  background: rgba(var(--surface-rgb), 0.85);
  color: var(--text);
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 140ms ease;
  user-select: none;
}
.pill:hover {
  border-color: var(--primary);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 140, 255, 0.15);
}
.pill.active {
  border-color: var(--primary);
  color: #fff;
  background: var(--primary);
  transform: translateY(-1px);
}
.pill:active {
  transform: scale(0.96);
}
</style>
