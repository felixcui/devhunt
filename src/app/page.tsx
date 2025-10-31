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
      <div className="space-y-12">
        {/* 最新资讯骨架屏 */}
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded shimmer w-32"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-32 bg-white rounded-xl p-4 shadow-soft animate-pulse">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded shimmer"></div>
                  <div className="h-3 bg-gray-200 rounded shimmer w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 精选工具骨架屏 */}
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded shimmer w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-white rounded-2xl p-6 shadow-soft animate-pulse">
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded shimmer"></div>
                  <div className="h-4 bg-gray-200 rounded shimmer w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded-full shimmer w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 最近收录骨架屏 */}
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded shimmer w-32"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-white rounded-2xl p-6 shadow-soft animate-pulse">
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded shimmer"></div>
                  <div className="h-4 bg-gray-200 rounded shimmer w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded-full shimmer w-20"></div>
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
          className="inline-flex items-center gap-2 px-6 py-3 tool-icon-gradient text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-soft"
        >
          <FiRefreshCw className="w-4 h-4" />
          重新加载
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* 最新资讯区 - 全宽上下布局 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 news-icon-gradient shadow-soft">
              <FiBookOpen className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              最新资讯
            </h2>
          </div>
          <a
            href="/news"
            className="inline-flex items-center gap-2 text-accent-600 hover:text-accent-700 font-semibold text-sm bg-accent-50 hover:bg-accent-100 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
          >
            更多
            <FiArrowRight className="w-4 h-4" />
          </a>
        </div>

        {latestNews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-soft">
            <p className="text-gray-500 text-sm">暂无资讯</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestNews.map((news) => (
              <NewsCardCompact key={news.id} news={news} />
            ))}
          </div>
        )}
      </div>

      {/* 精选工具区 - 全宽上下布局 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-soft">
              <FiZap className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              精选工具
            </h2>
          </div>
          <a
            href="/tools"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
          >
            查看全部
            <FiArrowRight className="w-4 h-4" />
          </a>
        </div>

        {featuredTools.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-soft">
            <p className="text-gray-500">暂无精选工具</p>
          </div>
        ) : (
          <ToolGrid tools={featuredTools} from="home" />
        )}
      </div>

      {/* 最近收录区 - 全宽上下布局 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-soft">
              <FiClock className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              最近收录
            </h2>
          </div>
          <a
            href="/recent"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold text-sm bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
          >
            查看全部
            <FiArrowRight className="w-4 h-4" />
          </a>
        </div>

        {recentTools.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-soft">
            <p className="text-gray-500">暂无最近收录工具</p>
          </div>
        ) : (
          <ToolGrid tools={recentTools} from="home" />
        )}
      </div>
    </div>
  );
}
