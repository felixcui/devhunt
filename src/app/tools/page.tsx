'use client';

import { useEffect, useState } from 'react';
import { fetchTools } from '@/data/tools';
import ToolGrid from '@/components/ToolGrid';
import SearchBar from '@/components/SearchBar';
import { Tool } from '@/types';
import { FiGrid, FiFilter, FiTrendingUp, FiClock } from 'react-icons/fi';
import { getCategoryDisplayName } from '@/utils/category-mapping';

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'recent'>('recent');
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const loadTools = async () => {
      try {
        const data = await fetchTools();
        setTools(data);
        setFilteredTools(data);
        setTotalCount(data.length);
      } catch (error) {
        console.error('Error loading tools:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTools();
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredTools(tools);
      return;
    }

    const searchQuery = query.toLowerCase();
    const filtered = tools.filter(tool => 
      tool.name.toLowerCase().includes(searchQuery) ||
      tool.description.toLowerCase().includes(searchQuery) ||
      getCategoryDisplayName(tool.category).toLowerCase().includes(searchQuery) ||
      tool.category.toLowerCase().includes(searchQuery) ||
      (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(searchQuery)))
    );
    setFilteredTools(filtered);
  };

  const handleSort = (newSortBy: 'name' | 'category' | 'recent') => {
    setSortBy(newSortBy);
    const sorted = [...filteredTools].sort((a, b) => {
      switch (newSortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return getCategoryDisplayName(a.category).localeCompare(getCategoryDisplayName(b.category), 'zh');
        case 'recent':
        default:
          return b.id.localeCompare(a.id); // 假设id越大越新
      }
    });
    setFilteredTools(sorted);
  };

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        {/* 加载状态的头部 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-soft border border-white/20">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-200 rounded-xl sm:rounded-2xl shimmer"></div>
            <div className="flex-1">
              <div className="h-6 sm:h-7 lg:h-8 bg-gray-200 rounded shimmer mb-2"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded shimmer w-2/3"></div>
            </div>
          </div>
        </div>

        {/* 加载状态的工具网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft animate-pulse">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg sm:rounded-xl shimmer"></div>
                <div className="flex-1">
                  <div className="h-4 sm:h-5 bg-gray-200 rounded shimmer mb-1 sm:mb-2"></div>
                  <div className="h-2.5 sm:h-3 bg-gray-200 rounded shimmer w-16 sm:w-20"></div>
                </div>
              </div>
              <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                <div className="h-3 sm:h-4 bg-gray-200 rounded shimmer"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded shimmer w-4/5"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded shimmer w-3/5"></div>
              </div>
              <div className="flex gap-1.5 sm:gap-2">
                <div className="h-5 sm:h-6 w-12 sm:w-16 bg-gray-200 rounded-full shimmer"></div>
                <div className="h-5 sm:h-6 w-16 sm:w-20 bg-gray-200 rounded-full shimmer"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 页面头部 */}
      <div className="relative">
        {/* 背景装饰 - 使用工具专用颜色 */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-2xl sm:rounded-3xl blur-xl"></div>
        
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-soft border border-white/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 tool-icon-gradient shadow-soft">
                  <FiGrid className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text-brand">
                  所有工具
                </h1>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1 sm:mt-2">
                  发现最适合你的AI编程工具 • 共 {totalCount} 个工具
                </p>
              </div>
            </div>

            {/* 排序选项 */}
            <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0">
              <FiFilter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 hidden sm:block" />
              <div className="flex bg-gray-100 rounded-lg p-0.5 sm:p-1">
                <button
                  onClick={() => handleSort('recent')}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-1 whitespace-nowrap ${
                    sortBy === 'recent' 
                      ? 'bg-white text-primary-600 shadow-soft' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FiClock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">最新</span>
                </button>
                <button
                  onClick={() => handleSort('name')}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                    sortBy === 'name' 
                      ? 'bg-white text-primary-600 shadow-soft' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  名称
                </button>
                <button
                  onClick={() => handleSort('category')}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                    sortBy === 'category' 
                      ? 'bg-white text-primary-600 shadow-soft' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  分类
                </button>
              </div>
            </div>
          </div>

          {/* 搜索栏 */}
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* 工具网格 */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-12 sm:py-16 px-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <FiGrid className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">没有找到相关工具</h3>
          <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">尝试调整搜索关键词或浏览其他分类</p>
          <button
            onClick={() => setFilteredTools(tools)}
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 tool-icon-gradient text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-soft text-sm sm:text-base"
          >
            查看所有工具
          </button>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {/* 结果统计 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm text-gray-600 px-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <FiTrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>找到 {filteredTools.length} 个工具</span>
              {filteredTools.length !== totalCount && (
                <span className="text-primary-600">（已过滤）</span>
              )}
            </div>
            <div className="text-gray-500">
              按 {sortBy === 'recent' ? '最新' : sortBy === 'name' ? '名称' : '分类'} 排序
            </div>
          </div>

          {/* 工具网格 */}
          <ToolGrid tools={filteredTools} from="tools" />
        </div>
      )}

      {/* 页面底部提示 */}
      <div className="text-center py-6 sm:py-8 border-t border-gray-200">
        <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4 px-4">
          没有找到你想要的工具？
        </p>
        <button className="text-primary-600 hover:text-primary-700 font-medium text-xs sm:text-sm">
          提交新工具 →
        </button>
      </div>
    </div>
  );
} 