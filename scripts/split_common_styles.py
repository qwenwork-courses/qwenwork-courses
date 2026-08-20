#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""一次性：把 common-styles.css 按顶层分区切成 styles/*.css，
common-styles.css 改为按原顺序 @import 聚合入口。

安全保证：
- 只在“大括号深度为 0”的边界切分（不会切进任何规则内部）。
- 切完立即校验：各分区顺序拼接 == 原文件逐字节一致；不一致则不写。
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "common-styles.css")

# (起始行1based, 输出文件名)  —— 起始行为该分区第一行
CUTS = [
    (1,    "01-base.css"),          # 顶部注释 + Part1：reset/全站页脚/基础响应式
    (1097, "02-tokens-nav.css"),    # Part2：字体栈 + 设计令牌 :root + 顶部导航
    (1670, "03-home.css"),          # 首页：痛点/最佳实践/过渡/新布局/热门课程
    (2362, "04-course-detail.css"), # CEO专场等课程详情页样式
    (2765, "05-about.css"),         # 关于我们页面
    (3785, "06-public.css"),        # 公开课紧凑列表
    (4103, "07-hero-banner.css"),   # Hero Banner 全屏滚动
    (4378, "08-cooperation.css"),   # 合作咨询模块
]


def depth_of(text):
    """计算一段文本累计的大括号深度。跳过 /* */ 注释里的括号。"""
    depth = 0
    i = 0
    n = len(text)
    while i < n:
        if text[i:i+2] == "/*":
            j = text.find("*/", i+2)
            i = n if j < 0 else j+2
            continue
        c = text[i]
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
        i += 1
    return depth


def main():
    with open(SRC, "rb") as f:
        data = f.read()  # 二进制读，保留原始 CRLF，不做换行转换
    lines = data.splitlines(keepends=True)  # bytes 行，保留行尾
    total = len(lines)
    nl = b"\r\n" if b"\r\n" in data else b"\n"  # 跟随原文件行尾

    # 校验每个切点在深度 0（在解码后的文本上算括号）
    bad = []
    for start1, name in CUTS:
        prefix = b"".join(lines[:start1 - 1]).decode("utf-8")
        d = depth_of(prefix)
        if d != 0:
            bad.append(f"{name} 起始行 {start1} 处深度={d}（非顶层，禁止切分）")
    if bad:
        print("切点校验失败：\n  " + "\n  ".join(bad))
        return 1

    # 生成分区（bytes 切片，逐字节保真）
    styles_dir = os.path.join(ROOT, "styles")
    os.makedirs(styles_dir, exist_ok=True)
    bounds = [c[0] for c in CUTS] + [total + 1]
    parts = []
    for idx, (start1, name) in enumerate(CUTS):
        end1 = bounds[idx + 1]
        chunk = b"".join(lines[start1 - 1:end1 - 1])
        parts.append((name, chunk))

    # 逐字节一致性校验
    if b"".join(chunk for _, chunk in parts) != data:
        print("拼接结果与原文件不一致，已中止（不写任何文件）")
        return 1

    # 写分区（二进制，保留 CRLF）
    for name, chunk in parts:
        with open(os.path.join(styles_dir, name), "wb") as f:
            f.write(chunk)

    # 写聚合入口（行尾跟随原文件）
    header_lines = [
        "/* 全站共享样式 · 聚合入口",
        "   原单文件已按分区拆到 styles/，此处仅按原顺序 @import，层叠顺序与拆分前完全一致。",
        "   改样式请到对应 styles/ 分区文件；本文件只维护 @import 列表。 */",
        "",
    ]
    out = nl.join(l.encode("utf-8") for l in header_lines)
    out += b"".join((f'@import url("styles/{name}");').encode("utf-8") + nl for _, name in CUTS)
    with open(SRC, "wb") as f:
        f.write(out)

    print(f"完成：拆出 {len(parts)} 个分区，逐字节一致 ✓")
    for name, chunk in parts:
        print(f"  styles/{name}  ({chunk.count(chr(10).encode())} 行)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
