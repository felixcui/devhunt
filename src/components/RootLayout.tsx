'use client';

import CategoryList from './CategoryList';
import Link from 'next/link';
import TopNav from './TopNav';
import { FiZap } from 'react-icons/fi';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* 左侧导航栏 */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-white/90 backdrop-blur-xl border-r border-gray-200/50 shadow-soft-lg z-50 overflow-y-auto">
        <div className="p-6">
          {/* Logo区域 */}
          <Link href="/" className="block group">
            <div className="flex items-center justify-center mb-8 p-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-soft transform transition-all duration-200 hover:scale-[1.02] hover:shadow-soft-lg">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-center">
                  AICoding基地
                </h1>
              </div>
              <FiZap className="w-5 h-5 ml-3 group-hover:animate-bounce-subtle" />
            </div>
          </Link>

          {/* 统计信息 */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200/50">
              <div className="text-lg font-bold text-blue-700">200+</div>
              <div className="text-xs text-blue-600">精选工具</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200/50">
              <div className="text-lg font-bold text-purple-700">15+</div>
              <div className="text-xs text-purple-600">工具分类</div>
            </div>
          </div>

          {/* 分类列表 */}
          <div className="space-y-2">
            <h2 className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-3">
              工具分类
            </h2>
            <CategoryList />
          </div>
        </div>
      </aside>

      {/* 顶部导航栏 */}
      <TopNav />

      {/* 主内容区域 */}
      <main className="ml-72 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-8 pt-24 pb-12">
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>

      {/* 右下角返回顶部按钮 */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-soft-lg hover:shadow-lg transition-all duration-200 hover:scale-110 z-40 flex items-center justify-center group"
        aria-label="返回顶部"
      >
        <svg className="w-5 h-5 transform transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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