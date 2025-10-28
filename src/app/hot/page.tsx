'use client';

import { useEffect, useState } from 'react';
import { fetchTools } from '@/data/tools';
import ToolGrid from '@/components/ToolGrid';
import { Tool } from '@/types';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

// 缓存相关常量
const CACHE_KEY = 'hot_tools_cache';
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12小时的毫秒数

// 缓存接口
interface CacheData {
  data: Tool[];
  timestamp: number;
}

// 从缓存中获取数据
function getFromCache(): Tool[] | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp }: CacheData = JSON.parse(cached);
    const now = Date.now();

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
function setToCache(data: Tool[]) {
  if (typeof window === 'undefined') return;
  
  const cacheData: CacheData = {
    data,
    timestamp: Date.now()
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
}

export default function HotToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // 加载热门工具数据
  const loadHotTools = async () => {
    try {
      const allTools = await fetchTools();
      console.log('=== 热门工具筛选调试 ===');
      console.log('获取到的工具总数:', allTools.length);
      
      // 筛选有有效标签的工具
      const toolsWithTags = allTools.filter(tool => 
        tool.tags && Array.isArray(tool.tags) && tool.tags.length > 0
      );
      console.log('有标签的工具数量:', toolsWithTags.length);
      console.log('有标签的工具:', toolsWithTags.map(tool => ({
        name: tool.name,
        tags: tool.tags
      })));
      
      // 只筛选包含"hot"标签的工具 - 严格匹配，没有就显示空
      const hotTools = allTools.filter(tool => {
        if (!tool.tags || !Array.isArray(tool.tags)) {
          return false;
        }
        return tool.tags.some(tag => {
          const lowerTag = tag.toLowerCase().trim();
          return lowerTag === 'hot';
        });
      });
      
      console.log('包含"hot"标签的工具数量:', hotTools.length);
      if (hotTools.length > 0) {
        console.log('所有包含"hot"标签的工具详情:', hotTools.map(tool => ({
          name: tool.name,
          tags: tool.tags,
          category: tool.category,
          id: tool.id
        })));
      } else {
        console.log('没有找到任何包含"hot"标签的工具');
      }
      
      // 设置工具列表 - 有就显示，没有就是空数组
      setTools(hotTools);
      if (isClient) {
        setToCache(hotTools);
      }
      
      console.log('最终显示的热门工具数量:', hotTools.length);
    } catch (error) {
      console.error('Error loading hot tools:', error);
      setTools([]); // 出错时也设置为空
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 标记为客户端环境
    setIsClient(true);
    
    // 只在客户端尝试从缓存获取数据
    const cachedData = getFromCache();
    if (cachedData) {
      setTools(cachedData);
      setLoading(false);
    } else {
      loadHotTools();
    }

    // 设置定时器，定期检查缓存是否过期
    const intervalId = setInterval(() => {
      if (!getFromCache()) {
        loadHotTools();
      }
    }, 60 * 60 * 1000); // 每60分钟检查一次

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      {/* 返回按钮 */}
      <div className="mb-8">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:bg-gray-100 px-3 py-2 rounded-lg"
        >
          <FiArrowLeft className="w-4 h-4" />
          返回首页
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">热门工具</h1>
        <p className="text-gray-600">精选推荐的AI研发工具</p>
      </div>
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
        </div>
      ) : tools.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">暂无热门工具</p>
        </div>
      ) : (
        <ToolGrid tools={tools} from="hot" />
      )}
    </div>
  );
}