#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
解析 tab-enterprise.html 现有结构，提取全部课程数据。
只做读取与校验，不写文件。用于确认重构前后内容零丢失。
"""
import re, json, sys

SRC = 'tab-enterprise.html'
html = open(SRC, encoding='utf-8').read()

# ---------- 1. 切出 6 个 tab-content ----------
tab_blocks = []
for m in re.finditer(r'<div id="(tab\d)" class="tab-content[^"]*">', html):
    tab_blocks.append((m.group(1), m.start()))
# 用下一个 tab 的起点 / tabs-container 结束作为边界
ends = [tab_blocks[i + 1][1] for i in range(len(tab_blocks) - 1)]
tail = html.find('</section>', tab_blocks[-1][1])
ends.append(tail)

# ---------- 2. Tab 按钮文字 ----------
tab_names = re.findall(r'<button class="tab-button[^"]*"[^>]*>(.*?)</button>', html)

data = []
for (tid, start), end in zip(tab_blocks, ends):
    seg = html[start:end]

    # 角色引导
    role = {}
    rm = re.search(r'<div class="tab-role-hero-title">(.*?)</div>', seg, re.S)
    role['title'] = rm.group(1).strip() if rm else ''
    rm = re.search(r'<div class="tab-role-hero-desc">(.*?)</div>', seg, re.S)
    role['desc'] = rm.group(1).strip() if rm else ''
    role['tags'] = [t.strip() for t in re.findall(
        r'<span class="tab-role-tag">(.*?)</span>\s*(?=<span class="tab-role-tag"|</div>)', seg, re.S)]
    # 更稳的标签解析：逐个 tab-role-tag
    role['tags'] = []
    for tm in re.finditer(r'<span class="tab-role-tag">(.*?)</span>\s*</span>|<span class="tab-role-tag">(.*?)</span>', seg, re.S):
        pass
    # tab-role-tag 内嵌 role-emoji span，需匹配到成对结束
    for tm in re.finditer(r'<span class="tab-role-tag">((?:(?!</span>\s*(?:<span class="tab-role-tag"|</div>)).)*?)</span>\s*(?=<span class="tab-role-tag"|</div>)', seg, re.S):
        role['tags'].append(tm.group(1).strip())

    # 课程卡
    courses = []
    for cm in re.finditer(r'<div class="course-dropdown">(.*?)<!-- 右侧：视频封面占位符 -->(.*?)</div>\s*</div>\s*</div>\s*</div>\s*</div>', seg, re.S):
        left, right = cm.group(1), cm.group(2)
        c = {}
        hm = re.search(r'<a href="([^"]+)" class="detail-btn">(.*?)</a>', left)
        c['href'] = hm.group(1) if hm else ''
        c['btn'] = hm.group(2) if hm else '查看详情'
        c['titles'] = [t.strip() for t in re.findall(r'<div class="course-title">(.*?)</div>', left, re.S)]

        # 头像：img 版 或 div background-image 版
        am = re.search(r'<img src="([^"]+)"[^>]*class="instructor-avatar"', left)
        if am:
            c['avatar'] = am.group(1); c['avatar_pos'] = 'center center'; c['avatar_zoom'] = ''
        else:
            am = re.search(r"background-image:\s*url\('([^']+)'\)", left)
            c['avatar'] = am.group(1) if am else ''
            pm = re.search(r'background-position:\s*([^;]+);', left)
            c['avatar_pos'] = pm.group(1).strip() if pm else 'center center'
            zm = re.search(r'background-size:\s*([^;]+);', left)
            c['avatar_zoom'] = zm.group(1).strip() if zm else ''

        im = re.search(r'<div class="instructor-details">\s*(.*?)\s*</div>', left, re.S)
        c['instructor'] = im.group(1).strip() if im else ''

        pm = re.search(r'<p style="color: #2c3e50[^"]*">(.*?)</p>', left, re.S)
        c['highlights'] = []
        if pm:
            for line in re.split(r'<br\s*/?>', pm.group(1)):
                line = line.strip()
                if not line:
                    continue
                lm = re.match(r'^(\S*?)\s*<strong>(.*?)</strong>\s*[：:]\s*(.*)$', line, re.S)
                if lm:
                    c['highlights'].append({'icon': lm.group(1).strip(),
                                            'title': lm.group(2).strip(),
                                            'desc': lm.group(3).strip()})
                else:
                    c['highlights'].append({'icon': '', 'title': '', 'desc': line})

        vm = re.search(r'<img src="([^"]+)"', right)
        c['cover'] = vm.group(1) if vm else ''
        courses.append(c)

    data.append({'id': tid, 'courses': courses, 'role': role})

# ---------- 校验 ----------
total = sum(len(t['courses']) for t in data)
print('tab 数量        :', len(data))
print('tab 按钮        :', tab_names)
print('课程卡解析总数  :', total, '(源文件 course-dropdown 数 = %d)' % html.count('class="course-dropdown"'))
for t, name in zip(data, tab_names):
    miss_cover = sum(1 for c in t['courses'] if not c['cover'])
    miss_av = sum(1 for c in t['courses'] if not c['avatar'])
    miss_hl = sum(1 for c in t['courses'] if not c['highlights'])
    print('  %-4s %-22s 课程%2d  角色标签%d  缺封面%d 缺头像%d 缺亮点%d'
          % (t['id'], name[:20], len(t['courses']), len(t['role']['tags']), miss_cover, miss_av, miss_hl))

json.dump({'tabs': data, 'tab_names': tab_names},
          open('design-drafts/_enterprise-data.json', 'w', encoding='utf-8'),
          ensure_ascii=False, indent=1)
print('\n已导出 design-drafts/_enterprise-data.json')
