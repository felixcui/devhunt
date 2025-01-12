'use client';

import { useEffect, useState } from 'react';
import { fetchCategories } from '@/data/tools';
import { Category } from '@/types';
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
  FiGlobe
} from 'react-icons/fi';

// 缓存相关常量
const CACHE_KEY = 'categories_cache';
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 1小时的毫秒数

// 缓存接口
interface CacheData {
  data: Category[];
  timestamp: number;
}

// 从缓存中获取数据
function getFromCache(): Category[] | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp }: CacheData = JSON.parse(cached);
    const now = Date.now();

    // 检查缓存是否过期
    if (now - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

// 将数据存入缓存
function setToCache(data: Category[]) {
  if (typeof window === 'undefined') return;
  
  const cacheData: CacheData = {
    data,
    timestamp: Date.now()
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
}

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

  // 加载分类数据
  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
      setToCache(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  useEffect(() => {
    // 首先尝试从缓存获取数据
    const cachedData = getFromCache();
    if (cachedData) {
      setCategories(cachedData);
    } else {
      loadCategories();
    }

    // 设置定时器，定期检查缓存是否过期
    const intervalId = setInterval(() => {
      if (!getFromCache()) {
        loadCategories();
      }
    }, 60 * 60 * 1000); // 每60分钟检查一次

    return () => clearInterval(intervalId);
  }, []);

  const handleNavigation = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    router.push(path);
  };
  
  return (
    <nav className="flex flex-col space-y-0">
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