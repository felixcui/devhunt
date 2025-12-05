import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types/api';
import { Tool } from '@/types';
import { getTools } from '@/lib/server/tools';

export async function GET(): Promise<NextResponse<ApiResponse<Tool>>> {
  try {
    const tools = await getTools();

    return new NextResponse(JSON.stringify({
      code: 0,
      msg: 'success',
      data: {
        items: tools,
        total: tools.length,
        has_more: false
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
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