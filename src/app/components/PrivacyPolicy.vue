<template>
  <div class="legal-page container py-4">
    <h2>隐私政策</h2>
    <p>
      我们重视您的隐私。本隐私政策说明我们如何收集、使用、存储和保护您的个人信息。
    </p>
    <ol>
      <li>
        <strong>收集信息：</strong>
        包括账户信息、浏览与搜索记录、上传与下载记录等，用于提供和优化服务。
      </li>
      <li>
        <strong>信息用途：</strong>
        用于资源推荐、功能改进、安全风控及必要的通知沟通。
      </li>
      <li>
        <strong>信息保护：</strong>
        我们采用合理的技术与管理措施保护您的数据，未经授权不向第三方披露。
      </li>
      <li>
        <strong>Cookies：</strong> 可能使用 Cookies
        以改进体验，您可在浏览器中进行管理或禁用。
      </li>
      <li>
        <strong>未成年人保护：</strong>
        如您是未成年人，请在监护人同意与指导下使用本平台。
      </li>
    </ol>
    <p>
      如需删除或更正个人信息，或有任何隐私相关问题，请通过平台提供的联系方式与我们沟通。
    </p>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "PrivacyPolicy",
});
</script>

<style scoped>
.legal-page {
  max-width: 960px;
  line-height: 1.6;
}
.legal-page h2 {
  margin-bottom: 16px;
}
.legal-page ol {
  padding-left: 20px;
}
.legal-page li {
  margin-bottom: 8px;
}
</style>
