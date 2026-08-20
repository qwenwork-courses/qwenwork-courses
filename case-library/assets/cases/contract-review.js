/* 法务 · 合同审查工作台  (live) */
export default
{
  "id": "contract-review",
  "dept": "legal",
  "path": "skill",
  "skill": "contract-review",
  "status": "live",
  "title": "合同审查工作台",
  "slogan": "审查意见不是一份 PDF 报告，是能直接改成合同修订稿的工作台",
  "summary": "读入客户合同，按《民法典》及最新司法解释做高/中/低风险分级审查，输出交互式审查界面：左栏原文色块标注、右栏意见 hover 联动、建议一键替换原文、二次编辑、一键导出 Word。",
  "tags": [
    "交互式 HTML",
    "法律依据可溯",
    "一键导出 Word",
    "风险分级"
  ],
  "client": "云朵科技",
  "clientNote": "5 年期 ¥1288 万直签合同",
  "metrics": [
    {
      "value": "24 条",
      "label": "审查意见（高 9 / 中 11 / 低 4）"
    },
    {
      "value": "3 处",
      "label": "发现合同硬伤"
    },
    {
      "value": "1 次",
      "label": "审完即可导出修订稿"
    }
  ],
  "pains": [
    "合同一版几十页，法务逐条读，高风险条款容易被埋在附件和报价表里",
    "审查意见发出去是一份 Word 批注，业务看不懂风险等级，改不改全凭感觉",
    "金额勾稽、附件交叉引用这类硬伤靠人眼核对，改了一版又要重核一遍",
    "每次审查的判断标准留在个人经验里，换个人审就是另一套口径"
  ],
  "solutions": [
    "风险三级分色标注：红=高、黄=中、绿=低，无法判定的单独打「需人工复核」紫色徽章",
    "每条意见六字段固定输出：条款位置｜风险等级｜问题描述｜修改建议｜法律依据｜动作类型",
    "法律依据具体到条文号（《民法典》第 506/497/585 条、法释〔2023〕13 号、PIPL 第 20-21 条）",
    "「采用建议」一键把修订条文写进原文，旧条文收进灰色删除线折叠区——不删除、可对照",
    "导出 Word/Markdown/HTML 三选，四个内容开关控制是否带原文、未改条款、复核备注、修订记录表"
  ],
  "before": "几十页 PDF + 一份 Word 批注，业务方读不出优先级",
  "after": "一个可交互工作台，hover 看联动、点一下成修订稿、导出即定稿",
  "cover": "https://img.alicdn.com/imgextra/i4/O1CN01G6tRq5mMbeH58jg0_!!6000000001629-2-videocover-2532-1356.png",
  "demoLine": [
    "打开页面，顶部统计卡展示风险分布（高 / 中 / 低 / 需人工复核）",
    "悬停任意高风险条款，右栏意见卡自动定位高亮",
    "点「采用建议，替换原文」，绿色修订文本 + 灰色原文对照出现",
    "直接点击修订文本可二次编辑",
    "点「导出修订版」，Word/Markdown/HTML 三种格式一键导出"
  ],
  "links": [
    {
      "group": "skill",
      "label": "合同审查技能包",
      "href": "case-library/demos/contract-review/contract-review-skill.md",
      "kind": "text",
      "download": "case-library/demos/contract-review/contract-review-skill-kit.zip",
      "downloadName": "contract-review-skill-kit.zip",
      "note": "点开看技能定义，右上角下载包含 SKILL.md + 输出模板 template.html"
    },
    {
      "group": "sample",
      "label": "云枢平台采购合同.docx",
      "href": "case-library/demos/contract-review/云枢平台采购合同.docx",
      "kind": "file",
      "note": "示例合同，下载后可直接丢给 agent 试跑"
    },
    {
      "group": "output",
      "label": "交互式审查工作台",
      "href": "case-library/demos/contract-review/合同审查_星海制造_云枢平台采购_交互式.html",
      "kind": "demo",
      "note": "星海制造 · 云枢平台采购合同的实际审查产物"
    }
  ],
  "media": {
    "type": "image",
    "src": "https://gw.alicdn.com/imgextra/i2/O1CN01QN1NZo2w6eI2b872_!!6000000004050-1-tps-1280-716.gif",
    "caption": "合同审查工作台操作实录 · 自动循环"
  },
  "video": {
    "src": "https://cloud.video.taobao.com/vod/hhzvTOAjBgG089B-xCRMTHMeaH-h65jwwORDCtxWgXQ.mp4",
    "poster": "https://img.alicdn.com/imgextra/i4/O1CN01G6tRq5mMbeH58jg0_!!6000000001629-2-videocover-2532-1356.png",
    "caption": "合同审查完整操作演示 · 28 秒",
    "width": 1216,
    "height": 720
  },
  "prompt": "帮我审查这份合同，我方是甲方（采购方）。按《民法典》及最新司法解释做高/中/低风险分级，每条意见给出条款位置、风险等级、问题描述、修改建议和具体法律依据条文号，最后生成交互式 HTML 审查界面。",
  "audience": [
    "法务",
    "采购",
    "合同管理"
  ]
};
