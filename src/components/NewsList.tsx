'use client';

import { News } from '@/types';

interface NewsListProps {
  news: News[];
}

// 辅助函数：将文本中的URL转换为可点击的链接
function convertUrlsToLinks(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

export default function NewsList({ news }: NewsListProps) {
  return (
    <div className="max-w-4xl">
      <ul className="space-y-4">
        {news.map((item: News) => (
          <li key={item.id} className="border-b border-gray-200 pb-4">
            <div className="rounded-lg p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">
                  {item.title}
                </h3>
                <span className="text-sm text-gray-500 ml-4">
                  {item.updateTime}
                </span>
              </div>
              {item.description && (
                <p className="mt-2 text-gray-600">
                  {convertUrlsToLinks(item.description)}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 