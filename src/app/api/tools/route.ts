import { NextResponse } from 'next/server';
import { FeishuResponse, ApiResponse, FeishuField, FeishuRecord } from '@/types/api';
import { Tool } from '@/types';
import { FEISHU_CONFIG, getTenantAccessToken, buildBitableUrl } from '@/config/feishu';
import { getFieldText, getFieldUrl } from '@/utils/feishu';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 6 * 60 * 60 });
const CACHE_KEY = 'tools_data';

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

    const tools = feishuData.data.items.map((item: FeishuRecord) => {
      let tags: string[] = [];
      
      // 处理不同格式的 tags 字段
      const tagsField = item.fields.tags;
      if (tagsField) {
        if (Array.isArray(tagsField)) {
          // 如果 tags 是数组，可能包含 FeishuField 对象或字符串
          tags = tagsField.map((tag: FeishuField | string) => {
            if (typeof tag === 'object' && tag && tag.text) {
              return String(tag.text).trim();
            } else if (typeof tag === 'string') {
              return tag.trim();
            }
            return '';
          }).filter((tag: string) => tag.length > 0);
        } else if (typeof tagsField === 'string') {
          // 如果 tags 是字符串，按逗号分割
          tags = tagsField.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        }
      }

      // 添加调试信息 - 更详细的原始数据结构
      if (process.env.NODE_ENV === 'development') {
        const toolName = getFieldText(item.fields.name as FeishuField[]);
        console.log('Tool tags debug:', {
          name: toolName,
          rawTags: tagsField,
          allFields: Object.keys(item.fields),
          processedTags: tags
        });
        
        // 如果是特定工具，打印完整字段信息
        if (toolName === 'Cursor' || toolName === 'Continue') {
          console.log(`${toolName} 完整字段信息:`, item.fields);
        }
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

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tools';
    return new NextResponse(JSON.stringify({
      code: 500,
      msg: errorMessage,
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