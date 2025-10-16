'use client';

import { Tool } from '@/types';
import ToolCard from './ToolCard';

interface ToolGridProps {
  tools: Tool[];
  featured?: string[]; // 精选工具ID数组
  from?: string; // 来源页面标识
}

export default function ToolGrid({ tools, featured = [], from }: ToolGridProps) {
  if (!Array.isArray(tools)) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {tools.map((tool, index) => {
        if (!tool || typeof tool !== 'object') {
          return null;
        }
        
        const isFeatured = featured.includes(tool.id); // 只根据featured数组判断是否为精选
        
        return (
          <div 
            key={tool.id} 
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ToolCard tool={tool} featured={isFeatured} from={from} />
          </div>
        );
      })}
    </div>
  );
}