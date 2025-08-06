'use client';

import Link from 'next/link';
import { Tool } from '@/types';
import { FiBox, FiArrowUpRight, FiStar, FiZap, FiTrendingUp, FiExternalLink } from 'react-icons/fi';
import { useEffect, useState } from 'react';

interface ToolCardProps {
  tool: Tool;
  featured?: boolean;
}

// 根据分类名称选择图标颜色
function getCategoryGradient(category: string): string {
  const lowerCategory = category.toLowerCase();
  
  if (lowerCategory.includes('ui') || lowerCategory.includes('界面')) return 'from-purple-500 to-pink-500';
  if (lowerCategory.includes('sass') || lowerCategory.includes('平台')) return 'from-blue-500 to-cyan-500';
  if (lowerCategory.includes('plugin') || lowerCategory.includes('插件')) return 'from-green-500 to-teal-500';
  if (lowerCategory.includes('agent') || lowerCategory.includes('代理')) return 'from-orange-500 to-red-500';
  if (lowerCategory.includes('review') || lowerCategory.includes('审查')) return 'from-indigo-500 to-purple-500';
  if (lowerCategory.includes('test') || lowerCategory.includes('测试')) return 'from-yellow-500 to-orange-500';
  if (lowerCategory.includes('chat') || lowerCategory.includes('对话')) return 'from-rose-500 to-pink-500';
  if (lowerCategory.includes('综合')) return 'from-gray-500 to-gray-600';
  if (lowerCategory.includes('ide')) return 'from-emerald-500 to-blue-500';
  if (lowerCategory.includes('other')) return 'from-slate-500 to-gray-600';
  
  return 'from-blue-500 to-purple-600';
}

export default function ToolCard({ tool, featured = false }: ToolCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!tool) return null;

  const hasValidTags = tool.tags && Array.isArray(tool.tags) && tool.tags.length > 0;
  const isHot = hasValidTags && tool.tags && tool.tags.some(tag => tag.toLowerCase() === 'hot');
  const categoryGradient = getCategoryGradient(tool.category);

  return (
    <div className={`group relative bg-white rounded-3xl shadow-soft overflow-hidden hover:shadow-soft-lg transition-all duration-500 transform hover:-translate-y-2 border border-gray-100/50 hover:border-gray-200/60 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
    } ${featured ? 'ring-2 ring-yellow-400/30 ring-offset-2' : ''}`}>
      
      {/* 工具头部 */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <Link href={`/tool/${tool.id}`} className="flex items-start gap-3 flex-1 group/link">
            {/* 图标容器 */}
            <div className="relative group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
              <div className={`w-8 h-8 bg-gradient-to-br ${categoryGradient} rounded-xl flex items-center justify-center shadow-soft-lg group-hover:shadow-lg transition-all duration-300`}>
                <FiBox className="w-4 h-4 text-white" />
              </div>
              {/* 悬浮光效 */}
              <div className={`absolute inset-0 bg-gradient-to-br ${categoryGradient} rounded-2xl blur opacity-0 group-hover:opacity-40 transition-all duration-500 -z-10 scale-110`}></div>
            </div>
            
            {/* 工具信息 */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xl text-gray-900 group-hover/link:text-blue-600 transition-colors duration-200 mb-1.5 line-clamp-1">
                {tool.name}
              </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 min-h-[2rem]">
                {tool.description}
              </p>
            </div>
          </Link>

          {/* 外部链接按钮 */}
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-3 group-hover:translate-x-0 hover:scale-110"
            onClick={(e) => e.stopPropagation()}
            title="访问工具"
          >
            <FiExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* 底部信息 */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {/* 左侧：分类和工具标签 */}
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* 分类标签 */}
            <span className={`inline-flex items-center gap-0.5 bg-gradient-to-r ${categoryGradient} text-white px-2 py-0.5 rounded-full text-xs font-medium shadow-soft hover:shadow-md transition-all duration-200 hover:scale-105`}>
              <FiZap className="w-2 h-2" />
              {tool.category}
            </span>
            
            {/* 工具标签 */}
            {hasValidTags && tool.tags && tool.tags.filter(tag => tag.toLowerCase() !== 'hot').slice(0, 2).map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium border border-gray-200/60 hover:border-gray-300 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 transition-all duration-200 hover:scale-105"
              >
                #{tag}
              </span>
            ))}
            
            {/* 更多标签指示器 */}
            {hasValidTags && tool.tags && tool.tags.filter(tag => tag.toLowerCase() !== 'hot').length > 2 && (
              <span className="text-gray-400 text-xs bg-gray-50 px-1.5 py-0.5 rounded-full">
                +{tool.tags.filter(tag => tag.toLowerCase() !== 'hot').length - 2}
              </span>
            )}
          </div>
          
          {/* 右侧：状态标签和查看详情 */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* 精选标签 */}
            {featured && (
              <div className="inline-flex items-center gap-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-soft">
                <FiStar className="w-2.5 h-2.5" />
                精选
              </div>
            )}
            
            {/* 热门标签 */}
            {isHot && !featured && (
              <div className="inline-flex items-center gap-0.5 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-soft animate-pulse">
                <FiTrendingUp className="w-2.5 h-2.5" />
                热门
              </div>
            )}
            
            <Link 
              href={`/tool/${tool.id}`}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-xs bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-all duration-200 hover:scale-105"
            >
              查看详情
              <FiArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 悬浮时的边框光效 */}
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${categoryGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}></div>
      
      {/* 底部装饰线 */}
      <div className={`absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r ${categoryGradient} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center`}></div>
    </div>
  );
} 