<template>
  <div class="hero-search">
    <h1 class="hero-title">探索·创造·合作</h1>
    <div class="search-row">
      <input
        v-model.trim="localKeyword"
        type="text"
        class="form-control hero-input"
        placeholder="搜索课件、教案、试题、视频"
        @input="syncKeyword"
      />
    </div>
    <div class="filters">
      <TagFilter
        label="学科"
        :options="subjects"
        :selected="filterState.subjects"
        @update:selected="onSubjects"
      />
      <TagFilter
        label="年级"
        :options="grades"
        :selected="filterState.grades"
        @update:selected="onGrades"
      />
      <TagFilter
        label="文件格式"
        :options="formats"
        :selected="filterState.formats"
        @update:selected="onFormats"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import TagFilter from "./TagFilter.vue";
export default defineComponent({
  name: "SearchBar",
  components: { TagFilter },
  props: {
    filterState: { type: Object, required: true },
  },
  data() {
    return {
      localKeyword: this.filterState.keyword || "",
      subjects: ["语文", "数学", "英语", "科学"],
      grades: ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级"],
      formats: ["PPT", "PDF", "DOC", "MP4"],
    };
  },
  methods: {
    syncKeyword() {
      this.$emit("update:filterState", {
        ...this.filterState,
        keyword: this.localKeyword,
      });
    },
    onSubjects(next) {
      this.$emit("update:filterState", { ...this.filterState, subjects: next });
    },
    onGrades(next) {
      this.$emit("update:filterState", { ...this.filterState, grades: next });
    },
    onFormats(next) {
      this.$emit("update:filterState", { ...this.filterState, formats: next });
    },
  },
});
</script>

<style scoped>
.hero-search {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
  background: var(--surface);
  backdrop-filter: saturate(180%) blur(14px);
  -webkit-backdrop-filter: saturate(180%) blur(14px);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow);
}
.hero-title {
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 16px;
}
.search-row {
  display: flex;
  justify-content: center;
}
.hero-input {
  width: 100%;
  max-width: 720px;
  height: 56px;
  border-radius: 12px;
  border: 1px solid var(--border);
  font-size: 16px;
  padding: 0 20px;
}
.filters {
  margin-top: 16px;
}
</style>
