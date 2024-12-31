'use client';

import { useEffect, useState } from 'react';
import RootLayout from '@/components/RootLayout';
import { News } from '@/types';

// 缓存相关常量
const CACHE_KEY = 'news_cache';
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12小时的毫秒数

// 缓存接口
interface CacheData {
  data: News[];
  timestamp: number;
}

// 从缓存中获取数据
function getFromCache(): News[] | null {
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
function setToCache(data: News[]) {
  if (typeof window === 'undefined') return;
  
  const cacheData: CacheData = {
    data,
    timestamp: Date.now()
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
}

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载新闻数据
  const loadNews = async () => {
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      if (data.code === 0) {
        setNews(data.data.items);
        setToCache(data.data.items);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 首先尝试从缓存获取数据
    const cachedData = getFromCache();
    if (cachedData) {
      setNews(cachedData);
      setLoading(false);
    } else {
      loadNews();
    }

    // 设置定时器，定期检查缓存是否过期
    const intervalId = setInterval(() => {
      if (!getFromCache()) {
        loadNews();
      }
    }, 60 * 60 * 1000); // 每60分钟检查一次

    return () => clearInterval(intervalId);
  }, []);

  return (
    <RootLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">工具资讯</h1>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {news.length === 0 ? (
              <p className="text-center text-gray-500 py-8">暂无资讯</p>
            ) : (
              news.map((item) => (
                <article key={item.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start gap-4">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-medium text-gray-900 hover:text-blue-600 flex-1"
                    >
                      {item.title}
                    </a>
                    <time 
                      dateTime={item.updateTime}
                      className="text-sm text-gray-500 whitespace-nowrap"
                    >
                      {item.updateTime}
                    </time>
                  </div>
                  {item.description && (
                    <p className="mt-2 text-gray-600">{item.description}</p>
                  )}
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </RootLayout>
  );
} 