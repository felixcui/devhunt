'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiExternalLink } from 'react-icons/fi';

interface ResourceItem {
  name: string;
  link: string;
  description: string;
  tool: string;
  category: string;
}

interface ResourceData {
  tool: string;
  total: number;
  categories: Record<string, ResourceItem[]>;
}

// 工具名称映射
const toolNames: Record<string, string> = {
  'claude-code': 'Claude Code',
  'cursor': 'Cursor'
};

export default function ToolResourcePage() {
  const params = useParams();
  const tool = params.tool as string;
  const [data, setData] = useState<ResourceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/resource/feishu?tool=${encodeURIComponent(tool)}`);
        const json = await res.json();
        
        if (json.code === 0) {
          setData(json.data);
        } else {
          setError(json.msg || '获取数据失败');
        }
      } catch (err) {
        console.error('Error fetching resource:', err);
        setError('网络错误，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    if (tool) {
      fetchData();
    }
  }, [tool]);

  const displayName = toolNames[tool] || tool;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
      <div className="mb-4 flex items-center gap-3">
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-accent-600 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          返回资讯列表
        </Link>
      </div>

      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {displayName} 资源合集
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          精选 {displayName} 相关的工具、教程和资源
        </p>
      </header>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-500">加载中...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {!loading && !error && data && (
        <div className="space-y-10">
          {Object.entries(data.categories).map(([category, items]) => (
            <section key={category}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                {category}
              </h2>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-lg font-semibold text-accent-600 hover:underline"
                        >
                          {item.name}
                          <FiExternalLink className="w-4 h-4 flex-shrink-0" />
                        </a>
                        <p className="mt-1 text-gray-600 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {Object.keys(data.categories).length === 0 && (
            <div className="text-center py-10 text-gray-500">
              暂无 {displayName} 相关资源
            </div>
          )}
        </div>
      )}
    </div>
  );
}

