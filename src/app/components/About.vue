<template>
  <div class="container py-5">
    <div class="about-card">
      <h1 class="about-title">关于我们</h1>
      <div class="about-content">
        <div class="section">
          <h3 class="section-title">平台简介</h3>
          <p class="section-text">
            乐教库（LeJiaoKu.Com）是一个专注于教育资源的开放式分享平台，致力于为全国教师和教育工作者提供优质、丰富的教学资源。平台以"让教学资源触手可及"为使命，通过汇聚优质教育资源，降低教学准备成本，提升教学质量。
          </p>
          <p class="section-text">
            我们的资源涵盖电子教材、课件、教案、同步练习、试题、教学视频等多种类型，覆盖小学、初中、高中各个学段，涉及语文、数学、英语、物理、化学、生物、历史、地理、政治等多个学科。
          </p>
        </div>

        <div class="section">
          <h3 class="section-title">核心价值</h3>
          <p class="section-text">
            <strong>开放共享：</strong>我们倡导教育资源的开放共享，让优质教学资源惠及更多教师和学生。
          </p>
          <p class="section-text">
            <strong>质量优先：</strong>我们严格审核上传的资源，确保资源的质量和适用性，为教师提供可靠的教学支持。
          </p>
          <p class="section-text">
            <strong>用户至上：</strong>我们始终以用户需求为导向，不断优化平台功能，提升用户体验。
          </p>
          <p class="section-text">
            <strong>教育公益：</strong>我们致力于推动教育公平，让优质教育资源不再受地域、经济条件限制。
          </p>
        </div>

        <div class="section">
          <h3 class="section-title">资源特色</h3>
          <p class="section-text">
            <strong>资源丰富：</strong>平台汇聚了海量教学资源，包括各版本教材配套资源、名师课件、优质教案等，满足不同教学需求。
          </p>
          <p class="section-text">
            <strong>分类清晰：</strong>资源按照学段、学科、版本、年级等维度进行分类，方便教师快速找到所需资源。
          </p>
          <p class="section-text">
            <strong>持续更新：</strong>平台资源不断更新，紧跟教材变化和教学需求，确保资源的时效性和实用性。
          </p>
          <p class="section-text">
            <strong>质量保证：</strong>所有资源经过审核，确保内容准确、格式规范，可直接用于教学。
          </p>
        </div>

        <div class="section">
          <h3 class="section-title">贡献者计划</h3>
          <p class="section-text">
            我们欢迎广大教师和教育工作者加入我们的贡献者计划，分享您的优质教学资源。通过分享，您不仅可以帮助更多教师，还能获得平台的认可和奖励。
          </p>
          <p class="section-text">
            成为贡献者后，您可以上传和管理自己的教学资源，参与资源审核，获得优先推荐等权益。我们相信，每一位教师的分享都能让教育变得更好。
          </p>
          <p class="section-text">
            资源不断更新中，我们需要更多贡献者。让这一切变得更有意义，让优质教育资源惠及每一个角落。
          </p>
        </div>

        <div class="section">
          <h3 class="section-title">联系我们</h3>
          <p class="section-text">
            如果您有任何问题、建议或合作意向，欢迎通过以下方式与我们联系：
          </p>
          <ul class="contact-list">
            <li>
              <i class="bi bi-envelope me-2"></i>
              邮箱：<a href="mailto:gaopeng@lekee.cc">gaopeng@lekee.cc</a>
            </li>
            <li>
              <i class="bi bi-globe me-2"></i>
              网站：<a href="https://lejiaoku.com" target="_blank">www.lejiaoku.com</a>
            </li>
            <li>
              <i class="bi bi-building me-2"></i>
              主办方：<a href="https://lekeopen.com" target="_blank">乐可开源</a>
            </li>
          </ul>
        </div>

        <div class="section">
          <h3 class="section-title">愿景与使命</h3>
          <p class="section-text">
            <strong>愿景：</strong>成为全国领先的教育资源共享平台，让优质教育资源触手可及。
          </p>
          <p class="section-text">
            <strong>使命：</strong>通过技术手段和社区力量，汇聚优质教育资源，降低教学成本，提升教学质量，推动教育公平。
          </p>
          <p class="section-text">
            我们相信，教育的力量可以改变世界。让我们一起，为教育事业贡献一份力量。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "About",
});
</script>

<style scoped>
.about-card {
  max-width: 1000px;
  margin: 0 auto;
  background: var(--surface, #fff);
  border-radius: 8px;
  padding: 48px 56px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border, #e9ecef);
}

.about-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text, #1f2937);
  margin-bottom: 32px;
  text-align: left;
  letter-spacing: 0.5px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--border, #e9ecef);
}

.about-content {
  text-align: left;
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

.section-text strong {
  color: var(--text, #1f2937);
  font-weight: 600;
}

.contact-list {
  list-style: none;
  padding-left: 0;
  margin-top: 16px;
  margin-bottom: 0;
}

.contact-list li {
  font-size: 15px;
  line-height: 1.85;
  color: var(--text, #4b5563);
  margin-bottom: 12px;
  text-align: left;
  display: flex;
  align-items: center;
}

.contact-list i {
  color: var(--primary, #4f8cff);
  font-size: 16px;
  width: 20px;
}

.contact-list a {
  color: var(--primary, #4f8cff);
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
}

.contact-list a:hover {
  text-decoration: underline;
}

[data-theme="dark"] .about-card {
  background: var(--surface, #2d333b);
  border-color: var(--border, #444c56);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .about-title {
  color: var(--text, #e6edf3);
  border-bottom-color: var(--border, #444c56);
}

[data-theme="dark"] .section-title {
  color: var(--text, #e6edf3);
  border-bottom-color: var(--border, #444c56);
}

[data-theme="dark"] .section-text {
  color: var(--text, #adbac7);
}

[data-theme="dark"] .section-text strong {
  color: var(--text, #e6edf3);
}

[data-theme="dark"] .contact-list li {
  color: var(--text, #adbac7);
}

@media (max-width: 768px) {
  .about-card {
    padding: 32px 24px;
    margin: 0 16px;
  }

  .about-title {
    font-size: 24px;
  }

  .section-title {
    font-size: 18px;
  }

  .section-text,
  .contact-list li {
    font-size: 14px;
  }
}
</style>
