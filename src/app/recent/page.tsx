import { fetchTools } from '@/data/tools';
import RootLayout from '@/components/RootLayout';
import ToolGrid from '@/components/ToolGrid';

export default async function RecentToolsPage() {
  // 获取所有工具
  const tools = await fetchTools();

  // 按 updateTime 倒序排序，取前20个
  const sorted = [...tools]
    .filter(tool => tool.updateTime)
    .sort((a, b) => {
      const tA = a.updateTime ? new Date(a.updateTime).getTime() : 0;
      const tB = b.updateTime ? new Date(b.updateTime).getTime() : 0;
      return tB - tA;
    })
    .slice(0, 20);

  return (
    <RootLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">最近收录</h1>
        <p className="text-gray-600">最新收录的20个AI开发工具</p>
      </div>
      {sorted.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">暂无最近收录工具</p>
        </div>
      ) : (
        <ToolGrid tools={sorted} />
      )}
    </RootLayout>
  );
} 