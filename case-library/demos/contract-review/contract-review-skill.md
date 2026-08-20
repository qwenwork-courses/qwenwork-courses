---
name: contract-review
description: "合同审查（Contract Review）——读取客户合同 docx，按《民法典》及最新司法解释做高/中/低风险分级审查，并生成交互式 HTML 审查界面（左栏原文+右栏意见 hover 联动、建议一键替换原文、灰色保留原文、二次编辑、一键导出 Word/MD/HTML）。触发词：合同审查、审查合同、合同风险审查、合同审查界面、做一个合同审查演示、客户演示合同审查。"
version: 1.0.0
---

# 合同审查 · 交互式审查界面生成

面向 SA 客户演示与实际交付：输入一份合同（.docx/.md/.txt），输出单文件交互式 HTML 审查工作台。

## 交付物定义

单个自包含 HTML（无外部依赖、无 localStorage/sessionStorage——环境不支持浏览器存储），文件名规范：`合同审查_<客户名>_<项目>_交互式.html`，输出到 outputs 目录。

界面固定五能力（客户演示时逐个点击讲解）：

1. **左栏合同原文**：风险条款带色块标注（红=高 `r-high`、黄=中 `r-mid`、绿=低 `r-low`），紫色徽章=需人工复核。
2. **hover 联动**：悬停左侧条款→右栏定位高亮对应意见卡并压暗其余；点击意见卡左上角条款编号跳回原文。
3. **一键替换**：意见卡底部「采用建议，替换原文」→ 绿色修订文本写入左栏，原文收进灰色删除线折叠区（`<details>`），不删除。
4. **二次编辑**：绿色修订文本 `contentEditable`，左栏顶部控制条含「展开原文/锁定编辑/撤销全部」开关。
5. **一键导出**：右上角按钮弹窗，格式 Word(.doc)/Markdown/HTML 三选；内容四开关：含被替换原文（灰色删除线）/含未修改条款/含人工复核备注/文末修订记录表。导出基于左栏实时文本，二次编辑一并带走。

## 执行步骤

1. **读合同**：`pandoc -t markdown 合同.docx -o contract.md` 后通读全文（含附件、报价表、签署栏）。表格金额逐项心算勾稽（单价×年限=小计，各小计之和=总价，大小写一致）。
2. **审查**：逐条输出意见，每条含六字段：条款位置｜风险等级（高/中/低，无法判定的标"需人工复核"）｜问题描述｜修改建议｜法律依据（具体到《民法典》条文号及法释〔2023〕13号等）｜`act` 类型。
   - 审查必查清单：视为验收/验收标准落空、付款前置条件、赔偿上限与免责范围（第506/497/585条）、单方变更权（第543条）、违约金对等性、附件编号交叉引用、空白附件与缺失清单、数据处理/个人信息条款缺失（PIPL第20-21/55条）、不可抗力定义扩张（第180条）、管辖条款、金额勾稽、模板残留措辞（如"另两方"）。
   - 立场注意：先问用户代表甲方还是乙方；本模板审查视角默认甲方（采购方），乙方立场要反向表述"条款过狠易被认定无效"。
3. **写 HTML**：复用本技能目录下 `template.html`（含全部 CSS/JS/交互逻辑），只需替换三处：
   - 左栏 `#left .doc` 内的合同条款结构（`.sec > .sec-title + .cl`，风险条款加 `flag r-高/中/低` + `data-r="rN"`）；
   - 右栏数据 `const R = [...]`：每条 `{id,lv:"hi|mid|lo",man:bool,loc,act:"rep|ins|note",title,desc,fix,nw,law}`——`act:"rep"`=替换原文、`"ins"`=新增条款、`"note"`=插入复核备注；`nw` 必须是可直接落笔的修订条文（大写金额、中文数字期限）；**每条 entry 必须同时含 `act` 和 `nw`**；
   - 页眉 meta 与统计文案。
   - 排版稿允许用"（略）"压缩无风险条款，但被标注条款必须完整摘录。
4. **校验**（必做，见下方脚本）：data-r 引用与 R 卡片一一对应、无孤儿/缺失、`node --check` JS 语法通过。
5. **present**：`qwenwork_file_present_files` 展示 HTML，回复中说明五能力演示动线（hover→采用→编辑→导出）。

## 客户演示动线（3分钟版）

打开页面→顶部统计卡讲风险分布→hover 一个高风险条款看右栏联动→点「采用建议，替换原文」看绿色文本+灰色原文对照→现场点击修订文本改两个字（二次编辑）→点「⬇ 导出修订版」展示 Word 导出选项。落点话术："审查意见不是 PDF 报告，是能直接改成合同修订稿的工作台。"

## Pitfalls

- **每条 R entry 必须有 `act` 与 `nw` 字段**，漏 `act` 会导致该意见按钮行为错乱（曾踩坑 r2）。
- `data-r` 可空格分隔多个 id 共享同一锚点（如 "r1 r2"），但 id 分配只给首个未占用条款设 `id="cl-rN"`。
- `.flag` 色块类名是 `r-high/r-mid/r-low`，R 数组里是 `hi/mid/lo`，两套命名勿混。
- 导出 Word 用 `\ufeff` BOM + HTML content（application/msword），不要用 docx npm——这是浏览器端纯前端导出。
- 禁用 localStorage 存修订状态（环境不支持），全部状态放 JS 内存变量（`applied` Set）。
- 校验脚本模板：
  ```bash
  python3 -c "
  import re
  html=open('<文件>').read()
  m=re.search(r'const R = \[(.*?)\n\];',html,re.S)
  blocks=[b for b in re.split(r'\n (?=\{id:\"r\d+\")',m.group(1)) if b.strip().startswith('{id:')]
  bad=[re.search(r'\{id:\"(r\d+)\"',b).group(1) for b in blocks if 'act:\"' not in b or 'nw:\"' not in b]
  flags=set(i for f in re.findall(r'class=\"[^\"]*flag[^\"]*\"[^>]*data-r=\"([^\"]+)\"',html) for i in f.split())
  cards=set(re.findall(r'\{id:\"(r\d+)\"',html))
  print('entries:',len(blocks),'| missing act/nw:',bad or 'none')
  print('missing:',flags-cards,'orphans:',cards-flags)
  js=re.findall(r'<script>(.*?)</script>',html,re.S)[0]; open('/tmp/chk.js','w').write(js)
  " && node --check /tmp/chk.js
  ```

## Verification

校验脚本输出 `missing: set() orphans: set()` 且 `node --check` 通过；浏览器打开后：hover 任意色块右栏滚动定位、采用后左栏出现绿色文本+灰色原文折叠、导出弹窗四开关生效、下载文件可正常打开。

## 已用案例

2026-08 云朵科技钉钉直签合同（5年 ¥1288万）：24 条意见（高9/中11/低4，6条需人工复核），发现 9.6 附件错引、《产品及权益清单》缺失、7.3.1 条文残缺三处硬伤。模板即该案例产物。
