#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
把 HTML 里内嵌的 base64 媒体（data:image/... 或 data:video/...）抽成独立文件，
并把原处的 data URI 替换成指向抽出文件的相对路径。

- 图片默认抽到 `<html同目录>/<htmlstem>.assets/<hash>.<ext>`。
- 相同内容只写一份（按 sha1 去重）。
- 页面里本就是远程链接（http/https）的 gif/视频不受影响，只处理 data:base64。

用法：
  python3 scripts/extract_base64_media.py --dry-run <file.html> [<file2.html> ...]
  python3 scripts/extract_base64_media.py --write   <file.html> [...]
  参数 --kinds image,video 控制处理的媒体类型（默认仅 image）。
"""
import argparse
import base64
import hashlib
import os
import re
import sys

MIME_EXT = {
    "image/png": "png", "image/jpeg": "jpg", "image/jpg": "jpg",
    "image/gif": "gif", "image/webp": "webp", "image/svg+xml": "svg",
    "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov",
}

# data:<mime>;base64,<data>  —— data 部分到第一个非 base64 字符（" ' ) 空白 < 等）为止
PAT = re.compile(r"data:([a-zA-Z0-9.+/-]+);base64,([A-Za-z0-9+/=]+)")


def process(path, kinds, write):
    with open(path, "r", encoding="utf-8", errors="surrogatepass") as f:
        html = f.read()

    stem = os.path.splitext(os.path.basename(path))[0]
    outdir_rel = f"{stem}.assets"
    outdir_abs = os.path.join(os.path.dirname(path), outdir_rel)

    stats = {"count": 0, "bytes": 0, "by_ext": {}}
    seen = {}

    def repl(m):
        mime = m.group(1).lower()
        top = mime.split("/")[0]
        if top not in kinds:
            return m.group(0)  # 不处理的类型原样保留
        b64 = m.group(2)
        try:
            raw = base64.b64decode(b64, validate=False)
        except Exception:
            return m.group(0)
        ext = MIME_EXT.get(mime, top)
        h = hashlib.sha1(raw).hexdigest()[:16]
        name = f"{h}.{ext}"
        if h not in seen:
            seen[h] = name
            stats["count"] += 1
            stats["bytes"] += len(raw)
            stats["by_ext"][ext] = stats["by_ext"].get(ext, 0) + 1
            if write:
                os.makedirs(outdir_abs, exist_ok=True)
                with open(os.path.join(outdir_abs, name), "wb") as wf:
                    wf.write(raw)
        return f"{outdir_rel}/{seen[h]}"

    new_html = PAT.sub(repl, html)

    if write and stats["count"]:
        with open(path, "w", encoding="utf-8", errors="surrogatepass") as f:
            f.write(new_html)

    return stats, len(html), len(new_html)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("files", nargs="+")
    ap.add_argument("--write", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--kinds", default="image")
    args = ap.parse_args()
    kinds = set(k.strip() for k in args.kinds.split(",") if k.strip())
    write = args.write and not args.dry_run

    total_assets = total_saved = 0
    for path in args.files:
        if not os.path.isfile(path):
            continue
        stats, old, new = process(path, kinds, write)
        if stats["count"] == 0:
            continue
        total_assets += stats["count"]
        total_saved += (old - new)
        print(f"{path}")
        print(f"    抽出 {stats['count']} 个媒体  ({stats['by_ext']})  "
              f"素材共 {stats['bytes']//1024} KB")
        print(f"    HTML: {old//1024} KB -> {new//1024} KB  "
              f"({'已写入' if write else '预览'})")
    print(f"\n合计：抽出 {total_assets} 个媒体，HTML 体积减少约 {total_saved//1024} KB "
          f"({'WRITE' if write else 'DRY-RUN'})")


if __name__ == "__main__":
    main()
