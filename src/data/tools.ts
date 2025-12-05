import { Tool, Category, News } from '@/types';
import { normalizeCategoryName, getAllCategories, CATEGORY_MAPPING } from '@/utils/category-mapping';

function getBaseUrl() {
  // 1) 显式配置优先
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  // 2) Vercel 运行时域名（服务端）
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  // 3) Vercel 公开变量（构建/客户端可用）
  if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  // 4) 浏览器端自动取当前站点
  if (typeof window !== 'undefined') return window.location.origin;
  // 5) 本地或其他环境回退
  return 'http://localhost:3000';
}

export async function fetchTools(): Promise<Tool[]> {
  try {
    const baseUrl = getBaseUrl();
    
    console.log('Fetching tools from:', `${baseUrl}/api/tools`);
    
    const response = await fetch(`${baseUrl}/api/tools`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.error('API Error Response:', 'Status:', response.status, 'StatusText:', response.statusText, 'URL:', response.url);
      
      const errorText = await response.text();
      console.error('Error Response Body:', errorText);
      throw new Error(`Failed to fetch tools: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data.items;
  } catch (error) {
    console.error('Error fetching tools:', error);
    return [];
  }
}

export async function fetchNews(): Promise<News[]> {
  try {
    const baseUrl = getBaseUrl();
    
    console.log('Fetching news from:', `${baseUrl}/api/news`);
    
    const response = await fetch(`${baseUrl}/api/news`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.error('News API Error Response:', 'Status:', response.status, 'StatusText:', response.statusText, 'URL:', response.url);
      
      const errorText = await response.text();
      console.error('News Error Response Body:', errorText);
      throw new Error(`Failed to fetch news: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data.items;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const tools = await fetchTools();
    
    // 从工具数据中提取分类，并应用映射表进行标准化
    const categoryMap = new Map<string, { name: string; originalKey: string; count: number }>();
    
    tools.forEach(tool => {
      if (tool.category) {
        const normalized = normalizeCategoryName(tool.category);
        const key = normalized.id;
        
        if (categoryMap.has(key)) {
          categoryMap.get(key)!.count++;
        } else {
          categoryMap.set(key, {
            name: normalized.name,
            originalKey: normalized.originalKey,
            count: 1
          });
        }
      }
    });
    
    // 转换为Category格式
    const categories: Category[] = Array.from(categoryMap.entries()).map(([id, info]) => {
      // 确定图标类型
      let icon: Category['icon'] = 'code';
      const lowerName = info.name.toLowerCase();
      
      if (lowerName.includes('入门') || id === 'vibetool') icon = 'star';
      if (lowerName.includes('命令行') || id === 'cliagent') icon = 'terminal';
      if (lowerName.includes('ide') || id === 'ide') icon = 'code';
      if (lowerName.includes('测试') || id === 'testing') icon = 'test';
      if (lowerName.includes('devops') || id === 'devops') icon = 'cloud';
      if (lowerName.includes('插件') || id === 'extension') icon = 'plugin';
      if (lowerName.includes('审查') || id === 'codereview') icon = 'review';
      if (lowerName.includes('设计') || id === 'design') icon = 'web';
      if (lowerName.includes('ui') || id === 'ui-code') icon = 'web';
      if (lowerName.includes('agent') || id === 'codeagent') icon = 'robot';
      if (lowerName.includes('mcp') || id === 'mcptool') icon = 'cloud';
      if (lowerName.includes('文档') || id === 'docs') icon = 'code';
      if (lowerName.includes('资源') || id === 'resource') icon = 'cloud';
      
      return {
        id,
        name: info.name,
        description: `${info.name}相关的AI开发工具（${info.count}个）`,
        icon
      };
    });
    
    // 按分类映射表的顺序排序，确保VibeTool在最前面
    const categoryOrder = Object.values(CATEGORY_MAPPING).reduce((acc, item, index) => {
      acc[item.id] = index;
      return acc;
    }, {} as Record<string, number>);
    
    categories.sort((a, b) => {
      const orderA = categoryOrder[a.id] ?? 999;
      const orderB = categoryOrder[b.id] ?? 999;
      return orderA - orderB;
    });
    
    // 添加调试信息
    if (process.env.NODE_ENV === 'development') {
      console.log('Categories mapping result - Total:', categories.length);
      console.log('Categories:', categories.map(c => `${c.id}: ${c.name}`).join(', '));
    }
    
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    
    // 出错时返回所有预定义分类
    return getAllCategories().map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      icon: 'code' as const
    }));
  }
}