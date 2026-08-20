#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
按「方案 C 深色科技 Bento」重构 tab-enterprise.html。
原则：文案严格保留，只改排版、布局与设计规范。
数据源：design-drafts/_enterprise-data.json（由 extract_enterprise.py 生成）
"""
import json, re, html as ihtml

D = json.load(open('design-drafts/_enterprise-data.json', encoding='utf-8'))
TABS, NAMES = D['tabs'], D['tab_names']

CIRCLED = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳'

STYLE = r"""<style>
/* ============================================================
   企业定制课程页 · 方案 C 深色科技 Bento
   设计令牌集中在 .ent 上，全部类名以 ent- 前缀，避免与
   common-styles.css 的存量规则冲突。
   ============================================================ */
body { background: #f6f8f7 !important; }

.ent {
    /* 深色域 */
    --d-bg: #0a1410;
    --d-surface: rgba(255,255,255,.05);
    --d-surface-2: rgba(255,255,255,.08);
    --d-line: rgba(255,255,255,.10);
    --d-line-2: rgba(255,255,255,.18);
    --d-text: #f2f7f4;
    --d-text-2: rgba(242,247,244,.68);
    --d-text-3: rgba(242,247,244,.44);
    /* 浅色域 */
    --l-bg: #f6f8f7;
    --l-surface: #ffffff;
    --l-line: #e3e8e5;
    --l-text: #101a15;
    --l-text-2: #4a5b52;
    --l-text-3: #86958d;
    /* 主色 */
    --brand: #30bf69;
    --brand-2: #4ce285;
    --brand-3: #86eeb3;
    --brand-dim: rgba(48,191,105,.14);
    --glow: 0 0 0 1px rgba(48,191,105,.28), 0 12px 40px rgba(48,191,105,.16);
    /* 字号阶梯（仅这 9 级） */
    --fs-caption: 12px;
    --fs-sm: 13px;
    --fs-body: 15px;
    --fs-lead: 17px;
    --fs-h4: 19px;
    --fs-h3: 24px;
    --fs-h2: 36px;
    --fs-h1: 50px;
    /* 间距 4px 基数 */
    --s1: 4px;  --s2: 8px;  --s3: 12px; --s4: 16px;
    --s5: 20px; --s6: 24px; --s8: 32px; --s10: 40px;
    --s12: 48px; --s16: 64px; --s20: 80px; --s24: 96px;
    /* 形制 */
    --r-sm: 10px; --r-md: 16px; --r-lg: 22px; --r-xl: 28px; --r-pill: 999px;
    --page: 1280px;
    --gutter: 28px;

    font-family: 'PingFang SC', 'Microsoft YaHei', -apple-system, sans-serif;
    color: var(--l-text);
    line-height: 1.65;
    font-size: var(--fs-body);
    -webkit-font-smoothing: antialiased;
}
.ent *, .ent *::before, .ent *::after { box-sizing: border-box; }
.ent-wrap { max-width: var(--page); margin: 0 auto; padding: 0 var(--gutter); }

/* ---------- Hero ---------- */
.ent-hero { background: var(--d-bg); color: var(--d-text); position: relative; overflow: hidden; padding: var(--s20) 0; }
.ent-hero::before { content: ''; position: absolute; top: -30%; right: -4%; width: 880px; height: 680px; background: radial-gradient(circle, rgba(48,191,105,.24) 0%, transparent 62%); pointer-events: none; }
.ent-hero::after { content: ''; position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.028) 1px, transparent 1px); background-size: 56px 56px; -webkit-mask-image: radial-gradient(ellipse 80% 70% at 62% 35%, #000 25%, transparent 76%); mask-image: radial-gradient(ellipse 80% 70% at 62% 35%, #000 25%, transparent 76%); pointer-events: none; }
.ent-hero-in { position: relative; z-index: 2; display: grid; grid-template-columns: 1fr 300px; gap: var(--s16); align-items: center; }
.ent-hero h1 { font-size: var(--fs-h1); font-weight: 700; letter-spacing: -0.035em; line-height: 1.14; color: var(--d-text); margin: 0 0 var(--s5); }
.ent-hero h1 em { font-style: normal; background: linear-gradient(100deg, var(--brand-3), var(--brand)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
.ent-hero p { font-size: var(--fs-lead); color: var(--d-text-2); margin: 0; }
.ent-hero-art { display: flex; align-items: center; justify-content: center; }
.ent-hero-art img { width: 200px; height: auto; filter: drop-shadow(0 20px 50px rgba(48,191,105,.34)); animation: ent-float 4s ease-in-out infinite; }
@keyframes ent-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

/* ---------- 区块与标题 ---------- */
.ent-sec { padding: var(--s20) 0; }
.ent-sec-white { background: #fff; border-top: 1px solid var(--l-line); border-bottom: 1px solid var(--l-line); }
.ent-sec-head { text-align: center; margin-bottom: var(--s12); }
.ent-chip { display: inline-flex; align-items: center; gap: var(--s2); font-size: var(--fs-caption); font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--brand); background: var(--brand-dim); border: 1px solid rgba(48,191,105,.26); padding: var(--s1) var(--s3); border-radius: var(--r-pill); margin-bottom: var(--s5); }
.ent-sec-head h2 { font-size: var(--fs-h2); font-weight: 700; letter-spacing: -0.03em; line-height: 1.2; color: var(--l-text); margin: 0 0 var(--s3); }
.ent-sec-head p { font-size: var(--fs-lead); color: var(--l-text-2); max-width: 660px; margin: 0 auto; }

/* ---------- Bento 网格 ---------- */
.ent-bento { display: grid; grid-template-columns: repeat(6, 1fr); gap: var(--s4); }
.ent-bt { background: var(--l-surface); border: 1px solid var(--l-line); border-radius: var(--r-lg); overflow: hidden; position: relative; transition: transform .3s cubic-bezier(.2,.7,.2,1), box-shadow .3s ease, border-color .3s ease; }
.ent-bt:hover { transform: translateY(-4px); border-color: rgba(48,191,105,.4); box-shadow: 0 18px 48px rgba(16,26,21,.10); }
.ent-c2 { grid-column: span 2; }
.ent-c3 { grid-column: span 3; }
.ent-c6 { grid-column: span 6; }

/* ---------- 标签 ---------- */
.ent-tag { display: inline-block; font-size: var(--fs-caption); font-weight: 500; padding: 3px var(--s2); border-radius: var(--r-sm); color: var(--l-text-2); background: var(--l-bg); border: 1px solid var(--l-line); }

/* ---------- 按钮 ---------- */
.ent-btn { display: inline-flex; align-items: center; justify-content: center; gap: var(--s2); height: 40px; padding: 0 var(--s5); border-radius: var(--r-pill); font-size: var(--fs-sm); font-weight: 600; text-decoration: none; border: 1px solid transparent; cursor: pointer; transition: all .24s cubic-bezier(.2,.7,.2,1); }
.ent-btn-pri { background: linear-gradient(135deg, var(--brand), var(--brand-2)); color: #06180e; box-shadow: 0 8px 26px rgba(48,191,105,.30); }
.ent-btn-pri:hover { transform: translateY(-2px); box-shadow: 0 14px 38px rgba(48,191,105,.40); color: #06180e; }
.ent-more { display: inline-flex; align-items: center; gap: var(--s1); font-size: var(--fs-sm); font-weight: 600; color: var(--brand); text-decoration: none; white-space: nowrap; }
.ent-more:hover { gap: var(--s2); color: var(--brand); }

/* ---------- 价值卡 ---------- */
.ent-val { padding: var(--s8) var(--s6) var(--s6); }
.ent-val-badge { display: inline-flex; align-items: center; gap: var(--s2); font-size: var(--fs-caption); font-weight: 700; letter-spacing: 0.14em; color: var(--brand); margin-bottom: var(--s5); }
.ent-val-badge i { width: 22px; height: 1px; background: var(--brand); display: block; }
.ent-val h3 { font-size: var(--fs-h3); font-weight: 700; letter-spacing: -0.025em; color: var(--l-text); margin: 0 0 var(--s3); }
.ent-val p { font-size: var(--fs-body); color: var(--l-text-2); margin: 0 0 var(--s5); }
.ent-val-tags { display: flex; flex-wrap: wrap; gap: var(--s2); }

/* ---------- 三步流程 ---------- */
.ent-step { padding: var(--s6); overflow: hidden; }
.ent-step-ghost { position: absolute; top: -20px; right: var(--s4); font-size: 96px; font-weight: 800; color: rgba(48,191,105,.10); letter-spacing: -0.06em; line-height: 1; pointer-events: none; }
.ent-step h4 { position: relative; font-size: var(--fs-h3); font-weight: 700; letter-spacing: -0.025em; color: var(--l-text); margin: 0 0 var(--s3); }
.ent-step p { position: relative; font-size: var(--fs-body); color: var(--l-text-2); margin: 0; }

/* ---------- 领域切换：Segmented 控件（复用 .tabs-header / .tab-button 以保留原有切换脚本）---------- */
.ent .tabs-container { padding: 0 !important; margin-bottom: 0 !important; }
.ent .tabs-header { display: flex !important; flex-wrap: nowrap !important; gap: var(--s1) !important; padding: var(--s1) !important; margin: 0 0 var(--s10) !important; background: var(--l-surface) !important; border: 1px solid var(--l-line) !important; border-radius: var(--r-pill) !important; overflow-x: auto !important; -webkit-overflow-scrolling: touch; }
.ent .tab-button { flex-shrink: 0 !important; padding: var(--s3) var(--s5) !important; border: none !important; border-radius: var(--r-pill) !important; font-size: var(--fs-sm) !important; font-weight: 600 !important; color: var(--l-text-2) !important; background: transparent !important; box-shadow: none !important; white-space: nowrap !important; cursor: pointer; transition: all .22s ease !important; }
.ent .tab-button:hover { color: var(--l-text) !important; background: var(--l-bg) !important; }
.ent .tab-button.active { color: #06180e !important; background: linear-gradient(135deg, var(--brand), var(--brand-2)) !important; box-shadow: 0 6px 18px rgba(48,191,105,.28) !important; }
.ent .tab-content { padding: 0 !important; }
.ent .schedule-list { display: block !important; gap: 0 !important; }
.ent .schedule-item { background: transparent !important; backdrop-filter: none !important; border: none !important; border-left: none !important; border-radius: 0 !important; box-shadow: none !important; padding: 0 !important; }
.ent .schedule-item:hover { transform: none !important; box-shadow: none !important; }

/* ---------- 角色引导（通栏 Bento） ---------- */
.ent-role { padding: var(--s8); background: linear-gradient(120deg, rgba(48,191,105,.10), rgba(48,191,105,.02)); border-color: rgba(48,191,105,.30); }
.ent-role h3 { font-size: var(--fs-h3); font-weight: 700; letter-spacing: -0.025em; color: var(--l-text); margin: 0 0 var(--s3); }
.ent-role p { font-size: var(--fs-body); color: var(--l-text-2); max-width: 60em; margin: 0 0 var(--s5); }
.ent-role-tags { display: flex; flex-wrap: wrap; gap: var(--s2); }
.ent-role-tags span { display: inline-flex; align-items: center; gap: var(--s2); background: #fff; border: 1px solid rgba(48,191,105,.28); border-radius: var(--r-pill); padding: var(--s1) var(--s4); font-size: var(--fs-sm); font-weight: 500; color: var(--l-text-2); }
.ent-role-tags .role-emoji { font-size: var(--fs-body); }

/* ---------- 课程卡 ---------- */
.ent-crs { display: flex; flex-direction: column; }
.ent-crs-cover { position: relative; width: 100%; aspect-ratio: 16 / 9; overflow: hidden; background: #0d1a13; }
.ent-crs-cover img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .5s cubic-bezier(.2,.7,.2,1); }
.ent-bt:hover .ent-crs-cover img { transform: scale(1.06); }
.ent-crs-no { position: absolute; z-index: 2; top: var(--s4); left: var(--s4); min-width: 30px; height: 30px; padding: 0 var(--s2); border-radius: var(--r-sm); background: rgba(6,24,14,.72); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,.18); color: #fff; font-size: var(--fs-sm); font-weight: 700; display: flex; align-items: center; justify-content: center; }
.ent-crs-body { padding: var(--s6); display: flex; flex-direction: column; flex: 1; }
.ent-crs-title { font-size: var(--fs-h4); font-weight: 700; letter-spacing: -0.02em; line-height: 1.5; color: var(--l-text); margin: 0 0 var(--s3); }
/* 两行下限：让同一行内卡片的讲师行尽量对齐 */
.ent-crs .ent-crs-title:only-of-type { min-height: calc(var(--fs-h4) * 1.5 * 2); }
.ent-crs-title + .ent-crs-title { margin-top: calc(var(--s2) * -1); }
.ent-crs-ins { display: flex; align-items: center; gap: var(--s3); margin: var(--s2) 0 var(--s4); padding-bottom: var(--s4); border-bottom: 1px solid var(--l-line); }
.ent-crs-ins img { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; flex-shrink: 0; box-shadow: 0 0 0 2px rgba(48,191,105,.26); }
.ent-crs-ins-label { font-size: var(--fs-caption); font-weight: 600; letter-spacing: 0.06em; color: var(--brand); line-height: 1.4; }
.ent-crs-ins-name { font-size: var(--fs-body); font-weight: 700; color: var(--l-text); line-height: 1.4; }
.ent-crs-ins-role { font-size: var(--fs-caption); color: var(--l-text-3); line-height: 1.5; }
.ent-crs-pts { list-style: none; margin: 0 0 var(--s6); padding: 0; }
.ent-crs-pts li { display: flex; gap: var(--s2); font-size: var(--fs-body); color: var(--l-text-2); line-height: 1.65; margin-bottom: var(--s3); }
.ent-crs-pts li:last-child { margin-bottom: 0; }
.ent-crs-ico { flex-shrink: 0; font-size: var(--fs-body); line-height: 1.65; }
.ent-crs-pts b { color: var(--l-text); font-weight: 700; }
.ent-crs-foot { margin-top: auto; padding-top: var(--s5); display: flex; align-items: center; justify-content: flex-end; }

/* ---------- 响应式 ---------- */
@media (max-width: 1080px) {
    .ent-bento { grid-template-columns: repeat(4, 1fr); }
    .ent-c3 { grid-column: span 2; }
    .ent-c6 { grid-column: span 4; }
}
@media (max-width: 760px) {
    .ent { --fs-h1: 32px; --fs-h2: 26px; --fs-h3: 21px; --s20: 56px; --s16: 40px; --gutter: 20px; }
    .ent-hero-in { grid-template-columns: 1fr; gap: var(--s8); }
    .ent-hero-art { display: none; }
    .ent-bento { grid-template-columns: 1fr; }
    .ent-c2, .ent-c3, .ent-c6 { grid-column: span 1; }
    .ent-role { padding: var(--s6); }
}
</style>
"""


def split_instructor(raw):
    """拆成 (标签, 姓名, 头衔)，文本一律保留。"""
    lm = re.search(r'<strong[^>]*>(.*?)</strong>', raw, flags=re.S)
    label = lm.group(1).strip() if lm else '授课专家：'
    s = re.sub(r'<strong[^>]*>.*?</strong>', '', raw, flags=re.S).strip()
    m = re.match(r'^(.*?)\s*[—–-]\s*(.*)$', s, re.S)
    if m and len(m.group(1)) <= 24:
        return label, m.group(1).strip(), m.group(2).strip()
    return label, s, ''


def build_course(c):
    """生成单张课程 Bento 卡。标题中的 ①②③ 序号提取到封面角标，文字本身不变。"""
    nums, titles = [], []
    for t in c['titles']:
        m = re.match(r'^([%s])\s*(.*)$' % CIRCLED, t, re.S)
        if m:
            nums.append(m.group(1))
            titles.append(m.group(2).strip())
        else:
            titles.append(t)
    badge = ''.join(nums)

    name, role = '', ''
    label, name, role = split_instructor(c['instructor'])
    pos = c['avatar_pos'] if c['avatar_pos'] else 'center center'

    o = ['        <div class="ent-bt ent-crs ent-c2">']
    o.append('          <div class="ent-crs-cover">')
    if badge:
        o.append('            <span class="ent-crs-no">%s</span>' % badge)
    o.append('            <img src="%s" alt="课程视频封面" loading="lazy">' % c['cover'])
    o.append('          </div>')
    o.append('          <div class="ent-crs-body">')
    for t in titles:
        o.append('            <h3 class="ent-crs-title">%s</h3>' % t)
    o.append('            <div class="ent-crs-ins">')
    o.append('              <img src="%s" alt="%s" style="object-position:%s" loading="lazy">'
             % (c['avatar'], re.sub(r'<[^>]+>', '', name), pos))
    o.append('              <div>')
    o.append('                <div class="ent-crs-ins-label">%s</div>' % label)
    o.append('                <div class="ent-crs-ins-name">%s</div>' % name)
    if role:
        o.append('                <div class="ent-crs-ins-role">%s</div>' % role)
    o.append('              </div>')
    o.append('            </div>')
    o.append('            <ul class="ent-crs-pts">')
    for h in c['highlights']:
        ico = '<span class="ent-crs-ico">%s</span>' % h['icon'] if h['icon'] else ''
        if h['title']:
            body = '<span><b>%s</b>：%s</span>' % (h['title'], h['desc'])
        else:
            body = '<span>%s</span>' % h['desc']
        o.append('              <li>%s%s</li>' % (ico, body))
    o.append('            </ul>')
    o.append('            <div class="ent-crs-foot"><a class="ent-more" href="%s">%s →</a></div>'
             % (c['href'], c['btn']))
    o.append('          </div>')
    o.append('        </div>')
    return '\n'.join(o)


# ================= 组装页面 =================
P = []
P.append('<!-- 企业定制课程 Tab 内容片段 · 方案 C 深色科技 Bento -->')
P.append('')
P.append(STYLE.rstrip())
P.append('')
P.append('<div class="ent">')

# ---- Hero ----
P.append('''
<!-- Hero -->
<section class="ent-hero">
  <div class="ent-wrap ent-hero-in">
    <div>
      <span class="ent-chip">企业定制课程</span>
      <h1>千问办公赋能百业，<em>AI提效</em></h1>
      <p>打造企业培训爆款课程</p>
    </div>
    <div class="ent-hero-art">
      <img src="https://gw.alicdn.com/imgextra/i4/O1CN01KADrQnhsdyC1Lxsw_!!6000000003535-2-tps-667-759.png" alt="千问办公logo">
    </div>
  </div>
</section>'''.strip('\n'))

# ---- 为什么选我们 ----
VALS = [
    ('实战', '场景精准，拿来即用', '覆盖 7 大核心业务领域，每门课直击真实业务痛点，方案学完即可落地执行。',
     ['制造业', '电商', '餐饮连锁', '营销', '战略']),
    ('权威', '专家亲授，实战验证', '来自阿里生态及头部企业的实战专家，不讲概念只讲经验，分享已验证的转型路径。',
     ['阿里生态', '行业头部', '千万级项目']),
    ('洞察', '深度拆解，全链覆盖', '从战略顶层设计到一线操作细节，为管理者和执行者提供完整的 AI 落地路线图。',
     ['战略层', '管理层', '执行层']),
]
P.append('')
P.append('<!-- 为什么选我们 -->')
P.append('<section class="ent-sec"><div class="ent-wrap">')
P.append('  <div class="ent-sec-head">')
P.append('    <h2>为什么选我们？</h2>')
P.append('    <p>拒绝空洞理论，只提供经过千万级业务场景验证的实战方案</p>')
P.append('  </div>')
P.append('  <div class="ent-bento">')
for badge, title, desc, tags in VALS:
    P.append('    <div class="ent-bt ent-val ent-c2">')
    P.append('      <div class="ent-val-badge"><i></i>%s</div>' % badge)
    P.append('      <h3>%s</h3>' % title)
    P.append('      <p>%s</p>' % desc)
    P.append('      <div class="ent-val-tags">%s</div>'
             % ''.join('<span class="ent-tag">%s</span>' % t for t in tags))
    P.append('    </div>')
P.append('  </div>')
P.append('</div></section>')

# ---- 三步定制 ----
STEPS = [
    ('1', '选行业场景', '从电商、餐饮、制造、营销等行业中找到您的赛道'),
    ('2', '找业务痛点', '获客增长？运营提效？战略落地？精准匹配需求'),
    ('3', '组专属方案', '挑选匹配课程，拼出您的企业AI提效方案'),
]
P.append('')
P.append('<!-- 三步完成企业专属定制 -->')
P.append('<section class="ent-sec ent-sec-white"><div class="ent-wrap">')
P.append('  <div class="ent-sec-head">')
P.append('    <h2>三步完成企业专属定制</h2>')
P.append('    <p>选场景、挑痛点、组方案</p>')
P.append('  </div>')
P.append('  <div class="ent-bento">')
for n, label, desc in STEPS:
    P.append('    <div class="ent-bt ent-step ent-c2">')
    P.append('      <span class="ent-step-ghost">%s</span>' % n)
    P.append('      <h4>%s</h4>' % label)
    P.append('      <p>%s</p>' % desc)
    P.append('    </div>')
P.append('  </div>')
P.append('</div></section>')

# ---- 精选课程 ----
P.append('')
P.append('<!-- 精选课程介绍 -->')
P.append('<section class="ent-sec"><div class="ent-wrap">')
P.append('  <div class="ent-sec-head">')
P.append('    <h2>精选课程介绍</h2>')
P.append('  </div>')
P.append('  <div class="tabs-container">')
P.append('    <div class="tabs-header">')
for i, n in enumerate(NAMES):
    P.append('      <button class="tab-button%s" data-tab="%d">%s</button>'
             % (' active' if i == 0 else '', i, n))
P.append('    </div>')

for i, (t, name) in enumerate(zip(TABS, NAMES)):
    P.append('')
    P.append('    <!-- %s ｜ %s -->' % (t['id'], name))
    P.append('    <div id="%s" class="tab-content%s">' % (t['id'], ' active' if i == 0 else ''))
    P.append('      <div class="schedule-list"><div class="schedule-item">')
    P.append('      <div class="ent-bento">')
    r = t['role']
    P.append('        <div class="ent-bt ent-role ent-c6">')
    P.append('          <h3>%s</h3>' % r['title'])
    P.append('          <p>%s</p>' % r['desc'])
    P.append('          <div class="ent-role-tags">%s</div>'
             % ''.join('<span>%s</span>' % tg for tg in r['tags']))
    P.append('        </div>')
    for c in t['courses']:
        P.append(build_course(c))
    P.append('      </div>')
    P.append('      </div></div>')
    P.append('    </div>')

P.append('  </div>')
P.append('</div></section>')
P.append('')
P.append('</div><!-- /.ent -->')

# ---- 保留原有弹窗与 Tab 切换脚本 ----
P.append(r'''
<script>
    function openAboutModal() {
        document.getElementById('aboutModal').classList.add('active');
    }
    function closeAboutModal(e) {
        if (e.target.id === 'aboutModal' || e.target.classList.contains('modal-close')) {
            document.getElementById('aboutModal').classList.remove('active');
        }
    }

    // 领域 Tab 切换（事件委托）
    (function() {
        const container = document.querySelector('.tabs-container');
        if (!container) return;

        const buttons = container.querySelectorAll('.tab-button');
        const tabs = container.querySelectorAll('.tab-content');

        const tabIds = ['tab1', 'tab2', 'tab3', 'tab4', 'tab5', 'tab6'];
        buttons.forEach((btn, index) => {
            if (index < tabIds.length) {
                btn.setAttribute('data-tab-id', tabIds[index]);
            }
        });

        buttons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('data-tab-id');
                buttons.forEach(b => b.classList.remove('active'));
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                const targetTab = document.getElementById(targetId);
                if (targetTab) targetTab.classList.add('active');
            });
        });

        if (buttons.length > 0 && tabs.length > 0) {
            buttons[0].classList.add('active');
            tabs[0].classList.add('active');
        }
    })();
</script>

<div id="aboutModal" class="modal-overlay" onclick="closeAboutModal(event)">
    <div class="modal-content">
        <button class="modal-close" onclick="closeAboutModal(event)">×</button>
        <img src="https://gw.alicdn.com/imgextra/i4/O1CN01YbfFB41gsHQmY6xbc_!!6000000004197-2-tps-1600-900.png" alt="关于我们" class="modal-image">
    </div>
</div>

<!-- Global float logic handled by main page -->
'''.strip('\n'))

out = '\n'.join(P) + '\n'
open('tab-enterprise.html', 'w', encoding='utf-8').write(out)

print('已写入 tab-enterprise.html')
print('  课程卡 :', out.count('ent-bt ent-crs'))
print('  Tab    :', out.count('class="tab-content'))
print('  行数   :', out.count('\n'))
