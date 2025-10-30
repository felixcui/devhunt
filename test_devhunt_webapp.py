#!/usr/bin/env python3
"""
DevHunt Web Application Testing Script
使用Playwright自动测试DevHunt应用的核心功能
"""

from playwright.sync_api import sync_playwright
import time
import os

def test_devhunt():
    """测试DevHunt应用的核心功能"""

    print("🚀 开始测试 DevHunt 应用...")

    with sync_playwright() as p:
        # 启动浏览器(headless模式)
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 设置视口大小
        page.set_viewport_size({"width": 1920, "height": 1080})

        try:
            # ========== 测试1: 首页加载 ==========
            print("\n📋 测试1: 首页加载")
            page.goto('http://localhost:3000')
            page.wait_for_load_state('networkidle')

            # 截图保存
            os.makedirs('/tmp/devhunt_tests', exist_ok=True)
            page.screenshot(path='/tmp/devhunt_tests/01_homepage.png', full_page=True)
            print("   ✅ 首页加载成功,截图已保存")

            # 检查页面标题
            title = page.title()
            print(f"   📄 页面标题: {title}")

            # ========== 测试2: 查找导航元素 ==========
            print("\n📋 测试2: 检查导航元素")

            # 等待页面内容加载
            page.wait_for_timeout(2000)

            # 查找所有链接
            links = page.locator('a').all()
            print(f"   🔗 找到 {len(links)} 个链接")

            # 查找所有按钮
            buttons = page.locator('button').all()
            print(f"   🔘 找到 {len(buttons)} 个按钮")

            # ========== 测试3: 工具卡片展示 ==========
            print("\n📋 测试3: 检查工具卡片")

            # 查找工具卡片(根据常见的class命名)
            tool_cards = page.locator('[class*="tool"], [class*="card"], article').all()
            print(f"   🃏 找到 {len(tool_cards)} 个卡片元素")

            page.screenshot(path='/tmp/devhunt_tests/02_tool_cards.png', full_page=True)
            print("   ✅ 工具卡片截图已保存")

            # ========== 测试4: 分类导航 ==========
            print("\n📋 测试4: 测试分类导航")

            # 查找分类链接
            category_links = page.locator('nav a, [class*="category"] a').all()
            if len(category_links) > 0:
                print(f"   📂 找到 {len(category_links)} 个分类链接")

                # 点击第一个分类(如果存在)
                if len(category_links) > 0:
                    first_category = category_links[0]
                    category_text = first_category.text_content()
                    print(f"   👆 点击分类: {category_text}")

                    first_category.click()
                    page.wait_for_load_state('networkidle')
                    page.wait_for_timeout(1000)

                    page.screenshot(path='/tmp/devhunt_tests/03_category_page.png', full_page=True)
                    print("   ✅ 分类页面截图已保存")

                    # 返回首页
                    page.goto('http://localhost:3000')
                    page.wait_for_load_state('networkidle')
            else:
                print("   ⚠️  未找到分类链接")

            # ========== 测试5: 响应式设计(移动端) ==========
            print("\n📋 测试5: 测试移动端响应式设计")

            # 设置移动端视口
            page.set_viewport_size({"width": 375, "height": 667})
            page.reload()
            page.wait_for_load_state('networkidle')
            page.wait_for_timeout(1000)

            page.screenshot(path='/tmp/devhunt_tests/04_mobile_view.png', full_page=True)
            print("   ✅ 移动端视图截图已保存")

            # 恢复桌面视口
            page.set_viewport_size({"width": 1920, "height": 1080})

            # ========== 测试6: 控制台错误检查 ==========
            print("\n📋 测试6: 检查控制台错误")

            console_errors = []
            page.on("console", lambda msg: console_errors.append(msg) if msg.type == "error" else None)

            page.reload()
            page.wait_for_load_state('networkidle')
            page.wait_for_timeout(2000)

            if console_errors:
                print(f"   ⚠️  发现 {len(console_errors)} 个控制台错误:")
                for error in console_errors[:5]:  # 只显示前5个
                    print(f"      - {error.text}")
            else:
                print("   ✅ 未发现控制台错误")

            # ========== 测试7: 性能指标 ==========
            print("\n📋 测试7: 收集性能指标")

            # 获取性能指标
            performance = page.evaluate("""() => {
                const perfData = window.performance.timing;
                const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                const domReady = perfData.domContentLoadedEventEnd - perfData.navigationStart;
                return {
                    loadTime: loadTime,
                    domReady: domReady
                };
            }""")

            print(f"   ⏱️  页面加载时间: {performance['loadTime']}ms")
            print(f"   ⏱️  DOM就绪时间: {performance['domReady']}ms")

            # ========== 测试8: DOM结构分析 ==========
            print("\n📋 测试8: 分析DOM结构")

            # 获取主要的section数量
            sections = page.locator('main section, main div[class*="section"]').all()
            print(f"   📊 主要区块数量: {len(sections)}")

            # 获取图片数量
            images = page.locator('img').all()
            print(f"   🖼️  图片数量: {len(images)}")

            # 最终截图
            page.screenshot(path='/tmp/devhunt_tests/05_final_state.png', full_page=True)

            print("\n" + "="*50)
            print("✅ 测试完成!")
            print(f"📁 测试截图保存在: /tmp/devhunt_tests/")
            print("="*50)

        except Exception as e:
            print(f"\n❌ 测试过程中发生错误: {str(e)}")
            page.screenshot(path='/tmp/devhunt_tests/error.png', full_page=True)
            raise

        finally:
            # 关闭浏览器
            browser.close()

if __name__ == "__main__":
    test_devhunt()
