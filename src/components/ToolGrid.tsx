'use client';

import { Tool } from '@/types';
import { FiBox } from 'react-icons/fi';
import Link from 'next/link';

interface ToolGridProps {
  tools: Tool[];
}

export default function ToolGrid({ tools }: ToolGridProps) {
  if (!Array.isArray(tools)) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => {
        if (!tool || typeof tool !== 'object') {
          return null;
        }
        
        const hasValidTags = tool.tags && Array.isArray(tool.tags) && tool.tags.length > 0;
        
        return (
          <div key={tool.id} className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <Link href={`/tool/${tool.id}`} className="block">
              <div className="flex items-center gap-2 mb-3">
                <FiBox className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold">{tool.name}</h2>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-2">{tool.description}</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
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
            </Link>
          </div>
        );
      })}
    </div>
  );
} 