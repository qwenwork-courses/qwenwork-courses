/* =============================================================================
 *  千问办公 · 案例库全局配置（部门分类 / 实现路径分类 / 首页文案）
 *  ---------------------------------------------------------------------------
 *  案例数据不在这里，在 cases/<id>.js，一个案例一个文件。
 *  新增案例：新建 cases/<新id>.js（export default 一个对象），再把这个 id
 *  追加到 tab-cases.html 的 CASE_FILES 里；那个数组的顺序 = 同部门内的展示顺序。
 *  case.dept 要能在下面 DEPTS 里找到，case.path 要能在 PATHS 里找到。
 *  status: 'live' = 已交付可演示 | 'demo' = 演示素材就绪 | 'wip' = 待补充
 * ========================================================================== */

export const DEPTS = [
  { id: 'legal',     name: '法务',   en: 'Legal',      icon: 'scale',   desc: '合同、合规、风控文书的审查与留痕' },
  { id: 'hr',        name: '人力',   en: 'HR',         icon: 'users',   desc: '绩效、招聘、人事流程的线上化与自动化' },
  { id: 'marketing', name: '市场',   en: 'Marketing',  icon: 'megaphone', desc: '投放、内容、渠道数据的分析与生产' },
  { id: 'admin',     name: '行政',   en: 'Admin',      icon: 'building', desc: '接待、资产、后勤服务的数据化管理' },
  { id: 'training',  name: '培训',   en: 'Training',   icon: 'play',    desc: '课程、知识、SOP 的批量生产与沉淀' },
  { id: 'finance',   name: '财务',   en: 'Finance',    icon: 'coins',   desc: '经营分析、稽核、报表的自动成稿' },
  { id: 'sales',     name: '销售',   en: 'Sales',      icon: 'target',  desc: '客户跟进、方案与标书的提效' },
  { id: 'ops',       name: '生产运营', en: 'Operations', icon: 'gauge',  desc: '质量、排产、异常追溯的实时看板' },
  /* 行业维度分类：按客户所属行业归集的垂直案例，固定排在部门之后 */
  { id: 'ecommerce', name: '电商',   en: 'E-commerce', icon: 'cart',    desc: '跨境电商广告投放与店铺数据的自动巡查' }
];

/* =============================================================================
 *  实现路径分类（第二套筛选维度，与行业分类互相独立）
 *  ---------------------------------------------------------------------------
 *  命名与千问办公官网（qwenwork.cn）「六大核心能力」的说法对齐：
 *    企业协作 / 产物交付 / 多模态 / 网页交付 / 数据聚合 / 技能市场
 *  每个案例只挂一个主路径（case.path），以“靠什么能力做成的”为准。
 * ========================================================================== */
export const PATHS = [
  { id: 'webapp',     name: '全栈网页交付',   en: 'Web Delivery',    desc: 'vibe coding 直出带交互与数据逻辑的免部署网页，可接自有 API Key 调外部大模型' },
  { id: 'skill',      name: '技能封装',       en: 'Skills',          desc: '把专业判断标准沉淀成可复用技能与专家套件，换个案子直接复用' },
  { id: 'kb',         name: '企业知识库问答', en: 'Knowledge Base',  desc: '接入企业知识库做检索问答与问答机器人，结论可溯源到原文' },
  { id: 'multimodal', name: '多模态创作',     en: 'Multimodal',      desc: '理解图片 / 音频 / 视频素材，并生成图文音视频内容与成片' },
  { id: 'dataflow',   name: '数据聚合自动化', en: 'Data Automation', desc: '接入电商后台、社媒、业务系统等数据源，跨来源聚合后自动跑批成稿' },
  { id: 'browser',    name: '浏览器操作',     en: 'Browser Control', desc: '由 Agent 直接控制浏览器完成登录、取数、填单等网页动作' }
];


/* 首页文案（统计数字自动计算，无需手改） */
export const SITE = {
  brand: '千问办公',
  productLine: '案例库',
  /* 对外公开地址（GitHub Pages）。本地预览 / file:// 打开时，
     复制的分享链接与海报二维码会自动回落到这个地址，避免发出去别人打不开。
     案例库已嵌入官网，这里指官网而不再指旧的 qwenwork-cases 站。
     换域名时只需改这一处 */
  publicUrl: 'https://qwenwork-courses.github.io/qwenwork-courses/',
  title: '全部门 AI 场景实践指引',
  subtitle: '覆盖法务、人力、市场、行政、培训、财务、销售、生产运营八大部门，以及电商行业垂直场景',
  slogan: '让 AI 落到真实场景，让实践沉淀为组织能力',
  searchPlaceholder: '搜索场景、问题或业务目标',
  /* 热门场景快捷标签：每个词必须能搜到结果，新增后先在页面上点一下验证 */
  hotScenes: ['合同审查', '绩效管理', '亚马逊广告', '行政接待', '制课'],
  /* 联系表单（钉钉多维表格）——页脚「联系我们」按钮与二维码均指向它
     qr 已验证扫出来就是该表单（带 source=qrcode 渠道参数）*/
  contactForm: {
    url: 'https://alidocs.dingtalk.com/notable/share/form/v01Lk3lbmGYVL5w7Om9_dv19yqvsgs3oebp3pcjys_1qX0QQ0?source=link',
    qr: 'https://gw.alicdn.com/imgextra/i4/O1CN01kX1IHEvlh6J0XMIQ_!!6000000004564-2-tps-265-269.png',
    qrCaption: '钉钉扫码填写表单'
  },
  cta: { label: '预约了解更多', href: '#contact' }
};

;
