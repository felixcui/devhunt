import { Suspense } from 'react';
import NewsPage from './news/page';

export default function HomePage() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto py-8 text-gray-500 text-sm">加载中...</div>}>
      <NewsPage />
    </Suspense>
  );
}
