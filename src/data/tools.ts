import { Tool, Category, News } from '@/types';

export async function fetchTools(): Promise<Tool[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || window.location.origin;
    const response = await fetch(`${baseUrl}/api/tools`);
    if (!response.ok) {
      throw new Error('Failed to fetch tools');
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
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || window.location.origin;
    const response = await fetch(`${baseUrl}/api/news`);
    if (!response.ok) {
      throw new Error('Failed to fetch news');
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
    
    // 从工具数据中提取唯一的分类
    const categories = Array.from(new Set(tools.map(tool => tool.category)))
      .map(categoryName => {
        // 生成分类ID（将分类名转换为URL友好的格式）
        const id = categoryName.toLowerCase().replace(/\s+/g, '-');
        
        // 根据分类名生成描述
        const description = `${categoryName}相关的AI开发工具`;
        
        // 确定图标类型
        let icon: Category['icon'] = 'code';
        if (categoryName.toLowerCase().includes('chat')) icon = 'chat';
        if (categoryName.toLowerCase().includes('agent')) icon = 'robot';
        if (categoryName.toLowerCase().includes('review')) icon = 'review';
        if (categoryName.toLowerCase().includes('sass')) icon = 'cloud';
        if (categoryName.toLowerCase().includes('plugin')) icon = 'plugin';
        if (categoryName.toLowerCase().includes('test')) icon = 'test';
        if (categoryName.toLowerCase().includes('ui')) icon = 'web';
        
        return {
          id,
          name: categoryName,
          description,
          icon
        };
      });
    
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
} 