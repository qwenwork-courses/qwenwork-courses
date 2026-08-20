/* 培训 · 课程海报制作  (live) */
export default
{
  "id": "course-poster",
  "dept": "training",
  "path": "skill",
  "skill": "course-poster-qwenwork",
  "status": "live",
  "title": "课程海报制作",
  "slogan": "一段课程文案 + 一个二维码，产出千问办公品牌风格竖版长图海报",
  "summary": "把课程文字内容（公众号文章、课程大纲、招生方案）转成千问办公品牌风格的竖版课程海报长图 PNG：内置绿色品牌视觉规范、两套主题、16 个可选模块、logo 素材与二维码生成。",
  "tags": [
    "技能包",
    "品牌视觉写死",
    "16 个可选模块",
    "竖版长图 PNG"
  ],
  "client": "",
  "clientNote": "2 套主题 · 16 个可选模块",
  "metrics": [
    {
      "value": "文案进图出",
      "label": "一段课程文案直接生成竖版长图海报"
    },
    {
      "value": "品牌一致",
      "label": "绿色主色 / logo / 字体规范写死在技能里"
    },
    {
      "value": "16 模块",
      "label": "Hero / 能力阶梯 / 开班信息 / 报名 CTA 按需拼装"
    }
  ],
  "pains": [
    "招生海报等设计排期：课程要开班，海报却卡在设计资源上，一张图来回改稿好几天",
    "品牌口径靠人兜：绿色主色、logo、字体、间距全凭设计师手感，不同人做出来调性各不相同",
    "文案到成图断层：公众号文章、课程大纲、招生信息都是文字，转成排版精美的长图海报要从零搭",
    "二维码、开班信息易漏：报名二维码、时间地点费用这些关键信息经常漏放或放错位置"
  ],
  "solutions": [
    "调用课程海报技能：course-poster-qwenwork 技能内置千问办公品牌视觉规范，文案进、海报出",
    "品牌视觉写死在技能里：绿色主色、两套主题（冷绿灰 / 亮绿白）、logo 素材、字体与间距统一规范，生成即合规",
    "16 个可选模块拼装：Hero、什么是 X、能力阶梯、培养目标、课程安排、适合谁学、开班信息、报名 CTA 等按需组合",
    "二维码与开班信息就位：报名二维码自动嵌入，时间、地点、形式、费用整齐排进开班信息栏",
    "竖版长图 PNG 交付：直接产出可发朋友圈 / 社群 / 公众号的竖版海报长图"
  ],
  "before": "招生海报等设计排期，文案到成图断层，品牌口径靠人兜",
  "after": "一段课程文案 + 一个二维码，直接产出千问办公品牌风格竖版长图海报",
  "demoLine": [
    "先给一段课程文案（公众号文章、课程大纲、招生信息都行）加一个报名二维码",
    "选主题：冷绿灰 或 亮绿白，品牌规范已经写死在技能里",
    "按需勾选模块：Hero、什么是 X、能力阶梯、培养目标、课程安排、适合谁学、开班信息、报名 CTA",
    "确认开班信息栏：时间、地点、形式、费用是否齐全",
    "产出竖版长图 PNG，直接发朋友圈 / 社群 / 公众号"
  ],
  "cover": "https://gw.alicdn.com/imgextra/i1/O1CN01w0HVeX60hCC3thAe_!!6000000007561-1-tps-1920-1080.gif",
  "links": [
    {
      "group": "skill",
      "label": "课程海报技能包",
      "href": "case-library/demos/course-poster/course-poster-skill.md",
      "kind": "text",
      "download": "https://github.com/qwenwork-courses/qwenwork-courses/releases/download/media-v1/course-poster-qwenwork.zip",
      "downloadName": "course-poster-qwenwork.zip",
      "note": "点开看技能定义，右上角下载包含 SKILL.md + 生图脚本 + 品牌素材 + 参考海报"
    },
    {
      "group": "sample",
      "label": "报名二维码.png",
      "href": "case-library/demos/course-poster/报名二维码.png",
      "kind": "doc",
      "note": "示例素材，会被自动嵌到海报的报名 CTA 区"
    },
    {
      "group": "output",
      "label": "FDE 认证课程海报（PNG）",
      "href": "case-library/demos/course-poster/fde_poster.png",
      "kind": "doc",
      "note": "实际产出的竖版长图海报，900×2000"
    },
    {
      "group": "output",
      "label": "海报原始 HTML",
      "href": "case-library/demos/course-poster/fde_poster.html",
      "kind": "demo",
      "note": "成图前的 HTML 源稿，改文案后可重新导出"
    }
  ],
  "media": {
    "type": "image",
    "src": "https://gw.alicdn.com/imgextra/i1/O1CN01w0HVeX60hCC3thAe_!!6000000007561-1-tps-1920-1080.gif",
    "caption": "课程海报生成实录 · 自动循环"
  },
  "prompt": "先调用「课程海报制作」技能（course-poster-qwenwork），并提供报名二维码图片，用下面这段课程文案生成海报：\n\n千问办公 FDE 工程师认证课程 | 首期杭州班 9月18-20日\nAI 落地难？那是缺了懂业务又懂技术的“FDE”工程师。\n9月18-20日，千问办公 FDE 认证课程首期班将在阿里巴巴西溪园区 C 区开班。带你从需求梳理到交付运维，掌握 AI 项目全流程能力。\n\n🎯 什么是 FDE？\n前线部署工程师 (Forward Deployed Engineer)\n他们是连接技术与业务的桥梁。不仅懂大模型和 Agent，更能深入一线，把技术转化为可落地的业务价值。\n🚀 3天2晚，你将获得什么？\n认知重塑：理解 FDE 角色定位，掌握企业 AI 转型的破局思路。\n硬核技能：精通 RAG、自定义智能体、Vibe Coding 及工作流编排。\n实战通关：从 0 到 1 梳理业务流程，亲手开发可运行的 Demo。\n权威认证：通过答辩即可获得认证证书，成为 AI 时代的超级个体。\n🎯 适合谁学？\n企业数字化负责人 (CTO / CIO)\n企业内部 IT 人员 (产品经理、架构/开发/运维工程师)\n企业 HR / 培训负责人 (HRBP、HR、企业内训师)\n业务部门核心骨干 (研发、销售、运营、客服)\n💡 报名详情\n时间：9月18-20日（3天2晚）\n地点：杭州·阿里巴巴西溪园区 C区\n形式：小班教学 · 先到先得\n费用：¥12,800元/人",
  "audience": [
    "企业大学 / 培训负责人",
    "HR 培训",
    "市场品牌",
    "内容运营"
  ]
};
