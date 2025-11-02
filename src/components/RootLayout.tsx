'use client';

import { useState, useEffect } from 'react';
import CategoryList from './CategoryList';
import Link from 'next/link';
import TopNav from './TopNav';
import { FiMenu, FiX } from 'react-icons/fi';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 关闭侧边栏当路由变化时
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 防止滚动穿透
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* 移动端汉堡菜单按钮 */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
        aria-label="切换菜单"
      >
        {isSidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
      </button>

      {/* 移动端遮罩层 */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 左侧导航栏 */}
      <aside className={`fixed left-0 top-0 h-screen w-72 bg-white/90 backdrop-blur-xl border-r border-gray-200/50 shadow-soft-lg z-50 overflow-y-auto transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="px-6">
          {/* Logo区域 */}
          <Link 
            href="/" 
            className="block group h-16 flex items-center"
            onClick={() => setIsSidebarOpen(false)}
          >
            <div className="flex items-center">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                AICoding基地
              </h1>
            </div>
          </Link>

          {/* 分类列表 */}
          <div className="space-y-2">
            <h2 className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-3">
              工具分类
            </h2>
            <div onClick={() => setIsSidebarOpen(false)}>
              <CategoryList />
            </div>
          </div>
        </div>
      </aside>

      {/* 顶部导航栏 */}
      <TopNav />

      {/* 主内容区域 */}
      <main className="lg:ml-72 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-24 pb-12">
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>

      {/* 右下角返回顶部按钮 */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-full shadow-soft-lg hover:shadow-lg transition-all duration-200 hover:scale-110 z-40 flex items-center justify-center group"
        aria-label="返回顶部"
      >
        <svg className="w-4 h-4 lg:w-5 lg:h-5 transform transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      {/* 渐变背景装饰 */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-pink-600/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>
    </div>
  );
}