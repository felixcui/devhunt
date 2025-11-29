'use client';

import { useEffect, useState } from 'react';
import { fetchTools } from '@/data/tools';
import { notFound, useSearchParams } from 'next/navigation';
import { FiCode, FiExternalLink, FiFileText, FiArrowLeft, FiGlobe, FiStar } from 'react-icons/fi';
import Link from 'next/link';
import ToolNewsSection from '@/components/ToolNewsSection';
import type { Tool } from '@/types';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// 智能返回路径映射
const getReturnPath = (from: string | null): { path: string; label: string } => {
  switch (from) {
    case 'hot':
      return { path: '/hot', label: '返回热门工具' };
    case 'recent':
      return { path: '/recent', label: '返回最近收录' };
    case 'tools':
      return { path: '/tools', label: '返回全部工具' };
    default:
      // 如果from参数是分类ID（以category-开头），返回对应分类页面
      if (from && from.startsWith('category-')) {
        const categoryId = from.replace('category-', '');
        return { path: `/category/${categoryId}`, label: '返回分类' };
      }
      // 默认返回全部工具页面
      return { path: '/tools', label: '返回工具列表' };
  }
};

// 辅助函数：将文本中的URL转换为可点击的链接
function convertUrlsToLinks(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
        >
          <span>{part}</span>
          <FiExternalLink className="w-3 h-3" />
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export default function ToolPage({ params }: PageProps) {
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  
  // 获取来源页面参数
  const from = searchParams.get('from');
  const returnInfo = getReturnPath(from);

  useEffect(() => {
    const loadTool = async () => {
      try {
        const resolvedParams = await params;
        const toolId = resolvedParams.id;
        
        const tools = await fetchTools();
        
        if (!Array.isArray(tools)) {
          throw new Error('Failed to fetch tools');
        }
        
        const foundTool = tools.find(t => t && typeof t === 'object' && t.id === toolId);
        
        if (!foundTool) {
          notFound();
          return;
        }
        
        setTool(foundTool);
      } catch (error) {
        console.error('Error in ToolPage:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    loadTool();
  }, [params]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
        <div className="animate-pulse">
          <div className="h-8 sm:h-10 bg-gray-200 rounded mb-6 sm:mb-8 w-32 sm:w-48"></div>
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8">
            <div className="flex items-start gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-200 rounded-xl sm:rounded-2xl"></div>
              <div className="flex-1">
                <div className="h-6 sm:h-7 lg:h-8 bg-gray-200 rounded mb-3 sm:mb-4"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded mb-1.5 sm:mb-2"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded mb-3 sm:mb-4 w-3/4"></div>
                <div className="h-8 sm:h-9 lg:h-10 bg-gray-200 rounded w-24 sm:w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tool) {
    return notFound();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
      {/* 智能返回按钮 */}
      <div>
        <Link 
          href={returnInfo.path}
          className="inline-flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:bg-gray-100 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base"
        >
          <FiArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          {returnInfo.label}
        </Link>
      </div>

      {/* 主要内容区域 */}
      <div className="relative">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-green-500/5 rounded-2xl sm:rounded-3xl blur-xl"></div>
        
        <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-soft border border-white/20 overflow-hidden">
          {/* 工具头部信息 */}
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
              {/* 工具图标 */}
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-soft">
                  <FiCode className="w-7 h-7 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <FiStar className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                </div>
              </div>

              {/* 工具基本信息 */}
              <div className="flex-1 min-w-0 w-full">
                {/* 工具名字和访问工具按钮在同一行 */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {tool.name}
                  </h1>
                  
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-blue-500 to-green-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-soft hover:from-blue-600 hover:to-green-600 transition-all duration-200 hover:scale-105"
                  >
                    <FiGlobe className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    访问工具
                    <FiExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </a>
                </div>

                <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                  {tool.description}
                </p>
              </div>
            </div>

            {/* 相关资料部分 */}
            {tool.resources && (
              <div className="border-t border-gray-200 pt-6 sm:pt-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiFileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">相关资料</h2>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200/50">
                  <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed text-sm sm:text-base">
                    {tool.resources.split('\n').map((line, index) => (
                      <div key={index} className={`${line.trim() === '' ? 'h-3 sm:h-4' : 'mb-2 sm:mb-3 last:mb-0'}`}>
                        {line.trim() === '' ? null : (
                          <div className="flex items-start gap-1.5 sm:gap-2">
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full mt-2 sm:mt-2.5 flex-shrink-0"></div>
                            <div className="flex-1 break-words">
                              {convertUrlsToLinks(line)}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 相关资讯部分 */}
            <ToolNewsSection toolId={tool.id} toolName={tool.name} />
          </div>
        </div>
      </div>

      {/* 页面底部提示 */}
      <div className="text-center py-6 sm:py-8 px-4">
        <p className="text-gray-500 text-xs sm:text-sm">
          发现更多优秀工具 • 
          <Link href="/tools" className="text-blue-600 hover:text-blue-700"> 浏览所有工具</Link>
        </p>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic'