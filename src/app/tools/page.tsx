import { getTools } from '@/lib/server/tools';
import ToolsList from '@/components/ToolsList';

export const dynamic = 'force-dynamic';

export default async function ToolsPage() {
  const tools = await getTools();
  return <ToolsList initialTools={tools} />;
}