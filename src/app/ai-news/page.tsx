'use client';

import { useEffect, useState } from 'react';
import { AINews } from '@/types';
import { FiClock, FiExternalLink, FiTag, FiRefreshCw, FiFileText, FiZap, FiCpu } from 'react-icons/fi';

export default function AINewsPage() {
  const [news, setNews] = useState<AINews[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/ai-news');
        const data = await response.json();

        if (data.code === 0) {
          setNews(data.data.items);
          setLastUpdated(new Date().toLocaleTimeString('zh-CN'));
        } else {
          setError(data.msg || '获取资讯失败');
        }
      } catch (error) {
        console.error('Error fetching AI news:', error);
        setError('网络错误,请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    loadNews();

    // 设置定时刷新
    const interval = setInterval(loadNews, 5 * 60 * 1000); // 5分钟刷新
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  // 根据category返回对应的徽章颜色
  const getCategoryBadgeColor = (category?: string) => {
    if (!category) return 'bg-gray-100 text-gray-700';

    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('模型') || lowerCategory.includes('AI')) return 'bg-purple-100 text-purple-700';
    if (lowerCategory.includes('能力')) return 'bg-blue-100 text-blue-700';
    if (lowerCategory.includes('趋势')) return 'bg-green-100 text-green-700';
    if (lowerCategory.includes('智能')) return 'bg-indigo-100 text-indigo-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
      {/* 页面头部 */}
      <div className="relative">
        {/* 背景装饰 - 使用AI资讯专用颜色 */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-600/10 rounded-2xl sm:rounded-3xl blur-xl"></div>

        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-soft border border-white/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-soft">
                  <FiCpu className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <FiZap className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" />
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  其他资讯
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1">
                  AI技术动态、行业趋势和开发者资讯
                </p>
              </div>
            </div>

            {/* 刷新按钮和更新时间 */}
            <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-center">
              {lastUpdated && (
                <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 hidden sm:flex">
                  <FiClock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>更新于 {lastUpdated}</span>
                </div>
              )}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg disabled:opacity-50 transition-all duration-200 hover:scale-105 shadow-soft text-xs sm:text-sm whitespace-nowrap"
              >
                <FiRefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
                刷新
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      {loading ? (
        <div className="space-y-4 sm:space-y-6">
          {/* 加载状态 */}
          <div className="text-center py-8 sm:py-12">
            <div className="relative inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4">
              <div className="absolute inset-0 border-4 border-purple-200 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-1 sm:mb-2 px-4">正在加载资讯</h3>
            <p className="text-sm sm:text-base text-gray-500 px-4">请稍等片刻,为您获取最新内容...</p>
          </div>

          {/* 骨架屏 */}
          <div className="space-y-3 sm:space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft animate-pulse">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg shimmer flex-shrink-0"></div>
                  <div className="flex-1 space-y-2 sm:space-y-3">
                    <div className="h-4 sm:h-5 bg-gray-200 rounded shimmer"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded shimmer w-3/4"></div>
                    <div className="flex gap-1.5 sm:gap-2">
                      <div className="h-5 sm:h-6 w-12 sm:w-16 bg-gray-200 rounded-full shimmer"></div>
                      <div className="h-5 sm:h-6 w-16 sm:w-20 bg-gray-200 rounded-full shimmer"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12 sm:py-16 px-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">加载失败</h3>
          <p className="text-sm sm:text-base text-red-500 mb-4 sm:mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-soft text-sm sm:text-base"
          >
            <FiRefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            重新加载
          </button>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {news.length === 0 ? (
            <div className="text-center py-12 sm:py-16 px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <FiClock className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">暂无资讯</h3>
              <p className="text-sm sm:text-base text-gray-500">请稍后再试或检查网络连接</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {news.map((item, index) => (
                <article
                  key={item.id}
                  className="group relative bg-white rounded-xl sm:rounded-2xl shadow-soft hover:shadow-soft-lg p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1 animate-slide-up border border-gray-100 hover:border-purple-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* AI资讯图标 */}
                    <div className="flex-shrink-0 relative">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform duration-200">
                        <FiFileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                    </div>

                    {/* 资讯内容 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-2 sm:mb-3">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 group/link"
                        >
                          <h2 className="text-base sm:text-lg font-semibold text-gray-900 group-hover/link:text-purple-600 transition-colors duration-200 leading-tight mb-1 sm:mb-2 flex items-start gap-1.5 sm:gap-2">
                            <span className="flex-1">{item.title}</span>
                            <FiExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover/link:text-purple-600 transition-colors duration-200 flex-shrink-0 mt-0.5 sm:mt-1" />
                          </h2>
                        </a>

                        <time
                          dateTime={item.updateTime}
                          className="flex-shrink-0 text-xs sm:text-sm text-gray-500 bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-gray-200 self-start"
                        >
                          {item.updateTime}
                        </time>
                      </div>

                      {/* 描述 */}
                      {item.description && (
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
                          {item.description}
                        </p>
                      )}

                      {/* 分类标签 */}
                      {item.category && (
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${getCategoryBadgeColor(item.category)}`}>
                            <FiTag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            {item.category}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 悬浮时的底部装饰 */}
                  <div className="absolute bottom-0 left-4 right-4 sm:left-6 sm:right-6 h-0.5 sm:h-1 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 页面底部提示 */}
      <div className="text-center py-6 sm:py-8 px-4">
        <p className="text-gray-500 text-xs sm:text-sm">
          数据每5分钟自动更新 •
          <a href="/tools" className="text-purple-600 hover:text-purple-700 cursor-pointer ml-1">查看所有工具</a>
        </p>
      </div>
    </div>
  );
}
