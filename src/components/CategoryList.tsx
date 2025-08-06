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
  FiLayout,
  FiPackage,
  FiActivity,
  FiGlobe,
  FiTrendingUp,
  FiCpu,
  FiDatabase,
  FiLayers,
  FiTerminal,
  FiMonitor,
  FiSettings,
  FiPenTool
} from 'react-icons/fi';

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

// 根据分类名称特征选择图标
function getCategoryIcon(category: string): IconType {
  const lowerCategory = category.toLowerCase();
  
  // 具体分类匹配
  if (lowerCategory === 'other') return FiSettings;
  if (lowerCategory === 'sassagent') return FiCpu;
  if (lowerCategory === 'ui-code') return FiMonitor;
  if (lowerCategory === 'testing') return FiActivity;
  if (lowerCategory === 'ide') return FiTerminal;
  if (lowerCategory === 'cliagent') return FiBox;
  if (lowerCategory === 'mcptool') return FiLayers;
  
  // 通用匹配规则
  if (lowerCategory.includes('ui') || lowerCategory.includes('界面')) return FiLayout;
  if (lowerCategory.includes('sass') || lowerCategory.includes('平台')) return FiCloud;
  if (lowerCategory.includes('plugin') || lowerCategory.includes('插件')) return FiPackage;
  if (lowerCategory.includes('agent') || lowerCategory.includes('代理')) return FiCpu;
  if (lowerCategory.includes('review') || lowerCategory.includes('审查')) return FiCheck;
  if (lowerCategory.includes('test') || lowerCategory.includes('测试')) return FiActivity;
  if (lowerCategory.includes('chat') || lowerCategory.includes('对话')) return FiMessageSquare;
  if (lowerCategory.includes('综合')) return FiGlobe;
  if (lowerCategory.includes('热门') || lowerCategory.includes('流行')) return FiTrendingUp;
  if (lowerCategory.includes('cli') || lowerCategory.includes('命令行')) return FiTerminal;
  if (lowerCategory.includes('ide') || lowerCategory.includes('编辑器')) return FiPenTool;
  if (lowerCategory.includes('database') || lowerCategory.includes('数据库')) return FiDatabase;
  if (lowerCategory.includes('monitor') || lowerCategory.includes('监控')) return FiMonitor;
  
  return FiCode; // 默认图标
}

// 根据分类名称选择颜色主题
function getCategoryColor(category: string): string {
  const lowerCategory = category.toLowerCase();
  
  // 具体分类颜色匹配
  if (lowerCategory === 'other') return 'from-gray-500 to-slate-600';
  if (lowerCategory === 'sassagent') return 'from-emerald-500 to-teal-600';
  if (lowerCategory === 'ui-code') return 'from-violet-500 to-purple-600';
  if (lowerCategory === 'testing') return 'from-amber-500 to-orange-600';
  if (lowerCategory === 'ide') return 'from-slate-500 to-gray-600';
  if (lowerCategory === 'cliagent') return 'from-cyan-500 to-blue-600';
  if (lowerCategory === 'mcptool') return 'from-indigo-500 to-purple-500';
  
  // 通用颜色匹配规则
  if (lowerCategory.includes('ui') || lowerCategory.includes('界面')) return 'from-purple-500 to-pink-500';
  if (lowerCategory.includes('sass') || lowerCategory.includes('平台')) return 'from-blue-500 to-cyan-500';
  if (lowerCategory.includes('plugin') || lowerCategory.includes('插件')) return 'from-green-500 to-teal-500';
  if (lowerCategory.includes('agent') || lowerCategory.includes('代理')) return 'from-emerald-500 to-green-600';
  if (lowerCategory.includes('review') || lowerCategory.includes('审查')) return 'from-indigo-500 to-purple-500';
  if (lowerCategory.includes('test') || lowerCategory.includes('测试')) return 'from-yellow-500 to-orange-500';
  if (lowerCategory.includes('chat') || lowerCategory.includes('对话')) return 'from-rose-500 to-pink-500';
  if (lowerCategory.includes('综合')) return 'from-gray-500 to-gray-600';
  if (lowerCategory.includes('热门') || lowerCategory.includes('流行')) return 'from-red-500 to-pink-500';
  if (lowerCategory.includes('cli') || lowerCategory.includes('命令行')) return 'from-slate-500 to-zinc-600';
  if (lowerCategory.includes('ide') || lowerCategory.includes('编辑器')) return 'from-blue-500 to-indigo-600';
  if (lowerCategory.includes('database') || lowerCategory.includes('数据库')) return 'from-green-500 to-emerald-600';
  if (lowerCategory.includes('monitor') || lowerCategory.includes('监控')) return 'from-orange-500 to-red-500';
  
  return 'from-blue-500 to-purple-500';
}

// 根据分类名称选择图标颜色
function getIconColor(category: string): string {
  const lowerCategory = category.toLowerCase();
  
  // 具体分类颜色匹配
  if (lowerCategory === 'other') return 'text-gray-600';
  if (lowerCategory === 'sassagent') return 'text-emerald-600';
  if (lowerCategory === 'ui-code') return 'text-violet-600';
  if (lowerCategory === 'testing') return 'text-amber-600';
  if (lowerCategory === 'ide') return 'text-slate-600';
  if (lowerCategory === 'cliagent') return 'text-cyan-600';
  if (lowerCategory === 'mcptool') return 'text-indigo-600';
  
  // 通用颜色匹配规则
  if (lowerCategory.includes('ui') || lowerCategory.includes('界面')) return 'text-purple-600';
  if (lowerCategory.includes('sass') || lowerCategory.includes('平台')) return 'text-blue-600';
  if (lowerCategory.includes('plugin') || lowerCategory.includes('插件')) return 'text-green-600';
  if (lowerCategory.includes('agent') || lowerCategory.includes('代理')) return 'text-emerald-600';
  if (lowerCategory.includes('review') || lowerCategory.includes('审查')) return 'text-indigo-600';
  if (lowerCategory.includes('test') || lowerCategory.includes('测试')) return 'text-yellow-600';
  if (lowerCategory.includes('chat') || lowerCategory.includes('对话')) return 'text-rose-600';
  if (lowerCategory.includes('综合')) return 'text-gray-600';
  if (lowerCategory.includes('热门') || lowerCategory.includes('流行')) return 'text-red-600';
  if (lowerCategory.includes('cli') || lowerCategory.includes('命令行')) return 'text-slate-600';
  if (lowerCategory.includes('ide') || lowerCategory.includes('编辑器')) return 'text-blue-600';
  if (lowerCategory.includes('database') || lowerCategory.includes('数据库')) return 'text-green-600';
  if (lowerCategory.includes('monitor') || lowerCategory.includes('监控')) return 'text-orange-600';
  
  return 'text-blue-600';
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
    <nav className="space-y-1">
      {categories.map((category, index) => {
        const Icon = getCategoryIcon(category.name);
        const categoryPath = `/category/${encodeURIComponent(category.id)}`;
        const isActive = pathname === categoryPath;
        const gradientColor = getCategoryColor(category.name);
        const iconColor = getIconColor(category.name);
        
        return (
          <div key={category.id} className="group animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
            <a
              href={categoryPath}
              onClick={(e) => handleNavigation(categoryPath, e)}
              className={`relative flex items-center p-3 rounded-xl transition-all duration-300 group-hover:scale-[1.02] transform
                ${isActive 
                  ? `bg-gradient-to-r ${gradientColor} text-white shadow-soft-lg` 
                  : 'text-gray-700 hover:bg-gray-100/80 hover:shadow-soft'
                }`}
            >
              {/* 图标背景 */}
              <div className={`relative flex items-center justify-center w-10 h-10 rounded-lg mr-3 transition-all duration-200
                ${isActive 
                  ? 'bg-white/20 backdrop-blur-sm' 
                  : 'bg-gray-100 group-hover:bg-white group-hover:shadow-soft'
                }`}>
                <Icon className={`w-5 h-5 transition-all duration-200 ${
                  isActive 
                    ? 'text-white' 
                    : `${iconColor} group-hover:text-white`
                }`} />
              </div>
              
              {/* 分类名称 */}
              <div className="flex-1 min-w-0">
                <span className={`font-medium text-base transition-all duration-200 ${
                  isActive ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'
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