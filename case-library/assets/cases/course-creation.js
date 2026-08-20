/* 培训 · 从零制课：课程视频流水线  (live) */
export default
{
  "id": "course-creation",
  "dept": "training",
  "path": "skill",
  "skill": "course-creation-workflow",
  "status": "live",
  "title": "从零制课：课程视频流水线",
  "slogan": "给一份文字稿，产出带字幕的 1080p 成片",
  "summary": "八个技能组成的制课流水线：文字稿 → PPT 课件 → 逐页讲稿 → AI 配音 → 烧录字幕成片。四个机器段自动执行，六个人工卡点由本人决策，最终五件套归档交付。",
  "tags": [
    "技能包",
    "4 机器段 + 6 卡点",
    "TTS 配音",
    "五件套交付"
  ],
  "client": "千问办公内部",
  "clientNote": "8 个技能 · 2 套 PPT 模板 · 7 个预置音色",
  "metrics": [
    {
      "value": "5–6 千字",
      "label": "≈ 一讲 15–18 分钟"
    },
    {
      "value": "8 个",
      "label": "技能组成流水线"
    },
    {
      "value": "5 件套",
      "label": "MP4 + SRT + 讲稿 + 课件 + PDF"
    }
  ],
  "pains": [
    "做一门课要串 PPT、讲稿、录音、剪辑、字幕五个工种，一讲能拖两周",
    "讲师不愿意出镜也不想录音，课就一直停在文字稿阶段",
    "每个人做的课件版式各不相同，品牌口径靠 review 兜",
    "字幕靠人工对轴，一讲十几分钟能对一下午"
  ],
  "solutions": [
    "总编排器 course-creation-workflow 调度全流程，每个人工决策点自动停下等人",
    "Stage 1 大纲→PPT（两套千问办公品牌模板，复制占位版式就地改字）",
    "Stage 2 逐页讲稿，按 250 字/分钟控时长；Stage 3 TTS 配音（7 个预置音色，可复刻本人音色）",
    "Stage 4 ASR 词级对轴 + PIL 逐条烧录字幕，输出 1080p 成片",
    "「自录 or TTS」分支：讲师想自己录，定稿讲稿 + 课件提前交付，录完回流烧字幕"
  ],
  "before": "五个工种串行，一讲拖两周，字幕对轴一下午",
  "after": "一份文字稿进，五件套出，人只在六个卡点做决策",
  "cover": "https://gw.alicdn.com/imgextra/i1/O1CN016YHmpQpVnZH3FPds_!!6000000003234-2-tps-1600-900.png",
  "demoLine": [
    "先看 SOP 流程图，分清哪四段是机器干、哪六个卡点是人干",
    "输入门槛：有文字稿最好，只有大纲也能直接起步",
    "走 Stage 1→4，卡点 D「自录还是 TTS」是最关键的选择",
    "试听音色库，可以复刻讲师本人的声音",
    "五件套归档交付：MP4 + SRT + 讲稿 + 课件 + PDF"
  ],
  "demoShots": [
    {
      "src": "case-library/demos/course-creation/course-sop-flow.svg",
      "href": "case-library/demos/course-creation/course-sop-flow.svg",
      "kind": "doc",
      "caption": "制课 SOP 流程图 · 四个机器段与六个人工卡点"
    },
    {
      "src": "https://gw.alicdn.com/imgextra/i4/O1CN01boHfnuL0VCJ3thAY_!!6000000003432-1-tps-1920-1074.gif",
      "caption": "制课全流程操作实录 · 自动循环"
    }
  ],
  "links": [
    {
      "group": "skill",
      "label": "查看 SOP 流程图",
      "href": "case-library/demos/course-creation/course-sop-flow.svg",
      "kind": "doc"
    },
    {
      "group": "skill",
      "label": "下载技能包（15MB）",
      "href": "https://github.com/qwenwork-courses/qwenwork-courses/releases/download/media-v1/course-creation-kit.zip",
      "kind": "file"
    },
    {
      "group": "output",
      "label": "带字幕成片（MP4 · 1080p）",
      "note": "点开先预览 · 右上角下载",
      "href": "https://github.com/qwenwork-courses/qwenwork-courses/releases/download/media-v1/course-creation-final-subtitled.mp4",
      "downloadName": "Skill技能与专家套件-字幕版.mp4",
      "kind": "video"
    },
    {
      "group": "output",
      "label": "其他产出（PPT、讲稿、配音）",
      "note": "三件配套文件 · 点开逐个下载",
      "href": "https://github.com/qwenwork-courses/qwenwork-courses/releases/download/media-v1/course-creation-slides.pptx",
      "kind": "bundle",
      "bundleLead": "《Skill 技能与专家套件》这一讲除成片之外的三件配套产物，可按需单独下载。",
      "files": [
        {
          "label": "PPT 课件（.pptx）",
          "note": "千问办公品牌模板 · Stage 1 产物",
          "href": "https://github.com/qwenwork-courses/qwenwork-courses/releases/download/media-v1/course-creation-slides.pptx",
          "downloadName": "千问办公_Skill技能与专家套件.pptx",
          "icon": "slides"
        },
        {
          "label": "逐页讲课稿（.md）",
          "note": "按 250 字/分钟控时长 · Stage 2 产物",
          "href": "case-library/demos/course-creation/course-creation-script.md",
          "downloadName": "Skill技能与专家套件-讲课稿.md",
          "icon": "doc"
        },
        {
          "label": "AI 配音（.mp3）",
          "note": "预置音色合成 · Stage 3 产物",
          "href": "https://github.com/qwenwork-courses/qwenwork-courses/releases/download/media-v1/course-creation-voiceover.mp3",
          "downloadName": "Skill技能与专家套件-配音.mp3",
          "icon": "audio"
        }
      ]
    }
  ],
  "media": {
    "type": "image",
    "src": "https://gw.alicdn.com/imgextra/i4/O1CN01boHfnuL0VCJ3thAY_!!6000000003432-1-tps-1920-1074.gif",
    "caption": "制课全流程操作实录 · 自动循环"
  },
  "prompt": "根据这篇文字稿做课程视频。受众是一线员工，目标时长 15 分钟左右，用千问办公极简版 PPT 模板，配音用音色库里的女声，最后出带烧录字幕的 1080p 成片。",
  "audience": [
    "企业大学 / 培训负责人",
    "内容讲师",
    "HR 培训",
    "产品市场"
  ]
};
