<template>
  <div class="container py-5">
    <div class="legal-card">
      <h1 class="legal-title">隐私政策</h1>
      <div class="legal-meta">
        <span class="meta-item">最后更新：2025年12月29日</span>
        <span class="meta-divider">|</span>
        <span class="meta-item">生效日期：2025年12月29日</span>
      </div>
      <div class="legal-content">
        <p class="legal-intro">
          我们重视您的隐私。本隐私政策说明我们如何收集、使用、存储和保护您的个人信息。使用本平台即表示您同意本隐私政策的条款。
        </p>

        <div class="section">
          <h3 class="section-title">一、信息收集</h3>
          <p class="section-text">
            1.1 我们可能收集的信息包括：账户注册信息（如用户名、邮箱、昵称）、使用记录（如浏览、搜索、下载历史）、上传的内容以及设备信息（如IP地址、浏览器类型）。
          </p>
          <p class="section-text">
            1.2 这些信息用于提供和优化我们的服务，改善用户体验，以及确保平台安全运行。
          </p>
          <p class="section-text">
            1.3 我们不会收集与提供服务无关的个人敏感信息，除非您主动提供。
          </p>
        </div>

        <div class="section">
          <h3 class="section-title">二、信息使用</h3>
          <p class="section-text">
            2.1 收集的信息将用于：个性化资源推荐、改进平台功能、安全风控、以及在必要时与您联系（如服务通知、账户安全提醒）。
          </p>
          <p class="section-text">
            2.2 我们不会将您的个人信息用于任何商业营销目的，除非获得您的明确同意。
          </p>
          <p class="section-text">
            2.3 我们可能使用匿名化、去标识化的数据进行统计分析，以改进服务质量。
          </p>
        </div>

        <div class="section">
          <h3 class="section-title">三、信息保护</h3>
          <p class="section-text">
            3.1 我们采用行业标准的技术与管理措施（如加密存储、访问控制、安全审计）来保护您的数据安全。
          </p>
          <p class="section-text">
            3.2 未经您的授权，我们不会向第三方出售、出租或披露您的个人信息。
          </p>
          <p class="section-text">
            3.3 如发生数据安全事件，我们将及时通知您，并采取必要措施减少损失。
          </p>
        </div>

        <div class="section">
          <h3 class="section-title">四、Cookies 使用</h3>
          <p class="section-text">
            4.1 我们使用 Cookies 技术来提升您的访问体验（如保持登录状态、记住您的偏好设置）。
          </p>
          <p class="section-text">
            4.2 您可以通过浏览器设置管理或禁用 Cookies，但这可能会影响部分功能的使用。
          </p>
          <p class="section-text">
            4.3 我们不会使用 Cookies 收集您的个人敏感信息。
          </p>
        </div>

        <div class="section">
          <h3 class="section-title">五、信息共享与披露</h3>
          <p class="section-text">
            5.1 除法律法规要求或经您同意外，我们不会与第三方共享您的个人信息。
          </p>
          <p class="section-text">
            5.2 在以下情况下，我们可能会披露您的信息：法律法规要求、司法机关或行政机关依法要求、为保护平台和用户权益。
          </p>
        </div>

        <div class="section">
          <h3 class="section-title">六、您的权利</h3>
          <p class="section-text">
            6.1 您有权访问、更正、删除您的个人信息，或要求我们停止处理您的个人信息。
          </p>
          <p class="section-text">
            6.2 您可以通过账户设置或联系我们行使上述权利。
          </p>
        </div>

        <div class="section">
          <h3 class="section-title">七、未成年人保护</h3>
          <p class="section-text">
            7.1 如您是未成年人，请在监护人的陪同与指导下使用本平台。
          </p>
          <p class="section-text">
            7.2 我们致力于保护未成年人的个人信息安全，不会主动收集未成年人的个人信息。
          </p>
        </div>

        <div class="legal-footer">
          <p class="footer-text">如需删除或更正个人信息，或有任何隐私相关问题，请通过以下方式联系我们：</p>
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
  name: "PrivacyPolicy",
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
