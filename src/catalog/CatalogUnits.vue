<template>
  <div class="catalog-units">
    <div class="container py-4">
      <!-- 面包屑导航 -->
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/catalog">教材目录</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            {{ catalogInfo.displayName || "教材章节" }}
          </li>
        </ol>
      </nav>

      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">加载中...</span>
        </div>
        <p class="mt-3 text-muted">正在加载教材章节...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="text-center py-5">
        <i class="bi bi-exclamation-triangle display-1 text-danger"></i>
        <p class="mt-3 text-danger">{{ error }}</p>
        <router-link to="/catalog" class="btn btn-primary mt-3">
          <i class="bi bi-arrow-left me-2"></i>返回教材目录
        </router-link>
      </div>

      <!-- 教材章节内容 -->
      <div v-else-if="catalogInfo">
        <!-- Catalog 级行为按钮 -->
        <div v-if="catalogInfo.view_state && catalogInfo.view_state !== 'no_action'" class="catalog-action-top mb-4">
          <button
            v-if="catalogInfo.view_state === 'add_resources'"
            class="btn btn-primary btn-lg"
            @click="createCatalogTask('add_resources')"
            :disabled="creatingTask"
          >
            <i class="bi bi-plus-circle me-2"></i>补充教材资源
          </button>
          <button
            v-else-if="catalogInfo.view_state === 'organize_units'"
            class="btn btn-primary btn-lg"
            @click="createCatalogTask('organize_units')"
            :disabled="creatingTask"
          >
            <i class="bi bi-list-check me-2"></i>整理教材单元
          </button>
        </div>

        <!-- 教材信息展示（只读） -->
        <div class="catalog-info-card mb-4">
          <div class="card">
            <div class="card-body">
              <h2 class="card-title mb-3">
                <i class="bi bi-book-half me-2"></i>
                {{ catalogInfo.displayName }}
              </h2>
              <div class="catalog-meta">
                <span class="badge bg-primary me-2">
                  {{ catalogInfo.subject || "未知学科" }}
                </span>
                <span class="badge bg-info me-2">
                  {{ formatGrade(catalogInfo.grade) }}
                </span>
                <span class="badge bg-warning me-2">
                  {{ catalogInfo.volume || "未知册别" }}
                </span>
                <span class="badge bg-success">
                  {{ catalogInfo.textbook_version || "未知版本" }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 单元列表 -->
        <div class="units-section">
          <h3 class="section-title mb-4">
            <i class="bi bi-list-ul me-2"></i>选择单元
          </h3>

          <div v-if="units.length === 0" class="text-center py-5">
            <i class="bi bi-inbox display-1 text-muted"></i>
            <p class="mt-3 text-muted">该教材暂无单元信息</p>
            <p class="text-muted small">
              可能该教材尚未绑定资源，或资源中未包含单元信息
            </p>
          </div>

          <div v-else class="units-grid">
            <div
              v-for="(unit, index) in units"
              :key="index"
              class="unit-card"
              @click="goToResources(unit)"
            >
              <div class="unit-card-body">
                <div class="unit-number">
                  <span class="unit-index">{{ index + 1 }}</span>
                </div>
                <div class="unit-content">
                  <h4 class="unit-title">{{ unit.name || unit.unit || unit.title }}</h4>
                  <p v-if="unit.title && unit.name !== unit.title" class="unit-subtitle text-muted">
                    {{ unit.title }}
                  </p>
                </div>
                <div class="unit-actions">
                  <button
                    v-if="unit.unit_state === 'empty' || unit.unit_state === 'sparse'"
                    class="btn btn-sm btn-outline-primary unit-action-btn"
                    @click.stop="createUnitTask(unit)"
                    :disabled="creatingTask"
                  >
                    <i class="bi bi-plus-circle me-1"></i>补充资源
                  </button>
                  <div v-else class="unit-arrow">
                    <i class="bi bi-arrow-right"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { apiHttpClient } from "@/app/app.service";

export default defineComponent({
  name: "CatalogUnits",

  props: {
    catalogId: {
      type: [String, Number],
      required: true,
    },
  },

  data() {
    return {
      loading: false,
      error: null,
      catalogInfo: null,
      units: [], // 单元列表
      creatingTask: false, // 创建任务中
    };
  },

  created() {
    this.fetchCatalogData();
  },

  watch: {
    catalogId: {
      handler() {
        this.fetchCatalogData();
      },
      immediate: false,
    },
  },

  methods: {
    /**
     * 获取教材数据
     */
    async fetchCatalogData() {
      this.loading = true;
      this.error = null;

      try {
        // 1. 优先从 catalog 接口获取
        let catalogData = null;
        try {
          const response = await apiHttpClient.get(`/api/catalogs/${this.catalogId}`);
          console.log("[CatalogUnits] Catalog API 响应:", response.data);

          // 处理不同的响应格式
          if (response.data) {
            if (response.data.data) {
              catalogData = response.data.data;
            } else if (response.data.catalog) {
              catalogData = response.data.catalog;
            } else {
              catalogData = response.data;
            }
          }
        } catch (error) {
          console.warn("[CatalogUnits] Catalog API 失败，尝试从资源中提取:", error);
        }

        // 2. 如果 catalog 接口返回了数据
        if (catalogData) {
          this.catalogInfo = {
            id: catalogData.id || this.catalogId,
            subject: catalogData.subject,
            grade: catalogData.grade,
            volume: catalogData.volume,
            textbook_version: catalogData.textbook_version,
            education_level: catalogData.education_level,
            displayName: this.buildDisplayName(catalogData),
            view_state: catalogData.view_state || null,
            action_hint: catalogData.action_hint || null,
          };

          // 尝试从 catalog 数据中提取 units
          if (catalogData.units && Array.isArray(catalogData.units)) {
            this.units = catalogData.units.map((u, idx) => ({
              name: typeof u === "string" ? u : u.name || u.unit || u.title,
              title: typeof u === "string" ? null : u.title || null,
              index: idx,
              unit_state: typeof u === "object" ? u.unit_state : null,
            }));
            console.log("[CatalogUnits] 从 catalog 数据中提取到单元:", this.units);
          } else if (catalogData.structure && Array.isArray(catalogData.structure)) {
            this.units = catalogData.structure.map((s, idx) => ({
              name: s.name || s.unit || s.title,
              title: s.title || null,
              index: idx,
              unit_state: s.unit_state || null,
            }));
            console.log("[CatalogUnits] 从 catalog structure 中提取到单元:", this.units);
          } else if (catalogData.chapters && Array.isArray(catalogData.chapters)) {
            this.units = catalogData.chapters.map((c, idx) => ({
              name: c.name || c.unit || c.title,
              title: c.title || null,
              index: idx,
              unit_state: c.unit_state || null,
            }));
            console.log("[CatalogUnits] 从 catalog chapters 中提取到单元:", this.units);
          } else {
            // catalog 没有单元信息，从资源中提取
            await this.extractUnitsFromResources();
          }
        } else {
          // catalog 接口失败，从资源中提取
          this.catalogInfo = {
            id: this.catalogId,
            subject: null,
            grade: null,
            volume: null,
            textbook_version: null,
            education_level: null,
            displayName: `教材 #${this.catalogId}`,
          };
          await this.extractUnitsFromResources();
        }
      } catch (error) {
        console.error("[CatalogUnits] 获取教材数据失败:", error);
        this.error =
          error.response?.data?.message ||
          error.message ||
          "获取教材数据失败";
      } finally {
        this.loading = false;
      }
    },

    /**
     * 从已绑定该 catalog 的资源中提取单元信息
     * 只从 resource.unit 字段提取，不再推断
     */
    async extractUnitsFromResources() {
      try {
        console.log("[CatalogUnits] 从资源中提取单元信息，catalogId:", this.catalogId);

        // 获取已绑定该 catalog 的资源
        const response = await apiHttpClient.get("/api/resources", {
          params: {
            catalog_id: this.catalogId,
            limit: 1000, // 获取足够多的资源以提取单元信息
          },
        });

        console.log("[CatalogUnits] 资源列表响应:", response.data);

        // 处理不同的响应格式
        let resources = [];
        if (response.data) {
          if (response.data.data && Array.isArray(response.data.data)) {
            resources = response.data.data;
          } else if (response.data.resources && Array.isArray(response.data.resources)) {
            resources = response.data.resources;
          } else if (Array.isArray(response.data)) {
            resources = response.data;
          }
        }

        // 只处理已绑定 catalog 的资源
        resources = resources.filter(
          (r) => r.catalog_id === Number(this.catalogId) || r.catalog_id === String(this.catalogId)
        );

        console.log("[CatalogUnits] 已绑定 catalog 的资源数量:", resources.length);

        // 只从 resource.unit 字段提取单元信息
        const unitSet = new Set();
        const unitMap = new Map();

        resources.forEach((resource) => {
          // 只使用 resource.unit 字段
          if (resource.unit && String(resource.unit).trim() !== "") {
            const unitName = String(resource.unit).trim();
            unitSet.add(unitName);
            if (!unitMap.has(unitName)) {
              unitMap.set(unitName, {
                name: unitName,
                title: null, // unit 字段不包含 title
              });
            }
          }
        });

        // 转换为数组并排序
        this.units = Array.from(unitMap.values()).sort((a, b) => {
          // 尝试按单元名称中的数字排序
          const aNum = parseInt(a.name.match(/\d+/)?.[0] || "999");
          const bNum = parseInt(b.name.match(/\d+/)?.[0] || "999");
          return aNum - bNum;
        });

        console.log("[CatalogUnits] 从 resource.unit 字段提取到单元:", this.units);

        // 如果从资源中提取到了 catalog 信息，更新 catalogInfo
        if (resources.length > 0) {
          const firstResource = resources[0];
          if (firstResource.catalog_info) {
            this.catalogInfo = {
              ...this.catalogInfo,
              subject: firstResource.catalog_info.subject || this.catalogInfo.subject,
              grade: firstResource.catalog_info.grade || this.catalogInfo.grade,
              volume: firstResource.catalog_info.volume || this.catalogInfo.volume,
              textbook_version:
                firstResource.catalog_info.version ||
                firstResource.catalog_info.textbook_version ||
                this.catalogInfo.textbook_version,
              displayName: this.buildDisplayName(firstResource.catalog_info),
            };
          }
        }
      } catch (error) {
        console.error("[CatalogUnits] 从资源中提取单元失败:", error);
        // 不抛出错误，只是没有单元信息
        this.units = [];
      }
    },

    /**
     * 构建显示名称
     */
    buildDisplayName(catalog) {
      const parts = [];
      if (catalog.subject) parts.push(catalog.subject);
      if (catalog.grade) parts.push(this.formatGrade(catalog.grade));
      if (catalog.volume) parts.push(catalog.volume);
      if (catalog.textbook_version) parts.push(catalog.textbook_version);
      return parts.join(" · ") || `教材 #${catalog.id || this.catalogId}`;
    },

    /**
     * 格式化年级显示
     */
    formatGrade(grade) {
      if (typeof grade === "number") {
        const gradeNames = [
          "",
          "一年级",
          "二年级",
          "三年级",
          "四年级",
          "五年级",
          "六年级",
          "七年级",
          "八年级",
          "九年级",
          "高一",
          "高二",
          "高三",
        ];
        return gradeNames[grade] || `${grade}年级`;
      }
      return grade;
    },

    /**
     * 跳转到资源列表页
     */
    goToResources(unit) {
      const query = {
        catalog_id: this.catalogId,
        unit: unit.name, // 使用单元名称
      };

      // 如果单元有索引，也可以传递
      if (unit.index !== undefined) {
        query.unit_index = unit.index;
      }

      console.log("[CatalogUnits] 跳转到资源列表，query:", query);

      this.$router.push({
        path: "/resources",
        query,
      });
    },
  },
});
</script>

<style scoped>
.catalog-units {
  min-height: calc(100vh - 200px);
  background: var(--bg, #ffffff);
}

.catalog-info-card .card {
  border: 1px solid var(--border, #e9ecef);
  border-radius: 12px;
  box-shadow: var(--shadow, 0 2px 8px rgba(0, 0, 0, 0.05));
}

.catalog-info-card .card-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text, #212529);
  margin-bottom: 0;
}

.catalog-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text, #212529);
}

.units-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.unit-card {
  background: var(--surface, #ffffff);
  border: 2px solid var(--border, #e9ecef);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
}

.unit-card:hover {
  border-color: var(--primary, #4f8cff);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 140, 255, 0.15);
}

.unit-card-body {
  display: flex;
  align-items: center;
  padding: 1.25rem;
  gap: 1rem;
}

.unit-number {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background: var(--primary, #4f8cff);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.unit-content {
  flex: 1;
  min-width: 0;
}

.unit-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text, #212529);
  margin: 0 0 0.25rem 0;
  word-break: break-word;
}

.unit-subtitle {
  font-size: 0.9rem;
  margin: 0;
  word-break: break-word;
}

.unit-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.unit-arrow {
  color: var(--muted, #6c757d);
  font-size: 1.25rem;
  transition: all 0.2s;
}

.unit-card:hover .unit-arrow {
  color: var(--primary, #4f8cff);
  transform: translateX(4px);
}

.unit-action-btn {
  white-space: nowrap;
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
}

.catalog-action-top {
  text-align: center;
}

/* 深色主题适配 */
[data-theme="dark"] .catalog-units {
  background: var(--bg, #1a1d29);
}

[data-theme="dark"] .catalog-info-card .card {
  background: var(--surface, #1e222d);
  border-color: rgba(255, 255, 255, 0.15);
}

[data-theme="dark"] .catalog-info-card .card-title {
  color: #ffffff;
}

[data-theme="dark"] .section-title {
  color: #ffffff;
}

[data-theme="dark"] .unit-card {
  background: var(--surface, #1e222d);
  border-color: rgba(255, 255, 255, 0.15);
}

[data-theme="dark"] .unit-card:hover {
  border-color: var(--primary, #4f8cff);
}

[data-theme="dark"] .unit-title {
  color: #ffffff;
}

[data-theme="dark"] .unit-subtitle {
  color: rgba(255, 255, 255, 0.7);
}
</style>

