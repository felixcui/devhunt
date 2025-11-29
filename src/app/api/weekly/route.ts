import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const weeklyDir = path.join(process.cwd(), 'data', 'weekly');

    const files = await fs.promises.readdir(weeklyDir);

    const items = files
      .filter((file) => file.toLowerCase().endsWith('.md'))
      .map((file) => {
        const slug = file.replace(/\.md$/i, '');
        return {
          slug,
          title: slug,
        };
      })
      .sort((a, b) => b.slug.localeCompare(a.slug));

    return NextResponse.json({
      code: 0,
      data: {
        items,
      },
    });
  } catch (error) {
    console.error('Error reading weekly files:', error);
    return NextResponse.json(
      {
        code: 1,
        msg: '获取资讯周报列表失败',
      },
      { status: 500 },
    );
  }
}


