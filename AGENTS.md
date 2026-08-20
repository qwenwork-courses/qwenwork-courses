# AGENTS.md

## 项目概述

钉钉AI咨询研究院 · 课程与案例展示平台。
纯静态站点（HTML + CSS + JS），无构建系统、无依赖管理、无后端。

## 技术栈

- HTML / CSS / Vanilla JavaScript（ES Modules）
- Python 脚本（`scripts/` 下的一次性维护工具；设计草稿/页面构建脚本保存在 `dev-drafts` 分支，不随生产部署）
- 无 package.json、无 node_modules、无框架

## 入口与核心文件

| 文件 | 职责 |
|------|------|
| `index.html` | SPA 入口，tab 切换框架，加载 `tabs/tab-*.html` 片段 |
| `assets/js/global-float.js` | 全局悬浮客服组件（IIFE + 去重守卫） |
| `assets/css/common-styles.css` | 全站共享样式聚合入口（按分区 @import `styles/*.css`） |
| `assets/css/styles/*.css` | 由 common-styles 拆出的 8 个分区样式（01-base … 08-cooperation） |
| `case-library/assets/app.js` | 案例库渲染逻辑（ES Module，export boot） |
| `case-library/assets/data.js` | 案例库全局配置（export DEPTS / PATHS / SITE） |
| `case-library/assets/poster.js` | 海报生成模块 |
| `case-library/assets/qr.js` | 二维码生成模块 |
| `case-library/assets/cases/*.js` | 各案例数据（export default） |
| `tabs/tab-*.html` | 各 tab 页面 HTML 片段（由 index.html fetch 注入） |
| `enterprise-courses/*.html` | 企业课程详情页 |
| `public-courses/*.html` | 公开课课程详情页（共享 `public-courses/public-detail.css`） |
| `enterprise-courses/INDEX.md` | 企业课程 `courseX-Y` 文件名 → 课程主题映射表 |
| `best-practices/*.html` | 最佳实践案例详情页 |

## 变更后验证

**核心文件变更后必须运行验证检查：**

```bash
python3 tests/test_core_files.py
```

该检查覆盖：

1. 核心文件存在且非空
2. JS 文件语法校验（`node --check`）
3. HTML 文件结构校验（DOCTYPE + 标签平衡）
4. `index.html` 引用的 tab 文件和样式表都存在
5. `app.js` 的 import 指向存在的文件且导出 `boot` 函数
6. `data.js` 导出 `DEPTS` / `PATHS` / `SITE`
7. `global-float.js` 有 IIFE 和去重守卫
8. 案例文件（`cases/*.js`）均有 `export default`

如已安装 pytest，也可用 `pytest tests/ -v` 运行。

## 编码规范

- HTML 使用 4 空格缩进
- JS 使用 ES Modules（import/export），2 空格缩进
- CSS 使用 CSS 变量（设计令牌），详见 `common-styles.css` 和 `case-library/assets/style.css`
- 文件版本查询参数（`?v=...`）用于缓存失效，变更静态资源时更新
- Python 脚本使用 UTF-8 编码

## 目录结构

```
.
├── index.html              # SPA 入口（tab 会话缓存 + 空闲预取）
├── tabs/                   # tab 页面片段 tab-*.html
├── assets/
│   ├── css/
│   │   ├── common-styles.css   # 共享样式聚合入口（@import styles/*.css）
│   │   └── styles/*.css        # 分区样式（01-base … 08-cooperation）
│   ├── js/global-float.js   # 悬浮客服
│   └── img/caselib-banner.png
├── scripts/                # 一次性维护脚本（base64 抽取、CSS 拆分、public 去重）
├── case-library/           # 案例库
│   ├── assets/
│   │   ├── app.js / data.js / poster.js / qr.js / style.css
│   │   └── cases/*.js       # 案例数据
│   └── demos/              # 演示素材（大媒体见 GitHub Release）
├── enterprise-courses/     # 企业课程详情页（+ INDEX.md 映射表）
├── public-courses/         # 公开课详情页（+ public-detail.css 共享样式）
├── best-practices/         # 最佳实践详情页（内嵌图片已抽到 *.assets/）
└── tests/                  # 验证检查
    └── test_core_files.py
```

## 资源托管与分支

- **大体积媒体**（mp4 / mp3 / zip / pptx / pdf 及较大视频）不进仓库，托管在 GitHub Release **`media-v1`**，
  页面以下载/播放 URL 引用（见 `case-library/assets/cases/course-creation.js`、`course-poster.js`、
  `enterprise-courses/course3-4-detail.html`、`case-library/demos/hr-performance/*.html`）。
- **设计草稿 / 备份 / 截图 / 页面构建脚本** 保存在 **`dev-drafts`** 分支，不在 `main`。
- 页面里本就是远程链接的 gif/图片（如 gw.alicdn.com）保持不动。
