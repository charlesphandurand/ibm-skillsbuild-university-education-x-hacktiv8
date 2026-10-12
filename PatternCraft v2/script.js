/* ============================================================
   PatternCraft Studio v2 — script.js  (revised)
   Fixes: live preview, browser back/F5, 50 unique patterns
   Vanilla ES6+ | Zero dependencies
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════════════════════
   1. PATTERN DATABASE  — 50 visually distinct patterns
   params = { zoom, stroke, x, y, spacing, angle, bg, fg, accent }
   tile(p)  → inner SVG markup string (no outer <svg> tag)
   tileW/H  → tile pixel dimensions at current params
══════════════════════════════════════════════════════════ */

const PATTERNS = [

  /* ─── GEOMETRIC ───────────────────────────────────── */

  {
    id: 'polka-dot', title: 'Polka Dot', category: 'Geometric',
    keywords: ['circle','dot','round','spots'],
    defaults: { zoom:100, stroke:0, x:0, y:0, spacing:0, angle:0, bg:'#111827', fg:'#F5C518', accent:'#E63946' },
    tileW: p => (24+p.spacing)*p.zoom/100,
    tileH: p => (24+p.spacing)*p.zoom/100,
    tile(p) {
      const sp=(24+p.spacing)*p.zoom/100, r=6*p.zoom/100;
      return `<circle cx="${sp/2+p.x}" cy="${sp/2+p.y}" r="${r}" fill="${p.fg}"/>`;
    },
  },

  {
    id: 'hexagons', title: 'Honeycomb', category: 'Geometric',
    keywords: ['hex','honeycomb','beehive','hexagon'],
    defaults: { zoom:100, stroke:1.5, x:0, y:0, spacing:2, angle:0, bg:'#0f172a', fg:'#06B6D4', accent:'#F5C518' },
    tileW: p => 3*(14+p.spacing*0.3)*p.zoom/100,
    tileH: p => Math.sqrt(3)*(14+p.spacing*0.3)*p.zoom/100*2,
    tile(p) {
      const r=(14+p.spacing*0.3)*p.zoom/100, sw=p.stroke, h=Math.sqrt(3)*r;
      const hex=(cx,cy)=>Array.from({length:6},(_,i)=>{const a=Math.PI/180*(60*i-30);return`${(cx+r*Math.cos(a)).toFixed(2)},${(cy+r*Math.sin(a)).toFixed(2)}`;}).join(' ');
      return `<polygon points="${hex(r*1.5+p.x,h/2+p.y)}" fill="none" stroke="${p.fg}" stroke-width="${sw}"/>
              <polygon points="${hex(r*1.5+p.x,h*1.5+p.y)}" fill="none" stroke="${p.fg}" stroke-width="${sw}"/>
              <polygon points="${hex(0+p.x,h+p.y)}" fill="none" stroke="${p.fg}" stroke-width="${sw}"/>
              <polygon points="${hex(r*3+p.x,h+p.y)}" fill="none" stroke="${p.fg}" stroke-width="${sw}"/>`;
    },
  },

  {
    id: 'checkerboard', title: 'Checkerboard', category: 'Geometric',
    keywords: ['chess','checker','square','tile'],
    defaults: { zoom:100, stroke:0, x:0, y:0, spacing:0, angle:0, bg:'#1a1a2e', fg:'#e2e8f0', accent:'#E63946' },
    tileW: p => (20+p.spacing)*p.zoom/100*2,
    tileH: p => (20+p.spacing)*p.zoom/100*2,
    tile(p) {
      const sz=(20+p.spacing*0.5)*p.zoom/100, ox=p.x, oy=p.y;
      return `<rect x="${ox}" y="${oy}" width="${sz}" height="${sz}" fill="${p.fg}" opacity="0.6"/>
              <rect x="${sz+ox}" y="${sz+oy}" width="${sz}" height="${sz}" fill="${p.fg}" opacity="0.6"/>`;
    },
  },

  {
    id: 'argyle', title: 'Argyle', category: 'Geometric',
    keywords: ['argyle','diamond','plaid','classic'],
    defaults: { zoom:100, stroke:1, x:0, y:0, spacing:0, angle:0, bg:'#1e1b4b', fg:'#818cf8', accent:'#F5C518' },
    tileW: p => (40+p.spacing)*p.zoom/100,
    tileH: p => (30+p.spacing)*p.zoom/100,
    tile(p) {
      const w=(40+p.spacing)*p.zoom/100, h=(30+p.spacing)*p.zoom/100, sw=p.stroke, hw=w/2, hh=h/2, ox=p.x, oy=p.y;
      return `<polygon points="${hw+ox},${oy} ${w+ox},${hh+oy} ${hw+ox},${h+oy} ${ox},${hh+oy}" fill="${p.fg}" opacity="0.15"/>
              <polygon points="${hw+ox},${oy} ${w+ox},${hh+oy} ${hw+ox},${h+oy} ${ox},${hh+oy}" fill="none" stroke="${p.fg}" stroke-width="${sw}" opacity="0.7"/>
              <line x1="${hw+ox}" y1="${oy}" x2="${hw+ox}" y2="${h+oy}" stroke="${p.accent}" stroke-width="${sw*0.5}" stroke-dasharray="${3*p.zoom/100} ${3*p.zoom/100}" opacity="0.4"/>
              <line x1="${ox}" y1="${hh+oy}" x2="${w+ox}" y2="${hh+oy}" stroke="${p.accent}" stroke-width="${sw*0.5}" stroke-dasharray="${3*p.zoom/100} ${3*p.zoom/100}" opacity="0.4"/>`;
    },
  },

  {
    id: 'triangles', title: 'Triangle Mosaic', category: 'Geometric',
    keywords: ['triangle','geometric','delta','mosaic'],
    defaults: { zoom:100, stroke:1, x:0, y:0, spacing:0, angle:0, bg:'#0f172a', fg:'#a78bfa', accent:'#F5C518' },
    tileW: p => (40+p.spacing)*p.zoom/100,
    tileH: p => (35+p.spacing)*p.zoom/100,
    tile(p) {
      const w=(40+p.spacing)*p.zoom/100, h=(35+p.spacing)*p.zoom/100, sw=p.stroke, hw=w/2, ox=p.x, oy=p.y;
      return `<polygon points="${ox},${oy} ${w+ox},${oy} ${hw+ox},${h+oy}" fill="${p.fg}" opacity="0.18"/>
              <polygon points="${ox},${oy} ${w+ox},${oy} ${hw+ox},${h+oy}" fill="none" stroke="${p.fg}" stroke-width="${sw}" opacity="0.7"/>
              <polygon points="${ox},${h+oy} ${hw+ox},${oy} ${hw+ox},${h+oy}" fill="${p.accent}" opacity="0.12"/>
              <polygon points="${ox},${h+oy} ${hw+ox},${oy} ${hw+ox},${h+oy}" fill="none" stroke="${p.accent}" stroke-width="${sw}" opacity="0.5"/>`;
    },
  },

  {
    id: 'octagon-tile', title: 'Octagon + Square', category: 'Geometric',
    keywords: ['octagon','eight','tile','stop','square'],
    defaults: { zoom:100, stroke:1.5, x:0, y:0, spacing:0, angle:0, bg:'#0f172a', fg:'#22d3ee', accent:'#F5C518' },
    tileW: p => (34+p.spacing)*p.zoom/100,
    tileH: p => (34+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(34+p.spacing)*p.zoom/100, t=sz*0.27, sw=p.stroke, ox=p.x, oy=p.y;
      return `<polygon points="${t+ox},${oy} ${sz-t+ox},${oy} ${sz+ox},${t+oy} ${sz+ox},${sz-t+oy} ${sz-t+ox},${sz+oy} ${t+ox},${sz+oy} ${ox},${sz-t+oy} ${ox},${t+oy}" fill="none" stroke="${p.fg}" stroke-width="${sw}" opacity="0.8"/>
              <rect x="${sz+ox}" y="${sz+oy}" width="${t*1.2}" height="${t*1.2}" fill="none" stroke="${p.accent}" stroke-width="${sw*0.7}" opacity="0.5"/>`;
    },
  },

  {
    id: 'crosshatch', title: 'Crosshatch', category: 'Geometric',
    keywords: ['cross','hatch','weave','diagonal','grid'],
    defaults: { zoom:100, stroke:1, x:0, y:0, spacing:0, angle:0, bg:'#111827', fg:'#94a3b8', accent:'#F5C518' },
    tileW: p => (20+p.spacing)*p.zoom/100,
    tileH: p => (20+p.spacing)*p.zoom/100,
    tile(p) {
      const sp=(20+p.spacing)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y;
      return `<line x1="${ox}" y1="${oy}" x2="${sp+ox}" y2="${sp+oy}" stroke="${p.fg}" stroke-width="${sw}" opacity="0.55"/>
              <line x1="${sp+ox}" y1="${oy}" x2="${ox}" y2="${sp+oy}" stroke="${p.fg}" stroke-width="${sw}" opacity="0.55"/>`;
    },
  },

  {
    id: 'moroccan', title: 'Moroccan Star', category: 'Geometric',
    keywords: ['moroccan','morocco','tile','ornament','islamic','star'],
    defaults: { zoom:100, stroke:1.2, x:0, y:0, spacing:0, angle:0, bg:'#1a0a2e', fg:'#c084fc', accent:'#F5C518' },
    tileW: p => (44+p.spacing)*p.zoom/100,
    tileH: p => (44+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(44+p.spacing)*p.zoom/100, cx=sz/2+p.x, cy=sz/2+p.y, sw=p.stroke;
      const pts12=Array.from({length:12},(_,i)=>{const a=(i/12)*Math.PI*2-Math.PI/12, r=i%2===0?sz*0.44:sz*0.26; return`${(cx+r*Math.cos(a)).toFixed(2)},${(cy+r*Math.sin(a)).toFixed(2)}`;}).join(' ');
      const pts6=Array.from({length:6},(_,i)=>{const a=(i/6)*Math.PI*2; return`${(cx+sz*0.18*Math.cos(a)).toFixed(2)},${(cy+sz*0.18*Math.sin(a)).toFixed(2)}`;}).join(' ');
      return `<polygon points="${pts12}" fill="${p.fg}" opacity="0.1"/>
              <polygon points="${pts12}" fill="none" stroke="${p.fg}" stroke-width="${sw}" opacity="0.75"/>
              <polygon points="${pts6}" fill="${p.accent}" opacity="0.35"/>`;
    },
  },

  {
    id: 'scallop', title: 'Fish Scales', category: 'Geometric',
    keywords: ['scallop','fish','scale','tile','arc'],
    defaults: { zoom:100, stroke:1.5, x:0, y:0, spacing:0, angle:0, bg:'#0c1a2e', fg:'#38bdf8', accent:'#F5C518' },
    tileW: p => (30+p.spacing)*p.zoom/100,
    tileH: p => (22+p.spacing*0.5)*p.zoom/100,
    tile(p) {
      const rw=(15+p.spacing*0.5)*p.zoom/100, rh=(11+p.spacing*0.25)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y;
      return `<path d="M${-rw+ox},${rh+oy} A${rw},${rh} 0 0,1 ${rw+ox},${rh+oy}" fill="none" stroke="${p.fg}" stroke-width="${sw}" opacity="0.7"/>
              <path d="M${rw+ox},${rh+oy} A${rw},${rh} 0 0,1 ${rw*3+ox},${rh+oy}" fill="none" stroke="${p.fg}" stroke-width="${sw}" opacity="0.7"/>
              <path d="M${0+ox},${rh*2+oy} A${rw},${rh} 0 0,1 ${rw*2+ox},${rh*2+oy}" fill="none" stroke="${p.fg}" stroke-width="${sw}" opacity="0.5"/>`;
    },
  },

  {
    id: 'brick', title: 'Brick Wall', category: 'Geometric',
    keywords: ['brick','wall','masonry'],
    defaults: { zoom:100, stroke:1, x:0, y:0, spacing:0, angle:0, bg:'#1c1210', fg:'#b45309', accent:'#F5C518' },
    tileW: p => (60+p.spacing)*p.zoom/100,
    tileH: p => (28+p.spacing*0.5)*p.zoom/100,
    tile(p) {
      const bw=(30+p.spacing*0.5)*p.zoom/100, bh=(14+p.spacing*0.25)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y;
      return `<rect x="${ox}" y="${oy}" width="${bw*2}" height="${bh}" fill="${p.fg}" opacity="0.12"/>
              <line x1="${ox}" y1="${oy}" x2="${bw*2+ox}" y2="${oy}" stroke="${p.fg}" stroke-width="${sw}" opacity="0.5"/>
              <line x1="${bw+ox}" y1="${oy}" x2="${bw+ox}" y2="${bh+oy}" stroke="${p.fg}" stroke-width="${sw}" opacity="0.5"/>
              <line x1="${ox}" y1="${bh+oy}" x2="${bw*2+ox}" y2="${bh+oy}" stroke="${p.fg}" stroke-width="${sw}" opacity="0.5"/>
              <line x1="${bw/2+ox}" y1="${bh+oy}" x2="${bw/2+ox}" y2="${bh*2+oy}" stroke="${p.fg}" stroke-width="${sw}" opacity="0.5"/>
              <line x1="${bw*1.5+ox}" y1="${bh+oy}" x2="${bw*1.5+ox}" y2="${bh*2+oy}" stroke="${p.fg}" stroke-width="${sw}" opacity="0.5"/>`;
    },
  },

  /* ─── LINES ────────────────────────────────────────── */

  {
    id: 'diagonal-stripes', title: 'Diagonal Stripes', category: 'Lines',
    keywords: ['stripe','diagonal','slant'],
    defaults: { zoom:100, stroke:4, x:0, y:0, spacing:0, angle:0, bg:'#111827', fg:'#F5C518', accent:'#E63946' },
    tileW: p => (20+p.spacing)*p.zoom/100,
    tileH: p => (20+p.spacing)*p.zoom/100,
    tile(p) {
      const sp=(20+p.spacing)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y;
      return `<line x1="${ox}" y1="${sp+oy}" x2="${sp+ox}" y2="${oy}" stroke="${p.fg}" stroke-width="${sw}" opacity="0.75"/>`;
    },
  },

  {
    id: 'zigzag', title: 'Zigzag', category: 'Lines',
    keywords: ['zigzag','zig','zag','lightning'],
    defaults: { zoom:100, stroke:2, x:0, y:0, spacing:0, angle:0, bg:'#111827', fg:'#F5C518', accent:'#E63946' },
    tileW: p => (40+p.spacing)*p.zoom/100,
    tileH: p => (14+p.spacing*0.5)*p.zoom/100,
    tile(p) {
      const w=(40+p.spacing)*p.zoom/100, h=(14+p.spacing*0.5)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y;
      return `<polyline points="${ox},${h+oy} ${w/4+ox},${oy} ${w/2+ox},${h+oy} ${w*0.75+ox},${oy} ${w+ox},${h+oy}" fill="none" stroke="${p.fg}" stroke-width="${sw}" stroke-linejoin="round" opacity="0.85"/>`;
    },
  },

  {
    id: 'chevron', title: 'Chevron', category: 'Lines',
    keywords: ['chevron','arrow','herringbone'],
    defaults: { zoom:100, stroke:2.5, x:0, y:0, spacing:0, angle:0, bg:'#111827', fg:'#06B6D4', accent:'#F5C518' },
    tileW: p => (40+p.spacing)*p.zoom/100,
    tileH: p => (20+p.spacing)*p.zoom/100,
    tile(p) {
      const w=(40+p.spacing)*p.zoom/100, h=(20+p.spacing)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y;
      return `<polyline points="${ox},${h/2+oy} ${w/2+ox},${oy} ${w+ox},${h/2+oy}" fill="none" stroke="${p.fg}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
              <polyline points="${ox},${h+oy} ${w/2+ox},${h/2+oy} ${w+ox},${h+oy}" fill="none" stroke="${p.fg}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" opacity="0.45"/>`;
    },
  },

  {
    id: 'dotted-lines', title: 'Dotted Lines', category: 'Lines',
    keywords: ['dotted','dashed','stipple'],
    defaults: { zoom:100, stroke:2, x:0, y:0, spacing:0, angle:0, bg:'#0f172a', fg:'#94a3b8', accent:'#F5C518' },
    tileW: p => (40+p.spacing)*p.zoom/100,
    tileH: p => (14+p.spacing)*p.zoom/100,
    tile(p) {
      const w=(40+p.spacing)*p.zoom/100, h=(14+p.spacing)*p.zoom/100, sw=p.stroke, d=4*p.zoom/100, ox=p.x, oy=p.y;
      return `<line x1="${ox}" y1="${h/2+oy}" x2="${w+ox}" y2="${h/2+oy}" stroke="${p.fg}" stroke-width="${sw}" stroke-dasharray="${d} ${d}" opacity="0.7"/>`;
    },
  },

  {
    id: 'double-stripe', title: 'Double Stripe', category: 'Lines',
    keywords: ['double','stripe','diagonal','parallel'],
    defaults: { zoom:100, stroke:2.5, x:0, y:0, spacing:0, angle:0, bg:'#111827', fg:'#a78bfa', accent:'#F5C518' },
    tileW: p => (30+p.spacing)*p.zoom/100,
    tileH: p => (30+p.spacing)*p.zoom/100,
    tile(p) {
      const sp=(30+p.spacing)*p.zoom/100, sw=p.stroke, g=7*p.zoom/100, ox=p.x, oy=p.y;
      return `<line x1="${ox}" y1="${sp+oy}" x2="${sp+ox}" y2="${oy}" stroke="${p.fg}" stroke-width="${sw}" opacity="0.7"/>
              <line x1="${g+ox}" y1="${sp+oy}" x2="${sp+g+ox}" y2="${oy}" stroke="${p.accent}" stroke-width="${sw*0.5}" opacity="0.4"/>`;
    },
  },

  {
    id: 'cross-grid', title: 'Cross Grid', category: 'Lines',
    keywords: ['cross','plus','grid','hash'],
    defaults: { zoom:100, stroke:1, x:0, y:0, spacing:0, angle:0, bg:'#0f172a', fg:'#475569', accent:'#06B6D4' },
    tileW: p => (24+p.spacing)*p.zoom/100,
    tileH: p => (24+p.spacing)*p.zoom/100,
    tile(p) {
      const sp=(24+p.spacing)*p.zoom/100, sw=p.stroke, cx=sp/2+p.x, cy=sp/2+p.y;
      return `<line x1="${cx}" y1="${p.y}" x2="${cx}" y2="${sp+p.y}" stroke="${p.fg}" stroke-width="${sw}" opacity="0.45"/>
              <line x1="${p.x}" y1="${cy}" x2="${sp+p.x}" y2="${cy}" stroke="${p.fg}" stroke-width="${sw}" opacity="0.45"/>
              <circle cx="${cx}" cy="${cy}" r="${1.5*p.zoom/100}" fill="${p.accent}" opacity="0.7"/>`;
    },
  },

  {
    id: 'herringbone', title: 'Herringbone', category: 'Lines',
    keywords: ['herringbone','parquet','wood','floor'],
    defaults: { zoom:100, stroke:0, x:0, y:0, spacing:0, angle:0, bg:'#1c1210', fg:'#78350f', accent:'#a16207' },
    tileW: p => (40+p.spacing)*p.zoom/100,
    tileH: p => (40+p.spacing)*p.zoom/100,
    tile(p) {
      const u=(10+p.spacing*0.3)*p.zoom/100, ox=p.x, oy=p.y;
      return `<rect x="${ox}" y="${oy}" width="${u*2}" height="${u}" fill="${p.fg}" opacity="0.35"/>
              <rect x="${u*2+ox}" y="${u+oy}" width="${u}" height="${u*2}" fill="${p.accent}" opacity="0.35"/>
              <rect x="${ox}" y="${u*2+oy}" width="${u*2}" height="${u}" fill="${p.fg}" opacity="0.25"/>
              <rect x="${u+ox}" y="${u*3+oy}" width="${u}" height="${u}" fill="${p.accent}" opacity="0.2"/>`;
    },
  },

  {
    id: 'pinstripe', title: 'Pinstripe', category: 'Lines',
    keywords: ['pin','stripe','thin','suit','subtle'],
    defaults: { zoom:100, stroke:0.8, x:0, y:0, spacing:0, angle:0, bg:'#111827', fg:'#475569', accent:'#F5C518' },
    tileW: p => (10+p.spacing)*p.zoom/100,
    tileH: p => (10+p.spacing)*p.zoom/100,
    tile(p) {
      const sp=(10+p.spacing)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y;
      return `<line x1="${ox}" y1="${sp+oy}" x2="${sp+ox}" y2="${oy}" stroke="${p.fg}" stroke-width="${sw}" opacity="0.4"/>`;
    },
  },

  /* ─── ABSTRACT ─────────────────────────────────────── */

  {
    id: 'waves', title: 'Ocean Waves', category: 'Abstract',
    keywords: ['wave','sea','ocean','fluid'],
    defaults: { zoom:100, stroke:2, x:0, y:0, spacing:2, angle:0, bg:'#0c1a2e', fg:'#06B6D4', accent:'#38bdf8' },
    tileW: p => (60+p.spacing)*p.zoom/100,
    tileH: p => (22+p.spacing)*p.zoom/100,
    tile(p) {
      const w=(60+p.spacing)*p.zoom/100, h=(22+p.spacing)*p.zoom/100, sw=p.stroke, amp=5*p.zoom/100, ox=p.x, oy=p.y, cy=h/2+oy;
      return `<path d="M${ox} ${cy} Q${w/4+ox} ${cy-amp} ${w/2+ox} ${cy} T${w+ox} ${cy}" fill="none" stroke="${p.fg}" stroke-width="${sw}" opacity="0.9"/>
              <path d="M${ox} ${cy+amp*2.2} Q${w/4+ox} ${cy+amp*1.2} ${w/2+ox} ${cy+amp*2.2} T${w+ox} ${cy+amp*2.2}" fill="none" stroke="${p.accent}" stroke-width="${sw*0.6}" opacity="0.5"/>`;
    },
  },

  {
    id: 'waves-multicolor', title: 'Rainbow Waves', category: 'Abstract',
    keywords: ['wave','color','rainbow','multi'],
    defaults: { zoom:100, stroke:1.8, x:0, y:0, spacing:2, angle:0, bg:'#111114', fg:'#F5C518', accent:'#E63946' },
    tileW: p => (60+p.spacing)*p.zoom/100,
    tileH: p => (60+p.spacing)*p.zoom/100,
    tile(p) {
      const w=(60+p.spacing)*p.zoom/100, h=(60+p.spacing)*p.zoom/100, sw=p.stroke, amp=5*p.zoom/100, ox=p.x, oy=p.y;
      const colors=[p.fg,'#E63946','#06B6D4','#a78bfa',p.accent,'#34d399'];
      return colors.map((c,i)=>{const cy=((i+0.5)/colors.length)*h+oy; return `<path d="M${ox} ${cy} Q${w/4+ox} ${cy-amp} ${w/2+ox} ${cy} T${w+ox} ${cy}" fill="none" stroke="${c}" stroke-width="${sw}" opacity="0.9"/>`;}).join('');
    },
  },

  {
    id: 'halftone', title: 'Halftone', category: 'Abstract',
    keywords: ['halftone','print','dots','gradient'],
    defaults: { zoom:100, stroke:0, x:0, y:0, spacing:0, angle:0, bg:'#111827', fg:'#F5C518', accent:'#E63946' },
    tileW: p => (48+p.spacing)*p.zoom/100,
    tileH: p => (48+p.spacing)*p.zoom/100,
    tile(p) {
      const rows=4, cols=4, cs=(12+p.spacing*0.3)*p.zoom/100, ox=p.x, oy=p.y;
      let out='';
      for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){const maxR=cs*0.44, rad=maxR*((r*cols+c+1)/(rows*cols)); out+=`<circle cx="${c*cs+cs/2+ox}" cy="${r*cs+cs/2+oy}" r="${rad}" fill="${p.fg}" opacity="0.85"/>`;} return out;
    },
  },

  {
    id: 'memphis', title: 'Memphis Style', category: 'Abstract',
    keywords: ['memphis','retro','80s','postmodern'],
    defaults: { zoom:100, stroke:2, x:0, y:0, spacing:0, angle:0, bg:'#111114', fg:'#F5C518', accent:'#E63946' },
    tileW: p => (60+p.spacing)*p.zoom/100,
    tileH: p => (60+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(60+p.spacing)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y, z=p.zoom/100;
      return `<circle cx="${sz*0.2+ox}" cy="${sz*0.2+oy}" r="${5*z}" fill="${p.fg}" opacity="0.85"/>
              <line x1="${sz*0.5+ox}" y1="${oy}" x2="${sz*0.5+ox}" y2="${sz*0.38+oy}" stroke="${p.fg}" stroke-width="${sw}" opacity="0.8"/>
              <rect x="${sz*0.58+ox}" y="${sz*0.52+oy}" width="${13*z}" height="${13*z}" fill="none" stroke="${p.accent}" stroke-width="${sw}" opacity="0.7" transform="rotate(30 ${sz*0.645+ox} ${sz*0.585+oy})"/>
              <line x1="${sz*0.08+ox}" y1="${sz*0.62+oy}" x2="${sz*0.42+ox}" y2="${sz*0.88+oy}" stroke="${p.accent}" stroke-width="${sw}" opacity="0.7"/>
              <circle cx="${sz*0.82+ox}" cy="${sz*0.22+oy}" r="${3*z}" fill="${p.fg}" opacity="0.6"/>
              <line x1="${sz*0.72+ox}" y1="${sz*0.68+oy}" x2="${sz*0.88+ox}" y2="${sz*0.84+oy}" stroke="${p.fg}" stroke-width="${sw*1.6}" stroke-linecap="round" opacity="0.55"/>
              <polygon points="${sz*0.12+ox},${sz*0.48+oy} ${sz*0.22+ox},${sz*0.36+oy} ${sz*0.32+ox},${sz*0.48+oy}" fill="${p.accent}" opacity="0.4"/>`;
    },
  },

  {
    id: 'confetti', title: 'Confetti', category: 'Abstract',
    keywords: ['confetti','party','random','celebrate'],
    defaults: { zoom:100, stroke:0, x:0, y:0, spacing:0, angle:0, bg:'#111114', fg:'#F5C518', accent:'#E63946' },
    tileW: p => (60+p.spacing)*p.zoom/100,
    tileH: p => (60+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(60+p.spacing)*p.zoom/100, ox=p.x, oy=p.y, z=p.zoom/100;
      const items=[{x:.08,y:.1,c:p.fg,rot:20,type:'r'},{x:.72,y:.22,c:'#06B6D4',rot:0,type:'c'},{x:.5,y:.58,c:p.accent,rot:-35,type:'r'},{x:.24,y:.62,c:'#a78bfa',rot:0,type:'c'},{x:.82,y:.68,c:p.fg,rot:50,type:'r'},{x:.38,y:.32,c:'#34d399',rot:0,type:'c'},{x:.62,y:.82,c:p.accent,rot:15,type:'r'},{x:.15,y:.85,c:p.fg,rot:-20,type:'c'}];
      return items.map(it=>{const cx=it.x*sz+ox, cy=it.y*sz+oy, s=5*z; return it.type==='c'?`<circle cx="${cx}" cy="${cy}" r="${s*0.9}" fill="${it.c}" opacity="0.8"/>`: `<rect x="${cx-s}" y="${cy-s*0.5}" width="${s*2}" height="${s}" fill="${it.c}" opacity="0.8" transform="rotate(${it.rot} ${cx} ${cy})"/>`;}).join('');
    },
  },

  {
    id: 'spirograph', title: 'Rose Curve', category: 'Abstract',
    keywords: ['spiral','rose','swirl','circle','geometric'],
    defaults: { zoom:100, stroke:1.2, x:0, y:0, spacing:0, angle:0, bg:'#0f0f1a', fg:'#a78bfa', accent:'#F5C518' },
    tileW: p => (60+p.spacing)*p.zoom/100,
    tileH: p => (60+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(60+p.spacing)*p.zoom/100, sw=p.stroke, cx=sz/2+p.x, cy=sz/2+p.y, R=sz*0.42;
      let d=''; for(let i=0;i<=360;i+=6){const a=i*Math.PI/180, x=cx+R*Math.cos(3*a)*Math.cos(a), y=cy+R*Math.cos(3*a)*Math.sin(a); d+=(i===0?'M':'L')+x.toFixed(2)+','+y.toFixed(2);}
      return `<path d="${d}Z" fill="${p.fg}" opacity="0.08"/><path d="${d}Z" fill="none" stroke="${p.fg}" stroke-width="${sw}" opacity="0.7"/>`;
    },
  },

  {
    id: 'voronoi', title: 'Voronoi Cells', category: 'Abstract',
    keywords: ['voronoi','cell','tessellation','organic'],
    defaults: { zoom:100, stroke:1, x:0, y:0, spacing:0, angle:0, bg:'#111114', fg:'#34d399', accent:'#F5C518' },
    tileW: p => (60+p.spacing)*p.zoom/100,
    tileH: p => (60+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(60+p.spacing)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y;
      const sc=(x,y)=>`${(x*sz+ox).toFixed(1)},${(y*sz+oy).toFixed(1)}`;
      const polys=['.4,0 1,0 .9,.3 .65,.25 .3,.35','0,0 .4,0 .3,.35 .1,.4','0,.4 .1,.4 .3,.35 .35,.65 .1,.7 0,.9','.3,.35 .65,.25 .7,.6 .35,.65','.65,.25 .9,.3 1,.5 .85,.8 .7,.6','0,.9 .1,.7 .35,.65 .5,1 0,1','.35,.65 .7,.6 .6,1 .5,1','.7,.6 .85,.8 1,1 .6,1'];
      return polys.map((pts,i)=>`<polygon points="${pts.split(' ').map(xy=>{const[x,y]=xy.split(',');return sc(+x,+y);}).join(' ')}" fill="${p.fg}" opacity="${0.04+i*0.01}"/>` + `<polygon points="${pts.split(' ').map(xy=>{const[x,y]=xy.split(',');return sc(+x,+y);}).join(' ')}" fill="none" stroke="${p.fg}" stroke-width="${sw}" opacity="0.6"/>`).join('');
    },
  },

  {
    id: 'maze', title: 'Labyrinth', category: 'Abstract',
    keywords: ['maze','labyrinth','path','puzzle'],
    defaults: { zoom:100, stroke:2, x:0, y:0, spacing:0, angle:0, bg:'#111114', fg:'#22d3ee', accent:'#F5C518' },
    tileW: p => (60+p.spacing)*p.zoom/100,
    tileH: p => (60+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(60+p.spacing)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y, s=v=>v*sz;
      const segs=[[0,.33,.5,.33],[.5,.33,.5,.66],[.5,.66,1,.66],[.25,0,.25,.33],[.75,.33,.75,1],[0,.66,.25,.66],[.25,.66,.25,1],[0,0,1,0],[0,0,0,1]];
      return segs.map(([x1,y1,x2,y2])=>`<line x1="${s(x1)+ox}" y1="${s(y1)+oy}" x2="${s(x2)+ox}" y2="${s(y2)+oy}" stroke="${p.fg}" stroke-width="${sw}" stroke-linecap="square" opacity="0.65"/>`).join('');
    },
  },

  /* ─── ORGANIC ───────────────────────────────────────── */

  {
    id: 'floral', title: 'Flower Bloom', category: 'Organic',
    keywords: ['flower','petal','nature','bloom'],
    defaults: { zoom:100, stroke:1, x:0, y:0, spacing:0, angle:0, bg:'#0a1628', fg:'#f472b6', accent:'#F5C518' },
    tileW: p => (50+p.spacing)*p.zoom/100,
    tileH: p => (50+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(50+p.spacing)*p.zoom/100, cx=sz/2+p.x, cy=sz/2+p.y, r=10*p.zoom/100, sw=p.stroke;
      let petals=''; for(let i=0;i<6;i++){const a=(i/6)*Math.PI*2; petals+=`<ellipse cx="${(cx+r*Math.cos(a)).toFixed(2)}" cy="${(cy+r*Math.sin(a)).toFixed(2)}" rx="${r*1.1}" ry="${r*0.55}" fill="${p.fg}" opacity="0.28" transform="rotate(${(a*180/Math.PI).toFixed(1)} ${(cx+r*Math.cos(a)).toFixed(2)} ${(cy+r*Math.sin(a)).toFixed(2)})"/>`;}
      return petals+`<circle cx="${cx}" cy="${cy}" r="${4.5*p.zoom/100}" fill="${p.accent}" opacity="0.85"/><circle cx="${cx}" cy="${cy}" r="${4.5*p.zoom/100}" fill="none" stroke="${p.fg}" stroke-width="${sw}" opacity="0.5"/>`;
    },
  },

  {
    id: 'leaves', title: 'Leaf Pattern', category: 'Organic',
    keywords: ['leaf','nature','plant','botanic'],
    defaults: { zoom:100, stroke:1, x:0, y:0, spacing:0, angle:0, bg:'#0a1a0a', fg:'#34d399', accent:'#065f46' },
    tileW: p => (40+p.spacing)*p.zoom/100,
    tileH: p => (40+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(40+p.spacing)*p.zoom/100, ox=p.x, oy=p.y, rx=9*p.zoom/100, ry=4.5*p.zoom/100, sw=p.stroke;
      const leaf=(cx,cy,rot)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${p.fg}" opacity="0.35" transform="rotate(${rot} ${cx} ${cy})"/><line x1="${cx-rx*0.7*Math.cos(rot*Math.PI/180)}" y1="${cy-rx*0.7*Math.sin(rot*Math.PI/180)}" x2="${cx+rx*0.7*Math.cos(rot*Math.PI/180)}" y2="${cy+rx*0.7*Math.sin(rot*Math.PI/180)}" stroke="${p.accent}" stroke-width="${sw*0.6}" opacity="0.6"/>`;
      return leaf(sz*0.28+ox, sz*0.28+oy, -35)+leaf(sz*0.72+ox, sz*0.72+oy, 55)+leaf(sz*0.72+ox, sz*0.28+oy, 35);
    },
  },

  {
    id: 'topographic', title: 'Topographic', category: 'Organic',
    keywords: ['topo','contour','map','terrain'],
    defaults: { zoom:100, stroke:1, x:0, y:0, spacing:0, angle:0, bg:'#0f172a', fg:'#34d399', accent:'#F5C518' },
    tileW: p => (80+p.spacing)*p.zoom/100,
    tileH: p => (50+p.spacing)*p.zoom/100,
    tile(p) {
      const w=(80+p.spacing)*p.zoom/100, h=(50+p.spacing)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y, z=p.zoom/100;
      const row=(y,amp,ph)=>`<path d="M${ox} ${y+oy} Q${w/4+ox} ${y-amp+oy} ${w/2+ph+ox} ${y+oy} T${w+ox} ${y+oy}" fill="none" stroke="${p.fg}" stroke-width="${sw}" opacity="0.55"/>`;
      return row(h*.18,7*z,0)+row(h*.36,9*z,6*z)+row(h*.54,6*z,-4*z)+row(h*.72,8*z,3*z)+row(h*.88,5*z,-2*z);
    },
  },

  {
    id: 'pebbles', title: 'Stone Pebbles', category: 'Organic',
    keywords: ['pebble','stone','rock','organic'],
    defaults: { zoom:100, stroke:1, x:0, y:0, spacing:0, angle:0, bg:'#1a1a1f', fg:'#64748b', accent:'#475569' },
    tileW: p => (60+p.spacing)*p.zoom/100,
    tileH: p => (60+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(60+p.spacing)*p.zoom/100, ox=p.x, oy=p.y, sw=p.stroke;
      const stones=[{cx:.2,cy:.25,rx:.12,ry:.08,r:20},{cx:.58,cy:.18,rx:.09,ry:.11,r:-18},{cx:.82,cy:.48,rx:.10,ry:.08,r:28},{cx:.22,cy:.68,rx:.11,ry:.12,r:-12},{cx:.68,cy:.72,rx:.12,ry:.09,r:18}];
      return stones.map(s=>`<ellipse cx="${s.cx*sz+ox}" cy="${s.cy*sz+oy}" rx="${s.rx*sz}" ry="${s.ry*sz}" fill="${p.fg}" opacity="0.3" transform="rotate(${s.r} ${s.cx*sz+ox} ${s.cy*sz+oy})"/><ellipse cx="${s.cx*sz+ox}" cy="${s.cy*sz+oy}" rx="${s.rx*sz}" ry="${s.ry*sz}" fill="none" stroke="${p.accent}" stroke-width="${sw*0.7}" opacity="0.5" transform="rotate(${s.r} ${s.cx*sz+ox} ${s.cy*sz+oy})"/>`).join('');
    },
  },

  {
    id: 'cells', title: 'Bio Cells', category: 'Organic',
    keywords: ['cell','bio','organic','biology'],
    defaults: { zoom:100, stroke:1.2, x:0, y:0, spacing:0, angle:0, bg:'#0a0a1a', fg:'#818cf8', accent:'#c084fc' },
    tileW: p => 60*p.zoom/100,
    tileH: p => 60*p.zoom/100,
    tile(p) {
      const sc=p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y, t=v=>v*sc;
      return `<path d="M${t(10)+ox},${t(10)+oy} C${t(20)+ox},${t(4)+oy} ${t(36)+ox},${t(7)+oy} ${t(42)+ox},${t(19)+oy} C${t(48)+ox},${t(33)+oy} ${t(29)+ox},${t(43)+oy} ${t(17)+ox},${t(39)+oy} C${t(5)+ox},${t(35)+oy} ${t(0)+ox},${t(22)+oy} ${t(10)+ox},${t(10)+oy}Z" fill="${p.fg}" opacity="0.08"/>
              <path d="M${t(10)+ox},${t(10)+oy} C${t(20)+ox},${t(4)+oy} ${t(36)+ox},${t(7)+oy} ${t(42)+ox},${t(19)+oy} C${t(48)+ox},${t(33)+oy} ${t(29)+ox},${t(43)+oy} ${t(17)+ox},${t(39)+oy} C${t(5)+ox},${t(35)+oy} ${t(0)+ox},${t(22)+oy} ${t(10)+ox},${t(10)+oy}Z" fill="none" stroke="${p.fg}" stroke-width="${sw}" opacity="0.65"/>
              <circle cx="${t(26)+ox}" cy="${t(23)+oy}" r="${t(4)}" fill="${p.accent}" opacity="0.7"/>
              <path d="M${t(35)+ox},${t(26)+oy} C${t(50)+ox},${t(19)+oy} ${t(59)+ox},${t(32)+oy} ${t(55)+ox},${t(46)+oy} C${t(51)+ox},${t(59)+oy} ${t(37)+ox},${t(60)+oy} ${t(30)+ox},${t(50)+oy} C${t(23)+ox},${t(40)+oy} ${t(26)+ox},${t(29)+oy} ${t(35)+ox},${t(26)+oy}Z" fill="none" stroke="${p.accent}" stroke-width="${sw*0.8}" opacity="0.5"/>`;
    },
  },

  {
    id: 'wood-bark', title: 'Wood Grain', category: 'Organic',
    keywords: ['wood','bark','grain','tree'],
    defaults: { zoom:100, stroke:1.2, x:0, y:0, spacing:0, angle:0, bg:'#1c1006', fg:'#a16207', accent:'#78350f' },
    tileW: p => (40+p.spacing)*p.zoom/100,
    tileH: p => (60+p.spacing)*p.zoom/100,
    tile(p) {
      const w=(40+p.spacing)*p.zoom/100, h=(60+p.spacing)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y;
      const lines=[0.08,0.2,0.34,0.5,0.65,0.78,0.92];
      return lines.map((t,i)=>{const x=t*w+ox, amp=(2.5+i%3)*p.zoom/100; return `<path d="M${x} ${oy} Q${x+amp} ${h*0.3+oy} ${x-amp*0.5} ${h*0.6+oy} Q${x+amp*0.7} ${h*0.8+oy} ${x} ${h+oy}" fill="none" stroke="${i%2===0?p.fg:p.accent}" stroke-width="${sw}" opacity="${0.28+i*0.06}"/>`;}).join('');
    },
  },

  {
    id: 'fibonacci', title: 'Golden Spiral', category: 'Organic',
    keywords: ['fibonacci','golden','spiral','nature'],
    defaults: { zoom:100, stroke:1.5, x:0, y:0, spacing:0, angle:0, bg:'#0f0a1e', fg:'#a78bfa', accent:'#818cf8' },
    tileW: p => (60+p.spacing)*p.zoom/100,
    tileH: p => (60+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(60+p.spacing)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y;
      const b=[{x:0,y:0,w:.55,h:.55},{x:.55,y:0,w:.45,h:.35},{x:.55,y:.35,w:.28,h:.2},{x:.73,y:.55,w:.27,h:.45},{x:0,y:.55,w:.45,h:.45}];
      const arcs=[`M${(.55)*sz+ox},${0+oy} A${.55*sz},${.55*sz} 0 0,1 ${0+ox},${.55*sz+oy}`,`M${sz+ox},${0+oy} A${.45*sz},${.35*sz} 0 0,0 ${.55*sz+ox},${.35*sz+oy}`,`M${.55*sz+ox},${.55*sz+oy} A${.28*sz},${.2*sz} 0 0,1 ${.83*sz+ox},${.35*sz+oy}`];
      return b.map((bb,i)=>`<rect x="${bb.x*sz+ox}" y="${bb.y*sz+oy}" width="${bb.w*sz}" height="${bb.h*sz}" fill="none" stroke="${p.fg}" stroke-width="${sw}" opacity="${0.75-i*0.08}"/>`).join('')+arcs.map(d=>`<path d="${d}" fill="none" stroke="${p.accent}" stroke-width="${sw*1.2}" opacity="0.5"/>`).join('');
    },
  },

  /* ─── MINIMAL ───────────────────────────────────────── */

  {
    id: 'dot-grid', title: 'Dot Grid', category: 'Minimal',
    keywords: ['dot','minimal','grid','notebook'],
    defaults: { zoom:100, stroke:0, x:0, y:0, spacing:0, angle:0, bg:'#0f172a', fg:'#334155', accent:'#06B6D4' },
    tileW: p => (20+p.spacing)*p.zoom/100,
    tileH: p => (20+p.spacing)*p.zoom/100,
    tile(p) {
      const sp=(20+p.spacing)*p.zoom/100, r=1.5*p.zoom/100;
      return `<circle cx="${sp/2+p.x}" cy="${sp/2+p.y}" r="${r}" fill="${p.fg}" opacity="0.6"/>`;
    },
  },

  {
    id: 'graph-paper', title: 'Graph Paper', category: 'Minimal',
    keywords: ['graph','paper','grid','notebook'],
    defaults: { zoom:100, stroke:0.8, x:0, y:0, spacing:0, angle:0, bg:'#0f172a', fg:'#1e3a5f', accent:'#06B6D4' },
    tileW: p => (40+p.spacing)*p.zoom/100,
    tileH: p => (40+p.spacing)*p.zoom/100,
    tile(p) {
      const sm=(8+p.spacing*0.2)*p.zoom/100, lg=(40+p.spacing)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y;
      let lines=''; for(let i=0;i<=5;i++) lines+=`<line x1="${i*sm+ox}" y1="${oy}" x2="${i*sm+ox}" y2="${lg+oy}" stroke="${p.fg}" stroke-width="${sw*(i%5===0?1:0.5)}" opacity="${i%5===0?0.5:0.18}"/><line x1="${ox}" y1="${i*sm+oy}" x2="${lg+ox}" y2="${i*sm+oy}" stroke="${p.fg}" stroke-width="${sw*(i%5===0?1:0.5)}" opacity="${i%5===0?0.5:0.18}"/>`;
      return lines;
    },
  },

  {
    id: 'carbon-fiber', title: 'Carbon Fiber', category: 'Minimal',
    keywords: ['carbon','fiber','weave','tech'],
    defaults: { zoom:100, stroke:0, x:0, y:0, spacing:0, angle:0, bg:'#111114', fg:'#2d2d3a', accent:'#F5C518' },
    tileW: p => (8+p.spacing*0.3)*p.zoom/100*2,
    tileH: p => (8+p.spacing*0.3)*p.zoom/100*2,
    tile(p) {
      const sz=(8+p.spacing*0.3)*p.zoom/100, hsz=sz/2, ox=p.x, oy=p.y;
      return `<rect x="${ox}" y="${oy}" width="${hsz}" height="${sz}" fill="${p.fg}" opacity="0.55"/>
              <rect x="${sz+ox}" y="${sz+oy}" width="${hsz}" height="${sz}" fill="${p.fg}" opacity="0.55"/>
              <rect x="${hsz+ox}" y="${oy}" width="${hsz}" height="${sz}" fill="${p.fg}" opacity="0.2"/>
              <rect x="${sz+hsz+ox}" y="${sz+oy}" width="${hsz}" height="${sz}" fill="${p.fg}" opacity="0.2"/>`;
    },
  },

  {
    id: 'houndstooth', title: 'Houndstooth', category: 'Minimal',
    keywords: ['houndstooth','fashion','classic','plaid'],
    defaults: { zoom:100, stroke:0, x:0, y:0, spacing:0, angle:0, bg:'#111114', fg:'#e2e8f0', accent:'#F5C518' },
    tileW: p => (16+p.spacing)*p.zoom/100*2,
    tileH: p => (16+p.spacing)*p.zoom/100*2,
    tile(p) {
      const sz=(16+p.spacing)*p.zoom/100, ox=p.x, oy=p.y;
      return `<polygon points="${ox},${oy} ${sz+ox},${oy} ${sz+ox},${sz/2+oy} ${sz/2+ox},${sz/2+oy} ${sz/2+ox},${sz+oy} ${ox},${sz+oy}" fill="${p.fg}" opacity="0.55"/>
              <polygon points="${sz+ox},${sz+oy} ${sz*2+ox},${sz+oy} ${sz*2+ox},${sz*1.5+oy} ${sz*1.5+ox},${sz*1.5+oy} ${sz*1.5+ox},${sz*2+oy} ${sz+ox},${sz*2+oy}" fill="${p.fg}" opacity="0.55"/>`;
    },
  },

  {
    id: 'scattered-dots', title: 'Scattered Dots', category: 'Minimal',
    keywords: ['dot','scatter','random','minimal'],
    defaults: { zoom:100, stroke:0, x:0, y:0, spacing:0, angle:0, bg:'#0f172a', fg:'#475569', accent:'#F5C518' },
    tileW: p => (50+p.spacing)*p.zoom/100,
    tileH: p => (50+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(50+p.spacing)*p.zoom/100, ox=p.x, oy=p.y;
      const pts=[{x:.1,y:.15,r:2},{x:.38,y:.08,r:1.5},{x:.72,y:.2,r:2.5},{x:.18,y:.52,r:1.8},{x:.6,y:.44,r:2},{x:.84,y:.62,r:1.5},{x:.3,y:.78,r:2.2},{x:.68,y:.84,r:1.8}];
      return pts.map((pt,i)=>`<circle cx="${pt.x*sz+ox}" cy="${pt.y*sz+oy}" r="${pt.r*p.zoom/100}" fill="${p.fg}" opacity="${0.28+i*0.05}"/>`).join('');
    },
  },

  {
    id: 'noise-subtle', title: 'Subtle Noise', category: 'Minimal',
    keywords: ['noise','grain','texture','film','subtle'],
    defaults: { zoom:100, stroke:0, x:0, y:0, spacing:0, angle:0, bg:'#111114', fg:'#94a3b8', accent:'#F5C518' },
    tileW: p => (50+p.spacing)*p.zoom/100,
    tileH: p => (50+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(50+p.spacing)*p.zoom/100, ox=p.x, oy=p.y;
      const seed=[{x:.06,y:.1},{x:.18,y:.44},{x:.32,y:.08},{x:.44,y:.62},{x:.58,y:.28},{x:.7,y:.76},{x:.82,y:.12},{x:.9,y:.5},{x:.14,y:.78},{x:.52,y:.88},{x:.76,y:.44},{x:.38,y:.36}];
      return seed.map((s,i)=>`<circle cx="${s.x*sz+ox}" cy="${s.y*sz+oy}" r="${(0.7+(i%3)*0.5)*p.zoom/100}" fill="${p.fg}" opacity="${0.1+(i%4)*0.06}"/>`).join('');
    },
  },

  /* ─── TECH ──────────────────────────────────────────── */

  {
    id: 'isometric', title: 'Isometric Grid', category: 'Tech',
    keywords: ['iso','isometric','3d','grid'],
    defaults: { zoom:100, stroke:1, x:0, y:0, spacing:0, angle:0, bg:'#0a0f1e', fg:'#0ea5e9', accent:'#38bdf8' },
    tileW: p => (60+p.spacing)*p.zoom/100,
    tileH: p => (35+p.spacing*0.5)*p.zoom/100,
    tile(p) {
      const w=(60+p.spacing)*p.zoom/100, h=(35+p.spacing*0.5)*p.zoom/100, sw=p.stroke, hw=w/2, ox=p.x, oy=p.y;
      return `<line x1="${ox}" y1="${oy}" x2="${hw+ox}" y2="${h+oy}" stroke="${p.fg}" stroke-width="${sw}" opacity="0.55"/>
              <line x1="${w+ox}" y1="${oy}" x2="${hw+ox}" y2="${h+oy}" stroke="${p.fg}" stroke-width="${sw}" opacity="0.55"/>
              <line x1="${ox}" y1="${oy}" x2="${w+ox}" y2="${oy}" stroke="${p.accent}" stroke-width="${sw}" opacity="0.4"/>
              <line x1="${ox}" y1="${h/2+oy}" x2="${w+ox}" y2="${h/2+oy}" stroke="${p.fg}" stroke-width="${sw*0.5}" opacity="0.2"/>`;
    },
  },

  {
    id: 'isometric-blocks', title: 'Isometric Cubes', category: 'Tech',
    keywords: ['iso','block','3d','cube','isometric'],
    defaults: { zoom:100, stroke:1, x:0, y:0, spacing:0, angle:0, bg:'#0a0f1e', fg:'#0ea5e9', accent:'#0284c7' },
    tileW: p => (60+p.spacing)*p.zoom/100,
    tileH: p => (52+p.spacing)*p.zoom/100,
    tile(p) {
      const w=(60+p.spacing)*p.zoom/100, h=(52+p.spacing)*p.zoom/100, hw=w/2, qh=h/4, sw=p.stroke, ox=p.x, oy=p.y;
      const top=`M${hw+ox},${oy} L${w+ox},${qh+oy} L${hw+ox},${h/2+oy} L${ox},${qh+oy}Z`;
      const lft=`M${ox},${qh+oy} L${hw+ox},${h/2+oy} L${hw+ox},${h+oy} L${ox},${h*0.75+oy}Z`;
      const rgt=`M${hw+ox},${h/2+oy} L${w+ox},${qh+oy} L${w+ox},${h*0.75+oy} L${hw+ox},${h+oy}Z`;
      return `<path d="${top}" fill="${p.fg}" opacity="0.6"/><path d="${lft}" fill="${p.accent}" opacity="0.4"/><path d="${rgt}" fill="${p.fg}" opacity="0.22"/>
              <path d="${top}" fill="none" stroke="${p.fg}" stroke-width="${sw*0.6}" opacity="0.5"/>
              <path d="${lft}" fill="none" stroke="${p.fg}" stroke-width="${sw*0.6}" opacity="0.4"/>
              <path d="${rgt}" fill="none" stroke="${p.fg}" stroke-width="${sw*0.6}" opacity="0.35"/>`;
    },
  },

  {
    id: 'circuit', title: 'Circuit Board', category: 'Tech',
    keywords: ['circuit','pcb','tech','electronic'],
    defaults: { zoom:100, stroke:1.5, x:0, y:0, spacing:0, angle:0, bg:'#050f1c', fg:'#22c55e', accent:'#16a34a' },
    tileW: p => (60+p.spacing)*p.zoom/100,
    tileH: p => (60+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(60+p.spacing)*p.zoom/100, sw=p.stroke, r=2.5*p.zoom/100, ox=p.x, oy=p.y;
      return `<polyline points="${sz*.1+ox},${sz*.5+oy} ${sz*.3+ox},${sz*.5+oy} ${sz*.3+ox},${sz*.2+oy} ${sz*.7+ox},${sz*.2+oy} ${sz*.7+ox},${sz*.5+oy} ${sz*.9+ox},${sz*.5+oy}" fill="none" stroke="${p.fg}" stroke-width="${sw}" opacity="0.7"/>
              <polyline points="${sz*.5+ox},${sz*.5+oy} ${sz*.5+ox},${sz*.8+oy} ${sz*.8+ox},${sz*.8+oy}" fill="none" stroke="${p.accent}" stroke-width="${sw}" opacity="0.55"/>
              <line x1="${sz*.1+ox}" y1="${sz*.7+oy}" x2="${sz*.3+ox}" y2="${sz*.7+oy}" stroke="${p.fg}" stroke-width="${sw*0.6}" stroke-dasharray="${2*p.zoom/100} ${2*p.zoom/100}" opacity="0.4"/>
              ${[{cx:.3,cy:.5},{cx:.7,cy:.5},{cx:.5,cy:.2},{cx:.5,cy:.8}].map(c=>`<circle cx="${c.cx*sz+ox}" cy="${c.cy*sz+oy}" r="${r}" fill="${p.fg}" opacity="0.9"/><circle cx="${c.cx*sz+ox}" cy="${c.cy*sz+oy}" r="${r*1.8}" fill="none" stroke="${p.fg}" stroke-width="${sw*0.4}" opacity="0.3"/>`).join('')}`;
    },
  },

  {
    id: 'radar', title: 'Radar Sweep', category: 'Tech',
    keywords: ['radar','sonar','scan','circular','ring'],
    defaults: { zoom:100, stroke:1, x:0, y:0, spacing:0, angle:0, bg:'#050f1c', fg:'#22c55e', accent:'#4ade80' },
    tileW: p => (60+p.spacing)*p.zoom/100,
    tileH: p => (60+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(60+p.spacing)*p.zoom/100, cx=sz/2+p.x, cy=sz/2+p.y, sw=p.stroke;
      return [.13,.26,.39].map((r,i)=>`<circle cx="${cx}" cy="${cy}" r="${r*sz}" fill="none" stroke="${p.fg}" stroke-width="${sw}" opacity="${0.6-i*0.12}"/>`).join('')
        +`<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy-sz*0.38}" stroke="${p.fg}" stroke-width="${sw}" opacity="0.55"/>
           <line x1="${cx}" y1="${cy}" x2="${cx+sz*0.38}" y2="${cy}" stroke="${p.fg}" stroke-width="${sw}" opacity="0.3"/>
           <line x1="${cx}" y1="${cy}" x2="${(cx+sz*0.27).toFixed(2)}" y2="${(cy-sz*0.27).toFixed(2)}" stroke="${p.accent}" stroke-width="${sw*1.5}" opacity="0.6"/>
           <circle cx="${(cx+sz*0.22).toFixed(2)}" cy="${(cy-sz*0.12).toFixed(2)}" r="${2.5*p.zoom/100}" fill="${p.accent}" opacity="0.9"/>
           <circle cx="${(cx+sz*0.08).toFixed(2)}" cy="${(cy-sz*0.3).toFixed(2)}" r="${1.8*p.zoom/100}" fill="${p.fg}" opacity="0.6"/>`;
    },
  },

  {
    id: 'matrix', title: 'Digital Rain', category: 'Tech',
    keywords: ['matrix','binary','code','digital','rain'],
    defaults: { zoom:100, stroke:0, x:0, y:0, spacing:0, angle:0, bg:'#050f05', fg:'#22c55e', accent:'#86efac' },
    tileW: p => (60+p.spacing)*p.zoom/100,
    tileH: p => (60+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(60+p.spacing)*p.zoom/100, fs=8*p.zoom/100, ox=p.x, oy=p.y;
      const cols=[['1','0','1','0','1','1'],['0','1','0','1','0','0'],['1','1','0','0','1','0'],['0','0','1','1','0','1']];
      let out='';
      cols.forEach((col,ci)=>{col.forEach((c,ri)=>{const x=ci*(sz/4)+sz*0.06+ox, y=ri*(sz/5.5)+fs+oy; out+=`<text x="${x}" y="${y}" font-size="${fs}" fill="${ri===0?p.accent:p.fg}" opacity="${ri===0?0.9:0.18+ri*0.12}" font-family="monospace" font-weight="bold">${c}</text>`;});});
      return out;
    },
  },

  {
    id: 'qr-fragment', title: 'QR Finder', category: 'Tech',
    keywords: ['qr','code','scan','tech'],
    defaults: { zoom:100, stroke:0, x:0, y:0, spacing:0, angle:0, bg:'#111114', fg:'#F5C518', accent:'#E63946' },
    tileW: p => (60+p.spacing)*p.zoom/100,
    tileH: p => (60+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(60+p.spacing)*p.zoom/100, cell=sz/7, ox=p.x, oy=p.y;
      const pat=[[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,1,1,1,0,1],[1,0,1,0,1,0,1],[1,0,1,1,1,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]];
      let out=''; pat.forEach((row,r)=>row.forEach((v,c)=>{if(v) out+=`<rect x="${c*cell+ox}" y="${r*cell+oy}" width="${cell}" height="${cell}" fill="${r>0&&r<6&&c>0&&c<6?p.fg:p.accent}" opacity="${r===3&&c===3?0.4:0.8}"/>`;})); return out;
    },
  },

  {
    id: 'blueprint', title: 'Blueprint Grid', category: 'Tech',
    keywords: ['blueprint','technical','draft','architect'],
    defaults: { zoom:100, stroke:0.8, x:0, y:0, spacing:0, angle:0, bg:'#04133b', fg:'#93c5fd', accent:'#60a5fa' },
    tileW: p => (40+p.spacing)*p.zoom/100,
    tileH: p => (40+p.spacing)*p.zoom/100,
    tile(p) {
      const sp=(40+p.spacing)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y;
      const hsp=sp/2;
      return `<line x1="${ox}" y1="${oy}" x2="${sp+ox}" y2="${oy}" stroke="${p.fg}" stroke-width="${sw}" opacity="0.4"/>
              <line x1="${ox}" y1="${oy}" x2="${ox}" y2="${sp+oy}" stroke="${p.fg}" stroke-width="${sw}" opacity="0.4"/>
              <line x1="${hsp+ox}" y1="${oy}" x2="${hsp+ox}" y2="${sp+oy}" stroke="${p.accent}" stroke-width="${sw*0.6}" stroke-dasharray="${2*p.zoom/100} ${2*p.zoom/100}" opacity="0.25"/>
              <line x1="${ox}" y1="${hsp+oy}" x2="${sp+ox}" y2="${hsp+oy}" stroke="${p.accent}" stroke-width="${sw*0.6}" stroke-dasharray="${2*p.zoom/100} ${2*p.zoom/100}" opacity="0.25"/>
              <circle cx="${sp+ox}" cy="${sp+oy}" r="${2*p.zoom/100}" fill="${p.fg}" opacity="0.5"/>`;
    },
  },

  {
    id: 'pixel-art', title: 'Pixel Pattern', category: 'Tech',
    keywords: ['pixel','retro','8bit','game','art'],
    defaults: { zoom:100, stroke:0, x:0, y:0, spacing:0, angle:0, bg:'#111114', fg:'#F5C518', accent:'#E63946' },
    tileW: p => (10+p.spacing*0.2)*p.zoom/100*5,
    tileH: p => (10+p.spacing*0.2)*p.zoom/100*5,
    tile(p) {
      const cell=(10+p.spacing*0.2)*p.zoom/100, ox=p.x, oy=p.y;
      const pat=[0,1,0,1,0, 1,0,1,0,1, 0,1,2,1,0, 1,0,1,0,1, 0,1,0,1,0];
      return pat.map((v,i)=>{const c=i%5, r=Math.floor(i/5), clr=v===0?null:v===1?p.fg:p.accent; return clr?`<rect x="${c*cell+ox}" y="${r*cell+oy}" width="${cell-1}" height="${cell-1}" fill="${clr}" opacity="0.7"/>`:''}).join('');
    },
  },

  {
    id: 'noise-grid', title: 'Static Noise', category: 'Tech',
    keywords: ['noise','grid','random','static','glitch'],
    defaults: { zoom:100, stroke:0, x:0, y:0, spacing:0, angle:0, bg:'#111114', fg:'#94a3b8', accent:'#06B6D4' },
    tileW: p => (8+p.spacing*0.2)*p.zoom/100*5,
    tileH: p => (8+p.spacing*0.2)*p.zoom/100*5,
    tile(p) {
      const cell=(8+p.spacing*0.2)*p.zoom/100, ox=p.x, oy=p.y;
      const ops=[0.7,0.1,0.45,0.85,0.25, 0.35,0.8,0.15,0.55,0.9, 0.9,0.25,0.65,0.1,0.5, 0.2,0.6,0.95,0.4,0.75, 0.5,0.85,0.3,0.7,0.15];
      return ops.map((op,i)=>`<rect x="${(i%5)*cell+ox}" y="${Math.floor(i/5)*cell+oy}" width="${cell}" height="${cell}" fill="${op>0.6?p.accent:p.fg}" opacity="${op}"/>`).join('');
    },
  },
  {
    id: 'sunburst', title: 'Sunburst Rays', category: 'Geometric',
    keywords: ['sunburst','ray','sun','radial','starburst'],
    defaults: { zoom:100, stroke:1, x:0, y:0, spacing:0, angle:0, bg:'#1a1a2e', fg:'#F5C518', accent:'#fde68a' },
    tileW: p => (60+p.spacing)*p.zoom/100,
    tileH: p => (60+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(60+p.spacing)*p.zoom/100, cx=sz/2+p.x, cy=sz/2+p.y, sw=p.stroke, rays=12, z=p.zoom/100;
      let lines='';
      for(let i=0;i<rays;i++){const a=(i/rays)*Math.PI*2; lines+=`<line x1="${cx}" y1="${cy}" x2="${(cx+Math.cos(a)*sz*0.46).toFixed(2)}" y2="${(cy+Math.sin(a)*sz*0.46).toFixed(2)}" stroke="${i%2===0?p.fg:p.accent}" stroke-width="${sw*(i%2===0?1:0.6)}" opacity="${0.4+i%3*0.15}"/>`;}
      return lines+`<circle cx="${cx}" cy="${cy}" r="${5*z}" fill="${p.accent}" opacity="0.9"/><circle cx="${cx}" cy="${cy}" r="${9*z}" fill="none" stroke="${p.fg}" stroke-width="${sw*0.5}" opacity="0.4"/>`;
    },
  },

  {
    id: 'bubble-wrap', title: 'Bubble Wrap', category: 'Abstract',
    keywords: ['bubble','circle','wrap','sphere','round'],
    defaults: { zoom:100, stroke:1.2, x:0, y:0, spacing:0, angle:0, bg:'#0c1a2e', fg:'#38bdf8', accent:'#0ea5e9' },
    tileW: p => (50+p.spacing)*p.zoom/100,
    tileH: p => (50+p.spacing)*p.zoom/100,
    tile(p) {
      const sp=(25+p.spacing*0.5)*p.zoom/100, r=sp*0.4, sw=p.stroke, ox=p.x, oy=p.y;
      const c=(cx,cy)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${p.accent}" opacity="0.06"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${p.fg}" stroke-width="${sw}" opacity="0.6"/><circle cx="${(cx-r*0.3).toFixed(1)}" cy="${(cy-r*0.3).toFixed(1)}" r="${r*0.15}" fill="${p.fg}" opacity="0.4"/>`;
      return c(sp/2+ox,sp/2+oy)+c(sp+sp/2+ox,sp/2+oy)+c(sp/2+ox,sp+sp/2+oy)+c(sp+sp/2+ox,sp+sp/2+oy);
    },
  },

];

/* ══════════════════════════════════════════════════════════
   2. RENDER ENGINE
══════════════════════════════════════════════════════════ */

function renderPatternSVG(pattern, params, canvasW, canvasH) {
  const tw = Math.max(1, pattern.tileW(params));
  const th = Math.max(1, pattern.tileH(params));
  const tileContent = pattern.tile(params);
  const transform = params.angle !== 0
    ? ` patternTransform="rotate(${params.angle})"`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasW}" height="${canvasH}">
  <defs>
    <pattern id="p" x="${params.x}" y="${params.y}" width="${tw.toFixed(2)}" height="${th.toFixed(2)}" patternUnits="userSpaceOnUse"${transform}>
      ${tileContent}
    </pattern>
  </defs>
  <rect width="${canvasW}" height="${canvasH}" fill="${params.bg}"/>
  <rect width="${canvasW}" height="${canvasH}" fill="url(#p)"/>
</svg>`;
}

/* ══════════════════════════════════════════════════════════
   3. EDITOR STATE
══════════════════════════════════════════════════════════ */

const editorState = {
  pattern: null,
  params: {},
};

function resetEditorToDefaults() {
  editorState.params = { ...editorState.pattern.defaults };
  syncSlidersFromState();
}

function syncSlidersFromState() {
  const p = editorState.params;
  const pairs = [['ctrl-zoom','val-zoom',p.zoom],['ctrl-stroke','val-stroke',p.stroke],
    ['ctrl-x','val-x',p.x],['ctrl-y','val-y',p.y],['ctrl-spacing','val-spacing',p.spacing],['ctrl-angle','val-angle',p.angle]];
  pairs.forEach(([sid,vid,v])=>{
    const sel=document.getElementById(sid); if(sel) sel.value=v;
    const vel=document.getElementById(vid); if(vel) vel.textContent=Number.isInteger(v)?v:parseFloat(v).toFixed(1);
  });
  document.getElementById('ctrl-bg').value     = p.bg;
  document.getElementById('ctrl-fg').value     = p.fg;
  document.getElementById('ctrl-accent').value = p.accent;
}

/* ── Live preview: uses ResizeObserver to always have real dimensions ── */
let _previewRO = null;
let _previewPending = false;

function updatePreview() {
  if (!editorState.pattern) return;
  const canvas = document.getElementById('preview-canvas');
  if (!canvas) return;

  // If the overlay is not yet laid out (display:none equiv), defer
  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;
  if (w < 2 || h < 2) {
    // Will be triggered by ResizeObserver once dimensions are available
    _previewPending = true;
    return;
  }
  _previewPending = false;
  const svg = renderPatternSVG(editorState.pattern, editorState.params, w, h);
  canvas.innerHTML = svg;
}

function initPreviewObserver() {
  const canvas = document.getElementById('preview-canvas');
  if (!canvas) return;
  _previewRO = new ResizeObserver(() => {
    // If a preview was pending or editor is open, re-render
    if (_previewPending || document.getElementById('editor-overlay').classList.contains('open')) {
      updatePreview();
    }
  });
  _previewRO.observe(canvas);
}

/* ══════════════════════════════════════════════════════════
   4. URL ROUTING  (hash-based, works on F5 + back button)
   URL format: #editor/{pattern-id}  or  #gallery
══════════════════════════════════════════════════════════ */

function navigateTo(hash) {
  if (window.location.hash !== hash) {
    history.pushState(null, '', hash);
  }
  handleRoute();
}

function handleRoute() {
  const hash = window.location.hash;
  if (hash.startsWith('#editor/')) {
    const id = hash.slice('#editor/'.length);
    const pattern = PATTERNS.find(p => p.id === id);
    if (pattern) {
      _openEditorInternal(pattern);
      return;
    }
  }
  // Default: gallery
  _closeEditorInternal();
}

window.addEventListener('popstate', handleRoute);

/* ══════════════════════════════════════════════════════════
   5. EDITOR OPEN / CLOSE
══════════════════════════════════════════════════════════ */

function openEditor(pattern) {
  navigateTo(`#editor/${pattern.id}`);
}

function closeEditor() {
  navigateTo('#gallery');
}

function _openEditorInternal(pattern) {
  editorState.pattern = pattern;
  editorState.params  = { ...pattern.defaults };

  document.getElementById('editor-title').textContent = pattern.title;
  syncSlidersFromState();

  const overlay = document.getElementById('editor-overlay');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Mark pending — ResizeObserver fires after CSS transition ends
  _previewPending = true;
  // Also try immediately in case RO fires before transition
  requestAnimationFrame(() => requestAnimationFrame(updatePreview));
}

function _closeEditorInternal() {
  const overlay = document.getElementById('editor-overlay');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

/* ══════════════════════════════════════════════════════════
   6. GALLERY
══════════════════════════════════════════════════════════ */

let galleryFilter = { cat: 'all', search: '' };

function renderGallery() {
  const grid  = document.getElementById('gallery-grid');
  const empty = document.getElementById('empty-state');
  const { cat, search } = galleryFilter;
  const q = search.toLowerCase();

  const visible = PATTERNS.filter(p => {
    const matchCat    = cat === 'all' || p.category === cat;
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.keywords.some(k => k.includes(q)) || p.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  if (visible.length === 0) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  const existing = new Map([...grid.querySelectorAll('.pattern-card')].map(el => [el.dataset.id, el]));
  const needed   = new Set(visible.map(p => p.id));
  existing.forEach((el, id) => { if (!needed.has(id)) el.remove(); });

  const frag = document.createDocumentFragment();
  visible.forEach(p => { if (!existing.has(p.id)) frag.appendChild(buildCard(p)); });
  grid.appendChild(frag);
  visible.forEach(p => { const el=grid.querySelector(`[data-id="${p.id}"]`); if(el) grid.appendChild(el); });
  visible.forEach(p => renderThumbnail(p));
}

function buildCard(pattern) {
  const card = document.createElement('div');
  card.className = 'pattern-card';
  card.dataset.id = pattern.id;
  card.setAttribute('role', 'listitem');
  const catCls = 'cat-' + pattern.category.replace(/[^a-zA-Z]/g, '');
  card.innerHTML = `
    <div class="card-preview" id="thumb-${pattern.id}">
      <div class="card-overlay"><button class="card-overlay-btn">Edit Pattern</button></div>
    </div>
    <div class="card-footer">
      <span class="card-title">${pattern.title}</span>
      <span class="card-cat ${catCls}">${pattern.category}</span>
    </div>
  `;
  card.addEventListener('click', () => openEditor(pattern));
  return card;
}

function renderThumbnail(pattern) {
  const el = document.getElementById(`thumb-${pattern.id}`);
  if (!el) return;
  const w = el.clientWidth  || 260;
  const h = el.clientHeight || 196;
  const svg = renderPatternSVG(pattern, pattern.defaults, w, h);
  const existing = el.querySelector('svg');
  if (existing) existing.remove();
  el.insertAdjacentHTML('afterbegin', svg);
}

/* ══════════════════════════════════════════════════════════
   7. EXPORT
══════════════════════════════════════════════════════════ */

function getSVGString(w, h) {
  return renderPatternSVG(editorState.pattern, editorState.params, w, h);
}

function getExportDimensions() {
  return {
    w: parseInt(document.getElementById('dim-w').value, 10) || 1080,
    h: parseInt(document.getElementById('dim-h').value, 10) || 1080,
  };
}

function copyCSSToClipboard() {
  const { bg } = editorState.params;
  const { w, h } = getExportDimensions();
  const svgStr = getSVGString(w, h);
  const encoded = svgStr.replace(/\n/g,' ').replace(/\s+/g,' ').replace(/"/g,"'").replace(/#/g,'%23').replace(/</g,'%3C').replace(/>/g,'%3E');
  const css = `.${editorState.pattern.id}-bg {\n  background-color: ${bg};\n  background-image: url("data:image/svg+xml,${encoded}");\n  background-repeat: repeat;\n}`;
  writeToClipboard(css, '✓ CSS copied!');
}

function copySVGToClipboard() {
  const { w, h } = getExportDimensions();
  writeToClipboard(getSVGString(w, h), '✓ SVG markup copied!');
}

function downloadSVG() {
  const { w, h } = getExportDimensions();
  const blob = new Blob([getSVGString(w, h)], { type: 'image/svg+xml' });
  triggerDownload(URL.createObjectURL(blob), `${editorState.pattern.id}.svg`);
  showToast('↓ SVG downloading…');
}

function downloadPNG() {
  const { w, h } = getExportDimensions();
  const svgStr = getSVGString(w, h);
  const blob   = new Blob([svgStr], { type: 'image/svg+xml' });
  const url    = URL.createObjectURL(blob);
  const img    = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    canvas.toBlob(pngBlob => {
      triggerDownload(URL.createObjectURL(pngBlob), `${editorState.pattern.id}.png`);
      showToast(`↓ PNG ${w}×${h} downloading…`);
    }, 'image/png');
  };
  img.onerror = () => showToast('✗ PNG render failed.', true);
  img.src = url;
}

function triggerDownload(href, filename) {
  const a = Object.assign(document.createElement('a'), { href, download: filename });
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(href), 8000);
}

function writeToClipboard(text, msg) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast(msg), () => fallbackCopy(text, msg));
  } else { fallbackCopy(text, msg); }
}

function fallbackCopy(text, msg) {
  const ta = Object.assign(document.createElement('textarea'), { value: text, style: 'position:fixed;opacity:0' });
  document.body.appendChild(ta); ta.focus(); ta.select();
  try { document.execCommand('copy'); showToast(msg); } catch { showToast('✗ Copy failed.', true); }
  document.body.removeChild(ta);
}

/* ══════════════════════════════════════════════════════════
   8. TOAST
══════════════════════════════════════════════════════════ */

let _toastTimer;
function showToast(msg, isErr = false) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.toggle('err', isErr);
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

/* ══════════════════════════════════════════════════════════
   9. EVENT WIRING
══════════════════════════════════════════════════════════ */

function wireSlider(id, key, valId) {
  const el = document.getElementById(id);
  const ve = document.getElementById(valId);
  if (!el || !ve) return;
  el.addEventListener('input', () => {
    const v = parseFloat(el.value);
    editorState.params[key] = v;
    ve.textContent = Number.isInteger(v) ? v : v.toFixed(1);
    updatePreview();
  });
}

function wireColor(id, key) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', e => { editorState.params[key] = e.target.value; updatePreview(); });
}

function initEditorControls() {
  wireSlider('ctrl-zoom',    'zoom',    'val-zoom');
  wireSlider('ctrl-stroke',  'stroke',  'val-stroke');
  wireSlider('ctrl-x',       'x',       'val-x');
  wireSlider('ctrl-y',       'y',       'val-y');
  wireSlider('ctrl-spacing', 'spacing', 'val-spacing');
  wireSlider('ctrl-angle',   'angle',   'val-angle');
  wireColor('ctrl-bg', 'bg');
  wireColor('ctrl-fg', 'fg');
  wireColor('ctrl-accent', 'accent');

  document.getElementById('btn-reset').addEventListener('click', () => { resetEditorToDefaults(); updatePreview(); });
  document.getElementById('editor-close').addEventListener('click', closeEditor);

  // Keyboard Escape → back
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.getElementById('editor-overlay').classList.contains('open')) closeEditor();
  });

  document.getElementById('btn-copy-css').addEventListener('click', copyCSSToClipboard);
  document.getElementById('btn-copy-svg').addEventListener('click', copySVGToClipboard);
  document.getElementById('btn-dl-svg').addEventListener('click', downloadSVG);
  document.getElementById('btn-dl-png').addEventListener('click', downloadPNG);

  initPreviewObserver();
}

function initGalleryControls() {
  document.getElementById('filter-bar').addEventListener('click', e => {
    const tab = e.target.closest('.filter-tab');
    if (!tab) return;
    document.querySelectorAll('.filter-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
    tab.classList.add('active'); tab.setAttribute('aria-selected','true');
    galleryFilter.cat = tab.dataset.cat;
    renderGallery();
  });

  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');
  let debounce;

  searchInput.addEventListener('input', () => {
    galleryFilter.search = searchInput.value.trim();
    searchClear.classList.toggle('visible', galleryFilter.search.length > 0);
    clearTimeout(debounce);
    debounce = setTimeout(renderGallery, 180);
  });

  searchClear.addEventListener('click', () => {
    searchInput.value = ''; galleryFilter.search = '';
    searchClear.classList.remove('visible');
    renderGallery(); searchInput.focus();
  });
}

/* ══════════════════════════════════════════════════════════
   10. INIT
══════════════════════════════════════════════════════════ */

function init() {
  const badge = document.getElementById('count-badge');
  if (badge) badge.textContent = `${PATTERNS.length} patterns`;

  initEditorControls();
  initGalleryControls();
  renderGallery();

  // Handle initial URL (e.g. user bookmarked #editor/polka-dot or F5 on editor)
  handleRoute();
}

document.addEventListener('DOMContentLoaded', init);
