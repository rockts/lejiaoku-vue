<template>
  <form
    class="form-inline my-2 my-lg-0 header-search-form"
    @submit.prevent="onSearch"
  >
    <div class="input-group">
      <input
        class="form-control"
        type="search"
        placeholder="搜索资源..."
        aria-label="Search"
        v-model.trim="keyword"
      />
      <div class="input-group-append">
        <button class="btn btn-outline-secondary" type="submit">
          <i class="bi bi-search"></i>
        </button>
      </div>
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
      }
    },
  },
});
</script>

<style scoped>
.header-search-form {
  margin-right: 15px;
}
.header-search-form .form-control {
  border-radius: 20px 0 0 20px;
  border-right: none;
  width: 200px;
  font-size: 14px;
}
.header-search-form .btn {
  border-radius: 0 20px 20px 0;
  border-left: none;
  border-color: #ced4da;
}
.header-search-form .btn:hover {
  background-color: #f8f9fa;
  color: #333;
}
</style>
