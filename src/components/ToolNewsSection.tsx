'use client';

import { useEffect, useState, useCallback } from 'react';
import { News } from '@/types';
import { FiBookOpen, FiClock, FiExternalLink, FiTag, FiRefreshCw, FiFileText, FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';

interface ToolNewsSectionProps {
  toolId: string;
  toolName: string;
}

export default function ToolNewsSection({ toolId, toolName }: ToolNewsSectionProps) {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/tools/${toolId}/news?name=${encodeURIComponent(toolName)}`);
      const data = await response.json();
      
      if (data.code === 0) {
        setNews(data.data.items.slice(0, 3)); // 只显示前3条资讯
      } else {
        setError(data.msg || '获取资讯失败');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [toolId, toolName]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleRefresh = () => {
    fetchNews();
  };

  if (loading) {
    return (
      <div className="border-t border-gray-200 pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
            <FiBookOpen className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">相关资讯</h2>
        </div>
        
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-4 border border-gray-200/50 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-lg shimmer"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded shimmer"></div>
                  <div className="h-3 bg-gray-200 rounded shimmer w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-t border-gray-200 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <FiBookOpen className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">相关资讯</h2>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-200 hover:scale-105 shadow-soft text-sm"
          >
            <FiRefreshCw className="w-4 h-4" />
            重试
          </button>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="border-t border-gray-200 pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
            <FiBookOpen className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">相关资讯</h2>
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-8 border border-gray-200/50 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiClock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">暂无相关资讯</h3>
          <p className="text-gray-500 text-sm">暂未找到与此工具相关的资讯内容</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 pt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
            <FiBookOpen className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">相关资讯</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-all duration-200 hover:scale-105 text-sm"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </button>
          
          <Link
            href={`/tool/${toolId}/news?name=${encodeURIComponent(toolName)}`}
            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-200 hover:scale-105 text-sm"
          >
            查看更多
            <FiChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-6 border border-gray-200/50">
        <div className="space-y-4">
          {news.map((item) => (
            <article 
              key={item.id} 
              className="group bg-white/70 backdrop-blur-sm rounded-xl p-4 hover:bg-white/90 transition-all duration-200 hover:shadow-soft border border-white/40"
            >
              <div className="flex items-start gap-3">
                {/* 资讯图标 */}
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <FiFileText className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* 资讯内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 group/link"
                    >
                      <h3 className="text-base font-semibold text-gray-900 group-hover/link:text-blue-600 transition-colors duration-200 leading-tight line-clamp-2 flex items-start gap-2">
                        <span className="flex-1">{item.title}</span>
                        <FiExternalLink className="w-4 h-4 text-gray-400 group-hover/link:text-blue-600 transition-colors duration-200 flex-shrink-0 mt-0.5" />
                      </h3>
                    </a>
                    
                    <time 
                      dateTime={item.updateTime}
                      className="flex-shrink-0 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
                    >
                      {item.updateTime}
                    </time>
                  </div>

                  {/* 描述 */}
                  {item.description && (
                    <p className="text-sm text-gray-600 leading-relaxed mb-2 line-clamp-3">
                      {item.description}
                    </p>
                  )}

                  {/* 相关工具标签 */}
                  {item.tool && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-200">
                        <FiTag className="w-3 h-3" />
                        {item.tool}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
        
        {news.length >= 3 && (
          <div className="mt-4 pt-4 border-t border-gray-200/50 text-center">
            <Link
              href={`/tool/${toolId}/news?name=${encodeURIComponent(toolName)}`}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-base font-medium transition-colors duration-200"
            >
              查看所有相关资讯
              <FiChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}