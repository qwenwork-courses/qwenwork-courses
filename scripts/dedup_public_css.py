#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""阶段二：把 public-courses/ 12 个详情页里【所有页规范化后完全一致】的 CSS 规则
抽到共享 public-courses/public-detail.css，各页保留自己独有/有差异的规则（原顺序不变），
并在 <style> 前插入 <link rel="stylesheet" href="public-detail.css">。

安全保证：
- 只抽“12 页规范化后完全相同”的规则；任一页取值不同的规则一律留在该页内联。
- 级联守卫：若某页里一条公共规则的选择器在该页更靠后被非公共规则覆盖，则该公共规则
  降级为不抽取，避免提前到 <link> 改变覆盖顺序。迭代至稳定。
"""
import glob
import os
import re

HERE = os.path.join(os.path.dirname(__file__), "..", "public-courses")


def extract_style(path):
    txt = open(path, encoding="utf-8").read()
    m = re.search(r"<style>(.*?)</style>", txt, re.S)
    if not m:
        return None
    return txt[:m.start(1)], m.group(1), txt[m.end(1):], txt


def split_segments(css):
    segs, i, n, b = [], 0, len(css), 0
    while i < n:
        if css[i:i+2] == "/*":
            j = css.find("*/", i+2)
            j = n if j == -1 else j+2
            if css[b:i].strip():
                segs.append(css[b:i])
            segs.append(css[i:j]); i = b = j; continue
        if css[i] == "{":
            d, j = 1, i+1
            while j < n and d:
                d += (css[j] == "{") - (css[j] == "}"); j += 1
            segs.append(css[b:j]); i = b = j; continue
        i += 1
    if css[b:].strip():
        segs.append(css[b:])
    return segs


is_rule = lambda s: "{" in s
selector_of = lambda s: re.sub(r"\s+", " ", s.split("{", 1)[0]).strip()
sig = lambda s: re.sub(r"\s+", " ", s).strip()


def main():
    pages = {}
    for p in sorted(glob.glob(os.path.join(HERE, "public-*-detail.html"))):
        parts = extract_style(p)
        if parts:
            pages[p] = {"parts": parts, "segs": split_segments(parts[1])}
    names = list(pages)

    common = None
    for p in names:
        s = {sig(x) for x in pages[p]["segs"] if is_rule(x)}
        common = s if common is None else (common & s)

    # 级联守卫
    changed = True
    while changed:
        changed = False
        for p in names:
            rules = [x for x in pages[p]["segs"] if is_rule(x)]
            last_uniq = {}
            for idx, x in enumerate(rules):
                if sig(x) not in common:
                    last_uniq[selector_of(x)] = idx
            for idx, x in enumerate(rules):
                if sig(x) in common and last_uniq.get(selector_of(x), -1) > idx:
                    common.discard(sig(x)); changed = True

    ref = max(names, key=lambda p: len(pages[p]["segs"]))
    common_segs, seen = [], set()
    for x in pages[ref]["segs"]:
        if is_rule(x) and sig(x) in common and sig(x) not in seen:
            seen.add(sig(x)); common_segs.append(x.strip())

    css_path = os.path.join(HERE, "public-detail.css")
    header = ("/* public-courses 12 个详情页共享样式（scripts/dedup_public_css.py 抽取）\n"
              "   只含所有页完全一致的规则；各页独有/差异化样式仍在各自 <style> 内联。\n"
              "   本文件在各页 <link ../common-styles.css> 之后、内联 <style> 之前加载，层叠顺序保持不变。 */\n\n")
    open(css_path, "w", encoding="utf-8").write(header + "\n\n".join(common_segs) + "\n")

    for p in names:
        pre, css, post, _ = pages[p]["parts"]
        kept = [x for x in pages[p]["segs"] if not (is_rule(x) and sig(x) in common)]
        new_inline = "\n" + "".join(kept).strip("\n") + "\n    "
        idx = pre.rfind("<style>")
        link = '<link rel="stylesheet" href="public-detail.css">\n    '
        new_pre = pre[:idx] + link + pre[idx:]
        open(p, "w", encoding="utf-8").write(new_pre + new_inline + post)

    print(f"公共规则 {len(common_segs)} 条 -> public-detail.css；改写 {len(names)} 页")
    for p in names:
        tot = sum(1 for x in pages[p]["segs"] if is_rule(x))
        print(f"  {os.path.basename(p):46s} 规则 {tot:3d} 抽走 {len(common_segs)}")


if __name__ == "__main__":
    main()
