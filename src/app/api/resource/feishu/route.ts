import { NextResponse } from 'next/server';
import { FEISHU_CONFIG, getTenantAccessToken, buildBitableUrl } from '@/config/feishu';
import { getFieldText, getFieldUrl } from '@/utils/feishu';
import NodeCache from 'node-cache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// 缓存实例，TTL 6小时
const cache = new NodeCache({ stdTTL: 6 * 60 * 60 });

interface ResourceItem {
  name: string;
  link: string;
  description: string;
  tool: string;
  category: string;
}

// 解析飞书字段值（支持多种格式）
function parseFieldValue(field: unknown): string {
  if (!field) return '';
  
  // 纯字符串
  if (typeof field === 'string') {
    return field;
  }
  
  // 数组格式（富文本）
  if (Array.isArray(field)) {
    return getFieldText(field) || '';
  }
  
  // 对象格式（可能是链接或选项）
  if (typeof field === 'object' && field !== null) {
    const obj = field as Record<string, unknown>;
    // 链接格式
    if (obj.link) return String(obj.link);
    if (obj.text) return String(obj.text);
    // 选项格式
    if (obj.value) return String(obj.value);
  }
  
  return String(field);
}

// 解析链接字段
function parseLinkValue(field: unknown): string {
  if (!field) return '';
  
  // 纯字符串
  if (typeof field === 'string') {
    return field;
  }
  
  // 数组格式
  if (Array.isArray(field)) {
    return getFieldUrl(field) || getFieldText(field) || '';
  }
  
  // 对象格式
  if (typeof field === 'object' && field !== null) {
    const obj = field as Record<string, unknown>;
    if (obj.link) return String(obj.link);
    if (obj.text) return String(obj.text);
  }
  
  return String(field);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tool = searchParams.get('tool');

    if (!tool) {
      return NextResponse.json(
        { code: 1, msg: '缺少 tool 参数' },
        { status: 400 }
      );
    }

    // 检查缓存
    const cacheKey = `resource_${tool}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    // 获取飞书访问令牌
    const token = await getTenantAccessToken();

    // 构建请求 URL
    const { APP_TOKEN, TABLE_ID, VIEW_ID } = FEISHU_CONFIG.PROGRAMMING_RESOURCE;
    const baseUrl = buildBitableUrl(APP_TOKEN, TABLE_ID);
    
    // 构建筛选条件：按 tool 字段筛选
    const filter = encodeURIComponent(`CurrentValue.[tool]="${tool}"`);
    const url = `${baseUrl}?view_id=${VIEW_ID}&filter=${filter}&page_size=100`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Feishu API error:', response.status, await response.text());
      return NextResponse.json(
        { code: 1, msg: '获取飞书数据失败' },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    if (data.code !== 0) {
      console.error('Feishu API returned error:', data);
      return NextResponse.json(
        { code: 1, msg: data.msg || '飞书接口返回错误' },
        { status: 500 }
      );
    }

    // 解析数据
    const items: ResourceItem[] = (data.data?.items || []).map((item: { fields: Record<string, unknown> }) => {
      const fields = item.fields;
      return {
        name: parseFieldValue(fields.name),
        link: parseLinkValue(fields.link),
        description: parseFieldValue(fields.description),
        tool: parseFieldValue(fields.tool),
        category: parseFieldValue(fields.category) || '其他'
      };
    });

    // 按 category 分组
    const grouped: Record<string, ResourceItem[]> = {};
    items.forEach(item => {
      const cat = item.category || '其他';
      if (!grouped[cat]) {
        grouped[cat] = [];
      }
      grouped[cat].push(item);
    });

    const responseData = {
      code: 0,
      data: {
        tool,
        total: items.length,
        categories: grouped
      }
    };

    // 设置缓存
    cache.set(cacheKey, responseData);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching programming resources:', error);
    return NextResponse.json(
      { code: 1, msg: '服务器内部错误' },
      { status: 500 }
    );
  }
}

