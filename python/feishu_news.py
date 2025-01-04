import os
import json
from datetime import datetime
import requests
from typing import Dict, List, Optional

# Feishu Configuration
FEISHU_CONFIG = {
    "APP_ID": os.getenv("FEISHU_APP_ID", "cli_a7cf81a5d318500b"),
    "APP_SECRET": os.getenv("FEISHU_APP_SECRET", "pbvES8Ks3AkQELrsNbqzMb8CZzktIXow"),
    "NEWS": {
        "APP_TOKEN": "Tn1vbRQyraNFvAstbqicUlIJnue",
        "TABLE_ID": "tblXp6DHjQPomXbv",
        "VIEW_ID": "vewbl6mgMC",
        "FIELDS": ["title", "link", "tool", "description", "updatetime"]
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

def get_news_list() -> Dict:
    """获取资讯列表"""
    try:
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
        
        # 处理数据
        news_items = []
        today = datetime.now().strftime("%Y-%m-%d")
        
        for item in feishu_data["data"]["items"]:
            fields = item.get("fields", {})
            
            # 安全地获取 updatetime 并检查是否为今天
            update_time = fields.get("updatetime", "")
          
            if not update_time or format_date(update_time) != today:
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
                continue
                
            # 安全地获取 description
            description = None
            desc_field = fields.get("description", [])
            if isinstance(desc_field, list):
                description = get_field_text(desc_field)
            elif desc_field:
                description = str(desc_field)
            
            # 安全地获取 tool
            tool = None
            tool_field = fields.get("tool", [])
            if isinstance(tool_field, list):
                tool = get_field_text(tool_field)
            elif tool_field:
                tool = str(tool_field)
            
            news_items.append({
                "id": item.get("record_id", ""),
                "title": title,
                "url": link,
                "updateTime": format_date(update_time),
                "description": description,
                "tool": tool
            })
        
        return {
            "code": 0,
            "msg": "success",
            "data": {
                "items": news_items,
                "total": feishu_data["data"]["total"],
                "has_more": feishu_data["data"]["has_more"]
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
    # 获取并打印资讯列表
    result = get_news_list()
    if result["code"] == 0:
        for item in result["data"]["items"]:
            markdown = ""
            title = item['title']
            url =  item['url']
            if item.get('description'):
                descrption = item['description']
            else:
                descrption = ""

            markdown += f"[{title}]({url})\n"
            markdown += f"{descrption}"
            print(markdown)
    else:
        print(f"Error: {result['msg']}") 
