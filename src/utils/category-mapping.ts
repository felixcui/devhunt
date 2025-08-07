/**
 * 分类映射工具函数
 * 基于 /category 文件中的映射关系，将分类名称标准化
 */

// 分类映射表 - 从 /category 文件中提取
export const CATEGORY_MAPPING = {
  1: { id: 'cliagent', name: '命令行工具', originalKey: 'CliAgent' },
  2: { id: 'ide', name: '开发IDE', originalKey: 'IDE' },
  3: { id: 'testing', name: 'AI测试', originalKey: 'Testing' },
  4: { id: 'devops', name: 'DevOps工具', originalKey: 'DevOps' },
  5: { id: 'extension', name: 'IDE插件', originalKey: 'Extension' },
  6: { id: 'codereview', name: '代码审查', originalKey: 'CodeReview' },
  7: { id: 'other', name: '其他工具', originalKey: 'Other' },
  8: { id: 'resource', name: '相关资源', originalKey: 'resource' },
  9: { id: 'docs', name: '文档相关', originalKey: 'Docs' },
  10: { id: 'design', name: '设计工具', originalKey: 'Design' },
  11: { id: 'ui-code', name: 'UI生成', originalKey: 'UI-Code' },
  12: { id: 'codeagent', name: 'CodeAgent', originalKey: 'CodeAgent' },
  13: { id: 'mcptool', name: 'MCP工具', originalKey: 'McpTool' }
} as const;

// 反向映射：从原始分类名称到标准化信息
const REVERSE_MAPPING = Object.values(CATEGORY_MAPPING).reduce((acc, item) => {
  // 支持多种原始分类名称的匹配
  const keys = [
    item.originalKey,
    item.originalKey.toLowerCase(),
    item.name,
    item.id
  ];
  
  keys.forEach(key => {
    acc[key] = item;
  });
  
  return acc;
}, {} as Record<string, typeof CATEGORY_MAPPING[keyof typeof CATEGORY_MAPPING]>);

/**
 * 标准化分类名称
 * @param originalCategory 原始分类名称
 * @returns 标准化后的分类信息
 */
export function normalizeCategoryName(originalCategory: string): {
  id: string;
  name: string;
  originalKey: string;
} {
  // 去除空格和特殊字符进行匹配
  const cleanCategory = originalCategory.trim();
  
  // 直接匹配
  if (REVERSE_MAPPING[cleanCategory]) {
    return REVERSE_MAPPING[cleanCategory];
  }
  
  // 不区分大小写匹配
  const lowerCategory = cleanCategory.toLowerCase();
  if (REVERSE_MAPPING[lowerCategory]) {
    return REVERSE_MAPPING[lowerCategory];
  }
  
  // 模糊匹配
  const fuzzyMatch = Object.values(CATEGORY_MAPPING).find(item => {
    const itemLower = item.originalKey.toLowerCase();
    const nameLower = item.name.toLowerCase();
    
    return itemLower.includes(lowerCategory) || 
           lowerCategory.includes(itemLower) ||
           nameLower.includes(lowerCategory) ||
           lowerCategory.includes(nameLower);
  });
  
  if (fuzzyMatch) {
    return fuzzyMatch;
  }
  
  // 如果没有匹配，归类为"其他工具"
  console.warn(`未找到分类映射: ${originalCategory}, 归类为"其他工具"`);
  return CATEGORY_MAPPING[7]; // Other
}

/**
 * 获取分类的URL友好ID
 * @param originalCategory 原始分类名称
 * @returns URL友好的分类ID
 */
export function getCategoryId(originalCategory: string): string {
  return normalizeCategoryName(originalCategory).id;
}

/**
 * 获取分类的显示名称
 * @param originalCategory 原始分类名称
 * @returns 标准化的中文显示名称
 */
export function getCategoryDisplayName(originalCategory: string): string {
  return normalizeCategoryName(originalCategory).name;
}

/**
 * 验证分类是否在映射表中
 * @param originalCategory 原始分类名称
 * @returns 是否找到匹配的映射
 */
export function isCategoryMapped(originalCategory: string): boolean {
  const normalized = normalizeCategoryName(originalCategory);
  // 如果归类为"其他工具"且原始分类不是"Other"相关，说明没有找到映射
  return !(normalized.id === 'other' && !originalCategory.toLowerCase().includes('other'));
}

/**
 * 获取所有可用的分类列表
 * @returns 所有分类的信息
 */
export function getAllCategories() {
  return Object.values(CATEGORY_MAPPING).map(item => ({
    id: item.id,
    name: item.name,
    originalKey: item.originalKey,
    description: `${item.name}相关的AI开发工具`
  }));
}