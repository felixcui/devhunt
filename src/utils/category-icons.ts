/**
 * 分类图标配置工具
 * 为不同工具分类提供独特的图标和颜色方案
 */

import { IconType } from 'react-icons';
import {
  FiCode,
  FiTerminal,
  FiActivity,
  FiCloud,
  FiPackage,
  FiCheck,
  FiLayout,
  FiCpu,
  FiLayers,
  FiSettings,
  FiPenTool,
  FiFileText,
  FiGlobe,
  FiStar
} from 'react-icons/fi';

// 分类图标配置接口
export interface CategoryIconConfig {
  icon: IconType;
  gradient: string;
  solid: string;
  light: string;
  name: string;
}

// 分类图标映射表
const CATEGORY_ICON_MAP: Record<string, CategoryIconConfig> = {
  // 入门工具 - 金色系
  vibetool: {
    icon: FiStar,
    gradient: 'from-yellow-500 to-orange-500',
    solid: 'bg-yellow-500',
    light: 'bg-yellow-100',
    name: '入门工具'
  },

    // 开发IDE - 紫色系
  ide: {
    icon: FiCode,
    gradient: 'from-purple-600 to-pink-600',
    solid: 'bg-purple-600',
    light: 'bg-purple-100',
    name: '开发IDE'
  },
  
  // 命令行工具 - 深蓝色系
  cliagent: {
    icon: FiTerminal,
    gradient: 'from-blue-600 to-indigo-600',
    solid: 'bg-blue-600',
    light: 'bg-blue-100',
    name: '命令行工具'
  },

  
  // AI测试 - 绿色系
  testing: {
    icon: FiActivity,
    gradient: 'from-green-600 to-emerald-600',
    solid: 'bg-green-600',
    light: 'bg-green-100',
    name: 'AI测试'
  },
  
  // DevOps工具 - 橙色系
  devops: {
    icon: FiCloud,
    gradient: 'from-orange-600 to-red-600',
    solid: 'bg-orange-600',
    light: 'bg-orange-100',
    name: 'DevOps工具'
  },
  
  // IDE插件 - 青色系
  extension: {
    icon: FiPackage,
    gradient: 'from-cyan-600 to-teal-600',
    solid: 'bg-cyan-600',
    light: 'bg-cyan-100',
    name: 'IDE插件'
  },
  
  // 代码审查 - 粉色系
  codereview: {
    icon: FiCheck,
    gradient: 'from-pink-600 to-rose-600',
    solid: 'bg-pink-600',
    light: 'bg-pink-100',
    name: '代码审查'
  },
  
  // 设计工具 - 黄色系
  design: {
    icon: FiPenTool,
    gradient: 'from-yellow-600 to-amber-600',
    solid: 'bg-yellow-600',
    light: 'bg-yellow-100',
    name: '设计工具'
  },
  
  // UI生成 - 蓝绿色系
  'ui-code': {
    icon: FiLayout,
    gradient: 'from-teal-600 to-cyan-600',
    solid: 'bg-teal-600',
    light: 'bg-teal-100',
    name: 'UI生成'
  },
  
  // CodeAgent - 深紫色系
  codeagent: {
    icon: FiCpu,
    gradient: 'from-violet-600 to-purple-600',
    solid: 'bg-violet-600',
    light: 'bg-violet-100',
    name: 'CodeAgent'
  },
  
  // MCP工具 - 靛蓝色系
  mcptool: {
    icon: FiLayers,
    gradient: 'from-indigo-600 to-blue-600',
    solid: 'bg-indigo-600',
    light: 'bg-indigo-100',
    name: 'MCP工具'
  },
  
  // 文档相关 - 灰色系
  docs: {
    icon: FiFileText,
    gradient: 'from-gray-600 to-slate-600',
    solid: 'bg-gray-600',
    light: 'bg-gray-100',
    name: '文档相关'
  },
  
  // 相关资源 - 石板色系
  resource: {
    icon: FiGlobe,
    gradient: 'from-slate-600 to-gray-600',
    solid: 'bg-slate-600',
    light: 'bg-slate-100',
    name: '相关资源'
  },
  
  // 其他工具 - 默认蓝色系
  other: {
    icon: FiSettings,
    gradient: 'from-blue-500 to-blue-600',
    solid: 'bg-blue-500',
    light: 'bg-blue-100',
    name: '其他工具'
  }
};

// 模糊匹配映射
const FUZZY_MATCH_MAP: Record<string, string> = {
  // 英文关键词匹配
  'vibe': 'vibetool',
  'beginner': 'vibetool',
  'starter': 'vibetool',
  'entry': 'vibetool',
  
  'cli': 'cliagent',
  'command': 'cliagent',
  'terminal': 'cliagent',
  'shell': 'cliagent',
  
  'ide': 'ide',
  'editor': 'ide',
  'vscode': 'ide',
  'intellij': 'ide',
  
  'test': 'testing',
  'testing': 'testing',
  'qa': 'testing',
  'quality': 'testing',
  
  'devops': 'devops',
  'deploy': 'devops',
  'ci': 'devops',
  'cd': 'devops',
  'pipeline': 'devops',
  
  'plugin': 'extension',
  'extension': 'extension',
  'addon': 'extension',
  
  'review': 'codereview',
  'code review': 'codereview',
  'audit': 'codereview',
  
  'design': 'design',
  'ui': 'design',
  'ux': 'design',
  'figma': 'design',
  
  'ui code': 'ui-code',
  'ui-code': 'ui-code',
  'interface': 'ui-code',
  
  'agent': 'codeagent',
  'ai agent': 'codeagent',
  'assistant': 'codeagent',
  
  'mcp': 'mcptool',
  'mcp tool': 'mcptool',
  
  'doc': 'docs',
  'documentation': 'docs',
  'readme': 'docs',
  
  'resource': 'resource',
  'resources': 'resource',
  
  // 中文关键词匹配
  '入门': 'vibetool',
  '新手': 'vibetool',
  '初学': 'vibetool',
  '基础': 'vibetool',
  
  '命令行': 'cliagent',
  '终端': 'cliagent',
  '控制台': 'cliagent',
  
  '开发': 'ide',
  '编辑器': 'ide',
  '集成': 'ide',
  
  '测试': 'testing',
  '质量': 'testing',
  '验证': 'testing',
  
  '运维': 'devops',
  '部署': 'devops',
  '自动化': 'devops',
  
  '插件': 'extension',
  '扩展': 'extension',
  
  '审查': 'codereview',
  '审核': 'codereview',
  '检查': 'codereview',
  
  '设计': 'design',
  '界面': 'design',
  '交互': 'design',
  
  '生成': 'ui-code',
  '界面生成': 'ui-code',
  
  '代理': 'codeagent',
  '智能代理': 'codeagent',
  
  '文档': 'docs',
  '说明': 'docs',
  '指南': 'docs',
  
  '资源': 'resource',
  '素材': 'resource',
  '工具': 'resource'
};

/**
 * 获取分类图标配置
 * @param category 分类名称
 * @returns 图标配置
 */
export function getCategoryIconConfig(category: string): CategoryIconConfig {
  if (!category) {
    return CATEGORY_ICON_MAP.other;
  }
  
  const normalizedCategory = category.toLowerCase().trim();
  
  // 直接匹配
  if (CATEGORY_ICON_MAP[normalizedCategory]) {
    return CATEGORY_ICON_MAP[normalizedCategory];
  }
  
  // 模糊匹配
  for (const [keyword, categoryId] of Object.entries(FUZZY_MATCH_MAP)) {
    if (normalizedCategory.includes(keyword)) {
      return CATEGORY_ICON_MAP[categoryId];
    }
  }
  
  // 按关键词匹配
  const keywords = normalizedCategory.split(/[\s\-_]/);
  for (const keyword of keywords) {
    if (keyword.length > 2) {
      for (const [matchKey, categoryId] of Object.entries(FUZZY_MATCH_MAP)) {
        if (keyword.includes(matchKey) || matchKey.includes(keyword)) {
          return CATEGORY_ICON_MAP[categoryId];
        }
      }
    }
  }
  
  // 默认返回其他工具
  return CATEGORY_ICON_MAP.other;
}

/**
 * 获取所有可用的分类图标配置
 * @returns 所有分类图标配置
 */
export function getAllCategoryIconConfigs(): CategoryIconConfig[] {
  return Object.values(CATEGORY_ICON_MAP);
}

/**
 * 根据分类ID获取图标配置
 * @param categoryId 分类ID
 * @returns 图标配置
 */
export function getCategoryIconConfigById(categoryId: string): CategoryIconConfig | undefined {
  return CATEGORY_ICON_MAP[categoryId];
}

/**
 * 获取分类的CSS类名
 * @param category 分类名称
 * @param type 类型 ('gradient' | 'solid' | 'light')
 * @returns CSS类名
 */
export function getCategoryIconClass(category: string, type: 'gradient' | 'solid' | 'light' = 'gradient'): string {
  const config = getCategoryIconConfig(category);
  return config[type];
}