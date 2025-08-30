import { fetchTools, fetchCategories } from '@/data/tools';
import { notFound } from 'next/navigation';
import ToolGrid from '@/components/ToolGrid';
import { Metadata } from 'next';
import { getCategoryId } from '@/utils/category-mapping';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  try {
    const [tools, categories] = await Promise.all([
      fetchTools(),
      fetchCategories()
    ]);
    
    const category = categories.find(c => c.id === id);
    if (!category) return notFound();

    const categoryTools = tools.filter(tool => {
      // 使用映射函数获取工具分类的标准化ID
      const toolCategoryId = getCategoryId(tool.category);
      return toolCategoryId === id;
    });

    return (
      <div>
        {/* 返回按钮 */}
        <div className="mb-8">
          <Link 
            href="/tools"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:bg-gray-100 px-3 py-2 rounded-lg"
          >
            <FiArrowLeft className="w-4 h-4" />
            返回全部工具
          </Link>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          <p className="text-gray-600">{category.description}</p>
        </div>
        <ToolGrid tools={categoryTools} from="tools" />
      </div>
    );
  } catch (error) {
    console.error('Error fetching data for category page:', error);
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">无法加载分类数据</p>
        <p className="text-gray-500">请稍后重试</p>
      </div>
    );
  }
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
