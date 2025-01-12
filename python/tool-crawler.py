import requests
from bs4 import BeautifulSoup
import json
import time

def get_tool_details(url):
    """获取工具详情页的信息"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.encoding = 'utf-8'
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 获取工具名称
        name = soup.find('h1', class_='site-name').get_text(strip=True) if soup.find('h1', class_='site-name') else ""
        
        # 获取工具介绍 - 更新选择器
        description = ""
        # 首先尝试获取 .excerpt 类的描述
        excerpt = soup.find('div', class_='excerpt')
        if excerpt:
            description = excerpt.get_text(strip=True)
        
        # 如果没有找到描述，尝试从文章内容获取
        if not description:
            article = soup.find('article', class_='article-content')
            if article:
                # 获取文章中的所有段落
                paragraphs = article.find_all('p', recursive=False)  # 只获取直接子段落
                # 获取第一个非空且有意义的段落作为描述
                for p in paragraphs:
                    text = p.get_text(strip=True)
                    # 跳过版权声明和空段落
                    if text and not any(skip in text for skip in ['©️版权声明', '本文来自', '原文链接']):
                        description = text
                        break
        
        # 获取官网链接
        official_url = ""
        # 查找包含"官网"的链接
        links = soup.find_all('a')
        for link in links:
            if '官网' in link.get_text():
                official_url = link.get('href', '')
                # 如果链接是相对路径，跳过
                if not official_url.startswith('http'):
                    continue
                break
        
        # 如果还没找到官网链接，尝试其他方法
        if not official_url:
            # 尝试查找文章中的第一个外部链接
            article_links = soup.find_all('a', class_='btn-visit')
            for link in article_links:
                href = link.get('href', '')
                if href.startswith('http') and 'ai-bot.cn' not in href:
                    official_url = href
                    break
        
        # 清理数据
        name = name.replace('申请试用中', '').strip()
        
        # 如果描述为空，使用名称中的描述部分
        if not description and '，' in name:
            name_parts = name.split('，', 1)
            description = name_parts[1].strip()
            name = name_parts[0].strip()
        
        return {
            "name": name,
            "description": description,
            "official_url": official_url,
            "detail_page": url
        }
    except Exception as e:
        print(f"获取工具详情失败 {url}: {e}")
        return None

def crawl_ai_programming_tools():
    # 目标URL
    url = "https://ai-bot.cn/favorites/ai-programming-tools/"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.encoding = 'utf-8'
        
        soup = BeautifulSoup(response.text, 'html.parser')
        tools_list = []
        
        # 获取所有工具链接
        tool_links = soup.find_all('a', href=lambda x: x and 'sites' in x)
        total_tools = len(tool_links)
        print(f"找到 {total_tools} 个工具链接，开始获取详情...")
        
        # 遍历每个工具链接获取详情
        for index, tool in enumerate(tool_links[:5], 1):
            try:
                url = tool.get('href', '')
                if url:
                    print(f"正在处理 ({index}/{total_tools}): {url}")
                    tool_info = get_tool_details(url)
                    if tool_info:
                        tools_list.append(tool_info)
                    # 添加延时避免请求过快
                    time.sleep(1)
                    
            except Exception as e:
                print(f"处理工具链接时出错: {e}")
                continue
        
        # 保存为JSON文件
        with open('ai_programming_tools.json', 'w', encoding='utf-8') as f:
            json.dump(tools_list, f, ensure_ascii=False, indent=2)
            
        print(f"成功抓取了 {len(tools_list)} 个AI编程工具的详细信息")
        return tools_list
        
    except Exception as e:
        print(f"爬取过程中出错: {e}")
        return []

if __name__ == "__main__":
    tools = crawl_ai_programming_tools()
    # 打印前5个工具的详细信息作为示例
    for tool in tools[:5]:
        print("\n工具名称:", tool['name'])
        print("介绍:", tool['description'])
        print("官网:", tool['official_url'])
        print("详情页:", tool['detail_page'])
