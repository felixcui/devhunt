import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import AboutContent from '@/components/AboutContent';

export const metadata: Metadata = {
  title: '关于我们 - AICoding基地',
  description: 'AICoding基地是一个专注于AI编程工具和资源的精选平台',
};

async function getAboutContent() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'about.md');
    const content = await fs.promises.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error('Error reading about.md:', error);
    return '';
  }
}

/**
 * 将 markdown 文本转换为 HTML
 */
function markdownToHtml(markdown: string): string {
  const lines = markdown.split('\n');
  const htmlParts: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd();

    // 空行
    if (!line) {
      continue;
    }

    // 分隔线 ---
    if (/^-{3,}$/.test(line)) {
      htmlParts.push('<hr class="my-8 border-gray-200" />');
      continue;
    }

    // 图片 ![alt](url)
    if (line.startsWith('![')) {
      const match = line.match(/^!\[(.*?)\]\((.*?)\)/);
      if (match) {
        htmlParts.push(
          `<figure class="my-6 flex flex-col items-center"><img src="${match[2]}" alt="${match[1]}" class="rounded-xl shadow-soft max-w-xs" /></figure>`
        );
        continue;
      }
    }

    // # 一级标题
    if (line.startsWith('# ') && !line.startsWith('## ')) {
      const content = line.slice(2).trim();
      htmlParts.push(
        `<h1 class="text-3xl font-bold text-gray-900 mb-6">${processInlineLinks(content)}</h1>`
      );
      continue;
    }

    // ## 二级标题
    if (line.startsWith('## ')) {
      const content = line.slice(3).trim();
      htmlParts.push(
        `<h2 class="text-xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-200">${processInlineLinks(content)}</h2>`
      );
      continue;
    }

    // ### 三级标题
    if (line.startsWith('### ')) {
      const content = line.slice(4).trim();
      htmlParts.push(
        `<h3 class="text-lg font-semibold text-gray-900 mt-6 mb-2">${processInlineLinks(content)}</h3>`
      );
      continue;
    }

    // 列表项 - 
    if (line.startsWith('- ')) {
      const content = line.slice(2).trim();
      htmlParts.push(
        `<li class="text-gray-700 leading-relaxed ml-4 mb-2 list-disc">${processInlineLinks(content)}</li>`
      );
      continue;
    }

    // 普通段落
    htmlParts.push(
      `<p class="text-gray-700 leading-relaxed mb-4">${processInlineLinks(line)}</p>`
    );
  }

  return htmlParts.join('\n');
}

/**
 * 处理行内链接和加粗
 */
function processInlineLinks(text: string): string {
  // 处理加粗 **text**
  let result = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
  // 处理链接 [text](url)
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent-600 hover:underline">$1</a>'
  );
  return result;
}

export default async function AboutPage() {
  const content = await getAboutContent();
  const html = markdownToHtml(content);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <AboutContent html={html} />
    </div>
  );
}

