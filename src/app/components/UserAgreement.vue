<template>
  <div class="legal-page container py-4">
    <h2>用户协议</h2>
    <p>
      欢迎使用乐教库（LeJiaoKu）。在使用本平台的资源、搜索、下载、上传等功能前，请仔细阅读本用户协议。
    </p>
    <ol>
      <li>
        <strong>账户与登录：</strong> 注册或登录即代表您已阅读并接受本协议。
      </li>
      <li>
        <strong>资源使用：</strong>
        仅用于教学与学习目的，不得用于任何非法或侵权用途。
      </li>
      <li>
        <strong>上传与共享：</strong>
        上传者应确保对资源拥有合法授权，不得上传侵权或违规内容。
      </li>
      <li>
        <strong>隐私与安全：</strong>
        我们会依法保护您的个人信息，并参考《隐私政策》进行处理。
      </li>
      <li>
        <strong>违规处理：</strong>
        对违反本协议的内容或行为，平台有权下架、冻结或删除相关账户与资源。
      </li>
    </ol>
    <p>如有疑问，请通过平台提供的联系方式与我们沟通。</p>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "UserAgreement",
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
