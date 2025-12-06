import os
import json
import argparse
from datetime import datetime, timedelta
import requests
from typing import Dict, List, Optional
from collections import defaultdict

# Feishu Configuration
FEISHU_CONFIG = {
    "APP_ID": os.getenv("FEISHU_APP_ID", "cli_a7cf81a5d318500b"),
    "APP_SECRET": os.getenv("FEISHU_APP_SECRET", "pbvES8Ks3AkQELrsNbqzMb8CZzktIXow"),
    "NEWS": {
        "APP_TOKEN": "Tn1vbRQyraNFvAstbqicUlIJnue",
        "TABLE_ID": "tblXp6DHjQPomXbv",
        "VIEW_ID": "vewbl6mgMC",
        "FIELDS": ["title", "link", "category", "description", "updatetime"]
    },
    "API": {
        "BASE_URL": "https://open.feishu.cn/open-apis",
        "AUTH_TOKEN": "/auth/v3/tenant_access_token/internal",
        "BITABLE": "/bitable/v1"
    }
}

def get_tenant_access_token() -> str:
    """获取飞书访问令牌"""
    url = f"{FEISHU_CONFIG['API']['BASE_URL']}{FEISHU_CONFIG['API']['AUTH_TOKEN']}"
    payload = {
        "app_id": FEISHU_CONFIG["APP_ID"],
        "app_secret": FEISHU_CONFIG["APP_SECRET"]
    }
    
    response = requests.post(url, json=payload)
    response.raise_for_status()
    return response.json()["tenant_access_token"]

def build_bitable_url(app_token: str, table_id: str) -> str:
    """构建飞书 API URL"""
    return f"{FEISHU_CONFIG['API']['BASE_URL']}{FEISHU_CONFIG['API']['BITABLE']}/apps/{app_token}/tables/{table_id}/records"

def get_field_text(fields: List[Dict]) -> str:
    """将飞书字段数组转换为纯文本"""
    if not isinstance(fields, list):
        return ""
    return " ".join(field.get("text", "") for field in fields).replace("\n", " ").strip()

def extract_url(field) -> str:
    """从飞书字段中提取链接"""
    # 处理列表类型（包含多行文本或富文本片段）
    if isinstance(field, list):
        if not field:
            return ""
        for item in field:
            if isinstance(item, dict):
                # 优先查找 link 字段
                if "link" in item:
                    return item["link"]
                # 其次检查 text 字段是否包含 URL
                if "text" in item and (item["text"].startswith("http://") or item["text"].startswith("https://")):
                    return item["text"]
        return ""

    if isinstance(field, dict) and "link" in field:
        return field["link"]
    if isinstance(field, str) and (field.startswith("http://") or field.startswith("https://")):
        return field
    return ""

def format_date(date_str: str) -> str:
    """格式化日期"""
    try:
        # 如果是时间戳（毫秒）
        if str(date_str).isdigit():
            timestamp = int(date_str) / 1000  # 转换为秒
            return datetime.fromtimestamp(timestamp).strftime("%Y-%m-%d")
        # 如果是日期字符串
        date = datetime.strptime(date_str, "%Y-%m-%d")
        return date.strftime("%Y-%m-%d")
    except:
        return date_str

def get_news_list(start_date: str = None, end_date: str = None) -> Dict:
    """获取资讯列表
    Args:
        start_date: 开始日期 (YYYY-MM-DD)，默认为7天前
        end_date: 结束日期 (YYYY-MM-DD)，默认为今天
    """
    try:
        # 确定日期范围
        if not end_date:
            end_date = datetime.now().strftime("%Y-%m-%d")
        
        if not start_date:
            start_date = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")

        # 获取访问令牌
        token = get_tenant_access_token()
        
        # 构建API URL
        url = build_bitable_url(
            FEISHU_CONFIG["NEWS"]["APP_TOKEN"],
            FEISHU_CONFIG["NEWS"]["TABLE_ID"]
        )
        
        # 发送请求
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "page_size": 100,
            "view_id": FEISHU_CONFIG["NEWS"]["VIEW_ID"],
            "field_names": FEISHU_CONFIG["NEWS"]["FIELDS"],
            "sort": [{"field_name": "updatetime", "desc": True}]
        }
        
        response = requests.post(f"{url}/search", headers=headers, json=payload)
        response.raise_for_status()
        feishu_data = response.json()
        
        if feishu_data["code"] != 0:
            raise Exception(f"Feishu API Error: {feishu_data['msg']}")
            
        # 诊断信息：获取数据库中最新的日期，帮助排查数据源问题
        latest_db_date = "N/A"
        if feishu_data["data"]["items"]:
            # API 默认按时间倒序返回，第一条就是最新的
            raw_time = feishu_data["data"]["items"][0].get("fields", {}).get("updatetime")
            latest_db_date = format_date(raw_time)
        
        # 处理数据
        news_items = []
        
        for item in feishu_data["data"]["items"]:
            fields = item.get("fields", {})
            
            # 安全地获取 updatetime 并检查范围
            update_time = fields.get("updatetime", "")
            formatted_date = format_date(update_time)
          
            if not update_time:
                continue
                
            if not (start_date <= formatted_date <= end_date):
                continue
            
            # 安全地获取 title
            title = None
            title_field = fields.get("title", [])
            if isinstance(title_field, list) and title_field:
                title = title_field[0].get("text", "")
            elif title_field:
                title = str(title_field)
            
            # 安全地获取 link
            link = extract_url(fields.get("link", ""))
            
            # 如果没有标题或链接，跳过该条目
            if not (title and link):
                # print(f"Skipping item due to missing fields: {title}")
                continue
                
            # 安全地获取 description
            description = None
            desc_field = fields.get("description", [])
            if isinstance(desc_field, list):
                description = get_field_text(desc_field)
            elif desc_field:
                description = str(desc_field)
            
            # 安全地获取 category
            category = "未分类"
            category_field = fields.get("category", [])
            if isinstance(category_field, list) and category_field:
                 # 假设category是单选标签，或者文本
                 # 如果是文本字段
                category = get_field_text(category_field)
                # 如果是单选/多选字段，可能结构不同，通常是 options/value
                # 尝试直接取text，如果不行可能要调整
                if not category and isinstance(category_field[0], str): #Simple string
                     category = category_field[0]
            elif isinstance(category_field, str):
                category = category_field

            
            news_items.append({
                "id": item.get("record_id", ""),
                "title": title,
                "url": link,
                "updateTime": format_date(update_time),
                "description": description,
                "category": category if category else "未分类"
            })
        
        return {
            "code": 0,
            "msg": "success",
            "data": {
                "items": news_items,
                "total": feishu_data["data"]["total"],
                "has_more": feishu_data["data"]["has_more"],
                "latest_db_date": latest_db_date,
                "date_range": (start_date, end_date)
            }
        }
        
    except Exception as e:
        print(f"Error fetching news: {str(e)}")
        return {
            "code": 500,
            "msg": str(e),
            "data": {
                "items": [],
                "total": 0,
                "has_more": False
            }
        }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Fetch Feishu news and output markdown.')
    parser.add_argument('--start', type=str, help='Start date (YYYY-MM-DD)')
    parser.add_argument('--end', type=str, help='End date (YYYY-MM-DD)')
    args = parser.parse_args()

    # 获取并打印资讯列表
    result = get_news_list(start_date=args.start, end_date=args.end)
    
    if result["code"] == 0:
        items = result["data"]["items"]
        start_date, end_date = result["data"].get("date_range", ("unknown", "unknown"))
        
        if not items:
            print(f"【提示】在 {start_date} 至 {end_date} 期间没有发现新的资讯。")
            print(f"数据库中最新的一条记录日期为: {result['data'].get('latest_db_date')}")
        else:
            # Group by category
            grouped_items = defaultdict(list)
            for item in items:
                grouped_items[item['category']].append(item)

            # Define preferred order of categories
            preferred_order = ["编程实践", "工具动态", "行业观点"]
            
            # Get all categories
            all_categories = list(grouped_items.keys())
            
            # Sort categories: preferred ones first, then others alphabetically
            sorted_categories = sorted(all_categories, key=lambda x: (
                preferred_order.index(x) if x in preferred_order else 999, x
            ))

            for idx, category in enumerate(sorted_categories):
                print(f"## {category}\n")
                
                for item in grouped_items[category]:
                    title = item['title']
                    url = item['url']
                    description = item.get('description', '') or ''
                    
                    print(f"### [{title}]({url})\n")
                    if description:
                        print(f"{description}\n")
                    else:
                        print("\n")
                
                # Add separator if it's not the last category
                if idx < len(sorted_categories) - 1:
                    print("---\n")

            print('---')
            print('AI Coding工具及资讯大全: http://devmaster.cn/')
            print(f'\n(Data fetched from {start_date} to {end_date})') # Optional debug info
            
    else:
        print(f"Error: {result['msg']}") 
