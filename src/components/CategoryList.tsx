'use client';

import { useEffect, useState } from 'react';
import { fetchCategories } from '@/data/tools';
import { Category } from '@/types';
import { useRouter, usePathname } from 'next/navigation';
import { getCategoryIconConfig } from '@/utils/category-icons';

// 缓存相关常量
const CACHE_KEY = 'categories_cache';
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12小时的毫秒数

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

// 根据分类名称获取图标配置
function getCategoryStyleConfig(category: string) {
  return getCategoryIconConfig(category);
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 首先尝试从缓存获取数据
    const cachedData = getFromCache();
    if (cachedData) {
      setCategories(cachedData);
      setLoading(false);
    } else {
      loadCategories();
    }
  }, []);

  const handleNavigation = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    
    // 使用 scroll: false 选项阻止自动滚动
    router.push(path, undefined, { scroll: false });
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex items-center p-3 rounded-xl">
            <div className="w-10 h-10 bg-gray-200 rounded-lg shimmer mr-3"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <nav className="space-y-0.5">
      {categories.map((category, index) => {
        const iconConfig = getCategoryStyleConfig(category.name);
        const Icon = iconConfig.icon;
        const categoryPath = `/category/${encodeURIComponent(category.id)}`;
        const isActive = pathname === categoryPath;
        
        const baseClasses = "relative flex items-center p-2 rounded-xl transition-all duration-300 transform hover:scale-[1.02]";
        const activeClasses = "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-soft-lg";
        const inactiveClasses = "text-gray-700";
        
        return (
          <div key={category.id} className="group animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
            <a
              href={categoryPath}
              onClick={(e) => handleNavigation(categoryPath, e)}
              className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}

            >
              {/* 图标背景 - 根据分类使用不同颜色 */}
              <div className={`relative flex items-center justify-center w-8 h-8 rounded-lg mr-3 transition-all duration-200
                ${isActive 
                  ? 'bg-white/20 backdrop-blur-sm' 
                  : `${iconConfig.light}`
                }`}>
                <Icon className={`w-4 h-4 transition-all duration-200 ${isActive ? 'text-white' : 'text-gray-600'}`} />
              </div>
              
              {/* 分类名称 */}
              <div className="flex-1 min-w-0">
                <span className={`font-medium text-base transition-all duration-200 ${
                  isActive ? 'text-white' : 'text-gray-700'
                }`}>
                  {category.name}
                </span>
              </div>

              {/* 活跃状态指示器 */}
              {isActive && (
                <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}

              {/* hover时的右箭头 */}
              <div className={`transition-all duration-200 ${
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          </div>
        );
      })}
    </nav>
  );
} 