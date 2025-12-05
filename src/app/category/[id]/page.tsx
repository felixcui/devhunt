import { Metadata } from 'next';
import CategoryPageClient from './CategoryPageClient';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // 客户端渲染：不在服务端请求数据
  return <CategoryPageClient categoryId={id} />;
}
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return {
    title: `分类 - ${id} - AI研发工具`,
    description: 'AI研发工具导航'
  };
}

export const dynamic = 'force-dynamic'
