<template>
  <div class="container py-5">
    <div class="legal-card">
      <h2 class="text-center mb-4">版权声明</h2>
      <div class="legal-content">
        <p class="lead text-center mb-5">
          乐教库（LeJiaoKu.Com）致力于为教育工作者提供优质的教学资源，我们尊重知识产权，并严格遵守相关法律法规。
        </p>

        <div class="section">
          <h4>1. 资源来源说明</h4>
          <p>
            本站部分资源转载于网络，包括但不限于课件、教案、试题、教材等教学资源。这些资源来源于公开渠道，我们努力确保资源的合法性和准确性。
          </p>
        </div>

        <div class="section">
          <h4>2. 版权保护</h4>
          <p>
            我们尊重所有原创作者的知识产权。如果您是某资源的版权所有者，发现本站存在侵犯您权益的内容，请及时与我们联系，我们将立即删除相关资源。
          </p>
        </div>

        <div class="section">
          <h4>3. 侵权处理</h4>
          <p>
            如您发现本站存在侵犯您知识产权的资源，请通过以下方式联系我们：
          </p>
          <ul>
            <li>邮箱：<a href="mailto:gaopeng@lekee.cc">gaopeng@lekee.cc</a></li>
            <li>请在邮件中提供：资源链接、版权证明、您的联系方式</li>
            <li>我们将在收到通知后的 24 小时内处理并删除相关资源</li>
          </ul>
        </div>

        <div class="section">
          <h4>4. 用户上传资源</h4>
          <p>
            用户上传的资源应确保拥有合法授权，不得上传侵犯他人知识产权的资源。上传者应对其上传的内容承担全部法律责任。
          </p>
        </div>

        <div class="section">
          <h4>5. 免责声明</h4>
          <p>
            本站提供的资源仅供教学和学习使用，不构成任何商业建议。用户使用本站资源所产生的任何后果，本站不承担责任。
          </p>
        </div>

        <div class="mt-5 pt-4 border-top text-center text-muted">
          <p>如有任何版权相关问题，请及时与我们联系，我们将积极配合处理。</p>
          <p class="mt-3">
            <a href="mailto:gaopeng@lekee.cc" class="btn btn-primary">
              <i class="bi bi-envelope me-2"></i>联系我们
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "Copyright",
});
</script>

<style scoped>
.legal-card {
  max-width: 900px;
  margin: 0 auto;
  background: var(--surface, #fff);
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.legal-content {
  text-align: left;
  line-height: 1.8;
  color: var(--text, #333);
}

.legal-content h2 {
  color: var(--text, #1f2937);
  font-weight: 700;
}

.legal-content .lead {
  color: var(--muted, #6b7280);
  font-size: 16px;
}

.legal-content .section {
  margin-bottom: 32px;
}

.legal-content .section h4 {
  color: var(--primary, #4f8cff);
  font-weight: 600;
  margin-bottom: 12px;
  font-size: 18px;
}

.legal-content .section p {
  color: var(--text, #4b5563);
  margin-bottom: 12px;
  font-size: 15px;
}

.legal-content .section ul {
  margin-left: 24px;
  margin-top: 12px;
}

.legal-content .section ul li {
  margin-bottom: 8px;
  color: var(--text, #4b5563);
}

.legal-content .section a {
  color: var(--primary, #4f8cff);
  text-decoration: none;
  font-weight: 500;
}

.legal-content .section a:hover {
  text-decoration: underline;
}

[data-theme="dark"] .legal-card {
  background: var(--surface, #2d333b);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .legal-content {
  color: var(--text, #e6edf3);
}

[data-theme="dark"] .legal-content .section p,
[data-theme="dark"] .legal-content .section ul li {
  color: var(--text, #adbac7);
}

@media (max-width: 768px) {
  .legal-card {
    padding: 24px;
    margin: 0 16px;
  }

  .legal-content .section h4 {
    font-size: 16px;
  }

  .legal-content .section p {
    font-size: 14px;
  }
}
</style>

