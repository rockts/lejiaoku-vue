# 生产环境部署指南

## 🌿 分支策略

**重要：** 本项目采用以下分支策略：

- **`dev` 分支**：开发分支，所有新功能和修复都在此分支完成
- **`main` 分支**：生产环境分支，只包含经过充分测试、生产就绪的代码

### 合并到 main 分支的流程

1. 在 `dev` 分支完成开发和测试
2. 确保所有功能正常工作
3. 运行 `yarn build` 确保构建成功
4. 检查代码质量（lint、测试等）
5. 创建 Pull Request 或直接合并到 `main` 分支
6. 在 `main` 分支进行最终验证后部署

**注意：** `main` 分支必须保持干净，只包含生产就绪的代码。

## 📋 部署前检查清单

### 1. 环境变量配置

- [ ] 在服务器上创建 `.env.production` 文件（参考 `.env.production.example`）
- [ ] 配置生产环境 API 地址：`VUE_APP_API_BASE_URL`
- [ ] 确认后端服务已部署并正常运行
- [ ] 检查 CORS 配置，确保后端允许前端域名访问
- [ ] **重要**：`.env.production` 文件不要提交到 git（已在 .gitignore 中）

### 2. 代码检查

- [ ] 移除所有 `console.log` 调试代码（或使用环境变量控制）
- [ ] 检查是否有硬编码的开发环境地址
- [ ] 确认所有 API 调用都使用环境变量配置的地址
- [ ] 检查错误处理是否完善

### 3. 构建优化

- [ ] 运行 `yarn build` 检查构建是否成功
- [ ] 检查 `dist` 目录文件大小，确认没有异常大的文件
- [ ] 确认静态资源路径正确（相对路径或 CDN）
- [ ] 检查 Source Map 是否需要（生产环境建议关闭）

### 4. 安全配置

- [ ] 确认 API 密钥不会暴露在前端代码中
- [ ] 检查敏感信息是否硬编码
- [ ] 确认 HTTPS 配置正确
- [ ] 检查 CSP（Content Security Policy）配置

### 5. 性能优化

- [ ] 启用 Gzip 压缩
- [ ] 配置 CDN 加速静态资源
- [ ] 检查图片是否已优化
- [ ] 确认懒加载配置正确

## 🚀 部署步骤

### 方式一：腾讯云开发部署（推荐）

项目已配置 `cloudbaserc.json`，可以使用腾讯云开发 CLI 部署：

```bash
# 1. 安装云开发 CLI
npm install -g @cloudbase/cli

# 2. 登录
tcb login

# 3. 配置环境变量（在云开发控制台或使用 CLI）
# 设置 VUE_APP_API_BASE_URL 等环境变量

# 4. 部署
tcb framework deploy
```

### 方式二：传统服务器部署

#### 1. 构建生产版本

```bash
# 安装依赖（如果还没有）
yarn install

# 构建生产版本
yarn build
```

构建完成后，`dist` 目录包含所有静态文件。

#### 2. 配置 Web 服务器

**Nginx 配置示例：**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # 启用 Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;
    
    # 静态文件目录
    root /path/to/your/dist;
    index index.html;
    
    # API 代理（如果需要）
    location /api {
        proxy_pass https://your-backend-domain.com;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 前端路由支持（Vue Router history 模式）
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Apache 配置示例：**

在 `dist` 目录创建 `.htaccess` 文件：

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# 启用 Gzip 压缩
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# 静态资源缓存
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
</IfModule>
```

#### 3. 上传文件

将 `dist` 目录中的所有文件上传到服务器。

#### 4. 配置 HTTPS（推荐）

使用 Let's Encrypt 免费 SSL 证书：

```bash
# 安装 Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com
```

## 🔧 构建优化建议

### 1. 修改 vue.config.js 添加生产环境优化

```javascript
module.exports = {
  // ... 现有配置
  
  // 生产环境关闭 Source Map（减小文件大小，提高安全性）
  productionSourceMap: false,
  
  // 构建优化
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial'
          },
          elementUI: {
            name: 'chunk-elementUI',
            priority: 20,
            test: /[\\/]node_modules[\\/]element-plus[\\/]/
          }
        }
      }
    }
  }
};
```

### 2. 添加构建脚本

在 `package.json` 中添加：

```json
{
  "scripts": {
    "build:prod": "vue-cli-service build --mode production",
    "build:analyze": "vue-cli-service build --report"
  }
}
```

## 📊 部署后验证

### 1. 功能检查

- [ ] 首页加载正常
- [ ] 用户登录/注册功能正常
- [ ] API 请求正常（检查网络请求）
- [ ] 路由跳转正常（刷新页面不 404）
- [ ] 静态资源加载正常（图片、字体等）

### 2. 性能检查

- [ ] 使用 Lighthouse 检查性能分数（目标：90+）
- [ ] 检查首屏加载时间
- [ ] 检查资源加载时间
- [ ] 检查控制台是否有错误

### 3. 兼容性检查

- [ ] Chrome/Edge 最新版本
- [ ] Firefox 最新版本
- [ ] Safari 最新版本
- [ ] 移动端浏览器

## 🐛 常见问题

### 1. 路由刷新 404

**原因：** Web 服务器未配置 history 模式支持

**解决：** 参考上面的 Nginx/Apache 配置，添加 `try_files` 或 `RewriteRule`

### 2. API 请求跨域错误

**原因：** 后端未配置 CORS 或配置不正确

**解决：** 在后端配置允许前端域名的 CORS

### 3. 静态资源 404

**原因：** 资源路径配置错误

**解决：** 检查 `vue.config.js` 中的 `publicPath` 配置

### 4. 环境变量不生效

**原因：** 环境变量必须以 `VUE_APP_` 开头

**解决：** 确认环境变量命名正确，重新构建

## 📝 维护建议

1. **定期更新依赖**：`yarn upgrade`
2. **监控错误**：集成错误监控服务（如 Sentry）
3. **性能监控**：使用 Google Analytics 或类似工具
4. **备份**：定期备份构建产物和配置文件
5. **日志**：配置访问日志和错误日志

## 🔐 安全建议

1. **HTTPS**：强制使用 HTTPS
2. **CSP**：配置内容安全策略
3. **XSS 防护**：确保所有用户输入都经过转义
4. **API 安全**：使用 Token 认证，避免在 URL 中传递敏感信息
5. **依赖安全**：定期检查依赖漏洞（`yarn audit`）

