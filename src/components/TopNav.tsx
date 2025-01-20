'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiClock, FiPlus, FiGrid, FiTrendingUp } from 'react-icons/fi';

const SUBMIT_TOOL_URL = 'https://nhihqe5yfi.feishu.cn/share/base/form/shrcnH6nUO2x2ddTTXtZCGVKKcc';

export default function TopNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/news', icon: FiClock, label: '工具资讯' },
    { href: '/hot', icon: FiTrendingUp, label: '热门工具' },
    { href: '/tools', icon: FiGrid, label: '全部工具' },
  ];

  return (
    <nav className="fixed top-0 right-0 left-64 h-16 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-40">
      <div className="h-full max-w-6xl mx-auto px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                  ${isActive 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          
          <a
            href={SUBMIT_TOOL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            <span>提交工具</span>
          </a>
        </div>
      </div>
    </nav>
  );
}