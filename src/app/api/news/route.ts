import { NextResponse } from 'next/server';
import { ApiResponse, FeishuResponse, FeishuField } from '@/types/api';
import { News } from '@/types';
import { FEISHU_CONFIG, getTenantAccessToken, buildBitableUrl } from '@/config/feishu';
import { formatDate } from '@/utils/date';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 });
const CACHE_KEY = 'news_data';

// 将飞书字段数组转换为纯文本
function getFieldText(fields: FeishuField[]): string {
  if (!Array.isArray(fields)) return '';
  return fields
    .map(field => field.text || '')
    .join(' ')
    .replace(/\n/g, ' ')
    .trim();
}

// 从飞书字段中提取链接
function extractUrl(field: any): string {
  if (field && typeof field === 'object' && 'link' in field) {
    return field.link;
  }
  
  if (typeof field === 'string' && (field.startsWith('http://') || field.startsWith('https://'))) {
    return field;
  }
  
  return '';
}

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


    const news = feishuData.data.items
      .filter((item) => {
        const title = Array.isArray(item.fields.title) ? item.fields.title[0]?.text : item.fields.title;
        const link = extractUrl(item.fields.link);
        return title && link;
      })
      .map((item) => {
        const title = Array.isArray(item.fields.title) ? item.fields.title[0]?.text : item.fields.title;
        const link = extractUrl(item.fields.link);
        const updateTime = item.fields.updatetime || new Date().toISOString().split('T')[0];
        
        const description = item.fields.description 
          ? (Array.isArray(item.fields.description)
              ? getFieldText(item.fields.description)
              : String(item.fields.description))
          : undefined;

        const tool = item.fields.tool
          ? (Array.isArray(item.fields.tool)
              ? getFieldText(item.fields.tool)
              : String(item.fields.tool))
          : undefined;
        
        return {
          id: item.record_id,
          title: title as string,
          url: link,
          updateTime: formatDate(updateTime as string),
          description,
          tool
        };
      });

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

  } catch (error: any) {
    console.error('Error fetching news:', error);
    return new NextResponse(
      JSON.stringify({
        code: 500,
        msg: error?.message || 'Failed to fetch news',
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