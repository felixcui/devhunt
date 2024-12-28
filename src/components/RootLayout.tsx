import CategoryList from './CategoryList';
import Link from 'next/link';
import TopNav from './TopNav';
import { FiBox } from 'react-icons/fi';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 左侧导航栏 */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg p-6 overflow-y-auto z-50">
        <Link href="/" className="block">
          <div className="flex items-center gap-2 mb-6">
            <FiBox className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
              AI研发工具
            </h1>
          </div>
        </Link>
        <CategoryList />
      </aside>

      {/* 顶部导航栏 */}
      <TopNav />

      {/* 主内容区域 */}
      <main className="ml-64">
        <div className="max-w-6xl mx-auto px-8 pt-24 pb-8">
          {children}
        </div>
      </main>
    </div>
  );
} 