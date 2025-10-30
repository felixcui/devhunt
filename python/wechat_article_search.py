import requests
import time
from datetime import datetime, timedelta
import json
import re
from bs4 import BeautifulSoup
import logging

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('wechat_search.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class WechatArticleSearch:
    """
    微信公众号文章搜索类
    用于搜索最近几天内的微信公众号文章并筛选高质量内容
    """
    
    def __init__(self):
        """
        初始化微信文章搜索类
        """
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        }
        self.search_url = "https://weixin.sogou.com/weixin"
        
    def get_date_range(self, days=3):
        """
        获取最近几天的日期范围
        
        Args:
            days: 天数，默认为3
            
        Returns:
            开始日期和结束日期
        """
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        return start_date, end_date
    
    def search_articles(self, keyword, days=3, max_pages=5):
        """
        搜索最近几天内的微信公众号文章
        
        Args:
            keyword: 搜索关键词
            days: 最近几天，默认为3
            max_pages: 最大搜索页数，默认为5
            
        Returns:
            文章列表，包含标题、链接、发布时间、公众号名称等信息
        """
        logger.info(f"开始搜索关键词: {keyword}, 最近{days}天内的文章")
        
        start_date, end_date = self.get_date_range(days)
        articles = []
        
        for page in range(1, max_pages + 1):
            try:
                params = {
                    'query': keyword,
                    'type': 2,  # 搜索类型：2表示文章
                    'page': page,
                    'ie': 'utf8',
                }
                
                logger.info(f"正在搜索第{page}页...")
                response = requests.get(self.search_url, params=params, headers=self.headers)
                
                if response.status_code != 200:
                    logger.error(f"请求失败，状态码: {response.status_code}")
                    continue
                
                # 解析搜索结果页面
                soup = BeautifulSoup(response.text, 'html.parser')
                article_items = soup.select('.news-box .news-list li')
                
                if not article_items:
                    logger.info("未找到更多文章，搜索结束")
                    break
                
                for item in article_items:
                    try:
                        # 提取文章信息
                        title_elem = item.select_one('h3 a')
                        if not title_elem:
                            continue
                            
                        title = title_elem.get_text(strip=True)
                        link = title_elem.get('href', '')
                        
                        # 提取公众号名称
                        account_elem = item.select_one('.account')
                        account = account_elem.get_text(strip=True) if account_elem else "未知公众号"
                        
                        # 提取发布时间
                        time_elem = item.select_one('.s2')
                        pub_time_text = time_elem.get_text(strip=True) if time_elem else ""
                        
                        # 解析发布时间
                        pub_date = self._parse_time(pub_time_text)
                        
                        # 检查是否在指定日期范围内
                        if pub_date and start_date <= pub_date <= end_date:
                            # 提取摘要
                            summary_elem = item.select_one('.txt-info')
                            summary = summary_elem.get_text(strip=True) if summary_elem else ""
                            
                            articles.append({
                                'title': title,
                                'link': link,
                                'account': account,
                                'pub_time': pub_date.strftime('%Y-%m-%d %H:%M:%S') if pub_date else "",
                                'summary': summary
                            })
                            logger.info(f"找到文章: {title}")
                    except Exception as e:
                        logger.error(f"解析文章时出错: {str(e)}")
                
                # 防止请求过快被封
                time.sleep(2)
                
            except Exception as e:
                logger.error(f"搜索页面时出错: {str(e)}")
        
        logger.info(f"搜索完成，共找到{len(articles)}篇文章")
        return articles
    
    def _parse_time(self, time_text):
        """
        解析时间文本
        
        Args:
            time_text: 时间文本，如"2小时前"、"昨天"等
            
        Returns:
            datetime对象
        """
        now = datetime.now()
        
        if not time_text:
            return None
            
        # 处理"小时前"、"分钟前"等相对时间
        if '小时前' in time_text:
            hours = int(re.search(r'(\d+)', time_text).group(1))
            return now - timedelta(hours=hours)
        elif '分钟前' in time_text:
            minutes = int(re.search(r'(\d+)', time_text).group(1))
            return now - timedelta(minutes=minutes)
        elif '昨天' in time_text:
            return now - timedelta(days=1)
        elif '前天' in time_text:
            return now - timedelta(days=2)
        
        # 处理具体日期，如"2023-05-20"
        try:
            return datetime.strptime(time_text, '%Y-%m-%d')
        except:
            pass
            
        # 如果无法解析，返回None
        return None
    
    def filter_quality_articles(self, articles, min_length=500, keywords=None):
        """
        筛选高质量文章
        
        Args:
            articles: 文章列表
            min_length: 最小内容长度
            keywords: 质量关键词列表，如["深度", "分析", "教程"]等
            
        Returns:
            高质量文章列表
        """
        if keywords is None:
            keywords = ["深度", "分析", "教程", "实战", "案例", "指南", "详解", "原理"]
            
        logger.info("开始筛选高质量文章...")
        quality_articles = []
        
        for article in articles:
            # 检查标题或摘要中是否包含质量关键词
            title = article['title']
            summary = article['summary']
            
            # 计算关键词匹配数
            keyword_matches = sum(1 for kw in keywords if kw in title or kw in summary)
            
            # 检查摘要长度
            if len(summary) >= min_length or keyword_matches >= 2:
                quality_articles.append(article)
                logger.info(f"高质量文章: {title}")
                
        logger.info(f"筛选完成，共找到{len(quality_articles)}篇高质量文章")
        return quality_articles
    
    def compile_urls(self, articles):
        """
        汇总文章URL
        
        Args:
            articles: 文章列表
            
        Returns:
            汇总结果字符串
        """
        logger.info("开始汇总文章URL...")
        
        result = "# 最近3天内高质量AI编程相关文章\n\n"
        result += f"## 搜索时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        
        # 按公众号分组
        account_articles = {}
        for article in articles:
            account = article['account']
            if account not in account_articles:
                account_articles[account] = []
            account_articles[account].append(article)
        
        # 生成汇总结果
        for account, arts in account_articles.items():
            result += f"### {account}\n\n"
            for article in arts:
                pub_time = article.get('pub_time', '未知时间')
                result += f"- [{article['title']}]({article['link']}) - {pub_time}\n"
            result += "\n"
            
        logger.info("URL汇总完成")
        return result
    
    def save_results(self, content, filename="ai_programming_articles.md"):
        """
        保存结果到文件
        
        Args:
            content: 内容
            filename: 文件名
        """
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(content)
            logger.info(f"结果已保存到文件: {filename}")
        except Exception as e:
            logger.error(f"保存结果时出错: {str(e)}")


def main():
    """
    主函数
    """
    searcher = WechatArticleSearch()
    
    # 搜索最近3天内的AI编程相关文章
    articles = searcher.search_articles("AI编程", days=3)
    
    # 筛选高质量文章
    quality_articles = searcher.filter_quality_articles(articles)
    
    # 汇总文章URL
    result = searcher.compile_urls(quality_articles)
    
    # 保存结果
    searcher.save_results(result)
    
    # 打印结果
    print(result)


if __name__ == "__main__":
    main()