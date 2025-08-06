'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiClock, FiPlus, FiGrid, FiTrendingUp, FiSearch, FiX } from 'react-icons/fi';

const SUBMIT_TOOL_URL = 'https://nhihqe5yfi.feishu.cn/share/base/form/shrcnH6nUO2x2ddTTXtZCGVKKcc';

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 处理键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal(true);
      }
      if (e.key === 'Escape') {
        setShowSearchModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 跳转到工具页面并传递搜索参数，阻止自动滚动
      router.push(`/tools?search=${encodeURIComponent(searchQuery.trim())}`, undefined, { scroll: false });
      setShowSearchModal(false);
      setSearchQuery('');
    }
  };

  const navItems = [
    { href: '/news', icon: FiClock, label: '工具资讯', badge: 'New' },
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
                      ? 'text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-soft' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/80'
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
            {/* 搜索按钮 */}
            <button 
              onClick={() => setShowSearchModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-200 group border border-gray-200/60 hover:border-blue-200"
              aria-label="搜索"
            >
              <FiSearch className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span className="text-sm">搜索工具</span>
            </button>

            {/* 提交工具按钮 */}
            <a
              href={SUBMIT_TOOL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-xs shadow-soft hover:shadow-lg transition-all duration-200 hover:scale-105 group"
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

      {/* 搜索模态框 */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-32">
          {/* 背景遮罩 */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSearchModal(false)}
          />
          
          {/* 搜索框 */}
          <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-soft-lg border border-gray-200/50 overflow-hidden animate-slide-up">
            <form onSubmit={handleSearch}>
              <div className="flex items-center p-4">
                <FiSearch className="w-6 h-6 text-gray-400 mr-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索AI开发工具..."
                  className="flex-1 text-lg placeholder-gray-400 outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowSearchModal(false)}
                  className="ml-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              {/* 搜索提示 */}
              <div className="px-4 pb-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-500 mt-3">
                  <span>按回车键搜索，ESC键关闭</span>
                  <div className="flex gap-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">工具名称</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">分类</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">标签</span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}