---
name: course-poster-qwenwork
description: 把课程文字内容（公众号文章、课程大纲、招生方案）转成千问办公品牌风格的竖版课程海报长图 PNG。内置绿色品牌视觉规范、两套主题（classic 冷绿灰 / vivid 亮绿白）、16 个可选模块（Hero/什么是X/数据看点/能力阶梯/培养目标/N天课程安排/两天一览/真实场景/对比/价值格/学员收获/适合谁学/开班信息/金句/报名CTA/落地页尾屏）、logo 素材与二维码生成。当用户要"做课程海报""课程内容转海报""招生海报""培训海报""公众号文章生成海报""课程宣传图"或给出课程文字要求出图时使用。
version: 2.0.0
---

# 千问办公课程海报生成

把一段课程文字变成可直接发群/朋友圈/公众号的竖版长图海报。视觉基准是两张真实海报（FDE 认证课程、超级员工的 AI 五项修炼），绝对不要自创风格。

## 产物

`<输出目录>/<名称>.png` —— 宽 1440px 的竖版长图，高度随内容（典型 6000–8000px）。

## 执行流程

### 第 1 步 · 拿到课程原文

用户可能给公众号链接、贴一段文字、给 docx/md 文件，或让你从旧海报里提。

公众号链接（mp.weixin.qq.com）常有验证墙，WebFetch 会拿回"环境异常"页。遇到这种情况不要硬试第二遍，直接让用户把正文粘贴过来或让他导出文件；也可以用浏览器工具打开真实页面读取。钉钉文档链接（alidocs.dingtalk.com）若跨组织会读不到，同样让用户粘贴正文。

**内容保真是硬要求**：标题、金句、课程条目、价格、时间地点必须逐字照搬原文，禁止改写、推测或补全。原文没写的模块就不要那个模块，不要凭想象编内容。真缺关键信息（比如价格、报名链接）就问用户。

### 第 2 步 · 澄清缺口

只问原文里确实找不到的东西，别问原文已有的。典型要问的：选哪套主题、报名二维码指向哪个链接或哪张图片、价格要不要露出、是否保留"首期/开班信息"这类时效字段。

### 第 3 步 · 选主题与模块

**主题**（顶层 `"theme"`）：

- `classic` —— FDE 认证课那种冷绿灰，页面底 `#F7FBF9`，主绿 `#17B862`。偏正式、认证类、企业内训、高单价。默认值。
- `vivid` —— 五项修炼那种纯白底 + 更亮的绿（`#22C55E`），对比更强。偏 C 端、大众化、"人人可学"的课。

**模块**分两组，按课程性质挑，不要全上（16 个全塞进去图会又长又平）：

*认证/体系课常用*：`intro`（什么是X）→ `goals`（培养目标 3 条）→ `schedule`（逐日详细课表）→ `gains`（学员收获）→ `audience` → `logistics` → `quote` → `cta`

*大众/训练营常用*：`metrics`（数据看点）→ `ladder`（能力阶梯）→ `overview`（两天一览）→ `scenarios`（真实场景）→ `compare`（对比）→ `valuegrid`（你会带走什么）→ `audience` → `logistics` → `footer_cta`

`schedule` 和 `overview` 是详细版 / 概览版的两种表达，一般只选一个。`cta` 和 `footer_cta` 也是二选一（`footer_cta` 是整块绿色渐变尾屏，更像落地页；`cta` 是白卡片 + 二维码 + 价格）。

### 第 4 步 · 写内容 JSON

照抄 `reference/example-content.json` 的结构（那是 FDE 海报的逐字内容，可直接当模板改）。schema 见下方「内容 JSON」。

写完自查：

- 双列模块（`goals` `audience` `valuegrid`）的条目顺序是**行优先**——先左后右再下一行，别按列排；
- 每个课程条目控制在 14 个全角字以内，超了会折行拖高卡片；
- 金句每行不超过 24 个全角字，避免末行只剩一两个孤字；
- 窄格子的字数上限见「排版避坑」第 8 条，写的时候就数一遍。

### 第 5 步 · 渲染

```bash
python3 ~/.qoderwork/skills/course-poster-qwenwork/scripts/build_poster.py \
    content.json -o <输出目录> --name <文件名>
```

可选参数：`--keep-html` 保留中间 HTML 便于微调，`--slice` 额外切片，`--max-slice-h N` 切片高度阈值。

### 第 6 步 · 必须验收

渲染完**一定要看图**，不能只看脚本没报错就交付。用 PIL 把长图切 4–5 段逐段读：

```python
from PIL import Image
im = Image.open("out/poster.png"); W, H = im.size
for i in range(5):
    im.crop((0, H*i//5, W, H*(i+1)//5)).save(f"chk_{i}.png")
```

逐段核对：文字有没有被裁掉、有没有孤字、装饰元素有没有压住文字、绿色比例是否失衡、底部有没有多余空白、二维码是否完整。发现问题改 JSON 或改 `scripts/build_poster.py` 里的 CSS，然后重渲重看。

同时和 `reference/` 里对应主题的原图对比一眼整体气质是否一致。

### 第 7 步 · 交付

把 PNG 拷到用户可见的输出目录，用 `file://` 绝对路径链接给出，附一句简短说明。不要长篇解释你做了什么。

## 内容 JSON

顶层：`theme`（可选，默认 `classic`）/ `brand` / `hero`（必需）/ `sections`（有序数组）。`sections` 里每项靠 `type` 区分，顺序即渲染顺序。

### 行内标记

正文类字段支持两种标记，用来做局部变色强调（对应两张原海报里句中飘绿的做法）：

- `**文字**` → 绿色加粗
- `[[文字]]` → 绿色（不额外加粗）

支持的字段：`hero.title_line1/2`、`ladder.title/desc`、`overview.title/desc`、`valuegrid.desc`。其他字段是纯文本转义，写 `**` 会原样显示。一屏里别超过两处强调，否则失焦。

### Hero

```jsonc
"hero": {
  "logo_lockup": "logo_cn.png",      // 可选。给了就用 logo 图替代文字眉标
  "badge": "2 天线下工作坊 · 杭州",   // 可选。标题上方的胶囊标签
  "title_line1": "超级员工的",        // 墨色，主词
  "title_line2": "AI [[五项修炼]]",   // 不含标记时整行绿；含 [[ ]] 时按标记局部变色
  "subtitles": ["从会用工具，到会造工具", "把 AI 变成你的第二个大脑"],  // 可选，1–2 行
  "meta": "2026 年 9 月 5 日 - 6 日 · 杭州西溪",   // 可选。给了才画上方分隔线
  "tags": ["零代码", "真实业务场景", "当场出交付物"],  // 可选，胶囊组，≤ 4 个
  "art": "mark_3d.png"               // 可选，默认 3D 品牌符号
}
```

两行标题都别超过 7 个字。`badge` ≤ 14 字，`tags` 每个 ≤ 6 字。

### 模块

```jsonc
{ "type": "intro", "title": "什么是FDE?",
  "role_cn": "前线部署工程师", "role_en": "Forward Deployed Engineer",
  "body": "长段落，可给字符串或字符串数组（多段）",
  "strip": [ { "icon": "question", "label": "是什么", "text": "串联业务、技术、合规与交付" } ] }

{ "type": "metrics", "title": "为什么现在必须学", "cols": 3,
  "items": [ { "value": "78", "unit": "%", "lines": ["的知识工作岗位", "工作内容已被 AI 重塑"] } ] }
  // 大数字 + 单位 + 1–2 行说明。cols 默认按条数取 1–3。数字必须来自原文，不许编。

{ "type": "goals", "title": "课程培养目标",
  "items": ["认知重塑：...", "能力构建：...", "实战通关：..."] }   // 建议正好 3 条

{ "type": "ladder", "title": "五项修炼：能力阶梯",
  "items": [ { "level": "L1", "name": "对话力",
               "title": "把 **模糊需求** 讲成 AI 能执行的指令",
               "desc": "结构化提问、角色设定、约束与验收标准。",
               "output": "一套可复用的个人 Prompt 卡片", "output_emoji": "📦" } ] }
  // 分级递进的能力体系。level+name 在左侧绿色标签块里，name ≤ 4 字。

{ "type": "schedule", "title": "3天课程安排",
  "days": [ { "label": "DAY 1", "theme": "认知筑基 × 需求识别",
              "groups": [ { "label": "理论讲解", "items": ["...", "..."] } ],
              "slots":  [ { "label": "上午", "value": "09:00 - 12:00" } ] } ] }

{ "type": "overview", "title": "两天安排一览",
  "days": [ { "label": "DAY 1", "tag": "打地基", "title": "对话力 + 调研力",
              "desc": "上午拆解 **提问结构**，下午实战做一份带引用的调研。",
              "result": "个人 Prompt 卡片 + 调研简报", "result_emoji": "🎯" } ] }
  // schedule 的轻量版：一天一条，没有分时段课表。

{ "type": "scenarios", "title": "现场会做的真实场景",
  "items": [ { "emoji": "📄", "title": "合同风险初筛",
               "flow": ["上传合同", "条款抽取", "风险分级", "生成审查意见"],
               "involves": "对话力 · 造物力" } ] }
  // flow 各段之间自动插绿色箭头，每段 ≤ 6 字、总共 ≤ 4 段。

{ "type": "compare", "title": "和别的 AI 课有什么不一样",
  "left_header": "常见 AI 课", "right_header": "五项修炼工作坊",
  "rows": [ { "left": "讲功能演示，回去就忘", "right": "拿你自己的业务当练习题" } ] }
  // 左列灰、右列墨色加粗 + 浅绿底。每格 ≤ 12 字，建议 3–5 行。

{ "type": "valuegrid", "title": "你会带走什么", "cols": 2,
  "items": [ { "metric": "01", "label": "一套方法", "desc": "五项修炼的 **可迁移打法**。" } ] }
  // metric 可以是序号也可以是数字指标。cols 默认 2。

{ "type": "gains", "title": "学员收获",
  "items": [ { "title": "认知重塑 ｜ FDE角色认知", "desc": "..." } ] }  // title 用全角｜自动分两段

{ "type": "audience", "title": "适合谁学?", "items": ["...", "..."] }   // 建议偶数条

{ "type": "logistics", "title": "首期开班信息",
  "items": [ { "icon": "calendar", "label": "时间", "value": "9月18-20日 · 3天2晚" } ] }  // 3–4 格

{ "type": "quote", "lines": ["...", "..."], "attribution": "千问办公 ｜ FDE 认证课程" }

{ "type": "cta", "headline": "报名咨询",
  "price_prefix": "课程定价", "price": "12800", "price_suffix": "元/人",
  "note": "名额有限 · 小班教学 · 先到先得",
  "note_green": "首期 9月18-20日 · 杭州·阿里巴巴全球总部C区",
  "qr_caption": "扫描填写报名表单",
  "qr_url": "https://...",          // 二者给其一；qr_image 优先
  "qr_image": "/abs/path/qr.png",
  "brand_logo": "logo_cn.png" }

{ "type": "footer_cta", "headline": "扫码咨询报名", "sub": "名额有限，先报先得",
  "tags": ["可开发票", "含两日午餐", "赠课后社群"],
  "qr_url": "https://...", "qr_image": "/abs/path/qr.png",
  "qr_caption": "扫码添加课程顾问", "brand_logo": "logo_cn.png" }
  // 整块绿色渐变尾屏，白字居中。放在最后一个模块。
```

可用图标名：`question` `target` `trend` `calendar` `pin` `people` `spark` `book` `clock` `price` `rocket`。给不认识的名字会退化成 `spark`。

`assets/logos/` 里的素材：`logo_cn.png`（3D符号+千问办公，CTA 用）、`logo_en.png`（QwenWork 英文）、`mark_3d.png`（3D 立体符号，hero 和金句用）、`mark_flat.png`、`mark_app_3d.png`。

## 内容改写规则

课程原文常是散文式招生长文，要压成海报语汇：

**Hero 标题**拆成"主词 + 品类词"两行，主词是听众关心的角色或能力（FDE工程师 / 智能体开发 / AI 提效），品类词是产品形态（认证课程 / 实战训练营）。

**数据看点**（`metrics`）的数字只能来自原文明确写出的数据，原文没数据就不要这个模块。别把"很多""大幅"翻译成具体百分比。

**能力阶梯**（`ladder`）的 `level` 用 L1–L5 或 01–05，`name` 是三到四字的能力名（对话力 / 造物力 / 编排力），`title` 是一句白话说明这一级到底能干什么，`output` 是这一级学完手上多出来的东西——必须是具体交付物名词，不是"能力提升"这种空话。

**培养目标**固定 3 条，每条写成"四字概括：具体内容"（认知重塑：理解...），概括词是绿色数字下的第一印象，要动词性、有力量。

**课程安排**按天拆，每天必须有 `theme`（两个短语用 `×` 连接，如"认知筑基 × 需求识别"），条目按"理论讲解 / 实操演练 / 考核与结业"分组。原文若只有大纲没分组，就按"讲 / 练 / 考"归类。时段用 `上午 / 下午 / 晚间 / 结业`。

**真实场景**（`scenarios`）的 `flow` 是动作链，每段是动词短语（上传合同 → 条款抽取 → 风险分级），不要写成结果名词。场景必须是原文提到的，别自己编业务。

**对比**（`compare`）左列写"常见做法的痛"，右列写"本课程的解"，一一对应。左列不要贬低具体友商，只描述现象。

**学员收获**每条是"能力名 + 一句展开"。首尾两条可用 `认知重塑 ｜ FDE角色认知` 双段式呼应培养目标，中间几条用单段能力名。展开句用分号串联具体动作，别写空话。

**金句**必须是原文里真实出现的句子，逐字引用。原文没有金句就不要这个模块，别自己造。

**适合谁学**每条格式为"角色（具体岗位举例）"，括号里给 2–4 个岗位名帮读者自我对号。

## 排版避坑

1. **相对路径会毁掉渲染**：脚本内部已把输出目录转绝对路径，因为 `file://` 相对路径会让 Chrome 渲染"文件未找到"错误页——那个页面是纯白的，肉眼看输出尺寸正常还以为成功了。别把这段逻辑改回相对路径。
2. **Chrome 的 `--default-background-color` 不要加**：它会同时破坏 `--dump-dom` 测高和页面背景。
3. **测高机制**：HTML 末尾的脚本把 `scrollHeight` 写进 `document.title`，靠 `--dump-dom` 读回。所有内嵌图片都带显式 `width/height`，布局才在解析期确定、测高才准。新增图片元素时务必也带上尺寸。
4. **底边裁切靠洋红哨兵**：`html/body` 背景是 `#FF00FF`，只有 `.page` 是真背景色，裁剪脚本从底部往上找第一行非洋红。别给 `.page` 之外的元素刷背景色——`footer_cta` 的绿色渐变是画在 `.page` 内部的 section 上，不是刷在 body 上。
5. **flex 会压扁窄元素**：`.sec-bar`（5px 绿条）、`.day-sep`（1px 竖线）必须带 `flex:none`，否则被压成细丝。新增窄装饰元素同理。
6. **装饰不能压字**：金句卡右侧的弧线曾横穿署名行。加装饰后一定截图确认。
7. **中文标点落行首**治不了，只能靠控制条目长度规避。
8. **窄格子必须卡字数**，否则折行留孤字（末行只剩一两个字），是最常见的返工点。实测上限：
   - `logistics` 的 `value`：3 格时 ≤ 13 个全角字，4 格时 ≤ 9 个。格子已改成"图标+标签在上、值在下"的竖排以争取宽度，但仍会折行。日期别写 `2026/09/05 (周六) - 09/06 (周日)`，压成 `9月5-6日 · 周六至周日`。
   - `cta` 的 `note` + `note_green` 两段加起来 ≤ 26 个全角字，超了会在中间断词（把"阿里巴巴"劈成两行）。地点在 `logistics` 已完整出现过时，这里可简写成"西溪园区C区"。
   - `intro.strip` 三格的 `text` ≤ 13 个全角字。这里也已改成竖排（图标+标签在上、文本在下）。
   - `compare` 每格 ≤ 12 个全角字；`scenarios.flow` 每段 ≤ 6 个全角字且总段数 ≤ 4。
   - `ladder` 的 `name` ≤ 4 个全角字（左侧标签块宽度固定）。
   写完 JSON 先按这几个上限数一遍字，比渲染后再回来改快得多。
9. **主题切换是 CSS 字符串替换**，不是 CSS 变量。改 CSS 时若引入新的绿色色值，记得同步加进 `build_poster.py` 顶部的 `THEMES["vivid"]` 映射表，否则 vivid 主题下会漏色。
10. **主标题的粗度靠描边**：苹方最重只到 Bold，`font-weight` 再加也没用，所以 hero 标题用 `-webkit-text-stroke:1.6px currentColor` + `paint-order:stroke fill` 撑出视觉重量。要更粗就调这个数值，别去改 `font-weight`。
11. **超高图**：宽 1440 时高度超约 11600px 会突破 iOS Safari 单图约 16.7Mpx 上限，脚本会提示，此时加 `--slice` 出切片版一并交付。

## 参考文件

- `reference/design-spec.md` —— 完整设计规范（色值、字号、每个模块的骨架尺寸）。要改 CSS 或加新模块前先读。
- `reference/example-content.json` —— FDE 海报（classic）逐字内容，改内容最快的起点。
- `reference/example-content-vivid.json` —— vivid 主题 + 7 个新模块的结构示例。**里面的文案和数字全是占位内容**，只能拿它看 JSON 长什么样，不许把里面的句子或数字搬进真实海报。
- `reference/example_poster_fde.png` —— classic 主题的视觉基准原图。
- `reference/example_poster_five_disciplines.jpg` —— vivid 主题的视觉基准原图（超级员工的 AI 五项修炼，已压缩）。
