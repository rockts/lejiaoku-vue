# 乐教库 (LeJiaoKu) - 前端项目

乐教库是一个现代化的教育资源共享平台，致力于为教师提供便捷的课件、教案、试题等教学资源分享与下载服务。本项目基于 Vue 3 + TypeScript 开发。

## ✨ 核心特性

- **现代化 UI 设计**：清爽的教育风格，支持**深色模式**自动适配。
- **智能资源上传**：
  - 支持拖拽上传。
  - **AI 自动识别**：上传文件后自动识别教材版本、学科、年级等元数据。
  - 教材结构化绑定。
- **强大的搜索与筛选**：
  - 首页 Hero 搜索区，支持关键词即时搜索。
  - 多维度筛选（学科、年级、类型）。
  - 动态顶部导航栏搜索（非首页自动显示）。
- **资源管理**：
  - 用户中心：查看我上传的资源及审核状态。
  - 管理后台：资源审核工作流。
- **完善的法律合规**：内置本地化的用户协议与隐私政策页面。

## 🛠 技术栈

- **框架**: Vue 3
- **语言**: TypeScript
- **样式**: CSS Variables (Theme), Bootstrap 4, Bootstrap Icons
- **构建**: Vue CLI
- **HTTP**: Axios

## 🚀 快速开始

### 1. 环境准备

确保本地已安装 Node.js 和 Yarn。

### 2. 安装依赖

```bash
yarn install
```

### 3. 启动开发服务器

```bash
yarn serve
```

- 前端地址: `http://localhost:8080`
- 后端接口代理: `http://localhost:3000` (请确保后端服务已启动)

### 4. 构建生产版本

```bash
yarn build
```

## 📂 目录结构

```
src/
├── admin/          # 管理后台页面
├── app/            # 核心应用逻辑 (布局, 全局组件, 样式)
├── classifications/# 分类相关
├── post/           # 资源(Post)相关 (列表, 详情, 创建)
├── user/           # 用户相关 (登录, 注册, 个人中心)
└── utils/          # 工具函数
```

## 📝 配置说明

配置文件位于 `vue.config.js` 和 `.env.development`。

- **后端端口**: 默认为 `3000`。如需更改，请同步修改 `.env.development` 中的 `VUE_APP_API_BASE_URL` 和 `vue.config.js` 中的 proxy 配置。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
