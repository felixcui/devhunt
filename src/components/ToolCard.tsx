'use client';

import Link from 'next/link';
import { Tool } from '@/types';
import { FiBox, FiArrowUpRight } from 'react-icons/fi';
import { useEffect } from 'react';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  if (!tool) return null;

  const hasValidTags = tool.tags && Array.isArray(tool.tags) && tool.tags.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow p-6 group">
      <div className="flex items-center justify-between mb-4">
        <Link href={`/tool/${tool.id}`} className="flex items-center gap-3">
          <FiBox className="w-6 h-6 text-blue-500 flex-shrink-0" />
          <h3 className="font-bold text-lg">{tool.name}</h3>
        </Link>
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
          title="访问工具"
        >
          <FiArrowUpRight className="w-5 h-5" />
        </a>
      </div>

      <Link href={`/tool/${tool.id}`} className="block">
        <p className="text-gray-600 text-sm whitespace-pre-line mb-4">
          {tool.description}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
              {tool.category}
            </span>
            {hasValidTags && tool.tags&&tool.tags.map((tag, index) => (
              <span 
                key={index}
                className="bg-rose-50 text-rose-500 px-2 py-0.5 rounded-full text-xs border border-rose-100"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
} 