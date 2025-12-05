import { getTools } from '@/lib/server/tools';
import ToolGrid from '@/components/ToolGrid';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

// 强制动态渲染此页面
export const dynamic = 'force-dynamic';

export default async function HotToolsPage() {
  // 获取所有工具
  const allTools = await getTools();

  // 筛选包含"hot"标签的工具
  const hotTools = allTools.filter(tool => {
    if (!tool.tags || !Array.isArray(tool.tags)) {
      return false;
    }
    return tool.tags.some(tag => {
      const lowerTag = tag.toLowerCase().trim();
      return lowerTag === 'hot';
    });
  });

  return (
    <div>
      {/* 返回按钮 */}
      <div className="mb-6 sm:mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:bg-gray-100 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base"
        >
          <FiArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          返回首页
        </Link>
      </div>

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1.5 sm:mb-2">热门工具</h1>
        <p className="text-sm sm:text-base text-gray-600">精选推荐的AI研发工具</p>
      </div>
      {hotTools.length === 0 ? (
        <div className="text-center py-12 px-4">
          <p className="text-sm sm:text-base text-gray-500">暂无热门工具</p>
        </div>
      ) : (
        <ToolGrid tools={hotTools} from="hot" />
      )}
    </div>
  );
}