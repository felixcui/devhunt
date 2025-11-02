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
      <div className="border-t border-gray-200 pt-6 sm:pt-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <FiBookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">相关资讯</h2>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-200/50 animate-pulse">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 rounded-lg shimmer flex-shrink-0"></div>
                <div className="flex-1 space-y-1.5 sm:space-y-2">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded shimmer"></div>
                  <div className="h-2.5 sm:h-3 bg-gray-200 rounded shimmer w-3/4"></div>
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
      <div className="border-t border-gray-200 pt-6 sm:pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <FiBookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">相关资讯</h2>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-200 hover:scale-105 shadow-soft text-xs sm:text-sm self-start sm:self-auto"
          >
            <FiRefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
            重试
          </button>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 text-xs sm:text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="border-t border-gray-200 pt-6 sm:pt-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <FiBookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">相关资讯</h2>
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200/50 text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <FiClock className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-1.5 sm:mb-2">暂无相关资讯</h3>
          <p className="text-gray-500 text-xs sm:text-sm">暂未找到与此工具相关的资讯内容</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 pt-6 sm:pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <FiBookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">相关资讯</h2>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-all duration-200 hover:scale-105 text-xs sm:text-sm"
          >
            <FiRefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">刷新</span>
          </button>
          
          <Link
            href={`/tool/${toolId}/news?name=${encodeURIComponent(toolName)}`}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-200 hover:scale-105 text-xs sm:text-sm whitespace-nowrap"
          >
            查看更多
            <FiChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Link>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200/50">
        <div className="space-y-3 sm:space-y-4">
          {news.map((item) => (
            <article 
              key={item.id} 
              className="group bg-white/70 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 hover:bg-white/90 transition-all duration-200 hover:shadow-soft border border-white/40"
            >
              <div className="flex items-start gap-2 sm:gap-3">
                {/* 资讯图标 */}
                <div className="flex-shrink-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <FiFileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                </div>

                {/* 资讯内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 group/link"
                    >
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover/link:text-blue-600 transition-colors duration-200 leading-tight line-clamp-2 flex items-start gap-1.5 sm:gap-2">
                        <span className="flex-1">{item.title}</span>
                        <FiExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover/link:text-blue-600 transition-colors duration-200 flex-shrink-0 mt-0.5" />
                      </h3>
                    </a>
                    
                    <time 
                      dateTime={item.updateTime}
                      className="flex-shrink-0 text-xs sm:text-sm text-gray-500 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full self-start"
                    >
                      {item.updateTime}
                    </time>
                  </div>

                  {/* 描述 */}
                  {item.description && (
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-2 line-clamp-3 sm:line-clamp-4">
                      {item.description}
                    </p>
                  )}

                  {/* 相关工具标签 */}
                  {item.tool && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-blue-600 bg-blue-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-blue-200">
                        <FiTag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span className="truncate max-w-[100px] sm:max-w-none">{item.tool}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
        
        {news.length >= 3 && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200/50 text-center">
            <Link
              href={`/tool/${toolId}/news?name=${encodeURIComponent(toolName)}`}
              className="inline-flex items-center gap-1.5 sm:gap-2 text-blue-600 hover:text-blue-700 text-sm sm:text-base font-medium transition-colors duration-200"
            >
              查看所有相关资讯
              <FiChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}