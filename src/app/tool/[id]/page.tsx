import { fetchTools } from '@/data/tools';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { FiBox, FiExternalLink, FiTag, FiFileText, FiArrowLeft, FiGlobe, FiStar } from 'react-icons/fi';
import Link from 'next/link';
import { getCategoryDisplayName } from '@/utils/category-mapping';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

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

export default async function ToolPage({ params }: PageProps) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    const tools = await fetchTools();
    
    if (!Array.isArray(tools)) {
      throw new Error('Failed to fetch tools');
    }
    
    const tool = tools.find(t => t && typeof t === 'object' && t.id === id);
    
    if (!tool) {
      return notFound();
    }

    return (
      <div className="max-w-5xl mx-auto space-y-8">
        {/* 返回按钮 */}
        <div>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:bg-gray-100 px-3 py-2 rounded-lg"
          >
            <FiArrowLeft className="w-4 h-4" />
            返回工具列表
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
                    <FiBox className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <FiStar className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>

                {/* 工具基本信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      {tool.name}
                    </h1>
                    
                    <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-soft">
                      <FiTag className="w-3 h-3" />
                      {getCategoryDisplayName(tool.category)}
                    </span>
                  </div>

                  <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line mb-6">
                    {tool.description}
                  </p>

                  {/* 操作按钮 */}
                  <div className="flex gap-4">
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-green-600 transition-all duration-200 hover:scale-105 shadow-soft hover:shadow-soft-lg font-medium"
                    >
                      <FiGlobe className="w-4 h-4" />
                      访问工具
                      <FiExternalLink className="w-4 h-4" />
                    </a>
                    
                    <Link
                      href={`/tool/${tool.id}/news?name=${encodeURIComponent(tool.name)}`}
                      className="inline-flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:scale-105 shadow-soft hover:shadow-soft-lg border border-gray-200 font-medium"
                    >
                      <FiFileText className="w-4 h-4" />
                      相关资讯
                    </Link>
                  </div>
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
  } catch (error) {
    console.error('Error in ToolPage:', error);
    return notFound();
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    const tools = await fetchTools();
    
    if (!Array.isArray(tools)) {
      throw new Error('Failed to fetch tools');
    }
    
    const tool = tools.find(t => t && typeof t === 'object' && t.id === id);
    
    return {
      title: tool ? `${tool.name} - AICoding基地` : 'AICoding基地',
      description: tool?.description || 'AI开发工具导航平台'
    };
  } catch (error) {
    console.error('Error in generateMetadata:', error);
    return {
      title: 'AICoding基地',
      description: 'AI开发工具导航平台'
    };
  }
}

export const dynamic = 'force-dynamic'