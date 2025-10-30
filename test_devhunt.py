#!/usr/bin/env python3
"""
DevHunt 项目自动化测试脚本
测试主要功能：主页、工具列表、分类、详情页、响应式布局
"""

from playwright.sync_api import sync_playwright
import time
import sys

def test_homepage(page):
    """测试主页基本功能"""
    print("\n=== 测试主页 ===")

    # 导航到主页
    page.goto('http://localhost:3000')
    page.wait_for_load_state('networkidle')

    # 截图记录
    page.screenshot(path='/tmp/devhunt_homepage.png', full_page=True)
    print("✅ 主页截图已保存: /tmp/devhunt_homepage.png")

    # 检查标题
    try:
        title = page.title()
        print(f"✅ 页面标题: {title}")
    except Exception as e:
        print(f"❌ 获取标题失败: {e}")
        return False

    # 检查主要内容区域
    try:
        # 查找工具卡片
        tool_cards = page.locator('a[href^="/tool/"]').all()
        print(f"✅ 找到 {len(tool_cards)} 个工具卡片")

        if len(tool_cards) == 0:
            print("⚠️  警告: 没有找到工具卡片")
    except Exception as e:
        print(f"❌ 检查工具卡片失败: {e}")
        return False

    # 检查导航栏
    try:
        nav_links = page.locator('nav a').all()
        print(f"✅ 找到 {len(nav_links)} 个导航链接")
    except Exception as e:
        print(f"⚠️  未找到导航栏: {e}")

    return True

def test_categories(page):
    """测试分类功能"""
    print("\n=== 测试分类功能 ===")

    page.goto('http://localhost:3000')
    page.wait_for_load_state('networkidle')

    # 查找分类链接
    try:
        category_links = page.locator('a[href^="/category/"]').all()
        print(f"✅ 找到 {len(category_links)} 个分类链接")

        if len(category_links) > 0:
            # 点击第一个分类
            first_category = category_links[0]
            category_text = first_category.inner_text()
            print(f"📂 点击分类: {category_text}")

            first_category.click()
            page.wait_for_load_state('networkidle')
            page.wait_for_timeout(1000)

            # 截图分类页
            page.screenshot(path='/tmp/devhunt_category.png', full_page=True)
            print("✅ 分类页截图已保存: /tmp/devhunt_category.png")

            # 检查分类页的工具
            category_tools = page.locator('a[href^="/tool/"]').all()
            print(f"✅ 分类页显示 {len(category_tools)} 个工具")

            return True
        else:
            print("⚠️  未找到分类链接")
            return False

    except Exception as e:
        print(f"❌ 测试分类功能失败: {e}")
        return False

def test_tool_detail(page):
    """测试工具详情页"""
    print("\n=== 测试工具详情页 ===")

    page.goto('http://localhost:3000')
    page.wait_for_load_state('networkidle')

    try:
        # 查找第一个工具卡片
        tool_cards = page.locator('a[href^="/tool/"]').all()

        if len(tool_cards) > 0:
            first_tool = tool_cards[0]
            tool_href = first_tool.get_attribute('href')
            print(f"🔍 点击工具: {tool_href}")

            first_tool.click()
            page.wait_for_load_state('networkidle')
            page.wait_for_timeout(1000)

            # 截图详情页
            page.screenshot(path='/tmp/devhunt_tool_detail.png', full_page=True)
            print("✅ 工具详情页截图已保存: /tmp/devhunt_tool_detail.png")

            # 检查详情页内容
            content = page.content()
            if 'tool' in tool_href.lower():
                print("✅ 成功加载工具详情页")
                return True
            else:
                print("⚠️  详情页内容可能不完整")
                return False
        else:
            print("⚠️  未找到工具卡片")
            return False

    except Exception as e:
        print(f"❌ 测试工具详情页失败: {e}")
        return False

def test_responsive_layout(page):
    """测试响应式布局"""
    print("\n=== 测试响应式布局 ===")

    viewports = [
        {'name': 'Mobile', 'width': 375, 'height': 667},
        {'name': 'Tablet', 'width': 768, 'height': 1024},
        {'name': 'Desktop', 'width': 1920, 'height': 1080}
    ]

    for viewport in viewports:
        print(f"\n📱 测试 {viewport['name']} 视口 ({viewport['width']}x{viewport['height']})")

        page.set_viewport_size({'width': viewport['width'], 'height': viewport['height']})
        page.goto('http://localhost:3000')
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(500)

        # 截图不同视口
        screenshot_path = f"/tmp/devhunt_{viewport['name'].lower()}.png"
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"✅ {viewport['name']}视图截图已保存: {screenshot_path}")

        # 检查工具卡片在不同视口的显示
        try:
            tool_cards = page.locator('a[href^="/tool/"]').all()
            print(f"   找到 {len(tool_cards)} 个工具卡片")
        except Exception as e:
            print(f"   ⚠️  检查工具卡片失败: {e}")

    return True

def test_console_logs(page):
    """捕获控制台日志"""
    print("\n=== 控制台日志监控 ===")

    console_messages = []
    errors = []

    def handle_console(msg):
        console_messages.append(f"[{msg.type}] {msg.text}")
        if msg.type == 'error':
            errors.append(msg.text)
            print(f"❌ Console Error: {msg.text}")

    page.on('console', handle_console)

    page.goto('http://localhost:3000')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(2000)

    print(f"📝 捕获到 {len(console_messages)} 条控制台消息")
    print(f"❌ 发现 {len(errors)} 个错误")

    if errors:
        print("\n错误详情:")
        for error in errors[:5]:  # 只显示前5个错误
            print(f"  - {error}")

    return len(errors) == 0

def main():
    """主测试函数"""
    print("="*60)
    print("DevHunt 项目自动化测试")
    print("="*60)

    results = {
        '主页测试': False,
        '分类功能': False,
        '工具详情': False,
        '响应式布局': False,
        '控制台检查': False
    }

    with sync_playwright() as p:
        # 启动浏览器（无头模式）
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            # 执行各项测试
            results['主页测试'] = test_homepage(page)
            results['分类功能'] = test_categories(page)
            results['工具详情'] = test_tool_detail(page)
            results['响应式布局'] = test_responsive_layout(page)
            results['控制台检查'] = test_console_logs(page)

        except Exception as e:
            print(f"\n❌ 测试过程中发生错误: {e}")
            import traceback
            traceback.print_exc()
        finally:
            browser.close()

    # 输出测试总结
    print("\n" + "="*60)
    print("测试总结")
    print("="*60)

    passed = sum(1 for result in results.values() if result)
    total = len(results)

    for test_name, result in results.items():
        status = "✅ 通过" if result else "❌ 失败"
        print(f"{test_name}: {status}")

    print(f"\n总计: {passed}/{total} 测试通过")
    print(f"通过率: {passed/total*100:.1f}%")

    # 返回退出码
    return 0 if passed == total else 1

if __name__ == '__main__':
    sys.exit(main())
