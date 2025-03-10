import { NextResponse } from 'next/server';
import { FeishuResponse, ApiResponse, FeishuField } from '@/types/api';
import { Tool } from '@/types';
import { FEISHU_CONFIG, getTenantAccessToken, buildBitableUrl } from '@/config/feishu';
import { formatDate } from '@/utils/date';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 });
const CACHE_KEY = 'tools_data';

// 将飞书字段数组转换为纯文本，保留换行符
function getFieldText(fields: FeishuField[]): string {
  if (!Array.isArray(fields)) return '';
  return fields
    .map(field => field.text || '')
    .join('\n')  // 使用换行符连接
    .trim();
}

// 获取URL字段的链接
function getFieldUrl(fields: FeishuField[]): string {
  if (!Array.isArray(fields)) return '';
  
  // 验证 URL 的函数
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  
  for (const field of fields) {
    // 检查 link 属性
    if (field.link && typeof field.link === 'string' && isValidUrl(field.link)) {
      return field.link;
    }
    // 检查 text 属性
    if (field.text && typeof field.text === 'string' && isValidUrl(field.text)) {
      return field.text;
    }
  }
  
  return '';
}

export async function GET(): Promise<NextResponse<ApiResponse<Tool>>> {
  try {
    const cachedData = cache.get<ApiResponse<Tool>>(CACHE_KEY);
    if (cachedData) {
      return new NextResponse(JSON.stringify(cachedData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = await getTenantAccessToken();
    const url = buildBitableUrl(FEISHU_CONFIG.TOOLS.APP_TOKEN, FEISHU_CONFIG.TOOLS.TABLE_ID);
    
    const response = await fetch(`${url}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        page_size: 100,
        view_id: FEISHU_CONFIG.TOOLS.VIEW_ID,
        field_names: FEISHU_CONFIG.TOOLS.FIELDS,
        sort: [{ field_name: "name", desc: true }]
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

    const tools = feishuData.data.items.map((item:any) => {
      let tags: string[] = [];
      if (item.fields.tags && Array.isArray(item.fields.tags)) {
        tags = item.fields.tags;
      }

      return {
        id: item.record_id,
        name: getFieldText(item.fields.name as FeishuField[]),
        description: getFieldText(item.fields.description as FeishuField[]),
        url: getFieldUrl(item.fields.url as FeishuField[]),
        category: getFieldText(item.fields.category as FeishuField[]),
        updateTime: item.fields.updatetime as string,
        resources: item.fields.extra ? getFieldText(item.fields.extra as FeishuField[]) : undefined,
        tags
      };
    });

    const responseData: ApiResponse<Tool> = {
      code: 0,
      msg: 'success',
      data: {
        items: tools,
        total: feishuData.data.total,
        has_more: feishuData.data.has_more
      }
    };

    cache.set(CACHE_KEY, responseData);

    return new NextResponse(JSON.stringify(responseData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    return new NextResponse(JSON.stringify({
      code: 500,
      msg: error?.message || 'Failed to fetch tools',
      data: {
        items: [],
        total: 0,
        has_more: false
      }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// 移除这些配置，因为它们可能会影响缓存的行为
// export const runtime = 'edge';
// export const dynamic = 'force-dynamic'; 