<template>
  <div class="footer-container py-3 bg-light footer-glass">
    <!-- 主要信息区域 -->
    <div class="footer-main">
      <div class="footer-brand">
        <img :src="logoUrl" alt="乐教库" class="footer-logo" />
        <div class="brand-text">
          <span class="brand-name">乐教库</span>
          <span class="brand-slogan">让教学资源触手可及</span>
        </div>
      </div>
      <div class="footer-links">
        <router-link to="/legal/user-agreement" class="footer-link">用户协议</router-link>
        <span class="divider">|</span>
        <router-link to="/legal/privacy-policy" class="footer-link">隐私政策</router-link>
        <span class="divider">|</span>
        <router-link to="/legal/copyright" class="footer-link">版权声明</router-link>
        <span class="divider">|</span>
        <router-link to="/about" class="footer-link">关于我们</router-link>
      </div>
    </div>
    
    <!-- 版权和备案信息 -->
    <div class="footer-meta">
      <div class="footer-copyright">
        <span>© {{ currentYear }} 乐教库</span>
        <span class="meta-divider">·</span>
        <span>由 <a href="https://lekeopen.com" target="_blank" class="footer-external-link">乐可开源</a> 倾力打造</span>
      </div>
      <div class="footer-icp">
        <a href="https://beian.miit.gov.cn" target="_blank" class="footer-external-link">
          陇ICP备15002697号-4
        </a>
      </div>
    </div>
    
    <!-- 版权提示 -->
    <div class="copyright-notice">
      <i class="bi bi-shield-check me-2"></i>
      <span>本站部分资源转载于网络，如有侵权请联系我们，我们将立即删除。</span>
      <router-link to="/legal/copyright" class="copyright-link">查看版权声明</router-link>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import logoImg from "@/assets/img/logo.png";

export default defineComponent({
  name: "GlobalFooter",
  data() {
    return {
      logoUrl: logoImg
    };
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  }
});
</script>

<style scoped>
.footer-container {
  max-width: 100%;
}

.footer-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 0 20px;
  margin-bottom: 12px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: var(--text, #495057);
}

.footer-logo {
  height: 32px;
  width: auto;
  object-fit: contain;
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-name {
  font-weight: 600;
  color: var(--text, #212529);
}

.brand-slogan {
  color: var(--muted, #6c757d);
  font-size: 13px;
  margin-left: 4px;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.footer-link {
  color: var(--text, #495057);
  text-decoration: none;
  font-size: 13px;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--primary, #4f8cff);
  text-decoration: none;
}

.divider {
  color: var(--muted, #adb5bd);
  font-size: 12px;
}

.footer-meta {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 0 20px;
  margin-bottom: 12px;
  font-size: 12px;
  color: var(--muted, #6c757d);
}

.footer-copyright {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.meta-divider {
  color: var(--muted, #adb5bd);
}

.footer-external-link {
  color: var(--muted, #6c757d);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-external-link:hover {
  color: var(--primary, #4f8cff);
  text-decoration: underline;
}

.copyright-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 20px 0;
  margin-top: 12px;
  border-top: 1px solid var(--border, #e9ecef);
  font-size: 13px;
  color: var(--muted, #6c757d);
  text-align: center;
}

.copyright-notice i {
  color: var(--primary, #4f8cff);
  font-size: 14px;
}

.copyright-link {
  color: var(--primary, #4f8cff);
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
  transition: color 0.2s ease;
}

.copyright-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

[data-theme="dark"] .footer-brand {
  color: var(--text, #e6edf3);
}

[data-theme="dark"] .brand-name {
  color: var(--text, #e6edf3);
}

[data-theme="dark"] .brand-slogan {
  color: var(--muted, #768390);
}

[data-theme="dark"] .footer-link {
  color: var(--text, #adbac7);
}

[data-theme="dark"] .footer-link:hover {
  color: var(--primary, #4f8cff);
}

[data-theme="dark"] .footer-meta {
  color: var(--muted, #768390);
}

[data-theme="dark"] .footer-external-link {
  color: var(--muted, #768390);
}

[data-theme="dark"] .footer-external-link:hover {
  color: var(--primary, #4f8cff);
}

[data-theme="dark"] .copyright-notice {
  border-top-color: var(--border, #2d333b);
  color: var(--muted, #768390);
}

@media (max-width: 768px) {
  .footer-main {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .footer-brand {
    flex-direction: column;
    gap: 4px;
  }
  
  .brand-slogan {
    margin-left: 0;
  }
  
  .footer-links {
    justify-content: center;
  }
  
  .footer-meta {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 576px) {
  .footer-main {
    padding: 0 16px;
  }
  
  .footer-meta {
    padding: 0 16px;
    font-size: 11px;
  }
  
  .copyright-notice {
    font-size: 12px;
    padding: 10px 16px 0;
    flex-direction: column;
    gap: 4px;
  }
  
  .copyright-link {
    margin-left: 0;
  }
  
  .footer-links {
    font-size: 12px;
  }
  
  .divider {
    display: none;
  }
  
  .footer-links .footer-link:not(:last-child)::after {
    content: '·';
    margin: 0 4px;
    color: var(--muted, #adb5bd);
  }
}
</style>
