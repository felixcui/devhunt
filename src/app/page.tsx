'use client';

import { useEffect, useState } from 'react';
import RootLayout from '@/components/RootLayout';
import { News } from '@/types';

export default function HomePage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await fetch('/api/news');
        const data = await response.json();
        if (data.code === 0) {
          setNews(data.data.items);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  return (
    <RootLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">最新资讯</h1>
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
