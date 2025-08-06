'use client';

import { useEffect, useState } from 'react';
import { fetchTools } from '@/data/tools';
import ToolGrid from '@/components/ToolGrid';
import { Tool } from '@/types';

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

  // 加载热门工具数据
  const loadHotTools = async () => {
    try {
      const allTools = await fetchTools();
      console.log('所有工具数据:', allTools);
      console.log('第一个工具的tags:', allTools[0]?.tags);
      console.log('工具总数:', allTools.length);
      
      // 方案1: 如果有hot标签的工具
      let hotTools = allTools.filter(tool => 
        tool.tags && 
        Array.isArray(tool.tags) && 
        tool.tags.some(tag => tag.toLowerCase() === 'hot')
      );
      
      // 方案2: 如果没有hot标签，使用前8个工具作为热门工具
      if (hotTools.length === 0) {
        console.log('没有找到hot标签的工具，使用前8个工具作为热门工具');
        hotTools = allTools.slice(0, 8);
      }
      
      console.log('最终热门工具:', hotTools);
      console.log('热门工具数量:', hotTools.length);
      
      setTools(hotTools);
      setToCache(hotTools);
    } catch (error) {
      console.error('Error loading hot tools:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 首先尝试从缓存获取数据
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
        <ToolGrid tools={tools} />
      )}
    </div>
  );
} 