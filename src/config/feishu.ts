export const FEISHU_CONFIG = {
  // 飞书应用凭证
  APP_ID: process.env.FEISHU_APP_ID || "cli_a7cf81a5d318500b",
  APP_SECRET: process.env.FEISHU_APP_SECRET || "pbvES8Ks3AkQELrsNbqzMb8CZzktIXow",
  
  // 工具数据表配置
  TOOLS: {
    APP_TOKEN: "Fd6zbPzXgahcmvsJGBOc4mqHn8e",
    TABLE_ID: "tblYSqPv958KOBRg",
    VIEW_ID: "vewqzyG1nb",
    FIELDS: ["name", "url", "description", "category", "updatetime", "extra", "tags"]
  },
  
  // 资讯数据表配置
  NEWS: {
    APP_TOKEN: "Tn1vbRQyraNFvAstbqicUlIJnue",
    TABLE_ID: "tblXp6DHjQPomXbv",
    VIEW_ID: "vewbl6mgMC",
    FIELDS: ["title", "link", "tool", "description", "updatetime"]
  },

  // API 接口
  API: {
    BASE_URL: "https://open.feishu.cn/open-apis",
    AUTH_TOKEN: "/auth/v3/tenant_access_token/internal",
    BITABLE: "/bitable/v1"
  }
};

// 获取飞书访问令牌
export async function getTenantAccessToken(): Promise<string> {
  const response = await fetch(`${FEISHU_CONFIG.API.BASE_URL}${FEISHU_CONFIG.API.AUTH_TOKEN}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      app_id: FEISHU_CONFIG.APP_ID,
      app_secret: FEISHU_CONFIG.APP_SECRET
    })
  });

  if (!response.ok) {
    throw new Error('Failed to get tenant access token');
  }

  const data = await response.json();
  return data.tenant_access_token;
}

// 构建飞书 API URL
export function buildBitableUrl(appToken: string, tableId: string): string {
  return `${FEISHU_CONFIG.API.BASE_URL}${FEISHU_CONFIG.API.BITABLE}/apps/${appToken}/tables/${tableId}/records`;
} 