import { NextResponse } from 'next/server';
import { ApiResponse, FeishuResponse, FeishuField, FeishuRecord } from '@/types/api';
import { News } from '@/types';
import { FEISHU_CONFIG, getTenantAccessToken, buildBitableUrl } from '@/config/feishu';
import { formatDate } from '@/utils/date';
import { getFieldText, getFieldUrl } from '@/utils/feishu';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 });
const CACHE_KEY = 'news_data';

export async function GET(): Promise<NextResponse<ApiResponse<News>>> {
  try {
    const cachedData = cache.get<ApiResponse<News>>(CACHE_KEY);
    if (cachedData) {
      return new NextResponse(JSON.stringify(cachedData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
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
        field_names: FEISHU_CONFIG.NEWS.FIELDS,
        sort: [{ field_name: "updatetime", desc: true }]
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


    const news = feishuData.data.items.map((item: FeishuRecord) => {
      const title = getFieldText(item.fields.title as FeishuField[]);
      const url = getFieldUrl(item.fields.link as FeishuField[]);
      const updateTime = item.fields.updatetime as string;
      
      const description = item.fields.description 
        ? getFieldText(item.fields.description as FeishuField[])
        : undefined;

      const tool = item.fields.tool
        ? getFieldText(item.fields.tool as FeishuField[])
        : undefined;
      
      return {
        id: item.record_id,
        title,
        url,
        updateTime: updateTime ? formatDate(updateTime) : formatDate(new Date().toISOString()),
        description,
        tool
      };
    }).filter(item => item.title && item.url); // 过滤掉没有标题或链接的资讯

    const responseData: ApiResponse<News> = {
      code: 0,
      msg: 'success',
      data: {
        items: news,
        total: feishuData.data.total,
        has_more: feishuData.data.has_more
      }
    };

    // 将数据存入缓存
    cache.set(CACHE_KEY, responseData);

    return new NextResponse(
      JSON.stringify(responseData),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error: unknown) {
    console.error('Error fetching news:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch news';
    return new NextResponse(
      JSON.stringify({
        code: 500,
        msg: errorMessage,
        data: {
          items: [],
          total: 0,
          has_more: false
        }
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 