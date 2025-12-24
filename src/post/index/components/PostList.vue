<template>
  <div class="PostList my-3">
    <!-- 搜索和筛选面板 -->
    <div class="container filter-panel mb-4 p-3 bg-light rounded">
      <div class="row g-2">
        <div class="col-md-2">
          <label class="form-label small">年级</label>
          <input
            v-model="filters.grade"
            type="text"
            class="form-control form-control-sm"
            placeholder="如：二年级"
          />
        </div>
        <div class="col-md-2">
          <label class="form-label small">学科</label>
          <input
            v-model="filters.subject"
            type="text"
            class="form-control form-control-sm"
            placeholder="如：语文"
          />
        </div>
        <div class="col-md-2">
          <label class="form-label small">教材版本</label>
          <input
            v-model="filters.textbook_version"
            type="text"
            class="form-control form-control-sm"
            placeholder="如：人教版"
          />
        </div>
        <div class="col-md-2">
          <label class="form-label small">册别</label>
          <input
            v-model="filters.volume"
            type="text"
            class="form-control form-control-sm"
            placeholder="如：上册"
          />
        </div>
        <div class="col-md-2">
          <label class="form-label small">章节关键词</label>
          <input
            v-model="filters.chapter_keyword"
            type="text"
            class="form-control form-control-sm"
            placeholder="如：春天"
          />
        </div>
        <div class="col-md-2 d-flex align-items-end">
          <button @click="applyFilters" class="btn btn-primary btn-sm w-100">
            搜索
          </button>
          <button
            @click="clearFilters"
            class="btn btn-outline-secondary btn-sm w-100 ms-2"
          >
            重置
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading">加载中...</div>
    <div class="container">
      <!-- <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4"> -->
      <PostListItem
        v-for="resource in resources"
        :item="resource"
        :key="resource.id"
        class="shadow p-3 mb-5 bg-body rounded"
      />
      <!-- </div> -->
      <!-- <h1>{{ totalcount['x-total-count'] }}</h1> -->
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters, mapActions } from "vuex";
import PostListItem from "./PostListItem.vue";

export default defineComponent({
  name: "PostList",

  data() {
    return {
      filters: {
        grade: "",
        subject: "",
        textbook_version: "",
        volume: "",
        chapter_keyword: "",
      },
    };
  },

  async created() {
    this.getResources();
  },

  computed: {
    ...mapGetters({
      loading: "post/index/loading",
      resources: "post/index/resources",
      totalcount: "post/index/totalcount",
    }),
  },

  methods: {
    ...mapActions({
      getResources: "post/index/getResources",
    }),

    applyFilters() {
      // 构建查询参数
      const params = {};
      Object.keys(this.filters).forEach((key) => {
        if (this.filters[key].trim()) {
          params[key] = this.filters[key].trim();
        }
      });

      console.log("[PostList] 应用筛选，参数:", params);

      // 调用 API 获取过滤后的资源
      this.fetchFilteredResources(params);
    },

    clearFilters() {
      this.filters = {
        grade: "",
        subject: "",
        textbook_version: "",
        volume: "",
        chapter_keyword: "",
      };
      console.log("[PostList] 清除筛选");
      this.getResources();
    },

    async fetchFilteredResources(params) {
      this.$store.commit("post/index/setLoading", true);
      try {
        const { apiHttpClient } = await import("@/app/app.service");
        const response = await apiHttpClient.get("/api/resources", { params });
        console.log("[PostList] 过滤结果:", response.data);
        this.$store.commit("post/index/setResources", response.data);
      } catch (error) {
        console.error("[PostList] 过滤失败:", error);
      } finally {
        this.$store.commit("post/index/setLoading", false);
      }
    },
  },

  components: {
    PostListItem,
  },
});
</script>

<style scoped>
.filter-panel {
  border: 1px solid #dee2e6;
}
</style>
