'use client';

import { useEffect, useState } from 'react';
import { fetchTools } from '@/data/tools';
import ToolGrid from '@/components/ToolGrid';
import RootLayout from '@/components/RootLayout';
import SearchBar from '@/components/SearchBar';
import TopNav from '@/components/TopNav';
import { Tool } from '@/types';

export default function Home() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTools = async () => {
      const data = await fetchTools();
      setTools(data);
      setFilteredTools(data);
      setLoading(false);
    };
    loadTools();
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredTools(tools);
      return;
    }

    const searchQuery = query.toLowerCase();
    const filtered = tools.filter(tool => 
      tool.name.toLowerCase().includes(searchQuery) ||
      tool.description.toLowerCase().includes(searchQuery) ||
      tool.category.toLowerCase().includes(searchQuery)
    );
    setFilteredTools(filtered);
  };

  if (loading) {
    return (
      <RootLayout>
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      <div className="space-y-6">
        <TopNav />
        <SearchBar onSearch={handleSearch} />
        {filteredTools.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">没有找到相关工具</p>
          </div>
        ) : (
          <ToolGrid tools={filteredTools} />
        )}
      </div>
    </RootLayout>
  );
}
