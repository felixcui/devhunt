import { fetchTools } from '@/data/tools';
import RootLayout from '@/components/RootLayout';
import ToolGrid from '@/components/ToolGrid';
import { formatDate } from '@/utils/date';

export default async function RecentToolsPage() {
  // 获取所有工具
  const tools = await fetchTools();

  // 兼容 updateTime 为数字或字符串，过滤掉没有 updateTime 的工具
  const sorted = [...tools]
    .filter(tool => tool.updateTime !== undefined && tool.updateTime !== null && tool.updateTime !== '')
    .sort((a, b) => {
      const timeA = typeof a.updateTime === 'string' ? parseInt(a.updateTime) : Number(a.updateTime);
      const timeB = typeof b.updateTime === 'string' ? parseInt(b.updateTime) : Number(b.updateTime);
      return timeB - timeA;
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
        <ToolGrid tools={sorted.map(tool => ({
          ...tool,
          // 兼容ToolGrid内部如需显示时间，确保传递正确的时间戳格式
          updateTime: tool.updateTime ? formatDate(typeof tool.updateTime === 'string' ? parseInt(tool.updateTime) : tool.updateTime) : '',
        }))} />
      )}
    </RootLayout>
  );
} 