#!/usr/bin/env python3
"""核心文件验证检查 — 变更后运行以确认结构完整性。

用法:
    python3 tests/test_core_files.py          # 独立运行，输出通过/失败
    pytest tests/test_core_files.py -v        # 如已安装 pytest，可用 pytest 运行

无外部依赖，仅使用 Python 标准库 + node --check 做 JS 语法校验。
"""

import os
import re
import subprocess
import sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ── 核心文件清单 ──────────────────────────────────────────────
CORE_FILES = {
    "index.html": {"type": "html", "desc": "SPA 入口，tab 切换框架"},
    "assets/js/global-float.js": {"type": "js", "desc": "全局悬浮客服组件"},
    "case-library/assets/app.js": {"type": "js", "desc": "案例库渲染逻辑"},
    "case-library/assets/data.js": {"type": "js", "desc": "案例库全局配置"},
    "case-library/assets/poster.js": {"type": "js", "desc": "海报生成模块"},
    "case-library/assets/qr.js": {"type": "js", "desc": "二维码生成模块"},
    "case-library/assets/style.css": {"type": "other", "desc": "案例库样式表"},
    "assets/css/common-styles.css": {"type": "other", "desc": "全站共享样式聚合入口"},
}

# index.html 应引用的 tab 文件（位于 tabs/）
TAB_FILES = [
    "tab-home.html",
    "tab-cases.html",
    "tab-enterprise.html",
    "tab-public.html",
    "tab-about.html",
    "tab-online.html",
]

# app.js 应 import 的模块
APP_IMPORTS = ["./data.js", "./poster.js"]

# data.js 应 export 的常量
DATA_EXPORTS = ["DEPTS", "PATHS", "SITE"]

# index.html 应包含的结构元素
INDEX_STRUCTURAL = ["switchMainTab", "assets/css/common-styles.css", "tab-"]


# ── HTML 标签平衡检查器 ────────────────────────────────────────
class TagBalanceChecker(HTMLParser):
    """检查 HTML 标签是否平衡（开闭匹配）。"""

    VOID_ELEMENTS = frozenset(
        "area base br col embed hr img input link meta param source track wbr".split()
    )

    def __init__(self):
        super().__init__()
        self.stack = []
        self.errors = []

    def handle_starttag(self, tag, attrs):
        if tag.lower() not in self.VOID_ELEMENTS:
            self.stack.append((tag, self.getpos()))

    def handle_endtag(self, tag):
        tag = tag.lower()
        if tag in self.VOID_ELEMENTS:
            return
        if not self.stack:
            self.errors.append(f"多余闭合标签 </{tag}> 在 {self.getpos()}")
            return
        top_tag, top_pos = self.stack[-1]
        if top_tag == tag:
            self.stack.pop()
        else:
            self.errors.append(
                f"标签不匹配: 期望 </{top_tag}>（开在 {top_pos}）"
                f"但遇到 </{tag}> 在 {self.getpos()}"
            )

    def finalize(self):
        for tag, pos in self.stack:
            self.errors.append(f"未闭合标签 <{tag}> 开在 {pos}")
        return len(self.errors) == 0


# ── 检查函数 ──────────────────────────────────────────────────
def _rel(path):
    return os.path.relpath(os.path.join(ROOT, path), ROOT)


def _read(path):
    full = os.path.join(ROOT, path)
    with open(full, encoding="utf-8") as f:
        return f.read()


def check_file_exists(path):
    """核心文件存在且非空。"""
    full = os.path.join(ROOT, path)
    if not os.path.isfile(full):
        return False, f"文件不存在: {path}"
    if os.path.getsize(full) == 0:
        return False, f"文件为空: {path}"
    return True, f"OK: {path} ({os.path.getsize(full)} bytes)"


def check_js_syntax(path):
    """JS 文件通过 node --check 语法校验。"""
    full = os.path.join(ROOT, path)
    try:
        result = subprocess.run(
            ["node", "--check", full],
            capture_output=True,
            text=True,
            timeout=10,
        )
        if result.returncode == 0:
            return True, f"OK: {path} 语法正确"
        snippet = result.stderr.strip().split("\n")[-1] if result.stderr.strip() else "未知错误"
        return False, f"{path} 语法错误: {snippet}"
    except FileNotFoundError:
        return False, f"node 未安装，无法检查 {path} 语法"
    except subprocess.TimeoutExpired:
        return False, f"node --check 超时: {path}"


def check_html_structure(path):
    """HTML 文件有 DOCTYPE 且标签平衡。"""
    try:
        content = _read(path)
    except FileNotFoundError:
        return False, f"文件不存在: {path}"

    errors = []
    if not content.strip().lower().startswith("<!doctype"):
        errors.append("缺少 DOCTYPE 声明")

    parser = TagBalanceChecker()
    parser.feed(content)
    parser.finalize()
    errors.extend(parser.errors)

    if errors:
        return False, f"{path} HTML 结构问题: {'; '.join(errors)}"
    return True, f"OK: {path} HTML 结构正确"


def check_index_references():
    """index.html 引用的 tab 文件和样式表都存在。"""
    try:
        content = _read("index.html")
    except FileNotFoundError:
        return False, "index.html 不存在"

    missing = []

    # index.html 通过 fetch(`tabs/tab-${tabId}.html`) 动态加载 tab 片段
    # 检查 fetch 模式 + data-tab 属性，而非静态文件名引用
    if "tabs/tab-${tabId}.html" not in content:
        missing.append("缺少 fetch(`tabs/tab-${tabId}.html`) 动态加载模式")

    # 从 data-tab 属性提取 tab ID，验证对应文件存在于 tabs/
    tab_ids = re.findall(r'data-tab="([^"]+)"', content)
    if not tab_ids:
        missing.append("未找到 data-tab 属性")
    for tid in tab_ids:
        tab_file = os.path.join("tabs", f"tab-{tid}.html")
        if not os.path.isfile(os.path.join(ROOT, tab_file)):
            missing.append(f"data-tab=\"{tid}\" 对应文件不存在: {tab_file}")

    for css in ["assets/css/common-styles.css"]:
        if css not in content:
            missing.append(f"未引用样式: {css}")

    if missing:
        return False, f"index.html 引用问题: {'; '.join(missing)}"
    return True, "OK: index.html 引用完整"


def check_app_imports():
    """app.js 的 import 语句指向存在的文件。"""
    try:
        content = _read("case-library/assets/app.js")
    except FileNotFoundError:
        return False, "case-library/assets/app.js 不存在"

    missing = []
    for imp in APP_IMPORTS:
        if imp not in content:
            missing.append(f"缺少 import: {imp}")
        else:
            resolved = os.path.join(ROOT, "case-library/assets", imp.lstrip("./"))
            if not os.path.isfile(resolved):
                missing.append(f"import 目标不存在: {imp}")

    # 检查 export boot
    if "export function boot" not in content and "export const boot" not in content:
        missing.append("缺少 export boot 函数")

    if missing:
        return False, f"app.js 导入问题: {'; '.join(missing)}"
    return True, "OK: app.js 导入和导出完整"


def check_data_exports():
    """data.js 导出 DEPTS、PATHS、SITE。"""
    try:
        content = _read("case-library/assets/data.js")
    except FileNotFoundError:
        return False, "case-library/assets/data.js 不存在"

    missing = []
    for const in DATA_EXPORTS:
        if f"export const {const}" not in content:
            missing.append(f"缺少 export const {const}")

    if missing:
        return False, f"data.js 导出问题: {'; '.join(missing)}"
    return True, "OK: data.js 导出完整"


def check_global_float_guard():
    """global-float.js 有 IIFE 和去重守卫。"""
    try:
        content = _read("assets/js/global-float.js")
    except FileNotFoundError:
        return False, "assets/js/global-float.js 不存在"

    issues = []
    if "(function()" not in content.replace(" ", ""):
        issues.append("缺少 IIFE 模式")
    if "__floatContactLoaded" not in content:
        issues.append("缺少 __floatContactLoaded 去重守卫")

    if issues:
        return False, f"global-float.js 结构问题: {'; '.join(issues)}"
    return True, "OK: global-float.js 结构正确"


def check_case_files_exist():
    """data.js 中引用的案例文件都存在。"""
    cases_dir = os.path.join(ROOT, "case-library/assets/cases")
    if not os.path.isdir(cases_dir):
        return False, "case-library/assets/cases/ 目录不存在"

    case_files = [f for f in os.listdir(cases_dir) if f.endswith(".js")]
    if len(case_files) < 10:
        return False, f"案例文件过少: 仅 {len(case_files)} 个"

    # 每个案例文件应 export default
    bad = []
    for cf in case_files:
        full = os.path.join(cases_dir, cf)
        try:
            with open(full, encoding="utf-8") as f:
                text = f.read()
            if "export default" not in text:
                bad.append(cf)
        except Exception as e:
            bad.append(f"{cf} (读取失败: {e})")

    if bad:
        return False, f"案例文件缺少 export default: {', '.join(bad)}"
    return True, f"OK: {len(case_files)} 个案例文件均有 export default"


# ── pytest 兼容测试函数 ──────────────────────────────────────
def test_core_files_exist():
    for path in CORE_FILES:
        ok, msg = check_file_exists(path)
        assert ok, msg


def test_js_syntax():
    for path, info in CORE_FILES.items():
        if info["type"] == "js":
            ok, msg = check_js_syntax(path)
            assert ok, msg


def test_html_structure():
    for path, info in CORE_FILES.items():
        if info["type"] == "html":
            ok, msg = check_html_structure(path)
            assert ok, msg


def test_index_references():
    ok, msg = check_index_references()
    assert ok, msg


def test_app_imports():
    ok, msg = check_app_imports()
    assert ok, msg


def test_data_exports():
    ok, msg = check_data_exports()
    assert ok, msg


def test_global_float_guard():
    ok, msg = check_global_float_guard()
    assert ok, msg


def test_case_files_exist():
    ok, msg = check_case_files_exist()
    assert ok, msg


# ── 独立运行入口 ──────────────────────────────────────────────
ALL_CHECKS = [
    ("核心文件存在性", [check_file_exists(p) for p in CORE_FILES]),
    ("JS 语法校验", [check_js_syntax(p) for p, i in CORE_FILES.items() if i["type"] == "js"]),
    ("HTML 结构校验", [check_html_structure(p) for p, i in CORE_FILES.items() if i["type"] == "html"]),
    ("index.html 引用完整性", [check_index_references()]),
    ("app.js 导入与导出", [check_app_imports()]),
    ("data.js 导出完整性", [check_data_exports()]),
    ("global-float.js 结构守卫", [check_global_float_guard()]),
    ("案例文件完整性", [check_case_files_exist()]),
]


def main():
    print("=" * 60)
    print("核心文件验证检查")
    print("=" * 60)

    all_pass = True
    total = 0
    passed = 0

    for group_name, results in ALL_CHECKS:
        print(f"\n【{group_name}】")
        for ok, msg in results:
            total += 1
            status = "✓ PASS" if ok else "✗ FAIL"
            if not ok:
                all_pass = False
            else:
                passed += 1
            print(f"  {status}  {msg}")

    print("\n" + "=" * 60)
    print(f"结果: {passed}/{total} 通过", end="")
    if all_pass:
        print(" — 全部通过 ✓")
        return 0
    else:
        print(f" — {total - passed} 项失败 ✗")
        return 1


if __name__ == "__main__":
    sys.exit(main())
