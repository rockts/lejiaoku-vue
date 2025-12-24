<template>
  <bread-crumbs />

  <div class="resource-page" v-if="showResource">
    <div class="container resource-wrapper">
      <!-- 1. 资源基础信息 -->
      <section class="card section">
        <div class="section-header">
          <div>
            <h2 class="title">{{ resource.title }}</h2>
            <div class="meta">
              <span class="badge">{{ resource.category || "未分类" }}</span>
              <span class="tag">{{ resource.file_format || "文件" }}</span>
            </div>
          </div>
          <a
            class="btn btn-primary"
            :href="downloadUrl"
            target="_blank"
            rel="noopener"
          >
            下载
          </a>
        </div>
      </section>

      <!-- 2. 教材目录绑定信息 -->
      <section v-if="catalogInfo" class="card section">
        <h5 class="section-title">
          {{ catalogInfo.isCatalog ? "📚 所属教材" : "📚 AI识别教材" }}
        </h5>
        <p class="text-muted mb-2">
          {{ catalogInfo.version }} · {{ catalogInfo.subject }} ·
          {{ catalogInfo.grade }} · {{ catalogInfo.volume }}
        </p>
        <ul v-if="catalogInfo.units?.length" class="structure">
          <li v-for="(unit, idx) in catalogInfo.units" :key="idx">
            {{ unit }}
          </li>
        </ul>
      </section>

      <!-- 3. 教材结构（只读） -->
      <section v-if="resource.auto_meta_result" class="card section">
        <h5 class="section-title">教材结构</h5>
        <p class="text-muted mb-2">
          📘
          {{ resource.auto_meta_result.textbook_info?.version || "-" }} ·
          {{ resource.auto_meta_result.textbook_info?.subject || "-" }} ·
          {{ resource.auto_meta_result.textbook_info?.grade || "-" }} ·
          {{ resource.auto_meta_result.textbook_info?.volume || "-" }}
        </p>
        <ul
          v-if="resource.auto_meta_result.textbook_structure?.length"
          class="structure"
        >
          <li
            v-for="unit in resource.auto_meta_result.textbook_structure"
            :key="unit.id || unit.name"
          >
            {{ unit.name }}
          </li>
        </ul>
      </section>

      <!-- 4. 资源说明 -->
      <section v-if="resource.description" class="card section">
        <h5 class="section-title">资源说明</h5>
        <p class="text-body">{{ resource.description }}</p>
      </section>
    </div>
  </div>

  <div v-else class="container my-4 text-center text-muted">加载中...</div>
</template>

<script>
import { defineComponent } from "vue";
import BreadCrumbs from "@/app/components/BreadCrumbs.vue";
import { API_BASE_URL } from "@/app/app.config";
import { apiHttpClient } from "@/app/app.service";

export default defineComponent({
  title() {
    if (this.showResource) {
      return this.resource.title;
    }
  },

  props: {
    id: String,
  },

  data() {
    return {
      resource: null, // 只读资源数据
      loading: false, // 加载状态
    };
  },

  created() {
    this.getResourceById(this.id);
  },

  computed: {
    downloadUrl() {
      if (!this.resource?.file_url) return "";
      if (this.resource.file_url.startsWith("http"))
        return this.resource.file_url;
      return `${API_BASE_URL}${this.resource.file_url}`;
    },

    showResource() {
      return !this.loading && this.resource;
    },

    catalogInfo() {
      console.log("[catalogInfo] 开始计算，resource:", this.resource);
      
      // 优先级1：如果存在 catalog_info，显示所属教材
      if (this.resource?.catalog_info) {
        console.log("[catalogInfo] 使用 catalog_info");
        return {
          isCatalog: true,
          version: this.resource.catalog_info.version || "-",
          subject: this.resource.catalog_info.subject || "-",
          grade: this.resource.catalog_info.grade || "-",
          volume: this.resource.catalog_info.volume || "-",
          units: null, // catalog_info 不显示单元列表
        };
      }

      // 优先级2：如果存在 auto_meta_result，显示 AI 识别教材
      if (this.resource?.auto_meta_result?.textbook_info) {
        console.log("[catalogInfo] 使用 auto_meta_result");
        const textbookInfo = this.resource.auto_meta_result.textbook_info;
        const units =
          this.resource.auto_meta_result.textbook_structure?.map(
            (unit) => unit.name
          ) || [];

        return {
          isCatalog: false,
          version: textbookInfo.version || "-",
          subject: textbookInfo.subject || "-",
          grade: textbookInfo.grade || "-",
          volume: textbookInfo.volume || "-",
          units: units.length > 0 ? units : null,
        };
      }

      // 都不存在，返回 null（区块不显示）
      console.log("[catalogInfo] 都不存在，返回 null");
      return null;
    },
  },

  methods: {
    async getResourceById(resourceId) {
      this.loading = true;
      try {
        const response = await apiHttpClient.get(
          `/api/resources/${resourceId}`
        );
        this.resource = response.data;
        
        // 详细日志输出
        console.log("resource detail:", this.resource);
        console.log("auto_meta_result:", this.resource?.auto_meta_result);
        console.log("catalog_info:", this.resource?.catalog_info);
      } catch (error) {
        console.error("[PostShow] 获取资源详情失败:", error);
      } finally {
        this.loading = false;
      }
    },
  },

  components: {
    BreadCrumbs,
  },
});
</script>

<style scoped>
.resource-wrapper {
  max-width: 960px;
}

.section {
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid var(--border, #e9ecef);
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.04);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.title {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 700;
}

.meta {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.badge {
  background: var(--primary, #3b82f6);
  color: #fff;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.tag {
  background: #f1f5f9;
  color: #475569;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  border: 1px solid #e2e8f0;
}

.section-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
}

.structure {
  margin: 0;
  padding-left: 18px;
  color: #475569;
}

.structure li {
  margin-bottom: 4px;
}

.text-body {
  margin: 0;
  color: #1f2937;
  line-height: 1.6;
}
</style>
