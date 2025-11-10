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
    
    // 将工具名称转为小写进行匹配
    const toolNameLower = toolName.toLowerCase();
    
    // 先尝试使用服务端过滤
    let searchBody: {
      view_id: string;
      field_names: string[];
      filter?: {
        conditions: Array<{
          field_name: string;
          operator: string;
          value: string[];
        }>;
        conjunction: string;
      };
      sort: Array<{
        field_name: string;
        desc: boolean;
      }>;
      automatic_fields: boolean;
      page_size: number;
    } = {
      view_id: FEISHU_CONFIG.NEWS.VIEW_ID,
      field_names: FEISHU_CONFIG.NEWS.FIELDS,
      filter: {
        conditions: [
          {
            field_name: "tool",
            operator: "contains",
            value: [toolNameLower]
          }
        ],
        conjunction: "and"
      },
      sort: [
        {
          field_name: "updatetime",
          desc: true
        }
      ],
      automatic_fields: false,
      page_size: 100
    };

    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(searchBody),
      cache: 'no-store'
    });

    let feishuData: FeishuResponse;
    let useClientFilter = false;

    // 尝试解析第一次请求的响应
    if (response.ok) {
      feishuData = await response.json();
      
      // 如果服务端过滤失败（InvalidFilter），回退到客户端过滤
      if (feishuData.code !== 0 && feishuData.msg?.includes('InvalidFilter')) {
        console.log('服务端过滤失败，回退到客户端过滤');
        
        // 不使用 filter，获取所有数据
        searchBody = {
          view_id: FEISHU_CONFIG.NEWS.VIEW_ID,
          field_names: FEISHU_CONFIG.NEWS.FIELDS,
          sort: [
            {
              field_name: "updatetime",
              desc: true
            }
          ],
          automatic_fields: false,
          page_size: 100
        };

        response = await fetch(url, {
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
          console.error('API Error:', errorText);
          throw new Error(`API request failed: ${response.status}`);
        }

        feishuData = await response.json();
        useClientFilter = true;
        
        // 再次检查响应
        if (feishuData.code !== 0) {
          throw new Error(`Feishu API Error: ${feishuData.msg}`);
        }
      } else if (feishuData.code !== 0) {
        // 如果不是 InvalidFilter 错误，直接抛出
        throw new Error(`Feishu API Error: ${feishuData.msg}`);
      }
    } else {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    // 格式化数据
    let news = feishuData.data.items
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
      .filter(item => item.title && item.url); // 过滤掉没有标题或链接的资讯

    // 如果使用客户端过滤，在这里进行过滤
    if (useClientFilter) {
      news = news.filter(item => {
        const itemTool = item.tool;
        return itemTool && itemTool.toLowerCase().includes(toolNameLower);
      });
    }

    // 限制最多返回100条
    news = news.slice(0, 100);



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
    
    // 如果是获取数据失败，返回空数组而不是错误状态
    // 这样前端会显示"暂无相关资讯"而不是错误提示
    return new Response(JSON.stringify({
      code: 0,
      msg: 'success',
      data: {
        items: [],
        total: 0,
        has_more: false,
        tool: {
          id: '',
          name: ''
        }
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 