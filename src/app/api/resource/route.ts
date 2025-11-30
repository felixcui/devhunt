import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const resourceDir = path.join(process.cwd(), 'data', 'resource');

    const files = await fs.promises.readdir(resourceDir);

    const items = files
      .filter((file) => file.toLowerCase().endsWith('.md'))
      .map((file) => {
        const slug = file.replace(/\.md$/i, '');
        return {
          slug,
          title: slug,
        };
      })
      .sort((a, b) => a.slug.localeCompare(b.slug));

    return NextResponse.json({
      code: 0,
      data: {
        items,
      },
    });
  } catch (error) {
    console.error('Error reading resource files:', error);
    return NextResponse.json(
      {
        code: 1,
        msg: '获取编程资源列表失败',
      },
      { status: 500 },
    );
  }
}

