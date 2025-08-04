import { FeishuField } from '@/types/api';

// 将飞书字段数组转换为纯文本，保留换行符
export function getFieldText(fields: FeishuField[]): string {
  if (!Array.isArray(fields)) return '';
  return fields
    .map(field => field.text || '')
    .join('\n')  // 使用换行符连接
    .trim();
}

// 获取URL字段的链接
export function getFieldUrl(fields: FeishuField[]): string {
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