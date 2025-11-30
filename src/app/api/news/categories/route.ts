import { NextResponse } from 'next/server';
import { FeishuResponse, FeishuRecord } from '@/types/api';
import { FEISHU_CONFIG, getTenantAccessToken, buildBitableUrl } from '@/config/feishu';
import NodeCache from 'node-cache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const cache = new NodeCache({ stdTTL: 3600 });
const CACHE_KEY = 'news_categories';

export async function GET() {
  try {
    const cachedData = cache.get<{ code: number; data: { categories: string[] } }>(CACHE_KEY);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    const token = await getTenantAccessToken();
    const url = buildBitableUrl(FEISHU_CONFIG.NEWS.APP_TOKEN, FEISHU_CONFIG.NEWS.TABLE_ID);
    
    const response = await fetch(`${url}/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        page_size: 100,
        view_id: FEISHU_CONFIG.NEWS.VIEW_ID,
        field_names: ['category'],
      }),
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const feishuData: FeishuResponse = await response.json();
    
    if (feishuData.code !== 0) {
      throw new Error(`Feishu API Error: ${feishuData.msg}`);
    }

    // 提取所有唯一的分类
    const categoriesSet = new Set<string>();
    feishuData.data.items.forEach((item: FeishuRecord) => {
      const category = item.fields.category;
      if (category && typeof category === 'string') {
        categoriesSet.add(category);
      }
    });

    const categories = Array.from(categoriesSet).sort();

    const responseData = {
      code: 0,
      data: {
        categories,
      },
    };

    cache.set(CACHE_KEY, responseData);

    return NextResponse.json(responseData);

  } catch (error: unknown) {
    console.error('Error fetching news categories:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories';
    return NextResponse.json(
      {
        code: 500,
        msg: errorMessage,
        data: {
          categories: [],
        },
      },
      { status: 500 }
    );
  }
}

