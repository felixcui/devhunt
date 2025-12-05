import { Tool, Category } from '@/types';
import { FeishuResponse, FeishuField, FeishuRecord } from '@/types/api';
import { FEISHU_CONFIG, getTenantAccessToken, buildBitableUrl } from '@/config/feishu';
import { getFieldText, getFieldUrl } from '@/utils/feishu';
import { normalizeCategoryName, CATEGORY_MAPPING, getAllCategories } from '@/utils/category-mapping';
import NodeCache from 'node-cache';

// Shared cache instance
const cache = new NodeCache({ stdTTL: 6 * 60 * 60 });
const TOOLS_CACHE_KEY = 'tools_data_server';

export async function getTools(): Promise<Tool[]> {
    try {
        const cachedData = cache.get<Tool[]>(TOOLS_CACHE_KEY);
        if (cachedData) {
            return cachedData;
        }

        const token = await getTenantAccessToken();
        const url = buildBitableUrl(FEISHU_CONFIG.TOOLS.APP_TOKEN, FEISHU_CONFIG.TOOLS.TABLE_ID);

        const response = await fetch(`${url}/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                page_size: 100,
                view_id: FEISHU_CONFIG.TOOLS.VIEW_ID,
                field_names: FEISHU_CONFIG.TOOLS.FIELDS,
                sort: [{ field_name: "name", desc: true }]
            }),
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const feishuData: FeishuResponse = await response.json();

        if (feishuData.code !== 0) {
            throw new Error(`Feishu API Error: ${feishuData.msg}`);
        }

        const tools = feishuData.data.items.map((item: FeishuRecord) => {
            let tags: string[] = [];

            const tagsField = item.fields.tags;
            if (tagsField) {
                if (Array.isArray(tagsField)) {
                    tags = tagsField.map((tag: FeishuField | string) => {
                        if (typeof tag === 'object' && tag && tag.text) {
                            return String(tag.text).trim();
                        } else if (typeof tag === 'string') {
                            return tag.trim();
                        }
                        return '';
                    }).filter((tag: string) => tag.length > 0);
                } else if (typeof tagsField === 'string') {
                    tags = tagsField.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
                }
            }

            return {
                id: item.record_id,
                name: getFieldText(item.fields.name as FeishuField[]),
                description: getFieldText(item.fields.description as FeishuField[]),
                url: getFieldUrl(item.fields.url as FeishuField[]),
                category: getFieldText(item.fields.category as FeishuField[]),
                updateTime: item.fields.updatetime as string,
                resources: item.fields.extra ? getFieldText(item.fields.extra as FeishuField[]) : undefined,
                tags
            };
        });

        cache.set(TOOLS_CACHE_KEY, tools);
        return tools;

    } catch (error) {
        console.error('Error in getTools (server):', error);
        // In case of error, return empty array rather than crashing the whole page
        // or rethrow if you want to show error page.
        throw error;
    }
}

export async function getCategories(): Promise<Category[]> {
    try {
        const tools = await getTools();

        // 从工具数据中提取分类，并应用映射表进行标准化
        const categoryMap = new Map<string, { name: string; originalKey: string; count: number }>();

        tools.forEach(tool => {
            if (tool.category) {
                const normalized = normalizeCategoryName(tool.category);
                const key = normalized.id;

                if (categoryMap.has(key)) {
                    categoryMap.get(key)!.count++;
                } else {
                    categoryMap.set(key, {
                        name: normalized.name,
                        originalKey: normalized.originalKey,
                        count: 1
                    });
                }
            }
        });

        // 转换为Category格式
        const categories: Category[] = Array.from(categoryMap.entries()).map(([id, info]) => {
            // 确定图标类型
            let icon: Category['icon'] = 'code';
            const lowerName = info.name.toLowerCase();

            // Icon mapping logic copied from src/data/tools.ts
            if (lowerName.includes('入门') || id === 'vibetool') icon = 'star';
            if (lowerName.includes('命令行') || id === 'cliagent') icon = 'terminal';
            if (lowerName.includes('ide') || id === 'ide') icon = 'code';
            if (lowerName.includes('测试') || id === 'testing') icon = 'test';
            if (lowerName.includes('devops') || id === 'devops') icon = 'cloud';
            if (lowerName.includes('插件') || id === 'extension') icon = 'plugin';
            if (lowerName.includes('审查') || id === 'codereview') icon = 'review';
            if (lowerName.includes('设计') || id === 'design') icon = 'web';
            if (lowerName.includes('ui') || id === 'ui-code') icon = 'web';
            if (lowerName.includes('agent') || id === 'codeagent') icon = 'robot';
            if (lowerName.includes('mcp') || id === 'mcptool') icon = 'cloud';
            if (lowerName.includes('文档') || id === 'docs') icon = 'code';
            if (lowerName.includes('资源') || id === 'resource') icon = 'cloud';

            return {
                id,
                name: info.name,
                description: `${info.name}相关的AI开发工具（${info.count}个）`,
                icon
            };
        });

        // Check CATEGORY_MAPPING values for sorting
        const categoryOrder = Object.values(CATEGORY_MAPPING).reduce((acc, item, index) => {
            acc[item.id] = index;
            return acc;
        }, {} as Record<string, number>);

        categories.sort((a, b) => {
            const orderA = categoryOrder[a.id] ?? 999;
            const orderB = categoryOrder[b.id] ?? 999;
            return orderA - orderB;
        });

        return categories;
    } catch (error) {
        console.error('Error fetching categories (server):', error);
        // Return all categories with default values if error occurs
        return getAllCategories().map(category => ({
            id: category.id,
            name: category.name,
            description: category.description,
            icon: 'code' as const
        }));
    }
}
