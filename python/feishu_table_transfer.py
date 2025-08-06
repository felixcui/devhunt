import os
import logging
from datetime import datetime, timedelta
from typing import List, Dict
from lark_oapi import Client

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('table_transfer.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class FeishuTableTransfer:
    def __init__(self, app_id: str, app_secret: str):
        """
        初始化飞书表格传输类
        :param app_id: 飞书应用 ID
        :param app_secret: 飞书应用密钥
        """
        self.client = Client(
            app_id=app_id, 
            app_secret=app_secret,
            is_isv=False  
        )
        self.token = None

    def get_token(self) -> None:
        """获取飞书访问令牌"""
        try:
            auth = self.client.auth.v3.tenant_access_token.internal()
            self.token = auth.data.tenant_access_token
            logger.info("成功获取访问令牌")
        except Exception as e:
            logger.error(f"获取访问令牌失败: {str(e)}")
            raise

    def get_yesterday_range(self) -> tuple:
        """
        获取昨天的日期范围
        :return: (开始时间, 结束时间) 格式为 "yyyy/MM/dd HH:mm"
        """
        today = datetime.now()
        yesterday = today - timedelta(days=1)
        start = yesterday.replace(hour=0, minute=0, second=0, microsecond=0)
        end = yesterday.replace(hour=23, minute=59, second=59, microsecond=999999)
        return start.strftime("%Y/%m/%d %H:%M"), end.strftime("%Y/%m/%d %H:%M")

    def get_yesterday_data(self, source_base_id: str, source_table_id: str) -> List[Dict]:
        """
        获取昨天的数据
        :param source_base_id: 源多维表格的 Base ID（URL中的bascnXXX）
        :param source_table_id: 源数据表ID（URL中的tblXXX）
        :return: 昨天的数据列表
        """
        try:
            start_time, end_time = self.get_yesterday_range()
            
            # 构建飞书API请求
            response = self.client.bitable.v1.app_table_record.list(
                path={
                    "app_token": source_base_id,  # 这里使用 base_id
                    "table_id": source_table_id   # 这里使用 table_id
                },
                query={
                    "filter": f"CurrentValue.[收集日期] >= '{start_time}' && CurrentValue.[收集日期] <= '{end_time}'"
                }
            )

            if not response.code:  # 飞书API成功返回时code为0
                records = response.data.items
                logger.info(f"成功获取{len(records)}条昨日数据")
                
                # 提取所需字段
                result = []
                for record in records:
                    fields = record.fields
                    result.append({
                        'title': fields.get('内容', ''),
                        'description': fields.get('摘要', ''),
                        'collect_time': fields.get('收集日期', '')
                    })
                return result
            else:
                logger.error(f"获取数据失败: {response.msg}")
                return []
                
        except Exception as e:
            logger.error(f"获取昨日数据时发生错误: {str(e)}")
            return []

    def write_to_target(self, target_base_id: str, target_table_id: str, data: List[Dict]) -> None:
        """
        写入目标表格
        :param target_base_id: 目标多维表格的 Base ID（URL中的bascnXXX）
        :param target_table_id: 目标数据表ID（URL中的tblXXX）
        :param data: 要写入的数据列表
        """
        try:
            for item in data:
                # 构建记录数据
                record = {
                    "fields": {
                        "title": item['title'],
                        "description": item['description']
                    }
                }
                
                # 调用飞书API写入数据
                response = self.client.bitable.v1.app_table_record.create(
                    path={
                        "app_token": target_base_id,    # 这里使用 base_id
                        "table_id": target_table_id     # 这里使用 table_id
                    },
                    request_body=record
                )
                
                if not response.code:  # 飞书API成功返回时code为0
                    logger.info(f"成功写入记录: {item['title']}")
                else:
                    logger.error(f"写入记录失败: {response.msg}")
                    
        except Exception as e:
            logger.error(f"写入目标表格时发生错误: {str(e)}")
            raise

    def process(self, source_base_id: str, source_table_id: str, 
               target_base_id: str, target_table_id: str) -> None:
        """
        主处理流程
        :param source_base_id: 源多维表格的 Base ID
        :param source_table_id: 源数据表ID
        :param target_base_id: 目标多维表格的 Base ID
        :param target_table_id: 目标数据表ID
        """
        try:
            # 1. 获取访问令牌
            self.get_token()
            
            # 2. 获取昨天的数据
            data = self.get_yesterday_data(source_base_id, source_table_id)
            if not data:
                logger.info("没有找到昨天的数据")
                return
                
            # 3. 写入目标表格
            self.write_to_target(target_base_id, target_table_id, data)
            logger.info(f"成功完成数据传输，共处理{len(data)}条记录")
            
        except Exception as e:
            logger.error(f"处理过程中发生错误: {str(e)}")
            raise

def main():
    """
    主函数 - 配置说明
    
    在飞书多维表格的 URL 中获取必要的 ID：
    https://feishu.cn/base/bascnxxxxxxxxxxxxxxx?table=tblxxxxxxxxxxxxxxx
    
    其中：
    - bascnxxxxxxxxxxxxxxx 是 Base ID（用作 app_token）
    - tblxxxxxxxxxxxxxxx 是 Table ID（用作 table_id）
    """
    
    # 在飞书开发者后台获取应用凭证
    APP_ID = "cli_a7cf81a5d318500b"        # 在开发者后台获取
    APP_SECRET = "pbvES8Ks3AkQELrsNbqzMb8CZzktIXow"    # 在开发者后台获取
    
    # 源多维表格信息
    SOURCE_BASE_ID = "Tn1vbRQyraNFvAstbqicUlIJnue"    # URL中的 bascnXXXXXX
    SOURCE_TABLE_ID = "tblXp6DHjQPomXbv"     # URL中的 tblXXXXXX
    
    # 目标多维表格信息
    TARGET_BASE_ID = "bascnYYYYYY"    # URL中的 bascnYYYYYY
    TARGET_TABLE_ID = "tblXp6DHjQPomXbv"     # URL中的 tblYYYYYY

    try:
        transfer = FeishuTableTransfer(APP_ID, APP_SECRET)
        transfer.process(SOURCE_BASE_ID, SOURCE_TABLE_ID, 
                        TARGET_BASE_ID, TARGET_TABLE_ID)
    except Exception as e:
        logger.error(f"程序执行失败: {str(e)}")
        exit(1)

if __name__ == "__main__":
    main()