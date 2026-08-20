import { QR } from './qr.js';

/* =============================================================================
 *  \u5206\u4eab\u6d77\u62a5\u6e32\u67d3\uff08canvas\uff09
 *  ---------------------------------------------------------------------------
 *  \u81ea\u5305\u542b\uff1a\u4e0d\u4f9d\u8d56\u5916\u90e8\u5168\u5c40\u53d8\u91cf\uff0c\u6240\u9700\u5185\u5bb9\u5168\u90e8\u7531\u53c2\u6570\u4f20\u5165\u3002
 *  \u4e8c\u7ef4\u7801\u4f9d\u8d56 QR\uff08assets/qr.js\uff09\u3002
 *
 *  Poster.render(canvas, payload) -> Promise<void>
 *    payload = { title, slogan, deptName, client, metrics:[{value,label}],
 *                cover, url, logoSrc, brand, tagline }
 * ========================================================================== */
export const Poster = (function () {
  'use strict';

  const W = 800;            /* 逻辑宽 */
  const H_MAX = 1500;       /* 离屏画布上限，最终高度按内容裁 */
  const SCALE = 2;          /* 二倍图，保证手机上清晰 */
  const PAD = 48;

  const GREEN = '#30bf69';
  const GREEN_DARK = '#22975a';
  const INK = '#141a16';
  const MUTED = '#4a5a50';
  const SUBTLE = '#7a8e82';
  const LINE = 'rgba(20,38,28,0.10)';

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /* \u6309\u5bbd\u5ea6\u6298\u884c\uff08\u4e2d\u6587\u9010\u5b57\uff0c\u82f1\u6587\u6309\u8bcd\uff09*/
  function wrap(ctx, text, maxW, maxLines) {
    const lines = [];
    let cur = '';
    const tokens = String(text).match(/[a-zA-Z0-9@._%+-]+|[^\s]|\s/g) || [];
    for (const t of tokens) {
      if (t === '\n') { lines.push(cur); cur = ''; continue; }
      const test = cur + t;
      if (ctx.measureText(test).width > maxW && cur !== '') {
        lines.push(cur);
        cur = (t.trim() === '') ? '' : t;
        if (maxLines && lines.length >= maxLines) break;
      } else {
        cur = test;
      }
    }
    if (cur && (!maxLines || lines.length < maxLines)) lines.push(cur);
    if (maxLines && lines.length >= maxLines) {
      /* \u6ea2\u51fa\u65f6\u672b\u884c\u52a0\u7701\u7565\u53f7 */
      const total = (ctx.measureText(String(text)).width > maxW * maxLines);
      if (total) {
        let last = lines[maxLines - 1] || '';
        while (last && ctx.measureText(last + '\u2026').width > maxW) last = last.slice(0, -1);
        lines[maxLines - 1] = last + '\u2026';
      }
      lines.length = Math.min(lines.length, maxLines);
    }
    return lines;
  }

  function loadImg(src) {
    return new Promise(resolve => {
      if (!src) return resolve(null);
      const img = new Image();
      img.crossOrigin = 'anonymous';          /* CDN \u5df2\u5f00 ACAO:*\uff0c\u4e0d\u4f1a\u6c61\u67d3 canvas */
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);      /* \u52a0\u4e0d\u51fa\u6765\u5c31\u7565\u8fc7\uff0c\u4e0d\u963b\u65ad\u6d77\u62a5 */
      img.src = src;
    });
  }

  async function render(canvas, p) {
    /* 先画到离屏画布（高度给宽），排完再按内容真实高度拷到目标画布，
       避免固定高度在标题/slogan 行数少时底部留一大片空白 */
    const off = document.createElement('canvas');
    off.width = W * SCALE;
    off.height = H_MAX * SCALE;
    const ctx = off.getContext('2d');
    ctx.scale(SCALE, SCALE);
    const FONT = '"PingFang SC","Microsoft YaHei",-apple-system,sans-serif';
 
    /* ---------- 底 ---------- */
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H_MAX);

    /* \u9876\u90e8\u6de1\u7eff\u5149 */
    const g = ctx.createLinearGradient(0, 0, W, 300);
    g.addColorStop(0, 'rgba(48,191,105,0.13)');
    g.addColorStop(1, 'rgba(76,226,133,0.05)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, 300);

    /* ---------- \u9876\u90e8\u54c1\u724c ---------- */
    let y = PAD;
    const [logo, cover] = await Promise.all([loadImg(p.logoSrc), loadImg(p.cover)]);
    if (logo) {
      const lh = 30, lw = logo.width / logo.height * lh;
      ctx.drawImage(logo, PAD, y, lw, lh);
      ctx.font = `500 15px ${FONT}`;
      ctx.fillStyle = SUBTLE;
      ctx.textBaseline = 'middle';
      ctx.fillText('\u6848\u4f8b\u5e93', PAD + lw + 14, y + lh / 2 + 1);
    } else {
      ctx.font = `700 22px ${FONT}`;
      ctx.fillStyle = INK;
      ctx.textBaseline = 'top';
      ctx.fillText(`${p.brand || '\u5343\u95ee\u529e\u516c'} \u00b7 \u6848\u4f8b\u5e93`, PAD, y + 4);
    }
    y += 30 + 34;

    /* ---------- \u90e8\u95e8 / \u5ba2\u6237\u6807\u7b7e ---------- */
    ctx.textBaseline = 'top';
    let cx = PAD;
    const chip = (text, bg, fg, bd) => {
      ctx.font = `600 15px ${FONT}`;
      const tw = ctx.measureText(text).width;
      const w = tw + 26, h = 32;
      ctx.fillStyle = bg;
      roundRect(ctx, cx, y, w, h, 8);
      ctx.fill();
      if (bd) { ctx.strokeStyle = bd; ctx.lineWidth = 1; ctx.stroke(); }
      ctx.fillStyle = fg;
      ctx.fillText(text, cx + 13, y + 8);
      cx += w + 10;
    };
    if (p.deptName) chip(p.deptName, GREEN, '#ffffff', null);
    if (p.client) chip(p.client, '#eefff5', GREEN_DARK, 'rgba(48,191,105,0.25)');
    y += 32 + 26;

    /* ---------- \u6807\u9898 ---------- */
    ctx.font = `700 40px ${FONT}`;
    ctx.fillStyle = INK;
    const titleLines = wrap(ctx, p.title || '', W - PAD * 2, 2);
    titleLines.forEach(l => { ctx.fillText(l, PAD, y); y += 52; });
    y += 8;

    /* ---------- slogan ---------- */
    if (p.slogan) {
      ctx.font = `400 19px ${FONT}`;
      ctx.fillStyle = MUTED;
      wrap(ctx, p.slogan, W - PAD * 2, 3).forEach(l => { ctx.fillText(l, PAD, y); y += 30; });
    }
    y += 26;

    /* ---------- \u5c01\u9762\u56fe ---------- */
    const cw = W - PAD * 2, ch = Math.round(cw * 9 / 16);
    ctx.save();
    roundRect(ctx, PAD, y, cw, ch, 16);
    ctx.clip();
    if (cover) {
      /* \u6309\u5bbd\u94fa\u6ee1\uff0c\u53d6\u9876\u90e8\uff08\u4e0e\u5361\u7247 object-position: top \u4e00\u81f4\uff09*/
      const s = cw / cover.width;
      ctx.drawImage(cover, PAD, y, cw, cover.height * s);
    } else {
      const cg = ctx.createLinearGradient(PAD, y, PAD + cw, y + ch);
      cg.addColorStop(0, '#1d3a2a');
      cg.addColorStop(1, '#121d18');
      ctx.fillStyle = cg;
      ctx.fillRect(PAD, y, cw, ch);
    }
    ctx.restore();
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 1;
    roundRect(ctx, PAD, y, cw, ch, 16);
    ctx.stroke();
    y += ch + 34;

    /* ---------- \u4eae\u70b9\u6570\u5b57 ---------- */
    const ms = (p.metrics || []).slice(0, 3);
    if (ms.length) {
      ctx.strokeStyle = LINE;
      ctx.beginPath(); ctx.moveTo(PAD, y); ctx.lineTo(W - PAD, y); ctx.stroke();
      y += 24;
      const colW = (W - PAD * 2) / ms.length;
      ms.forEach((m, i) => {
        const x = PAD + colW * i;
        ctx.font = `700 30px ${FONT}`;
        ctx.fillStyle = GREEN_DARK;
        ctx.fillText(String(m.value), x, y);
        ctx.font = `400 14px ${FONT}`;
        ctx.fillStyle = SUBTLE;
        wrap(ctx, m.label, colW - 18, 2).forEach((l, k) => ctx.fillText(l, x, y + 40 + k * 20));
      });
      y += 40 + 44 + 24;
      ctx.strokeStyle = LINE;
      ctx.beginPath(); ctx.moveTo(PAD, y); ctx.lineTo(W - PAD, y); ctx.stroke();
      y += 30;
    }

    /* ---------- 二维码区（紧跟内容，不钉底）---------- */
    const qrBoxY = y + 6;
    const m = QR.make(p.url);
    const qpx = Math.floor(150 / (m.size + 2));   /* 含 1 模块内边距 */
    const qSide = m.size * qpx;
    const boxSide = qSide + qpx * 4;
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, PAD, qrBoxY, boxSide, boxSide, 12);
    ctx.fill();
    ctx.strokeStyle = 'rgba(20,38,28,0.16)';
    ctx.stroke();
    QR.draw(m, ctx, PAD + qpx * 2, qrBoxY + qpx * 2, qpx, '#141a16', null);

    const tx = PAD + boxSide + 26;
    ctx.font = `600 20px ${FONT}`;
    ctx.fillStyle = INK;
    ctx.fillText('扫码查看完整案例', tx, qrBoxY + 18);
    ctx.font = `400 15px ${FONT}`;
    ctx.fillStyle = SUBTLE;
    wrap(ctx, p.tagline || '让 AI 落到真实场景，让实践沉淀为组织能力', W - tx - PAD, 2)
      .forEach((l, i) => ctx.fillText(l, tx, qrBoxY + 54 + i * 24));

    /* 底部署名 */
    ctx.font = `400 13px ${FONT}`;
    ctx.fillStyle = SUBTLE;
    ctx.fillText(`${p.brand || '千问办公'} · 全部门 AI 场景实践指引`, tx, qrBoxY + boxSide - 20);

    /* ---------- 按真实高度输出 ---------- */
    const finalH = Math.min(H_MAX, qrBoxY + boxSide + PAD);
    canvas.width = W * SCALE;
    canvas.height = finalH * SCALE;
    const out = canvas.getContext('2d');
    out.drawImage(off, 0, 0, W * SCALE, finalH * SCALE, 0, 0, W * SCALE, finalH * SCALE);
  }

  return { render, W, SCALE };
})();
