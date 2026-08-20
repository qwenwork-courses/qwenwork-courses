import { SITE, DEPTS, PATHS } from './data.js';
import { Poster } from './poster.js';

/* 案例库渲染逻辑。CASES 由 tab-cases.html 的 bootstrap 按固定顺序传入，
   顺序决定各部门下案例的展示次序。*/
export function boot(CASES) {

if (window.__casesTeardown) { try { window.__casesTeardown(); } catch (e) {} }
var __caseWin = [];
function __winAdd(t, h, o) { window.addEventListener(t, h, o); __caseWin.push([t, h, o]); }
window.__casesTeardown = function () {
  __caseWin.forEach(function (a) { try { window.removeEventListener(a[0], a[1], a[2]); } catch (e) {} });
  __caseWin = []; window.__casesTeardown = null;
};

;

/* ---------- helpers ---------- */
const $ = (s, e = document) => e.querySelector(s);
const $$ = (s, e = document) => [...e.querySelectorAll(s)];
const h = (tag, cls = '', html = '') => { const el = document.createElement(tag); if (cls) el.className = cls; if (html) el.innerHTML = html; return el; };

/* Icons (inline SVG paths, heroicons-mini style) */
const ICONS = {
  scale: '<path d="M12 3v1.5M18.36 5.64l-1.06 1.06M21 12h-1.5M18.36 18.36l-1.06-1.06M12 19.5V21M7.05 18.36l-1.06 1.06M4.5 12H3M7.05 5.64 5.99 4.58"/>',
  users: '<path d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0z"/>',
  megaphone: '<path d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46"/>',
  building: '<path d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"/>',
  play: '<path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653z"/>',
  coins: '<path d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 3.75c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"/>',
  target: '<path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0z"/>',
  gauge: '<path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>',
  cart: '<path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0z"/>',
  cube: '<path d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/>',
  arrowR: '<path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>',
  alertTri: '<path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>',
  pain: '<path d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9 3.75h.008v.008H12v-.008z"/>',
  check: '<path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>',
  copy: '<path d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"/>',
  link: '<path d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"/>',
  doc: '<path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9z"/>',
  download: '<path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>',
  live: '<path d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>',
  bookmark: '<path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0z"/>',
  share: '<path d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185z"/>',
  search: '<path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z"/>',
  close: '<path d="M6 18 18 6M6 6l12 12"/>',
  video: '<path d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h7.5a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-7.5A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25z"/>',
  archive: '<path d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>',
  slides: '<path d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5"/>',
  audio: '<path d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 19.5 12.553zm0 0V6l-10.5 3v9.553m0 0a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 18.553z"/>'
};

const svgIcon = (name, size = 24) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;

/* 封面色 */
const CARD_COLORS = [
  ['#eff1ff','#dfe4ff'], ['#e8f5f2','#d0ebe5'], ['#fef4e8','#fde9d0'],
  ['#fce8f0','#f7d0df'], ['#eef6ff','#ddeeff'], ['#f5edff','#e8daff'],
  ['#fdf2f2','#f8e0e0'], ['#ecfdf5','#d1fae5']
];

/* ---------- State ---------- */
/* 三个上级 tab 互斥：'dept' 按行业看｜'path' 按实现路径看｜'fav' 我的收藏。
   两套分类不关联，因此各自只在对应 tab 下生效，二级选中项也分开记 */
let viewMode = 'dept';       // 'dept' | 'path' | 'fav'
let currentDept = null;      // null = 全部（仅「按行业看」下生效）
let currentPath = null;      // null = 全部（仅「按实现路径看」下生效）
let searchQuery = '';        // 搜索关键词
let currentView = 'gallery'; // 'gallery' | 'detail'
let currentCase = null;

/* ---------- 收藏 / 浏览量 / 分享 / 复制 ---------- */
/* 环境可能不支持 localStorage，统一走 try/catch + 内存回退 */
const FAV_KEY = 'qw_cases_fav';
let favMem = null;
function readFavs() {
  if (favMem) return favMem;
  try {
    favMem = new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]'));
  } catch (e) { favMem = new Set(); }
  return favMem;
}
function isFav(id) { return readFavs().has(id); }
function toggleFav(id) {
  const s = readFavs();
  s.has(id) ? s.delete(id) : s.add(id);
  try { localStorage.setItem(FAV_KEY, JSON.stringify([...s])); } catch (e) { /* 内存模式 */ }
  return s.has(id);
}

function toast(msg) {
  /* 案例库样式表把 .toast 作用域限定在 #cases-app 内（#cases-app .toast）。
     嵌入官网后 body 不再是案例库根，若挂到 document.body 会落到 #cases-app 之外，
     样式命不中，就退化成页面左下角一行裸文字。所以统一挂进 #cases-app。*/
  const root = document.getElementById('cases-app') || document.body;
  let el = root.querySelector('#toast');
  if (!el) { el = h('div', 'toast'); el.id = 'toast'; root.appendChild(el); }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 1800);
}

/* 剪贴板写入：navigator.clipboard 在 http 非 localhost 下不可用，回退 execCommand */
function writeClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
  return new Promise((resolve, reject) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy') ? resolve() : reject(); } catch (e) { reject(e); }
    ta.remove();
  });
}
function copyText(text, btn, restoreHTML) {
  writeClipboard(text).then(() => {
    btn.classList.add('copied');
    const size = restoreHTML.includes('14') ? 14 : 15;
    btn.innerHTML = `${svgIcon('check', size)} 已复制`;
    toast('Prompt 已复制到剪贴板');
    setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = restoreHTML; }, 2000);
  }).catch(() => toast('复制失败，请手动选中文本'));
}

/* 案例链接：分享出去的链接必须是别人能打开的。
   - 已部署到真实域名（GitHub Pages / 内网域名）：以当前页面地址为准，只换 hash，
     这样换域名、放内网都不用改代码
   - 本地预览（localhost / 127.0.0.1 / 局网 IP / file://）：回落到 SITE.publicUrl，
     否则复制出来的是 127.0.0.1 这种只有自己能打开的地址
   search 参数丢掉保持链接干净。*/
function isLocalPreview() {
  const hn = location.hostname;
  return location.protocol === 'file:' || !hn
    || hn === 'localhost' || hn === '127.0.0.1' || hn === '[::1]'
    || /\.local$/.test(hn)
    || /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(hn);
}

function caseUrl(id) {
  /* publicUrl 缺失或写错时不能抛异常（一抛整个分享弹窗就挂了），回落到当前地址 */
  let base = location.href;
  if (isLocalPreview() && SITE.publicUrl) {
    try { base = new URL(SITE.publicUrl).href; } catch (e) { base = location.href; }
  }
  const u = new URL(base);
  u.search = '';
  /* 嵌入官网后统一用 #cases/case/<id>：外壳 index.html 见到该 hash 会切到「案例库」
     tab，再由本模块 initFromHash 展开详情，别人点链接即可直达案例详情页 */
  u.hash = `#cases/case/${id}`;
  return u.href;
}

function shareCase(c) {
  openShareModal(c);
}

/* ---------- Routing ----------
   案例库嵌在官网外壳（index.html）里，外壳用 hash 选择顶层 tab。为了让案例库的深链
   （分享链接）能被外壳识别并落到「案例库」tab，这里统一用 #cases 前缀：
     - 画廊：#cases
     - 详情：#cases/case/<id>
   外壳 window.onload 见到 #cases / #cases/case/... 即切到案例库 tab，随后本模块
   initFromHash 读取同一 hash 决定是否直接展开某个案例详情。
   仍兼容历史/独立部署的 #/case/<id>、#case/<id> 写法。*/
function parseCaseHash() {
  const m = location.hash.match(/^#(?:cases\/)?\/?case\/(.+)$/);
  return m ? decodeURIComponent(m[1]) : null;
}

function navigate(view, id) {
  if (view === 'detail' && id) {
    currentView = 'detail';
    currentCase = CASES.find(c => c.id === id) || null;
    try { history.pushState({ view, id }, '', `#cases/case/${id}`); } catch (e) {}
  } else {
    currentView = 'gallery';
    currentCase = null;
    try { history.pushState({ view: 'gallery' }, '', '#cases'); } catch (e) {}
  }
  render();
  window.scrollTo({ top: 0 });
}

/* 前进/后退：仅在案例库 tab 仍存活时处理，否则交回外壳，
   避免往已被外壳清空的 #app 里渲染而报错 */
__winAdd('popstate', () => {
  if (!document.getElementById('cases-app')) return;
  const id = parseCaseHash();
  const c = id ? (CASES.find(x => x.id === id) || null) : null;
  currentView = c ? 'detail' : 'gallery';
  currentCase = c;
  render();
  window.scrollTo({ top: 0 });
});

/* 手改 hash / 外部跳转（如客户把分享链接贴进已开着的页面）时同步视图。
   pushState 不触发 hashchange，所以与 navigate() 不会重复渲染。*/
__winAdd('hashchange', () => {
  if (!document.getElementById('cases-app')) return;
  const id = parseCaseHash();
  const c = id ? (CASES.find(x => x.id === id) || null) : null;
  const nextView = c ? 'detail' : 'gallery';
  if (nextView === currentView && c === currentCase) return;
  currentView = nextView;
  currentCase = c;
  render();
  window.scrollTo({ top: 0 });
});

/* ---------- Init ---------- */
/* 从当前 hash 恢复视图：分享链接落地或刷新时，直接展开对应案例详情 */
function initFromHash() {
  const id = parseCaseHash();
  const c = id ? (CASES.find(x => x.id === id) || null) : null;
  currentView = c ? 'detail' : 'gallery';
  currentCase = c;
}

/* ---------- Gallery ---------- */
/* Hero 只在进入首页时渲染一次；搜索/筛选只重绘 #results，否则输入框会失焦 */
function renderGallery() {
  const app = $('#app');
  app.innerHTML = '';
  const wrap = h('div', 'view');

  const liveCount = CASES.filter(c => c.status !== 'wip').length;
  const deptCount = new Set(CASES.map(c => c.dept)).size;

  wrap.innerHTML = `
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-stats-line">
          <span class="chev left">〈〈〈</span>
          <span>${liveCount} 个真实交付 · ${deptCount} 个业务分类 · ${CASES.length} 个落地案例</span>
          <span class="chev right">〉〉〉</span>
        </div>
        <h1>${SITE.title}</h1>
        <p class="hero-sub">${SITE.subtitle}</p>

        <div class="hero-search">
          <span class="search-ic">${svgIcon('search', 20)}</span>
          <input type="search" id="searchInput" placeholder="${SITE.searchPlaceholder}"
                 autocomplete="off" aria-label="搜索案例" value="${searchQuery.replace(/"/g, '&quot;')}">
          <button type="button" class="search-clear ${searchQuery ? 'show' : ''}" id="searchClear" aria-label="清空搜索">${svgIcon('close', 16)}</button>
        </div>

        <div class="hot-scenes">
          <span class="hot-label">热门场景：</span>
          ${SITE.hotScenes.map(s => `<button type="button" class="hot-chip ${searchQuery === s ? 'active' : ''}" data-scene="${s}">${s}</button>`).join('')}
        </div>

        <div class="hero-slogan"><span>${SITE.slogan}</span></div>
        <a href="#" class="hero-cta" id="ctaHero"><svg width="15" height="15" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 1H3a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9"/><path d="M7 7l6-6"/><path d="M10 1h3v3"/></svg> 预约演示</a>
      </div>
    </section>
    <section class="gallery">
      <div class="toolbar">
        <div class="toolbar-head">
          <div class="view-tabs" id="viewTabs"></div>
          <span class="results-count" id="resultsCount"></span>
        </div>
        <div class="dept-filter" id="subFilter"></div>
      </div>
      <div id="results"></div>
    </section>
  `;
  app.appendChild(wrap);

  /* 搜索交互：只重绘两行筛选胶囊与 #results，不碰 input，因此焦点不丢 */
  const input = $('#searchInput');
  const clearBtn = $('#searchClear');
  const onSearch = () => {
    searchQuery = input.value.trim();
    clearBtn.classList.toggle('show', !!searchQuery);
    syncHotChips();
    renderFilters();  /* 两行胶囊计数都跟着搜索词变 */
    renderResults();
  };
  input.addEventListener('input', onSearch);
  clearBtn.addEventListener('click', () => {
    searchQuery = '';
    input.value = '';
    clearBtn.classList.remove('show');
    syncHotChips();
    renderFilters();
    renderResults();
    input.focus();
  });

  /* 热门场景快捷标签：再点一次取消 */
  $$('.hot-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const s = chip.dataset.scene;
      searchQuery = (searchQuery === s) ? '' : s;
      input.value = searchQuery;
      clearBtn.classList.toggle('show', !!searchQuery);
      syncHotChips();
      renderFilters();
      renderResults();
    });
  });

  renderFilters();
  renderResults();
}

function syncHotChips() {
  $$('.hot-chip').forEach(c => c.classList.toggle('active', c.dataset.scene === searchQuery));
}

/* 横向滑动行的可用性补齐（筛选胶囊行、详情页 Tab 条共用）：
   1. 边缘渐隐提示——隐了滚动条之后必须告诉用户“还有内容可滑”
   2. 指针拖拽——手机上原生滑动很自然，但桌面缩窗口时鼠标拖不动（原生只认横向滚轮）
   3. 拖动超过阈值后吞掉这次 click，否则松手会误触胶囊 */
function enableXScroll(el) {
  if (!el) return;
  el.classList.add('x-scroll');
  const sync = () => {
    const max = el.scrollWidth - el.clientWidth;
    el.classList.toggle('can-scroll-left', max > 2 && el.scrollLeft > 2);
    el.classList.toggle('can-scroll-right', max > 2 && el.scrollLeft < max - 2);
  };
  el._xSync = sync;
  if (el.dataset.xScroll) { sync(); return; }
  el.dataset.xScroll = '1';

  el.addEventListener('scroll', sync, { passive: true });
  __winAdd('resize', sync);
  if (window.ResizeObserver) new ResizeObserver(sync).observe(el);

  let down = false, startX = 0, startLeft = 0, moved = false;
  el.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;   /* 触摸交给原生惯性滚动 */
    down = true; moved = false; startX = e.clientX; startLeft = el.scrollLeft;
  });
  el.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 4) { moved = true; el.classList.add('is-dragging'); }
    if (moved) { el.scrollLeft = startLeft - dx; e.preventDefault(); }
  });
  const end = () => {
    if (moved) el.addEventListener('click', ev => { ev.stopPropagation(); ev.preventDefault(); }, { capture: true, once: true });
    down = false; moved = false; el.classList.remove('is-dragging');
    sync();
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
  el.addEventListener('pointerleave', () => { if (down) end(); });
  sync();
}

/* 视频框高度控在一屏内：按视口高算高度预算，再用视频原比例反推最大宽度。
   为何不用纯 CSS：块级元素上 aspect-ratio + max-height 不会反推宽度（宽度已由父容器确定），
   结果只是把框压短、视频反而出现左右黑边，所以这里算好写 inline max-width。 */
function fitVideoBox(el) {
  /* 渲染阶段 wrap 还没挂到文档上，所以要能直接传元素；resize 时才走 document 查询 */
  const fig = el || $('.video-block');
  if (!fig) return;
  const vw = +fig.dataset.vw, vh = +fig.dataset.vh;
  if (!vw || !vh) return;
  /* 260px 给顶部导航 + Tab 条 + 区块标题 + 下方演示步骤的一部分留白 */
  const budget = Math.max(280, Math.min(620, window.innerHeight - 260));
  fig.style.maxWidth = Math.min(vw, Math.round(budget * vw / vh)) + 'px';
}
__winAdd('resize', () => fitVideoBox());

/* 重绘胶囊后把选中项拉到可见区——不用 scrollIntoView，避免它顺手滚动页面。
   位置用 rect 差值算：offsetLeft 是相对定位祖先的，而胶囊行本身不是定位元素，算出来会偏。
   余量取 34px：比边缘渐隐的 30px 大一点，否则选中项会刚好藏在渐隐里看不清 */
function keepActiveVisible(box) {
  const active = box.querySelector('.dept-chip.active');
  if (!active) return;
  const pad = 34;
  const max = Math.max(0, box.scrollWidth - box.clientWidth);
  const bx = box.getBoundingClientRect();
  const ax = active.getBoundingClientRect();
  const l = ax.left - bx.left + box.scrollLeft;
  const r = l + ax.width;
  if (l - pad < box.scrollLeft) box.scrollLeft = Math.max(0, l - pad);
  else if (r + pad > box.scrollLeft + box.clientWidth) box.scrollLeft = Math.min(max, r + pad - box.clientWidth);
}

/* 上级 tab（按行业看 / 按实现路径看 / 我的收藏）+ 当前 tab 对应的二级分类。
   两套分类互斥：切 tab 时不会带着另一套的选中项，也不做叠加筛选。
   计数为 0 的类别置灰禁用而不隐藏，让完整分类表始终可见、切搜索词时也不跳行。 */
function renderFilters() { renderViewTabs(); renderSubFilter(); }

function renderViewTabs() {
  const box = $('#viewTabs');
  if (!box) return;
  const hits = CASES.filter(c => matchCase(c, searchQuery));
  const favCount = hits.filter(c => isFav(c.id)).length;
  box.innerHTML = '';

  const tabs = [
    { id: 'dept', label: '按行业看' },
    { id: 'path', label: '按实现路径看' },
    { id: 'fav', label: `${svgIcon('bookmark', 13)} 我的收藏 <span class="count">${favCount}</span>` }
  ];
  tabs.forEach(t => {
    const btn = h('button', `view-tab ${viewMode === t.id ? 'active' : ''}`, t.label);
    btn.onclick = () => {
      if (viewMode === t.id) return;
      viewMode = t.id;
      renderFilters();
      renderResults();
    };
    box.appendChild(btn);
  });
}

/* 二级分类：按行业看→DEPTS胶囊，按实现路径看→PATHS胶囊，收藏视图→不出二级 */
function renderSubFilter() {
  const box = $('#subFilter');
  if (!box) return;
  box.innerHTML = '';
  box.hidden = viewMode === 'fav';
  if (viewMode === 'fav') return;

  const byPath = viewMode === 'path';
  const groups = byPath ? PATHS : DEPTS;
  const keyOf = c => (byPath ? c.path : c.dept);
  const current = byPath ? currentPath : currentDept;
  const setCurrent = v => { if (byPath) currentPath = v; else currentDept = v; };
  const hits = CASES.filter(c => matchCase(c, searchQuery));

  const allBtn = h('button', `dept-chip ${current === null ? 'active' : ''}`, `全部 <span class="count">${hits.length}</span>`);
  allBtn.onclick = () => { setCurrent(null); renderFilters(); renderResults(); };
  box.appendChild(allBtn);

  groups.forEach(g => {
    const cnt = hits.filter(c => keyOf(c) === g.id).length;
    const btn = h('button', `dept-chip ${byPath ? 'path-chip' : ''} ${cnt ? '' : 'is-empty'} ${current === g.id ? 'active' : ''}`,
      `${g.name} <span class="count">${cnt}</span>`);
    btn.title = g.desc || '';
    if (!cnt) btn.disabled = true;
    btn.onclick = () => { setCurrent(current === g.id ? null : g.id); renderFilters(); renderResults(); };
    box.appendChild(btn);
  });

  enableXScroll(box);
  keepActiveVisible(box);
  if (box._xSync) box._xSync();   /* 上一步可能改了 scrollLeft，边缘渐隐得重算 */
}

/* 全文匹配：标题/slogan/概述/标签/痛点/方案/人群/部门名/客户均参与，多词需全部命中。
   注意：不能把 dept.desc 加进来——部门描述里的词会让同部门所有案例被误命中
   （如法务 desc 含“合同”，会导致搜“合同”时把招投标案例也带出来）*/
function matchCase(c, q) {
  if (!q) return true;
  const dept = DEPTS.find(d => d.id === c.dept) || {};
  const path = PATHS.find(p => p.id === c.path) || {};
  const hay = [
    c.title, c.slogan, c.summary, c.client, c.clientNote, c.before, c.after, c.prompt,
    dept.name, dept.en, path.name, path.en,
    ...(c.tags || []), ...(c.audience || []), ...(c.pains || []),
    ...(c.solutions || []), ...(c.demoLine || []),
    ...(c.metrics || []).map(m => `${m.value} ${m.label}`),
    ...(c.links || []).map(l => l.label)
  ].filter(Boolean).join(' ').toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).every(t => hay.includes(t));
}

function renderResults() {
  const box = $('#results');
  if (!box) return;
  box.innerHTML = '';

  const isFavView = viewMode === 'fav';
  const byPath = viewMode === 'path';
  const hits = CASES.filter(c =>
    matchCase(c, searchQuery)
    && (isFavView ? isFav(c.id) : true)
    && (byPath ? (currentPath ? c.path === currentPath : true)
      : (!isFavView && currentDept ? c.dept === currentDept : true))
  );
  const countEl = $('#resultsCount');
  if (countEl) {
    countEl.textContent = isFavView ? `已收藏 ${hits.length} 个案例`
      : searchQuery ? `匹配到 ${hits.length} 个案例`
        : `${hits.length} 个案例`;
  }

  if (!hits.length) {
    box.innerHTML = isFavView
      ? `<div class="empty-state">
           <strong>还没有收藏任何案例</strong>
           <span>点卡片右上角的书签图标，把常用案例收起来，下次直接从这里拿</span>
         </div>`
      : `<div class="empty-state">
           <strong>没找到匹配“${searchQuery}”的案例</strong>
           <span>试试换个关键词，或点上方“热门场景”快速定位</span>
         </div>`;
    return;
  }

  /* 收藏视图：收藏本身跨两套分类，不分组，直接一片网格 */
  if (isFavView) {
    const grid = h('div', 'case-grid');
    hits.forEach((c, ci) => {
      const dept = DEPTS.find(d => d.id === c.dept) || {};
      grid.appendChild(renderCard(c, dept, CARD_COLORS[ci % CARD_COLORS.length]));
    });
    box.appendChild(grid);
    return;
  }

  /* 按行业看→按 DEPTS 分组；按实现路径看→按 PATHS 分组（分组头用各自的名称/英文/说明）*/
  const groups = byPath ? PATHS : DEPTS;
  const current = byPath ? currentPath : currentDept;
  const keyOf = c => (byPath ? c.path : c.dept);
  const groupsToShow = current ? groups.filter(g => g.id === current) : groups;

  groupsToShow.forEach(g => {
    const cases = hits.filter(c => keyOf(c) === g.id);
    if (!cases.length) return;
    const sec = h('section', 'dept-section');
    sec.id = `${byPath ? 'path' : 'dept'}-${g.id}`;
    sec.innerHTML = `<div class="dept-head"><h2>${g.name}</h2><span class="en">${g.en}</span><span class="desc">${g.desc}</span></div>`;
    const grid = h('div', 'case-grid');
    cases.forEach((c, ci) => {
      const dept = DEPTS.find(d => d.id === c.dept) || {};
      grid.appendChild(renderCard(c, dept, CARD_COLORS[ci % CARD_COLORS.length]));
    });
    sec.appendChild(grid);
    box.appendChild(sec);
  });
}

function renderCard(c, dept, colors) {
  const card = h('article', `case-card ${c.status === 'wip' ? 'is-wip' : ''}`);
  const statusLabel = c.status === 'live' ? '可演示' : c.status === 'demo' ? '有素材' : '待补充';
  const path = PATHS.find(p => p.id === c.path) || {};
  card.style.setProperty('--c1', colors[0]);
  card.style.setProperty('--c2', colors[1]);
  const faved = isFav(c.id);
  card.innerHTML = `
    <div class="card-media${c.cover ? ' has-cover' : ''}">
      ${c.cover ? `<img class="cover-img" src="${c.cover}" alt="${c.title} 预览" loading="lazy">` : `<span class="watermark">${dept.en}</span>`}
      <span class="status-pill ${c.status}"><i></i>${statusLabel}</span>
      <button type="button" class="card-fav ${faved ? 'active' : ''}" aria-label="收藏案例" aria-pressed="${faved}">${svgIcon('bookmark', 18)}</button>
    </div>
    <div class="card-body">
      <div class="card-meta">
        <span class="card-dept">${dept.name}${c.client ? ` · ${c.client}` : ''}</span>
        ${path.name ? `<span class="card-path" title="实现路径：${path.desc || ''}">${path.name}</span>` : ''}
      </div>
      <h3>${c.title}</h3>
      <p class="card-slogan">${c.slogan}</p>
      <div class="card-badges">${c.tags.slice(0, 3).map(t => `<span>${t}</span>`).join('')}</div>
      <div class="card-metrics">
        ${c.metrics.slice(0, 3).map(m => `<div><strong>${m.value}</strong><small>${m.label}</small></div>`).join('')}
      </div>
    </div>
    <div class="card-actions">
      ${c.prompt ? `<button type="button" class="card-copy">${svgIcon('copy', 15)} 一键复制 Prompt</button>` : ''}
      <a class="card-open" href="#cases/case/${c.id}">查看案例 ${svgIcon('arrowR', 15)}</a>
    </div>
    <a class="card-link" href="#cases/case/${c.id}" aria-label="查看「${c.title}」详情"></a>
  `;

  card.querySelector('.card-link').addEventListener('click', e => { e.preventDefault(); navigate('detail', c.id); });
  card.querySelector('.card-open').addEventListener('click', e => { e.preventDefault(); navigate('detail', c.id); });

  card.querySelector('.card-fav').addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    const on = toggleFav(c.id);
    e.currentTarget.classList.toggle('active', on);
    e.currentTarget.setAttribute('aria-pressed', on);
    toast(on ? '已收藏案例' : '已取消收藏');
    /* 收藏数变了，刷新 tab 上的计数；若正在收藏视图，取消后该卡需移出 */
    if ($('#viewTabs')) renderFilters();
    if (viewMode === 'fav') renderResults();
  });

  const copyBtn = card.querySelector('.card-copy');
  if (copyBtn) copyBtn.addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    copyText(c.prompt, copyBtn, `${svgIcon('copy', 15)} 一键复制 Prompt`);
  });

  return card;
}

/* ---------- Detail ---------- */
/* 演示路径里的图示：SOP 流程图、操作实录动图这类“看一眼就懂”的静态材料，
   没配置的案例返回空数组，调用处不用各自做类型判断 */
function demoShots(c) {
  return Array.isArray(c.demoShots) ? c.demoShots : [];
}
/* 给了 href 的图能点开弹窗看大图（走全局 data-preview-href 委派），
   没给的就是纯展示，GIF 本身在页面上已经在循环放了，再点开一层没意义 */
function renderDemoShot(s) {
  const alt = s.alt || s.caption || '';
  const img = `<img src="${s.src}" alt="${alt}" loading="lazy">`;
  if (!s.href) {
    return `<figure class="demo-shot">${img}<figcaption class="shot-cap">${s.caption || ''}</figcaption></figure>`;
  }
  return `
    <a class="demo-shot" href="${s.href}"
       data-preview-href="${s.href}" data-preview-label="${s.caption || '查看大图'}" data-preview-kind="${s.kind || 'doc'}">
      ${img}
      <span class="shot-cap">${s.caption || ''}<span class="zoom">${svgIcon('search', 15)}</span></span>
    </a>`;
}

function renderDetail() {
  const c = currentCase;
  if (!c) { navigate('gallery'); return; }
  const dept = DEPTS.find(d => d.id === c.dept) || {};
  const path = PATHS.find(p => p.id === c.path) || {};
  const app = $('#app');
  app.innerHTML = '';
  const wrap = h('div', 'view detail-page');

  /* Breadcrumb */
  wrap.innerHTML = `
    <nav class="breadcrumb">
      <a href="#cases" class="back-home">案例库</a>
      <span class="sep">/</span>
      <a href="#cases" data-dept="${dept.id}">${dept.name}</a>
      <span class="sep">/</span>
      <strong>${c.title}</strong>
    </nav>
  `;
  wrap.querySelector('.back-home').addEventListener('click', e => { e.preventDefault(); navigate('gallery'); });
  const deptLink = wrap.querySelector('[data-dept]');
  if (deptLink) deptLink.addEventListener('click', e => { e.preventDefault(); viewMode = 'dept'; currentDept = dept.id; navigate('gallery'); });

  /* Hero */
  const faved = isFav(c.id);
  const hero = h('section', 'detail-hero');
  hero.innerHTML = `
    <div class="detail-copy">
      <div class="detail-chips">
        <span class="chip-dept">${dept.name}</span>
        ${path.name ? `<button type="button" class="chip-path" data-path="${path.id}" title="${path.desc || ''}">${path.name}</button>` : ''}
      </div>
      <h1>${c.title}</h1>
      <p class="detail-slogan">${c.slogan}</p>
      ${c.audience.length ? `<div class="detail-audience">${svgIcon('users', 16)}<span class="lbl">适用人群</span>${c.audience.map(a => `<b>${a}</b>`).join('')}</div>` : ''}
      <div class="detail-actions">
        ${c.prompt ? `<button type="button" class="btn primary copy-prompt">${svgIcon('copy', 16)} 一键复制 Prompt</button>` : ''}
        <button type="button" class="btn share-case">${svgIcon('share', 16)} 分享案例</button>
        <button type="button" class="btn fav-case ${faved ? 'active' : ''}" aria-pressed="${faved}">${svgIcon('bookmark', 16)} <span class="fav-label">${faved ? '已收藏' : '收藏案例'}</span></button>
      </div>
      <div class="roi-summary">
        ${c.metrics.map((m, i) => `<div><span>亮点 0${i + 1}</span><strong>${m.value}</strong><small>${m.label}</small></div>`).join('')}
      </div>
    </div>
    <figure class="detail-visual">
      ${c.media ? (c.media.type === 'video'
        ? `<video src="${c.media.src}" autoplay loop muted playsinline preload="metadata" poster="${c.media.poster || ''}"></video>`
        : `<img src="${c.media.src}" alt="${c.title} 动态演示" loading="lazy">`)
        : (c.cover
          ? `<img src="${c.cover}" alt="${c.title} 效果预览" loading="lazy">`
          : `<div class="visual-placeholder">${svgIcon('play', 46)}<span>演示动图即将上线</span></div>`)}
      <figcaption class="preview-badge"><i></i>${c.media ? '动态实践预览' : '案例效果预览'}</figcaption>
      <span class="preview-note">${c.media && c.media.caption ? c.media.caption : '真实操作片段 · 自动循环播放'}</span>
    </figure>
  `;
  wrap.appendChild(hero);

  /* Hero 按钮交互 */
  const pathChip = hero.querySelector('.chip-path');
  if (pathChip) pathChip.addEventListener('click', () => {
    /* 点路径标签回列表页，直接切到「按实现路径看」并定位到该路径 */
    viewMode = 'path'; currentPath = c.path;
    navigate('gallery');
    setTimeout(() => { const el = $('.toolbar'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 60);
  });
  const copyBtn = hero.querySelector('.copy-prompt');
  if (copyBtn) copyBtn.addEventListener('click', () => copyText(c.prompt, copyBtn, `${svgIcon('copy', 16)} 一键复制 Prompt`));
  hero.querySelector('.share-case').addEventListener('click', () => shareCase(c));
  const favBtn = hero.querySelector('.fav-case');
  favBtn.addEventListener('click', () => {
    const on = toggleFav(c.id);
    favBtn.classList.toggle('active', on);
    favBtn.setAttribute('aria-pressed', on);
    favBtn.querySelector('.fav-label').textContent = on ? '已收藏' : '收藏案例';
    toast(on ? '已收藏案例' : '已取消收藏');
  });

  /* Tab 导航（锚点跳转 + 滚动高亮） */
  const tabDefs = [
    { id: 'overview', label: '案例概览', has: c.pains.length > 0 },
    { id: 'compare',  label: '效果对比', has: !!(c.before && c.after) },
    /* 有视频就叫「视频演示」，没视频才叫「演示路径」 */
    { id: 'demo',     label: c.video ? '视频演示' : '演示路径', has: !!c.video || c.demoLine.length > 0 || demoShots(c).length > 0 },
    { id: 'material', label: '相关材料', has: c.links.length > 0 },
    { id: 'prompt',   label: '复制 Prompt', has: !!c.prompt }
  ].filter(t => t.has);

  if (tabDefs.length > 1) {
    const tabs = h('nav', 'detail-tabs');
    tabs.innerHTML = `<div class="tabs-inner">${tabDefs.map((t, i) => `<a href="#sec-${t.id}" data-tab="${t.id}" class="${i === 0 ? 'active' : ''}">${t.label}</a>`).join('')}</div>`;
    tabs.querySelectorAll('[data-tab]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.getElementById(`sec-${a.dataset.tab}`);
        if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 122, behavior: 'smooth' });
      });
    });
    wrap.appendChild(tabs);
    enableXScroll(tabs.querySelector('.tabs-inner'));   /* Tab 多于屏宽时同样给滑动提示与拖拽 */
  }

  /* Section 01: 案例概览（场景挑战 & 解决思路） */
  if (c.pains.length) {
    const sec = h('section', 'detail-section overview');
    sec.id = 'sec-overview';
    sec.innerHTML = `
      <span class="section-label">01 / 案例概览</span>
      <p class="section-lead">${c.summary}</p>
      <div class="overview-grid">
        <article class="pain-card">
          <div class="article-icon pain">${svgIcon('pain', 20)}</div>
          <span>典型挑战</span>
          <h3>这些问题你是不是也在面对</h3>
          <ul>${c.pains.map(p => `<li>${svgIcon('alertTri', 16)}${p}</li>`).join('')}</ul>
        </article>
        <article class="sol-card">
          <div class="article-icon solution">${svgIcon('check', 20)}</div>
          <span>解决思路</span>
          <h3>千问办公的做法</h3>
          <ul>${c.solutions.map(s => `<li>${svgIcon('check', 16)}${s}</li>`).join('')}</ul>
        </article>
      </div>
    `;
    wrap.appendChild(sec);
  }

  /* Section 02: 效果对比 */
  if (c.before && c.after) {
    const sec = h('section', 'detail-section');
    sec.id = 'sec-compare';
    sec.innerHTML = `
      <span class="section-label">02 / 效果对比</span>
      <div class="compare-grid">
        <figure class="before"><figcaption><span class="before-dot">以前</span></figcaption><p>${c.before}</p></figure>
        <figure class="after"><figcaption><span class="after-dot">现在</span></figcaption><p>${c.after}</p></figure>
      </div>
    `;
    wrap.appendChild(sec);
  }

  /* Section 03: 视频演示 / 演示路径
     demoShots （SOP 图、操作实录动图）排在步骤列表之前：
     先看图看懂全貌，再逐条看步骤，与 demoLine 第一条“先看 SOP 流程图”的叙事一致 */
  if (c.video || c.demoLine.length || demoShots(c).length) {
    const sec = h('section', 'detail-section');
    sec.id = 'sec-demo';
    const label = c.video ? '03 / 视频演示' : '03 / 演示路径';
    const shots = demoShots(c);
    sec.innerHTML = `
      <span class="section-label">${label}</span>
      ${c.video ? `
        <figure class="video-block" data-vw="${c.video.width || ''}" data-vh="${c.video.height || ''}">
          <video src="${c.video.src}" poster="${c.video.poster || ''}"${c.video.width ? ` width="${c.video.width}" height="${c.video.height}" style="aspect-ratio:${c.video.width}/${c.video.height}"` : ''} controls controlsList="nodownload noplaybackrate" disablePictureInPicture playsinline preload="metadata"></video>
        </figure>` : '<h2>怎么用？</h2>'}
      ${shots.length ? `<div class="demo-shots${c.video ? ' after-video' : ''}">${shots.map(renderDemoShot).join('')}</div>` : ''}
      ${c.demoLine.length ? `<ul class="demo-line${c.video && !shots.length ? ' after-video' : ''}">${c.demoLine.map(d => `<li>${d}</li>`).join('')}</ul>` : ''}
    `;
    wrap.appendChild(sec);
    if (c.video) fitVideoBox(sec.querySelector('.video-block'));   /* 视频框高度控在一屏内 */
  }

  /* Section 04: 相关材料——全部材料排成一行（窄屏自动换行）。
     不再按分组堆成多行，分类改用卡片上的小标签表达；
     顺序固定为 技能包 → 示例文档 → 产物，没标 group 的旧链接归为产物 */
  if (c.links.length) {
    const sec = h('section', 'detail-section');
    sec.id = 'sec-material';
    const kindIcon = { demo: 'live', doc: 'doc', text: 'doc', file: 'download', live: 'live', video: 'video', bundle: 'archive' };
    const kindNote = { live: '在线体验', demo: '查看演示', doc: '查看文档', text: '点开预览 · 可下载', file: '下载资料', video: '点开播放 · 可下载', bundle: '点开逐个下载' };
    const GROUP_NAME = { skill: '技能包', sample: '示例文档', output: '产物' };
    const ORDER = ['skill', 'sample', 'output'];
    const items = c.links
      .map((l, i) => ({ l, i, g: GROUP_NAME[l.group] ? l.group : 'output' }))
      .sort((a, b) => ORDER.indexOf(a.g) - ORDER.indexOf(b.g));

    sec.innerHTML = `
      <span class="section-label">04 / 相关材料</span>
      <div class="links-grid">
        ${items.map(({ l, i, g }) => `
          <a class="link-card" href="${l.href}" data-link-id="${i}">
            <span class="link-group-tag g-${g}">${GROUP_NAME[g]}</span>
            <span class="link-card-main">
              <span class="ic">${svgIcon(kindIcon[l.kind] || 'link', 18)}</span>
              <span class="tx">
                <b>${l.label}</b>
                <small>${l.note || kindNote[l.kind] || '查看文档'}</small>
              </span>
              <span class="arrow">${svgIcon(l.kind === 'file' ? 'download' : 'arrowR', 16)}</span>
            </span>
          </a>
        `).join('')}
      </div>
    `;
    wrap.appendChild(sec);
    sec.querySelectorAll('.link-card').forEach(a => {
      a.addEventListener('click', e => {
        const link = c.links[+a.dataset.linkId];
        if (openInModal(link)) e.preventDefault();
      });
    });
  }

  /* Section 05: 复制 Prompt（有 promptSections 就分栏展示，避免一大坨文字）*/
  if (c.prompt) {
    const sec = h('section', 'detail-section');
    sec.id = 'sec-prompt';
    const structured = Array.isArray(c.promptSections) && c.promptSections.length;
    sec.innerHTML = `
      <span class="section-label">05 / 复制 PROMPT</span>
      ${c.skill ? `<div class="prompt-skill-note">${svgIcon('scale', 16)}<span>本案例基于千问办公技能实现，需先安装对应技能（如 <b>${c.skill}</b>），再发送下面的 Prompt。实际技能名以你安装的为准。</span></div>` : ''}
      <div class="prompt-box">
        <div class="prompt-head"><span>直接告诉千问办公你的需求</span><button type="button" class="btn copy-prompt-2">${svgIcon('copy', 14)} 复制全文</button></div>
        ${structured ? `
          <div class="prompt-struct">
            ${c.promptLead ? `<p class="prompt-lead">${c.promptLead}</p>` : ''}
            <div class="prompt-cols">
              ${c.promptSections.map(s => `
                <section>
                  <h4>${s.title}</h4>
                  <ul>${s.items.map(i => `<li>${i}</li>`).join('')}</ul>
                </section>
              `).join('')}
            </div>
            ${c.promptTail ? `<p class="prompt-tail">${c.promptTail}</p>` : ''}
          </div>` : `<pre class="prompt-raw"></pre>`}
      </div>
    `;
    /* Prompt 正文用 textContent 灌进去：里面可能带 <a target="_blank"> 这类尖括号，
       走 innerHTML 会被当成标签吃掉，而复制出去的又必须是原文 */
    const pre = sec.querySelector('.prompt-raw');
    if (pre) pre.textContent = c.prompt;
    wrap.appendChild(sec);
    const btn2 = sec.querySelector('.copy-prompt-2');
    btn2.addEventListener('click', () => copyText(c.prompt, btn2, `${svgIcon('copy', 14)} 复制全文`));
  }

  /* WIP Notice */
  if (c.status === 'wip') {
    const sec = h('section', 'detail-section');
    sec.innerHTML = `<div class="wip-notice">${svgIcon('alertTri', 18)}<div><strong>该案例正在完善中</strong><br>内容框架已就绪，演示素材即将更新。如果您对这个场景感兴趣，欢迎联系我们提前了解。</div></div>`;
    wrap.appendChild(sec);
  }

  /* Related cases */
  const related = CASES.filter(r => r.dept === c.dept && r.id !== c.id).slice(0, 3);
  if (related.length) {
    const sec = h('section', 'detail-section');
    sec.innerHTML = `<span class="section-label">相关案例</span>`;
    const grid = h('div', 'related-grid');
    related.forEach((r, ri) => {
      const rd = DEPTS.find(d => d.id === r.dept) || {};
      grid.appendChild(renderCard(r, rd, CARD_COLORS[ri % CARD_COLORS.length]));
    });
    sec.appendChild(grid);
    wrap.appendChild(sec);
  }

  app.appendChild(wrap);
}

/* ---------- Nav ---------- */
function renderNav() {
  const nav = $('#mainNav');
  nav.innerHTML = '';
  DEPTS.forEach(d => {
    const cnt = CASES.filter(c => c.dept === d.id).length;
    if (!cnt) return;
    const a = h('a', '', d.name);
    a.href = `#dept-${d.id}`;
    a.addEventListener('click', e => { e.preventDefault(); viewMode = 'dept'; currentDept = d.id; navigate('gallery'); setTimeout(() => { const el = $(`#dept-${d.id}`); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 60); });
    nav.appendChild(a);
  });
}

/* ---------- Render ---------- */
function render() {
  if (currentView === 'detail') renderDetail();
  else renderGallery();
  setupScrollSpy();
}

/* Tab 滚动高亮：以当前视口上缘为基准选中最后一个已过的 section */
let spyHandler = null;
function setupScrollSpy() {
  if (spyHandler) { window.removeEventListener('scroll', spyHandler); spyHandler = null; }
  const tabs = $$('.detail-tabs [data-tab]');
  if (!tabs.length) return;
  const secs = tabs.map(t => document.getElementById(`sec-${t.dataset.tab}`)).filter(Boolean);
  spyHandler = () => {
    const line = window.scrollY + 160;
    let idx = 0;
    secs.forEach((s, i) => { if (s.offsetTop <= line) idx = i; });
    tabs.forEach((t, i) => t.classList.toggle('active', i === idx));
  };
  __winAdd('scroll', spyHandler, { passive: true });
  spyHandler();
}

/* ---------- Modal preview ---------- */
/*
 * kind 行为对照：
 *   demo / doc  → 弹窗内预览（iframe）+ 下载按钮
 *   text        → fetch 成纯文本预览（.md 这类）+ 下载按钮
 *   video       → 弹窗内直接播（mp4）+ 右上角下载
 *   bundle      → 弹窗内列出多个产物，每行各自下载（右上角按钮收起）
 *   file        → 直接下载，不开预览（如 zip）
 *   live        → 新标签页打开（外部站点不允许 iframe 嵌入）
 */
const PREVIEW_KINDS = ['demo', 'doc', 'text', 'video', 'bundle'];
function isPreviewable(link) {
  if (!link) return false;
  return PREVIEW_KINDS.includes(link.kind);
}
function renderLinkButton(link, extraClass = '') {
  const iconName = link.kind === 'demo' ? 'live' : link.kind === 'file' ? 'download' : link.kind === 'live' ? 'live' : 'doc';
  if (link.kind === 'live') {
    return `<a class="btn ${extraClass}" href="${link.href}" target="_blank" rel="noopener">${svgIcon(iconName, 16)} ${link.label}</a>`;
  }
  if (link.kind === 'file') {
    return `<a class="btn ${extraClass}" href="${link.href}" download>${svgIcon('download', 16)} ${link.label}</a>`;
  }
  return `<button type="button" class="btn ${extraClass}" data-preview-href="${link.href}" data-preview-label="${link.label}" data-preview-kind="${link.kind}">${svgIcon(iconName, 16)} ${link.label}</button>`;
}
function openInModal(link) {
  if (!isPreviewable(link)) {
    if (link.kind === 'file') {
      const a = document.createElement('a');
      a.href = link.href; a.download = link.downloadName || ''; document.body.appendChild(a); a.click(); a.remove();
      return true;
    }
    return false; /* live → 默认跳转 */
  }
  const backdrop = $('#previewModal');
  const frame = $('#previewFrame');
  const textBox = $('#previewText');
  const video = $('#previewVideo');
  const bundle = $('#previewBundle');
  const title = $('#previewTitle');
  const dl = $('#previewDownload');
  title.textContent = link.label;
  /* 下载按钮可以指向与预览不同的文件：
     技能包就是“预览 SKILL.md、下载整个 zip”这种组合 */
  dl.href = link.download || link.href;
  dl.setAttribute('download', link.downloadName || '');
  dl.hidden = false;

  /* 每次开窗先把四种展示容器全部复位，否则上一次的内容会留在里面 */
  frame.hidden = true;
  frame.src = 'about:blank';
  textBox.hidden = true;
  textBox.textContent = '';
  stopModalVideo();
  bundle.hidden = true;
  bundle.innerHTML = '';

  if (link.kind === 'bundle') {
    /* 多文件卡片：右上角的单文件下载没有意义，收起，改成每行各自下载 */
    dl.hidden = true;
    bundle.hidden = false;
    bundle.innerHTML = `
      ${link.bundleLead ? `<p class="bundle-lead">${link.bundleLead}</p>` : ''}
      ${(link.files || []).map(f => `
        <a class="bundle-row" href="${f.href}" download="${f.downloadName || ''}">
          <span class="ic">${svgIcon(f.icon || 'doc', 18)}</span>
          <span class="tx"><b>${f.label}</b>${f.note ? `<small>${f.note}</small>` : ''}</span>
          <span class="go">${svgIcon('download', 16)}</span>
        </a>
      `).join('')}
    `;
  } else if (link.kind === 'video') {
    video.hidden = false;
    video.poster = link.poster || '';
    video.src = link.href;
  } else if (link.kind === 'text') {
    /* .md 的 content-type 是 text/markdown，丢给 iframe 会直接触发下载而不是展示，
       所以自己 fetch 文本放进 <pre>（textContent 赋值，不会执行任何内容）*/
    textBox.hidden = false;
    textBox.textContent = '加载中…';
    fetch(link.href)
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
      .then(t => { textBox.textContent = t; textBox.scrollTop = 0; })
      .catch(err => { textBox.textContent = `文件读取失败（${err.message}）\n可直接点右上角“下载”拿完整包。`; });
  } else {
    frame.hidden = false;
    frame.src = link.href;   /* SVG / HTML 直接作为 iframe 就能展示 */
  }
  backdrop.classList.add('show');
  document.body.style.overflow = 'hidden';
  return true;
}
/* 卸掉视频：光 pause 不够，弹窗隐起来后 src 还在会继续缓存 27MB 的文件 */
function stopModalVideo() {
  const video = $('#previewVideo');
  if (!video) return;
  video.hidden = true;
  video.pause();
  video.removeAttribute('src');
  video.removeAttribute('poster');
  video.load();
}
function closeModal() {
  const backdrop = $('#previewModal');
  const frame = $('#previewFrame');
  backdrop.classList.remove('show');
  frame.src = 'about:blank';
  stopModalVideo();
  document.body.style.overflow = '';
}
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-preview-href]');
  if (btn) {
    e.preventDefault();
    openInModal({ href: btn.dataset.previewHref, label: btn.dataset.previewLabel, kind: btn.dataset.previewKind });
  }
  if (e.target.matches('#previewModal') || e.target.closest('#previewClose')) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  closeModal();
  closeShareModal();
});

/* ---------- 分享案例弹窗（链接 / 海报）---------- */
let posterCase = null;
let posterDone = false;      /* 同一案例只渲染一次 */

function openShareModal(c) {
  posterCase = c;
  posterDone = false;
  const url = caseUrl(c.id);
  $('#shareUrl').value = url;                     /* 把链接明文展出来，所见即所复制 */
  $('#shareTitle').textContent = `分享「${c.title}」`;
  switchSharePane('link');
  $('#shareModal').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeShareModal() {
  $('#shareModal').classList.remove('show');
  document.body.style.overflow = '';
}

function switchSharePane(name) {
  $$('.share-tab').forEach(t => t.classList.toggle('active', t.dataset.pane === name));
  $$('.share-pane').forEach(p => p.classList.toggle('active', p.id === `pane-${name}`));
  if (name === 'poster') buildPoster();
}

function buildPoster() {
  if (!posterCase || posterDone) return;
  posterDone = true;
  const c = posterCase;
  const dept = DEPTS.find(d => d.id === c.dept) || {};
  const canvas = $('#posterCanvas');
  const loading = $('#posterLoading');
  loading.style.display = 'block';
  loading.textContent = '正在生成海报…';

  Poster.render(canvas, {
    title: c.title,
    slogan: c.slogan,
    deptName: dept.name,
    client: c.client,
    metrics: c.metrics,
    cover: c.cover,
    url: caseUrl(c.id),
    logoSrc: $('.brand-logo') ? $('.brand-logo').src : '',
    brand: SITE.brand,
    tagline: SITE.slogan
  }).then(() => {
    loading.style.display = 'none';
    /* toBlob 比 toDataURL 省内存，大图不卡 */
    canvas.toBlob(blob => {
      if (!blob) return;
      const a = $('#posterSave');
      if (a.dataset.url) URL.revokeObjectURL(a.dataset.url);
      const objUrl = URL.createObjectURL(blob);
      a.href = objUrl;
      a.dataset.url = objUrl;
      a.download = `千问办公案例_${c.title}.png`;
    }, 'image/png');
  }).catch(err => {
    posterDone = false;
    loading.textContent = '海报生成失败，请重试';
    console.error('poster:', err);
  });
}

$('#shareClose').addEventListener('click', closeShareModal);
$('#shareModal').addEventListener('click', e => { if (e.target.id === 'shareModal') closeShareModal(); });
$$('.share-tab').forEach(t => t.addEventListener('click', () => switchSharePane(t.dataset.pane)));
$('#shareCopy').addEventListener('click', () => {
  const btn = $('#shareCopy');
  const label = btn.innerHTML;
  const input = $('#shareUrl');
  input.select();
  writeClipboard(input.value).then(() => {
    btn.classList.add('copied');
    btn.innerHTML = `${svgIcon('check', 16)} 已复制`;
    toast('案例链接已复制');
    setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = label; }, 2000);
  }).catch(() => toast('复制失败，请手动选中链接'));
});

/* ---------- 顶部「预约演示」与页脚联系区 ---------- */
/* 预约演示：平滑滚到页脚联系区。用 JS 滚而不靠 href 改 hash，
   因为本站是 hash 路由（#/case/xxx），改成 #contact 会误触 popstate 回到列表页 */
$('#ctaTop').addEventListener('click', e => {
  e.preventDefault();
  const el = $('#contact');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* embed 模式下 hero 里的「预约演示」：同样平滑滚到页脚联系区（事件委托，兼容 hero 重渲染）*/
document.addEventListener('click', e => {
  const c = e.target.closest && e.target.closest('#ctaHero');
  if (!c) return;
  e.preventDefault();
  const el = $('#contact');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* 页脚「联系我们」+ 二维码：均直指钉钉表单 */
(function initContact() {
  const cf = SITE.contactForm || {};
  if (cf.url) {
    $('#ctaFooter').href = cf.url;
    $('#qrLink').href = cf.url;
  }
  const qrWrap = $('#footerQr');
  if (cf.qr) {
    $('#qrImg').src = cf.qr;
    $('#qrCaption').textContent = cf.qrCaption || '扫码填写表单';
  } else if (qrWrap) {
    qrWrap.style.display = 'none';   /* 未配二维码时不留空框 */
  }
})();

/* ---------- Scroll ---------- */
const toTop = $('#toTop');
__winAdd('scroll', () => { toTop.classList.toggle('show', window.scrollY > 400); }, { passive: true });
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- Boot ---------- */
initFromHash();
renderNav();
render();


}
