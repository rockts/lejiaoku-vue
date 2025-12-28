<template>
  <div class="container py-5">
    <div class="legal-card">
      <h1 class="legal-title">用户协议</h1>
      <div class="legal-meta">
        <span class="meta-item">最后更新：2025年12月29日</span>
        <span class="meta-divider">|</span>
        <span class="meta-item">生效日期：2025年12月29日</span>
      </div>
      <div class="legal-content">
        <p class="legal-intro">
          欢迎使用乐教库（LeJiaoKu.Com）。在使用本平台的资源、搜索、下载、上传等功能前，请仔细阅读本用户协议。注册或登录即代表您已阅读、理解并同意接受本协议的全部内容。
        </p>

        <div class="section">
          <h3 class="section-title">一、账户与登录</h3>
          <p class="section-text">
            1.1 用户注册时，应提供真实、准确、完整的个人信息。如信息发生变更，应及时更新。
          </p>
          <p class="section-text">
            1.2 注册或登录即代表您已阅读并接受本协议。您有责任维护账户安全，并对账户下的所有活动负责。
          </p>
          <p class="section-text">
            1.3 用户不得将账户转让、出售或出借给他人使用。如发现账户被盗用，应立即通知平台。
          </p>
        </div>

        <div class="section">
          <h3 class="section-title">二、资源使用规范</h3>
          <p class="section-text">
            2.1 本平台提供的所有资源（包括但不限于课件、教案、试题、教材）仅用于教学与学习目的。
          </p>
          <p class="section-text">
            2.2 未经授权，不得将平台资源用于商业盈利、非法传播或其他违法违规用途。
          </p>
          <p class="section-text">
            2.3 用户下载的资源仅供个人教学使用，不得进行二次分发或商业利用。
          </p>
        </div>

        <div class="section">
          <h3 class="section-title">三、上传与共享</h3>
          <p class="section-text">
            3.1 上传者应确保对资源拥有合法授权，不得上传侵犯他人知识产权、隐私权或包含违法违规内容的资源。
          </p>
          <p class="section-text">
            3.2 平台有权对上传的资源进行审核，对违规内容进行删除、下架等处理。
          </p>
          <p class="section-text">
            3.3 上传者应对其上传的内容承担全部法律责任，平台不承担因用户上传内容引发的任何责任。
          </p>
        </div>

        <div class="section">
          <h3 class="section-title">四、隐私与安全</h3>
          <p class="section-text">
            4.1 我们会依法保护您的个人信息，具体措施请参考《隐私政策》。
          </p>
          <p class="section-text">
            4.2 平台采用行业标准的安全技术保护用户数据，但无法保证绝对安全，用户应自行采取必要的安全措施。
          </p>
        </div>

        <div class="section">
          <h3 class="section-title">五、违规处理</h3>
          <p class="section-text">
            5.1 对违反本协议的内容或行为，平台有权采取警告、下架资源、冻结或删除账户等措施。
          </p>
          <p class="section-text">
            5.2 如用户行为涉嫌违法，平台有权向有关部门举报，并配合调查。
          </p>
        </div>

        <div class="section">
          <h3 class="section-title">六、免责声明</h3>
          <p class="section-text">
            6.1 平台不对用户上传的资源内容、准确性、完整性或适用性作任何明示或暗示的保证。
          </p>
          <p class="section-text">
            6.2 用户因使用平台资源而产生的任何损失，平台不承担责任。
          </p>
        </div>

        <div class="section">
          <h3 class="section-title">七、协议变更</h3>
          <p class="section-text">
            7.1 平台有权根据法律法规变化或业务需要修改本协议，修改后的协议将在平台公布。
          </p>
          <p class="section-text">
            7.2 如用户不同意修改后的协议，应停止使用平台服务。
          </p>
        </div>

        <div class="legal-footer">
          <p class="footer-text">如有疑问，请通过以下方式联系我们：</p>
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
  name: "UserAgreement",
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

[data-theme="dark"] .section-text {
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

  .section-text {
    font-size: 14px;
  }
}
</style>
