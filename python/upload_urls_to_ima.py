#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量上传 URL 到 ima 知识库
根据接口 https://otheve.beacon.qq.com/analytics/v2_upload 的请求格式
"""

import json
import time
import requests
from typing import List, Dict
import sys
import os
import random
import uuid

# 接口配置
IMA_API_URL = "https://otheve.beacon.qq.com/analytics/v2_upload"
APP_KEY = "0WEB0698R9XOG65A"

# 多个 User-Agent 用于随机化
USER_AGENTS = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
]

# 多个 Accept-Language 用于随机化
ACCEPT_LANGUAGES = [
    "zh-CN,zh;q=0.9,en;q=0.8,da;q=0.7",
    "zh-CN,zh;q=0.9,en;q=0.8",
    "zh-CN,zh;q=0.9",
    "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
]

# 多个屏幕分辨率用于随机化
SCREEN_RESOLUTIONS = [
    "1512*982*2",
    "1920*1080*1",
    "1440*900*2",
    "2560*1440*1",
    "1680*1050*1",
    "1280*800*2",
]

# Chrome 版本号用于 Sec-Ch-Ua
CHROME_VERSIONS = ["142", "141", "140", "143"]

# A100 计数器，从 47 开始，每个请求递增
A100_COUNTER = 62 

# 固定的请求头参数（所有请求使用相同的值）
FIXED_USER_AGENT = random.choice(USER_AGENTS)
FIXED_ACCEPT_LANGUAGE = random.choice(ACCEPT_LANGUAGES)
FIXED_CHROME_VERSION = random.choice(CHROME_VERSIONS)

def generate_guid() -> str:
    """生成 GUID"""
    return str(uuid.uuid4()).replace("-", "")

def generate_timestamp(add_offset: bool = False) -> str:
    """
    生成时间戳（毫秒）
    add_offset: 是否添加小的随机偏移模拟真实时间差异
    """
    base_time = time.time() * 1000
    if add_offset:
        # 添加 -100 到 +100 毫秒的随机偏移
        offset = random.randint(-100, 100)
        return str(int(base_time + offset))
    return str(int(base_time))

def get_fixed_headers() -> Dict[str, str]:
    """生成固定的请求头（所有请求使用相同的值）"""
    user_agent = FIXED_USER_AGENT
    accept_language = FIXED_ACCEPT_LANGUAGE
    chrome_version = FIXED_CHROME_VERSION
    
    platform = '"macOS"'
    
    # 根据 User-Agent 判断浏览器类型
    if "Edg" in user_agent:
        sec_ch_ua = f'"Chromium";v="{chrome_version}", "Microsoft Edge";v="{chrome_version}", "Not_A Brand";v="99"'
    elif "Safari" in user_agent and "Chrome" not in user_agent:
        sec_ch_ua = f'"Safari";v="18", "Not_A Brand";v="99"'
    else:
        sec_ch_ua = f'"Chromium";v="{chrome_version}", "Google Chrome";v="{chrome_version}", "Not_A Brand";v="99"'
    
    headers = {
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": accept_language,
        "Content-Type": "application/json;charset=utf-8",
        "Origin": "https://mp.weixin.qq.com",
        "Priority": "u=1, i",
        "Referer": "https://mp.weixin.qq.com/",
        "Sec-Ch-Ua": sec_ch_ua,
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": platform,
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        "User-Agent": user_agent,
        "x-requested-with": "XMLHttpRequest"
    }
    
    return headers

def build_request_payload(
    url: str, 
    user_agent: str,
    session_start_time: str,
    session_id: str,
    event_time: str,
    action: str,
    a100: str,
    include_file_info: bool = False
) -> dict:
    """
    构建请求载荷
    url: 要上传的 URL（对应 A102 字段）
    user_agent: User-Agent 字符串，用于填充 A101 字段
    session_start_time: 会话开始时间戳（用于 A76 和 A88）
    session_id: 会话ID（用于 q36 和 guid）
    event_time: 事件时间戳
    action: 动作类型（plugin_panel_exp, knowledge_add_click, plugin_knowledge_click）
    a100: A100 字段的值
    include_file_info: 是否包含 file_type 和 knowledge_base_id
    """
    # 随机选择屏幕分辨率
    screen_resolution = random.choice(SCREEN_RESOLUTIONS)
    
    # 构建 mapValue
    map_value = {
        "action": action,
        "q36": session_id,
        "guid": f"guid-{session_id}",
        "userId": "0019f0bc45806d66",
        "openId": "oSfxO66VrazhpUHV94N33bui4Yl4",
        "A99": "Y",
        "A100": a100,
        "A72": "4.6.0-web",
        "A88": session_start_time
    }
    
    # 根据 action 类型决定是否包含文件信息
    if include_file_info:
        map_value["file_type"] = "6"
        map_value["knowledge_base_id"] = "7336041253984230"
    
    # 只有 plugin_knowledge_click 需要 source
    if action == "plugin_knowledge_click":
        map_value["source"] = "2"
    
    # 根据图片中的请求格式构建载荷
    payload = {
        "appVersion": "",
        "sdkId": "js",
        "sdkVersion": "4.6.0-web",
        "mainAppKey": APP_KEY,
        "platformId": 3,
        "common": {
            "A2": "T0cmNY6TRSWTjzEnXbTRY6Z02DDSwEdQ",
            "A8": "",
            "A12": "zh-CN",
            "A17": screen_resolution,
            "A23": "",
            "A50": "",
            "A76": f"{APP_KEY}_{session_start_time}",
            "A101": user_agent,
            "A102": url,  # 这是要上传的 URL
            "A104": "https://nhihqe5yfi.feishu.cn/",
            "A119": "",
            "A153": ""
        },
        "events": [
            {
                "eventCode": "universal_collect",
                "eventTime": event_time,
                "mapValue": map_value
            }
        ]
    }
    
    return payload

def send_single_request(url: str, headers: Dict[str, str], payload: dict, request_num: int) -> dict:
    """
    发送单个请求
    url: 要上传的 URL
    headers: 请求头
    payload: 请求载荷
    request_num: 请求序号（1, 2, 3）
    返回: {"success": bool, "message": str}
    """
    try:
        response = requests.post(
            IMA_API_URL,
            params={"appkey": APP_KEY},
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            return {
                "success": True,
                "message": f"请求 {request_num} 成功",
                "status_code": response.status_code
            }
        else:
            return {
                "success": False,
                "message": f"请求 {request_num} 失败，状态码: {response.status_code}",
                "status_code": response.status_code
            }
            
    except Exception as e:
        return {
            "success": False,
            "message": f"请求 {request_num} 出错: {str(e)}",
            "status_code": None
        }

def get_next_a100() -> str:
    """获取下一个 A100 值并递增"""
    global A100_COUNTER
    current = A100_COUNTER
    A100_COUNTER += 1
    return str(current)

def upload_url(url: str) -> dict:
    """
    上传单个 URL，需要发送三次请求模拟完整流程
    返回: {"success": bool, "message": str, "details": List[dict]}
    """
    # 为这个URL创建一个会话
    # session_start_time 不使用偏移，因为需要在三次请求中保持一致
    session_start_time = generate_timestamp(add_offset=False)
    session_id = generate_guid()
    
    # 使用固定的请求头（所有请求使用相同的值）
    headers = get_fixed_headers()
    user_agent = headers["User-Agent"]
    
    # 生成三个事件时间戳
    # 第一次请求的时间戳
    event_time_1 = generate_timestamp(add_offset=True)
    # 等待一段时间后发送第二次请求
    time.sleep(1)
    event_time_2 = generate_timestamp(add_offset=True)
    # 第二次和第三次使用相同时间戳（间隔很短）
    event_time_3 = event_time_2
    
    # 为这个URL的三个请求分配连续的A100值
    a100_1 = get_next_a100()
    a100_2 = get_next_a100()
    a100_3 = get_next_a100()
    
    results = []
    all_success = True
    
    # 第一次请求：plugin_panel_exp
    print(f"  发送请求 1/3: plugin_panel_exp (A100={a100_1})")
    payload_1 = build_request_payload(
        url=url,
        user_agent=user_agent,
        session_start_time=session_start_time,
        session_id=session_id,
        event_time=event_time_1,
        action="plugin_panel_exp",
        a100=a100_1,
        include_file_info=False
    )
    result_1 = send_single_request(url, headers, payload_1, 1)
    results.append(result_1)
    if not result_1["success"]:
        all_success = False
    else:
        print(f"    ✓ {result_1['message']}")
    
    # 请求间隔
    time.sleep(1)
    
    # 第二次请求：knowledge_add_click
    print(f"  发送请求 2/3: knowledge_add_click (A100={a100_2})")
    payload_2 = build_request_payload(
        url=url,
        user_agent=user_agent,
        session_start_time=session_start_time,
        session_id=session_id,
        event_time=event_time_2,
        action="knowledge_add_click",
        a100=a100_2,
        include_file_info=True
    )
    result_2 = send_single_request(url, headers, payload_2, 2)
    results.append(result_2)
    if not result_2["success"]:
        all_success = False
    else:
        print(f"    ✓ {result_2['message']}")
    
    # 请求间隔（第二次和第三次之间间隔很短）
    #time.sleep(1)
    
    # 第三次请求：plugin_knowledge_click
    print(f"  发送请求 3/3: plugin_knowledge_click (A100={a100_3})")
    payload_3 = build_request_payload(
        url=url,
        user_agent=user_agent,
        session_start_time=session_start_time,
        session_id=session_id,
        event_time=event_time_3,
        action="plugin_knowledge_click",
        a100=a100_3,
        include_file_info=True
    )
    result_3 = send_single_request(url, headers, payload_3, 3)
    results.append(result_3)
    if not result_3["success"]:
        all_success = False
    else:
        print(f"    ✓ {result_3['message']}")
    
    if all_success:
        return {
            "success": True,
            "message": f"成功上传: {url}（3个请求全部成功）",
            "details": results
        }
    else:
        failed_requests = [r for r in results if not r["success"]]
        return {
            "success": False,
            "message": f"上传失败: {url}（{len(failed_requests)}个请求失败）",
            "details": results
        }

def upload_urls_from_file(file_path: str, min_delay: float = 1.0, max_delay: float = 3.0) -> None:
    """
    从文件读取 URL 列表并批量上传
    file_path: URL 文件路径（每行一个 URL）
    min_delay: 最小延迟时间（秒）
    max_delay: 最大延迟时间（秒），实际延迟会在 min_delay 和 max_delay 之间随机
    """
    if not os.path.exists(file_path):
        print(f"错误: 文件不存在: {file_path}")
        return
    
    urls = []
    with open(file_path, "r", encoding="utf-8") as f:
        for line in f:
            url = line.strip()
            if url and (url.startswith("http://") or url.startswith("https://")):
                urls.append(url)
    
    if not urls:
        print("错误: 文件中没有找到有效的 URL")
        return
    
    print(f"找到 {len(urls)} 个 URL，开始上传...")
    print(f"每个 URL 需要发送 3 个请求（模拟完整流程）")
    print(f"URL 之间的间隔: {min_delay}-{max_delay} 秒（随机）")
    print("-" * 60)
    
    success_count = 0
    fail_count = 0
    
    for i, url in enumerate(urls, 1):
        print(f"[{i}/{len(urls)}] 正在上传: {url}")
        result = upload_url(url)
        
        if result["success"]:
            print(f"  ✓ {result['message']}")
            success_count += 1
        else:
            print(f"  ✗ {result['message']}")
            # 显示失败的请求详情
            if "details" in result:
                for detail in result["details"]:
                    if not detail["success"]:
                        print(f"    - {detail['message']}")
            fail_count += 1
        
        # 随机延迟，模拟真实用户行为
        if i < len(urls) and max_delay > 0:
            delay = random.uniform(min_delay, max_delay)
            print(f"  等待 {delay:.2f} 秒后继续下一个 URL...")
            time.sleep(delay)
    
    print("-" * 60)
    print(f"上传完成: 成功 {success_count} 个, 失败 {fail_count} 个")

def upload_urls_from_list(urls: List[str], min_delay: float = 1.0, max_delay: float = 3.0) -> None:
    """
    从 URL 列表批量上传
    urls: URL 列表
    min_delay: 最小延迟时间（秒）
    max_delay: 最大延迟时间（秒），实际延迟会在 min_delay 和 max_delay 之间随机
    """
    if not urls:
        print("错误: URL 列表为空")
        return
    
    print(f"开始上传 {len(urls)} 个 URL...")
    print(f"每个 URL 需要发送 3 个请求（模拟完整流程）")
    print(f"URL 之间的间隔: {min_delay}-{max_delay} 秒（随机）")
    print("-" * 60)
    
    success_count = 0
    fail_count = 0
    
    for i, url in enumerate(urls, 1):
        print(f"[{i}/{len(urls)}] 正在上传: {url}")
        result = upload_url(url)
        
        if result["success"]:
            print(f"  ✓ {result['message']}")
            success_count += 1
        else:
            print(f"  ✗ {result['message']}")
            # 显示失败的请求详情
            if "details" in result:
                for detail in result["details"]:
                    if not detail["success"]:
                        print(f"    - {detail['message']}")
            fail_count += 1
        
        # 随机延迟，模拟真实用户行为
        if i < len(urls) and max_delay > 0:
            delay = random.uniform(min_delay, max_delay)
            print(f"  等待 {delay:.2f} 秒后继续下一个 URL...")
            time.sleep(delay)
    
    print("-" * 60)
    print(f"上传完成: 成功 {success_count} 个, 失败 {fail_count} 个")

def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("用法:")
        print("  python upload_urls_to_ima.py <url_file> [min_delay] [max_delay]  # 从文件读取 URL")
        print("  python upload_urls_to_ima.py --url <url1> [url2] ...  # 直接指定 URL")
        print("\n参数说明:")
        print("  min_delay: 最小延迟时间（秒），默认 1.0")
        print("  max_delay: 最大延迟时间（秒），默认 3.0")
        print("  实际延迟会在 min_delay 和 max_delay 之间随机")
        print("\n示例:")
        print("  python upload_urls_to_ima.py urls.txt")
        print("  python upload_urls_to_ima.py urls.txt 2 5  # 延迟 2-5 秒")
        print("  python upload_urls_to_ima.py --url https://example.com/page1 https://example.com/page2")
        sys.exit(1)
    
    if sys.argv[1] == "--url":
        # 从命令行参数读取 URL
        urls = sys.argv[2:]
        upload_urls_from_list(urls)
    else:
        # 从文件读取 URL
        file_path = sys.argv[1]
        min_delay = float(sys.argv[2]) if len(sys.argv) > 2 else 1.0
        max_delay = float(sys.argv[3]) if len(sys.argv) > 3 else 3.0
        upload_urls_from_file(file_path, min_delay, max_delay)

if __name__ == "__main__":
    main()

