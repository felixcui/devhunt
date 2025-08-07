'use client';

import { useEffect, useState } from 'react';
import { fetchTools } from '@/data/tools';
import ToolGrid from '@/components/ToolGrid';
import SearchBar from '@/components/SearchBar';
import { Tool } from '@/types';
import { FiGrid, FiFilter, FiTrendingUp, FiClock } from 'react-icons/fi';

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
          return a.category.localeCompare(b.category);
        case 'recent':
        default:
          return b.id.localeCompare(a.id); // 假设id越大越新
      }
    });
    setFilteredTools(sorted);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {/* 加载状态的头部 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-white/20">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl shimmer"></div>
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded shimmer mb-2"></div>
              <div className="h-4 bg-gray-200 rounded shimmer w-2/3"></div>
            </div>
          </div>
        </div>

        {/* 加载状态的工具网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-soft animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl shimmer"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded shimmer mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded shimmer w-20"></div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded shimmer"></div>
                <div className="h-4 bg-gray-200 rounded shimmer w-4/5"></div>
                <div className="h-4 bg-gray-200 rounded shimmer w-3/5"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-gray-200 rounded-full shimmer"></div>
                <div className="h-6 w-20 bg-gray-200 rounded-full shimmer"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 页面头部 */}
      <div className="relative">
        {/* 背景装饰 - 使用工具专用颜色 */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-3xl blur-xl"></div>
        
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 tool-icon-gradient shadow-soft">
                  <FiGrid className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold gradient-text-brand">
                  所有工具
                </h1>
                <p className="text-gray-600 mt-2">
                  发现最适合你的AI编程工具 • 共 {totalCount} 个工具
                </p>
              </div>
            </div>

            {/* 排序选项 */}
            <div className="flex items-center gap-2">
              <FiFilter className="w-5 h-5 text-gray-500" />
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => handleSort('recent')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                    sortBy === 'recent' 
                      ? 'bg-white text-primary-600 shadow-soft' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FiClock className="w-4 h-4 mr-1 inline-block" />
                  最新
                </button>
                <button
                  onClick={() => handleSort('name')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                    sortBy === 'name' 
                      ? 'bg-white text-primary-600 shadow-soft' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  名称
                </button>
                <button
                  onClick={() => handleSort('category')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
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
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiGrid className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">没有找到相关工具</h3>
          <p className="text-gray-500 mb-6">尝试调整搜索关键词或浏览其他分类</p>
          <button
            onClick={() => setFilteredTools(tools)}
            className="inline-flex items-center gap-2 px-6 py-3 tool-icon-gradient text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-soft"
          >
            查看所有工具
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 结果统计 */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FiTrendingUp className="w-4 h-4" />
              <span>找到 {filteredTools.length} 个工具</span>
              {filteredTools.length !== totalCount && (
                <span className="text-primary-600">（已过滤）</span>
              )}
            </div>
            <div>
              按 {sortBy === 'recent' ? '最新' : sortBy === 'name' ? '名称' : '分类'} 排序
            </div>
          </div>

          {/* 工具网格 */}
          <ToolGrid tools={filteredTools} />
        </div>
      )}

      {/* 页面底部提示 */}
      <div className="text-center py-8 border-t border-gray-200">
        <p className="text-gray-500 text-sm mb-4">
          没有找到你想要的工具？
        </p>
        <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
          提交新工具 →
        </button>
      </div>
    </div>
  );
} 