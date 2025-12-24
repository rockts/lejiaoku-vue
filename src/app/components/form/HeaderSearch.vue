<template>
  <form
    class="form-inline my-2 my-lg-0 header-search-form"
    @submit.prevent="onSearch"
  >
    <div class="search-wrapper">
      <i class="bi bi-search search-icon"></i>
      <input
        class="search-input"
        type="search"
        placeholder="搜索资源..."
        aria-label="Search"
        v-model.trim="keyword"
      />
      <button class="search-btn" type="submit" v-if="keyword">
        <i class="bi bi-arrow-right"></i>
      </button>
    </div>
  </form>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "HeaderSearch",
  data() {
    return {
      keyword: "",
    };
  },
  methods: {
    onSearch() {
      if (this.keyword) {
        this.$router.push({ path: "/", query: { q: this.keyword } });
        this.keyword = "";
      }
    },
  },
});
</script>

<style scoped>
.header-search-form {
  margin-right: 15px;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #6c757d;
  pointer-events: none;
  z-index: 1;
}

.search-input {
  padding: 8px 40px 8px 36px;
  border: 1px solid #e0e0e0;
  border-radius: 24px;
  width: 240px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
}

.search-input:focus {
  outline: none;
  border-color: #4f8cff;
  box-shadow: 0 0 0 3px rgba(79, 140, 255, 0.1);
  width: 280px;
}

.search-input::placeholder {
  color: #adb5bd;
}

.search-btn {
  position: absolute;
  right: 4px;
  background: #4f8cff;
  border: none;
  border-radius: 20px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-btn:hover {
  background: #3b7ae8;
  transform: scale(1.05);
}

.search-btn i {
  font-size: 14px;
}

/* 暗色主题适配 */
[data-theme="dark"] .search-input {
  background: rgba(40, 40, 40, 0.9);
  border-color: #404040;
  color: #e0e0e0;
}

[data-theme="dark"] .search-input:focus {
  border-color: #5a9eff;
  box-shadow: 0 0 0 3px rgba(90, 158, 255, 0.15);
}

[data-theme="dark"] .search-icon {
  color: #adb5bd;
}
</style>
