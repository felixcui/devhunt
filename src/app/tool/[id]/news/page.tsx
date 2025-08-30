'use client';

import { useEffect, useState, useCallback } from 'react';
import { News } from '@/types';
import { FiBookOpen, FiArrowLeft, FiClock, FiExternalLink, FiTag, FiRefreshCw, FiFileText } from 'react-icons/fi';
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
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const toolName = searchParams.get('name');

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/tools/${id}/news?name=${encodeURIComponent(toolName || '')}`);
      const data = await response.json();
      
      if (data.code === 0) {
        setNews(data.data.items);
        setLastUpdated(new Date().toLocaleTimeString('zh-CN'));
      } else {
        setError(data.msg || '获取资讯失败');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [id, toolName]);

  useEffect(() => {
    if (toolName) {
      fetchNews();
    }
  }, [toolName, fetchNews]);

  const handleRefresh = () => {
    fetchNews();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* 返回按钮 */}
      <div>
        <Link 
          href={`/tool/${id}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:bg-gray-100 px-3 py-2 rounded-lg"
        >
          <FiArrowLeft className="w-4 h-4" />
          返回工具详情
        </Link>
      </div>
      
      {/* 页面头部 */}
      <div className="relative">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-3xl blur-xl"></div>
        
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center shadow-soft">
                  <FiBookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {toolName ? `${toolName} 相关资讯` : '相关资讯'}
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  与此工具相关的最新资讯和动态
                </p>
              </div>
            </div>

            {/* 刷新按钮和更新时间 */}
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <FiClock className="w-4 h-4" />
                  <span>更新于 {lastUpdated}</span>
                </div>
              )}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 disabled:opacity-50 transition-all duration-200 hover:scale-105 shadow-soft text-sm"
              >
                <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                刷新
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 内容区域 */}
      {loading ? (
        <div className="space-y-6">
          {/* 加载状态 */}
          <div className="text-center py-12">
            <div className="relative inline-flex items-center justify-center w-16 h-16 mb-4">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">正在加载相关资讯</h3>
            <p className="text-gray-500">请稍等片刻，为您获取最新内容...</p>
          </div>

          {/* 骨架屏 */}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-soft animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg shimmer"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-200 rounded shimmer"></div>
                    <div className="h-4 bg-gray-200 rounded shimmer w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">加载失败</h3>
          <p className="text-red-500 mb-6">{error}</p>
          <button 
            onClick={handleRefresh} 
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-200 hover:scale-105 shadow-soft text-sm"
          >
            <FiRefreshCw className="w-4 h-4" />
            重新加载
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {news.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiClock className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">暂无相关资讯</h3>
              <p className="text-gray-500">暂未找到与此工具相关的资讯内容</p>
            </div>
          ) : (
            <div className="space-y-4">
              {news.map((item, index) => (
                <article 
                  key={item.id} 
                  className="group bg-white rounded-2xl shadow-soft hover:shadow-soft-lg p-6 transition-all duration-300 hover:-translate-y-1 animate-slide-up border border-gray-100 hover:border-blue-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    {/* 资讯图标 */}
                    <div className="flex-shrink-0 relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform duration-200">
                        <FiFileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                    </div>

                    {/* 资讯内容 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 group/link"
                        >
                          <h2 className="text-lg font-semibold text-gray-900 group-hover/link:text-blue-600 transition-colors duration-200 leading-tight mb-2 flex items-start gap-2">
                            <span className="flex-1">{item.title}</span>
                            <FiExternalLink className="w-4 h-4 text-gray-400 group-hover/link:text-blue-600 transition-colors duration-200 flex-shrink-0 mt-1" />
                          </h2>
                        </a>
                        
                        <time 
                          dateTime={item.updateTime}
                          className="flex-shrink-0 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200"
                        >
                          {item.updateTime}
                        </time>
                      </div>

                      {/* 描述 */}
                      {item.description && (
                        <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                          {item.description}
                        </p>
                      )}

                      {/* 相关工具标签 */}
                      {item.tool && (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors">
                            <FiTag className="w-3 h-3" />
                            相关工具: {item.tool}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 悬浮时的底部装饰 */}
                  <div className="absolute bottom-0 left-6 right-6 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 页面底部提示 */}
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">
          工具相关资讯 • 
          <Link href="/news" className="text-blue-600 hover:text-blue-700"> 查看更多资讯</Link>
        </p>
      </div>
    </div>
  );
} 