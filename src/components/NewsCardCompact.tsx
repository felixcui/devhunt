'use client';

import { News } from '@/types';
import { FiExternalLink, FiClock, FiTag } from 'react-icons/fi';

interface NewsCardCompactProps {
  news: News;
}

export default function NewsCardCompact({ news }: NewsCardCompactProps) {
  return (
    <article className="group bg-white rounded-xl shadow-soft hover:shadow-soft-lg p-4 transition-all duration-300 hover:-translate-y-1 border border-gray-100 hover:border-accent-200">
      <a
        href={news.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {/* 标题 */}
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-accent-600 transition-colors duration-200 leading-snug mb-2 line-clamp-2 flex items-start gap-2">
          <span className="flex-1">{news.title}</span>
          <FiExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-accent-600 transition-colors duration-200 flex-shrink-0 mt-0.5" />
        </h3>

        {/* 描述 (可选) */}
        {news.description && (
          <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">
            {news.description}
          </p>
        )}

        {/* 底部信息 */}
        <div className="flex items-center justify-between gap-2 text-xs">
          {/* 相关工具 */}
          {news.tool && (
            <span className="inline-flex items-center gap-1 text-accent-600 bg-accent-50 px-2 py-1 rounded-full">
              <FiTag className="w-3 h-3" />
              <span className="truncate max-w-[100px]">{news.tool}</span>
            </span>
          )}

          {/* 更新时间 */}
          <time
            dateTime={news.updateTime}
            className="flex-shrink-0 text-gray-500 flex items-center gap-1"
          >
            <FiClock className="w-3 h-3" />
            {news.updateTime}
          </time>
        </div>
      </a>

      {/* 悬浮时的底部装饰 */}
      <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </article>
  );
}
