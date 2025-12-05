'use client';

import { useEffect, useMemo, useState } from 'react';
import { fetchTools, fetchCategories } from '@/data/tools';
import { getCategoryId } from '@/utils/category-mapping';
import ToolGrid from '@/components/ToolGrid';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import { Category, Tool } from '@/types';

interface Props {
  categoryId: string;
}

export default function CategoryPageClient({ categoryId }: Props) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    Promise.all([fetchTools(categoryId), fetchCategories()])
      .then(([toolList, categoryList]) => {
        if (!mounted) return;
        setTools(toolList);
        setCategories(categoryList);
      })
      .catch((e) => {
        if (!mounted) return;
        console.error('Error fetching category data (client):', e);
        setError('无法加载分类数据');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [categoryId]);

  const category = useMemo(
    () => categories.find((c) => c.id === categoryId),
    [categories, categoryId]
  );

  const categoryTools = useMemo(() => {
    return tools.filter((tool) => getCategoryId(tool.category) === categoryId);
  }, [tools, categoryId]);

  if (loading) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-sm sm:text-base text-gray-500">加载中...</p>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-sm sm:text-base text-red-500 mb-4">{error || '分类不存在'}</p>
        <p className="text-sm sm:text-base text-gray-500">请稍后重试</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:bg-gray-100 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base"
        >
          <FiArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          返回全部工具
        </Link>
      </div>

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1.5 sm:mb-2">{category.name}</h1>
        <p className="text-sm sm:text-base text-gray-600">{category.description}</p>
      </div>

      <ToolGrid tools={categoryTools} from={`category-${categoryId}`} />
    </div>
  );
}
