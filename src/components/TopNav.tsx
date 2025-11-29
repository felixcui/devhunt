'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiFileText, FiBookOpen, FiChevronDown, FiUsers } from 'react-icons/fi';
import { IconType } from 'react-icons';

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
  const [weeklyItems, setWeeklyItems] = useState<{ slug: string; title: string }[]>([]);
  const [weeklyOpen, setWeeklyOpen] = useState(false);
  const [weeklyLoaded, setWeeklyLoaded] = useState(false);

  // 资讯分类列表（使用中文名称匹配飞书表格中的分类）
  const newsCategories = [
    { id: '编程实践', label: '编程实践' },
    { id: '编程模型', label: '编程模型' },
    { id: '工具平台', label: '工具平台' },
    { id: '行业观点', label: '行业观点' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchWeekly = async () => {
      try {
        const res = await fetch('/api/weekly');
        if (!res.ok) {
          console.error('Failed to fetch weekly list:', res.status);
          return;
        }
        const data = await res.json();
        if (data.code === 0 && Array.isArray(data.data?.items)) {
          setWeeklyItems(data.data.items);
        } else {
          console.error('Invalid weekly list response:', data);
        }
      } catch (error) {
        console.error('Error fetching weekly list:', error);
      } finally {
        setWeeklyLoaded(true);
      }
    };

    fetchWeekly();
  }, []);

  const navItems: NavItem[] = [
    // { href: '/tools', icon: FiGrid, label: '全部工具' },  // 暂时隐藏
    { href: '/about', icon: FiUsers, label: '关于我们' },
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
          <div className="flex items-center gap-0.5 sm:gap-1 flex-1 mr-2">
            {/* 每日资讯 */}
            <Link
              href="/news"
              className={`relative flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 group whitespace-nowrap
                ${pathname === '/news' && !new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').has('category')
                  ? 'text-white bg-gradient-to-r from-blue-500 to-green-500 shadow-soft' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50/80'
                }`}
            >
              <FiFileText className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:scale-110 flex-shrink-0 ${
                pathname === '/news' ? 'text-white' : ''
              }`} />
              <span className="font-medium text-xs sm:text-sm lg:text-base">每日资讯</span>
            </Link>

            {/* 资讯分类平铺展示 */}
            {newsCategories.map((cat) => {
              const isActive = pathname === '/news' && typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('category') === cat.id;
              return (
                <Link
                  key={cat.id}
                  href={`/news?category=${cat.id}`}
                  className={`relative flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 group whitespace-nowrap
                    ${isActive
                      ? 'text-white bg-gradient-to-r from-blue-500 to-green-500 shadow-soft' 
                      : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50/80'
                    }`}
                >
                  <span className="font-medium text-xs sm:text-sm lg:text-base">{cat.label}</span>
                </Link>
              );
            })}

            {/* AI资讯 - 暂时隐藏 */}
            {/* <Link
              href="/ai-news"
              className={`relative flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 group whitespace-nowrap
                ${pathname === '/ai-news'
                  ? 'text-white bg-gradient-to-r from-blue-500 to-green-500 shadow-soft' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50/80'
                }`}
            >
              <FiCpu className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:scale-110 flex-shrink-0 ${
                pathname === '/ai-news' ? 'text-white' : ''
              }`} />
              <span className="font-medium text-xs sm:text-sm lg:text-base">AI资讯</span>
            </Link> */}

            {/* 资讯周报下拉菜单 */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setWeeklyOpen((prev) => !prev)}
                className={`relative flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 group whitespace-nowrap ${
                  pathname.startsWith('/weekly')
                    ? 'text-white bg-gradient-to-r from-blue-500 to-green-500 shadow-soft'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50/80'
                }`}
              >
                <FiBookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:scale-110 flex-shrink-0" />
                <span className="font-medium text-xs sm:text-sm lg:text-base">资讯周报</span>
                <FiChevronDown
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform ${
                    weeklyOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {weeklyOpen && weeklyLoaded && (
                <div className="absolute left-0 mt-2 w-40 sm:w-52 bg-white rounded-xl shadow-soft border border-gray-100 py-1 z-50">
                  {weeklyItems.length === 0 ? (
                    <div className="px-3 py-2 text-xs sm:text-sm text-gray-400">暂无周报</div>
                  ) : (
                    weeklyItems.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/weekly/${encodeURIComponent(item.slug)}`}
                        className="flex items-center px-3 py-1.5 text-xs sm:text-sm text-gray-700 hover:bg-primary-50/80 hover:text-primary-600 transition-colors"
                        onClick={() => setWeeklyOpen(false)}
                      >
                        <span className="truncate">{item.title}</span>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

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
                </Link>
              );
            })}
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