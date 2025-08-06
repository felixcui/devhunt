'use client';

import { Tool } from '@/types';
import ToolCard from './ToolCard';

interface ToolGridProps {
  tools: Tool[];
  featured?: string[]; // 精选工具ID数组
}

export default function ToolGrid({ tools, featured = [] }: ToolGridProps) {
  if (!Array.isArray(tools)) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {tools.map((tool, index) => {
        if (!tool || typeof tool !== 'object') {
          return null;
        }
        
        const isFeatured = featured.includes(tool.id) || index < 3; // 前3个或指定的为精选
        
        return (
          <div 
            key={tool.id} 
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ToolCard tool={tool} featured={isFeatured && index < 3} />
          </div>
        );
      })}
    </div>
  );
} 