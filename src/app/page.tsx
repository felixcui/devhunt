'use client';

import { useEffect, useState } from 'react';
import { Tool, News } from '@/types';
import { fetchTools, fetchNews } from '@/data/tools';
import ToolGrid from '@/components/ToolGrid';
import NewsCardCompact from '@/components/NewsCardCompact';
import { FiZap, FiBookOpen, FiArrowRight, FiRefreshCw, FiClock } from 'react-icons/fi';

export default function HomePage() {
  const [featuredTools, setFeaturedTools] = useState<Tool[]>([]);
  const [recentTools, setRecentTools] = useState<Tool[]>([]);
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 并行获取数据
        const [allTools, allNews] = await Promise.all([
          fetchTools(),
          fetchNews()
        ]);

        // 筛选精选工具 (带有 star 标签的前6个)
        const featured = allTools
          .filter(tool => {
            const isStar = tool.tags?.some(tag => tag.toLowerCase().trim() === 'star');
            return isStar;
          })
          .slice(0, 6);

        // 如果精选工具不足6个,用最新的工具补充
        if (featured.length < 6) {
          const remaining = allTools
            .filter(tool => !featured.includes(tool))
            .slice(0, 6 - featured.length);
          featured.push(...remaining);
        }

        setFeaturedTools(featured);
        setLatestNews(allNews.slice(0, 6)); // 只显示最新6条

        // 获取最近收录的6个工具(按更新时间排序，取最新的6个)
        const recent = [...allTools]
          .sort((a, b) => {
            const timeA = new Date(a.updateTime || 0).getTime();
            const timeB = new Date(b.updateTime || 0).getTime();
            return timeB - timeA; // 降序排列，最新的在前
          })
          .slice(0, 6);
        setRecentTools(recent);
      } catch (error) {
        console.error('Error loading homepage data:', error);
        setError('加载数据失败,请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="space-y-8 sm:space-y-10 lg:space-y-12">
        {/* 最新资讯骨架屏 */}
        <div className="space-y-4 sm:space-y-6">
          <div className="h-6 sm:h-8 bg-gray-200 rounded shimmer w-24 sm:w-32"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-28 sm:h-32 bg-white rounded-xl p-3 sm:p-4 shadow-soft animate-pulse">
                <div className="space-y-2">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded shimmer"></div>
                  <div className="h-2.5 sm:h-3 bg-gray-200 rounded shimmer w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 精选工具骨架屏 */}
        <div className="space-y-4 sm:space-y-6">
          <div className="h-6 sm:h-8 bg-gray-200 rounded shimmer w-32 sm:w-48"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-40 sm:h-48 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft animate-pulse">
                <div className="space-y-2 sm:space-y-3">
                  <div className="h-5 sm:h-6 bg-gray-200 rounded shimmer"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded shimmer w-3/4"></div>
                  <div className="h-5 sm:h-6 bg-gray-200 rounded-full shimmer w-16 sm:w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 最近收录骨架屏 */}
        <div className="space-y-4 sm:space-y-6">
          <div className="h-6 sm:h-8 bg-gray-200 rounded shimmer w-24 sm:w-32"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-40 sm:h-48 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft animate-pulse">
                <div className="space-y-2 sm:space-y-3">
                  <div className="h-5 sm:h-6 bg-gray-200 rounded shimmer"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded shimmer w-3/4"></div>
                  <div className="h-5 sm:h-6 bg-gray-200 rounded-full shimmer w-16 sm:w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10 lg:space-y-12">
      {/* 最新资讯区 - 全宽上下布局 */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 news-icon-gradient shadow-soft flex-shrink-0">
              <FiBookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              最新资讯
            </h2>
          </div>
          <a
            href="/news"
            className="inline-flex items-center gap-1 sm:gap-2 text-accent-600 hover:text-accent-700 font-semibold text-xs sm:text-sm bg-accent-50 hover:bg-accent-100 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-200 hover:scale-105 whitespace-nowrap"
          >
            更多
            <FiArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </a>
        </div>

        {latestNews.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-soft">
            <p className="text-gray-500 text-sm">暂无资讯</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {latestNews.map((news) => (
              <NewsCardCompact key={news.id} news={news} />
            ))}
          </div>
        )}
      </div>

      {/* 精选工具区 - 全宽上下布局 */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-soft flex-shrink-0">
              <FiZap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              精选工具
            </h2>
          </div>
          <a
            href="/tools"
            className="inline-flex items-center gap-1 sm:gap-2 text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm bg-blue-50 hover:bg-blue-100 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-200 hover:scale-105 whitespace-nowrap"
          >
            查看全部
            <FiArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </a>
        </div>

        {featuredTools.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-xl sm:rounded-2xl shadow-soft">
            <p className="text-gray-500 text-sm">暂无精选工具</p>
          </div>
        ) : (
          <ToolGrid tools={featuredTools} from="home" />
        )}
      </div>

      {/* 最近收录区 - 全宽上下布局 */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-soft flex-shrink-0">
              <FiClock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              最近收录
            </h2>
          </div>
          <a
            href="/recent"
            className="inline-flex items-center gap-1 sm:gap-2 text-purple-600 hover:text-purple-700 font-semibold text-xs sm:text-sm bg-purple-50 hover:bg-purple-100 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-200 hover:scale-105 whitespace-nowrap"
          >
            查看全部
            <FiArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </a>
        </div>

        {recentTools.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-xl sm:rounded-2xl shadow-soft">
            <p className="text-gray-500 text-sm">暂无最近收录工具</p>
          </div>
        ) : (
          <ToolGrid tools={recentTools} from="home" />
        )}
      </div>
    </div>
  );
}
