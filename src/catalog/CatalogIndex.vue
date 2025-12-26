<template>
  <div class="catalog-index">
    <div class="container py-4">
      <!-- 页面标题 -->
      <div class="catalog-header mb-4">
        <h1 class="catalog-title">
          <i class="bi bi-book-half me-2"></i>教材目录
        </h1>
        <p class="catalog-subtitle text-muted">
          选择教材，浏览对应资源
        </p>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">加载中...</span>
        </div>
        <p class="mt-3 text-muted">正在加载教材目录...</p>
      </div>

      <!-- 教材选择流程 -->
      <div v-else class="catalog-selection">
        <!-- 1. 教育阶段 -->
        <div class="selection-step mb-4">
          <h3 class="step-title">
            <span class="step-number">1</span>
            选择教育阶段
          </h3>
          <div class="step-options">
            <button
              v-for="stage in educationStages"
              :key="stage"
              class="btn btn-outline-primary step-btn"
              :class="{ active: selectedStage === stage }"
              @click="selectStage(stage)"
            >
              {{ stage }}
            </button>
          </div>
        </div>

        <!-- 2. 学科 -->
        <div v-if="selectedStage" class="selection-step mb-4">
          <h3 class="step-title">
            <span class="step-number">2</span>
            选择学科
          </h3>
          <div class="step-options">
            <button
              v-for="subject in availableSubjects"
              :key="subject"
              class="btn btn-outline-primary step-btn"
              :class="{ active: selectedSubject === subject }"
              @click="selectSubject(subject)"
            >
              {{ subject }}
            </button>
          </div>
        </div>

        <!-- 3. 年级 -->
        <div v-if="selectedSubject" class="selection-step mb-4">
          <h3 class="step-title">
            <span class="step-number">3</span>
            选择年级
          </h3>
          <div class="step-options">
            <button
              v-for="grade in availableGrades"
              :key="grade"
              class="btn btn-outline-primary step-btn"
              :class="{ active: selectedGrade === grade }"
              @click="selectGrade(grade)"
            >
              {{ formatGrade(grade) }}
            </button>
          </div>
        </div>

        <!-- 4. 册别 -->
        <div v-if="selectedGrade" class="selection-step mb-4">
          <h3 class="step-title">
            <span class="step-number">4</span>
            选择册别
          </h3>
          <div class="step-options">
            <button
              v-for="volume in availableVolumes"
              :key="volume"
              class="btn btn-outline-primary step-btn"
              :class="{ active: selectedVolume === volume }"
              @click="selectVolume(volume)"
            >
              {{ volume }}
            </button>
          </div>
        </div>

        <!-- 5. 教材版本 -->
        <div v-if="selectedVolume" class="selection-step mb-4">
          <h3 class="step-title">
            <span class="step-number">5</span>
            选择教材版本
          </h3>
          <div class="step-options">
            <button
              v-for="version in availableVersions"
              :key="version"
              class="btn btn-outline-primary step-btn"
              :class="{ active: selectedVersion === version }"
              @click="selectVersion(version)"
            >
              {{ version }}
            </button>
          </div>
        </div>

        <!-- 进入资源按钮 -->
        <div v-if="selectedCatalog" class="catalog-action mt-4">
          <div class="selected-catalog-info mb-3 p-3 bg-light rounded">
            <h5 class="mb-2">已选择教材：</h5>
            <p class="mb-0">
              <strong>{{ selectedCatalog.education_level || selectedStage }}</strong>
              · {{ selectedCatalog.subject }}
              · {{ formatGrade(selectedCatalog.grade) }}
              · {{ selectedCatalog.volume }}
              · {{ selectedCatalog.textbook_version }}
            </p>
          </div>
          <button
            class="btn btn-primary btn-lg w-100"
            @click="goToResources"
            :disabled="!selectedCatalog"
          >
            <i class="bi bi-arrow-right-circle me-2"></i>
            进入资源列表
          </button>
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && catalogs.length === 0" class="text-center py-5">
          <i class="bi bi-inbox display-1 text-muted"></i>
          <p class="mt-3 text-muted">暂无教材目录数据</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { apiHttpClient } from "@/app/app.service";

export default defineComponent({
  name: "CatalogIndex",

  data() {
    return {
      catalogs: [], // 所有教材目录数据
      loading: false,
      selectedStage: "",
      selectedSubject: "",
      selectedGrade: "",
      selectedVolume: "",
      selectedVersion: "",
      selectedCatalog: null, // 最终选中的教材目录对象
    };
  },

  computed: {
    // 教育阶段列表（去重）
    educationStages() {
      const stages = this.catalogs
        .map((c) => c.education_level)
        .filter((s) => s && s.trim() !== "");
      return [...new Set(stages)].sort();
    },

    // 当前阶段下的学科列表（去重）
    availableSubjects() {
      if (!this.selectedStage) return [];
      return [
        ...new Set(
          this.catalogs
            .filter((c) => c.education_level === this.selectedStage)
            .map((c) => c.subject)
            .filter((s) => s && s.trim() !== "")
        ),
      ].sort();
    },

    // 当前学科下的年级列表（去重）
    availableGrades() {
      if (!this.selectedSubject) return [];
      return [
        ...new Set(
          this.catalogs
            .filter(
              (c) =>
                c.education_level === this.selectedStage &&
                c.subject === this.selectedSubject
            )
            .map((c) => c.grade)
            .filter((g) => g !== null && g !== undefined)
        ),
      ].sort((a, b) => a - b);
    },

    // 当前年级下的册别列表（去重）
    availableVolumes() {
      if (!this.selectedGrade) return [];
      return [
        ...new Set(
          this.catalogs
            .filter(
              (c) =>
                c.education_level === this.selectedStage &&
                c.subject === this.selectedSubject &&
                c.grade === this.selectedGrade
            )
            .map((c) => c.volume)
            .filter((v) => v && v.trim() !== "")
        ),
      ].sort();
    },

    // 当前册别下的教材版本列表（去重）
    availableVersions() {
      if (!this.selectedVolume) return [];
      return [
        ...new Set(
          this.catalogs
            .filter(
              (c) =>
                c.education_level === this.selectedStage &&
                c.subject === this.selectedSubject &&
                c.grade === this.selectedGrade &&
                c.volume === this.selectedVolume
            )
            .map((c) => c.textbook_version)
            .filter((v) => v && v.trim() !== "")
        ),
      ].sort();
    },
  },

  created() {
    this.fetchCatalogs();
  },

  methods: {
    /**
     * 获取教材目录数据
     */
    async fetchCatalogs() {
      this.loading = true;
      try {
        // 尝试多个可能的接口路径
        let response;
        try {
          response = await apiHttpClient.get("/api/catalogs");
        } catch (e) {
          // 如果 /api/catalogs 不存在，尝试 /api/textbook-catalog
          console.log("[CatalogIndex] /api/catalogs 不存在，尝试 /api/textbook-catalog");
          response = await apiHttpClient.get("/api/textbook-catalog");
        }

        console.log("[CatalogIndex] 响应数据:", response.data);

        // 处理不同的响应格式
        let catalogs = [];
        if (response.data) {
          if (response.data.data && Array.isArray(response.data.data)) {
            catalogs = response.data.data;
          } else if (response.data.catalogs && Array.isArray(response.data.catalogs)) {
            catalogs = response.data.catalogs;
          } else if (Array.isArray(response.data)) {
            catalogs = response.data;
          }
        }

        this.catalogs = catalogs;
        console.log("[CatalogIndex] 获取到教材目录数量:", this.catalogs.length);
      } catch (error) {
        console.error("[CatalogIndex] 获取教材目录失败:", error);
        const { notification } = await import("@/utils/notification");
        notification.error(
          error.response?.data?.message || error.message || "获取教材目录失败"
        );
      } finally {
        this.loading = false;
      }
    },

    /**
     * 选择教育阶段
     */
    selectStage(stage) {
      this.selectedStage = stage;
      // 清空下级选择
      this.selectedSubject = "";
      this.selectedGrade = "";
      this.selectedVolume = "";
      this.selectedVersion = "";
      this.selectedCatalog = null;
    },

    /**
     * 选择学科
     */
    selectSubject(subject) {
      this.selectedSubject = subject;
      // 清空下级选择
      this.selectedGrade = "";
      this.selectedVolume = "";
      this.selectedVersion = "";
      this.selectedCatalog = null;
    },

    /**
     * 选择年级
     */
    selectGrade(grade) {
      this.selectedGrade = grade;
      // 清空下级选择
      this.selectedVolume = "";
      this.selectedVersion = "";
      this.selectedCatalog = null;
    },

    /**
     * 选择册别
     */
    selectVolume(volume) {
      this.selectedVolume = volume;
      // 清空下级选择
      this.selectedVersion = "";
      this.selectedCatalog = null;
    },

    /**
     * 选择教材版本
     */
    selectVersion(version) {
      this.selectedVersion = version;
      // 找到对应的 catalog 对象
      this.selectedCatalog = this.catalogs.find(
        (c) =>
          c.education_level === this.selectedStage &&
          c.subject === this.selectedSubject &&
          c.grade === this.selectedGrade &&
          c.volume === this.selectedVolume &&
          c.textbook_version === version
      );
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
    goToResources() {
      if (!this.selectedCatalog) {
        return;
      }

      // 构建查询参数
      const query = {};

      // 优先使用 catalog_id（如果后端支持）
      if (this.selectedCatalog.id) {
        query.catalog_id = this.selectedCatalog.id;
      } else {
        // 否则使用详细筛选参数
        if (this.selectedCatalog.subject) {
          query.subject = this.selectedCatalog.subject;
        }
        if (this.selectedCatalog.grade) {
          query.grade = this.formatGrade(this.selectedCatalog.grade);
        }
        if (this.selectedCatalog.volume) {
          query.volume = this.selectedCatalog.volume;
        }
        if (this.selectedCatalog.textbook_version) {
          query.textbook_version = this.selectedCatalog.textbook_version;
        }
      }

      // 跳转到资源列表页
      this.$router.push({
        path: "/resources",
        query,
      });
    },
  },
});
</script>

<style scoped>
.catalog-index {
  min-height: calc(100vh - 200px);
  background: var(--bg, #ffffff);
}

.catalog-header {
  text-align: center;
  padding: 2rem 0;
}

.catalog-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--text, #212529);
  margin-bottom: 0.5rem;
}

.catalog-subtitle {
  font-size: 1.1rem;
}

.catalog-selection {
  max-width: 1000px;
  margin: 0 auto;
}

.selection-step {
  background: var(--surface, #ffffff);
  border: 1px solid var(--border, #e9ecef);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow, 0 2px 8px rgba(0, 0, 0, 0.05));
}

.step-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text, #212529);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--primary, #4f8cff);
  color: white;
  border-radius: 50%;
  font-size: 0.9rem;
  font-weight: 600;
}

.step-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.step-btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 8px;
  transition: all 0.2s;
  border-width: 2px;
}

.step-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 140, 255, 0.2);
}

.step-btn.active {
  background: var(--primary, #4f8cff);
  border-color: var(--primary, #4f8cff);
  color: white;
}

.catalog-action {
  max-width: 600px;
  margin: 0 auto;
}

.selected-catalog-info {
  background: var(--surface, #f8f9fa);
  border: 1px solid var(--border, #e9ecef);
}

.selected-catalog-info h5 {
  color: var(--text, #212529);
  font-weight: 600;
}

.selected-catalog-info p {
  color: var(--text, #212529);
  font-size: 1.1rem;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
}

/* 深色主题适配 */
[data-theme="dark"] .catalog-index {
  background: var(--bg, #1a1d29);
}

[data-theme="dark"] .catalog-title {
  color: #ffffff;
}

[data-theme="dark"] .selection-step {
  background: var(--surface, #1e222d);
  border-color: rgba(255, 255, 255, 0.15);
}

[data-theme="dark"] .step-title {
  color: #ffffff;
}

[data-theme="dark"] .selected-catalog-info {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
}

[data-theme="dark"] .selected-catalog-info h5,
[data-theme="dark"] .selected-catalog-info p {
  color: #ffffff;
}
</style>

