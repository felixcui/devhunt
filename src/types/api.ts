import { Tool, News } from '@/types';

export interface ApiResponse<T = Tool | News> {
  code: number;
  msg: string;
  data: {
    items: T[];
    total: number;
    has_more: boolean;
  };
}

export interface FeishuField {
  text?: string;
  type?: string;
  link?: string;
}

export interface FeishuRecord {
  record_id: string;
  fields: {
    name?: FeishuField[];
    url?: FeishuField[];
    description?: FeishuField[];
    category?: FeishuField[];
    updatetime?: string;
    extra?: FeishuField[];
    
    title?: FeishuField[];
    link?: FeishuField[];
    tool?: FeishuField[];
    
    [key: string]: FeishuField[] | string | undefined;
  };
}

export interface FeishuResponse {
  code: number;
  msg: string;
  data: {
    items: FeishuRecord[];
    page_token: string;
    has_more: boolean;
    total: number;
  };
}
