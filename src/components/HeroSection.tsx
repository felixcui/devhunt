'use client';

import { FiZap } from 'react-icons/fi';
import SearchBar from './SearchBar';

interface HeroSectionProps {
  onSearch?: (query: string) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  return (
    <div className="relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-green-500/10 to-blue-500/10 rounded-3xl blur-2xl"></div>

      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-soft border border-white/20">
        {/* 主标题区域 */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4 shadow-soft">
            <FiZap className="w-4 h-4" />
            <span>AICoding基地</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="gradient-text-brand">发现最佳</span>
            <br />
            <span className="gradient-text-brand">AI编程工具</span>
          </h1>

          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            为开发者精选的AI工具库和实时资讯，助力高效开发
          </p>

          {/* 搜索框 */}
          <div className="max-w-2xl mx-auto">
            <SearchBar
              onSearch={onSearch || (() => {})}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
