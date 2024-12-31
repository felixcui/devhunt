import { NextRequest } from 'next/server';
import { FeishuResponse } from '@/types/api';
import { FEISHU_CONFIG, getTenantAccessToken } from '@/config/feishu';
import { formatDate } from '@/utils/date';

type Props = {
  params: {
    id: string;
  };
};

export const GET = async function getToolNews(
  req: Request | NextRequest,
  props: any
) {
  try {
    const id = props.params.id;
    if (!id) {
      throw new Error('Tool ID is required');
    }

    const { searchParams } = new URL(req.url);
    const toolName = searchParams.get('name');
    console.log('Tool name:', toolName);
    
    if (!toolName) {
      throw new Error('Tool name is required');
    }

    const token = await getTenantAccessToken();
    const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_CONFIG.NEWS.APP_TOKEN}/tables/${FEISHU_CONFIG.NEWS.TABLE_ID}/records/search`;
    
    const searchBody = {
      page_size: 100,
      view_id: FEISHU_CONFIG.NEWS.VIEW_ID,
      field_names: FEISHU_CONFIG.NEWS.FIELDS,
      filter: {
        conditions: [
          {
            field_name: "tool",
            operator: "is",
            value: [toolName.toLowerCase()]
          }
        ],
        conjunction: "and"
      },
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

    //console.log('Sample item fields:', JSON.stringify(feishuData.data.items[0]?.fields, null, 2));

    const news = feishuData.data.items
      .filter(item => {
        const itemTool = Array.isArray(item.fields.tool) 
          ? item.fields.tool[0]?.text 
          : item.fields.tool;
        return itemTool && itemTool.toLowerCase().includes(toolName.toLowerCase());
      })
      .map((item:any) => ({
        id: item.record_id,
        title: Array.isArray(item.fields.title) ? item.fields.title[0]?.text : item.fields.title,
        url: item.fields.link?.link || item.fields.link?.text || '',
        updateTime: formatDate(item.fields.updatetime as string),
        description: Array.isArray(item.fields.description) 
          ? item.fields.description[0]?.text 
          : item.fields.description,
        tool: Array.isArray(item.fields.tool) 
          ? item.fields.tool[0]?.text 
          : item.fields.tool
      }));

    console.log('Processed news item:', JSON.stringify(news[0], null, 2));

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