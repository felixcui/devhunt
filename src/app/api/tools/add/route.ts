import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types/api';

async function getTenantAccessToken(): Promise<string> {
  const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      app_id: "cli_a7cf81a5d318500b",
      app_secret: "pbvES8Ks3AkQELrsNbqzMb8CZzktIXow"
    })
  });

  if (!response.ok) {
    throw new Error('Failed to get tenant access token');
  }

  const data = await response.json();
  return data.tenant_access_token;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, url, category } = body;

    // 验证必填字段
    if (!name || !description || !url || !category) {
      return new NextResponse(
        JSON.stringify({
          code: 400,
          msg: '所有字段都是必填的',
          data: null
        }),
        { status: 400 }
      );
    }

    const token = await getTenantAccessToken();
    
    const response = await fetch('https://open.feishu.cn/open-apis/bitable/v1/apps/Fd6zbPzXgahcmvsJGBOc4mqHn8e/tables/tblYSqPv958KOBRg/records', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          "名称": name,
          "介绍": description,
          "地址": url,
          "分类": category
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to add tool: ${response.statusText}`);
    }

    const result = await response.json();

    return new NextResponse(
      JSON.stringify({
        code: 0,
        msg: '工具添加成功',
        data: result
      }),
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error adding tool:', error);
    return new NextResponse(
      JSON.stringify({
        code: 500,
        msg: error.message || '添加工具失败',
        data: null
      }),
      { status: 500 }
    );
  }
} 