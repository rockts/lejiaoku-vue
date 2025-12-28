# 乐教库现代化首页重构 - 技术架构文档

## 一、架构概览

### 核心设计理念
- ✅ 搜索驱动的教育资源发现体验
- ✅ 标签化即时筛选，零页面跳转
- ✅ 内容流优先，分类导航辅助
- ✅ 响应式设计，移动端友好

## 二、组件架构

### 1. 首页主组件 (Home.vue)
**职责**: 状态管理中枢，资源数据源

**核心状态**:
```javascript
filterState = {
  keyword: '',      // 关键词搜索
  subjects: [],     // 学科筛选 ['语文', '数学']
  grades: [],       // 年级筛选 ['一年级', '三年级']
  types: []         // 类型筛选 ['PPT', '教案']
}
```

**计算属性**:
- `filteredResources`: 实时过滤资源，响应任何筛选条件变化

**数据流**:
```
用户交互 → 子组件 emit → Home 更新 filterState → computed 重算 → 子组件响应
```

### 2. 搜索栏组件 (SearchBar.vue)
**功能**: Hero 区域，包含主搜索框 + 标签筛选器

**特性**:
- 大标题 Slogan："探索·创造·合作"
- 即时搜索输入框（双向绑定 keyword）
- 集成 3 个 TagFilter 子组件（学科/年级/类型）

### 3. 标签筛选器 (TagFilter.vue)
**功能**: 可复选的 Tag Pills

**交互逻辑**:
```javascript
toggle(opt) {
  const next = this.selected.includes(opt)
    ? this.selected.filter(o => o !== opt)  // 取消选中
    : [...this.selected, opt];               // 添加选中
  this.$emit('update:selected', next);
}
```

**样式特点**:
- 圆角胶囊设计 (border-radius: 999px)
- 激活态蓝色高亮
- Hover 边框提示

### 4. 分类导航 (CategoryNav.vue)
**功能**: Icon + 文字的分类快捷入口

**交互**:
- 点击切换类型筛选
- 支持多选
- Hover 上浮动画 (translateY)

**分类列表**:
| Icon | 类型 | 映射值 |
| ---- | ---- | ------ |
| 🎞    | 课件 | PPT    |
| ✏️    | 教案 | 教案   |
| ❓    | 习题 | 试题   |
| 📘    | 文档 | PDF    |

### 5. 资源列表 (ResourceList.vue)
**功能**: 多区块资源流展示

**三大区块**:
1. **最新上传**: 按 createdAt 降序
2. **下载最多**: 按 downloads 降序
3. **推荐资源**: 优先显示 recommended 标记

**计算逻辑**:
```javascript
latest() {
  return [...this.resources]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 8);
}
```

**响应式布局**:
```css
.grid {
  grid-template-columns: repeat(4, 1fr);  /* PC 4列 */
}
@media (max-width: 992px) {
  grid-template-columns: repeat(2, 1fr);  /* 平板 2列 */
}
@media (max-width: 576px) {
  grid-template-columns: repeat(1, 1fr);  /* 手机 1列 */
}
```

### 6. 资源卡片 (ResourceCard.vue)
**功能**: 单个资源的卡片展示

**内容结构**:
- 标题 (title)
- 类型徽章 (type badge)
- 学科 + 年级 (subject · grade)
- 下载量 (downloads)
- 操作按钮 (预览 / 下载)

**交互效果**:
- Hover 上浮 2px
- 阴影加深
- 点击卡片 = 预览
- 按钮有独立事件 (stop propagation)

## 三、筛选逻辑实现

### 单一数据源原则
所有筛选条件存储在 `Home.vue` 的 `filterState` 中，避免状态分散。

### 即时过滤算法
```javascript
filteredResources() {
  const k = this.filterState.keyword.toLowerCase();
  const s = this.filterState.subjects;
  const g = this.filterState.grades;
  const t = this.filterState.types;
  
  return this.resources.filter(r => {
    const byK = !k || r.title.toLowerCase().includes(k);
    const byS = !s.length || s.includes(r.subject);
    const byG = !g.length || g.includes(r.grade);
    const byT = !t.length || t.includes(r.type);
    return byK && byS && byG && byT;
  });
}
```

**逻辑说明**:
- 空条件 = 不过滤（显示全部）
- 多条件 = AND 关系（同时满足）
- 同类多选 = OR 关系（满足其一）

### 零刷新体验
- 使用 Vue 的响应式系统
- computed 自动重算
- 无需手动 API 调用
- 无需路由跳转

## 四、样式系统

### 主题变量 (CSS Variables)
```css
:root {
  --primary: #4f8cff;           /* 主色 - 蓝 */
  --primary-2: #9b7bff;         /* 辅色 - 紫 */
  --surface: rgba(255,255,255,0.6);  /* 毛玻璃 */
  --shadow: 0 8px 24px rgba(16,24,40,0.12);
}
```

### 设计规范
- **边框圆角**: 12px (卡片/按钮), 16px (大容器)
- **间距**: 8px 基础单位，倍数递增
- **过渡动画**: 160ms ease (标准), 300ms (复杂)
- **阴影层级**: 
  - 卡片静态: 0 8px 24px
  - 卡片 hover: 0 12px 32px
  - 主容器: blur(14px) 毛玻璃

### 毛玻璃效果
```css
backdrop-filter: saturate(180%) blur(14px);
-webkit-backdrop-filter: saturate(180%) blur(14px);
```

### 暗色模式支持
通过 `[data-theme="dark"]` 切换配色方案，所有组件自动适配。

## 五、数据 Mock 示例

```javascript
resources: [
  {
    id: 1,
    title: '三年级数学上册第一单元课件',
    type: 'PPT',
    subject: '数学',
    grade: '三年级',
    downloads: 230,
    createdAt: Date.now() - 3600e3,
    recommended: true  // 推荐标记
  },
  // ... 更多资源
]
```

## 六、可扩展性设计

### 1. 新增筛选维度
在 `filterState` 中添加字段，如:
```javascript
filterState: {
  // ... 现有字段
  difficulty: [],  // 难度
  region: []       // 地区教材版本
}
```

### 2. 接入真实 API
替换 `Home.vue` 的 `resources` data 为:
```javascript
async created() {
  const res = await apiHttpClient.get('/resources');
  this.resources = res.data;
}
```

### 3. 添加新区块
在 `ResourceList.vue` 中新增 section:
```vue
<div class="section">
  <div class="section-title">本周热门</div>
  <div class="grid">
    <ResourceCard v-for="r in weekly" :key="r.id" :item="r" />
  </div>
</div>
```

### 4. 智能推荐
未来可集成推荐算法:
```javascript
recommended() {
  // 当前: 静态 recommended 标记
  // 未来: 基于用户行为 / 协同过滤
  return await fetchRecommended(this.user.id);
}
```

## 七、性能优化

### 已实现
- ✅ computed 缓存过滤结果
- ✅ 列表使用 :key 绑定
- ✅ CSS 硬件加速 (transform)

### 可优化点
- [ ] 虚拟滚动 (资源数 > 1000)
- [ ] 图片懒加载
- [ ] 防抖搜索输入 (debounce 300ms)
- [ ] 分页加载 (当前显示全部)

## 八、运行说明

### 开发环境
```bash
npm install --legacy-peer-deps
npm run serve
```

### 生产构建
```bash
npm run build
```

### 环境配置
- 开发: `.env.development` → API: http://localhost:3000
- 生产: `.env.production` → API: https://api.lejiaoku.com

## 九、技术栈

| 类别 | 技术                            |
| ---- | ------------------------------- |
| 框架 | Vue 3.2.13                      |
| 路由 | Vue Router 4.0.14               |
| 状态 | Vuex 4.0 (未使用，状态在组件内) |
| UI   | Bootstrap 4.6.0                 |
| 图标 | Bootstrap Icons + Emoji         |
| HTTP | Axios 0.21.1                    |

## 十、关键文件清单

```
src/
├── app/
│   ├── components/
│   │   ├── Home.vue              # 首页主组件 (状态中枢)
│   │   ├── SearchBar.vue         # Hero 搜索区
│   │   ├── TagFilter.vue         # 标签筛选器
│   │   ├── CategoryNav.vue       # 分类导航
│   │   ├── ResourceList.vue      # 资源流容器
│   │   ├── ResourceCard.vue      # 资源卡片
│   │   ├── GlobalHeader.vue      # 顶部导航
│   │   └── GlobalFooter.vue      # 页脚
│   └── styles/
│       └── app.css               # 全局样式 + 主题变量
├── main.ts                       # 入口文件
└── app.router.ts                 # 路由配置
```

## 十一、使用示例

### 用户场景 1: 搜索三年级数学课件
1. 输入框输入 "数学"
2. 点击学科 Tag: "数学"
3. 点击年级 Tag: "三年级"
4. 点击分类导航: "课件 (🎞)"
5. 实时显示过滤结果，无需刷新

### 用户场景 2: 浏览最新资源
1. 打开首页
2. 滚动到 "最新上传" 区块
3. 查看最新 8 条资源
4. 点击卡片预览或下载

### 用户场景 3: 上传资源
1. 滚动到底部 CTA 区
2. 点击 "上传资源"
3. 跳转到 `/posts/create`

---

**版本**: 0.2.0  
**更新日期**: 2025-12-18  
**维护者**: 前端工程团队
