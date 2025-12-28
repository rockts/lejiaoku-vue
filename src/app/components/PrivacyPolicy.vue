<template>
  <div class="container py-5">
    <div class="legal-card">
      <h2 class="text-center mb-4">隐私政策</h2>
      <div class="legal-content">
        <p class="lead text-center mb-5">
          我们重视您的隐私。本隐私政策说明我们如何收集、使用、存储和保护您的个人信息。
        </p>

        <div class="section">
          <h4>1. 信息收集</h4>
          <p>我们可能收集的信息包括：账户注册信息（如用户名、邮箱）、使用记录（如浏览、搜索、下载历史）、上传的内容以及设备信息。这些信息用于提供和优化我们的服务。</p>
        </div>

        <div class="section">
          <h4>2. 信息使用</h4>
          <p>收集的信息将用于：个性化资源推荐、改进平台功能、安全风控、以及在必要时与您联系（如服务通知）。</p>
        </div>

        <div class="section">
          <h4>3. 信息保护</h4>
          <p>我们采用行业标准的技术与管理措施（如加密存储、访问控制）来保护您的数据安全。未经您的授权，我们不会向第三方出售或披露您的个人信息。</p>
        </div>

        <div class="section">
          <h4>4. Cookies 使用</h4>
          <p>我们使用 Cookies 技术来提升您的访问体验（如保持登录状态）。您可以通过浏览器设置管理或禁用 Cookies，但这可能会影响部分功能的使用。</p>
        </div>

        <div class="section">
          <h4>5. 未成年人保护</h4>
          <p>如您是未成年人，请在监护人的陪同与指导下使用本平台。我们致力于保护未成年人的个人信息安全。</p>
        </div>

        <div class="mt-5 pt-4 border-top text-center text-muted">
          <p>如需删除或更正个人信息，或有任何隐私相关问题，请通过平台提供的联系方式与我们沟通。</p>
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
  background: var(--surface);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 40px;
  box-shadow: var(--shadow);
  max-width: 900px;
  margin: 0 auto;
}

.section {
  margin-bottom: 30px;
}

.section h4 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--primary);
}

.section p {
  color: var(--text);
  line-height: 1.7;
}
</style>
