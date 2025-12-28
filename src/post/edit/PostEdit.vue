<template>
  <BreadCrumbs />
  <div class="post-edit-page">
    <div class="container post-edit-page-body">
      <h3 class="mb-4"><i class="bi bi-pencil-square"></i> 编辑资源</h3>

      <!-- 加载状态 -->
      <div v-if="loading" class="alert alert-info">
        <div class="spinner-border spinner-border-sm me-2" role="status"></div>
        <span>加载资源信息中...</span>
      </div>

      <!-- 编辑表单 -->
      <form v-else-if="resource">
        <!-- 基本信息 -->
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-white">
            <h5 class="mb-0"><i class="bi bi-info-circle"></i> 基本信息</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label"
                >资源标题 <span class="text-danger">*</span></label
              >
              <input
                v-model="editForm.title"
                type="text"
                class="form-control"
                placeholder="请输入资源标题"
              />
            </div>

            <div class="mb-3">
              <label class="form-label"
                >资源分类 <span class="text-danger">*</span></label
              >
              <select v-model="editForm.category" class="form-control">
                <option value="">选择分类</option>
                <option v-for="cat in categories" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">资源描述（可选）</label>
              <textarea
                v-model="editForm.description"
                class="form-control"
                rows="4"
                placeholder="请输入资源描述"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 教材信息（仅在未绑定教材目录时显示） -->
        <div v-if="!resource?.catalog_info && !resource?.catalog_id && !selectedCatalogId" class="card shadow-sm mb-4">
          <div class="card-header bg-white">
            <h5 class="mb-0"><i class="bi bi-book"></i> 教材信息（可选）</h5>
            <small class="text-muted d-block mt-1">已绑定教材目录的资源，教材信息由教材目录管理，无需手动填写</small>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-3">
                <div class="d-flex align-items-center justify-content-between mb-1">
                  <label class="form-label mb-0">年级</label>
                  <button
                    v-if="editForm.grade"
                    type="button"
                    class="btn btn-sm btn-link text-danger p-0"
                    @click="editForm.grade = ''"
                    title="清空"
                    style="font-size: 0.75rem;"
                  >
                    <i class="bi bi-x-circle"></i>
                  </button>
                </div>
                <input
                  v-model="editForm.grade"
                  type="text"
                  class="form-control"
                  placeholder="如：二年级上册"
                />
              </div>
              <div class="col-md-3">
                <div class="d-flex align-items-center justify-content-between mb-1">
                  <label class="form-label mb-0">学科</label>
                  <button
                    v-if="editForm.subject"
                    type="button"
                    class="btn btn-sm btn-link text-danger p-0"
                    @click="editForm.subject = ''"
                    title="清空"
                    style="font-size: 0.75rem;"
                  >
                    <i class="bi bi-x-circle"></i>
                  </button>
                </div>
                <input
                  v-model="editForm.subject"
                  type="text"
                  class="form-control"
                  placeholder="如：语文"
                />
              </div>
              <div class="col-md-3">
                <div class="d-flex align-items-center justify-content-between mb-1">
                  <label class="form-label mb-0">教材版本</label>
                  <button
                    v-if="editForm.textbook"
                    type="button"
                    class="btn btn-sm btn-link text-danger p-0"
                    @click="editForm.textbook = ''"
                    title="清空"
                    style="font-size: 0.75rem;"
                  >
                    <i class="bi bi-x-circle"></i>
                  </button>
                </div>
                <input
                  v-model="editForm.textbook"
                  type="text"
                  class="form-control"
                  placeholder="如：人教版"
                />
              </div>
              <div class="col-md-3">
                <div class="d-flex align-items-center justify-content-between mb-1">
                  <label class="form-label mb-0">章节信息</label>
                  <button
                    v-if="editForm.chapter_info"
                    type="button"
                    class="btn btn-sm btn-link text-danger p-0"
                    @click="editForm.chapter_info = ''"
                    title="清空"
                    style="font-size: 0.75rem;"
                  >
                    <i class="bi bi-x-circle"></i>
                  </button>
                </div>
                <input
                  v-model="editForm.chapter_info"
                  type="text"
                  class="form-control"
                  placeholder="如：第一章"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 资源出处（可选） -->
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-white">
            <h5 class="mb-0"><i class="bi bi-tag"></i> 资源出处（可选）</h5>
          </div>
          <div class="card-body">
            <div class="d-flex align-items-center justify-content-between mb-1">
              <label class="form-label mb-0">资源出处</label>
              <button
                v-if="editForm.source_attribution"
                type="button"
                class="btn btn-sm btn-link text-danger p-0"
                @click="editForm.source_attribution = ''"
                title="清空"
                style="font-size: 0.75rem;"
              >
                <i class="bi bi-x-circle"></i>
              </button>
            </div>
            <div class="position-relative">
              <input
                v-model="editForm.source_attribution"
                type="text"
                class="form-control"
                placeholder="如：xx教育、某某出版社等"
                maxlength="100"
                @input="onSourceAttributionInput"
                @focus="showSourceAttributionSuggestions = true"
                @blur="hideSourceAttributionSuggestions"
              />
              <!-- 自动完成建议列表 -->
              <div
                v-if="showSourceAttributionSuggestions && sourceAttributionSuggestions.length > 0"
                class="autocomplete-suggestions"
              >
                <div
                  v-for="(suggestion, index) in sourceAttributionSuggestions"
                  :key="index"
                  class="autocomplete-item"
                  @mousedown="selectSourceAttribution(suggestion)"
                >
                  {{ suggestion }}
                </div>
              </div>
            </div>
            <small class="text-muted d-block mt-2">
              <i class="bi bi-info-circle me-1"></i>
              用于标注资源的原始来源，最多 100 个字符
            </small>
          </div>
        </div>

        <!-- 教材目录绑定 -->
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-white">
            <h5 class="mb-0"><i class="bi bi-link-45deg"></i> 教材目录绑定（可选）</h5>
          </div>
          <div class="card-body">
            <!-- 当前绑定的教材目录 -->
            <div v-if="(resource?.catalog_info && !isUnbindingCatalog) || (selectedCatalogId && matchedCatalog)" class="current-catalog mb-3 p-3 bg-light rounded">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <p class="mb-1"><strong>当前绑定：</strong></p>
                  <!-- 如果已确认绑定新的教材目录，显示新的绑定信息 -->
                  <p v-if="selectedCatalogId && matchedCatalog" class="mb-0">
                    {{ matchedCatalog.education_level }}
                    {{ matchedCatalog.subject }}
                    {{ formatGrade(matchedCatalog.grade) }}年级
                    {{ matchedCatalog.volume }}
                    {{ matchedCatalog.textbook_version }}
                  </p>
                  <!-- 否则显示原有的绑定信息 -->
                  <p v-else-if="resource?.catalog_info" class="mb-0">
                    {{ resource.catalog_info.education_level }}
                    {{ resource.catalog_info.subject }}
                    {{ formatGrade(resource.catalog_info.grade) }}年级
                    {{ resource.catalog_info.volume }}
                    {{ resource.catalog_info.textbook_version }}
                  </p>
                  <p v-if="editForm.unit" class="mb-0 mt-1 text-muted small">
                    <i class="bi bi-list-ul me-1"></i>所属单元：{{ editForm.unit }}
                  </p>
                </div>
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="unbindCatalog"
                >
                  <i class="bi bi-x-circle me-1"></i>解除绑定
                </button>
              </div>
            </div>

            <!-- 教材目录选择器（分步筛选） -->
            <div class="catalog-selector">
              <label class="form-label mb-3 fw-semibold">
                <i class="bi bi-funnel me-2"></i>选择教材目录：
              </label>
              
              <div class="catalog-filter-row">
                <!-- 学段选择 -->
                <div class="filter-item">
                  <label class="filter-label">
                    <i class="bi bi-mortarboard me-1"></i>学段
                  </label>
                  <select
                    v-model="catalogFilter.education_level"
                    class="form-select"
                    @change="onFilterChange"
                  >
                    <option value="">-- 请选择 --</option>
                    <option value="小学">小学</option>
                    <option value="初中">初中</option>
                  </select>
                </div>

                <!-- 学科选择 -->
                <div class="filter-item">
                  <label class="filter-label">
                    <i class="bi bi-book me-1"></i>学科
                  </label>
                  <select
                    v-model="catalogFilter.subject"
                    class="form-select"
                    @change="onFilterChange"
                    :disabled="!catalogFilter.education_level"
                  >
                    <option value="">-- 请选择 --</option>
                    <option
                      v-for="subject in availableSubjects"
                      :key="subject"
                      :value="subject"
                    >
                      {{ subject }}
                    </option>
                  </select>
                </div>

                <!-- 年级选择 -->
                <div class="filter-item">
                  <label class="filter-label">
                    <i class="bi bi-123 me-1"></i>年级
                  </label>
                  <select
                    v-model="catalogFilter.grade"
                    class="form-select"
                    @change="onFilterChange"
                    :disabled="!catalogFilter.subject"
                  >
                    <option value="">-- 请选择 --</option>
                    <option
                      v-for="grade in availableGrades"
                      :key="grade"
                      :value="grade"
                    >
                      {{ formatGrade(grade) }}年级
                    </option>
                  </select>
                </div>

                <!-- 册别选择 -->
                <div class="filter-item">
                  <label class="filter-label">
                    <i class="bi bi-stack me-1"></i>册别
                  </label>
                  <select
                    v-model="catalogFilter.volume"
                    class="form-select"
                    @change="onFilterChange"
                    :disabled="!catalogFilter.grade"
                  >
                    <option value="">-- 请选择 --</option>
                    <option
                      v-for="volume in availableVolumes"
                      :key="volume"
                      :value="volume"
                    >
                      {{ volume }}
                    </option>
                  </select>
                </div>

                <!-- 版本选择 -->
                <div class="filter-item">
                  <label class="filter-label">
                    <i class="bi bi-tag me-1"></i>版本
                  </label>
                  <select
                    v-model="catalogFilter.textbook_version"
                    class="form-select"
                    @change="onFilterChange"
                    :disabled="!catalogFilter.volume"
                  >
                    <option value="">-- 请选择 --</option>
                    <option
                      v-for="version in availableVersions"
                      :key="version"
                      :value="version"
                    >
                      {{ version }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- 显示匹配的教材目录 -->
              <div v-if="matchedCatalog" class="catalog-match-result mt-3">
                <div class="match-success">
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="flex-grow-1">
                      <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-check-circle-fill text-success me-2"></i>
                        <strong class="text-success">已匹配到教材目录</strong>
                      </div>
                      <div class="catalog-info-display">
                        <span class="catalog-badge">{{ matchedCatalog.education_level }}</span>
                        <span class="catalog-badge">{{ matchedCatalog.subject }}</span>
                        <span class="catalog-badge">{{ formatGrade(matchedCatalog.grade) }}年级</span>
                        <span class="catalog-badge">{{ matchedCatalog.volume }}</span>
                        <span class="catalog-badge">{{ matchedCatalog.textbook_version }}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      class="btn btn-success btn-sm ms-3"
                      @click="confirmCatalogSelection"
                    >
                      <i class="bi bi-check-lg me-1"></i>确认绑定
                    </button>
                  </div>
                </div>
              </div>

              <div v-else-if="allFiltersSelected && !matchedCatalog" class="catalog-match-result mt-3">
                <div class="match-warning">
                  <i class="bi bi-exclamation-triangle-fill me-2"></i>
                  <span>未找到匹配的教材目录，请检查选择是否正确</span>
                </div>
              </div>

              <small v-if="loadingCatalogs" class="text-muted d-block mt-2">
                <i class="bi bi-arrow-repeat spinner-border spinner-border-sm me-1"></i>
                正在加载教材目录...
              </small>
            </div>

            <!-- 单元信息（如果资源有 unit 字段或已绑定教材目录则显示） -->
            <div v-if="editForm.unit || selectedCatalogId || resource?.catalog_info || resource?.catalog_id" class="unit-info">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">
                    所属单元
                  </label>
                  <input
                    v-model="editForm.unit"
                    type="text"
                    class="form-control"
                    placeholder="如：第一单元（留空则自动标记为「整本教材」）"
                  />
                  <small class="text-muted">绑定教材目录后，填写所属单元；留空则自动标记为「整本教材」</small>
                </div>
                <div class="col-md-6">
                  <label class="form-label">单元序号（可选）</label>
                  <input
                    v-model.number="editForm.unit_index"
                    type="number"
                    class="form-control"
                    placeholder="如：1"
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 封面信息 -->
        <div class="card shadow-sm mb-4">
          <div
            class="card-header bg-white d-flex align-items-center justify-content-between"
          >
            <h5 class="mb-0"><i class="bi bi-image"></i> 封面（可选）</h5>
            <div v-if="editForm.cover_url" class="d-flex align-items-center">
              <button
                type="button"
                class="btn btn-outline-danger btn-sm ms-2"
                @click="removeCover"
              >
                <i class="bi bi-trash"></i> 删除
              </button>
              <button
                type="button"
                class="btn btn-outline-secondary btn-sm ms-2"
                @click="replaceCover"
              >
                <i class="bi bi-arrow-repeat"></i> 替换
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="row">
              <!-- 左侧：当前封面预览 -->
              <div class="col-md-4 mb-3 mb-md-0">
                <label class="form-label mb-2">当前封面</label>
                <div class="cover-preview-box">
                  <div v-if="editForm.cover_url || coverPreviewUrl" class="cover-preview-content">
                  <img
                      :src="coverPreviewUrl || editForm.cover_url"
                      class="cover-preview-image"
                      alt="封面预览"
                      @error="handleCoverImageError"
                  />
                    <div class="cover-preview-overlay">
                    <a
                        :href="editForm.cover_url || coverPreviewUrl"
                      target="_blank"
                        class="btn btn-sm btn-light"
                        title="新窗口预览"
                    >
                        <i class="bi bi-eye"></i>
                      </a>
                  </div>
                </div>
                  <div v-else class="cover-preview-empty">
                    <i class="bi bi-image text-muted"></i>
                    <p class="text-muted small mb-0 mt-2">暂无封面</p>
                  </div>
                </div>
              </div>
              
              <!-- 右侧：上传区域 -->
              <div class="col-md-8">
                <label class="form-label mb-2">上传封面</label>
                
                <!-- 统一的上传框 -->
                <div class="cover-upload-container">
                  <!-- 拖拽上传区域 -->
                  <div
                    :class="['cover-upload-zone', { 'drag-active': coverDragActive }]"
                    @dragover.prevent
                    @drop.prevent="onDropCover"
                    @dragenter="coverDragActive = true"
                    @dragleave="coverDragActive = false"
                    @click="$refs.coverFileInput?.click()"
                  >
                    <div v-if="coverPreviewUrl" class="cover-upload-preview">
                      <img
                        :src="coverPreviewUrl"
                        alt="封面预览"
                        class="cover-upload-preview-img"
                      />
                      <div class="cover-upload-preview-overlay">
                        <button
                          type="button"
                          class="btn btn-sm btn-danger"
                          @click.stop="removeCover"
                          title="移除"
                >
                          <i class="bi bi-trash"></i>
                        </button>
                </div>
              </div>
                    <div v-else class="cover-upload-placeholder">
                      <i class="bi bi-cloud-upload cover-upload-icon"></i>
                      <p class="cover-upload-text">拖拽图片到此处</p>
                      <p class="cover-upload-hint">或点击选择文件</p>
                    </div>
                  </div>
                  
                  <!-- 隐藏的文件输入 -->
                  <input
                    ref="coverFileInput"
                    type="file"
                    accept="image/*"
                    style="display: none"
                    @change="handleCoverUpload"
                  />
                  
                  <!-- 上传进度 -->
                  <div v-if="uploadingCover" class="cover-upload-progress">
                    <div class="progress">
                      <div
                        class="progress-bar progress-bar-striped progress-bar-animated"
                        :style="{ width: coverUploadProgress + '%' }"
                      >
                        {{ coverUploadProgress }}%
                      </div>
                    </div>
                    <small class="text-muted d-block mt-1">正在上传封面...</small>
                  </div>
                  
                  <!-- 分隔线 -->
                  <div class="cover-upload-divider">
                    <span>或</span>
                  </div>
                  
                  <!-- URL 输入 -->
                  <div class="cover-url-input">
                    <label class="form-label small mb-1">输入图片 URL</label>
                    <input
                      v-model="editForm.cover_url"
                      type="text"
                      class="form-control form-control-sm"
                      placeholder="https://example.com/cover.jpg"
                    />
                  </div>
                  
                  <!-- 提示信息 -->
                  <small class="form-text text-muted d-block mt-2">
                    <i class="bi bi-info-circle me-1"></i>
                    支持 JPG、PNG、GIF 格式，建议尺寸 800x600 像素
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="action-buttons-container">
          <button
            type="button"
            @click="submitEdit"
            class="btn btn-save"
            :disabled="isSaving || !isEditFormValid"
          >
            <span v-if="isSaving" class="d-flex align-items-center">
              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              保存中...
            </span>
            <span v-else class="d-flex align-items-center">
              <i class="bi bi-check-circle me-2"></i>
              保存修改
            </span>
          </button>
          <button
            type="button"
            @click="$router.back()"
            class="btn btn-cancel"
          >
            <i class="bi bi-x-circle me-2"></i>
            取消
          </button>
        </div>

        <!-- 成功提示 -->
        <div
          v-if="successMessage"
          class="alert alert-success d-flex align-items-center"
          role="alert"
        >
          <i class="bi bi-check-circle-fill me-2" style="font-size: 20px"></i>
          <div class="flex-grow-1">{{ successMessage }}</div>
        </div>

        <!-- 错误提示 -->
        <div
          v-if="errorMessage"
          class="alert alert-danger d-flex align-items-center"
          role="alert"
        >
          <i
            class="bi bi-exclamation-triangle-fill me-2"
            style="font-size: 20px"
          ></i>
          <div class="flex-grow-1">{{ errorMessage }}</div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { apiHttpClient } from "@/app/app.service";
import BreadCrumbs from "@/app/components/BreadCrumbs.vue";
import notification from "@/utils/notification";
import { RESOURCE_CATEGORIES } from "@/utils/constants";

const API_BASE_URL =
  process.env.VUE_APP_API_BASE_URL || "http://localhost:3333";

export default defineComponent({
  name: "PostEdit",
  components: {
    BreadCrumbs,
  },
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
    user: {
      type: Object,
      default: null,
  },
  },
  emits: ['showLogin'],
  data() {
    return {
      categories: RESOURCE_CATEGORIES, // 资源分类列表（静态）
      resource: null,
      loading: true,
      isSaving: false,
      successMessage: "",
      errorMessage: "",
      editForm: {
        title: "",
        category: "",
        description: "",
        grade: "",
        subject: "",
        textbook: "",
        chapter_info: "",
        cover_url: "",
        unit: "",
        unit_index: null,
        source_attribution: "",
      },
      coverFile: null,
      coverPreviewUrl: null,
      coverDragActive: false,
      uploadingCover: false,
      coverUploadProgress: 0,
      // 资源出处自动完成
      showSourceAttributionSuggestions: false,
      sourceAttributionSuggestions: [],
      // 教材目录绑定相关
      catalogs: [],
      selectedCatalogId: null,
      isUnbindingCatalog: false, // 用户是否点击了"解除绑定"按钮
      loadingCatalogs: false,
      // 分步筛选相关
      catalogFilter: {
        education_level: "",
        subject: "",
        grade: "",
        volume: "",
        textbook_version: "",
      },
    };
  },

  async mounted() {
    await this.fetchResource();
    await this.loadCatalogs();
  },

  computed: {
    isEditFormValid() {
      return (
        this.editForm.title &&
        this.editForm.title.trim() &&
        this.editForm.category
      );
    },

    // 根据筛选条件过滤后的教材目录
    filteredCatalogs() {
      let filtered = this.catalogs;
      
      if (this.catalogFilter.education_level) {
        filtered = filtered.filter(c => c.education_level === this.catalogFilter.education_level);
      }
      if (this.catalogFilter.subject) {
        filtered = filtered.filter(c => c.subject === this.catalogFilter.subject);
      }
      if (this.catalogFilter.grade) {
        filtered = filtered.filter(c => c.grade === this.catalogFilter.grade);
      }
      if (this.catalogFilter.volume) {
        filtered = filtered.filter(c => c.volume === this.catalogFilter.volume);
      }
      if (this.catalogFilter.textbook_version) {
        filtered = filtered.filter(c => c.textbook_version === this.catalogFilter.textbook_version);
      }
      
      return filtered;
    },

    // 可用的学科列表（根据学段筛选）
    availableSubjects() {
      if (!this.catalogFilter.education_level) return [];
      
      const filtered = this.catalogs.filter(
        c => c.education_level === this.catalogFilter.education_level
      );
      const subjects = [...new Set(filtered.map(c => c.subject).filter(Boolean))];
      return subjects.sort();
    },

    // 可用的年级列表（根据学段和学科筛选）
    availableGrades() {
      if (!this.catalogFilter.education_level || !this.catalogFilter.subject) return [];
      
      const filtered = this.catalogs.filter(
        c => c.education_level === this.catalogFilter.education_level &&
             c.subject === this.catalogFilter.subject
      );
      const grades = [...new Set(filtered.map(c => c.grade).filter(Boolean))];
      return grades.sort((a, b) => parseInt(a) - parseInt(b));
    },

    // 可用的册别列表（根据前面的筛选条件）
    availableVolumes() {
      if (!this.catalogFilter.education_level || !this.catalogFilter.subject || !this.catalogFilter.grade) {
        return [];
      }
      
      const filtered = this.catalogs.filter(
        c => c.education_level === this.catalogFilter.education_level &&
             c.subject === this.catalogFilter.subject &&
             c.grade === this.catalogFilter.grade
      );
      const volumes = [...new Set(filtered.map(c => c.volume).filter(Boolean))];
      return volumes.sort();
    },

    // 可用的版本列表（根据前面的筛选条件）
    availableVersions() {
      if (!this.catalogFilter.education_level || !this.catalogFilter.subject || 
          !this.catalogFilter.grade || !this.catalogFilter.volume) {
        return [];
      }
      
      const filtered = this.catalogs.filter(
        c => c.education_level === this.catalogFilter.education_level &&
             c.subject === this.catalogFilter.subject &&
             c.grade === this.catalogFilter.grade &&
             c.volume === this.catalogFilter.volume
      );
      const versions = [...new Set(filtered.map(c => c.textbook_version).filter(Boolean))];
      return versions.sort();
    },

    // 是否所有筛选条件都已选择
    allFiltersSelected() {
      return !!(
        this.catalogFilter.education_level &&
        this.catalogFilter.subject &&
        this.catalogFilter.grade &&
        this.catalogFilter.volume &&
        this.catalogFilter.textbook_version
      );
    },

    // 匹配的教材目录
    matchedCatalog() {
      if (!this.allFiltersSelected) return null;
      
      const matched = this.filteredCatalogs.find(
        c => c.education_level === this.catalogFilter.education_level &&
             c.subject === this.catalogFilter.subject &&
             c.grade === this.catalogFilter.grade &&
             c.volume === this.catalogFilter.volume &&
             c.textbook_version === this.catalogFilter.textbook_version
      );
      
      return matched || null;
    },
  },

  methods: {
    async fetchResource() {
      try {
        this.loading = true;
        console.log(`[PostEdit] 加载资源 ID: ${this.id}`);
        const response = await apiHttpClient.get(`/api/resources/${this.id}`);
        this.resource = response.data;
        console.log("[PostEdit] 资源加载成功:", this.resource);

        // 填充表单
        this.fillEditForm();
      } catch (error) {
        console.error("[PostEdit] 资源加载失败:", error);
        notification.error(`加载资源失败: ${error.message}`, 5000);
      } finally {
        this.loading = false;
      }
    },

    fillEditForm() {
      // 如果资源已绑定教材目录，不应该填充 grade、subject、textbook 字段
      // 这些信息应该由 catalog_info 管理，避免用户误操作覆盖
      // 只有在未绑定教材目录时，才从 resource 或 auto_meta_result 获取
      let gradeValue = "";
      let subjectValue = "";
      let textbookValue = "";
      
      if (this.resource?.catalog_info || this.resource?.catalog_id) {
        // 已绑定教材目录，不填充这些字段，避免覆盖 catalog_info
        gradeValue = "";
        subjectValue = "";
        textbookValue = "";
        console.log("[PostEdit] 资源已绑定教材目录，不填充 grade/subject/textbook 字段");
      } else {
        // 未绑定教材目录，从 resource 或 auto_meta_result 获取
        gradeValue = this.resource.grade || this.getFieldFromAutoMeta("grade") || "";
        subjectValue = this.resource.subject || this.getFieldFromAutoMeta("subject") || "";
        textbookValue = this.resource.version || this.getFieldFromAutoMeta("textbook_version") || "";
      }

      // 使用现有的数据填充编辑表单
      this.editForm = {
        title: this.resource.title || "",
        category: this.resource.category || "",
        description: this.resource.description || "",
        grade: gradeValue,
        subject: subjectValue,
        textbook: textbookValue,
        chapter_info: this.resource.chapter_info || "",
        cover_url: this.resource.cover_url || "",
        unit: this.resource.unit || "",
        unit_index: this.resource.unit_index || null,
        source_attribution: this.resource.source_attribution || "",
      };

      console.log("[PostEdit] 编辑表单已填充:", this.editForm);
      console.log("[PostEdit] 资源单元信息:", {
        unit: this.resource.unit,
        unit_index: this.resource.unit_index,
        catalog_id: this.resource.catalog_id,
        catalog_info: this.resource.catalog_info,
        editForm_unit: this.editForm.unit,
        editForm_unit_index: this.editForm.unit_index
      });

      // 如果资源已绑定教材目录，设置 selectedCatalogId
      // 优先使用 catalog_id，如果没有则尝试从 catalog_info 查找
      if (this.resource?.catalog_id) {
        this.selectedCatalogId = this.resource.catalog_id;
        console.log("[PostEdit] 已设置 selectedCatalogId:", this.selectedCatalogId);
      } else if (this.resource?.catalog_info) {
        // 如果有 catalog_info 但没有 catalog_id，尝试查找
        // 注意：这里不等待异步结果，但会在 findCatalogIdByInfo 中设置
        // 为了确保 hasCatalogBindingForFields 判断正确，我们依赖 resource.catalog_info 的存在
        console.log("[PostEdit] 资源有 catalog_info 但没有 catalog_id，将尝试查找");
      }

      // 检查单元信息输入框显示条件
      const shouldShowUnitInfo = this.editForm.unit || 
                                 this.selectedCatalogId || 
                                 this.resource?.catalog_info || 
                                 this.resource?.catalog_id;
      console.log("[PostEdit] 单元信息输入框显示条件检查:", {
        editForm_unit: this.editForm.unit,
        selectedCatalogId: this.selectedCatalogId,
        has_catalog_info: !!this.resource?.catalog_info,
        catalog_id: this.resource?.catalog_id,
        shouldShow: shouldShowUnitInfo
      });

      // 如果资源已绑定教材目录，填充筛选条件
      if (this.resource?.catalog_info) {
        const info = this.resource.catalog_info;
        this.catalogFilter = {
          education_level: info.education_level || "",
          subject: info.subject || "",
          grade: info.grade || "",
          volume: info.volume || "",
          textbook_version: info.textbook_version || "",
        };
        // 查找对应的 catalog_id
        this.findCatalogIdByInfo(info);
      } else if (this.resource?.catalog_id) {
        // 如果资源有 catalog_id，直接使用
        this.selectedCatalogId = this.resource.catalog_id;
        // 尝试根据 catalog_id 填充筛选条件
        this.fillFilterFromCatalogId(this.resource.catalog_id);
      }
    },

    getFieldFromAutoMeta(fieldName) {
      const autoMeta = this.resource?.auto_meta_result;
      if (!autoMeta) return null;

      const fieldMap = {
        grade: "grade",
        subject: "subject",
        textbook_version: "textbook_version",
      };

      const mappedField = fieldMap[fieldName];
      return autoMeta[mappedField] || null;
    },

    /**
     * 格式化年级显示
     */
    formatGrade(grade) {
      if (typeof grade === "number") {
        const gradeNames = [
          "",
          "一",
          "二",
          "三",
          "四",
          "五",
          "六",
          "七",
          "八",
          "九",
        ];
        return gradeNames[grade] || `${grade}`;
      }
      // 如果是字符串，尝试提取数字
      const match = grade.toString().match(/(\d+)/);
      if (match) {
        const num = parseInt(match[1]);
        const gradeNames = [
          "",
          "一",
          "二",
          "三",
          "四",
          "五",
          "六",
          "七",
          "八",
          "九",
        ];
        return gradeNames[num] || num;
      }
      return grade;
    },

    /**
     * 根据 catalog_info 查找对应的 catalog_id
     */
    async findCatalogIdByInfo(catalogInfo) {
      try {
        console.log("[PostEdit] 根据 catalog_info 查找 catalog_id:", catalogInfo);
        
        const params = {
          education_level: catalogInfo.education_level === '小学' ? '小学' : 
                          catalogInfo.education_level === 'elementary' ? '小学' :
                          catalogInfo.education_level === '初中' ? '初中' :
                          catalogInfo.education_level === 'middle' ? '初中' :
                          catalogInfo.education_level,
          grade: catalogInfo.grade,
          subject: catalogInfo.subject,
          textbook_version: catalogInfo.textbook_version,
          limit: 1
        };

        // 如果有 volume，也作为筛选条件（如果后端支持）
        if (catalogInfo.volume) {
          // 注意：后端可能不支持 volume 参数，先不传
        }

        const response = await apiHttpClient.get("/api/catalogs", { params });
        
        if (response.data?.data && response.data.data.length > 0) {
          this.selectedCatalogId = response.data.data[0].id;
          console.log("[PostEdit] 找到对应的 catalog_id:", this.selectedCatalogId);
        } else {
          console.warn("[PostEdit] 未找到匹配的教材目录");
        }
      } catch (error) {
        console.error("[PostEdit] 查找 catalog_id 失败:", error);
      }
    },

    /**
     * 加载教材目录列表
     * 获取所有教材目录数据，用于提取筛选选项
     */
    async loadCatalogs() {
      try {
        this.loadingCatalogs = true;
        
        // 先获取第一页，查看总数
        const firstResponse = await apiHttpClient.get("/api/catalogs", {
          params: {
            page: 1,
            limit: 1000, // 使用较大的limit值
          },
        });

        console.log("[PostEdit] 筛选选项API响应:", firstResponse.data);

        if (firstResponse.data) {
          let allData = [];
          // 处理响应数据结构：可能是 { data: [...], pagination: {...} } 或直接是数组
          if (firstResponse.data.data && Array.isArray(firstResponse.data.data)) {
            allData = firstResponse.data.data;
          } else if (Array.isArray(firstResponse.data)) {
            allData = firstResponse.data;
          }

          const pagination = firstResponse.data?.pagination;
          const total = pagination?.total || allData.length;
          
          console.log("[PostEdit] 数据总数:", total, "已获取:", allData.length);

          // 如果总数超过已获取的数量，需要分页获取所有数据
          if (pagination && total > allData.length) {
            console.log("[PostEdit] 需要获取更多数据，开始分页获取...");
            const limit = pagination.limit || 1000;
            const totalPages = pagination.total_pages || Math.ceil(total / limit);
            
            // 获取剩余页面的数据
            const promises = [];
            for (let page = 2; page <= totalPages; page++) {
              promises.push(
                apiHttpClient.get("/api/catalogs", {
                  params: {
                    page,
                    limit,
                  },
                })
              );
            }

            // 等待所有请求完成
            const responses = await Promise.all(promises);
            
            // 合并所有数据
            responses.forEach((response) => {
              if (response.data) {
                let pageData = [];
                if (response.data.data && Array.isArray(response.data.data)) {
                  pageData = response.data.data;
                } else if (Array.isArray(response.data)) {
                  pageData = response.data;
                }
                allData = [...allData, ...pageData];
              }
            });

            console.log("[PostEdit] 分页获取完成，总数据量:", allData.length);
          }

          // 去重（根据id）
          const uniqueData = [];
          const seenIds = new Set();
          for (const item of allData) {
            if (item.id && !seenIds.has(item.id)) {
              seenIds.add(item.id);
              uniqueData.push(item);
            }
          }

          this.catalogs = uniqueData;
          console.log("[PostEdit] 加载教材目录成功，去重后数量:", this.catalogs.length);
        } else {
          this.catalogs = [];
        }
      } catch (error) {
        console.error("[PostEdit] 加载教材目录失败:", error);
        notification.warning("加载教材目录失败，可能无法绑定教材目录");
        this.catalogs = [];
      } finally {
        this.loadingCatalogs = false;
      }
    },

    /**
     * 筛选条件变化
     */
    onFilterChange() {
      console.log("[PostEdit] 筛选条件变化:", this.catalogFilter);
      
      // 如果后面的筛选条件被清空，清空后续的筛选条件
      if (!this.catalogFilter.education_level) {
        this.catalogFilter.subject = "";
        this.catalogFilter.grade = "";
        this.catalogFilter.volume = "";
        this.catalogFilter.textbook_version = "";
      } else if (!this.catalogFilter.subject) {
        this.catalogFilter.grade = "";
        this.catalogFilter.volume = "";
        this.catalogFilter.textbook_version = "";
      } else if (!this.catalogFilter.grade) {
        this.catalogFilter.volume = "";
        this.catalogFilter.textbook_version = "";
      } else if (!this.catalogFilter.volume) {
        this.catalogFilter.textbook_version = "";
      }
      
      // 如果所有条件都选择了，自动匹配 catalog_id
      if (this.matchedCatalog) {
        this.selectedCatalogId = this.matchedCatalog.id;
        this.isUnbindingCatalog = false; // 用户重新选择了，取消解除绑定标记
        console.log("[PostEdit] 自动匹配到 catalog_id:", this.selectedCatalogId);
      } else {
        this.selectedCatalogId = null;
      }
    },

    /**
     * 确认绑定教材目录
     */
    confirmCatalogSelection() {
      if (this.matchedCatalog) {
        this.selectedCatalogId = this.matchedCatalog.id;
        this.isUnbindingCatalog = false; // 用户重新选择了，取消解除绑定标记
        // 更新 resource.catalog_info 以便立即显示新的绑定信息
        if (!this.resource.catalog_info) {
          this.resource.catalog_info = {};
        }
        this.resource.catalog_info.education_level = this.matchedCatalog.education_level;
        this.resource.catalog_info.subject = this.matchedCatalog.subject;
        this.resource.catalog_info.grade = this.matchedCatalog.grade;
        this.resource.catalog_info.volume = this.matchedCatalog.volume;
        this.resource.catalog_info.textbook_version = this.matchedCatalog.textbook_version;
        this.resource.catalog_id = this.matchedCatalog.id;
        console.log("[PostEdit] 确认绑定教材目录 ID:", this.selectedCatalogId);
        console.log("[PostEdit] 已更新 resource.catalog_info:", this.resource.catalog_info);
        notification.success("已选择教材目录，请填写所属单元");
      }
    },

    /**
     * 教材目录选择变化（保留用于兼容）
     */
    onCatalogChange() {
      console.log("[PostEdit] 选择的教材目录 ID:", this.selectedCatalogId);
      // 如果选择了新的教材目录，清空单元信息（让用户重新填写）
      if (this.selectedCatalogId && !this.resource?.catalog_info) {
        this.editForm.unit = "";
        this.editForm.unit_index = null;
      }
    },

    /**
     * 根据 catalog_id 填充筛选条件
     */
    async fillFilterFromCatalogId(catalogId) {
      try {
        const catalog = this.catalogs.find(c => c.id === catalogId);
        if (catalog) {
          this.catalogFilter = {
            education_level: catalog.education_level || "",
            subject: catalog.subject || "",
            grade: catalog.grade || "",
            volume: catalog.volume || "",
            textbook_version: catalog.textbook_version || "",
          };
        }
      } catch (error) {
        console.error("[PostEdit] 填充筛选条件失败:", error);
      }
    },

    /**
     * 解除绑定
     */
    unbindCatalog() {
      this.selectedCatalogId = null;
      this.isUnbindingCatalog = true; // 标记用户明确要解除绑定
      this.editForm.unit = "";
      this.editForm.unit_index = null;
      this.catalogFilter = {
        education_level: "",
        subject: "",
        grade: "",
        volume: "",
        textbook_version: "",
      };
      // 清除 resource.catalog_info 以便立即隐藏当前绑定显示
      if (this.resource) {
        this.resource.catalog_info = null;
        this.resource.catalog_id = null;
      }
      console.log("[PostEdit] 已解除教材目录绑定");
    },

    /**
     * 获取资源出处历史记录
     */
    getSourceAttributionHistory() {
      try {
        const history = localStorage.getItem('source_attribution_history');
        return history ? JSON.parse(history) : [];
      } catch (error) {
        console.error("[PostEdit] 获取资源出处历史记录失败:", error);
        return [];
      }
    },

    /**
     * 保存资源出处到历史记录
     */
    saveSourceAttributionToHistory(value) {
      if (!value || !value.trim()) return;
      
      try {
        const history = this.getSourceAttributionHistory();
        const trimmedValue = value.trim();
        
        // 移除重复项
        const filteredHistory = history.filter(item => item !== trimmedValue);
        
        // 添加到最前面
        filteredHistory.unshift(trimmedValue);
        
        // 只保留最近20条记录
        const limitedHistory = filteredHistory.slice(0, 20);
        
        localStorage.setItem('source_attribution_history', JSON.stringify(limitedHistory));
      } catch (error) {
        console.error("[PostEdit] 保存资源出处历史记录失败:", error);
      }
    },

    /**
     * 资源出处输入事件
     */
    onSourceAttributionInput() {
      const value = this.editForm.source_attribution || '';
      if (!value.trim()) {
        this.sourceAttributionSuggestions = [];
        return;
      }

      const history = this.getSourceAttributionHistory();
      const lowerValue = value.toLowerCase();
      
      // 过滤匹配的历史记录
      this.sourceAttributionSuggestions = history.filter(item => 
        item.toLowerCase().includes(lowerValue)
      ).slice(0, 5); // 最多显示5条建议
    },

    /**
     * 选择资源出处建议
     */
    selectSourceAttribution(suggestion) {
      this.editForm.source_attribution = suggestion;
      this.showSourceAttributionSuggestions = false;
    },

    /**
     * 隐藏资源出处建议列表
     */
    hideSourceAttributionSuggestions() {
      // 延迟隐藏，以便点击建议项时能触发
      setTimeout(() => {
        this.showSourceAttributionSuggestions = false;
      }, 200);
    },

    // 处理封面上传
    async handleCoverUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // 检查文件类型
      if (!file.type.startsWith("image/")) {
        notification.error("请选择图片文件（JPG、PNG、GIF）");
        return;
      }

      // 检查文件大小（10MB）
      if (file.size > 10 * 1024 * 1024) {
        notification.error("图片大小不能超过 10MB");
        return;
      }

      this.coverFile = file;

      // 生成预览
      const reader = new FileReader();
      reader.onload = (e) => {
        this.coverPreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      // 自动上传
      await this.uploadCover();
    },

    // 拖拽封面上传
    onDropCover(event) {
      this.coverDragActive = false;
      const file = event.dataTransfer.files[0];
      
      if (!file) return;

      // 检查文件类型
      if (!file.type.startsWith("image/")) {
        notification.error("请上传图片文件（JPG、PNG、GIF）");
        return;
      }

      // 检查文件大小
      if (file.size > 10 * 1024 * 1024) {
        notification.error("图片大小不能超过 10MB");
        return;
      }

      this.coverFile = file;

      // 生成预览
      const reader = new FileReader();
      reader.onload = (e) => {
        this.coverPreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      // 自动上传
      this.uploadCover();
    },

    // 上传封面到服务器
    async uploadCover() {
      if (!this.coverFile) return;

      this.uploadingCover = true;
      this.coverUploadProgress = 0;

      try {
        // 根据 API 文档和 PostCreate 的实现，使用 POST /covers?post=${postId}，字段名是 file
        const formData = new FormData();
        formData.append("file", this.coverFile);

        console.log("[PostEdit] 开始上传封面:", {
          name: this.coverFile.name,
          size: this.coverFile.size,
          type: this.coverFile.type,
          resourceId: this.id,
        });

        // 使用与 PostCreate 相同的接口
        const endpoint = `/covers?post=${this.id}`;
        
        try {
          console.log("[PostEdit] 上传封面到:", endpoint);
          const response = await apiHttpClient.post(endpoint, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                this.coverUploadProgress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
              }
            },
          });
          
          console.log("[PostEdit] 封面上传成功，响应:", response.data);
          
          // 从响应中获取封面URL（如果有）
          let coverUrl = null;
          if (response.data) {
            coverUrl = response.data.url || 
                      response.data.cover_url || 
                      response.data.data?.url ||
                      response.data.data?.cover_url;
          }
          
          // 如果响应中没有URL，尝试从资源数据中获取
          if (!coverUrl && this.resource) {
            // 重新获取资源数据以获取最新的封面URL
            await this.fetchResource();
            coverUrl = this.resource?.cover_url;
          }
          
          // 更新表单中的封面URL
          if (coverUrl) {
            this.editForm.cover_url = coverUrl;
            console.log("[PostEdit] 更新封面URL:", coverUrl);
          }
          
          // 清除预览和文件，使用实际的封面URL
          this.coverFile = null;
          this.coverPreviewUrl = null;
          if (this.$refs.coverFileInput) {
            this.$refs.coverFileInput.value = "";
          }
          
          // 如果还没有获取到封面URL，重新加载资源数据
          if (!coverUrl) {
            await this.fetchResource();
            coverUrl = this.resource?.cover_url;
            if (coverUrl) {
              this.editForm.cover_url = coverUrl;
            }
          }
          
          // 封面上传成功，显示成功消息
          // 即使无法立即获取URL，封面也已经上传成功，保存时会自动关联
          if (coverUrl) {
            notification.success("封面上传成功");
          } else {
            console.log("[PostEdit] 封面上传成功，封面URL将在保存时自动关联");
            // 不显示警告，因为封面上传已经成功，保存时会自动关联
            // 封面文件已保存在 this.coverFile，提交时会一起发送
          }
          
        } catch (error) {
          console.error("[PostEdit] 封面上传失败:", error);
          
          // 如果封面上传失败，不显示错误提示
          // 因为封面文件还在 this.coverFile 中，可以在提交时一起发送
          // 这样可以避免用户看到错误提示，但实际上封面会在保存时一起上传
          console.warn("[PostEdit] 封面上传失败，但封面文件已保存，将在提交时一起上传");
          
          // 不清除封面文件，让它在提交时一起发送
          // this.coverFile 保持不变，这样 submitEdit 会使用 FormData 发送
        }
      } finally {
        this.uploadingCover = false;
        this.coverUploadProgress = 0;
      }
    },

    // 删除封面
    removeCover() {
      this.coverFile = null;
      this.coverPreviewUrl = null;
      this.editForm.cover_url = "";
      if (this.$refs.coverFileInput) {
        this.$refs.coverFileInput.value = "";
      }
    },

    // 替换封面
    replaceCover() {
      this.removeCover();
      if (this.$refs.coverFileInput) {
        this.$refs.coverFileInput.click();
      }
    },

    // 处理封面图片加载错误
    handleCoverImageError(event) {
      console.error("[PostEdit] 封面图片加载失败:", event.target.src);
      // 如果加载失败，尝试添加时间戳重新加载
      const src = event.target.src;
      if (src && !src.includes('?t=')) {
        event.target.src = `${src}${src.includes('?') ? '&' : '?'}t=${Date.now()}`;
      }
    },

    async submitEdit() {
      if (!this.isEditFormValid) {
        notification.warning("请填写必填项：标题、分类");
        return;
      }

      this.isSaving = true;
      this.errorMessage = "";
      this.successMessage = "";

      try {
        console.log("[PostEdit] 提交修改，数据:", this.editForm);
        console.log("[PostEdit] 是否有新封面文件:", !!this.coverFile);
        console.log("[PostEdit] 当前封面URL:", this.editForm.cover_url);

        let response;

        // 构建更新数据对象（至少包含必填字段）
        const updateData = {
          title: this.editForm.title,
          category: this.editForm.category,
        };

        // 添加可选字段
        // description: 如果为空字符串，明确设置为空字符串以清空；如果有值，使用 trim 后的值
        if (this.editForm.description !== undefined) {
          if (this.editForm.description && this.editForm.description.trim()) {
            updateData.description = this.editForm.description.trim();
          } else {
            updateData.description = ""; // 清空描述（发送空字符串）
          }
        }
        
        // source_attribution: 如果为空字符串，明确设置为空字符串以清空；如果有值，使用 trim 后的值
        if (this.editForm.source_attribution !== undefined) {
          if (this.editForm.source_attribution && this.editForm.source_attribution.trim()) {
            updateData.source_attribution = this.editForm.source_attribution.trim();
          } else {
            updateData.source_attribution = ""; // 清空出处（发送空字符串）
          }
        }
        // 如果资源已绑定教材目录，不应该发送 grade、subject、version 等字段
        // 这些信息应该由 catalog_info 管理，避免覆盖
        // 只有在未绑定教材目录时，才允许用户手动填写这些字段
        // 重要：即使 selectedCatalogId 为 null，只要 resource.catalog_id 或 resource.catalog_info 存在，就认为已绑定
        const hasCatalogBindingForFields = !!(this.resource?.catalog_id || this.resource?.catalog_info || this.selectedCatalogId);
        
        // 确保已绑定教材目录时，updateData 中不包含这些字段（即使 editForm 中有值）
        if (hasCatalogBindingForFields) {
          // 已绑定教材目录，明确删除这些字段，确保不会发送
          // 同时清空 editForm 中的这些字段，防止任何地方引用它们
          delete updateData.grade;
          delete updateData.subject;
          delete updateData.version;
          // 清空 editForm 中的这些字段，确保不会在任何地方被使用
          this.editForm.grade = "";
          this.editForm.subject = "";
          this.editForm.textbook = "";
          console.log("[PostEdit] 资源已绑定教材目录，明确删除 grade/subject/version 字段并清空 editForm");
          console.log("[PostEdit] JSON 提交绑定状态检查:", {
            catalog_id: this.resource?.catalog_id,
            has_catalog_info: !!this.resource?.catalog_info,
            catalog_info: this.resource?.catalog_info,
            selectedCatalogId: this.selectedCatalogId,
            hasCatalogBindingForFields,
            editForm_grade: this.editForm.grade,
            editForm_subject: this.editForm.subject,
            editForm_textbook: this.editForm.textbook
          });
        } else {
          // 未绑定教材目录，允许手动填写这些字段
          if (this.editForm.grade && this.editForm.grade.trim()) {
            updateData.grade = this.editForm.grade.trim();
          }
          if (this.editForm.subject && this.editForm.subject.trim()) {
            updateData.subject = this.editForm.subject.trim();
          }
          if (this.editForm.textbook && this.editForm.textbook.trim()) {
            updateData.version = this.editForm.textbook.trim(); // 后端字段名是 version
          }
        }
        
        // chapter_info 可以独立更新（不受教材目录绑定影响）
        if (this.editForm.chapter_info && this.editForm.chapter_info.trim()) {
          updateData.chapter_info = this.editForm.chapter_info.trim();
        }
        
        // 添加教材目录绑定字段
        // 根据文档，catalog_id 应该是数字
        console.log("[PostEdit] 提交时的 selectedCatalogId:", this.selectedCatalogId, "类型:", typeof this.selectedCatalogId);
        console.log("[PostEdit] 提交时的 resource.catalog_id:", this.resource?.catalog_id);
        console.log("[PostEdit] 提交时的 resource.catalog_info:", this.resource?.catalog_info);
        
        // 确定要使用的 catalog_id
        // 如果用户新选择了教材目录，使用新值
        // 如果用户没有重新选择，但资源之前已绑定，保持原绑定
        // 如果资源有 catalog_info 但没有 catalog_id，尝试根据 catalog_info 查找
        // 只有在用户明确解除绑定且没有重新选择时，才设置为 null
        let catalogIdToUse = null;
        if (this.isUnbindingCatalog && !this.selectedCatalogId) {
          // 用户明确点击了"解除绑定"按钮，且没有重新选择新的教材目录
          catalogIdToUse = null;
          updateData.catalog_id = null;
          console.log("[PostEdit] 用户解除绑定且未重新选择，设置 catalog_id = null");
        } else if (this.selectedCatalogId) {
          // 用户新选择了教材目录
          const catalogIdValue = Number(this.selectedCatalogId);
          if (isNaN(catalogIdValue)) {
            console.error("[PostEdit] 错误：selectedCatalogId 不是有效数字:", this.selectedCatalogId);
            notification.error("教材目录ID格式错误，请重新选择");
            this.isSaving = false;
            return;
          }
          catalogIdToUse = catalogIdValue;
          updateData.catalog_id = catalogIdToUse;
          console.log("[PostEdit] 使用新选择的 catalog_id =", catalogIdToUse, "(数字)");
        } else if (this.resource?.catalog_id) {
          // 用户没有重新选择，但资源之前已绑定，保持原绑定
          catalogIdToUse = this.resource.catalog_id;
          updateData.catalog_id = catalogIdToUse;
          console.log("[PostEdit] 保持原有绑定，catalog_id =", catalogIdToUse);
        } else if (this.resource?.catalog_info && !this.resource?.catalog_id) {
          // 资源有 catalog_info 但没有 catalog_id，尝试根据 catalog_info 查找
          console.log("[PostEdit] 资源有 catalog_info 但没有 catalog_id，尝试查找对应的 catalog_id");
          try {
            const catalogInfo = this.resource.catalog_info;
            const params = {
              education_level: catalogInfo.education_level,
              grade: catalogInfo.grade,
              subject: catalogInfo.subject,
              textbook_version: catalogInfo.textbook_version,
              limit: 1
            };
            
            const response = await apiHttpClient.get("/api/catalogs", { params });
            if (response.data?.data && response.data.data.length > 0) {
              catalogIdToUse = response.data.data[0].id;
              updateData.catalog_id = catalogIdToUse;
              console.log("[PostEdit] 根据 catalog_info 找到对应的 catalog_id:", catalogIdToUse);
            } else {
              console.warn("[PostEdit] 根据 catalog_info 未找到匹配的 catalog_id");
            }
          } catch (error) {
            console.error("[PostEdit] 查找 catalog_id 失败:", error);
          }
        }
        // 注意：如果 catalogIdToUse 为 null，且 resource.catalog_id 也不存在，说明资源本来就没有绑定
        // 这种情况下不设置 updateData.catalog_id，让后端保持原值
        
        // 处理 unit：如果绑定了教材目录但单元留空，自动设置为"整本教材"
        // 判断是否有教材目录绑定：新选择、保持原有绑定、或有 catalog_info
        const hasCatalogBinding = catalogIdToUse !== null || 
                                  (this.resource?.catalog_info && !this.isUnbindingCatalog);
        
        console.log("[PostEdit] 处理 unit 字段:");
        console.log("  - catalogIdToUse:", catalogIdToUse);
        console.log("  - resource.catalog_id:", this.resource?.catalog_id);
        console.log("  - resource.catalog_info:", this.resource?.catalog_info);
        console.log("  - isUnbindingCatalog:", this.isUnbindingCatalog);
        console.log("  - hasCatalogBinding:", hasCatalogBinding);
        console.log("  - editForm.unit:", this.editForm.unit);
        
        if (hasCatalogBinding) {
          // 如果绑定了教材目录（新绑定、保持原有绑定、或有 catalog_info）
          if (this.editForm.unit && this.editForm.unit.trim()) {
            // 有填写单元，使用填写的值
            updateData.unit = this.editForm.unit.trim();
            console.log("[PostEdit] ✅ 使用填写的单元:", updateData.unit);
          } else {
            // 单元留空，自动设置为"整本教材"
            updateData.unit = "整本教材";
            console.log("[PostEdit] ✅ 单元留空，自动设置为「整本教材」");
          }
        } else if (this.editForm.unit && this.editForm.unit.trim()) {
          // 没有绑定教材目录，但有填写单元，也添加
          updateData.unit = this.editForm.unit.trim();
          console.log("[PostEdit] ✅ 未绑定教材目录，使用填写的单元:", updateData.unit);
        } else {
          console.log("[PostEdit] ⚠️ 未设置 unit 字段（没有绑定教材目录且单元为空）");
        }
        
        // 确保 unit 字段被包含在 updateData 中（用于调试）
        console.log("[PostEdit] 最终 updateData.unit:", updateData.unit);
        if (this.editForm.unit_index !== null && this.editForm.unit_index !== undefined) {
          updateData.unit_index = this.editForm.unit_index;
        }

        // 如果有新上传的封面文件，使用 FormData 发送（multipart/form-data）
        if (this.coverFile) {
          console.log("[PostEdit] 使用 FormData 发送，包含封面文件");
          
          const formData = new FormData();
          
          // 添加必填字段
          formData.append("title", updateData.title);
          formData.append("category", updateData.category);
          
          // 添加可选字段
          if (updateData.description !== undefined) {
            formData.append("description", updateData.description || "");
          }
          if (updateData.source_attribution !== undefined) {
            formData.append("source_attribution", updateData.source_attribution || "");
          }
          // 如果资源已绑定教材目录，不发送 grade、subject、version 字段
          // 重要：即使 selectedCatalogId 为 null，只要 resource.catalog_id 或 resource.catalog_info 存在，就认为已绑定
          // 注意：即使 updateData 中有这些字段（可能来自之前的逻辑），也不发送
          const hasCatalogBindingForFields = !!(this.resource?.catalog_id || this.resource?.catalog_info || this.selectedCatalogId);
          if (!hasCatalogBindingForFields) {
            // 未绑定教材目录，允许发送这些字段
            if (updateData.grade) formData.append("grade", updateData.grade);
            if (updateData.subject) formData.append("subject", updateData.subject);
            if (updateData.version) formData.append("version", updateData.version);
          } else {
            // 已绑定教材目录，明确不发送这些字段，即使 updateData 中有值
            console.log("[PostEdit] FormData 提交：资源已绑定教材目录，跳过 grade/subject/version 字段");
            console.log("[PostEdit] FormData 绑定状态检查:", {
              catalog_id: this.resource?.catalog_id,
              has_catalog_info: !!this.resource?.catalog_info,
              catalog_info: this.resource?.catalog_info,
              selectedCatalogId: this.selectedCatalogId,
              hasCatalogBindingForFields,
              updateData_has_grade: !!updateData.grade,
              updateData_has_subject: !!updateData.subject,
              updateData_has_version: !!updateData.version,
              editForm_grade: this.editForm.grade,
              editForm_subject: this.editForm.subject,
              editForm_textbook: this.editForm.textbook
            });
          }
          if (updateData.chapter_info) formData.append("chapter_info", updateData.chapter_info);

          // 添加教材目录绑定字段
          // 如果用户明确解绑（isUnbindingCatalog = true），需要明确发送 null 或空字符串
          if (this.isUnbindingCatalog && !this.selectedCatalogId) {
            // 用户明确解绑，发送空字符串或 null 给后端
            formData.append("catalog_id", "");
            console.log("[PostEdit] FormData 中明确设置 catalog_id 为空（解除绑定）");
          } else if (updateData.catalog_id !== null && updateData.catalog_id !== undefined) {
            // 正常绑定或保持绑定
            const catalogIdValue = Number(updateData.catalog_id);
            if (!isNaN(catalogIdValue)) {
              formData.append("catalog_id", String(catalogIdValue));
              console.log("[PostEdit] FormData 中添加 catalog_id:", catalogIdValue, "(数字，转换为字符串)");
            } else {
              console.error("[PostEdit] 错误：updateData.catalog_id 不是有效数字:", updateData.catalog_id);
            }
          }
          // 处理 unit 字段：如果解绑，也需要清空 unit
          if (this.isUnbindingCatalog && !this.selectedCatalogId) {
            // 解绑时，清空 unit
            formData.append("unit", "");
            formData.append("unit_index", "");
            console.log("[PostEdit] FormData 中清空 unit 和 unit_index（解除绑定）");
          } else if (updateData.unit) {
            formData.append("unit", updateData.unit);
          }
          if (updateData.unit_index !== null && updateData.unit_index !== undefined) {
            formData.append("unit_index", String(updateData.unit_index));
          }
          
          // 添加封面文件，字段名为 cover（根据后端 API 要求）
          formData.append("cover", this.coverFile);
          
          // 如果有 cover_url，也传递（用于覆盖）
          if (this.editForm.cover_url && this.editForm.cover_url.trim()) {
            formData.append("cover_url", this.editForm.cover_url.trim());
          }
          
          // 只在开发环境输出详细日志
          if (process.env.NODE_ENV === 'development') {
            console.log("[PostEdit] FormData 字段:", {
              title: updateData.title,
              category: updateData.category,
              catalog_id: updateData.catalog_id,
              unit: updateData.unit,
              hasCover: !!this.coverFile,
            });
          }

          // 使用 PUT 方法发送 FormData
          response = await apiHttpClient.put(
            `/api/resources/${this.id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        } else {
          // 如果没有新文件，使用 JSON 数据发送
          console.log("[PostEdit] 使用 JSON 发送");
          
          // 如果有 cover_url，添加到更新数据中
          if (this.editForm.cover_url && this.editForm.cover_url.trim()) {
            updateData.cover_url = this.editForm.cover_url.trim();
          }

          // 确保解绑时 catalog_id 被明确设置为 null
          if (this.isUnbindingCatalog && !this.selectedCatalogId) {
            updateData.catalog_id = null;
            updateData.unit = null;
            updateData.unit_index = null;
            console.log("[PostEdit] JSON 提交：明确设置 catalog_id = null（解除绑定）");
          }

          // 最终检查：确保已绑定教材目录时，updateData 中不包含 grade、subject、version 字段
          if (hasCatalogBindingForFields) {
            // 再次明确删除，确保万无一失
            delete updateData.grade;
            delete updateData.subject;
            delete updateData.version;
            console.log("[PostEdit] ⚠️ 最终检查：已绑定教材目录，再次删除 grade/subject/version 字段");
            console.log("[PostEdit] 最终 updateData 对象:", JSON.stringify(updateData, null, 2));
            console.log("[PostEdit] 最终检查 - updateData 中是否还有这些字段:", {
              has_grade: 'grade' in updateData,
              has_subject: 'subject' in updateData,
              has_version: 'version' in updateData
            });
          }
          
          // 只在开发环境输出详细日志
          if (process.env.NODE_ENV === 'development') {
            console.log("[PostEdit] 发送的 JSON 数据:", updateData);
            console.log("[PostEdit] 发送的 JSON 数据（字符串）:", JSON.stringify(updateData));
            console.log("[PostEdit] catalog_id:", updateData.catalog_id, "unit:", updateData.unit);
            console.log("[PostEdit] isUnbindingCatalog:", this.isUnbindingCatalog, "selectedCatalogId:", this.selectedCatalogId);
          }

          // 使用 PUT 方法发送 JSON 数据
          response = await apiHttpClient.put(
          `/api/resources/${this.id}`,
          updateData
        );
        }
        
        // 检查响应中是否包含 catalog_id 和 unit
        console.log("[PostEdit] 更新成功，响应数据:", response.data);
        console.log("[PostEdit] 响应数据的完整结构:", JSON.stringify(response.data, null, 2));
        
        const responseCatalogId = response.data?.catalog_id || response.data?.data?.catalog_id;
        const responseUnit = response.data?.unit || response.data?.data?.unit;
        
        console.log("[PostEdit] 响应中的 catalog_id:", responseCatalogId);
        console.log("[PostEdit] 响应中的 unit:", responseUnit);
        console.log("[PostEdit] 提交的 catalog_id:", updateData.catalog_id);
        console.log("[PostEdit] 提交的 unit:", updateData.unit);
        
        if (updateData.catalog_id && !responseCatalogId) {
          console.warn("[PostEdit] ⚠️ 警告：提交了 catalog_id 但响应中没有返回，可能后端没有保存");
        } else if (updateData.catalog_id && responseCatalogId) {
          console.log("[PostEdit] ✅ 确认：catalog_id 已保存，响应值:", responseCatalogId);
        }
        
        if (updateData.unit && !responseUnit) {
          console.warn("[PostEdit] ⚠️ 警告：提交了 unit 但响应中没有返回，可能后端没有保存");
        } else if (updateData.unit && responseUnit) {
          console.log("[PostEdit] ✅ 确认：unit 已保存，响应值:", responseUnit);
        }

        console.log("[PostEdit] 修改成功:", response.data);
        
        // 如果资源出处有值，保存到历史记录
        if (updateData.source_attribution && updateData.source_attribution.trim()) {
          this.saveSourceAttributionToHistory(updateData.source_attribution);
        }
        
        // 如果更新了教材目录绑定，重新获取资源数据以更新显示
        if (updateData.catalog_id !== undefined || this.isUnbindingCatalog) {
          console.log("[PostEdit] 教材目录绑定已更新，重新获取资源数据");
          await this.fetchResource();
        }
        
        notification.success("资源已成功更新！3秒后返回详情页...", 3000);

        // 清除封面文件状态
        this.coverFile = null;
        this.coverPreviewUrl = null;
        if (this.$refs.coverFileInput) {
          this.$refs.coverFileInput.value = "";
        }

        // 3秒后返回详情页
        setTimeout(() => {
          this.$router.push(`/resources/${this.id}`);
        }, 3000);
      } catch (error) {
        console.error("[PostEdit] 提交失败:", error);
        console.error("[PostEdit] 错误详情:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        notification.error(
          `提交失败: ${error.response?.data?.message || error.message}`,
          5000
        );
      } finally {
        this.isSaving = false;
      }
    },
  },
});
</script>

<style scoped>
.post-edit-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);
}

.post-edit-page-body {
  max-width: 900px;
  margin: 0 auto;
}

.card {
  margin-bottom: 20px;
}

.form-label {
  font-weight: 500;
  margin-bottom: 8px;
}

/* 封面预览区域 */
.cover-preview-box {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
  overflow: hidden;
  min-height: 200px;
}

.cover-preview-content {
  position: relative;
  width: 100%;
  padding-top: 75%; /* 4:3 比例 */
  background: #fff;
}

.cover-preview-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.cover-preview-content:hover .cover-preview-overlay {
  opacity: 1;
}

.cover-preview-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #6c757d;
}

.cover-preview-empty i {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

/* 上传容器 */
.cover-upload-container {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  background: #fff;
}

/* 拖拽上传区域 */
.cover-upload-zone {
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  background: #f8f9fa;
  transition: all 0.3s;
  cursor: pointer;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.cover-upload-zone:hover {
  border-color: #007bff;
  background: #f0f7ff;
}

.cover-upload-zone.drag-active {
  border-color: #007bff;
  background: #e7f1ff;
  border-style: solid;
}

.cover-upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6c757d;
}

.cover-upload-icon {
  font-size: 3rem;
  margin-bottom: 0.75rem;
  color: #adb5bd;
}

.cover-upload-text {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #495057;
}

.cover-upload-hint {
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0;
}

.cover-upload-preview {
  position: relative;
  width: 100%;
  height: 100%;
}

.cover-upload-preview-img {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 4px;
}

.cover-upload-preview-overlay {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s;
}

.cover-upload-preview:hover .cover-upload-preview-overlay {
  opacity: 1;
}

/* 上传进度 */
.cover-upload-progress {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.progress {
  height: 8px;
  border-radius: 4px;
  background: #e9ecef;
}

/* 分隔线 */
.cover-upload-divider {
  margin: 1.5rem 0;
  text-align: center;
  position: relative;
}

.cover-upload-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e9ecef;
}

.cover-upload-divider span {
  position: relative;
  background: #fff;
  padding: 0 1rem;
  color: #6c757d;
  font-size: 0.875rem;
}

/* URL 输入 */
.cover-url-input {
  margin-top: 1rem;
}

/* 操作按钮容器 - 现代化设计 */
.action-buttons-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  padding: 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  margin-top: 2.5rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

/* 保存按钮 - 使用全局样式，只添加特定样式 */
.btn-save {
  min-width: 140px;
}

.btn-save .spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.15em;
}

/* 取消按钮 - 使用全局样式，只添加特定样式 */
.btn-cancel {
  min-width: 140px;
}

/* 教材目录选择器样式 */
.catalog-selector {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.catalog-filter-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: flex-end;
}

.filter-item {
  flex: 1;
  min-width: 120px;
}

.filter-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.5rem;
  white-space: nowrap;
}

.filter-item .form-select {
  width: 100%;
  transition: all 0.2s;
}

.filter-item .form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.filter-item .form-select:disabled {
  background-color: #e9ecef;
  opacity: 0.6;
  cursor: not-allowed;
}

/* 匹配结果样式 */
.catalog-match-result {
  margin-top: 1rem;
}

.match-success {
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #d1e7dd 0%, #c3e6cb 100%);
  border: 1px solid #badbcc;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(25, 135, 84, 0.1);
}

.match-warning {
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%);
  border: 1px solid #ffc107;
  border-radius: 8px;
  color: #856404;
  display: flex;
  align-items: center;
}

.catalog-info-display {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.catalog-badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  background: #fff;
  border: 1px solid #198754;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #198754;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.current-catalog {
  background: linear-gradient(135deg, #e7f1ff 0%, #d0e7ff 100%);
  border: 1px solid #b3d9ff;
}

/* 资源出处自动完成样式 */
.autocomplete-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  max-height: 200px;
  overflow-y: auto;
  margin-top: 2px;
}

.autocomplete-item {
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.autocomplete-item:last-child {
  border-bottom: none;
}

.autocomplete-item:hover {
  background-color: #f8f9fa;
}

.autocomplete-item:active {
  background-color: #e9ecef;
}

/* 深色主题适配 */
[data-theme="dark"] .autocomplete-suggestions {
  background: #2d3748;
  border-color: #4a5568;
}

[data-theme="dark"] .autocomplete-item {
  border-bottom-color: #4a5568;
  color: #e2e8f0;
}

[data-theme="dark"] .autocomplete-item:hover {
  background-color: #4a5568;
}

[data-theme="dark"] .autocomplete-item:active {
  background-color: #2d3748;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .action-buttons-container {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .btn-save,
  .btn-cancel {
    width: 100%;
  }

  .catalog-filter-row {
    flex-direction: column;
    gap: 1rem;
  }

  .filter-item {
    min-width: 100%;
  }

  .catalog-info-display {
    flex-direction: column;
    gap: 0.375rem;
  }

  .catalog-badge {
    width: fit-content;
  }
}

@media (min-width: 769px) and (max-width: 992px) {
  .filter-item {
    min-width: calc(50% - 0.5rem);
  }
}
</style>
