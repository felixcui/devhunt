import { fetchTools } from '@/data/tools';
import ToolGrid from '@/components/ToolGrid';
import RootLayout from '@/components/RootLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '热门工具 - AI研发工具',
  description: '最受欢迎的AI研发工具'
};

export default async function HotToolsPage() {
  const tools = await fetchTools();
  
  // 筛选包含 "hot" 标签的工具
  const hotTools = tools.filter(tool => 
    tool.tags && 
    Array.isArray(tool.tags) && 
    tool.tags.some(tag => tag.toLowerCase() === 'hot')
  );

  return (
    <RootLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">热门工具</h1>
        <p className="text-gray-600">精选推荐的AI研发工具</p>
      </div>
      {hotTools.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">暂无热门工具</p>
        </div>
      ) : (
        <ToolGrid tools={hotTools} />
      )}
    </RootLayout>
  );
} 