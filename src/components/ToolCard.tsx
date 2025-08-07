'use client';

import Link from 'next/link';
import { Tool } from '@/types';
import { FiBox, FiArrowUpRight, FiStar, FiZap, FiTrendingUp, FiExternalLink } from 'react-icons/fi';
import { useEffect, useState } from 'react';

interface ToolCardProps {
  tool: Tool;
  featured?: boolean;
}

// 统一工具图标颜色 - 所有工具都使用Primary Blue
function getToolIconStyle(): string {
  return 'tool-icon-gradient'; // 使用统一的工具图标样式
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
  const toolIconStyle = getToolIconStyle();

  return (
    <div className={`group relative bg-white rounded-3xl shadow-soft overflow-hidden hover:shadow-soft-lg transition-all duration-500 transform hover:-translate-y-2 border border-gray-100/50 hover:border-gray-200/60 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
    } ${featured ? 'ring-2 ring-yellow-400/30 ring-offset-2' : ''}`}>
      
      {/* 工具头部 */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <Link href={`/tool/${tool.id}`} className="flex items-start gap-3 flex-1 group/link">
            {/* 工具图标 - 统一使用Primary Blue */}
            <div className="relative group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
              <div className={`w-8 h-8 ${toolIconStyle} shadow-soft-lg group-hover:shadow-lg transition-all duration-300`}>
                <FiBox className="w-4 h-4 text-white" />
              </div>
              {/* 悬浮光效 */}
              <div className="absolute inset-0 tool-icon-gradient rounded-2xl blur opacity-0 group-hover:opacity-40 transition-all duration-500 -z-10 scale-110"></div>
            </div>
            
            {/* 工具信息 */}
            <div className="flex-1 min-w-0">
            {/* 工具标题链接 - 使用Primary Blue */}
              <h3 className="font-bold text-xl text-gray-900 group-hover/link:text-blue-600 transition-colors duration-200 mb-1.5 line-clamp-1">
                {tool.name}
              </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 min-h-[2rem]">
                {tool.description}
              </p>
            </div>
          </Link>

          {/* 外部链接按钮 - 使用Primary Blue */}
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-3 group-hover:translate-x-0 hover:scale-110"
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
            {/* 分类标签 - 统一使用精选样式 */}
            <span className="inline-flex items-center gap-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-1.5 py-0.5 rounded-full text-xs font-medium shadow-soft hover:shadow-md transition-all duration-200 hover:scale-105">
              <FiZap className="w-2 h-2" />
              {tool.category}
            </span>
            
            {/* 工具标签 - 使用中性灰色 */}
            {hasValidTags && tool.tags && tool.tags.filter(tag => tag.toLowerCase() !== 'hot').slice(0, 2).map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-full text-xs font-medium shadow-soft hover:shadow-md transition-all duration-200 hover:scale-105"
              >
                #{tag}
              </span>
            ))}
            
            {/* 更多标签指示器 */}
            {hasValidTags && tool.tags && tool.tags.filter(tag => tag.toLowerCase() !== 'hot').length > 2 && (
              <span className="inline-flex items-center text-gray-400 text-xs bg-gray-50 px-1.5 py-0.5 rounded-full font-medium">
                +{tool.tags.filter(tag => tag.toLowerCase() !== 'hot').length - 2}
              </span>
            )}
          </div>
          
          {/* 右侧：状态标签和查看详情 */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* 精选标签 */}
            {featured && (
              <span className="inline-flex items-center gap-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-1.5 py-0.5 rounded-full text-xs font-medium shadow-soft hover:shadow-md transition-all duration-200 hover:scale-105">
                <FiStar className="w-2 h-2" />
                精选
              </span>
            )}
            
            {/* 热门标签 */}
            {isHot && !featured && (
              <span className="inline-flex items-center gap-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-1.5 py-0.5 rounded-full text-xs font-medium shadow-soft hover:shadow-md transition-all duration-200 hover:scale-105">
                <FiTrendingUp className="w-2 h-2" />
                热门
              </span>
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

      {/* 悬浮时的边框光效 - 使用工具图标颜色 */}
      <div className="absolute inset-0 rounded-3xl tool-icon opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none"></div>
      
      {/* 底部装饰线 - 使用工具图标颜色 */}
      <div className="absolute bottom-0 left-8 right-8 h-1 tool-icon-gradient rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
    </div>
  );
} 