'use client';

import { useEffect, useState } from 'react';
import RootLayout from '@/components/RootLayout';
import { News } from '@/types';

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/news');
        const data = await response.json();
        
        if (data.code === 0) {
          setNews(data.data.items);
        } else {
          setError(data.msg || '获取资讯失败');
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('网络错误，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  return (
    <RootLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">工具资讯</h1>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">正在加载资讯...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              重新加载
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {news.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">暂无资讯</p>
                <p className="text-sm text-gray-400">请稍后再试或检查网络连接</p>
              </div>
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
                  {item.tool && (
                    <div className="mt-2">
                      <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        相关工具: {item.tool}
                      </span>
                    </div>
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