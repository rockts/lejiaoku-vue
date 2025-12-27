<template>
  <BreadCrumbs />

  <!-- 未登录提示 -->
  <div v-if="!isAuthenticated" class="container my-5 text-center">
    <div class="alert alert-warning mb-4" role="alert">
      <i class="bi bi-exclamation-triangle me-2"></i>
      <strong>需要登录</strong>
    </div>
    <p class="mb-4">上传资源需要先登录，请点击下方按钮登录或注册</p>
    <router-link to="/login" class="btn btn-primary me-2">
      <i class="bi bi-box-arrow-in-right me-2"></i>登录
    </router-link>
    <router-link to="/register" class="btn btn-outline-primary">
      <i class="bi bi-person-plus me-2"></i>注册
    </router-link>
  </div>

  <!-- 已登录但无权限（user 角色） -->
  <div v-else-if="isAuthenticated && !canUpload" class="container my-5 text-center">
    <div class="alert alert-warning mb-4" role="alert">
      <i class="bi bi-exclamation-triangle me-2"></i>
      <strong>无权限</strong>
    </div>
    <p class="mb-4">您需要成为贡献者才能上传资源</p>
    <button
      v-if="isUser"
      type="button"
      class="btn btn-primary"
      @click="handleApplyContributor"
    >
      <i class="bi bi-person-plus me-2"></i>申请成为贡献者
    </button>
  </div>

  <!-- 已登录且有权限，显示上传表单 -->
  <div v-else-if="canUpload" class="post-create-page">
    <div class="container post-create-page-body">
      <!-- 上传提示 -->
      <div class="alert alert-info mb-4" role="alert">
        <i class="bi bi-info-circle me-2"></i>
        <strong>上传流程：</strong>填写标题和分类 → 选择文件 → 点击发布 →
          系统自动解析教材信息 → 8秒后跳转到首页
      </div>

      <!-- 教材绑定提示 -->
      <div v-if="routeCatalogId || textbookCatalogId" class="alert alert-success mb-4" role="alert">
        <i class="bi bi-book-half me-2"></i>
        <strong>已绑定教材：</strong>
        <span v-if="routeCatalogId">教材 #{{ routeCatalogId }}</span>
        <span v-else-if="textbookCatalogId">
          教材 #{{ textbookCatalogId }}
          <span class="text-muted small ms-2">
            ({{ getSelectedTextbookName() }})
          </span>
        </span>
        <span v-if="routeUnit || chapterInfo" class="ms-2">
          <i class="bi bi-list-ul me-1"></i>单元：{{ routeUnit || chapterInfo }}
        </span>
        <span v-else class="ms-2 text-warning">
          <i class="bi bi-info-circle me-1"></i>单元：未填写（整本教材可留空）
        </span>
        <div v-if="!routeCatalogId && textbookCatalogId" class="mt-2">
          <small class="text-muted d-block mb-1">
            <i class="bi bi-info-circle me-1"></i>
            如果该教材在系统中不存在，请先前往「教材目录」创建
          </small>
          <router-link to="/catalog" class="btn btn-sm btn-outline-primary">
            <i class="bi bi-book me-1"></i>前往教材目录
          </router-link>
        </div>
      </div>

      <form>
        <!-- 资源标题 -->
        <div class="mb-4 card shadow-sm">
          <div class="card-header bg-white">
            <h6 class="mb-0">
              <i class="bi bi-pencil-square"></i> 资源标题
              <span class="text-danger">*</span>
            </h6>
          </div>
          <div class="card-body">
            <input
              v-model="title"
              placeholder="请输入资源标题..."
              type="text"
              class="form-control"
            />
            <small
              v-if="!title && isSubmitting"
              class="text-danger d-block mt-2"
              >必填项</small
            >
          </div>
        </div>

        <!-- 资源文件拖放区 -->
        <div class="upload-file-zone mb-4 card shadow-sm">
          <div class="card-header bg-white">
            <h6 class="mb-0">
              <i class="bi bi-file-earmark-arrow-up"></i> 资源文件
              <span class="text-danger">*</span>
            </h6>
          </div>
          <div class="card-body">
            <div
              :class="['drag-zone', { active: dragZoneActive }]"
              @dragover.prevent
              @drop.prevent="onDropFile"
              @dragenter="dragZoneActive = true"
              @dragleave="dragZoneActive = false"
            >
              <div v-if="file">
                <div class="file-info">
                  <i
                    class="bi bi-file-earmark-text"
                    style="font-size: 48px; color: #007bff"
                  ></i>
                  <p class="mt-3 mb-1 font-weight-bold">{{ file.name }}</p>
                  <p class="text-muted small">
                    {{ formatFileSize(file.size) }}
                  </p>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-danger mt-2"
                    @click="clearFile"
                  >
                    <i class="bi bi-trash"></i> 移除文件
                  </button>
                </div>
              </div>
              <div v-else>
                <label for="id_file" class="file-upload-box">
                  <div class="upload-file-icons">
                    <i
                      class="bi bi-cloud-upload"
                      style="font-size: 48px; color: #6c757d"
                    ></i>
                    <p class="mt-3 mb-1">将资源文件拖放到这里</p>
                    <p class="text-muted small">或点击选择文件</p>
                  </div>
                  <p class="text-muted small mt-2">
                    支持: PDF, Word, Excel, PPT 等文档格式
                  </p>
                </label>
              </div>
            </div>

            <!-- 资源文件 input -->
            <div>
              <input
                type="file"
                ref="file"
                @change="onChangeFile"
                id="id_file"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                  application/pdf,
                  application/msword,
                  application/vnd.ms-excel,
                  application/vnd.ms-powerpoint,
                  application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                  application/vnd.openxmlformats-officedocument.presentationml.presentation"
              />
            </div>
            <small v-if="!file && isSubmitting" class="text-danger d-block mt-2"
              >必填项</small
            >
          </div>
        </div>

        <!-- 封面上传（可选） -->
        <div class="upload-cover-section mb-4 card shadow-sm">
          <div class="card-header bg-white">
            <h6 class="mb-0"><i class="bi bi-image"></i> 资源封面（可选）</h6>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-4">
                <div class="cover-preview-box">
                  <div v-if="coverUploadProgress" class="cover-upload-progress">
                    <span>{{ coverUploadProgress + "%" }}</span>
                  </div>
                  <div
                    v-else-if="coverPreviewUrl"
                    class="cover-preview-wrapper"
                  >
                    <img
                      class="cover-preview img-fluid"
                      :src="coverPreviewUrl"
                      alt=""
                    />
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-danger mt-2"
                      @click="clearCover"
                    >
                      <i class="bi bi-trash"></i> 移除封面
                    </button>
                  </div>
                  <div
                    v-else
                    class="cover-placeholder"
                    :class="{ active: coverDragActive }"
                    @dragover.prevent
                    @drop.prevent="onDropCover"
                    @dragenter="coverDragActive = true"
                    @dragleave="coverDragActive = false"
                  >
                    <label for="id_cover" class="cover-upload-label">
                      <i
                        class="bi bi-image"
                        style="font-size: 36px; color: #6c757d"
                      ></i>
                      <p class="mt-2 mb-1 small">将封面图片拖放到这里</p>
                      <p class="text-muted small">或点击上传</p>
                    </label>
                  </div>
                </div>
              </div>
              <div class="col-md-8">
                <p class="text-muted small mb-2">
                  <i class="bi bi-info-circle"></i> 建议尺寸：800x600 像素
                </p>
                <p class="text-muted small mb-2">
                  <i class="bi bi-info-circle"></i> 支持格式：JPG, PNG, GIF
                </p>
                <p class="text-muted small mb-0">
                  <i class="bi bi-info-circle"></i> 文件大小：最大 5MB
                </p>
                <p class="text-muted small mt-3 mb-0">
                  <i class="bi bi-lightbulb"></i>
                  系统会自动提取资源文件的封面，也可手动上传自定义封面
                </p>
                <input
                  type="file"
                  ref="cover"
                  @change="onChangeCover"
                  id="id_cover"
                  accept="image/png, image/jpg, image/gif, image/jpeg"
                  style="display: none"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 教材信息选择区（隐藏，使用手动输入） -->
        <div class="mb-4 textbook-section card shadow-sm" style="display: none">
          <div class="card-header bg-white">
            <h5 class="mb-0"><i class="bi bi-book"></i> 教材信息（可选）</h5>
          </div>
          <div class="card-body">
            <!-- AI 识别提示 -->
            <div
              v-if="aiRecognizing"
              class="alert alert-info d-flex align-items-center mb-3"
            >
              <div
                class="spinner-border spinner-border-sm me-2"
                role="status"
              ></div>
              <span>系统正在智能识别教材信息，请稍候...</span>
            </div>
            <div
              v-else-if="aiRecognized"
              class="alert alert-success d-flex align-items-center mb-3"
            >
              <i class="bi bi-check-circle-fill me-2"></i>
              <span>✓ 以下信息由系统自动识别，请核对后确认</span>
            </div>

            <div class="row g-3">
              <div class="col-md-2">
                <select
                  class="form-control"
                  v-model="textbookStage"
                  @change="onStageChange"
                >
                  <option value="">选择学段</option>
                  <option
                    v-for="stage in stageOptions"
                    :key="stage.id"
                    :value="stage.id"
                  >
                    {{ stage.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-2">
                <select
                  class="form-control"
                  v-model="textbookGrade"
                  @change="onGradeChange"
                  :disabled="!textbookStage"
                >
                  <option value="">选择年级</option>
                  <option
                    v-for="grade in gradeOptions"
                    :key="grade.id"
                    :value="grade.id"
                  >
                    {{ grade.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-2">
                <select
                  class="form-control"
                  v-model="textbookSubject"
                  @change="onSubjectChange"
                  :disabled="!textbookGrade"
                >
                  <option value="">选择学科</option>
                  <option
                    v-for="subject in subjectOptions"
                    :key="subject.id"
                    :value="subject.id"
                  >
                    {{ subject.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-2">
                <select
                  class="form-control"
                  v-model="textbookVolume"
                  @change="onVolumeChange"
                  :disabled="!textbookSubject"
                >
                  <option value="">选择册别</option>
                  <option
                    v-for="volume in volumeOptions"
                    :key="volume.id"
                    :value="volume.id"
                  >
                    {{ volume.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-2">
                <select
                  class="form-control"
                  v-model="textbookVersion"
                  @change="onVersionChange"
                  :disabled="!textbookVolume"
                >
                  <option value="">选择版本（可选）</option>
                  <option
                    v-for="version in versionOptions"
                    :key="version.id"
                    :value="version.id"
                  >
                    {{ version.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- 资源分类选择 -->
        <div class="mb-4 card shadow-sm">
          <div class="card-header bg-white">
            <h6 class="mb-0"><i class="bi bi-tag"></i> 资源分类</h6>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label small text-muted"
                  >资源类型 <span class="text-danger">*</span></label
                >
                <select
                  class="form-control"
                  v-model="category"
                  :class="{ 'is-invalid': !category && isSubmitting }"
                >
                  <option value="">选择分类</option>
                  <option v-for="cat in categories" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                </select>
                <small v-if="!category && isSubmitting" class="text-danger"
                  >必填项</small
                >
              </div>
              <div class="col-md-6">
                <label class="form-label small text-muted">年级</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="grade"
                  placeholder="如：一年级上册、三年级下册"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label small text-muted">学科</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="subject"
                  placeholder="如：语文、数学、英语"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label small text-muted">教材版本</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="version"
                  placeholder="如：人教版、苏教版"
                />
              </div>
              <div class="col-12">
                <label class="form-label small" :class="{'text-muted': !(routeCatalogId || textbookCatalogId), 'text-warning': (routeCatalogId || textbookCatalogId)}">
                  章节 / 单元 / 课
                  <span v-if="!(routeCatalogId || textbookCatalogId)" class="text-muted">（可选）</span>
                  <i
                    class="bi bi-info-circle text-muted"
                    title="如：第一章、第三单元、第5课等。如果留空，系统会自动标记为「整本教材」"
                  ></i>
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="chapterInfo"
                  placeholder="如：第一单元（留空则自动标记为「整本教材」）"
                  :required="false"
                />
              </div>
              <div class="col-12">
                <p class="small mb-0" :class="{'text-warning': (routeCatalogId || textbookCatalogId), 'text-muted': !(routeCatalogId || textbookCatalogId)}">
                  <i class="bi bi-info-circle"></i>
                  <span v-if="routeCatalogId || textbookCatalogId">
                    💡 已绑定教材：填写单元信息；留空则自动标记为「整本教材」
                  </span>
                  <span v-else>
                  系统会尝试自动识别，也可手动输入或修改
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 资源出处（可选） -->
        <div class="mb-4 card shadow-sm">
          <div class="card-header bg-white">
            <h6 class="mb-0">
              <i class="bi bi-tag"></i> 资源出处（可选）
            </h6>
          </div>
          <div class="card-body">
            <div class="position-relative">
              <input
                v-model="sourceAttribution"
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

        <div class="mb-3 input-description">
          <label>资源介绍：</label>
          <textarea
            v-model="description"
            rows="5"
            tag="textarea"
            placeholder="请输入资源说明..."
            class="form-control"
          />
          <p class="text-muted small mt-2 mb-0">
            <i class="bi bi-lightbulb"></i>
            提示：上传后系统可能自动补全封面、教材信息和简介（可稍后编辑）
          </p>
        </div>

        <!-- 教材结构显示区域（MVP） -->
        <div
          class="textbook-structure-section mb-4"
          v-if="textbookStructure.length > 0 || aiRecognizing || aiRecognized"
        >
          <TextbookStructure :structure="textbookStructure" />

          <!-- 教材信息展示 -->
          <div class="card shadow-sm mt-3" v-if="textbookInfo.title">
            <div class="card-header bg-white">
              <h6 class="mb-0"><i class="bi bi-book"></i> 教材信息</h6>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <p class="mb-1">
                    <strong>书名：</strong>{{ textbookInfo.title }}
                  </p>
                  <p class="mb-1">
                    <strong>学段：</strong>{{ textbookInfo.stage || "-" }}
                  </p>
                  <p class="mb-1">
                    <strong>学科：</strong>{{ textbookInfo.subject || "-" }}
                  </p>
                </div>
                <div class="col-md-6">
                  <p class="mb-1">
                    <strong>版本：</strong>{{ textbookInfo.version || "-" }}
                  </p>
                  <p class="mb-1">
                    <strong>册次：</strong>{{ textbookInfo.volume || "-" }}
                  </p>
                  <p class="mb-1">
                    <strong>简介：</strong>{{ textbookInfo.description || "-" }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="post-create-page-btn">
          <button
            type="button"
            @click="createPost"
            class="btn btn-primary btn-large"
            :disabled="isSubmitting || !isFormValid"
          >
            {{ isSubmitting ? "提交中..." : "发布资源" }}
          </button>
          <small v-if="!isFormValid" class="text-danger d-block mt-2">
            请填写必填项：标题、分类、文件
          </small>
        </div>

        <!-- 成功提示 -->
        <div
          v-if="successMessage"
          class="alert alert-success mt-3 d-flex align-items-center"
          role="alert"
        >
          <i class="bi bi-check-circle-fill me-2" style="font-size: 20px"></i>
          <div class="flex-grow-1">{{ successMessage }}</div>
        </div>

        <!-- 错误提示 -->
        <div
          v-if="errorMessage"
          class="alert alert-danger mt-3 d-flex align-items-center"
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
import { apiHttpClient } from "@/app/app.service";
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import BreadCrumbs from "@/app/components/BreadCrumbs.vue";
import TextbookStructure from "./components/TextbookStructure.vue"; // 新增教材结构组件
import notification from "@/utils/notification";
import { RESOURCE_CATEGORIES } from "@/utils/constants";

export default defineComponent({
  title() {
    return "发布资源";
  },
  components: {
    BreadCrumbs,
    TextbookStructure, // 新增教材结构组件
  },
  name: "PostCreate",
  props: {
    user: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      categories: RESOURCE_CATEGORIES, // 资源分类列表（静态）
      errorMessage: "",
      successMessage: "",
      isSubmitting: false,
      token: "",
      title: "",
      category: "",
      grade: "",
      subject: "",
      version: "",
      chapterInfo: "", // 章节信息（可选）
      description: "",
      sourceAttribution: "", // 资源出处（可选）
      // 资源出处自动完成
      showSourceAttributionSuggestions: false,
      sourceAttributionSuggestions: [],
      file: null,
      cover: null,
      coverPreviewUrl: null,
      coverUploadProgress: null,
      dragZoneActive: false,
      coverDragActive: false, // 封面拖放状态

      // 教材骨架选择器
      textbookCatalog: [], // 全部教材目录数据
      textbookStage: "",
      textbookGrade: "",
      textbookSubject: "",
      textbookVolume: "",
      textbookVersion: "",
      textbookCatalogId: null, // 最终的 catalog ID

      // 教材结构化（MVP）
      textbookStructure: [], // 解析后的教材结构
      textbookInfo: {
        // 自动识别的教材信息
        title: "", // 书名
        stage: "", // 学段
        subject: "", // 学科
        version: "", // 版本
        volume: "", // 册次
        description: "", // 简介
        cover_url: "", // 封面
      },

      // AI 自动识别
      aiRecognizing: false, // 正在识别
      aiRecognized: false, // 已识别完成
      pollingTimer: null, // 轮询定时器
      uploadedResourceId: null, // 上传后的资源ID

      // 步骤控制
      currentStep: 1, // 当前步骤（1:基础信息, 2:教材信息, 3:上传文件）
      isAuthenticated: false, // 认证状态

      // 从 URL 参数获取的教材绑定信息
      routeCatalogId: null, // 从路由参数获取的 catalog_id
      routeUnit: null, // 从路由参数获取的 unit
    };
  },

  async created() {
    // 检查认证状态（从 localStorage 和 store 双重检查）
    const token = localStorage.getItem('auth_token');
    const userInfo = localStorage.getItem('user_info');
    const storeAuth = this.$store.state.auth?.isAuthenticated;
    
    this.isAuthenticated = !!(token && userInfo) || storeAuth || false;
    console.log("[PostCreate] 认证状态:", this.isAuthenticated, { token: !!token, userInfo: !!userInfo, storeAuth });

    if (!this.isAuthenticated) {
      console.log("[PostCreate] 未登录，不加载教材目录");
      // 如果路由守卫没有拦截，这里再次检查并跳转
      if (!token || !userInfo) {
        this.$router.push({ path: '/login', query: { redirect: this.$route.fullPath } });
      }
      return;
    }

    // 从路由参数读取 catalog_id 和 unit
    const catalogId = this.$route.query.catalog_id;
    const unit = this.$route.query.unit;
    
    // 必须要有 catalog_id 参数
    if (!catalogId) {
      console.warn("[PostCreate] 缺少 catalog_id 参数，重定向到教材目录");
      const { notification } = await import("@/utils/notification");
      notification.warning("上传资源必须绑定到教材目录，请先选择教材");
      this.$router.push({ path: '/catalog' });
      return;
    }
    
    this.routeCatalogId = String(catalogId); // 保持为字符串，与 URL 参数一致
    this.textbookCatalogId = Number(catalogId);
    console.log("[PostCreate] 从路由参数获取 catalog_id:", catalogId);
    console.log("[PostCreate] routeCatalogId (字符串):", this.routeCatalogId);
    console.log("[PostCreate] textbookCatalogId (数字):", this.textbookCatalogId);
    
    if (unit) {
      this.routeUnit = unit;
      // 如果用户没有手动填写章节信息，自动填充 unit
      if (!this.chapterInfo) {
        this.chapterInfo = unit;
      }
      console.log("[PostCreate] 从路由参数获取 unit:", unit);
    }

    await this.fetchTextbookCatalog();
  },

  beforeUnmount() {
    // 组件销毁时清理轮询
    this.stopAIPolling();
  },

  computed: {
    ...mapGetters({
      currentUser: "auth/user",
      isUser: "auth/isUser",
      isContributor: "auth/isContributor",
      isEditor: "auth/isEditor",
      isAdmin: "auth/isAdmin",
    }),
    
    // 是否可以上传资源：contributor / editor / admin
    canUpload() {
      return this.isContributor || this.isEditor || this.isAdmin;
    },
    
    // 学段选项（顶级）
    stageOptions() {
      const stages = this.textbookCatalog.filter((item) => !item.parent_id);
      return stages;
    },

    // 年级选项
    gradeOptions() {
      if (!this.textbookStage) return [];
      return this.textbookCatalog.filter(
        (item) => item.parent_id === this.textbookStage
      );
    },

    // 学科选项
    subjectOptions() {
      if (!this.textbookGrade) return [];
      return this.textbookCatalog.filter(
        (item) => item.parent_id === this.textbookGrade
      );
    },

    // 册别选项
    volumeOptions() {
      if (!this.textbookSubject) return [];
      return this.textbookCatalog.filter(
        (item) => item.parent_id === this.textbookSubject
      );
    },

    // 版本选项
    versionOptions() {
      if (!this.textbookVolume) return [];
      return this.textbookCatalog.filter(
        (item) => item.parent_id === this.textbookVolume
      );
    },

    // 表单验证
    isFormValid() {
      return (
        this.title &&
        this.title.trim() &&
        this.category &&
        this.category.trim() &&
        this.file
      );
    },
  },

  methods: {
    // 获取已选择教材的名称（用于显示）
    getSelectedTextbookName() {
      const parts = [];
      if (this.textbookStage) {
        const stage = this.stageOptions.find(s => s.id === this.textbookStage);
        if (stage) parts.push(stage.name);
      }
      if (this.textbookGrade) {
        const grade = this.gradeOptions.find(g => g.id === this.textbookGrade);
        if (grade) parts.push(grade.name);
      }
      if (this.textbookSubject) {
        const subject = this.subjectOptions.find(s => s.id === this.textbookSubject);
        if (subject) parts.push(subject.name);
      }
      if (this.textbookVolume) {
        const volume = this.volumeOptions.find(v => v.id === this.textbookVolume);
        if (volume) parts.push(volume.name);
      }
      if (this.textbookVersion) {
        const version = this.versionOptions.find(v => v.id === this.textbookVersion);
        if (version) parts.push(version.name);
      }
      return parts.join(' · ') || '未知教材';
    },

    // 获取教材目录数据
    async fetchTextbookCatalog() {
      try {
        const response = await apiHttpClient.get("/api/textbook-catalog");
        this.textbookCatalog = response.data;
        console.log(
          "[PostCreate] 教材目录加载成功:",
          this.textbookCatalog.length
        );
      } catch (error) {
        console.error("[PostCreate] 教材目录加载失败:", error);
      }
    },

    // 学段变化，清空下级
    onStageChange() {
      this.textbookGrade = "";
      this.textbookSubject = "";
      this.textbookVolume = "";
      this.textbookVersion = "";
      this.textbookCatalogId = null;
      if (this.currentStep < 2) {
        this.currentStep = 2; // 选择教材后进入步骤2
      }
    },

    // 年级变化
    onGradeChange() {
      this.textbookSubject = "";
      this.textbookVolume = "";
      this.textbookVersion = "";
      this.textbookCatalogId = null;
    },

    // 学科变化
    onSubjectChange() {
      this.textbookVolume = "";
      this.textbookVersion = "";
      this.textbookCatalogId = null;
    },

    // 册别变化
    onVolumeChange() {
      this.textbookVersion = "";
      // 册别层已经可以作为 catalog_id（如果没选版本）
      this.textbookCatalogId = this.textbookVolume;
    },

    // 版本变化
    onVersionChange() {
      // 版本是最终层级
      this.textbookCatalogId = this.textbookVersion || this.textbookVolume;
    },

    // 绑定教材
    async bindTextbook(resourceId) {
      if (!this.textbookCatalogId) {
        console.log("[PostCreate] 未选择教材，跳过绑定");
        return;
      }

      try {
        await apiHttpClient.post(`/api/resources/${resourceId}/bind-textbook`, {
          textbook_catalog_id: this.textbookCatalogId,
        });
        console.log("[PostCreate] 教材绑定成功:", this.textbookCatalogId);
      } catch (error) {
        console.error("[PostCreate] 教材绑定失败:", error);
      }
    },

    // 开始轮询 AI 识别结果
    startAIPolling(resourceId) {
      this.aiRecognizing = true;
      this.aiRecognized = false;
      this.uploadedResourceId = resourceId;

      console.log("[PostCreate] 开始轮询 AI 识别结果:", resourceId);

      // 立即调用一次
      this.pollAIResult();

      // 设置定时轮询（3秒一次）
      this.pollingTimer = setInterval(() => {
        this.pollAIResult();
      }, 3000);
    },

    // 轮询单次调用
    async pollAIResult() {
      if (!this.uploadedResourceId) return;

      try {
        const response = await apiHttpClient.get(
          `/api/resources/${this.uploadedResourceId}/auto-meta`
        );
        const data = response.data;

        console.log("[PostCreate] AI 识别状态:", data.status);

        if (data.status === "completed") {
          // 识别完成，停止轮询
          this.stopAIPolling();
          this.aiRecognizing = false;
          this.aiRecognized = true;

          // 自动填充识别结果
          this.fillAIResult(data);
        } else if (data.status === "failed") {
          // 识别失败，停止轮询
          this.stopAIPolling();
          this.aiRecognizing = false;
          console.log("[PostCreate] AI 识别失败");
        }
        // 否则继续等待 (processing)
      } catch (error) {
        console.error("[PostCreate] 轮询 AI 结果失败:", error);
        // 如果 404 或其他错误，停止轮询
        if (error.response?.status === 404) {
          this.stopAIPolling();
          this.aiRecognizing = false;
        }
      }
    },

    // 停止轮询
    stopAIPolling() {
      if (this.pollingTimer) {
        clearInterval(this.pollingTimer);
        this.pollingTimer = null;
      }
    },

    // 填充 AI 识别结果
    fillAIResult(data) {
      console.log("[PostCreate] 填充 AI 识别结果:", data);
      console.log(
        "[PostCreate] AI 返回的完整数据:",
        JSON.stringify(data, null, 2)
      );

      // 处理标题（如果用户未填写）
      if (data.title && !this.title) {
        this.title = data.title;
        console.log("[PostCreate] ✅ 使用 AI 标题:", data.title);
      } else {
        console.log(
          "[PostCreate] ❌ 跳过标题 - AI:",
          data.title,
          ", 当前:",
          this.title
        );
      }

      // 处理分类/类型
      if (data.category) {
        this.category = data.category;
        console.log("[PostCreate] ✅ 使用 AI 分类:", data.category);
      } else {
        console.log("[PostCreate] ❌ AI 未返回 category");
      }

      // 处理描述（如果用户未填写）
      if (data.description && !this.description) {
        this.description = data.description;
        console.log("[PostCreate] ✅ 使用 AI 描述:", data.description);
      } else {
        console.log(
          "[PostCreate] ❌ 跳过描述 - AI:",
          data.description,
          ", 当前:",
          this.description
        );
      }

      // 处理年级、学科、版本（兼容旧字段）
      if (data.grade_text && !this.grade) {
        this.grade = data.grade_text;
        console.log("[PostCreate] ✅ 使用 AI 年级:", data.grade_text);
      } else {
        console.log(
          "[PostCreate] ❌ 跳过年级 - AI:",
          data.grade_text,
          ", 当前:",
          this.grade
        );
      }

      if (data.subject_text && !this.subject) {
        this.subject = data.subject_text;
        console.log("[PostCreate] ✅ 使用 AI 学科:", data.subject_text);
      } else {
        console.log(
          "[PostCreate] ❌ 跳过学科 - AI:",
          data.subject_text,
          ", 当前:",
          this.subject
        );
      }

      if (data.version_text && !this.version) {
        this.version = data.version_text;
        console.log("[PostCreate] ✅ 使用 AI 版本:", data.version_text);
      } else {
        console.log(
          "[PostCreate] ❌ 跳过版本 - AI:",
          data.version_text,
          ", 当前:",
          this.version
        );
      }

      // 处理封面
      if (data.auto_cover_url && !this.cover) {
        // 使用 AI 识别的封面 URL 作为预览
        this.coverPreviewUrl = data.auto_cover_url;
        console.log("[PostCreate] ✅ 使用 AI 封面:", data.auto_cover_url);
      } else {
        console.log(
          "[PostCreate] ❌ 跳过封面 - AI:",
          data.auto_cover_url,
          ", 当前:",
          this.cover
        );
      }

      // 处理章节信息（可选）
      if (data.chapter_info && !this.chapterInfo) {
        this.chapterInfo = data.chapter_info;
        console.log("[PostCreate] ✅ 使用 AI 章节信息:", data.chapter_info);
      } else {
        console.log(
          "[PostCreate] ❌ 跳过章节信息 - AI:",
          data.chapter_info,
          ", 当前:",
          this.chapterInfo
        );
      }

      // 处理教材信息 - 根据名称匹配 ID
      if (data.stage) {
        this.matchAndFillStage(data.stage);
      }
      if (data.grade) {
        // 等待 stage 填充后再填充 grade
        setTimeout(() => this.matchAndFillGrade(data.grade), 100);
      }
      if (data.subject) {
        setTimeout(() => this.matchAndFillSubject(data.subject), 200);
      }
      if (data.volume) {
        setTimeout(() => this.matchAndFillVolume(data.volume), 300);
      }
      if (data.version) {
        setTimeout(() => this.matchAndFillVersion(data.version), 400);
      }

      // 处理教材结构化信息（MVP）
      if (data.textbook_info) {
        // 更新教材基本信息
        this.textbookInfo = {
          title: data.textbook_info.title || this.textbookInfo.title,
          stage: data.textbook_info.stage || this.textbookInfo.stage,
          subject: data.textbook_info.subject || this.textbookInfo.subject,
          version: data.textbook_info.version || this.textbookInfo.version,
          volume: data.textbook_info.volume || this.textbookInfo.volume,
          description:
            data.textbook_info.description || this.textbookInfo.description,
          cover_url:
            data.textbook_info.cover_url || this.textbookInfo.cover_url,
        };
        console.log("[PostCreate] 教材基本信息更新:", this.textbookInfo);
      }

      // 处理教材目录结构
      if (data.textbook_structure) {
        this.textbookStructure = this.formatTextbookStructure(
          data.textbook_structure
        );
        console.log("[PostCreate] 教材结构解析完成:", this.textbookStructure);
      }

      console.log("[PostCreate] 填充完成后的表单状态:", {
        title: this.title,
        category: this.category,
        description: this.description,
        grade: this.grade,
        subject: this.subject,
        version: this.version,
        coverPreviewUrl: this.coverPreviewUrl,
      });
    },

    // 匹配并填充学段
    matchAndFillStage(stageName) {
      const found = this.stageOptions.find((item) => item.name === stageName);
      if (found) {
        this.textbookStage = found.id;
        console.log("[PostCreate] 匹配学段:", stageName, "->", found.id);
      }
    },

    // 匹配并填充年级
    matchAndFillGrade(gradeName) {
      const found = this.gradeOptions.find((item) => item.name === gradeName);
      if (found) {
        this.textbookGrade = found.id;
        console.log("[PostCreate] 匹配年级:", gradeName, "->", found.id);
      }
    },

    // 匹配并填充学科
    matchAndFillSubject(subjectName) {
      const found = this.subjectOptions.find(
        (item) => item.name === subjectName
      );
      if (found) {
        this.textbookSubject = found.id;
        console.log("[PostCreate] 匹配学科:", subjectName, "->", found.id);
      }
    },

    // 匹配并填充册别
    matchAndFillVolume(volumeName) {
      const found = this.volumeOptions.find((item) => item.name === volumeName);
      if (found) {
        this.textbookVolume = found.id;
        this.textbookCatalogId = found.id; // 设置 catalog_id
        console.log("[PostCreate] 匹配册别:", volumeName, "->", found.id);
      }
    },

    // 匹配并填充版本
    matchAndFillVersion(versionName) {
      const found = this.versionOptions.find(
        (item) => item.name === versionName
      );
      if (found) {
        this.textbookVersion = found.id;
        this.textbookCatalogId = found.id; // 设置最终 catalog_id
        console.log("[PostCreate] 匹配版本:", versionName, "->", found.id);
      }
    },

    onChangeFile(event) {
      const file = event.target.files[0];
      if (file) {
        // 拦截视频文件
        const videoTypes = [
          "video/mp4",
          "video/quicktime",
          "video/x-msvideo",
          "video/avi",
          "video/mpeg",
          "video/webm",
        ];
        const videoExtensions = [
          ".mp4",
          ".mov",
          ".avi",
          ".mpeg",
          ".mpg",
          ".wmv",
          ".flv",
          ".webm",
          ".mkv",
        ];

        const isVideoByType = videoTypes.includes(file.type.toLowerCase());
        const isVideoByExt = videoExtensions.some((ext) =>
          file.name.toLowerCase().endsWith(ext)
        );

        if (isVideoByType || isVideoByExt) {
          this.errorMessage = "当前暂不支持视频资源上传";
          event.target.value = ""; // 清空文件选择
          return;
        }

        this.file = file;
        this.currentStep = 3; // 选择文件后进入步骤3
        console.log("[PostCreate] 选择文件:", {
          name: file.name,
          size: file.size,
          type: file.type,
        });
      }
    },

    // 拖放资源文件
    onDropFile(event) {
      console.log("[PostCreate] 拖放文件:", event.dataTransfer.files);

      this.dragZoneActive = false;

      const file = event.dataTransfer.files[0];

      if (file) {
        // 拦截视频文件
        const videoTypes = [
          "video/mp4",
          "video/quicktime",
          "video/x-msvideo",
          "video/avi",
          "video/mpeg",
          "video/webm",
        ];
        const videoExtensions = [
          ".mp4",
          ".mov",
          ".avi",
          ".mpeg",
          ".mpg",
          ".wmv",
          ".flv",
          ".webm",
          ".mkv",
        ];

        const isVideoByType = videoTypes.includes(file.type.toLowerCase());
        const isVideoByExt = videoExtensions.some((ext) =>
          file.name.toLowerCase().endsWith(ext)
        );

        if (isVideoByType || isVideoByExt) {
          this.errorMessage = "当前暂不支持视频资源上传";
          return;
        }

        this.file = file;
        this.currentStep = 3;

        // 设置资源标题（如果未设置）
        if (!this.title) {
          this.title = file.name.split(".")[0];
        }

        console.log("[PostCreate] 拖放文件成功:", file.name);
      }
    },

    // 清除文件
    clearFile() {
      this.file = null;
      if (this.$refs.file) {
        this.$refs.file.value = "";
      }
      console.log("[PostCreate] 清除文件");
    },

    // 清除封面
    clearCover() {
      this.cover = null;
      this.coverPreviewUrl = null;
      if (this.$refs.cover) {
        this.$refs.cover.value = "";
      }
      console.log("[PostCreate] 清除封面");
    },

    // 格式化文件大小
    formatFileSize(bytes) {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    },

    async createCover(cover, postId) {
      // 创建表单
      const formData = new FormData();

      // 添加字段
      formData.append("file", cover);

      // 上传封面
      try {
        const response = await apiHttpClient.post(
          `/covers?post=${postId}`,
          formData,
          {
            onUploadProgress: (event) => {
              console.log(event);

              const { loaded, total } = event;

              this.coverUploadProgress = Math.round((loaded * 100) / total);
            },
          }
        );

        // 清理
        this.cover = null;
        this.coverPreviewUrl = null;
        this.$refs.cover.value = "";
        this.coverUploadProgress = null;

        console.log(response.data);
      } catch (error) {
        this.errorMessage = error.message;
      }
    },

    // 上传封面预览
    createCoverPreview(cover) {
      const reader = new FileReader();

      reader.readAsDataURL(cover);

      reader.onload = (event) => {
        this.coverPreviewUrl = event.target.result;
      };
    },

    onChangeCover(event) {
      console.log("[PostCreate] 选择封面:", event.target.files);

      const cover = event.target.files[0];

      if (cover) {
        this.cover = cover;

        // 生成预览封面
        this.createCoverPreview(cover);
      }
    },

    // 拖放封面
    onDropCover(event) {
      console.log("[PostCreate] 拖放封面:", event.dataTransfer.files);

      this.coverDragActive = false;

      const cover = event.dataTransfer.files[0];

      if (cover) {
        // 检查是否为图片文件
        if (!cover.type.startsWith("image/")) {
          notification.error("请上传图片文件（JPG, PNG, GIF）");
          return;
        }

        this.cover = cover;
        this.createCoverPreview(cover);
        console.log("[PostCreate] 拖放封面成功:", cover.name);
      }
    },

    async createPost() {
      // 提交前校验登录态
      const token = localStorage.getItem('auth_token');
      if (!token) {
        notification.error("登录已过期，请重新登录");
        this.$router.push({ path: '/login', query: { redirect: this.$route.fullPath } });
        return;
      }

      console.log("[PostCreate] 开始创建资源...");
      console.log("[PostCreate] 当前表单数据:", {
        title: this.title,
        category: this.category,
        grade: this.grade,
        subject: this.subject,
        version: this.version,
        description: this.description,
        hasFile: !!this.file,
        hasCover: !!this.cover,
      });

      // 清空之前的消息
      this.errorMessage = "";
      this.successMessage = "";
      this.isSubmitting = true;

      try {
        // 使用 FormData 上传文件
        const formData = new FormData();

        // 添加元数据字段 - 只添加有值的字段
        formData.append("title", this.title || "未命名资源");

        // category 必填，如果没有则使用默认值
        if (this.category) {
          formData.append("category", this.category);
        } else {
          // 默认使用"其他"
          formData.append("category", "其他");
          console.log("[PostCreate] category 为空，使用默认值: 其他");
        }

        if (this.grade) {
          formData.append("grade", this.grade);
        }

        if (this.subject) {
          formData.append("subject", this.subject);
        }

        if (this.version) {
          formData.append("version", this.version);
        }

        if (this.description) {
          formData.append("description", this.description);
        }

        // 添加资源出处（可选）
        if (this.sourceAttribution && this.sourceAttribution.trim()) {
          formData.append("source_attribution", this.sourceAttribution.trim());
        }

        // 添加章节信息（可选）
        if (this.chapterInfo) {
          formData.append("chapter_info", this.chapterInfo);
          console.log("[PostCreate] 添加章节信息:", this.chapterInfo);
        }

        // 确定要绑定的 catalog_id（优先级：路由参数 > 手动选择）
        // 根据文档，catalog_id 应该是数字，所以优先使用 textbookCatalogId（数字）
        const catalogIdToBind = this.textbookCatalogId || (this.routeCatalogId ? Number(this.routeCatalogId) : null);
        
        // 确定要传递的 unit（优先级：路由参数 > 章节信息）
        const unitToBind = this.routeUnit || (this.chapterInfo ? this.chapterInfo : null);

        // 验证：如果手动选择了教材，确保教材ID有效
        if (this.textbookCatalogId && !this.routeCatalogId) {
          // 检查选择的教材是否在教材目录中存在
          const selectedCatalog = this.textbookCatalog.find(
            (item) => item.id === this.textbookCatalogId || 
                      String(item.id) === String(this.textbookCatalogId)
          );
          
          if (!selectedCatalog) {
            console.warn("[PostCreate] 选择的教材ID不存在:", this.textbookCatalogId);
            notification.warning(
              "选择的教材在系统中不存在。请先前往「教材目录」页面创建该教材，或取消选择教材直接上传资源。"
            );
            this.isSubmitting = false;
            return;
          }
          
          console.log("[PostCreate] 验证教材存在:", {
            catalogId: this.textbookCatalogId,
            catalogName: selectedCatalog.name,
            stage: this.textbookStage,
            grade: this.textbookGrade,
            subject: this.textbookSubject,
            volume: this.textbookVolume,
            version: this.textbookVersion
          });
        }

        // 添加 catalog_id（如果存在）
        // 根据文档，catalog_id 应该是数字，FormData 需要字符串
        if (catalogIdToBind) {
          // 确保是数字，然后转换为字符串（FormData 需要字符串）
          const catalogIdValue = Number(catalogIdToBind);
          if (isNaN(catalogIdValue)) {
            console.error("[PostCreate] 错误：catalog_id 不是有效数字:", catalogIdToBind);
            notification.error("教材目录ID格式错误，请重新选择");
            this.isSubmitting = false;
            return;
          }
          formData.append("catalog_id", String(catalogIdValue));
          console.log("[PostCreate] 添加 catalog_id 到 FormData:", catalogIdValue, "(数字，转换为字符串)", "来源:", this.routeCatalogId ? "路由参数" : "手动选择");
          console.log("[PostCreate] routeCatalogId:", this.routeCatalogId, "textbookCatalogId:", this.textbookCatalogId, "catalogIdToBind:", catalogIdToBind);
        } else {
          console.warn("[PostCreate] 警告：没有 catalog_id 要绑定！");
          console.warn("[PostCreate] routeCatalogId:", this.routeCatalogId, "textbookCatalogId:", this.textbookCatalogId);
        }

        // 添加 unit：如果绑定了教材目录但单元留空，自动设置为"整本教材"
        if (catalogIdToBind) {
          // 如果绑定了教材目录
          if (unitToBind && unitToBind.trim()) {
            // 有填写单元，使用填写的值
            formData.append("unit", unitToBind.trim());
            console.log("[PostCreate] 添加 unit:", unitToBind.trim(), "来源:", this.routeUnit ? "路由参数" : "章节信息");
          } else {
            // 单元留空，自动设置为"整本教材"
            formData.append("unit", "整本教材");
            console.log("[PostCreate] 单元留空，自动设置为「整本教材」");
          }
        } else if (unitToBind && unitToBind.trim()) {
          // 没有绑定教材目录，但有填写单元，也添加
          formData.append("unit", unitToBind.trim());
          console.log("[PostCreate] 添加 unit:", unitToBind.trim(), "来源:", this.routeUnit ? "路由参数" : "章节信息");
        }

        // 添加文件（如果有）
        if (this.file) {
          formData.append("file", this.file);
          console.log("[PostCreate] 上传文件:", {
            name: this.file.name,
            size: this.file.size,
            type: this.file.type,
          });
        } else {
          console.warn("[PostCreate] 没有选择文件，无法上传");
          notification.warning("请选择要上传的文件");
          this.isSubmitting = false;
          return;
        }

        // 添加封面文件（如果有）
        if (this.cover) {
          formData.append("cover", this.cover);
          console.log("[PostCreate] 上传封面:", {
            name: this.cover.name,
            size: this.cover.size,
            type: this.cover.type,
          });
        } else if (
          this.coverPreviewUrl &&
          this.coverPreviewUrl.startsWith("http")
        ) {
          // 如果有 AI 识别的封面 URL，传递给后端
          formData.append("auto_cover_url", this.coverPreviewUrl);
          console.log("[PostCreate] 使用 AI 封面 URL:", this.coverPreviewUrl);
        } else {
          console.log("[PostCreate] 没有选择封面，将使用默认封面");
        }

        // 打印 FormData 内容（调试用）
        console.log("[PostCreate] FormData 内容:");
        for (let pair of formData.entries()) {
          console.log(`  ${pair[0]}:`, pair[1]);
        }

        console.log("[PostCreate] 请求接口: POST /api/resources");
        console.log("[PostCreate] 使用 multipart/form-data 格式");

        const response = await apiHttpClient.post("/api/resources", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("[PostCreate] 创建成功:", response.data);
        console.log("[PostCreate] 响应中的 catalog_id:", response.data?.catalog_id || response.data?.data?.catalog_id);
        console.log("[PostCreate] 提交的 catalog_id:", catalogIdToBind);
        
        // 如果资源出处有值，保存到历史记录
        if (this.sourceAttribution && this.sourceAttribution.trim()) {
          this.saveSourceAttributionToHistory(this.sourceAttribution);
        }
        
        // 检查响应中是否包含 catalog_id
        const responseCatalogId = response.data?.catalog_id || response.data?.data?.catalog_id;
        if (catalogIdToBind && !responseCatalogId) {
          console.warn("[PostCreate] 警告：提交了 catalog_id 但响应中没有返回，可能后端没有保存");
        } else if (catalogIdToBind && responseCatalogId) {
          console.log("[PostCreate] 确认：catalog_id 已保存，响应值:", responseCatalogId);
        }

        const resourceId = response.data.id || response.data.insertId;

        // 显示成功消息
        notification.success(
          `资源上传成功！ID: ${resourceId || "N/A"}，正在处理教材信息，3秒后跳转到详情页...`,
          3000
        );

        // 立即调用 auto-parse 接口
        if (resourceId) {
          // 先重置提交状态，避免一直显示"提交中"
          this.isSubmitting = false;
          
          try {
            console.log("[PostCreate] 调用 auto-parse 接口...");
            await apiHttpClient.post(`/api/resources/${resourceId}/auto-parse`);
            console.log("[PostCreate] auto-parse 调用成功，开始轮询识别结果...");
            
            // 启动轮询 AI 识别结果
            this.startAIPolling(resourceId);
            
            notification.success(
              "正在自动提取教材信息，请稍候...",
              3000
            );
          } catch (error) {
            console.error("[PostCreate] auto-parse 调用失败:", error);
            // 如果是 403 无权限错误，已经在全局拦截器中显示了"无权限"通知
            // 这里只显示信息提取失败的提示，避免重复通知
            if (error.response?.status !== 403) {
            notification.warning(
                `教材信息提取失败，3秒后仍将跳转到详情页`,
                3000
              );
            } else {
              // 403 错误时，只显示一个友好的提示
              notification.warning(
                `教材信息自动提取功能暂不可用，资源已上传成功，3秒后跳转到详情页`,
                3000
            );
            }
          }

          // 绑定教材（如果通过 FormData 没有传递 catalog_id，则单独绑定）
          // 注意：如果已经在 FormData 中传递了 catalog_id，后端应该已经处理了绑定
          // 这里只处理手动选择教材的情况（没有路由参数时）
          if (!this.routeCatalogId && this.textbookCatalogId) {
            try {
          await this.bindTextbook(resourceId);
            } catch (error) {
              // 绑定教材失败不影响整体流程，只记录错误
              console.error("[PostCreate] 绑定教材失败:", error);
              // 如果是 403 错误，已经在全局拦截器中显示了"无权限"通知，这里不再显示
              if (error.response?.status !== 403) {
                console.warn("[PostCreate] 绑定教材失败，但不影响资源上传");
              }
            }
          } else if (this.routeCatalogId) {
            console.log("[PostCreate] 已通过 FormData 传递 catalog_id，无需单独绑定");
          }

          // 延迟跳转到资源详情页，让用户确认资源
          // 如果 AI 识别已完成，立即跳转；否则等待最多 10 秒
          const maxWaitTime = 10000; // 最多等待 10 秒
          const checkInterval = 1000; // 每秒检查一次
          let waitedTime = 0;
          
          const checkAndJump = () => {
            if (this.aiRecognized || waitedTime >= maxWaitTime) {
            console.log(
                "[PostCreate] 跳转到资源详情页，resourceId:",
                resourceId,
                "AI识别状态:",
                this.aiRecognized ? "已完成" : "超时"
            );
            this.$router.push(`/resources/${resourceId}`);
            } else {
              waitedTime += checkInterval;
              setTimeout(checkAndJump, checkInterval);
            }
          };
          
          // 3 秒后开始检查
          setTimeout(checkAndJump, 3000);
        } else {
          // 如果没有 resourceId，也要重置提交状态
          this.isSubmitting = false;
        }

        // 仅清空文件选择（避免重复上传）
        this.file = null;
        if (this.$refs.file) this.$refs.file.value = "";

        // 通知首页刷新资源列表
        console.log("[PostCreate] 触发首页刷新...");
        window.dispatchEvent(new CustomEvent("resource-created"));
      } catch (error) {
        console.error("[PostCreate] 创建失败:", error);
        console.error("[PostCreate] 错误详情:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });

        notification.error(
          `上传失败: ${error.response?.data?.message || error.message}`,
          5000
        );
      } finally {
        this.isSubmitting = false;
        console.log("[PostCreate] 上传流程结束");
      }
    },

    // 格式化教材结构数据
    formatTextbookStructure(rawStructure) {
      // 递归处理教材结构，添加展开状态等属性
      const processNode = (node, level = 0) => {
        const processed = {
          id: node.id || `node_${Date.now()}_${Math.random()}`,
          name:
            node.name || node.title || `未命名${level > 0 ? `-${level}` : ""}`,
          type: node.type || this.getNodeType(level),
          level: level,
          expanded: level === 0, // 默认展开第一层
          children: [],
        };

        if (node.children && Array.isArray(node.children)) {
          processed.children = node.children.map((child) =>
            processNode(child, level + 1)
          );
        }

        return processed;
      };

      if (Array.isArray(rawStructure)) {
        return rawStructure.map((item) => processNode(item));
      } else if (rawStructure && typeof rawStructure === "object") {
        return [processNode(rawStructure)];
      }

      return [];
    },

    // 根据层级获取节点类型
    getNodeType(level) {
      const types = ["Unit", "Lesson", "Subtopic"];
      return types[level] || "Section";
    },

    // 处理申请成为贡献者
    async handleApplyContributor() {
      // 确认弹窗（带同意复选框）
      const { notification } = await import('@/utils/notification');
      const confirmed = await notification.confirm(
        '申请成为贡献者后，您将可以上传和管理教学资源。\n\n提交申请后，管理员将审核您的申请。\n\n确认提交申请吗？',
        '申请成为贡献者',
        {
          requireAgreement: true,
          agreementText: '我已阅读并同意遵守<a href="/legal/contributor-responsibilities" target="_blank" style="color: #4f8cff; text-decoration: underline;">《贡献者义务与责任》</a>'
        }
      );
      
      if (!confirmed) {
        return;
      }
      
      try {
        console.log('[PostCreate] 提交贡献者申请...');
        const response = await apiHttpClient.post('/api/contributor-applications', {});
        console.log('[PostCreate] 申请提交成功:', response.data);
        
        notification.success('已提交申请，等待管理员审核');
        // 跳转到首页
        this.$router.push('/');
      } catch (error) {
        console.error('[PostCreate] 提交申请失败:', error);
        const errorMsg = error.response?.data?.message || 
                        error.response?.data?.error ||
                        error.message ||
                        '提交申请失败，请稍后重试';
        notification.error(errorMsg);
      }
    },

    /**
     * 获取资源出处历史记录
     */
    getSourceAttributionHistory() {
      try {
        const history = localStorage.getItem('source_attribution_history');
        return history ? JSON.parse(history) : [];
      } catch (error) {
        console.error("[PostCreate] 获取资源出处历史记录失败:", error);
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
        console.error("[PostCreate] 保存资源出处历史记录失败:", error);
      }
    },

    /**
     * 资源出处输入事件
     */
    onSourceAttributionInput() {
      const value = this.sourceAttribution || '';
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
      this.sourceAttribution = suggestion;
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
  },
});
</script>

<style>
@import "./styles/style.css";
</style>
