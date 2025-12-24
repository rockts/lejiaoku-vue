# Contributing to LeJiaoKu

感谢你的贡献！为确保长期可维护与用户体验一致性，请在编码前阅读并严格遵守以下文档：

1. `docs/for-agent/blueprint-for-agent.md`
2. `docs/for-agent/frontend-rules-for-agent.md`

## 开发约束（摘要）

- 分类语义：仅使用“教学用途（Category）”作为主分类；文件格式（PPT/PDF/DOC/图片/视频）仅用于信息展示
- 筛选与搜索：筛选状态集中管理、即时生效、URL 参数与状态一致
- 组件设计：页面负责布局；组件职责单一；复杂逻辑拆分为 composable/hooks
- 首页主入口：搜索框唯一主入口，不新增并列入口

## 代码检查

本仓库提供 for-agent 规则检查脚本：

```zsh
yarn check:for-agent
```

提交前的预提交钩子会自动执行 ESLint 与 for-agent 检查。

## 提交规范

- 使用 PR 模板并完成自检清单
- 说明与蓝图、前端规则的对应关系
- 尽量提供自测步骤与影响范围

