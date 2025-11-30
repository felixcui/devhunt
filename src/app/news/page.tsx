'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { Tool, News } from '@/types';
import { FiClock, FiExternalLink, FiRefreshCw, FiFileText } from 'react-icons/fi';
import { fetchTools } from '@/data/tools';
import { useSearchParams, useRouter } from 'next/navigation';

function NewsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [featuredTools, setFeaturedTools] = useState<Tool[]>([]);

  const activeToolId = searchParams.get('tool');
  const activeToolName = searchParams.get('name') || '';
  const activeCategory = searchParams.get('category');

  // 资讯分类映射（使用中文名称匹配飞书表格中的分类）
  const categoryLabels: Record<string, string> = {
    '编程实践': '编程实践',
    '编程模型': '编程模型',
    '编程工具': '编程工具',
    '行业观点': '行业观点',
  };

  // 获取精选工具（仅 star 标签）
  useEffect(() => {
    const loadFeaturedTools = async () => {
      try {
        const allTools = await fetchTools();
        const starred = allTools.filter(t => t.tags?.some(tag => tag.toLowerCase().trim() === 'star'));
        setFeaturedTools(starred);
      } catch (e) {
        console.error('Error fetching tools for left nav:', e);
        setFeaturedTools([]);
      }
    };
    loadFeaturedTools();
  }, []);

  const fetchNewsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let response: Response;
      if (activeToolId) {
        response = await fetch(`/api/tools/${activeToolId}/news?name=${encodeURIComponent(activeToolName)}`);
      } else {
        response = await fetch('/api/news');
      }
      const data = await response.json();

      if (data.code === 0) {
        let items = data.data.items;
        // 如果有分类筛选，在客户端过滤
        if (activeCategory && items.length > 0) {
          items = items.filter((item: News) => item.category === activeCategory);
        }
        setNews(items);
      } else {
        setError(data.msg || '获取资讯失败');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('网络错误,请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [activeToolId, activeToolName, activeCategory]);

  useEffect(() => {
    fetchNewsData();
    const interval = setInterval(fetchNewsData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchNewsData]);

  const handleRefresh = () => {
    fetchNewsData();
  };

  const hasLeftNav = featuredTools.length > 0;

  const handleSelectTool = (tool: Tool) => {
    router.replace(`/news?tool=${tool.id}&name=${encodeURIComponent(tool.name)}`);
  };

  const isActiveTool = useCallback(
    (id: string) => !!activeToolId && activeToolId === id,
    [activeToolId]
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* 顶部标题模块已移除 */}

      {/* 内容区域 */}
      {loading ? (
        <div className="space-y-4 sm:space-y-6">
          {/* 加载状态 */}
          <div className="text-center py-8 sm:py-12">
            <div className="relative inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-1 sm:mb-2 px-4">正在加载最新资讯</h3>
            <p className="text-sm sm:text-base text-gray-500 px-4">请稍等片刻,为您获取最新内容...</p>
          </div>

          {/* 骨架屏 */}
          <div className="space-y-3 sm:space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft animate-pulse">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg shimmer"></div>
                  <div className="flex-1 space-y-2 sm:space-y-3">
                    <div className="h-4 sm:h-5 bg-gray-200 rounded shimmer"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded shimmer w-3/4"></div>
                    <div className="flex gap-2">
                      <div className="h-5 sm:h-6 w-14 sm:w-16 bg-gray-200 rounded-full shimmer"></div>
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
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 tool-icon-gradient text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-soft text-sm sm:text-base"
          >
            <FiRefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            重新加载
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 分类标题 */}
          {activeCategory && categoryLabels[activeCategory] && (
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {categoryLabels[activeCategory]}
              </h2>
              <button
                onClick={() => router.replace('/news')}
                className="text-sm text-gray-500 hover:text-accent-600 transition-colors"
              >
                查看全部资讯 →
              </button>
            </div>
          )}

          {/* 顶部精选工具导航（含全部资讯） */}
          {hasLeftNav && !activeCategory && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-soft border border-white/20">
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <button
                  onClick={() => router.replace('/news')}
                  className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-all duration-200 border whitespace-nowrap ${!activeToolId ? 'bg-accent-50 border-accent-200 text-accent-700' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'}`}
                >
                  全部资讯
                </button>
                {featuredTools.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => handleSelectTool(tool)}
                    className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-all duration-200 border ${isActiveTool(tool.id) ? 'bg-accent-50 border-accent-200 text-accent-700' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'}`}
                    title={tool.name}
                  >
                    <span className="line-clamp-1 max-w-[120px] sm:max-w-none">{tool.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {news.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiClock className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">暂无资讯</h3>
              <p className="text-gray-500">请稍后再试或检查网络连接</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {news.map((item, index) => (
                <article
                  key={item.id}
                  className="group relative bg-white rounded-xl sm:rounded-2xl shadow-soft hover:shadow-soft-lg p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1 animate-slide-up border border-gray-100 hover:border-accent-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* 资讯图标 */}
                    <div className="flex-shrink-0 relative">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 news-icon-gradient shadow-soft group-hover:scale-110 transition-transform duration-200">
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
                          <h2 className="text-base sm:text-lg font-semibold text-gray-900 group-hover/link:text-accent-600 transition-colors duration-200 leading-tight mb-1 sm:mb-2 flex items-start gap-2">
                            <span className="flex-1">{item.title}</span>
                            <FiExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover/link:text-accent-600 transition-colors duration-200 flex-shrink-0 mt-0.5 sm:mt-1" />
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
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-3 sm:line-clamp-4">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 悬浮时的底部装饰 */}
                  <div className="absolute bottom-0 left-4 right-4 sm:left-6 sm:right-6 h-0.5 sm:h-1 news-icon-gradient rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 页面底部提示 */}
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">
          数据每5分钟自动更新 •
          <a href="/tools" className="news-accent-text hover:opacity-80 cursor-pointer ml-1">查看所有工具</a>
        </p>
      </div>
      {/* 左右布局：当存在精选工具时，采用两栏布局 */}
    </div>
  );
}

export default function NewsPage() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto py-8 text-gray-500 text-sm">加载中...</div>}>
      <NewsContent />
    </Suspense>
  );
}
