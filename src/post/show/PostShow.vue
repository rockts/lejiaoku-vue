/* 资源详情页封面图片自适应且居中 */
.cover {
  width: 150px;
  height: 200px;
  background: var(--surface, #fff);
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
  background: var(--surface, #fff);
  margin: auto;
}
.resource-cover-full {
  width: 100%;
  max-width: 300px;
  height: 180px;
  background: var(--surface, #fff);
  border-radius: 8px;
  overflow: hidden;
  box-sizing: border-box;
  border: 1px solid var(--border, #e9ecef);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px auto;
}
.resource-cover-full img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  display: block;
  background: var(--surface, #fff);
  object-position: center;
  object-fit: contain;
}
.resource-cover-full img.fit-cover { object-fit: cover; }
.resource-cover-full img.fit-contain { object-fit: contain; }
.resource-cover-full .cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--bg, #f5f7fa) 0%, var(--surface, #e8ecf1) 100%);
  border: none;
}

.resource-cover-full .cover-placeholder i {
  font-size: 64px;
  color: var(--muted, #94a3b8);
  opacity: 0.6;
}

@media (max-width: 768px) {
  .resource-cover-full { 
    max-width: 100%;
    height: 140px; 
  }
  .resource-cover-full .cover-placeholder i {
    font-size: 40px;
  }
}
<template>
  <bread-crumbs />

  <!-- 无权限提示 -->
  <div v-if="!loading && !showResource && resource === null" class="container my-5 text-center">
    <div class="alert alert-warning" role="alert">
      <i class="bi bi-exclamation-triangle me-2"></i>
      <strong>无权查看</strong>
      <p class="mb-0 mt-2">该资源正在审核中，仅发布者可以查看</p>
    </div>
  </div>

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
          <div class="action-buttons">
            <a
              class="btn btn-primary"
              :href="downloadUrl"
              target="_blank"
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
          <template v-if="resourceCoverURL && !coverFailed">
            <img
              :src="resourceCoverURL"
              :alt="resource.title"
              @load="onCoverLoad"
              @error="onCoverError"
              :class="coverClass"
              :style="{ maxWidth: '100%', maxHeight: '100%', objectFit: coverFit }"
            />
          </template>
          <template v-else>
            <div class="cover-placeholder">
              <i class="bi bi-file-earmark-text"></i>
            </div>
          </template>
        </div>
      </section>

      <!-- 教材信息（直接展示 auto_meta_result）-->
      <section v-if="resource.auto_meta_result" class="card section">
        <h5 class="section-title">【教材信息】</h5>
        <p class="text-muted mb-2">
          {{ resource.auto_meta_result.textbook_info?.version || resource.auto_meta_result.textbook_version || "-" }} ·
          {{ resource.auto_meta_result.textbook_info?.subject || resource.auto_meta_result.subject || "-" }} ·
          {{ resource.auto_meta_result.textbook_info?.grade || resource.auto_meta_result.grade || "-"
          }}{{ resource.auto_meta_result.textbook_info?.volume || resource.auto_meta_result.volume || "" }}
        </p>
        <div v-if="resource.auto_meta_result.textbook_structure?.length">
          <p class="mb-1"><strong>单元列表：</strong></p>
          <ul class="structure">
            <li
              v-for="(item, idx) in resource.auto_meta_result.textbook_structure"
              :key="idx"
            >
              {{ item.name || item }}
            </li>
          </ul>
        </div>
        <div v-else-if="resource.auto_meta_result.structure?.length">
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
        <p v-else class="text-muted small">教材结构信息正在提取中...</p>
      </section>
      
      <!-- 如果 auto_meta_result 不存在，显示提示 -->
      <section v-else-if="resource && !resource.auto_meta_result" class="card section">
        <h5 class="section-title">【教材信息】</h5>
        <p class="text-muted">
          <i class="bi bi-info-circle me-2"></i>
          教材信息正在自动提取中，请稍候刷新页面查看...
        </p>
        <button class="btn btn-sm btn-outline-primary mt-2" @click="getResourceById(id)">
          <i class="bi bi-arrow-clockwise me-1"></i>刷新
        </button>
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
        <!-- 所属单元：使用 resource.unit 字段 -->
        <div v-if="resource.unit" class="mb-2">
          <strong>所属单元：</strong>
          <span class="badge bg-primary">{{ resource.unit }}</span>
        </div>
        <div v-else-if="resource.catalog_id" class="mb-2">
          <strong>所属单元：</strong>
          <span class="badge bg-secondary">待整理</span>
        </div>
      </section>

      <!-- 3. 教材结构（只读） -->
      <section v-if="resource.auto_meta_result && typeof resource.auto_meta_result === 'object'" class="card section">
        <h5 class="section-title">教材结构</h5>
        <p class="text-muted mb-2">
          📘
          {{ resource.auto_meta_result.textbook_info?.version || resource.auto_meta_result.textbook_version || "-" }} ·
          {{ resource.auto_meta_result.textbook_info?.subject || resource.auto_meta_result.subject || "-" }} ·
          {{ resource.auto_meta_result.textbook_info?.grade || resource.auto_meta_result.grade || "-" }} ·
          {{ resource.auto_meta_result.textbook_info?.volume || resource.auto_meta_result.volume || "-" }}
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
        <ul
          v-else-if="resource.auto_meta_result.structure?.length"
          class="structure"
        >
          <li
            v-for="(item, idx) in resource.auto_meta_result.structure"
            :key="idx"
          >
            {{ item.unit }}：{{ item.title }}
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
    user: {
      type: Object,
      default: null,
    },
  },
  emits: ['showLogin'],

  data() {
    return {
      resource: null, // 只读资源数据
      loading: false, // 加载状态
      isDeleting: false, // 删除中状态
      coverFit: "cover",
      coverFailed: false,
      resolvedCover: "",
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
        // 支持带/不带前导斜杠的路径
        const m =
          this.resource.cover_url.match(/(?:\/)??uploads\/cover\/(.+)$/) ||
          this.resource.cover_url.match(/uploads\/cover\/(.+)$/);
        if (m) {
          const filename = m[1]; // 完整文件名，例如 "1766517324895-cover.jpg"
          // 根据文档，格式应该是：/uploads/cover/resized/{filename}-thumbnail
          // 只返回缩略图，不回退到原始大图
          return `/uploads/cover/resized/${filename}-thumbnail`;
        }
        // 如果不是 uploads/cover 路径，返回空（显示占位符）
        return "";
      }
      // fallback: 后端可能返回自动生成的封面字段
      if (this.resource?.auto_cover_url) {
        const ac = this.resource.auto_cover_url;
        if (ac.startsWith("http")) return ac;
        // 只处理 uploads/cover 路径的缩略图
        const m =
          ac.match(/(?:\/)??uploads\/cover\/(.+)$/) ||
          ac.match(/uploads\/cover\/(.+)$/);
        if (m) {
          const filename = m[1];
          return `/uploads/cover/resized/${filename}-thumbnail`;
        }
        return "";
      }

      // 教材信息中也可能包含封面
      if (this.resource?.textbook_info?.cover_url) {
        const tc = this.resource.textbook_info.cover_url;
        if (tc.startsWith("http")) return tc;
        // 只处理 uploads/cover 路径的缩略图
        const m =
          tc.match(/(?:\/)??uploads\/cover\/(.+)$/) ||
          tc.match(/uploads\/cover\/(.+)$/);
        if (m) {
          const filename = m[1];
          return `/uploads/cover/resized/${filename}-thumbnail`;
        }
        return "";
      }
      if (this.resource?.cover?.id && API_BASE_URL)
        return `${API_BASE_URL}/covers/${this.resource.cover.id}?size=thumbnail`;
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
    // user: 不显示编辑
    // editor / admin: 显示编辑
    canEdit() {
      const user = this.$store.getters["auth/user"];
      if (!user) return false;
      // user 角色不能编辑
      if (user.role === "user") return false;
      // editor 和 admin 可以编辑
      return user.role === "editor" || user.role === "admin";
    },

    // 检查当前用户是否可以删除
    // user: 不显示删除
    // admin: 显示删除
    canDelete() {
      const user = this.$store.getters["auth/user"];
      if (!user) return false;
      // 只有 admin 可以删除
      return user.role === "admin";
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
      
      // 先获取当前用户信息，用于判断权限
      const currentUser = this.$store.getters["auth/user"];
      const isAdmin = currentUser && (currentUser.role === 'admin' || currentUser.role === 'editor');
      
      console.log("[PostShow] 开始获取资源，resourceId:", resourceId);
      console.log("[PostShow] 当前用户:", {
        id: currentUser?.id,
        role: currentUser?.role,
        isAdmin
      });
      
      try {
        const response = await apiHttpClient.get(
          `/api/resources/${resourceId}`
        );
        this.resource = response.data;
        
        // 如果 auto_meta_result 是字符串，需要解析为对象
        if (this.resource?.auto_meta_result && typeof this.resource.auto_meta_result === 'string') {
          try {
            this.resource.auto_meta_result = JSON.parse(this.resource.auto_meta_result);
            console.log("[PostShow] 已解析 auto_meta_result 字符串为对象:", this.resource.auto_meta_result);
          } catch (error) {
            console.error("[PostShow] 解析 auto_meta_result 失败:", error);
            // 解析失败，保持原样
          }
        }
        
        console.log("[PostShow] 获取资源成功:", {
          id: this.resource?.id,
          status: this.resource?.status,
          user_id: this.resource?.user_id,
          catalog_id: this.resource?.catalog_id,
          unit: this.resource?.unit,
          has_auto_meta_result: !!this.resource?.auto_meta_result,
          auto_meta_result: this.resource?.auto_meta_result,
          catalog_info: this.resource?.catalog_info,
          auto_meta_result_type: typeof this.resource?.auto_meta_result
        });
        
        // 权限检查：
        // 1. 管理员（admin/editor）可以查看所有资源（包括通过、拒绝、未审核）
        // 2. 发布者可以查看自己发布的资源（所有状态）
        // 3. 其他用户只能查看已通过审核的资源（approved）
        // 注意：如果资源在首页或列表页显示，说明后端已经过滤过了，前端应该允许查看
        const isOwner = currentUser && currentUser.id && 
                       this.resource.user_id && 
                       String(currentUser.id) === String(this.resource.user_id);
        const resourceStatus = this.resource.status;
        const isApproved = resourceStatus === 'approved';
        
        console.log("[PostShow] 权限检查:", {
          isAdmin,
          isOwner,
          resourceStatus,
          isApproved,
          currentUserId: currentUser?.id,
          resourceUserId: this.resource.user_id
        });
        
        // 如果是管理员，可以查看所有资源（包括通过、拒绝、未审核）
        if (isAdmin) {
          console.log("[PostShow] ✅ 管理员查看资源，允许访问所有状态");
          // 继续加载资源
        } else if (isOwner) {
          // 如果是发布者，可以查看自己的资源（包括所有状态）
          console.log("[PostShow] ✅ 发布者查看自己的资源，允许访问");
          // 继续加载资源
        } else if (isApproved) {
          // 其他用户可以查看已通过审核的资源
          console.log("[PostShow] ✅ 普通用户查看已通过审核的资源，允许访问");
          // 继续加载资源
        } else {
          // 其他人无权查看待审核或已拒绝的资源
          // 但如果后端返回了数据，说明后端允许访问，前端也应该允许
          console.log("[PostShow] ⚠️ 资源状态为", resourceStatus, "，但后端已返回数据，允许访问");
          // 继续加载资源（后端已经做了权限控制）
        }
        
        // reset cover failed flag when new resource loaded
        this.coverFailed = false;

        // 详细日志输出
        console.log("resource detail:", this.resource);
        console.log("auto_meta_result:", this.resource?.auto_meta_result);
        console.log("catalog_info:", this.resource?.catalog_info);
        // 尝试解析可用的封面 URL（异步探测），优先使用缩略图
        this.resolveCoverUrl();
      } catch (error) {
        console.error("[PostShow] 获取资源详情失败:", error);
        console.error("[PostShow] 错误详情:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          isAdmin
        });
        
        const { notification } = require('@/utils/notification');
        
        // 如果是管理员，即使 API 返回 403/404，也可能是后端权限控制问题
        // 但前端应该允许管理员查看所有资源，所以这里给出更明确的提示
        if (isAdmin && (error.response?.status === 403 || error.response?.status === 404)) {
          console.warn("[PostShow] ⚠️ 管理员访问资源时 API 返回错误，可能是后端权限配置问题");
          console.warn("[PostShow] 错误状态码:", error.response?.status);
          notification.warning('获取资源失败。如果是未审核或已拒绝的资源，请检查后端是否允许管理员查看所有状态的资源。');
          // 管理员也跳转到首页
          setTimeout(() => {
            this.$router.push('/');
          }, 2000);
        } else if (error.response?.status === 403 || error.response?.status === 404) {
          notification.warning('无权查看该资源或资源不存在');
          setTimeout(() => {
            this.$router.push('/');
          }, 1500);
        } else {
          notification.error('加载资源失败，请稍后重试');
          // 其他错误也跳转到首页
          setTimeout(() => {
            this.$router.push('/');
          }, 2000);
        }
        
        this.resource = null;
      } finally {
        this.loading = false;
      }
    },

    // 异步探测候选封面 URL，返回第一个能成功加载的 URL
    async resolveCoverUrl() {
      this.resolvedCover = "";
      this.coverFailed = false;

      const candidates = [];
      const cv = this.resource?.cover_url;
      if (cv) {
        if (cv.startsWith("http")) {
          candidates.push(cv);
        } else {
          const m =
            cv.match(/(?:\/)??uploads\/cover\/(.+)$/) ||
            cv.match(/uploads\/cover\/(.+)$/);
          if (m) {
            const filename = m[1]; // 完整文件名，例如 "1766517324895-cover.jpg"
            // 根据文档，格式应该是：/uploads/cover/resized/{filename}-thumbnail
            candidates.push(
              `/uploads/cover/resized/${filename}-thumbnail`
            );
          }
          // 不添加原始大图路径，只使用缩略图
          // 如果缩略图不存在，显示占位符
        }
      }
      if (this.resource?.auto_cover_url) {
        if (this.resource.auto_cover_url.startsWith("http")) {
          candidates.push(this.resource.auto_cover_url);
        } else {
          const path = this.resource.auto_cover_url.startsWith("/")
            ? this.resource.auto_cover_url
            : `/${this.resource.auto_cover_url}`;
          candidates.push(path);
        }
      }
      if (this.resource?.textbook_info?.cover_url) {
        if (this.resource.textbook_info.cover_url.startsWith("http")) {
          candidates.push(this.resource.textbook_info.cover_url);
        } else {
          const path = this.resource.textbook_info.cover_url.startsWith("/")
            ? this.resource.textbook_info.cover_url
            : `/${this.resource.textbook_info.cover_url}`;
          candidates.push(path);
        }
      }
      if (this.resource?.cover?.id && API_BASE_URL) {
        candidates.push(
          `${API_BASE_URL}/covers/${this.resource.cover.id}?size=thumbnail`
        );
      }

      for (const url of candidates) {
        if (!url) continue;
        // probe
        const ok = await this.probeImage(url);
        if (ok) {
          this.resolvedCover = url;
          this.coverFailed = false;
          return;
        }
      }

      this.coverFailed = true;
      this.resolvedCover = "";
    },

    probeImage(url) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });
    },

    onCoverError(e) {
      try {
        const failedUrl = e.target && e.target.src;
        console.log(
          "[PostShow] cover load error for",
          this.resource?.id,
          failedUrl
        );
        // 缩略图加载失败，直接显示占位符，不回退到大图
      } catch (err) {
        console.log(
          "[PostShow] cover load error (no src available) for",
          this.resource?.id
        );
      }
      this.coverFailed = true;
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
      const { notification } = await import("@/utils/notification");
      const confirmed = await notification.confirm(
        "确定要删除这个资源吗？此操作不可撤销。",
        "删除资源"
      );
      if (!confirmed) {
        return;
      }

      this.isDeleting = true;

      try {
        console.log("[PostShow] 删除资源，ID:", this.id);
        await apiHttpClient.delete(`/api/resources/${this.id}`);
        console.log("[PostShow] 资源删除成功");
        notification.success("资源已删除");
        this.$router.push("/resources");
        // 显示成功提示
        this.$store.commit("post/index/setResources", []); // 重置列表
      } catch (error) {
        console.error("[PostShow] 删除失败:", error);
        notification.error("删除失败：" + (error.response?.data?.message || error.message));
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
  background: var(--surface, #fff);
  box-shadow: var(--shadow, 0 6px 24px rgba(0, 0, 0, 0.04));
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
  color: var(--text, #1f2937);
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
  background: var(--bg, #f1f5f9);
  color: var(--muted, #475569);
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  border: 1px solid var(--border, #e2e8f0);
}

.section-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--text, #1f2937);
}

.structure {
  margin: 0;
  padding-left: 18px;
  color: var(--text, #475569);
}

.structure li {
  margin-bottom: 4px;
}

.text-body {
  margin: 0;
  color: var(--text, #1f2937);
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
