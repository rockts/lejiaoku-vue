<template>
  <div class="container py-5">
    <div class="legal-card">
      <h2 class="text-center mb-4">
        <i class="bi bi-person-check-fill me-2"></i>贡献者义务与责任
      </h2>
      <div class="legal-content">
        <p class="lead mb-5">
          感谢您选择成为乐教库的贡献者。作为贡献者，您将承担以下义务与责任，请仔细阅读并遵守。
        </p>

        <div class="section">
          <h4>1. 资源质量要求</h4>
          <ul>
            <li>上传的教学资源应具有实际教学价值，内容准确、完整、实用</li>
            <li>资源应清晰标注适用年级、学科、课程等信息，便于其他教师查找和使用</li>
            <li>确保资源文件完整，无损坏或无法打开的情况</li>
            <li>资源内容应符合国家教育方针政策，不得包含违法违规内容</li>
          </ul>
        </div>

        <div class="section">
          <h4>2. 知识产权责任</h4>
          <ul>
            <li>您必须确保对上传的资源拥有合法的知识产权或使用授权</li>
            <li>不得上传侵犯他人著作权、商标权、专利权等知识产权的资源</li>
            <li>不得上传包含他人隐私信息或未经授权的个人信息</li>
            <li>如使用他人作品，必须获得明确授权或符合合理使用范围</li>
            <li>因资源侵权产生的法律责任由上传者自行承担</li>
          </ul>
        </div>

        <div class="section">
          <h4>3. 内容审核义务</h4>
          <ul>
            <li>所有上传的资源将经过平台审核，审核通过后方可发布</li>
            <li>您有义务配合平台的审核工作，提供必要的说明或证明材料</li>
            <li>对于审核未通过的资源，平台将说明原因，您有权进行修改后重新提交</li>
            <li>平台有权对已发布的资源进行复查，发现问题资源将立即下架</li>
          </ul>
        </div>

        <div class="section">
          <h4>4. 资源维护责任</h4>
          <ul>
            <li>您应定期检查已上传的资源，确保链接有效、内容准确</li>
            <li>如发现资源存在问题，应及时更新或删除</li>
            <li>对于用户反馈的问题，应积极回应并处理</li>
            <li>不得恶意上传重复、低质量或无关的资源</li>
          </ul>
        </div>

        <div class="section">
          <h4>5. 行为规范</h4>
          <ul>
            <li>遵守平台的使用规则和社区准则，维护良好的社区氛围</li>
            <li>不得利用贡献者身份进行商业推广、广告宣传等违规行为</li>
            <li>不得恶意刷量、刷评或进行其他影响平台正常运营的行为</li>
            <li>尊重其他用户，不得发布侮辱、诽谤、歧视性言论</li>
          </ul>
        </div>

        <div class="section">
          <h4>6. 违规处理</h4>
          <ul>
            <li>违反上述义务的，平台有权采取警告、限制上传、下架资源等措施</li>
            <li>情节严重的，平台有权取消贡献者资格，并保留追究法律责任的权利</li>
            <li>因违规行为给平台或其他用户造成损失的，应承担相应的赔偿责任</li>
          </ul>
        </div>

        <div class="section">
          <h4>7. 免责声明</h4>
          <ul>
            <li>平台不对用户上传的资源内容承担责任，资源的使用风险由使用者自行承担</li>
            <li>平台有权根据实际情况调整贡献者权限和审核标准</li>
            <li>因不可抗力导致的服务中断或数据丢失，平台不承担责任</li>
          </ul>
        </div>

        <div class="section">
          <h4>8. 权利与收益</h4>
          <ul>
            <li>贡献者享有对上传资源的署名权</li>
            <li>平台将根据贡献者的资源质量和数量，提供相应的认可和激励</li>
            <li>贡献者有权查看自己上传资源的使用情况和反馈</li>
            <li>平台保留对资源进行推荐、展示、推广的权利</li>
          </ul>
        </div>

        <div class="mt-5 pt-4 border-top text-center text-muted">
          <p>感谢您对乐教库的支持与贡献！如有疑问，请通过平台提供的联系方式与我们沟通。</p>
          <router-link to="/" class="btn btn-primary mt-3">
            <i class="bi bi-house me-2"></i>返回首页
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ContributorResponsibilities",
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

.legal-card h2 {
  color: var(--primary);
  font-weight: 600;
  font-size: 2rem;
}

.legal-content {
  line-height: 1.8;
  color: var(--text);
  text-align: left;
}

.legal-content .lead {
  font-size: 1.1rem;
  color: var(--text-secondary);
  text-align: left;
}

.section {
  margin-bottom: 30px;
  text-align: left;
}

.section h4 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--primary);
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--border);
  text-align: left;
}

.section ul {
  padding-left: 1.5rem;
  margin-top: 0.75rem;
}

.section li {
  margin-bottom: 0.75rem;
  line-height: 1.7;
  color: var(--text);
}

.section p {
  margin-bottom: 0.75rem;
  color: var(--text);
}

@media (max-width: 768px) {
  .legal-card {
    padding: 1.5rem;
    margin: 1rem;
  }

  .legal-card h2 {
    font-size: 1.5rem;
  }

  .section h4 {
    font-size: 1.1rem;
  }
}
</style>

