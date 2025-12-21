<template>
  <div v-if="hasFilters" class="active-filters">
    <div class="active-filters__label">已选条件：</div>
    <div class="active-filters__tags">
      <button
        v-if="filterState.keyword"
        class="filter-tag"
        @click="clear('keyword')"
      >
        关键词: {{ filterState.keyword }} <span class="close">×</span>
      </button>
      <button
        v-if="filterState.category"
        class="filter-tag"
        @click="clear('category')"
      >
        {{ filterState.category }} <span class="close">×</span>
      </button>
      <button
        v-for="s in filterState.subjects"
        :key="'s-' + s"
        class="filter-tag"
        @click="clear('subjects', s)"
      >
        {{ s }} <span class="close">×</span>
      </button>
      <button
        v-for="g in filterState.grades"
        :key="'g-' + g"
        class="filter-tag"
        @click="clear('grades', g)"
      >
        {{ g }} <span class="close">×</span>
      </button>
      <button
        v-for="f in filterState.formats"
        :key="'f-' + f"
        class="filter-tag"
        @click="clear('formats', f)"
      >
        {{ f }} <span class="close">×</span>
      </button>
      <button class="clear-all-btn" @click="$emit('clearAll')">清空全部</button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "ActiveFilters",
  props: {
    filterState: { type: Object, required: true },
  },
  emits: ["clear", "clearAll"],
  computed: {
    hasFilters() {
      return (
        this.filterState.keyword ||
        this.filterState.category ||
        this.filterState.subjects.length ||
        this.filterState.grades.length ||
        this.filterState.formats.length
      );
    },
  },
  methods: {
    clear(key, value) {
      this.$emit("clear", key, value);
    },
  },
});
</script>

<style scoped>
.active-filters {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0;
  padding: 12px 16px;
  background: rgba(var(--surface-rgb), 0.5);
  border: 1px solid var(--border);
  border-radius: 8px;
}
.active-filters__label {
  font-size: 14px;
  color: var(--muted);
  white-space: nowrap;
}
.active-filters__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
}
.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 13px;
  cursor: pointer;
  transition: all 120ms ease;
}
.filter-tag:hover {
  opacity: 0.85;
  transform: scale(0.98);
}
.filter-tag .close {
  font-size: 18px;
  line-height: 1;
}
.clear-all-btn {
  padding: 4px 12px;
  background: transparent;
  color: var(--muted);
  border: 1px solid var(--border);
  border-radius: 999px;
  font-size: 13px;
  cursor: pointer;
  transition: all 120ms ease;
}
.clear-all-btn:hover {
  color: var(--primary);
  border-color: var(--primary);
}
</style>
