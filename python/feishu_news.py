import os
import json
from datetime import datetime, timedelta
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
            
        # 诊断信息：获取数据库中最新的日期，帮助排查数据源问题
        latest_db_date = "N/A"
        if feishu_data["data"]["items"]:
            # API 默认按时间倒序返回，第一条就是最新的
            raw_time = feishu_data["data"]["items"][0].get("fields", {}).get("updatetime")
            latest_db_date = format_date(raw_time)
        
        # 处理数据
        news_items = []
    # 计算一周前的日期
        now = datetime.now()
        one_week_ago = (now - timedelta(days=7)).strftime("%Y-%m-%d")
        
        for item in feishu_data["data"]["items"]:
            fields = item.get("fields", {})
            
            # 安全地获取 updatetime 并检查是否在最近一周内
            update_time = fields.get("updatetime", "")
            formatted_date = format_date(update_time)
          
            if not update_time or formatted_date < one_week_ago:
                # print(f"Skipping date: {formatted_date} < {one_week_ago}")
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
                "has_more": feishu_data["data"]["has_more"],
                "latest_db_date": latest_db_date
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
        items = result["data"]["items"]
        
        if not items:
            print("【提示】最近一周没有发现新的资讯。")
            print(f"数据库中最新的一条记录日期为: {result['data'].get('latest_db_date')}")
            print(f"当前脚本配置的 Base Token: {FEISHU_CONFIG['NEWS']['APP_TOKEN']}")
            print("注意：如果网页端能看到新数据，说明脚本与网页使用了不同的 Base Token。请检查代码配置是否与浏览器 URL (feishu.cn/base/TOKEN) 一致。")
            
        for item in items:
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
        print('--------------------------------')
        print('更多内容访问AI Coding知识库:https://nhihqe5yfi.feishu.cn/wiki/KBlUwLv56izVmdk5xzncJUAFnHd')
    else:
        print(f"Error: {result['msg']}") 
