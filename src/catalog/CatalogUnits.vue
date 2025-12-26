<template>
  <div class="catalog-units">
    <div class="container pb-3">
      <!-- 面包屑导航 -->
      <nav aria-label="breadcrumb" class="mb-2">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item">
            <router-link to="/catalog">教材目录</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            {{ catalogInfo.displayName || `教材 #${catalogId}` }}
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
        <p class="text-muted small mt-2">
          当前 catalogId: {{ catalogId }}
        </p>
        <div class="mt-4">
          <button 
            class="btn btn-outline-primary me-2" 
            @click="fetchCatalogData"
            :disabled="loading"
          >
            <i class="bi bi-arrow-clockwise me-2"></i>重试
          </button>
          <router-link to="/catalog" class="btn btn-primary">
            <i class="bi bi-arrow-left me-2"></i>返回教材目录
          </router-link>
        </div>
      </div>

      <!-- 教材章节内容 -->
      <div v-else-if="catalogInfo">
        <!-- 从任务跳转提示 -->
        <div v-if="fromTaskId" class="alert alert-info mb-3">
          <div class="d-flex justify-content-between align-items-start">
            <div class="flex-grow-1">
              <i class="bi bi-info-circle me-2"></i>
              <strong>来自任务：</strong>你正在查看任务关联的教材
              <span v-if="targetUnit">，目标单元：<strong>{{ targetUnit }}</strong></span>
              <div class="mt-2">
                <div v-if="!catalogInfo.view_state || catalogInfo.view_state === 'no_action'" class="task-guide">
                  <p class="mb-1"><strong>如何执行任务：</strong></p>
                  <ul class="mb-0 small">
                    <li v-if="fromTaskId">
                      <strong>补充教材资源：</strong>点击下方的"补充教材资源"按钮创建任务，或点击"上传资源"按钮直接上传资源
                    </li>
                    <li v-if="fromTaskId">
                      <strong>整理教材单元：</strong>点击下方的"整理教材单元"按钮创建任务，然后上传包含单元信息的资源，系统会自动提取单元结构
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <router-link to="/me/tasks" class="btn btn-sm btn-outline-primary ms-3">
              <i class="bi bi-arrow-left me-1"></i>返回我的任务
            </router-link>
          </div>
        </div>
        
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
        
        <!-- 备用按钮：当 view_state 为空时，显示通用任务创建按钮 -->
        <div v-else-if="!catalogInfo.view_state || catalogInfo.view_state === 'no_action'" class="catalog-action-top mb-2">
          <div class="alert alert-light border">
            <h6 class="alert-heading mb-2">
              <i class="bi bi-lightbulb me-2"></i>执行任务
            </h6>
            <p class="mb-2 small">该教材暂无单元信息，建议先整理单元结构，再补充资源内容。</p>
            <div class="d-flex gap-2 mb-2">
              <button
                class="btn btn-primary"
                @click="goToUpload"
                title="直接上传资源（推荐）"
              >
                <i class="bi bi-cloud-upload me-2"></i>上传资源
              </button>
              <button
                class="btn btn-outline-primary"
                @click="createCatalogTask('organize_units')"
                :disabled="creatingTask"
                title="创建整理单元任务"
              >
                <i class="bi bi-list-check me-2"></i>整理教材单元
              </button>
              <button
                class="btn btn-outline-secondary"
                @click="createCatalogTask('add_resources')"
                :disabled="creatingTask"
                title="创建补充资源任务"
              >
                <i class="bi bi-plus-circle me-2"></i>补充资源
              </button>
            </div>
            <p class="text-muted small mb-0">
              <i class="bi bi-info-circle me-1"></i>
              <strong>推荐：</strong>直接点击"上传资源"按钮，上传包含单元信息的资源文件，系统会自动提取并整理单元结构
            </p>
          </div>
        </div>
        
        <!-- 调试信息（开发时可见，帮助排查按钮显示问题） -->
        <div v-if="catalogInfo" class="alert alert-info mb-2" style="font-size: 0.875rem;">
          <strong>调试信息：</strong><br>
          catalogId: {{ catalogId }}<br>
          view_state: {{ catalogInfo.view_state || '(null/undefined)' }}<br>
          action_hint: {{ catalogInfo.action_hint || '(null/undefined)' }}<br>
          units 数量: {{ units.length }}<br>
          <span v-if="!catalogInfo.view_state || catalogInfo.view_state === 'no_action'" class="text-warning">
            ⚠️ view_state 为空或为 'no_action'，所以 Catalog 级按钮不会显示
          </span>
        </div>

        <!-- 教材信息展示（只读） -->
        <div class="catalog-info-card mb-3">
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
          <h3 class="section-title mb-3">
            <i class="bi bi-list-ul me-2"></i>选择单元
          </h3>

          <div v-if="units.length === 0" class="text-center py-5">
            <i class="bi bi-inbox display-1 text-muted"></i>
            <p class="mt-3 text-muted">该教材暂无单元信息</p>
            <p class="text-muted small mb-4">
              可能该教材尚未绑定资源，或资源中未包含单元信息
            </p>
            <div class="d-flex justify-content-center gap-3">
              <button
                class="btn btn-primary"
                @click="createCatalogTask('organize_units')"
                :disabled="creatingTask"
              >
                <i class="bi bi-list-check me-2"></i>创建整理单元任务
              </button>
              <router-link
                to="/resources/create"
                class="btn btn-outline-primary"
              >
                <i class="bi bi-cloud-upload me-2"></i>上传资源
              </router-link>
            </div>
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
      fromTaskId: null, // 来自任务的 ID
      targetUnit: null, // 目标单元（如果有）
    };
  },

  created() {
    this.fetchCatalogData();
    this.checkTaskContext();
  },

  watch: {
    catalogId: {
      handler() {
        this.fetchCatalogData();
        this.checkTaskContext();
      },
      immediate: false,
    },
    '$route.query': {
      handler() {
        this.checkTaskContext();
      },
      immediate: true,
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
          // 如果接口不存在或失败，catalogData 保持为 null，后续会从资源中提取
        }

        // 2. 如果 catalog 接口返回了数据
        if (catalogData) {
          console.log("[CatalogUnits] catalogData.view_state:", catalogData.view_state);
          console.log("[CatalogUnits] catalogData.action_hint:", catalogData.action_hint);
          
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
          
          console.log("[CatalogUnits] catalogInfo.view_state:", this.catalogInfo.view_state);

          // 尝试从 catalog 数据中提取 units
          if (catalogData.units && Array.isArray(catalogData.units)) {
            this.units = catalogData.units.map((u, idx) => {
              const unitObj = {
                name: typeof u === "string" ? u : u.name || u.unit || u.title,
                title: typeof u === "string" ? null : u.title || null,
                index: idx,
                unit_state: typeof u === "object" ? u.unit_state : null,
              };
              console.log(`[CatalogUnits] 单元 ${idx}:`, unitObj.name, "unit_state:", unitObj.unit_state);
              return unitObj;
            });
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
          console.log("[CatalogUnits] Catalog API 未返回数据，从资源中提取");
          this.catalogInfo = {
            id: this.catalogId,
            subject: null,
            grade: null,
            volume: null,
            textbook_version: null,
            education_level: null,
            displayName: `教材 #${this.catalogId}`,
            view_state: null, // 从资源中提取时，view_state 为 null
            action_hint: null,
          };
          await this.extractUnitsFromResources();
        }
        } catch (error) {
          console.error("[CatalogUnits] 获取教材数据失败:", error);
          
          // 根据错误类型提供更友好的提示
          if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
            this.error = "请求超时，请检查网络连接或稍后重试";
          } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
            this.error = "网络连接失败，请检查后端服务是否正常运行";
          } else if (error.response?.status === 500) {
            this.error = "服务器内部错误，请稍后重试";
          } else if (error.response?.status === 503) {
            this.error = "服务暂时不可用，请稍后重试";
          } else if (error.response?.status === 404) {
            this.error = `教材 ID ${this.catalogId} 不存在`;
          } else {
            this.error =
              error.response?.data?.message ||
              error.message ||
              "获取教材数据失败";
          }
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
     * 检查是否从任务跳转过来
     */
    checkTaskContext() {
      const query = this.$route.query;
      if (query.from_task) {
        this.fromTaskId = query.from_task;
        this.targetUnit = query.unit || null;
        console.log("[CatalogUnits] 从任务跳转过来:", {
          taskId: this.fromTaskId,
          targetUnit: this.targetUnit
        });
        
        // 如果有目标单元，在数据加载完成后滚动到该单元
        if (this.targetUnit && this.units.length > 0) {
          this.$nextTick(() => {
            setTimeout(() => {
              this.scrollToUnit(this.targetUnit);
            }, 500); // 等待数据加载
          });
        }
      } else {
        this.fromTaskId = null;
        this.targetUnit = null;
      }
    },

    /**
     * 滚动到指定单元
     */
    scrollToUnit(unitName) {
      const unitCards = document.querySelectorAll('.unit-card');
      for (const card of unitCards) {
        const title = card.querySelector('.unit-title');
        if (title && title.textContent.includes(unitName)) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // 添加高亮效果
          card.style.border = '2px solid var(--primary, #0d6efd)';
          card.style.boxShadow = '0 0 10px rgba(13, 110, 253, 0.3)';
          setTimeout(() => {
            card.style.border = '';
            card.style.boxShadow = '';
          }, 3000);
          break;
        }
      }
    },

    /**
     * 跳转到资源上传页面
     */
    goToUpload() {
      // 跳转到资源上传页面，并传递 catalog_id 参数
      this.$router.push({
        path: "/resources/create",
        query: {
          catalog_id: this.catalogId,
        },
      });
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

    /**
     * 创建 Catalog 级任务
     */
    async createCatalogTask(taskType) {
      if (this.creatingTask) return;

      this.creatingTask = true;
      try {
        // 尝试多个可能的 API 路径
        let response = null;
        const possiblePaths = [
          "/api/tasks",      // 原始路径
          "/my/tasks",       // 参考 /my/resources 的格式
          "/api/my/tasks",   // 带 /api 前缀
        ];

        let lastError = null;
        for (const path of possiblePaths) {
          try {
            console.log(`[CatalogUnits] 尝试创建任务 API 路径: ${path}`);
            response = await apiHttpClient.post(path, {
              task_type: taskType,
              catalog_id: this.catalogId,
            });
            console.log(`[CatalogUnits] ${path} 创建任务成功:`, response.data);
            break; // 成功则跳出循环
          } catch (error) {
            console.warn(`[CatalogUnits] ${path} 创建任务失败:`, error.response?.status, error.message);
            lastError = error;
            // 如果是 404，继续尝试下一个路径
            if (error.response?.status === 404) {
              continue;
            }
            // 其他错误直接抛出
            throw error;
          }
        }

        // 如果所有路径都失败，抛出最后一个错误
        if (!response && lastError) {
          throw lastError;
        }

        if (!response) {
          throw new Error("无法连接到后端服务");
        }

        // 显示成功提示并询问是否跳转
        const { notification } = await import("@/utils/notification");
        notification.success("任务已加入我的任务");
        
        // 询问用户是否要跳转到任务列表
        const { notification: notificationModule } = await import("@/utils/notification");
        const goToTasks = await notificationModule.confirm(
          "任务创建成功！是否要跳转到「我的任务」页面查看？",
          {
            requireAgreement: false,
          }
        );
        
        if (goToTasks) {
          this.$router.push("/me/tasks");
        }
      } catch (error) {
        console.error("[CatalogUnits] 创建任务失败:", error);
        const { notification } = await import("@/utils/notification");
        
        if (error.response?.status === 404) {
          notification.warning(
            "创建任务 API 不存在，请确认后端是否已实现该接口。\n" +
            "尝试的路径：/api/tasks, /my/tasks, /api/my/tasks"
          );
        } else {
          notification.error(
            error.response?.data?.message || error.message || "创建任务失败"
          );
        }
      } finally {
        this.creatingTask = false;
      }
    },

    /**
     * 创建 Unit 级任务
     */
    async createUnitTask(unit) {
      if (this.creatingTask) return;

      this.creatingTask = true;
      try {
        // 尝试多个可能的 API 路径
        let response = null;
        const possiblePaths = [
          "/api/tasks",      // 原始路径
          "/my/tasks",       // 参考 /my/resources 的格式
          "/api/my/tasks",   // 带 /api 前缀
        ];

        let lastError = null;
        for (const path of possiblePaths) {
          try {
            console.log(`[CatalogUnits] 尝试创建单元任务 API 路径: ${path}`);
            response = await apiHttpClient.post(path, {
              task_type: "add_resources",
              catalog_id: this.catalogId,
              unit: unit.name,
            });
            console.log(`[CatalogUnits] ${path} 创建单元任务成功:`, response.data);
            break; // 成功则跳出循环
          } catch (error) {
            console.warn(`[CatalogUnits] ${path} 创建单元任务失败:`, error.response?.status, error.message);
            lastError = error;
            // 如果是 404，继续尝试下一个路径
            if (error.response?.status === 404) {
              continue;
            }
            // 其他错误直接抛出
            throw error;
          }
        }

        // 如果所有路径都失败，抛出最后一个错误
        if (!response && lastError) {
          throw lastError;
        }

        if (!response) {
          throw new Error("无法连接到后端服务");
        }

        // 显示成功提示并询问是否跳转
        const { notification } = await import("@/utils/notification");
        notification.success("任务已加入我的任务");
        
        // 询问用户是否要跳转到任务列表
        const { notification: notificationModule } = await import("@/utils/notification");
        const goToTasks = await notificationModule.confirm(
          "任务创建成功！是否要跳转到「我的任务」页面查看？",
          {
            requireAgreement: false,
          }
        );
        
        if (goToTasks) {
          this.$router.push("/me/tasks");
        }
      } catch (error) {
        console.error("[CatalogUnits] 创建单元任务失败:", error);
        const { notification } = await import("@/utils/notification");
        
        if (error.response?.status === 404) {
          notification.warning(
            "创建任务 API 不存在，请确认后端是否已实现该接口。\n" +
            "尝试的路径：/api/tasks, /my/tasks, /api/my/tasks"
          );
        } else {
          notification.error(
            error.response?.data?.message || error.message || "创建任务失败"
          );
        }
      } finally {
        this.creatingTask = false;
      }
    },
  },
});
</script>

<style scoped>
.catalog-units {
  min-height: calc(100vh - 200px);
  background: var(--bg, #ffffff);
  margin-top: -76px; /* 抵消 #app 的 padding-top，让内容紧贴 topbar */
  padding-top: 78px; /* 恢复必要的间距（76px topbar + 2px 小间距） */
}

.catalog-units .container {
  padding-top: 0 !important; /* 移除 container 的上边距 */
}

.catalog-units .breadcrumb {
  margin-top: 0.5rem; /* 只给面包屑保留很小的上边距 */
  margin-bottom: 0.5rem;
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

