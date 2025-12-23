 Agent 开发说明

在开始任何开发前，必须完整阅读：

1. blueprint-for-agent.md
2. frontend-rules-for-agent.md

不允许跳过蓝图直接写代码。

---

## 修改记录

### 2025-12-23

**重构：移除文件格式筛选，符合教学语义规范**

修改文件：
- `src/app/components/Home.vue`
- `src/app/components/SearchBar.vue`
- `src/app/components/ActiveFilters.vue`

变更内容：
1. 移除 `filterState.formats` 筛选条件
2. 删除 SearchBar 中的"文件格式"筛选器
3. 文件格式仅保留在 ResourceCard 上作为信息展示
4. 严格区分：教学用途(Category) 用于筛选 / 文件格式(FileFormat) 仅作展示

符合规范：
- ✅ blueprint-for-agent.md 第三章：资源语义模型
- ✅ frontend-rules-for-agent.md 第三章：分类语义不可混用