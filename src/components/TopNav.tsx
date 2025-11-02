'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiClock, FiPlus, FiGrid, FiTrendingUp, FiFileText, FiInfo, FiCpu } from 'react-icons/fi';
import { IconType } from 'react-icons';

const SUBMIT_TOOL_URL = 'https://nhihqe5yfi.feishu.cn/share/base/form/shrcnH6nUO2x2ddTTXtZCGVKKcc';
const ABOUT_URL = 'https://nhihqe5yfi.feishu.cn/wiki/KBlUwLv56izVmdk5xzncJUAFnHd';

// 导航项接口定义
interface NavItem {
  href: string;
  icon: IconType;
  label: string;
  badge?: 'New' | 'Hot';
  external?: boolean;
}

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

  const navItems: NavItem[] = [
    { href: '/news', icon: FiFileText, label: '工具资讯', badge: 'New' },
    { href: '/hot', icon: FiTrendingUp, label: '热门工具', badge: 'Hot' },
    { href: '/recent', icon: FiClock, label: '最近收录' },
    { href: '/tools', icon: FiGrid, label: '全部工具' },
    { href: '/ai-news', icon: FiCpu, label: '其他资讯', badge: 'New' },
    { href: ABOUT_URL, icon: FiInfo, label: '入群交流', external: true },
  ];

  return (
    <>
      <nav className={`fixed top-0 right-0 left-0 lg:left-72 h-16 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200/80 shadow-soft' 
          : 'bg-transparent'
      }`}>
        <div className="h-full max-w-7xl mx-auto pl-14 pr-2 sm:px-6 lg:px-6 flex items-center justify-between">
          {/* 左侧导航 */}
          <div className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto hide-scrollbar flex-1 mr-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`relative flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 group whitespace-nowrap
                    text-gray-600 hover:text-primary-600 hover:bg-primary-50/80`}
                >
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:scale-110 flex-shrink-0" />
                  <span className="font-medium text-xs sm:text-sm lg:text-base">{item.label}</span>
                  {item.badge && (
                    <span className={`absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 px-1 sm:px-1.5 py-0.5 text-[10px] sm:text-xs font-bold rounded-full ${
                      item.badge === 'New' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white animate-pulse'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 group whitespace-nowrap
                    ${isActive 
                      ? 'text-white bg-gradient-to-r from-blue-500 to-green-500 shadow-soft' 
                      : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50/80'
                    }`}
                >
                  <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:scale-110 flex-shrink-0 ${
                    isActive ? 'text-white' : ''
                  }`} />
                  <span className="font-medium text-xs sm:text-sm lg:text-base">{item.label}</span>
                  {item.badge && (
                    <span className={`absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 px-1 sm:px-1.5 py-0.5 text-[10px] sm:text-xs font-bold rounded-full ${
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
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* 提交工具按钮 */}
            <a
              href={SUBMIT_TOOL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 rounded-full category-badge font-medium text-xs shadow-soft hover:shadow-lg transition-all duration-200 hover:scale-105 group whitespace-nowrap"
            >
              <FiPlus className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-xs sm:text-sm hidden sm:inline">提交工具</span>
            </a>
          </div>
        </div>

        {/* 分隔线 */}
        <div className={`absolute bottom-0 left-4 sm:left-6 right-4 sm:right-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent transition-opacity duration-300 ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`}></div>
      </nav>

    </>
  );
}