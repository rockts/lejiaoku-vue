<template>
  <div class="hero-search">
    <div class="hero-content">
      <h1 class="hero-title">发现优质教育资源</h1>
      <p class="hero-subtitle">课件、教案、试题，一站式获取</p>

      <div class="search-box-wrapper">
        <div class="search-box">
          <i class="bi bi-search search-icon"></i>
          <input
            v-model.trim="localKeyword"
            type="text"
            class="search-input"
            placeholder="搜索资源，例如：三年级数学"
            @input="syncKeyword"
            @keyup.enter="triggerSearch"
          />
          <button class="btn-search" @click="triggerSearch">搜索</button>
        </div>
      </div>

      <div class="quick-filters">
        <div class="filter-group">
          <span class="filter-label">常用学科:</span>
          <div class="filter-options">
            <button
              v-for="sub in subjects"
              :key="sub"
              class="filter-chip"
              :class="{ active: filterState.subjects.includes(sub) }"
              @click="toggleSubject(sub)"
            >
              {{ sub }}
            </button>
          </div>
        </div>

        <div class="filter-group">
          <span class="filter-label">常用年级:</span>
          <div class="filter-options">
            <button
              v-for="grade in grades"
              :key="grade"
              class="filter-chip"
              :class="{ active: filterState.grades.includes(grade) }"
              @click="toggleGrade(grade)"
            >
              {{ grade }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "SearchBar",
  props: {
    filterState: { type: Object, required: true },
  },
  emits: ["update:filterState"],
  data() {
    return {
      localKeyword: this.filterState.keyword || "",
      subjects: [
        "语文",
        "数学",
        "英语",
        "物理",
        "化学",
        "生物",
        "历史",
        "地理",
      ],
      grades: [
        "一年级",
        "二年级",
        "三年级",
        "四年级",
        "五年级",
        "六年级",
        "七年级",
        "八年级",
        "九年级",
      ],
    };
  },
  watch: {
    "filterState.keyword"(newVal) {
      this.localKeyword = newVal;
    },
  },
  methods: {
    syncKeyword() {
      // Debounce could be added here
      this.$emit("update:filterState", {
        ...this.filterState,
        keyword: this.localKeyword,
      });
    },
    triggerSearch() {
      // Explicit search action if needed, currently syncKeyword handles it
      // But for UX, clicking search might scroll to results or similar
    },
    toggleSubject(subject) {
      let newSubjects = [...this.filterState.subjects];
      if (newSubjects.includes(subject)) {
        newSubjects = newSubjects.filter((s) => s !== subject);
      } else {
        // Single select for simplicity? Or multi?
        // Let's keep it simple: Single select for beginners might be easier,
        // but the current logic supports arrays. Let's stick to array but maybe behave like radio if that's simpler?
        // No, multi-select is fine if styled clearly.
        // Actually, for "simplest", usually you pick ONE subject.
        // Let's try single select behavior for "Quick Filters" to avoid confusion.
        newSubjects = [subject];
        if (this.filterState.subjects.includes(subject)) newSubjects = []; // Toggle off
      }

      this.$emit("update:filterState", {
        ...this.filterState,
        subjects: newSubjects,
      });
    },
    toggleGrade(grade) {
      let newGrades = [...this.filterState.grades];
      if (newGrades.includes(grade)) {
        newGrades = newGrades.filter((g) => g !== grade);
      } else {
        newGrades = [grade]; // Single select behavior
        if (this.filterState.grades.includes(grade)) newGrades = [];
      }

      this.$emit("update:filterState", {
        ...this.filterState,
        grades: newGrades,
      });
    },
  },
});
</script>

<style scoped>
.hero-search {
  background: transparent;
  padding: 0;
  border-radius: 0;
  margin-bottom: 0;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #2c3e50;
  margin-bottom: 10px;
}

[data-theme="dark"] .hero-title {
  color: #ffffff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.2rem;
  color: #596b7e;
  margin-bottom: 40px;
}

[data-theme="dark"] .hero-subtitle {
  color: #e0e4e8;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.search-box-wrapper {
  margin-bottom: 30px;
}

.search-box {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 50px;
  padding: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.search-box:focus-within {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.search-icon {
  font-size: 1.2rem;
  color: #999;
  margin-left: 20px;
  margin-right: 10px;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1.1rem;
  padding: 10px;
  color: #333;
}

.btn-search {
  background: #007bff;
  color: #fff;
  border: none;
  padding: 12px 35px;
  border-radius: 40px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-search:hover {
  background: #0056b3;
}

.quick-filters {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.filter-group {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-label {
  font-weight: 600;
  color: #555;
  margin-right: 5px;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.filter-chip {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.95rem;
  color: #555;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-chip:hover {
  background: #fff;
  transform: translateY(-1px);
}

.filter-chip.active {
  background: #007bff;
  color: #fff;
  border-color: #007bff;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);
}
</style>




