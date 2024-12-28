import { fetchTools, fetchCategories } from '@/data/tools';
import { notFound } from 'next/navigation';
import ToolGrid from '@/components/ToolGrid';
import RootLayout from '@/components/RootLayout';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const [tools, categories] = await Promise.all([
    fetchTools(),
    fetchCategories()
  ]);
  
  const category = categories.find(c => c.id === id);
  if (!category) return notFound();

  const categoryTools = tools.filter(tool => 
    tool.category.toLowerCase().replace(/\s+/g, '-') === id
  );

  return (
    <RootLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-gray-600">{category.description}</p>
      </div>
      <ToolGrid tools={categoryTools} />
    </RootLayout>
  );
}
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const categories = await fetchCategories();
  const category = categories.find(c => c.id === id);
  
  return {
    title: category ? `${category.name} - AI研发工具` : 'AI研发工具',
    description: category?.description || 'AI研发工具导航'
  };
}

export const dynamic = 'force-dynamic'
