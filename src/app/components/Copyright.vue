<template>
  <div class="container py-5">
    <div class="legal-card">
      <h1 class="legal-title">版权声明</h1>
      <div class="legal-meta">
        <span class="meta-item">最后更新：2025年12月29日</span>
        <span class="meta-divider">|</span>
        <span class="meta-item">生效日期：2025年12月29日</span>
      </div>
      <div class="legal-content">
        <p class="legal-intro">
          乐教库（LeJiaoKu.Com）致力于为教育工作者提供优质的教学资源，我们尊重知识产权，并严格遵守相关法律法规。本版权声明说明了平台对资源版权的处理方式。
        </p>

        <div class="section">
          <h3 class="section-title">一、资源来源说明</h3>
          <p class="section-text">
            1.1 本站部分资源转载于网络，包括但不限于课件、教案、试题、教材等教学资源。这些资源来源于公开渠道，我们努力确保资源的合法性和准确性。
          </p>
          <p class="section-text">
            1.2 平台上的资源可能来自用户上传、网络收集或合作伙伴提供，我们会尽可能标注资源来源。
          </p>
          <p class="section-text">
            1.3 如资源标注了版权信息，我们将尊重并保留相关版权声明。
          </p>
        </div>

        <div class="section">
          <h3 class="section-title">二、版权保护</h3>
          <p class="section-text">
            2.1 我们尊重所有原创作者的知识产权，支持原创内容的创作和传播。
          </p>
          <p class="section-text">
            2.2 如果您是某资源的版权所有者，发现本站存在侵犯您权益的内容，请及时与我们联系，我们将立即删除相关资源。
          </p>
          <p class="section-text">
            2.3 我们鼓励用户上传原创资源，并会优先推荐和展示原创内容。
          </p>
        </div>

        <div class="section">
          <h3 class="section-title">三、侵权处理</h3>
          <p class="section-text">
            3.1 如您发现本站存在侵犯您知识产权的资源，请通过以下方式联系我们：
          </p>
          <ul class="section-list">
            <li>邮箱：<a href="mailto:gaopeng@lekee.cc">gaopeng@lekee.cc</a></li>
            <li>请在邮件中提供：资源链接、版权证明、您的联系方式</li>
            <li>我们将在收到通知后的 24 小时内处理并删除相关资源</li>
            <li>对于恶意举报，我们将保留追究法律责任的权利</li>
          </ul>
          <p class="section-text">
            3.2 我们承诺在收到有效的版权投诉后，将及时响应并采取必要措施。
          </p>
        </div>

        <div class="section">
          <h3 class="section-title">四、用户上传资源</h3>
          <p class="section-text">
            4.1 用户上传的资源应确保拥有合法授权，不得上传侵犯他人知识产权的资源。
          </p>
          <p class="section-text">
            4.2 上传者应对其上传的内容承担全部法律责任，包括但不限于版权、商标、专利等知识产权责任。
          </p>
          <p class="section-text">
            4.3 如因用户上传内容引发版权纠纷，平台有权要求上传者提供授权证明，并可能暂时或永久删除相关资源。
          </p>
        </div>

        <div class="section">
          <h3 class="section-title">五、资源使用</h3>
          <p class="section-text">
            5.1 本站提供的资源仅供教学和学习使用，用户应遵守相关法律法规和平台使用规范。
          </p>
          <p class="section-text">
            5.2 用户不得将平台资源用于商业盈利、非法传播或其他违法违规用途。
          </p>
        </div>

        <div class="section">
          <h3 class="section-title">六、免责声明</h3>
          <p class="section-text">
            6.1 本站提供的资源仅供教学和学习使用，不构成任何商业建议。
          </p>
          <p class="section-text">
            6.2 用户使用本站资源所产生的任何后果，本站不承担责任。
          </p>
          <p class="section-text">
            6.3 平台不对资源的准确性、完整性或适用性作任何明示或暗示的保证。
          </p>
        </div>

        <div class="legal-footer">
          <p class="footer-text">如有任何版权相关问题，请及时与我们联系，我们将积极配合处理：</p>
          <p class="footer-contact">
            <i class="bi bi-envelope me-2"></i>
            <a href="mailto:gaopeng@lekee.cc">gaopeng@lekee.cc</a>
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
  max-width: 1000px;
  margin: 0 auto;
  background: var(--surface, #fff);
  border-radius: 8px;
  padding: 48px 56px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border, #e9ecef);
}

.legal-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text, #1f2937);
  margin-bottom: 16px;
  text-align: left;
  letter-spacing: 0.5px;
}

.legal-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--border, #e9ecef);
  font-size: 13px;
  color: var(--muted, #6c757d);
}

.meta-item {
  color: var(--muted, #6c757d);
}

.meta-divider {
  color: var(--muted, #adb5bd);
}

.legal-content {
  text-align: left;
}

.legal-intro {
  font-size: 16px;
  line-height: 1.8;
  color: var(--text, #374151);
  margin-bottom: 40px;
  padding: 20px;
  background: var(--bg, #f8f9fa);
  border-left: 4px solid var(--primary, #4f8cff);
  border-radius: 4px;
}

.section {
  margin-bottom: 36px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text, #1f2937);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border, #e9ecef);
  text-align: left;
}

.section-text {
  font-size: 15px;
  line-height: 1.85;
  color: var(--text, #4b5563);
  margin-bottom: 12px;
  text-align: left;
  text-indent: 0;
}

.section-list {
  margin-left: 24px;
  margin-top: 12px;
  margin-bottom: 12px;
  padding-left: 0;
  list-style-type: decimal;
}

.section-list li {
  font-size: 15px;
  line-height: 1.85;
  color: var(--text, #4b5563);
  margin-bottom: 8px;
  text-align: left;
}

.section-list a {
  color: var(--primary, #4f8cff);
  text-decoration: none;
  font-weight: 500;
}

.section-list a:hover {
  text-decoration: underline;
}

.legal-footer {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 2px solid var(--border, #e9ecef);
  text-align: left;
}

.footer-text {
  font-size: 15px;
  color: var(--text, #4b5563);
  margin-bottom: 12px;
}

.footer-contact {
  font-size: 15px;
  color: var(--text, #4b5563);
}

.footer-contact a {
  color: var(--primary, #4f8cff);
  text-decoration: none;
  font-weight: 500;
}

.footer-contact a:hover {
  text-decoration: underline;
}

[data-theme="dark"] .legal-card {
  background: var(--surface, #2d333b);
  border-color: var(--border, #444c56);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .legal-title {
  color: var(--text, #e6edf3);
}

[data-theme="dark"] .legal-intro {
  background: var(--bg, #1a1d23);
  border-left-color: var(--primary, #4f8cff);
  color: var(--text, #adbac7);
}

[data-theme="dark"] .section-title {
  color: var(--text, #e6edf3);
  border-bottom-color: var(--border, #444c56);
}

[data-theme="dark"] .section-text,
[data-theme="dark"] .section-list li {
  color: var(--text, #adbac7);
}

[data-theme="dark"] .legal-footer {
  border-top-color: var(--border, #444c56);
}

[data-theme="dark"] .footer-text,
[data-theme="dark"] .footer-contact {
  color: var(--text, #adbac7);
}

@media (max-width: 768px) {
  .legal-card {
    padding: 32px 24px;
    margin: 0 16px;
  }

  .legal-title {
    font-size: 24px;
  }

  .legal-intro {
    font-size: 15px;
    padding: 16px;
  }

  .section-title {
    font-size: 18px;
  }

  .section-text,
  .section-list li {
    font-size: 14px;
  }
}
</style>

