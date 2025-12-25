/* 资源详情页封面图片自适应且居中 */
.cover {
  width: 150px;
  height: 200px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border, #e9ecef);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}
.cover img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
  background: #fff;
  margin: auto;
}
.resource-cover-full {
  width: 100%;
  height: 240px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border, #e9ecef);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}
.resource-cover-full img {
  max-width: 100%;
  max-height: 100%;
  display: block;
  background: #fff;
  margin: auto;
}
.resource-cover-full img.fit-cover { object-fit: cover; object-position: center; }
.resource-cover-full img.fit-contain { object-fit: contain; object-position: center; }
.resource-cover-full .placeholder-icon { font-size: 48px; color: var(--muted); opacity: 0.3; }

@media (max-width: 768px) {
  .resource-cover-full { height: 160px; }
}
.resource-cover-full img {
  max-width: 100%;
  max-height: 100%;
  display: block;
  background: #fff;
  margin: auto;
}
.resource-cover-full img.fit-cover { object-fit: cover; object-position: center; }
.resource-cover-full img.fit-contain { object-fit: contain; object-position: center; }
.resource-cover-full .placeholder-icon { font-size: 48px; color: var(--muted); opacity: 0.3; }
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
            resourceCoverURL() {
              if (this.resource?.cover_url) {
                // 如果是完整外部 URL，直接使用（无法加 size 参数）
                if (this.resource.cover_url.startsWith('http')) return this.resource.cover_url;
                // 内部路径，追加 size=large 以获取合适分辨率
                return `${API_BASE_URL}${this.resource.cover_url}?size=large`;
              }
              if (this.resource?.cover?.id) return `${API_BASE_URL}/covers/${this.resource.cover.id}?size=large`;
              return '';
              rel="noopener"
            >
              下载
            </a>
            <!-- 编辑按钮：仅权限用户显示 -->
            <button
              v-if="canEdit"
              type="button"
              class="btn btn-outline-secondary ms-2"
              @click="$router.push(`/resources/${id}/edit`)"
            >
              <i class="bi bi-pencil"></i> 编辑
            </button>
            <!-- 删除按钮：仅权限用户显示 -->
            <button
              v-if="canDelete"
              type="button"
              class="btn btn-outline-danger ms-2"
              @click="handleDelete"
              :disabled="isDeleting"
            >
              <span v-if="isDeleting">
                <span
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                删除中...
              </span>
              <span v-else> <i class="bi bi-trash"></i> 删除 </span>
            </button>
          </div>
        </div>
        <!-- 封面展示（宽度100%，高度固定） -->
        <div class="resource-cover-full">
          <template v-if="resource.cover_url || resource.cover?.id">
            <img
              :src="resourceCoverURL"
              :alt="resource.title"
              @load="onCoverLoad"
              :class="coverClass"
            />
          </template>
          <template v-else>
            <div class="placeholder-icon">
              <i class="bi bi-file-earmark"></i>
            </div>
          </template>
        </div>
      </section>

      <!-- 教材信息（直接展示 auto_meta_result）-->
      <section v-if="resource.auto_meta_result" class="card section">
        <h5 class="section-title">【教材信息】</h5>
        <p class="text-muted mb-2">
          {{ resource.auto_meta_result.textbook_version || "-" }} ·
          {{ resource.auto_meta_result.subject || "-" }} ·
          {{ resource.auto_meta_result.grade || "-"
          }}{{ resource.auto_meta_result.volume || "" }}
        </p>
        <div v-if="resource.auto_meta_result.structure">
          <p class="mb-1"><strong>单元列表：</strong></p>
          <ul class="structure">
            <li
              v-for="(item, idx) in resource.auto_meta_result.structure"
              :key="idx"
            >
              {{ item.unit }}：{{ item.title }}
            </li>
          </ul>
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
      isDeleting: false, // 删除中状态
      coverFit: "cover",
    };
  },

  created() {
    this.getResourceById(this.id);
  },

  computed: {
    resourceCoverURL() {
      if (this.resource?.cover_url) {
        if (this.resource.cover_url.startsWith("http"))
          return this.resource.cover_url;
        return `${API_BASE_URL}${this.resource.cover_url}`;
      }
      if (this.resource?.cover?.id)
        return `${API_BASE_URL}/covers/${this.resource.cover.id}`;
      return "";
    },
    coverClass() {
      return this.coverFit === "contain" ? "fit-contain" : "fit-cover";
    },
    downloadUrl() {
      if (!this.resource?.file_url) return "";
      if (this.resource.file_url.startsWith("http"))
        return this.resource.file_url;
      return `${API_BASE_URL}${this.resource.file_url}`;
    },

    showResource() {
      return !this.loading && this.resource;
    },

    // 检查当前用户是否可以编辑
    canEdit() {
      const user = this.$store.state.auth?.user;
      if (!user) return false;
      // 管理员或资源创建者可以编辑
      return (
        user.role === "admin" ||
        user.id === this.resource?.creator_id ||
        user.username === this.resource?.creator
      );
    },

    // 检查当前用户是否可以删除
    canDelete() {
      const user = this.$store.state.auth?.user;
      if (!user) return false;
      // 管理员或资源创建者可以删除
      return (
        user.role === "admin" ||
        user.id === this.resource?.creator_id ||
        user.username === this.resource?.creator
      );
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

    onCoverLoad(e) {
      try {
        const img = e.target;
        const ratio = img.naturalWidth / img.naturalHeight;
        this.coverFit = ratio < 0.9 ? "contain" : "cover";
      } catch (err) {
        this.coverFit = "cover";
      }
    },

    async handleDelete() {
      if (!confirm("确定要删除这个资源吗？此操作不可撤销。")) {
        return;
      }

      this.isDeleting = true;

      try {
        console.log("[PostShow] 删除资源，ID:", this.id);
        await apiHttpClient.delete(`/api/resources/${this.id}`);
        console.log("[PostShow] 资源删除成功");
        this.$router.push("/resources");
        // 显示成功提示
        this.$store.commit("post/index/setResources", []); // 重置列表
      } catch (error) {
        console.error("[PostShow] 删除失败:", error);
        alert("删除失败：" + (error.response?.data?.message || error.message));
      } finally {
        this.isDeleting = false;
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
  align-items: flex-start;
  gap: 12px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
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

.cover img {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  object-position: center;
  display: block;
}
</style>
