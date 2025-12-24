<template>
  <div class="container py-5">
    <div class="legal-card">
      <h2 class="text-center mb-4">用户协议</h2>
      <div class="legal-content">
        <p class="lead text-center mb-5">
          欢迎使用乐教库（LeJiaoKu.Com）。在使用本平台的资源、搜索、下载、上传等功能前，请仔细阅读本用户协议。
        </p>
        
        <div class="section">
          <h4>1. 账户与登录</h4>
          <p>注册或登录即代表您已阅读并接受本协议。您有责任维护账户安全，并对账户下的所有活动负责。</p>
        </div>

        <div class="section">
          <h4>2. 资源使用规范</h4>
          <p>本平台提供的所有资源（包括但不限于课件、教案、试题）仅用于教学与学习目的。未经授权，不得用于商业盈利或非法传播。</p>
        </div>

        <div class="section">
          <h4>3. 上传与共享</h4>
          <p>上传者应确保对资源拥有合法授权，不得上传侵犯他人知识产权、隐私权或包含违法违规内容的资源。平台有权对违规内容进行审核与删除。</p>
        </div>

        <div class="section">
          <h4>4. 隐私与安全</h4>
          <p>我们会依法保护您的个人信息，具体措施请参考《隐私政策》。</p>
        </div>

        <div class="section">
          <h4>5. 违规处理</h4>
          <p>对违反本协议的内容或行为，平台有权采取警告、下架资源、冻结或删除账户等措施。</p>
        </div>
        
        <div class="mt-5 pt-4 border-top text-center text-muted">
          <p>如有疑问，请通过平台提供的联系方式与我们沟通。</p>
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
