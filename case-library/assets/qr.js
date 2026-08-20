/* =============================================================================
 *  \u6781\u7b80 QR \u7f16\u7801\u5668\uff08byte \u6a21\u5f0f\uff0c\u7248\u672c 1-40\uff0c\u56db\u7ea7\u5bb9\u9519\uff09
 *  ---------------------------------------------------------------------------
 *  \u4e13\u4e3a\u5206\u4eab\u6d77\u62a5\u751f\u6210\u6848\u4f8b\u94fe\u63a5\u4e8c\u7ef4\u7801\u3002\u65e0\u4f9d\u8d56\u3001\u4e0d\u8bf7\u6c42\u5916\u90e8\u670d\u52a1\uff08\u907f\u5f00\u7b2c\u4e09\u65b9
 *  \u4e8c\u7ef4\u7801 API \u5728\u56fd\u5185\u4e0d\u53ef\u7528 / \u6cc4\u9732\u94fe\u63a5\u7684\u95ee\u9898\uff09\u3002
 *
 *  \u7528\u6cd5\uff1a
 *    const m = QR.make('https://...');   // -> { size, get(x, y) }
 *    QR.draw(m, ctx, x, y, px, dark, light);
 *
 *  \u7b97\u6cd5\u6309 ISO/IEC 18004 \u5b9e\u73b0\uff08\u7ed3\u6784\u53c2\u8003 Nayuki \u7684\u516c\u5f00\u5b9e\u73b0\u601d\u8def\uff09\u3002
 *  \u8f93\u51fa\u5df2\u7528 macOS CoreImage \u5b9e\u9645\u626b\u7801\u89e3\u7801\u56de\u6d4b\u9a8c\u8bc1\u3002
 * ========================================================================== */
export const QR = (function () {
  'use strict';

  /* \u6bcf\u5757\u7ea0\u9519\u7801\u5b57\u6570\uff1a[L, M, Q, H][version] */
  const ECC_PER_BLOCK = [
    [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
    [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
  ];

  /* \u7ea0\u9519\u5757\u6570\uff1a[L, M, Q, H][version] */
  const NUM_BLOCKS = [
    [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
    [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
    [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
    [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81]
  ];

  /* ---------- GF(256) \u8fd0\u7b97\uff0c\u672c\u539f\u591a\u9879\u5f0f 0x11D ---------- */
  function gfMul(x, y) {
    let z = 0;
    for (let i = 7; i >= 0; i--) {
      z = ((z << 1) ^ ((z >>> 7) * 0x11D)) & 0xFF;
      z ^= ((y >>> i) & 1) * x;
    }
    return z;
  }

  function rsDivisor(degree) {
    const result = new Uint8Array(degree);
    result[degree - 1] = 1;
    let root = 1;
    for (let i = 0; i < degree; i++) {
      for (let j = 0; j < degree; j++) {
        result[j] = gfMul(result[j], root);
        if (j + 1 < degree) result[j] ^= result[j + 1];
      }
      root = gfMul(root, 0x02);
    }
    return result;
  }

  function rsRemainder(data, divisor) {
    const result = new Uint8Array(divisor.length);
    for (const b of data) {
      const factor = b ^ result[0];
      result.copyWithin(0, 1);
      result[result.length - 1] = 0;
      for (let i = 0; i < divisor.length; i++) result[i] ^= gfMul(divisor[i], factor);
    }
    return result;
  }

  /* ---------- \u5bb9\u91cf\u8ba1\u7b97 ---------- */
  function numRawDataModules(ver) {
    let result = (16 * ver + 128) * ver + 64;
    if (ver >= 2) {
      const numAlign = Math.floor(ver / 7) + 2;
      result -= (25 * numAlign - 10) * numAlign - 55;
      if (ver >= 7) result -= 36;
    }
    return result;
  }

  function numDataCodewords(ver, ecl) {
    return Math.floor(numRawDataModules(ver) / 8)
      - ECC_PER_BLOCK[ecl][ver] * NUM_BLOCKS[ecl][ver];
  }

  function alignPositions(ver) {
    if (ver === 1) return [];
    const num = Math.floor(ver / 7) + 2;
    const step = (ver === 32) ? 26
      : Math.ceil((ver * 4 + 4) / (num * 2 - 2)) * 2;
    const pos = [6];
    for (let p = ver * 4 + 10; pos.length < num; p -= step) pos.splice(1, 0, p);
    return pos;
  }

  /* ---------- \u4e3b\u6d41\u7a0b ---------- */
  function make(text, eclIndex) {
    const ecl = (eclIndex === undefined) ? 1 : eclIndex;   /* \u9ed8\u8ba4 M */
    const bytes = new TextEncoder().encode(text);

    /* \u9009\u6700\u5c0f\u53ef\u5bb9\u7248\u672c */
    let ver = 1;
    for (; ver <= 40; ver++) {
      const capBits = numDataCodewords(ver, ecl) * 8;
      const ccBits = (ver <= 9) ? 8 : 16;
      if (4 + ccBits + bytes.length * 8 <= capBits) break;
    }
    if (ver > 40) throw new Error('QR: \u5185\u5bb9\u8fc7\u957f');

    /* \u7ec4\u4f4d\u6d41\uff1a\u6a21\u5f0f\u6307\u793a\u7b26 + \u5b57\u7b26\u8ba1\u6570 + \u6570\u636e */
    const bits = [];
    const push = (val, len) => { for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
    push(0b0100, 4);
    push(bytes.length, ver <= 9 ? 8 : 16);
    for (const b of bytes) push(b, 8);

    /* \u7ed3\u675f\u7b26 + \u8865\u9f50\u5230\u5b57\u8282\u8fb9\u754c + \u586b\u5145\u5b57 */
    const dataCw = numDataCodewords(ver, ecl);
    const capBits = dataCw * 8;
    push(0, Math.min(4, capBits - bits.length));
    while (bits.length % 8 !== 0) bits.push(0);
    const dat = [];
    for (let i = 0; i < bits.length; i += 8) {
      let b = 0;
      for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
      dat.push(b);
    }
    for (let pad = 0xEC; dat.length < dataCw; pad ^= 0xEC ^ 0x11) dat.push(pad);

    /* \u5206\u5757\u7b97\u7ea0\u9519 + \u4ea4\u9519\u4ea4\u7ec7 */
    const numBlk = NUM_BLOCKS[ecl][ver];
    const eccLen = ECC_PER_BLOCK[ecl][ver];
    const rawCw = Math.floor(numRawDataModules(ver) / 8);
    const shortLen = Math.floor(rawCw / numBlk) - eccLen;
    const numShort = numBlk - rawCw % numBlk;
    const divisor = rsDivisor(eccLen);

    const blocks = [];
    for (let i = 0, k = 0; i < numBlk; i++) {
      const len = shortLen + (i < numShort ? 0 : 1);
      const d = dat.slice(k, k + len);
      k += len;
      blocks.push({ d, e: rsRemainder(d, divisor) });
    }
    const codewords = [];
    for (let i = 0; i < shortLen + 1; i++)
      for (let j = 0; j < numBlk; j++)
        if (i < blocks[j].d.length) codewords.push(blocks[j].d[i]);
    for (let i = 0; i < eccLen; i++)
      for (let j = 0; j < numBlk; j++) codewords.push(blocks[j].e[i]);

    /* ---------- \u753b\u77e9\u9635 ---------- */
    const size = ver * 4 + 17;
    const mod = [], fn = [];
    for (let i = 0; i < size; i++) {
      mod.push(new Array(size).fill(false));
      fn.push(new Array(size).fill(false));
    }
    const setFn = (x, y, v) => {
      if (x < 0 || y < 0 || x >= size || y >= size) return;
      mod[y][x] = v; fn[y][x] = true;
    };

    /* 定位图案（timing）——必须先画，随后的定位图形会覆盖它在角上的部分；
       反之则会把定位图形的边框抹掉，二维码扫不出来 */
    for (let i = 0; i < size; i++) { setFn(6, i, i % 2 === 0); setFn(i, 6, i % 2 === 0); }

    /* 定位图形 + 分隔符 */
    const drawFinder = (cx, cy) => {
      for (let dy = -4; dy <= 4; dy++)
        for (let dx = -4; dx <= 4; dx++) {
          const d = Math.max(Math.abs(dx), Math.abs(dy));
          setFn(cx + dx, cy + dy, d !== 2 && d !== 4);
        }
    };
    drawFinder(3, 3); drawFinder(size - 4, 3); drawFinder(3, size - 4);

    /* \u77eb\u6b63\u56fe\u5f62 */
    const ap = alignPositions(ver);
    for (let i = 0; i < ap.length; i++)
      for (let j = 0; j < ap.length; j++) {
        if ((i === 0 && j === 0) || (i === 0 && j === ap.length - 1) || (i === ap.length - 1 && j === 0)) continue;
        for (let dy = -2; dy <= 2; dy++)
          for (let dx = -2; dx <= 2; dx++)
            setFn(ap[j] + dx, ap[i] + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      }

    /* \u683c\u5f0f\u4fe1\u606f\u4f4d\u9884\u5360\uff08\u5185\u5bb9\u7a0d\u540e\u5199\uff09*/
    const reserveFormat = () => {
      for (let i = 0; i <= 5; i++) setFn(8, i, false);
      setFn(8, 7, false); setFn(8, 8, false); setFn(7, 8, false);
      for (let i = 9; i <= 14; i++) setFn(14 - i, 8, false);
      for (let i = 0; i < 8; i++) setFn(size - 1 - i, 8, false);
      for (let i = 8; i < 15; i++) setFn(8, size - 15 + i, false);
      setFn(8, size - 8, true);   /* \u56fa\u5b9a\u6697\u6a21\u5757 */
    };
    reserveFormat();

    /* \u7248\u672c\u4fe1\u606f\uff08\u2265 v7\uff09*/
    if (ver >= 7) {
      let rem = ver;
      for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25);
      const bitsV = ver << 12 | rem;
      for (let i = 0; i < 18; i++) {
        const b = ((bitsV >>> i) & 1) === 1;
        const a = size - 11 + i % 3;
        const bb = Math.floor(i / 3);
        setFn(a, bb, b); setFn(bb, a, b);
      }
    }

    /* \u6570\u636e\u4f4d\u4e0a\u94fe\uff08\u53cc\u5217\u4e4b\u5b57\u5f62\uff09*/
    let bitIdx = 0;
    const totalBits = codewords.length * 8;
    for (let right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let vert = 0; vert < size; vert++)
        for (let j = 0; j < 2; j++) {
          const x = right - j;
          const upward = ((right + 1) & 2) === 0;
          const y = upward ? size - 1 - vert : vert;
          if (!fn[y][x] && bitIdx < totalBits) {
            mod[y][x] = ((codewords[bitIdx >>> 3] >>> (7 - (bitIdx & 7))) & 1) !== 0;
            bitIdx++;
          }
        }
    }

    /* \u63a9\u7801\uff1a8 \u79cd\u9010\u4e2a\u8bd5\uff0c\u53d6\u60e9\u7f5a\u5206\u6700\u4f4e */
    const maskFns = [
      (x, y) => (x + y) % 2,
      (x, y) => y % 2,
      (x, y) => x % 3,
      (x, y) => (x + y) % 3,
      (x, y) => (Math.floor(y / 2) + Math.floor(x / 3)) % 2,
      (x, y) => (x * y) % 2 + (x * y) % 3,
      (x, y) => ((x * y) % 2 + (x * y) % 3) % 2,
      (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2
    ];

    const applyMask = (m) => {
      for (let y = 0; y < size; y++)
        for (let x = 0; x < size; x++)
          if (!fn[y][x] && maskFns[m](x, y) === 0) mod[y][x] = !mod[y][x];
    };

    const drawFormat = (m) => {
      /* \u683c\u5f0f\u4fe1\u606f = 5 \u4f4d\u6570\u636e(ecl<<3|mask) + BCH(15,5)\uff0c\u518d\u5f02\u6216 0x5412 */
      const eclBits = [0b01, 0b00, 0b11, 0b10][ecl];   /* L,M,Q,H \u7684\u7f16\u53f7 */
      const data = eclBits << 3 | m;
      let rem = data;
      for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
      const b = ((data << 10 | rem) ^ 0x5412) & 0x7FFF;
      const bit = i => ((b >>> i) & 1) === 1;
      for (let i = 0; i <= 5; i++) setFn(8, i, bit(i));
      setFn(8, 7, bit(6)); setFn(8, 8, bit(7)); setFn(7, 8, bit(8));
      for (let i = 9; i < 15; i++) setFn(14 - i, 8, bit(i));
      for (let i = 0; i < 8; i++) setFn(size - 1 - i, 8, bit(i));
      for (let i = 8; i < 15; i++) setFn(8, size - 15 + i, bit(i));
    };

    const penalty = () => {
      let p = 0;
      /* \u89c4\u5219 1\uff1a\u540c\u8272\u8fde\u7eed */
      for (let y = 0; y < size; y++) {
        let run = 1;
        for (let x = 1; x < size; x++) {
          if (mod[y][x] === mod[y][x - 1]) { run++; if (run === 5) p += 3; else if (run > 5) p++; }
          else run = 1;
        }
      }
      for (let x = 0; x < size; x++) {
        let run = 1;
        for (let y = 1; y < size; y++) {
          if (mod[y][x] === mod[y - 1][x]) { run++; if (run === 5) p += 3; else if (run > 5) p++; }
          else run = 1;
        }
      }
      /* \u89c4\u5219 2\uff1a2x2 \u540c\u8272\u5757 */
      for (let y = 0; y < size - 1; y++)
        for (let x = 0; x < size - 1; x++) {
          const c = mod[y][x];
          if (c === mod[y][x + 1] && c === mod[y + 1][x] && c === mod[y + 1][x + 1]) p += 3;
        }
      /* \u89c4\u5219 3\uff1a\u7c7b\u5b9a\u4f4d\u56fe\u5f62 1:1:3:1:1 */
      const pat = [true, false, true, true, true, false, true];
      const hasPat = (get, i, n) => {
        if (i < 0 || i + 7 > n) return false;
        for (let k = 0; k < 7; k++) if (get(i + k) !== pat[k]) return false;
        const before = () => { for (let k = i - 4; k < i; k++) if (k >= 0 && get(k)) return false; return true; };
        const after = () => { for (let k = i + 7; k < i + 11; k++) if (k < n && get(k)) return false; return true; };
        return before() || after();
      };
      for (let y = 0; y < size; y++)
        for (let x = 0; x < size; x++) {
          if (hasPat(i => mod[y][i], x, size)) p += 40;
          if (hasPat(i => mod[i][x], y, size)) p += 40;
        }
      /* \u89c4\u5219 4\uff1a\u9ed1\u767d\u6bd4\u4f8b\u504f\u79bb */
      let dark = 0;
      for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (mod[y][x]) dark++;
      const total = size * size;
      p += Math.floor(Math.abs(dark * 20 - total * 10) / total) * 10;
      return p;
    };

    let bestMask = 0, bestPenalty = Infinity;
    for (let m = 0; m < 8; m++) {
      applyMask(m); drawFormat(m);
      const p = penalty();
      if (p < bestPenalty) { bestPenalty = p; bestMask = m; }
      applyMask(m);   /* \u5f02\u6216\u81ea\u9006\uff0c\u64a4\u56de */
    }
    applyMask(bestMask); drawFormat(bestMask);

    return {
      size,
      version: ver,
      get: (x, y) => mod[y][x] === true
    };
  }

  /* ---------- \u753b\u5230 canvas ---------- */
  function draw(m, ctx, ox, oy, px, dark, light) {
    if (light) {
      ctx.fillStyle = light;
      ctx.fillRect(ox, oy, m.size * px, m.size * px);
    }
    ctx.fillStyle = dark || '#000';
    for (let y = 0; y < m.size; y++)
      for (let x = 0; x < m.size; x++)
        if (m.get(x, y)) ctx.fillRect(ox + x * px, oy + y * px, px, px);
  }

  return { make, draw };
})();
