import { NextRequest } from 'next/server';
import { FeishuResponse, FeishuField, FeishuRecord } from '@/types/api';
import { FEISHU_CONFIG, getTenantAccessToken, buildBitableUrl } from '@/config/feishu';
import { formatDate } from '@/utils/date';
import { getFieldText, getFieldUrl } from '@/utils/feishu';

export const GET = async function getToolNews(
  req: Request | NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;
    if (!id) {
      throw new Error('Tool ID is required');
    }

    const { searchParams } = new URL(req.url);
    const toolName = searchParams.get('name');
    if (!toolName) {
      throw new Error('Tool name is required');
    }

    const token = await getTenantAccessToken();
    const url = `${buildBitableUrl(FEISHU_CONFIG.NEWS.APP_TOKEN, FEISHU_CONFIG.NEWS.TABLE_ID)}/search`;
    
    const searchBody = {
      page_size: 100,
      view_id: FEISHU_CONFIG.NEWS.VIEW_ID,
      field_names: FEISHU_CONFIG.NEWS.FIELDS,
      sort: [
        {
          field_name: "updatetime",
          desc: true
        }
      ]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(searchBody),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const feishuData: FeishuResponse = await response.json();
    
    if (feishuData.code !== 0) {
      throw new Error(`Feishu API Error: ${feishuData.msg}`);
    }



    const news = feishuData.data.items
      .map((item: FeishuRecord) => ({
        id: item.record_id,
        title: getFieldText(item.fields.title as FeishuField[]),
        url: getFieldUrl(item.fields.link as FeishuField[]),
        updateTime: formatDate(item.fields.updatetime as string),
        description: item.fields.description 
          ? getFieldText(item.fields.description as FeishuField[])
          : undefined,
        tool: typeof item.fields.tool === 'string' ? item.fields.tool : getFieldText(item.fields.tool as FeishuField[])
      }))
      .filter(item => item.title && item.url) // 过滤掉没有标题或链接的资讯
      .filter(item => {
        const itemTool = item.tool;
        return itemTool && itemTool.toLowerCase().includes(toolName.toLowerCase());
      });



    return new Response(JSON.stringify({
      code: 0,
      msg: 'success',
      data: {
        items: news,
        total: news.length,
        has_more: false,
        tool: {
          id,
          name: toolName
        }
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error fetching tool news:', error);
    return new Response(JSON.stringify({
      code: 500,
      msg: error instanceof Error ? error.message : 'Failed to fetch tool news',
      data: {
        items: [],
        total: 0,
        has_more: false
      }
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 