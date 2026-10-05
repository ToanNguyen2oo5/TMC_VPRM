import React, { useEffect, useRef } from 'react';
import './HomeHorizontal.css';

export default function HomeHorizontal({ onNavigate }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const $ = (s, r = container) => r.querySelector(s);
    const $$ = (s, r = container) => [...r.querySelectorAll(s)];
    const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const SK = '#D8A57C', BLK = '#17110d';

    /* ================= FIGURE ================= */
    const sleeve = (len, wr, fill) => {
      const a = 34;
      const L = `<path d="M84 98 L${84 - a} ${98 + len} L${84 - a + wr} ${102 + len} L92 132 Z" fill="${fill}"/>` +
                `<circle cx="${84 - a + wr / 2}" cy="${106 + len}" r="6" fill="${SK}"/>`;
      return L + `<g transform="translate(220 0) scale(-1 1)">${L}</g>`;
    };
    const body = (fill, hem, fl) =>
      `<path d="M82 98 Q110 90 138 98 L${140 + fl} ${hem} L${80 - fl} ${hem} Z" fill="${fill}"/>`;
    const dots = (hem, fl, col) => {
      let s = '';
      for (let y = 122, r = 0; y < hem - 8; y += 24, r++) {
        const hw = 28 + fl * (y - 98) / (hem - 98);
        (r % 2 ? [-10, 10] : [-20, 0, 20]).forEach(dx => {
          if (Math.abs(dx) < hw - 6) s += `<circle cx="${110 + dx}" cy="${y}" r="3" fill="${col}"/>`;
        });
      }
      return s;
    };
    const pants = (c, fl, stroke) =>
      `<path d="M86 190 L110 190 L108 400 L${76 - fl} 400 Z" fill="${c}" stroke="${stroke}" stroke-width="1"/>` +
      `<path d="M110 190 L134 190 L${144 + fl} 400 L112 400 Z" fill="${c}" stroke="${stroke}" stroke-width="1"/>`;
    const skirt = c =>
      `<rect x="96" y="340" width="10" height="64" fill="${SK}"/><rect x="114" y="340" width="10" height="64" fill="${SK}"/>` +
      `<path d="M84 188 L136 188 L154 360 L66 360 Z" fill="${c}"/>`;

    const HEAD_SVG = [
      () => `<path d="M89 64 Q86 36 110 36 Q134 36 131 64 Q126 47 110 47 Q94 47 89 64Z" fill="${BLK}"/>`,
      () => `<rect x="48" y="38" width="46" height="5" rx="2.5" fill="${BLK}"/><rect x="126" y="38" width="46" height="5" rx="2.5" fill="${BLK}"/>` +
            `<rect x="91" y="30" width="38" height="26" rx="9" fill="${BLK}"/><rect x="91" y="46" width="38" height="5" fill="#C9A23F"/>`,
      () => `<ellipse cx="110" cy="44" rx="25" ry="17" fill="#1F2F57"/>` +
            `<path d="M88 46 Q110 58 132 46" stroke="#3B5088" stroke-width="3" fill="none"/><path d="M90 38 Q110 50 130 38" stroke="#3B5088" stroke-width="3" fill="none"/>`,
      () => `<path d="M70 50 Q70 92 98 84" stroke="#B3261E" stroke-width="3" fill="none"/><path d="M150 50 Q150 92 122 84" stroke="#B3261E" stroke-width="3" fill="none"/>` +
            `<ellipse cx="110" cy="46" rx="50" ry="12" fill="#8A6A3C"/><ellipse cx="110" cy="38" rx="24" ry="14" fill="#6F522B"/>`,
      () => `<path d="M86 66 Q84 28 112 28 Q140 30 136 62 Q134 44 112 42 Q96 44 86 66Z" fill="${BLK}"/>` +
            `<path d="M130 40 Q158 40 162 66 Q146 56 130 52Z" fill="${BLK}"/>`
    ];

    const TOP_SVG = [
      () => sleeve(92, 30, '#6F5A3A') + body('#7A6240', 270, 10) +
        `<path d="M98 94 L124 176" stroke="#EADFC0" stroke-width="4" fill="none"/><path d="M122 94 L99 150" stroke="#EADFC0" stroke-width="2.5" fill="none" opacity=".7"/>` +
        `<rect x="77" y="170" width="66" height="8" fill="#B3261E"/>`,
      () => sleeve(84, 22, '#4F321F') + body('#5A3A26', 262, 9) +
        `<path d="M110 176 L126 262 L94 262Z" fill="#7B5236"/><path d="M110 100 L128 132 L110 172 L92 132Z" fill="#B3261E"/>` +
        `<path d="M102 98 L110 106 L118 98" stroke="#7a1814" stroke-width="2" fill="none"/>` +
        `<path d="M110 182 L103 206 M110 182 L117 206" stroke="#D8A23A" stroke-width="3" fill="none"/><circle cx="110" cy="178" r="5" fill="#D8A23A"/>`,
      () => sleeve(86, 26, '#17234A') + body('#1D2C57', 300, 14) + dots(300, 14, '#C9A23F') +
        `<rect x="100" y="93" width="20" height="9" rx="3" fill="#C9A23F"/><path d="M110 102 L121 120 L129 200" stroke="#C9A23F" stroke-width="1.6" fill="none"/>`,
      () => sleeve(86, 44, '#C98F1C') + body('#E0A92A', 310, 16) +
        `<rect x="62" y="298" width="96" height="10" fill="#1F4E8A"/>` +
        `<path d="M84 96 Q110 128 136 96 L136 108 Q110 142 84 108Z" fill="#B3261E"/>` +
        `<circle cx="110" cy="152" r="17" fill="#B3261E" stroke="#F7E3A1" stroke-width="2"/>` +
        `<path d="M101 152 Q110 138 119 152 Q110 166 101 152" stroke="#F7E3A1" stroke-width="1.8" fill="none"/>`,
      () => sleeve(80, 14, '#100c0a') + body('#17120f', 196, 4) +
        `<path d="M96 96 Q110 122 124 96 L128 110 Q110 136 92 110Z" fill="#E8E2D2"/>` +
        [118, 136, 154, 172].map(y => `<circle cx="110" cy="${y + 10}" r="2.6" fill="#C9A23F"/>`).join(''),
      () => sleeve(92, 14, '#D98EA2') + body('#E9A9B8', 200, 0) +
        `<path d="M86 196 L109 196 L107 378 L70 378 Z" fill="#E9A9B8"/><path d="M111 196 L134 196 L150 378 L113 378 Z" fill="#E39FB0"/>` +
        `<rect x="100" y="92" width="20" height="8" rx="3" fill="#D98EA2"/>` +
        [[92, 250], [96, 318], [128, 282], [134, 340], [122, 220]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#fff" opacity=".75"/>`).join('')
    ];

    const BOTTOM_SVG = [
      () => pants('#F2EEE4', 8, '#cfc8b5'),
      () => skirt('#1c1713'),
      () => pants('#D9A62B', 10, '#b88618'),
      () => pants('#223056', 4, '#1a2644')
    ];

    const ACC_SVG = [
      () => '',
      () => `<g transform="translate(180 262)"><path d="M0 40 L-34 -4 A48 48 0 0 1 34 -4 Z" fill="#EBD9A8" stroke="#8A6A3C" stroke-width="2"/><path d="M0 40 L-20 -12 M0 40 L0 -16 M0 40 L20 -12" stroke="#8A6A3C" stroke-width="1.4"/></g>`,
      () => `<g transform="translate(180 270)"><path d="M-34 24 Q0 -34 34 24 Q0 32 -34 24Z" fill="#E6CF98" stroke="#9A7B45" stroke-width="2"/><path d="M-20 12 Q0 22 20 12 M-10 -2 Q0 6 10 -2" stroke="#9A7B45" fill="none"/></g>`,
      () => `<g transform="translate(182 258)"><line x1="0" y1="-32" x2="0" y2="-21" stroke="#6b4a2b" stroke-width="2"/><rect x="-8" y="-22" width="16" height="5" fill="#C9A23F"/>` +
            `<ellipse cx="0" cy="0" rx="17" ry="20" fill="#C0301F"/><path d="M-10 -17 Q-5 0 -10 17 M10 -17 Q5 0 10 17" stroke="#F2B0A0" fill="none" opacity=".6"/>` +
            `<rect x="-8" y="18" width="16" height="5" fill="#C9A23F"/><path d="M0 23 L0 40" stroke="#C9A23F" stroke-width="2"/></g>`
    ];

    const figure = c =>
      `<svg viewBox="-10 0 240 440" role="img" aria-label="Người mẫu mặc bộ đã chọn">` +
      `<ellipse cx="110" cy="412" rx="58" ry="7" fill="#000" opacity=".12"/>` +
      `<ellipse cx="97" cy="408" rx="12" ry="5" fill="${BLK}"/><ellipse cx="123" cy="408" rx="12" ry="5" fill="${BLK}"/>` +
      BOTTOM_SVG[c.bottom]() +
      `<rect x="103" y="78" width="14" height="24" fill="${SK}"/>` +
      TOP_SVG[c.top]() +
      `<circle cx="110" cy="62" r="20" fill="${SK}"/>` +
      HEAD_SVG[c.head]() +
      ACC_SVG[c.acc]() +
      `</svg>`;

    /* ================= DATA ================= */
    const CATS = [
      { k: 'head', label: 'Đội đầu', items: [
        ['Để trần', 'Tóc búi gọn'], ['Mũ cánh chuồn', 'Mũ quan triều Nguyễn'], ['Khăn xếp', 'Khăn của nam giới'],
        ['Nón quai thao', 'Nón của phụ nữ Bắc Bộ'], ['Khăn mỏ quạ', 'Khăn vấn Bắc Bộ'] ] },
      { k: 'top', label: 'Áo', items: [
        ['Áo giao lĩnh', 'Lý – Trần – Lê'], ['Áo tứ thân', 'Kinh Bắc'], ['Áo ngũ thân', 'Triều Nguyễn'],
        ['Áo Nhật Bình', 'Cung đình Nguyễn'], ['Áo bà ba', 'Nam Bộ'], ['Áo dài cách tân', 'Đương đại'] ] },
      { k: 'bottom', label: 'Quần hoặc váy', items: [
        ['Quần lụa trắng', 'Mặc hằng ngày'], ['Váy đụp đen', 'Phụ nữ Bắc Bộ'], ['Quần vàng', 'Hoàng gia'], ['Quần chàm', 'Nhuộm chàm'] ] },
      { k: 'acc', label: 'Phụ kiện', items: [
        ['Tay không', 'Không phụ kiện'], ['Quạt nan', 'Hội làng'], ['Nón lá', 'Khắp ba miền'], ['Đèn lồng', 'Phố cổ ban đêm'] ] }
    ];

    const ERAS = [
      { vt: 'Thế kỷ 11 – 18', place: 'Lý – Trần – Lê', name: 'Áo giao lĩnh',
        desc: 'Hai vạt áo bắt chéo trước ngực, thắt lại bằng dải lụa. Dáng áo giản dị mà trang nghiêm, còn thấy trong tranh, tượng và phù điêu cổ.',
        combo: { head: 0, top: 0, bottom: 1, acc: 0 }, bg: '#A9C9B6', ink: '#16261E', arch: '#E3EFE7', sun: '#6E9C86' },
      { vt: 'Thế kỷ 12 – 20', place: 'Kinh Bắc', name: 'Áo tứ thân',
        desc: 'Bốn mảnh vải ghép thành hai vạt trước, hai vạt sau, buộc nút ở bụng, bên trong là yếm đỏ. Gắn với hội làng và làn điệu quan họ.',
        combo: { head: 4, top: 1, bottom: 1, acc: 1 }, bg: '#7B4A32', ink: '#F6ECDA', arch: '#EBD9C2', sun: '#B3402A' },
      { vt: '1802 – 1945', place: 'Cung đình triều Nguyễn', name: 'Áo Nhật Bình',
        desc: 'Trang phục lễ của hoàng gia, nổi bật với phần cổ áo bản rộng thêu hoa văn và sắc vàng dành riêng cho cung đình.',
        combo: { head: 1, top: 3, bottom: 2, acc: 0 }, bg: '#E2B13A', ink: '#3A1608', arch: '#FBEFC9', sun: '#C0301F' },
      { vt: 'Thế kỷ 19 đến nay', place: 'Nam Bộ', name: 'Áo bà ba',
        desc: 'Áo ngắn, tay hẹp, cài khuy giữa, hợp khí hậu sông nước. Thường đi cùng khăn rằn và nón lá.',
        combo: { head: 0, top: 4, bottom: 3, acc: 2 }, bg: '#2F5A55', ink: '#F6ECDA', arch: '#DDEBE6', sun: '#E4B94A' },
      { vt: 'Thế kỷ 21', place: 'Đương đại', name: 'Áo dài cách tân',
        desc: 'Giữ dáng áo dài, đổi chất liệu, màu sắc và đường cắt để mặc đi cà phê, đi làm, chụp ảnh phố.',
        combo: { head: 0, top: 5, bottom: 0, acc: 3 }, bg: '#F1C4CD', ink: '#4A1830', arch: '#FBE6EA', sun: '#E58AA0' }
    ];
    const WEATHER = { head: 2, top: 2, bottom: 3, acc: 1 };
    const PAL = ['#DCE8E0', ...ERAS.map(e => e.bg), '#8E1F1A'];
    const LABELS = ['Phối đồ', 'Giao lĩnh', 'Tứ thân', 'Nhật Bình', 'Bà ba', 'Cách tân', 'Của bạn'];
    const N = PAL.length;

    /* ================= BUILD DOM ================= */
    const itemName = (c, k) => CATS.find(x => x.k === k).items[c[k]][0];

    const finalPanel = $('#finalPanel');
    // Clear out any previously injected era panels if re-running effect
    $$('.era').forEach(el => el.remove());
    
    ERAS.forEach((e, i) => {
      const gom = ['head', 'top', 'bottom', 'acc'].filter(k => e.combo[k] !== 0 || k === 'top').map(k => itemName(e.combo, k).toLowerCase()).join(', ');
      const s = document.createElement('section');
      s.className = 'panel era' + (i % 2 ? ' flip' : '');
      s.style.cssText = `--pbg:${e.bg};--pink:${e.ink}`;
      s.innerHTML = `
        <div class="era-in">
          <div class="vt">${e.vt}</div>
          <figure class="arch-wrap"><div class="arch" style="--arch:${e.arch};--sun:${e.sun}"><div class="fig">${figure(e.combo)}</div></div></figure>
          <div class="era-text">
            <p class="where">${e.place}</p>
            <h2>${e.name}</h2>
            <p>${e.desc}</p>
            <p class="gom">Gồm ${gom}.</p>
            <button class="btn" type="button" data-try="${i}">Mặc thử bộ này</button>
          </div>
        </div>`;
      finalPanel.before(s);
    });

    const lockSvg = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="1.5"/>
      <path class="lk-open" d="M8 11V8a4 4 0 0 1 7.6-1.7"/><path class="lk-closed" d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`;

    $('#rows').innerHTML = CATS.map(c => `
      <div class="row" data-cat="${c.k}">
        <span class="lbl">${c.label}</span>
        <button class="step" type="button" data-d="-1" aria-label="${c.label}: món trước">‹</button>
        <div class="win"><ul class="reel">${c.items.map(it => `<li><strong>${it[0]}</strong><small>${it[1]}</small></li>`).join('')}</ul></div>
        <button class="step" type="button" data-d="1" aria-label="${c.label}: món sau">›</button>
        <button class="lock" type="button" aria-pressed="false" aria-label="Khoá ${c.label.toLowerCase()}">${lockSvg}</button>
      </div>`).join('');

    const tl = $('#tl');
    tl.innerHTML = '<div class="rail"></div><div class="mark" id="mark"></div>'; // Reset timeline contents
    LABELS.forEach((l, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.dataset.go = i; b.textContent = l; b.style.left = (i / (N - 1) * 100) + '%';
      tl.append(b);
    });

    /* ================= MIXER STATE ================= */
    const H = 52;
    const combo = { head: 0, top: 0, bottom: 0, acc: 0 };
    const shown = { ...combo };
    const locked = {};
    const reels = {};
    $$('.row').forEach(r => { reels[r.dataset.cat] = $('.reel', r); });
    const figs = [$('#fig'), $('#figFinal')];
    let token = 0;

    const render = () => {
      figs.forEach(f => { f.innerHTML = figure(shown); f.firstChild.classList.add('pop'); });
      const top = CATS[1].items[shown.top][0], bot = CATS[2].items[shown.bottom][0].toLowerCase();
      $('#plaque').textContent = `${top} với ${bot}`;
      $('#finalList').innerHTML = CATS.map(c => `<li><span>${c.label}</span><span>${c.items[shown[c.k]][0]}</span></li>`).join('');
    };

    const moveReel = (k, idx, dur) => {
      const el = reels[k];
      el.style.transition = dur ? `transform ${dur}ms cubic-bezier(.17,.8,.2,1)` : 'none';
      el.style.transform = `translateY(${-idx * H}px)`;
    };

    const apply = (target, { animate = true, respectLocks = false } = {}) => {
      const my = ++token;
      Object.assign(shown, combo);
      CATS.forEach((c, i) => {
        if (respectLocks && locked[c.k]) return;
        const idx = target[c.k];
        combo[c.k] = idx;
        const dur = animate && !REDUCED ? 700 + i * 260 : 0;
        moveReel(c.k, idx, dur);
        const done = () => { if (my !== token) return; shown[c.k] = idx; render(); };
        dur ? setTimeout(done, dur) : done();
      });
      if (!animate || REDUCED) { Object.assign(shown, combo); render(); }
    };

    const rowsHandler = e => {
      const row = e.target.closest('.row'); if (!row) return;
      const k = row.dataset.cat, n = CATS.find(c => c.k === k).items.length;
      const step = e.target.closest('.step');
      if (step) {
        const idx = (combo[k] + (+step.dataset.d) + n) % n;
        combo[k] = shown[k] = idx;
        moveReel(k, idx, REDUCED ? 0 : 380);
        render();
        return;
      }
      const lock = e.target.closest('.lock');
      if (lock) {
        locked[k] = !locked[k];
        lock.setAttribute('aria-pressed', locked[k]);
      }
    };
    $('#rows').addEventListener('click', rowsHandler);

    const spinHandler = () => {
      const t = { ...combo };
      CATS.forEach(c => {
        if (locked[c.k]) return;
        let r; do { r = Math.floor(Math.random() * c.items.length); } while (r === combo[c.k]);
        t[c.k] = r;
      });
      apply(t, { respectLocks: true });
    };
    $('#spin').addEventListener('click', spinHandler);

    const weatherHandler = () => apply(WEATHER);
    $('#weather').addEventListener('click', weatherHandler);

    /* ================= SCROLL ENGINE ================= */
    const stage = $('#stage'), track = $('#track'), mark = $('#mark');
    const panels = $$('.panel');
    let isH = false, vw = window.innerWidth, cur = 0, lastOn = -1;
    let rAF;

    const layout = () => {
      vw = window.innerWidth; // use window innerWidth since this occupies full screen
      isH = vw >= 900 && window.innerHeight >= 520;
      container.classList.toggle('h', isH);
      container.classList.toggle('v', !isH);
      container.style.setProperty('--vw', vw + 'px');
      if (isH) {
        stage.style.height = ((N - 1) * vw + window.innerHeight) + 'px';
      } else {
        stage.style.height = 'auto';
        track.style.transform = '';
        container.style.removeProperty('--bg'); container.style.removeProperty('--ink');
        panels.forEach(p => p.style.removeProperty('--o'));
      }
    };

    const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
    const lum = ([r, g, b]) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    const frame = () => {
      if (isH) {
        const r = stage.getBoundingClientRect();
        const span = stage.offsetHeight - window.innerHeight;
        const p = Math.min(1, Math.max(0, span > 0 ? -r.top / span : 0));
        cur = REDUCED ? p : cur + (p - cur) * 0.14;
        if (Math.abs(p - cur) < 0.0004) cur = p;

        const x = cur * (N - 1) * vw;
        track.style.transform = `translate3d(${-x}px,0,0)`;

        const f = cur * (N - 1), i0 = Math.min(N - 2, Math.floor(f)), t = f - i0;
        const a = hex(PAL[i0]), b = hex(PAL[i0 + 1]);
        const m = a.map((v, i) => Math.round(v + (b[i] - v) * t));
        container.style.setProperty('--bg', `rgb(${m})`);
        container.style.setProperty('--ink', lum(m) > 0.52 ? '#16261E' : '#F6ECDA');

        if (!REDUCED) {
           // We need to re-query panels in case they were regenerated
           const dynamicPanels = [...container.querySelectorAll('.panel')];
           dynamicPanels.forEach((pn, i) => pn.style.setProperty('--o', ((i * vw - x) / vw).toFixed(3)));
        }

        mark.style.left = (cur * 100) + '%';
        const on = Math.round(f);
        if (on !== lastOn) { lastOn = on; $$('button', tl).forEach((bt, i) => bt.classList.toggle('on', i === on)); }
      }
      rAF = requestAnimationFrame(frame);
    };

    const goTo = i => {
      const dynamicPanels = [...container.querySelectorAll('.panel')];
      const top = isH
        ? stage.getBoundingClientRect().top + window.scrollY + (i / (N - 1)) * (stage.offsetHeight - window.innerHeight)
        : dynamicPanels[i].getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top, behavior: REDUCED ? 'auto' : 'smooth' });
    };

    const clickHandler = e => {
      const go = e.target.closest('[data-go]');
      if (go) { 
        e.preventDefault(); 
        const goTarget = go.dataset.go;
        
        // Handle navigation outside of prototype
        if (goTarget === '0') {
            goTo(0);
        } else if (goTarget === '1') {
            onNavigate('explore');
        } else if (goTarget === '3') {
            onNavigate('compare');
        } else if (goTarget === '5') {
            onNavigate('lookbook');
        } else if (goTarget === '6') {
            onNavigate('tips');
        } else {
            goTo(+goTarget); 
        }
        return; 
      }
      const tr = e.target.closest('[data-try]');
      if (tr) {
        goTo(0);
        setTimeout(() => apply(ERAS[+tr.dataset.try].combo), REDUCED ? 0 : 900);
      }
    };
    container.addEventListener('click', clickHandler);

    window.addEventListener('resize', layout);
    layout();
    render();
    rAF = requestAnimationFrame(frame);

    // một khoảnh khắc mở màn: các cột quay rồi dừng ở bộ tứ thân
    const initTimer = setTimeout(() => apply(ERAS[1].combo, { animate: !REDUCED }), REDUCED ? 0 : 500);

    return () => {
      cancelAnimationFrame(rAF);
      window.removeEventListener('resize', layout);
      container.removeEventListener('click', clickHandler);
      $('#rows').removeEventListener('click', rowsHandler);
      $('#spin').removeEventListener('click', spinHandler);
      $('#weather').removeEventListener('click', weatherHandler);
      clearTimeout(initTimer);
    };
  }, [onNavigate]);

  return (
    <div className="home-horizontal-container" ref={containerRef}>
      <header className="top">
        <a className="logo" href="#" data-go="0">Việt Phục Remix</a>
        <nav aria-label="Điều hướng chính">
          <a data-go="0">Phối đồ</a>
          <a data-go="1">Bảo tàng số</a>
          <a data-go="3">So sánh</a>
          <a data-go="5">Lookbook</a>
          <a data-go="6">Tips lên đồ</a>
        </nav>
      </header>

      <main className="stage" id="stage">
        <div className="sticky">
          <div className="track" id="track">

            {/* 0. HERO = bàn phối đồ */}
            <section className="panel hero-panel" style={{ '--pbg': '#DCE8E0', '--pink': '#16261E' }} aria-label="Bàn phối đồ">
              <div className="hero">
                <div className="hero-text">
                  <button className="chip" id="weather" type="button"><b>Hà Nội 15°C</b><span>Mặc ấm bằng bộ ngũ thân</span></button>
                  <h1>Mặc Việt, phối theo cách của bạn</h1>
                  <p className="lede">Phối trang phục truyền thống theo sự kiện, vùng miền hoặc phong cách Gen Z. Chọn từng món bên phải, hoặc quay ngẫu nhiên.</p>
                  <p className="hint"><i></i>Cuộn xuống để đi qua mười thế kỷ trang phục</p>
                </div>

                <div className="spine" aria-hidden="true">
                  <span className="vt">Di sản mặc lên người trẻ</span>
                  <span className="seal">Việt<br />Phục</span>
                </div>

                <figure className="arch-wrap">
                  <div className="arch" style={{ '--arch': '#F3EDDF', '--sun': '#C0301F' }}><div className="fig" id="fig"></div></div>
                  <figcaption className="plaque" id="plaque" aria-live="polite"></figcaption>
                </figure>

                <div className="mixer" id="mixer">
                  <div id="rows"></div>
                  <div className="actions"><button className="btn" id="spin" type="button">Quay ngẫu nhiên</button></div>
                </div>
              </div>
            </section>

            {/* 1-5 era panels injected here by script */}

            {/* 6. FINAL */}
            <section className="panel final" id="finalPanel" style={{ '--pbg': '#8E1F1A', '--pink': '#F6ECDA' }}>
              <div className="era-in">
                <figure className="arch-wrap">
                  <div className="arch" style={{ '--arch': '#F3EDDF', '--sun': '#F0B84A' }}><div className="fig" id="figFinal"></div></div>
                </figure>
                <div className="final-text">
                  <h2>Bộ nào là của bạn?</h2>
                  <p>Đây là bộ bạn đang mặc ở bàn phối đồ. Quay lại để đổi từng món, khoá món ưng ý và quay tiếp những món còn lại.</p>
                  <ul className="final-list" id="finalList"></ul>
                  <button className="btn" type="button" data-go="0">Về bàn phối đồ</button>
                </div>
              </div>
            </section>

          </div>
        </div>

        <nav className="tl" id="tl" aria-label="Dòng thời gian">
          {/* Timeline points injected here by script */}
        </nav>
      </main>
    </div>
  );
}
