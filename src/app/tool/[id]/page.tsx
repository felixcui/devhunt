import { fetchTools } from '@/data/tools';
import { notFound } from 'next/navigation';
import RootLayout from '@/components/RootLayout';
import { Metadata } from 'next';
import { FiBox } from 'react-icons/fi';
import Link from 'next/link';

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
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {part}
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
      <RootLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <FiBox className="w-8 h-8 text-blue-500" />
                <h1 className="text-3xl font-bold">{tool.name}</h1>
              </div>
              <p className="text-gray-600 mb-4 whitespace-pre-line">
                {tool.description}
              </p>
              <div className="mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {tool.category}
                </span>
              </div>
              <div className="flex gap-4">
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                >
                  访问工具
                </a>
                <Link
                  href={`/tool/${tool.id}/news?name=${encodeURIComponent(tool.name)}`}
                  className="inline-block bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200"
                >
                  相关资讯
                </Link>
              </div>
              {tool.resources && (
                <div className="mt-6">
                  <h2 className="text-xl font-bold mb-3">相关资料</h2>
                  <div className="prose prose-blue max-w-none text-gray-600 whitespace-pre-wrap rounded-lg bg-gray-50 p-4">
                    {tool.resources.split('\n').map((line, index) => (
                      <div key={index} className={`${line.trim() === '' ? 'h-4' : 'mb-2'}`}>
                        {line.trim() === '' ? null : convertUrlsToLinks(line)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </RootLayout>
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
      title: tool ? `${tool.name} - AI研发工具` : 'AI研发工具',
      description: tool?.description || 'AI研发工具导航'
    };
  } catch (error) {
    console.error('Error in generateMetadata:', error);
    return {
      title: 'AI研发工具',
      description: 'AI研发工具导航'
    };
  }
}

export const dynamic = 'force-dynamic'