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
            {{ catalogInfo?.displayName || `教材 #${catalogId}` }}
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
        <!-- 从任务跳转提示（保留原有功能） -->
        <div v-if="fromTaskId" class="alert alert-info mb-3">
          <div class="d-flex justify-content-between align-items-start">
            <div class="flex-grow-1">
              <i class="bi bi-info-circle me-2"></i>
              <strong>来自任务：</strong>你正在查看任务关联的教材
              <span v-if="targetUnit">，目标单元：<strong>{{ targetUnit }}</strong></span>
            </div>
            <router-link to="/me/tasks" class="btn btn-sm btn-outline-primary ms-3">
              <i class="bi bi-arrow-left me-1"></i>返回我的任务
            </router-link>
          </div>
        </div>

        <!-- 顶部：Catalog 基本信息卡片（文档要求：在行为提示区域之前） -->
        <div class="catalog-info-card mb-3">
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h2 class="card-title mb-3">
                    {{ catalogInfo.education_level || '' }} {{ catalogInfo.subject || '' }} {{ formatGrade(catalogInfo.grade) }} {{ catalogInfo.volume || '' }} {{ catalogInfo.textbook_version || '' }}
                  </h2>
                  <div class="catalog-stats">
                    <span>单元总数：{{ catalogInfo.unit_total || 0 }}</span>
                    <span class="mx-2">|</span>
                    <span>资源总数：{{ catalogInfo.resource_total || 0 }}</span>
                  </div>
                </div>
                <div>
                  <button
                    class="btn btn-primary"
                    @click="goToUpload"
                  >
                    <i class="bi bi-cloud-upload me-2"></i>上传资源
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 行为提示区域（根据 view_state 显示） -->
        <div v-if="catalogInfo.view_state" class="action-prompt mb-4" :class="`action-prompt-${catalogInfo.view_state}`">
          <p class="mb-2">{{ catalogInfo.action_hint || getActionHint(catalogInfo.view_state) }}</p>
          
          <!-- view_state = "add_resources" -->
          <div v-if="catalogInfo.view_state === 'add_resources'">
            <!-- 上传资源按钮已删除，统一从 /catalog/:catalogId 页面进入 -->
          </div>
          
          <!-- view_state = "organize_units" -->
          <div v-else-if="catalogInfo.view_state === 'organize_units'">
            <button
              v-if="isAdmin"
              class="btn btn-warning"
              @click="createCatalogTask('organize_units')"
              :disabled="creatingTask"
            >
              整理单元
            </button>
          </div>
          
          <!-- view_state = "no_action" -->
          <div v-else-if="catalogInfo.view_state === 'no_action'">
            <span class="badge bg-success">内容充足</span>
          </div>
        </div>

        <!-- 主体：Unit 列表 -->
        <div class="units-section">

          <div v-if="units.length === 0" class="text-center py-5">
            <i class="bi bi-inbox display-1 text-muted"></i>
            <p class="mt-3 text-muted">该教材暂无单元信息</p>
            <p class="text-muted small mb-4">
              可能该教材尚未绑定资源，或资源中未包含单元信息
            </p>
            <div v-if="catalogInfo.resource_total > 0" class="alert alert-info mb-3">
              <i class="bi bi-info-circle me-2"></i>
              <strong>提示：</strong>该教材已绑定 {{ catalogInfo.resource_total }} 个资源，但这些资源可能没有填写"所属单元"字段。
              <br>
              请前往资源编辑页面，为资源填写"所属单元"信息。
            </div>
            <div class="d-flex justify-content-center gap-3">
              <button
                class="btn btn-primary"
                @click="createCatalogTask('organize_units')"
                :disabled="creatingTask"
              >
                <i class="bi bi-list-check me-2"></i>创建整理单元任务
              </button>
              <button
                class="btn btn-outline-primary"
                @click="goToUpload"
              >
                <i class="bi bi-cloud-upload me-2"></i>上传资源
              </button>
            </div>
          </div>

          <div v-else class="units-grid">
            <div
              v-for="(unit, index) in units"
              :key="index"
              class="unit-item unit-card"
              :class="`unit-${unit.unit_state || 'unknown'}`"
              @click="goToUnitResources(unit)"
            >
              <div class="unit-card-body">
                <div class="unit-header">
                  <h3 class="unit-title">{{ unit.unit || unit.name }}</h3>
                  <span class="badge" :class="`badge-${unit.unit_state || 'unknown'}`">
                    {{ getUnitStateLabel(unit.unit_state) }}
                  </span>
                </div>
                <p class="unit-description">
                  {{ getUnitDescription(unit.unit_state, unit.resource_count) }}
                </p>
                <p v-if="unit.resource_count !== undefined" class="resource-count">
                  {{ unit.resource_count }} 个资源
                </p>
                <!-- 上传资源按钮已删除，统一从 /catalog/:catalogId 页面进入 -->
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
import { mapGetters } from "vuex";

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
      catalogInfo: {
        id: null,
        subject: null,
        grade: null,
        volume: null,
        textbook_version: null,
        education_level: null,
        unit_total: 0,
        resource_total: 0,
        displayName: null,
      }, // 初始化为空对象，避免模板报错
      units: [], // 单元列表
      creatingTask: false, // 创建任务中
      fromTaskId: null, // 来自任务的 ID
      targetUnit: null, // 目标单元（如果有）
    };
  },

  computed: {
    ...mapGetters({
      isAdmin: "auth/isAdmin",
    }),
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
     * 根据文档要求，使用 /api/catalogs/:catalogId/info 和 /api/catalogs/:catalogId/units
     */
    async fetchCatalogData() {
      this.loading = true;
      this.error = null;

      try {
        // 并行获取两个接口
        const [catalogInfoResponse, unitsResponse] = await Promise.all([
          apiHttpClient.get(`/api/catalogs/${this.catalogId}/info`).catch(err => {
            console.warn("[CatalogUnits] /info API 失败，尝试备用接口:", err);
            // 如果 /info 接口不存在，尝试使用旧的接口
            return apiHttpClient.get(`/api/catalogs/${this.catalogId}`).catch(() => null);
          }),
          apiHttpClient.get(`/api/catalogs/${this.catalogId}/units`).catch(err => {
            console.warn("[CatalogUnits] /units API 失败:", err);
            return null;
          }),
        ]);

        // 处理 catalog 信息
        let catalogData = null;
        if (catalogInfoResponse && catalogInfoResponse.data) {
          if (catalogInfoResponse.data.data) {
            catalogData = catalogInfoResponse.data.data;
          } else if (catalogInfoResponse.data.catalog) {
            catalogData = catalogInfoResponse.data.catalog;
          } else {
            catalogData = catalogInfoResponse.data;
          }
        }

        if (catalogData) {
          // 更新 catalogInfo 对象的属性，保持响应式
          Object.assign(this.catalogInfo, {
            id: catalogData.catalog_id || catalogData.id || this.catalogId,
            subject: catalogData.subject,
            grade: catalogData.grade,
            volume: catalogData.volume,
            textbook_version: catalogData.textbook_version,
            education_level: catalogData.education_level,
            unit_total: catalogData.unit_total || 0,
            resource_total: catalogData.resource_total || 0,
            quality_state: catalogData.quality_state,
            view_state: catalogData.view_state || null,
            action_hint: catalogData.action_hint || null,
            displayName: this.buildDisplayName(catalogData),
          });
        } else {
          // 如果接口失败，设置默认值（保持对象结构）
          Object.assign(this.catalogInfo, {
            id: this.catalogId,
            subject: null,
            grade: null,
            volume: null,
            textbook_version: null,
            education_level: null,
            unit_total: 0,
            resource_total: 0,
            view_state: null,
            action_hint: null,
            displayName: `教材 #${this.catalogId}`,
          });
        }

        // 处理单元列表
        if (unitsResponse && unitsResponse.data) {
          let unitsData = null;
          if (unitsResponse.data.data && Array.isArray(unitsResponse.data.data)) {
            unitsData = unitsResponse.data.data;
          } else if (Array.isArray(unitsResponse.data)) {
            unitsData = unitsResponse.data;
          }

          if (unitsData && unitsData.length > 0) {
            this.units = unitsData.map((u) => ({
              unit: u.unit,
              unit_index: u.unit_index,
              resource_count: u.resource_count || 0,
              unit_state: u.unit_state || null,
              name: u.unit, // 兼容旧代码
            }));
          } else {
            // 如果没有单元数据，尝试从资源中提取（作为后备方案）
            await this.extractUnitsFromResources();
          }
        } else {
          // 如果 /units 接口失败，尝试从资源中提取
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
        // 只在开发环境输出详细日志
        if (process.env.NODE_ENV === 'development') {
          console.log("[CatalogUnits] 从资源中提取单元信息，catalogId:", this.catalogId);
        }

        // 尝试多种 API 路径和参数格式
        // 注意：可能需要包含所有状态的资源（包括已审核的），所以不添加 status 过滤
        let resources = [];
        const possiblePaths = [
          { path: "/api/resources", params: { catalog_id: this.catalogId, limit: 1000, status: "approved" } }, // 优先获取已审核的资源
          { path: "/api/resources", params: { catalog_id: this.catalogId, limit: 1000 } }, // 不指定状态，让后端决定
          { path: "/api/resources", params: { catalog_id: Number(this.catalogId), limit: 1000 } },
          { path: "/api/resources", params: { catalogId: this.catalogId, limit: 1000 } },
          { path: "/my/resources", params: { catalog_id: this.catalogId, limit: 1000 } }, // 尝试使用 /my/resources（返回所有状态的资源）
          { path: "/api/resources", params: { limit: 1000, status: "approved" } }, // 获取所有已审核的资源，然后手动过滤
          { path: "/api/resources", params: { limit: 1000 } }, // 获取所有资源，然后手动过滤
          { path: "/my/resources", params: { limit: 1000 } }, // 获取当前用户的所有资源，然后手动过滤
        ];

        for (const { path, params } of possiblePaths) {
          try {
            const response = await apiHttpClient.get(path, { params });

            // 处理不同的响应格式
            let responseResources = [];
            if (response.data) {
              if (response.data.data && Array.isArray(response.data.data)) {
                responseResources = response.data.data;
              } else if (response.data.resources && Array.isArray(response.data.resources)) {
                responseResources = response.data.resources;
              } else if (Array.isArray(response.data)) {
                responseResources = response.data;
              }
            }

            // 如果后端支持 catalog_id 参数，直接使用结果
            if (params.catalog_id || params.catalogId) {
              resources = responseResources;
              // 输出调试信息
              if (process.env.NODE_ENV === 'development') {
                console.log(`[CatalogUnits] 从 ${path} 获取到 ${resources.length} 个资源（使用 catalog_id 参数）`);
                if (resources.length > 0) {
                  console.log(`[CatalogUnits] 前3个资源的详情:`, resources.slice(0, 3).map(r => ({
                    id: r.id,
                    title: r.title,
                    catalog_id: r.catalog_id,
                    status: r.status,
                    unit: r.unit,
                  })));
                } else {
                  // 如果没有找到资源，输出所有资源的 catalog_id 用于调试
                  if (responseResources.length > 0) {
                    console.log(`[CatalogUnits] 查询参数 catalog_id=${this.catalogId}，但返回的资源 catalog_id 为:`, 
                      responseResources.slice(0, 10).map(r => ({
                        id: r.id,
                        catalog_id: r.catalog_id,
                        catalogId: r.catalogId,
                      }))
                    );
                  }
                }
              }
              // 即使返回了资源，也检查一下 catalog_id 是否匹配（防止后端返回了所有资源）
              if (resources.length > 0) {
                const matchedResources = resources.filter(r => {
                  const catalogId = r.catalog_id || r.catalogId;
                  return catalogId === Number(this.catalogId) || 
                         catalogId === String(this.catalogId) ||
                         String(catalogId) === String(this.catalogId);
                });
                if (matchedResources.length !== resources.length) {
                  console.warn(`[CatalogUnits] 警告：后端返回了 ${resources.length} 个资源，但只有 ${matchedResources.length} 个匹配 catalog_id=${this.catalogId}`);
                  resources = matchedResources;
                }
              }
              if (resources.length > 0) {
                break;
              }
            } else {
              // 如果后端不支持 catalog_id 参数，手动过滤
              resources = responseResources.filter(
                (r) => {
                  const catalogId = r.catalog_id || r.catalogId;
                  const matches = catalogId === Number(this.catalogId) || 
                         catalogId === String(this.catalogId) ||
                         String(catalogId) === String(this.catalogId);
                  return matches;
                }
              );
              if (process.env.NODE_ENV === 'development') {
                console.log(`[CatalogUnits] 从 ${path} 获取到 ${responseResources.length} 个资源，过滤后 ${resources.length} 个匹配 catalog_id=${this.catalogId}`);
                if (resources.length === 0 && responseResources.length > 0) {
                  // 输出前几个资源的完整信息用于调试
                  console.log(`[CatalogUnits] 查询 catalog_id=${this.catalogId} (类型: ${typeof this.catalogId})，但返回的资源没有匹配的 catalog_id`);
                  
                  // 输出前3个资源的完整对象（用于查看所有字段）- 使用 JSON.stringify 确保展开显示
                  const first3Resources = responseResources.slice(0, 3);
                  console.log(`[CatalogUnits] 前3个资源的完整信息:`, JSON.parse(JSON.stringify(first3Resources)));
                  
                  // 输出所有可能的 catalog_id 相关字段
                  const sampleResources = responseResources.slice(0, 5).map(r => {
                    // 检查所有可能的字段名
                    const allFields = Object.keys(r);
                    const catalogFields = allFields.filter(key => 
                      key.toLowerCase().includes('catalog') || 
                      key.toLowerCase().includes('textbook')
                    );
                    
                    const result = {
                      id: r.id,
                      title: r.title,
                      // 列出所有可能的 catalog 相关字段
                      catalogFields: catalogFields,
                      // 列出所有字段名（用于调试）
                      allFields: allFields,
                    };
                    
                    // 直接输出这些字段的值
                    catalogFields.forEach(key => {
                      result[key] = r[key];
                    });
                    
                    return result;
                  });
                  console.log(`[CatalogUnits] 前5个资源的 catalog 相关字段:`, JSON.parse(JSON.stringify(sampleResources)));
                  
                  // 统计有多少个资源有 catalog_id
                  const withCatalogId = responseResources.filter(r => r.catalog_id || r.catalogId || r.textbook_catalog_id);
                  console.log(`[CatalogUnits] 返回的 ${responseResources.length} 个资源中，有 ${withCatalogId.length} 个有 catalog_id 字段`);
                  
                  // 如果没有任何资源有 catalog_id，输出第一个资源的所有字段和值
                  if (withCatalogId.length === 0 && responseResources.length > 0) {
                    const firstResource = responseResources[0];
                    console.log(`[CatalogUnits] 第一个资源的所有字段和值 (完整 JSON):`, JSON.stringify(firstResource, null, 2));
                    console.log(`[CatalogUnits] 第一个资源的所有字段名:`, Object.keys(firstResource));
                  }
                }
              }
              if (resources.length > 0) {
                break;
              }
            }
          } catch (error) {
            // 继续尝试下一个路径
            continue;
          }
        }

        // 只从 resource.unit 字段提取单元信息
        const unitSet = new Set();
        const unitMap = new Map();
        let resourcesWithoutUnit = 0;

        resources.forEach((resource) => {
          // 只使用 resource.unit 字段
          if (resource.unit && String(resource.unit).trim() !== "") {
            const unitName = String(resource.unit).trim();
            unitSet.add(unitName);
            if (!unitMap.has(unitName)) {
              unitMap.set(unitName, {
                name: unitName,
                unit: unitName,
                title: null, // unit 字段不包含 title
                resource_count: 0, // 初始化资源计数
              });
            }
            // 增加该单元的资源计数
            const unitData = unitMap.get(unitName);
            unitData.resource_count = (unitData.resource_count || 0) + 1;
          } else {
            // 没有 unit 字段的资源，归类到"整本教材"
            resourcesWithoutUnit++;
            const wholeTextbookUnit = "整本教材";
            if (!unitMap.has(wholeTextbookUnit)) {
              unitMap.set(wholeTextbookUnit, {
                name: wholeTextbookUnit,
                unit: wholeTextbookUnit,
                title: null,
                resource_count: 0,
              });
            }
            // 增加"整本教材"的资源计数
            const wholeTextbookData = unitMap.get(wholeTextbookUnit);
            wholeTextbookData.resource_count = (wholeTextbookData.resource_count || 0) + 1;
          }
        });

        // 转换为数组并排序
        this.units = Array.from(unitMap.values()).sort((a, b) => {
          // "整本教材"始终排在最后
          if (a.unit === "整本教材") return 1;
          if (b.unit === "整本教材") return -1;
          // 尝试按单元名称中的数字排序
          const aNum = parseInt(a.name.match(/\d+/)?.[0] || "999");
          const bNum = parseInt(b.name.match(/\d+/)?.[0] || "999");
          return aNum - bNum;
        });

        // 输出详细日志
        if (process.env.NODE_ENV === 'development') {
          console.log(`[CatalogUnits] 资源提取结果:`, {
            totalResources: resources.length,
            resourcesWithoutUnit,
            extractedUnits: this.units.length,
            units: this.units.map(u => u.unit || u.name),
          });
          
          // 显示前几个资源的详细信息
          if (resources.length > 0) {
            console.log(`[CatalogUnits] 前3个资源详情:`, resources.slice(0, 3).map(r => ({
              id: r.id,
              title: r.title,
              catalog_id: r.catalog_id,
              unit: r.unit,
            })));
          }
        }

        // 如果从资源中提取到了 catalog 信息，更新 catalogInfo
        if (resources.length > 0) {
          // 更新资源总数
          this.catalogInfo.resource_total = resources.length;
          
          const firstResource = resources[0];
          if (firstResource.catalog_info) {
            // 使用 Object.assign 更新属性，保持响应式
            Object.assign(this.catalogInfo, {
              subject: firstResource.catalog_info.subject || this.catalogInfo.subject,
              grade: firstResource.catalog_info.grade || this.catalogInfo.grade,
              volume: firstResource.catalog_info.volume || this.catalogInfo.volume,
              textbook_version:
                firstResource.catalog_info.version ||
                firstResource.catalog_info.textbook_version ||
                this.catalogInfo.textbook_version,
              displayName: this.buildDisplayName(firstResource.catalog_info),
            });
          }
        }

        // 如果没有找到资源，显示提示
        if (resources.length === 0) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`[CatalogUnits] 未找到绑定到 catalog ${this.catalogId} 的资源`);
          }
        } else if (this.units.length === 0) {
          // 有资源但没有单元信息
          if (process.env.NODE_ENV === 'development') {
            console.warn(`[CatalogUnits] 找到 ${resources.length} 个资源，但都没有 unit 字段`);
          }
        }
      } catch (error) {
        // 只在开发环境输出详细错误日志
        if (process.env.NODE_ENV === 'development') {
          console.error("[CatalogUnits] 从资源中提取单元失败:", error);
          console.error("[CatalogUnits] 错误详情:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
          });
        }
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
     * 跳转到单元资源列表页
     * 根据文档要求，跳转到 /catalog/:catalogId/unit/:unit
     */
    goToUnitResources(unit) {
      const unitName = unit.unit || unit.name;
      if (!unitName) {
        console.warn("[CatalogUnits] 单元名称为空，无法跳转");
        return;
      }

      console.log("[CatalogUnits] 跳转到单元资源列表:", {
        catalogId: this.catalogId,
        unit: unitName,
      });

      // 根据文档，跳转到 /catalog/:catalogId/unit/:unit
      this.$router.push({
        path: `/catalog/${this.catalogId}/unit/${encodeURIComponent(unitName)}`,
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
     * 辅助函数：获取行为提示文本
     */
    getActionHint(viewState) {
      const hints = {
        'add_resources': this.catalogInfo.resource_total === 0 
          ? '该教材暂无资源，建议优先补充内容'
          : '该教材资源密度不足，建议补充更多资源',
        'organize_units': '该教材有资源但缺少单元信息，建议整理单元',
        'no_action': '该教材内容充足，无需行动',
      };
      return hints[viewState] || '';
    },

    /**
     * 辅助函数：获取单元状态标签
     */
    getUnitStateLabel(unitState) {
      const labels = {
        'empty': '空',
        'sparse': '稀疏',
        'healthy': '健康',
      };
      return labels[unitState] || '';
    },

    /**
     * 辅助函数：获取单元描述
     */
    getUnitDescription(unitState, resourceCount) {
      if (unitState === 'empty') {
        return '该单元暂无资源';
      } else if (unitState === 'sparse') {
        return '该单元资源较少，建议补充';
      } else if (unitState === 'healthy') {
        return '该单元内容充足';
      }
      return '';
    },

    /**
     * 为该单元上传资源
     */
    handleUploadForUnit(unit) {
      const unitName = unit.unit || unit.name;
      this.$router.push({
        path: "/resources/create",
        query: {
          catalog_id: this.catalogId,
          unit: unitName,
        },
      });
    },

    /**
     * 为该单元补充资源
     */
    handleAddResourcesForUnit(unit) {
      const unitName = unit.unit || unit.name;
      this.$router.push({
        path: "/resources/create",
        query: {
          catalog_id: this.catalogId,
          unit: unitName,
        },
      });
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
}

.catalog-units .container {
  padding-top: 0.5rem !important;
}

.catalog-units .breadcrumb {
  margin-top: 0;
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

.catalog-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  color: var(--text-muted, #6c757d);
  font-size: 0.95rem;
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

.unit-item {
  background: var(--surface, #ffffff);
  border: 2px solid var(--border, #e9ecef);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
}

.unit-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 单元状态样式 */
.unit-empty {
  border-left: 4px solid #f44336;
  background-color: #ffebee;
}

.unit-sparse {
  border-left: 4px solid #ff9800;
  background-color: #fff3e0;
}

.unit-healthy {
  border-left: 4px solid #4caf50;
  background-color: #e8f5e9;
}

.unit-unknown {
  border-left: 4px solid #e9ecef;
}

/* 行为提示区域样式 */
.action-prompt {
  padding: 1rem 1.25rem;
  border-radius: 8px;
  border-left: 4px solid;
}

.action-prompt-add_resources {
  background-color: #e3f2fd;
  border-left-color: #2196f3;
}

.action-prompt-organize_units {
  background-color: #fff3e0;
  border-left-color: #ff9800;
}

.action-prompt-no_action {
  background-color: #e8f5e9;
  border-left-color: #4caf50;
}

/* 单元状态徽章 */
.badge-empty {
  background-color: #f44336;
  color: white;
}

.badge-sparse {
  background-color: #ff9800;
  color: white;
}

.badge-healthy {
  background-color: #4caf50;
  color: white;
}

.badge-unknown {
  background-color: #6c757d;
  color: white;
}

.unit-card-body {
  padding: 1.25rem;
}

.unit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.unit-description {
  color: var(--text-muted, #6c757d);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.resource-count {
  color: var(--text-muted, #6c757d);
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
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

