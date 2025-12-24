/**
 * 应用常量定义
 */

/**
 * 资源分类列表（静态数据）
 * 统一使用 Resource.category 字段，不再依赖 /classifications 接口
 */
export const RESOURCE_CATEGORIES = [
  '教材',
  '课件',
  '教案',
  '习题',
  '教辅',
  '其他'
] as const;

export type ResourceCategory = typeof RESOURCE_CATEGORIES[number];
