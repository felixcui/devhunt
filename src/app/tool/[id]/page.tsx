'use client';

import { useEffect, useState } from 'react';
import { fetchTools } from '@/data/tools';
import { notFound, useSearchParams } from 'next/navigation';
import { FiCode, FiExternalLink, FiTag, FiFileText, FiArrowLeft, FiGlobe, FiStar } from 'react-icons/fi';
import Link from 'next/link';
import { getCategoryDisplayName } from '@/utils/category-mapping';
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
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-8 w-48"></div>
          <div className="bg-white rounded-3xl p-8">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
              <div className="flex-1">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="h-10 bg-gray-200 rounded w-32"></div>
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
    <div className="max-w-5xl mx-auto space-y-8">
      {/* 智能返回按钮 */}
      <div>
        <Link 
          href={returnInfo.path}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:bg-gray-100 px-3 py-2 rounded-lg"
        >
          <FiArrowLeft className="w-4 h-4" />
          {returnInfo.label}
        </Link>
      </div>

      {/* 主要内容区域 */}
      <div className="relative">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-green-500/5 rounded-3xl blur-xl"></div>
        
        <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/20 overflow-hidden">
          {/* 工具头部信息 */}
          <div className="p-8">
            <div className="flex items-start gap-6 mb-8">
              {/* 工具图标 */}
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center shadow-soft">
                  <FiCode className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <FiStar className="w-2.5 h-2.5 text-white" />
                </div>
              </div>

              {/* 工具基本信息 */}
              <div className="flex-1 min-w-0">
                {/* 工具名字、标签和访问工具按钮在同一行 */}
                <div className="flex items-center gap-4 mb-4 flex-wrap">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {tool.name}
                  </h1>
                  
                  <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-soft">
                    <FiTag className="w-3 h-3" />
                    {getCategoryDisplayName(tool.category)}
                  </span>
                  
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-soft hover:from-blue-600 hover:to-green-600 transition-all duration-200 hover:scale-105"
                  >
                    <FiGlobe className="w-3 h-3" />
                    访问工具
                    <FiExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line mb-6">
                  {tool.description}
                </p>
              </div>
            </div>

            {/* 相关资料部分 */}
            {tool.resources && (
              <div className="border-t border-gray-200 pt-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                    <FiFileText className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">相关资料</h2>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-6 border border-gray-200/50">
                  <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">
                    {tool.resources.split('\n').map((line, index) => (
                      <div key={index} className={`${line.trim() === '' ? 'h-4' : 'mb-3 last:mb-0'}`}>
                        {line.trim() === '' ? null : (
                          <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>
                            <div className="flex-1">
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
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">
          发现更多优秀工具 • 
          <Link href="/tools" className="text-blue-600 hover:text-blue-700"> 浏览所有工具</Link>
        </p>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic'