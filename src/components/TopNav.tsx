'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiClock, FiPlus, FiGrid, FiTrendingUp, FiFileText } from 'react-icons/fi';

const SUBMIT_TOOL_URL = 'https://nhihqe5yfi.feishu.cn/share/base/form/shrcnH6nUO2x2ddTTXtZCGVKKcc';

export default function TopNav() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/news', icon: FiFileText, label: '工具资讯', badge: 'New' },
    { href: '/hot', icon: FiTrendingUp, label: '热门工具', badge: 'Hot' },
    { href: '/recent', icon: FiClock, label: '最近收录' },
    { href: '/tools', icon: FiGrid, label: '全部工具' },
  ];

  return (
    <>
      <nav className={`fixed top-0 right-0 left-72 h-16 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200/80 shadow-soft' 
          : 'bg-transparent'
      }`}>
        <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* 左侧导航 */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-200 group
                    ${isActive 
                      ? 'text-white bg-gradient-to-r from-blue-500 to-green-500 shadow-soft' 
                      : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50/80'
                    }`}
                >
                  <Icon className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : ''
                  }`} />
                  <span className="font-medium text-lg">{item.label}</span>
                  {item.badge && (
                    <span className={`absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-bold rounded-full ${
                      item.badge === 'New' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white animate-pulse'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* 右侧操作区 */}
          <div className="flex items-center gap-3">
            {/* 提交工具按钮 */}
            <a
              href={SUBMIT_TOOL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full category-badge font-medium text-xs shadow-soft hover:shadow-lg transition-all duration-200 hover:scale-105 group"
            >
              <FiPlus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-sm">提交工具</span>
            </a>
          </div>
        </div>

        {/* 分隔线 */}
        <div className={`absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent transition-opacity duration-300 ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`}></div>
      </nav>

    </>
  );
}