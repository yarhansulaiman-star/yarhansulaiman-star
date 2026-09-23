// Generator kartu "GitHub Streak" animasi (SVG) untuk profil.
// - Ambil data dari layanan publik streak-stats (akurat & update sendiri).
// - Render ulang jadi kartu full-width 1280x300 bertema violet dengan animasi terus-menerus.
// - Dipakai oleh .github/workflows/streak.yml (harian) supaya angka selalu terbaru.
//
// Jalankan lokal:  node scripts/gen-streak.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// NB: jangan pakai process.env.USERNAME (di Windows itu nama akun lokal, mis. "LENOVO").
const USER = process.env.GH_USER || process.env.GITHUB_REPOSITORY_OWNER || 'yarhansulaiman-star';
const OUT = process.env.OUT || join(ROOT, 'assets', 'streak.svg');

const SRC = 'https://streak-stats.demolab.com'
  + `?user=${USER}`
  + '&hide_border=true&background=0a0a0f&stroke=7c6dfa&ring=a78bfa&fire=a78bfa'
  + '&currStreakLabel=a78bfa&sideLabels=e2e8f0&dates=94a3b8'
  + '&sideNums=e2e8f0&currStreakNum=a78bfa&border=7c6dfa';

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const res = await fetch(SRC, { headers: { 'User-Agent': 'streak-svg-generator' } });
if (!res.ok) throw new Error(`gagal fetch streak-stats: HTTP ${res.status}`);
const raw = await res.text();

// Urutan di sumber: [total, current, longest]
const nums = [...raw.matchAll(/font-size='28px'[^>]*>\s*([\d.,]+)\s*<\/text>/g)]
  .map((m) => m[1].replace(/[.,]/g, ''));
const ranges = [...raw.matchAll(/font-size='12px'[^>]*>\s*([^<]+?)\s*<\/text>/g)]
  .map((m) => m[1].trim());

if (nums.length < 3 || ranges.length < 3 || nums.slice(0, 3).some((n) => !/^\d+$/.test(n))) {
  throw new Error(`parse gagal -> nums=${JSON.stringify(nums)} ranges=${JSON.stringify(ranges)}`);
}

const [total, current, longest] = nums;
const [totalRange, currentRange, longestRange] = ranges;

const FONT = "'Segoe UI', Ubuntu, Helvetica, Arial, sans-serif";

const stat = (cx, num, label, range, numColor, labelColor, weight, delays) => `
    <!-- ${label} -->
    <g class="rise" style="animation-delay:${delays[0]}s">
      <text x="${cx}" y="126" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="60" fill="${numColor}" class="pulse">${esc(num)}</text>
    </g>
    <g class="rise" style="animation-delay:${delays[1]}s">
      <text x="${cx}" y="205" text-anchor="middle" font-family="${FONT}" font-weight="${weight}" font-size="19" fill="${labelColor}" letter-spacing="0.5">${esc(label)}</text>
    </g>
    <g class="rise" style="animation-delay:${delays[2]}s">
      <text x="${cx}" y="241" text-anchor="middle" font-family="${FONT}" font-weight="400" font-size="15" fill="#94a3b8">${esc(range)}</text>
    </g>`;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="300" viewBox="0 0 1280 300" role="img" aria-label="GitHub streak ${USER}: ${total} total contributions, ${current} current streak, ${longest} longest streak">
  <title>GitHub Streak — ${esc(USER)}</title>
  <desc>Total ${total} kontribusi, streak saat ini ${current} hari, streak terpanjang ${longest} hari.</desc>
  <defs>
    <linearGradient id="skBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a0a0f"/>
      <stop offset="0.55" stop-color="#0d0b1a"/>
      <stop offset="1" stop-color="#140b26"/>
    </linearGradient>
    <radialGradient id="skGlow" cx="0.5" cy="0.4" r="0.62">
      <stop offset="0" stop-color="#7c6dfa" stop-opacity="0.34"/>
      <stop offset="1" stop-color="#7c6dfa" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="skShine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#c4b5fd" stop-opacity="0.20"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="skClip"><rect x="1" y="1" width="1278" height="298" rx="20"/></clipPath>
    <style>
      .rise { opacity: 0; animation: rise .8s cubic-bezier(.2,.8,.2,1) forwards; }
      @keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      .pulse { transform-box: fill-box; transform-origin: 50% 60%; animation: pulse 3.6s ease-in-out infinite; }
      @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
      .ring-arc { stroke-dasharray: 130 259.6; animation: ringsweep 3.2s linear infinite; }
      @keyframes ringsweep { from { stroke-dashoffset: 389.6; } to { stroke-dashoffset: 0; } }
      .flame { transform-box: fill-box; transform-origin: 50% 92%; animation: flicker 1.5s ease-in-out infinite; }
      @keyframes flicker { 0%, 100% { transform: scale(1) rotate(0deg); } 30% { transform: scale(1.14) rotate(-3deg); } 65% { transform: scale(.93) rotate(2deg); } }
      .shine { animation: shine 7s ease-in-out 1.4s infinite; }
      @keyframes shine { 0% { transform: translateX(-460px); } 45%, 100% { transform: translateX(1520px); } }
    </style>
  </defs>

  <g clip-path="url(#skClip)">
    <rect x="1" y="1" width="1278" height="298" rx="20" fill="url(#skBg)"/>
    <ellipse cx="640" cy="120" rx="430" ry="210" fill="url(#skGlow)"/>

    <g stroke="#7c6dfa" stroke-width="1" opacity="0.32">
      <line x1="426.67" y1="46" x2="426.67" y2="254"/>
      <line x1="853.33" y1="46" x2="853.33" y2="254"/>
    </g>

    <!-- Total Contributions -->
${stat(213, total, 'Total Contributions', totalRange, '#e2e8f0', '#e2e8f0', '400', [0.15, 0.35, 0.5])}

    <!-- Current Streak (ring + fire) -->
    <g class="rise" style="animation-delay:0.3s">
      <circle cx="640" cy="104" r="62" fill="none" stroke="#a78bfa" stroke-width="6" opacity="0.25"/>
      <circle class="ring-arc" cx="640" cy="104" r="62" fill="none" stroke="#a78bfa" stroke-width="6" stroke-linecap="round"/>
    </g>
    <g transform="translate(640,26) scale(1.5)">
      <path class="flame" d="M 1.5 0.67 C 1.5 0.67 2.24 3.32 2.24 5.47 C 2.24 7.53 0.89 9.2 -1.17 9.2 C -3.23 9.2 -4.79 7.53 -4.79 5.47 L -4.76 5.11 C -6.78 7.51 -8 10.62 -8 13.99 C -8 18.41 -4.42 22 0 22 C 4.42 22 8 18.41 8 13.99 C 8 8.6 5.41 3.79 1.5 0.67 Z M -0.29 19 C -2.07 19 -3.51 17.6 -3.51 15.86 C -3.51 14.24 -2.46 13.1 -0.7 12.74 C 1.07 12.38 2.9 11.53 3.92 10.16 C 4.31 11.45 4.51 12.81 4.51 14.2 C 4.51 16.85 2.36 19 -0.29 19 Z" fill="#a78bfa"/>
    </g>
    <g class="rise" style="animation-delay:0.45s">
      <text x="640" y="126" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="60" fill="#c4b5fd" class="pulse">${esc(current)}</text>
    </g>
    <g class="rise" style="animation-delay:0.6s">
      <text x="640" y="205" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="19" fill="#a78bfa" letter-spacing="0.5">Current Streak</text>
    </g>
    <g class="rise" style="animation-delay:0.75s">
      <text x="640" y="241" text-anchor="middle" font-family="${FONT}" font-weight="400" font-size="15" fill="#94a3b8">${esc(currentRange)}</text>
    </g>

    <!-- Longest Streak -->
${stat(1067, longest, 'Longest Streak', longestRange, '#e2e8f0', '#e2e8f0', '400', [0.2, 0.4, 0.55])}

    <g transform="skewX(-18)" opacity="0.9">
      <rect class="shine" x="0" y="-60" width="200" height="420" fill="url(#skShine)"/>
    </g>

    <rect x="1.5" y="1.5" width="1277" height="297" rx="19" fill="none" stroke="#7c6dfa" stroke-width="1.5" opacity="0.5"/>
  </g>
</svg>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, svg, 'utf8');
console.log(`OK -> ${OUT}  (total=${total}, current=${current}, longest=${longest})`);
