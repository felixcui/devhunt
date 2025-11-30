import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

interface ResourcePageParams {
  slug: string;
}

interface ResourcePageProps {
  params?: Promise<ResourcePageParams>;
}

async function getResourceContent(slug: string) {
  try {
    const decodedSlug = decodeURIComponent(slug);
    const resourceDir = path.join(process.cwd(), 'data', 'resource');
    const filePath = path.join(resourceDir, `${decodedSlug}.md`);

    const exists = await fs.promises
      .access(filePath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (!exists) {
      return null;
    }

    const content = await fs.promises.readFile(filePath, 'utf-8');

    return {
      slug,
      content,
    };
  } catch (error) {
    console.error('Error reading resource file:', error);
    return null;
  }
}

/**
 * 将 markdown 文本转换为 HTML
 * 支持的语法：
 * - # 一级标题
 * - ## 二级标题
 * - ### 三级标题（可带链接，如 ### [标题](url)）
 * - [文本](链接)
 * - ![alt](图片url)
 * - --- 分隔线
 * - - 列表项
 * - 普通段落
 */
function markdownToHtml(markdown: string): string {
  const lines = markdown.split('\n');
  const htmlParts: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd();

    // 空行
    if (!line) {
      if (inList) {
        htmlParts.push('</ul>');
        inList = false;
      }
      continue;
    }

    // 分隔线 ---
    if (/^-{3,}$/.test(line)) {
      if (inList) {
        htmlParts.push('</ul>');
        inList = false;
      }
      htmlParts.push('<hr class="my-8 border-gray-200" />');
      continue;
    }

    // 图片 ![alt](url)
    if (line.startsWith('![')) {
      if (inList) {
        htmlParts.push('</ul>');
        inList = false;
      }
      const match = line.match(/^!\[(.*?)\]\((.*?)\)/);
      if (match) {
        htmlParts.push(
          `<figure class="my-6"><img src="${match[2]}" alt="${match[1]}" class="rounded-xl shadow-soft" /></figure>`
        );
        continue;
      }
    }

    // 列表项 - xxx
    if (line.startsWith('- ')) {
      if (!inList) {
        htmlParts.push('<ul class="list-disc list-inside space-y-2 my-4">');
        inList = true;
      }
      const content = line.slice(2).trim();
      htmlParts.push(
        `<li class="text-gray-700">${processInlineLinks(content)}</li>`
      );
      continue;
    }

    // 如果不是列表项但之前在列表中，关闭列表
    if (inList) {
      htmlParts.push('</ul>');
      inList = false;
    }

    // # 一级标题
    if (line.startsWith('# ') && !line.startsWith('## ')) {
      const content = line.slice(2).trim();
      htmlParts.push(
        `<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">${processInlineLinks(content)}</h1>`
      );
      continue;
    }

    // ### 三级标题（可能是 ### [标题](链接) 或 ### 纯文本）
    if (line.startsWith('### ')) {
      const content = line.slice(4).trim();
      const linkMatch = content.match(/^\[(.+?)\]\((.+?)\)(.*)$/);
      if (linkMatch) {
        const title = linkMatch[1];
        const url = linkMatch[2];
        const suffix = linkMatch[3] || '';
        htmlParts.push(
          `<h3 class="text-lg font-semibold text-gray-900 mt-6 mb-2"><a href="${url}" target="_blank" rel="noopener noreferrer" class="text-accent-600 hover:underline">${title}</a>${suffix}</h3>`
        );
      } else {
        htmlParts.push(
          `<h3 class="text-lg font-semibold text-gray-900 mt-6 mb-2">${processInlineLinks(content)}</h3>`
        );
      }
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

    // 普通段落
    htmlParts.push(
      `<p class="text-gray-700 leading-relaxed mb-4">${processInlineLinks(line)}</p>`
    );
  }

  // 关闭未闭合的列表
  if (inList) {
    htmlParts.push('</ul>');
  }

  return htmlParts.join('');
}

/**
 * 处理行内链接 [文本](url)
 */
function processInlineLinks(text: string): string {
  return text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent-600 hover:underline">$1</a>'
  );
}

export async function generateMetadata({
  params,
}: ResourcePageProps): Promise<Metadata> {
  const resolved = (await params) ?? { slug: '' };
  const { slug } = resolved;

  return {
    title: `编程资源 - ${slug}`,
  };
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const resolved = (await params) ?? { slug: '' };
  const { slug } = resolved;
  const data = await getResourceContent(slug);

  if (!data) {
    notFound();
  }

  const html = markdownToHtml(data.content);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-accent-600 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          返回资讯列表
        </Link>
      </div>

      <article
        className="prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

