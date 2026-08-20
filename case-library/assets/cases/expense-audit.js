/* 财务 · 费用报销单据 AI 稽核  (wip) */
export default
{
  "id": "expense-audit",
  "dept": "finance",
  "path": "skill",
  "skill": "expense-audit",
  "status": "wip",
  "title": "费用报销单据 AI 稽核",
  "slogan": "每一张票都过一遍，而不是抽查",
  "summary": "批量识别发票与附件，比对制度标准，输出可疑单据清单与稽核依据。",
  "tags": [
    "全量稽核",
    "制度比对",
    "待补充案例"
  ],
  "client": "",
  "clientNote": "",
  "metrics": [
    {
      "value": "—",
      "label": "单据处理量"
    },
    {
      "value": "—",
      "label": "查出可疑单据"
    },
    {
      "value": "—",
      "label": "稽核覆盖率"
    }
  ],
  "pains": [
    "单据量大只能抽查，风险留在未抽到的部分",
    "制度条款记不全，判断因人而异"
  ],
  "solutions": [
    "发票与附件批量识别结构化",
    "制度标准写成规则，全量比对并给出依据"
  ],
  "before": "",
  "after": "",
  "demoLine": [],
  "links": [],
  "prompt": "",
  "audience": [
    "财务共享中心",
    "内审",
    "费用管控"
  ]
};
