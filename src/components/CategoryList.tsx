'use client';

import { useEffect, useState } from 'react';
import { fetchCategories } from '@/data/tools';
import { Category} from '@/types';

import { useRouter, usePathname } from 'next/navigation';
import { IconType } from 'react-icons';
import { 
  FiMessageSquare, 
  FiCode, 
  FiCheck, 
  FiCloud,
  FiBox,
  FiTerminal,
  FiLayout,
  FiPackage,
  FiActivity,
  FiGlobe,
  FiTrendingUp
} from 'react-icons/fi';

// 根据分类名称特征选择图标
function getCategoryIcon(category: string): IconType {
  const lowerCategory = category.toLowerCase();
  
  if (lowerCategory.includes('ui') || lowerCategory.includes('界面')) return FiLayout;
  if (lowerCategory.includes('sass') || lowerCategory.includes('平台')) return FiCloud;
  if (lowerCategory.includes('plugin') || lowerCategory.includes('插件')) return FiPackage;
  if (lowerCategory.includes('agent') || lowerCategory.includes('代理')) return FiBox;
  if (lowerCategory.includes('review') || lowerCategory.includes('审查')) return FiCheck;
  if (lowerCategory.includes('test') || lowerCategory.includes('测试')) return FiActivity;
  if (lowerCategory.includes('chat') || lowerCategory.includes('对话')) return FiMessageSquare;
  if (lowerCategory.includes('综合')) return FiGlobe;
  
  return FiCode; // 默认图标
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const handleNavigation = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    router.push(path);
  };
  
  return (
    <nav className="flex flex-col space-y-0.5">
      <a
        href="/hot"
        onClick={(e) => handleNavigation('/hot', e)}
        className={`flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors
          ${pathname === '/hot' ? 'bg-gray-100 text-blue-600' : 'text-gray-700'}`}
      >
        <FiTrendingUp className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
        <span>热门工具</span>
      </a>

      {categories.map((category) => {
        const Icon = getCategoryIcon(category.name);
        const categoryPath = `/category/${encodeURIComponent(category.id)}`;
        
        return (
          <a
            key={category.id}
            href={categoryPath}
            onClick={(e) => handleNavigation(categoryPath, e)}
            className={`flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors
              ${pathname === categoryPath ? 'bg-gray-100 text-blue-600' : 'text-gray-700'}`}
          >
            <Icon className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
            <span>{category.name}</span>
          </a>
        );
      })}
    </nav>
  );
} 