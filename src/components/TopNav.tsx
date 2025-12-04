'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { FiFileText, FiBookOpen, FiChevronDown, FiUsers, FiTag, FiCode, FiCpu } from 'react-icons/fi';
import { IconType } from 'react-icons';

// 导航项接口定义
interface NavItem {
  href: string;
  icon: IconType;
  label: string;
  badge?: 'New' | 'Hot';
  external?: boolean;
}

function TopNavContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');
  const [isScrolled, setIsScrolled] = useState(false);
  const [weeklyItems, setWeeklyItems] = useState<{ slug: string; title: string }[]>([]);
  const [weeklyOpen, setWeeklyOpen] = useState(false);
  const [weeklyLoaded, setWeeklyLoaded] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [newsCategories, setNewsCategories] = useState<string[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [resourceOpen, setResourceOpen] = useState(false);
  const [resourceItems, setResourceItems] = useState<{ slug: string; title: string }[]>([]);
  const [resourceLoaded, setResourceLoaded] = useState(false);
  const [aiNewsOpen, setAiNewsOpen] = useState(false);
  const [aiNewsCategories, setAiNewsCategories] = useState<string[]>([]);
  const [aiNewsCategoriesLoaded, setAiNewsCategoriesLoaded] = useState(false);
  const weeklyRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const resourceRef = useRef<HTMLDivElement>(null);
  const aiNewsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 点击外部区域关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (weeklyRef.current && !weeklyRef.current.contains(event.target as Node)) {
        setWeeklyOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setCategoryOpen(false);
      }
      if (resourceRef.current && !resourceRef.current.contains(event.target as Node)) {
        setResourceOpen(false);
      }
      if (aiNewsRef.current && !aiNewsRef.current.contains(event.target as Node)) {
        setAiNewsOpen(false);
      }
    };

    if (weeklyOpen || categoryOpen || resourceOpen || aiNewsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [weeklyOpen, categoryOpen, resourceOpen, aiNewsOpen]);

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

  // 获取资讯分类列表
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/news/categories');
        if (!res.ok) {
          console.error('Failed to fetch categories:', res.status);
          return;
        }
        const data = await res.json();
        if (data.code === 0 && Array.isArray(data.data?.categories)) {
          setNewsCategories(data.data.categories);
        } else {
          console.error('Invalid categories response:', data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setCategoriesLoaded(true);
      }
    };

    fetchCategories();
  }, []);

  // 获取编程资源列表
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch('/api/resource');
        if (!res.ok) {
          console.error('Failed to fetch resources:', res.status);
          return;
        }
        const data = await res.json();
        if (data.code === 0 && Array.isArray(data.data?.items)) {
          setResourceItems(data.data.items);
        } else {
          console.error('Invalid resources response:', data);
        }
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setResourceLoaded(true);
      }
    };

    fetchResources();
  }, []);

  // 获取AI资讯分类列表
  useEffect(() => {
    const fetchAiNewsCategories = async () => {
      try {
        const res = await fetch('/api/ai-news/categories');
        if (!res.ok) {
          console.error('Failed to fetch AI news categories:', res.status);
          return;
        }
        const data = await res.json();
        if (data.code === 0 && Array.isArray(data.data?.categories)) {
          setAiNewsCategories(data.data.categories);
        } else {
          console.error('Invalid AI news categories response:', data);
        }
      } catch (error) {
        console.error('Error fetching AI news categories:', error);
      } finally {
        setAiNewsCategoriesLoaded(true);
      }
    };

    fetchAiNewsCategories();
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
                ${pathname === '/news' && !currentCategory
                  ? 'text-white bg-gradient-to-r from-blue-500 to-green-500 shadow-soft' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50/80'
                }`}
            >
              <FiFileText className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:scale-110 flex-shrink-0 ${
                pathname === '/news' && !currentCategory ? 'text-white' : ''
              }`} />
              <span className="font-medium text-xs sm:text-sm lg:text-base">每日资讯</span>
            </Link>

            {/* 资讯分类下拉菜单 */}
            <div className="relative" ref={categoryRef}>
              <button
                type="button"
                onClick={() => setCategoryOpen((prev) => !prev)}
                className={`relative flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 group whitespace-nowrap ${
                  pathname === '/news' && currentCategory
                    ? 'text-white bg-gradient-to-r from-blue-500 to-green-500 shadow-soft'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50/80'
                }`}
              >
                <FiTag className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:scale-110 flex-shrink-0" />
                <span className="font-medium text-xs sm:text-sm lg:text-base">
                  {currentCategory && pathname === '/news' 
                    ? currentCategory
                    : '资讯分类'}
                </span>
                <FiChevronDown
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform ${
                    categoryOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {categoryOpen && categoriesLoaded && (
                <div className="absolute left-0 mt-2 w-32 sm:w-40 bg-white rounded-xl shadow-soft border border-gray-100 py-1 z-50">
                  {newsCategories.length === 0 ? (
                    <div className="px-3 py-2 text-xs sm:text-sm text-gray-400">暂无分类</div>
                  ) : (
                    newsCategories.map((cat) => (
                      <Link
                        key={cat}
                        href={`/news?category=${encodeURIComponent(cat)}`}
                        className={`flex items-center px-3 py-1.5 text-xs sm:text-sm transition-colors ${
                          currentCategory === cat
                            ? 'text-primary-600 bg-primary-50/80'
                            : 'text-gray-700 hover:bg-primary-50/80 hover:text-primary-600'
                        }`}
                        onClick={() => setCategoryOpen(false)}
                      >
                        <span className="truncate">{cat}</span>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* 资讯周报下拉菜单 */}
            <div className="relative" ref={weeklyRef}>
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

            {/* 编程资源下拉菜单 */}
            <div className="relative" ref={resourceRef}>
              <button
                type="button"
                onClick={() => setResourceOpen((prev) => !prev)}
                className={`relative flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 group whitespace-nowrap ${
                  pathname.startsWith('/resource')
                    ? 'text-white bg-gradient-to-r from-blue-500 to-green-500 shadow-soft'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50/80'
                }`}
              >
                <FiCode className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:scale-110 flex-shrink-0" />
                <span className="font-medium text-xs sm:text-sm lg:text-base">编程资源</span>
                <FiChevronDown
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform ${
                    resourceOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {resourceOpen && resourceLoaded && (
                <div className="absolute left-0 mt-2 w-40 sm:w-52 bg-white rounded-xl shadow-soft border border-gray-100 py-1 z-50">
                  {/* 固定的工具资源菜单 */}
                  <Link
                    href="/resource/tool/claude-code"
                    className={`flex items-center px-3 py-1.5 text-xs sm:text-sm transition-colors ${
                      pathname === '/resource/tool/claude-code'
                        ? 'text-primary-600 bg-primary-50/80'
                        : 'text-gray-700 hover:bg-primary-50/80 hover:text-primary-600'
                    }`}
                    onClick={() => setResourceOpen(false)}
                  >
                    <span className="truncate">Claude Code</span>
                  </Link>
                  <Link
                    href="/resource/tool/cursor"
                    className={`flex items-center px-3 py-1.5 text-xs sm:text-sm transition-colors ${
                      pathname === '/resource/tool/cursor'
                        ? 'text-primary-600 bg-primary-50/80'
                        : 'text-gray-700 hover:bg-primary-50/80 hover:text-primary-600'
                    }`}
                    onClick={() => setResourceOpen(false)}
                  >
                    <span className="truncate">Cursor</span>
                  </Link>
                  {/* 分隔线 */}
                  {resourceItems.length > 0 && (
                    <div className="my-1 border-t border-gray-100"></div>
                  )}
                  {/* 文件资源列表 */}
                  {resourceItems.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/resource/${encodeURIComponent(item.slug)}`}
                      className="flex items-center px-3 py-1.5 text-xs sm:text-sm text-gray-700 hover:bg-primary-50/80 hover:text-primary-600 transition-colors"
                      onClick={() => setResourceOpen(false)}
                    >
                      <span className="truncate">{item.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* AI资讯下拉菜单 */}
            <div className="relative" ref={aiNewsRef}>
              <button
                type="button"
                onClick={() => setAiNewsOpen((prev) => !prev)}
                className={`relative flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 group whitespace-nowrap ${
                  pathname === '/ai-news'
                    ? 'text-white bg-gradient-to-r from-blue-500 to-green-500 shadow-soft'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50/80'
                }`}
              >
                <FiCpu className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:scale-110 flex-shrink-0" />
                <span className="font-medium text-xs sm:text-sm lg:text-base">周边资讯</span>
                <FiChevronDown
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform ${
                    aiNewsOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {aiNewsOpen && aiNewsCategoriesLoaded && (
                <div className="absolute left-0 mt-2 w-32 sm:w-40 bg-white rounded-xl shadow-soft border border-gray-100 py-1 z-50">
                  {/* 全部资讯 */}
                  <Link
                    href="/ai-news"
                    className={`flex items-center px-3 py-1.5 text-xs sm:text-sm transition-colors ${
                      pathname === '/ai-news' && !searchParams.get('category')
                        ? 'text-primary-600 bg-primary-50/80'
                        : 'text-gray-700 hover:bg-primary-50/80 hover:text-primary-600'
                    }`}
                    onClick={() => setAiNewsOpen(false)}
                  >
                    <span className="truncate">全部资讯</span>
                  </Link>
                  {/* 分隔线 */}
                  {aiNewsCategories.length > 0 && (
                    <div className="my-1 border-t border-gray-100"></div>
                  )}
                  {/* 分类列表 */}
                  {aiNewsCategories.map((cat) => (
                    <Link
                      key={cat}
                      href={`/ai-news?category=${encodeURIComponent(cat)}`}
                      className={`flex items-center px-3 py-1.5 text-xs sm:text-sm transition-colors ${
                        searchParams.get('category') === cat && pathname === '/ai-news'
                          ? 'text-primary-600 bg-primary-50/80'
                          : 'text-gray-700 hover:bg-primary-50/80 hover:text-primary-600'
                      }`}
                      onClick={() => setAiNewsOpen(false)}
                    >
                      <span className="truncate">{cat}</span>
                    </Link>
                  ))}
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

export default function TopNav() {
  return (
    <Suspense fallback={null}>
      <TopNavContent />
    </Suspense>
  );
}