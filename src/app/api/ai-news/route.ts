import { NextResponse } from 'next/server';
import { ApiResponse, FeishuResponse, FeishuField, FeishuRecord } from '@/types/api';
import { AINews } from '@/types';
import { FEISHU_CONFIG, getTenantAccessToken, buildBitableUrl } from '@/config/feishu';
import { formatDate } from '@/utils/date';
import { getFieldText, getFieldUrl } from '@/utils/feishu';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 });
const CACHE_KEY = 'ai_news_data';

export async function GET(): Promise<NextResponse<ApiResponse<AINews>>> {
  try {
    const cachedData = cache.get<ApiResponse<AINews>>(CACHE_KEY);
    if (cachedData) {
      return new NextResponse(JSON.stringify(cachedData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = await getTenantAccessToken();
    const url = buildBitableUrl(FEISHU_CONFIG.AI_NEWS.APP_TOKEN, FEISHU_CONFIG.AI_NEWS.TABLE_ID);

    const response = await fetch(`${url}/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        page_size: 100,
        view_id: FEISHU_CONFIG.AI_NEWS.VIEW_ID,
        field_names: FEISHU_CONFIG.AI_NEWS.FIELDS,
        sort: [{ field_name: "updatetime", desc: true }]
      }),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Feishu API Error:', response.status, errorText);

      // 特殊处理 NOTEXIST 错误
      if (errorText.includes('NOTEXIST')) {
        throw new Error('数据表配置错误: 请检查APP_TOKEN和TABLE_ID是否正确,或确认这是Bitable而非Wiki表');
      }

      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const feishuData: FeishuResponse = await response.json();

    if (feishuData.code !== 0) {
      throw new Error(`Feishu API Error: ${feishuData.msg}`);
    }


    const aiNews = feishuData.data.items.map((item: FeishuRecord) => {
      const title = getFieldText(item.fields.title as FeishuField[]);
      const url = getFieldUrl(item.fields.link as FeishuField[]);
      const updateTime = item.fields.updatetime as string;

      const description = item.fields.description
        ? getFieldText(item.fields.description as FeishuField[])
        : undefined;

      // 处理 category 字段（可能是字符串或富文本数组）
      const categoryField = item.fields.category;
      const category = categoryField
        ? (Array.isArray(categoryField)
            ? getFieldText(categoryField as FeishuField[])
            : typeof categoryField === 'string'
              ? categoryField
              : undefined)
        : undefined;

      return {
        id: item.record_id,
        title,
        url,
        updateTime: updateTime ? formatDate(updateTime) : formatDate(new Date().toISOString()),
        description,
        category
      };
    }).filter(item => item.title && item.url) // 过滤掉没有标题或链接的资讯
      .slice(0, 100); // 限制最多返回100条

    const responseData: ApiResponse<AINews> = {
      code: 0,
      msg: 'success',
      data: {
        items: aiNews,
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
    console.error('Error fetching AI news:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch AI news';
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
