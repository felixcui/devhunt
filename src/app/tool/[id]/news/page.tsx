'use client';

import { useEffect, useState } from 'react';
import RootLayout from '@/components/RootLayout';
import { News } from '@/types';
import { FiBox, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { use } from 'react';

interface NewsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ToolNewsPage({ params }: NewsPageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const searchParams = useSearchParams();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const toolName = searchParams.get('name');

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch(`/api/tools/${id}/news?name=${encodeURIComponent(toolName || '')}`);
        const data = await response.json();
        if (data.code === 0) {
          setNews(data.data.items);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    }

    if (toolName) {
      fetchNews();
    }
  }, [id, toolName]);

  return (
    <RootLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link 
            href={`/tool/${id}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft className="mr-2" />
            返回工具详情
          </Link>
        </div>
        
        <div className="flex items-center gap-4 mb-8">
          <FiBox className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold">{toolName ? `${toolName} 相关资讯` : '相关资讯'}</h1>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {news.length === 0 ? (
              <p className="text-gray-500 text-center py-8">暂无相关资讯</p>
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