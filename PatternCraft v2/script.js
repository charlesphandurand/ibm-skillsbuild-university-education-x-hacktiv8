/* ============================================================
   PatternCraft Studio v2 — script.js
   Fixed: SVG id collision, live preview, 50 unique patterns
   Vanilla ES6+ | Zero dependencies
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════════════════════
   1. PATTERN DATABASE — 50 visually distinct patterns
   params = { zoom, stroke, x, y, spacing, angle, bg, fg, accent }
   tile(p)  → inner SVG element string (no outer <svg> tag)
   tileW/H  → tile pixel dimensions at current params
══════════════════════════════════════════════════════════ */

const PATTERNS = [

  /* ═══ GEOMETRIC (11) ═══════════════════════════════════ */

  /* 1 — Polka Dot */
  {
    id: 'polka-dot', title: 'Polka Dot', category: 'Geometric',
    keywords: ['circle','dot','round','spots'],
    defaults: { zoom:100, stroke:0, x:0, y:0, spacing:0, angle:0, bg:'#111827', fg:'#F5C518', accent:'#E63946' },
    tileW: p => (26+p.spacing)*p.zoom/100,
    tileH: p => (26+p.spacing)*p.zoom/100,
    tile(p) {
      const sp=(26+p.spacing)*p.zoom/100, r=7*p.zoom/100;
      return `<circle cx="${sp/2+p.x}" cy="${sp/2+p.y}" r="${r}" fill="${p.fg}"/>`;
    },
  },

  /* 2 — Honeycomb */
  {
    id: 'hexagons', title: 'Honeycomb', category: 'Geometric',
    keywords: ['hex','honeycomb','beehive','hexagon'],
    defaults: { zoom:100, stroke:1.8, x:0, y:0, spacing:1, angle:0, bg:'#1a1000', fg:'#F5A623', accent:'#F5C518' },
    tileW: p => { const r=(16+p.spacing)*p.zoom/100; return r*3; },
    tileH: p => { const r=(16+p.spacing)*p.zoom/100; return r*Math.sqrt(3); },
    tile(p) {
      const r=(16+p.spacing)*p.zoom/100, sw=Math.max(0.1,p.stroke), h=r*Math.sqrt(3);
      const hex=(cx,cy)=>{
        const pts=Array.from({length:6},(_,i)=>{
          const a=Math.PI/180*(60*i);
          return `${(cx+r*Math.cos(a)).toFixed(2)},${(cy+r*Math.sin(a)).toFixed(2)}`;
        }).join(' ');
        return `<polygon points="${pts}" fill="${p.fg}" opacity="0.12"/>
                <polygon points="${pts}" fill="none" stroke="${p.fg}" stroke-width="${sw}"/>`;
      };
      return hex(r*1.5+p.x, h/2+p.y)+hex(0+p.x, h+p.y)+hex(r*3+p.x, h+p.y);
    },
  },

  /* 3 — Checkerboard */
  {
    id: 'checkerboard', title: 'Checkerboard', category: 'Geometric',
    keywords: ['chess','checker','square','tile'],
    defaults: { zoom:100, stroke:0, x:0, y:0, spacing:0, angle:0, bg:'#1a1a1a', fg:'#f1f5f9', accent:'#E63946' },
    tileW: p => (22+p.spacing)*p.zoom/100*2,
    tileH: p => (22+p.spacing)*p.zoom/100*2,
    tile(p) {
      const sz=(22+p.spacing)*p.zoom/100, ox=p.x, oy=p.y;
      return `<rect x="${ox}" y="${oy}" width="${sz}" height="${sz}" fill="${p.fg}"/>
              <rect x="${sz+ox}" y="${sz+oy}" width="${sz}" height="${sz}" fill="${p.fg}"/>`;
    },
  },

  /* 4 — Argyle */
  {
    id: 'argyle', title: 'Argyle', category: 'Geometric',
    keywords: ['argyle','diamond','plaid','classic'],
    defaults: { zoom:100, stroke:1.2, x:0, y:0, spacing:0, angle:0, bg:'#1e1b4b', fg:'#818cf8', accent:'#fbbf24' },
    tileW: p => (44+p.spacing)*p.zoom/100,
    tileH: p => (32+p.spacing)*p.zoom/100,
    tile(p) {
      const w=(44+p.spacing)*p.zoom/100, h=(32+p.spacing)*p.zoom/100;
      const sw=p.stroke, hw=w/2, hh=h/2, ox=p.x, oy=p.y, d=3*p.zoom/100;
      return `<polygon points="${hw+ox},${oy} ${w+ox},${hh+oy} ${hw+ox},${h+oy} ${ox},${hh+oy}" fill="${p.fg}" opacity="0.22"/>
              <polygon points="${hw+ox},${oy} ${w+ox},${hh+oy} ${hw+ox},${h+oy} ${ox},${hh+oy}" fill="none" stroke="${p.fg}" stroke-width="${sw}"/>
              <line x1="${hw+ox}" y1="${oy}" x2="${hw+ox}" y2="${h+oy}" stroke="${p.accent}" stroke-width="${sw*0.7}" stroke-dasharray="${d} ${d}"/>
              <line x1="${ox}" y1="${hh+oy}" x2="${w+ox}" y2="${hh+oy}" stroke="${p.accent}" stroke-width="${sw*0.7}" stroke-dasharray="${d} ${d}"/>`;
    },
  },

  /* 5 — Triangle Mosaic */
  {
    id: 'triangles', title: 'Triangle Mosaic', category: 'Geometric',
    keywords: ['triangle','geometric','delta','mosaic'],
    defaults: { zoom:100, stroke:1.2, x:0, y:0, spacing:0, angle:0, bg:'#1e0a38', fg:'#c084fc', accent:'#7c3aed' },
    tileW: p => (36+p.spacing)*p.zoom/100,
    tileH: p => (31+p.spacing)*p.zoom/100,
    tile(p) {
      const w=(36+p.spacing)*p.zoom/100, h=(31+p.spacing)*p.zoom/100, sw=p.stroke, hw=w/2, ox=p.x, oy=p.y;
      return `<polygon points="${hw+ox},${oy} ${w+ox},${h+oy} ${ox},${h+oy}" fill="${p.fg}" opacity="0.3"/>
              <polygon points="${hw+ox},${oy} ${w+ox},${h+oy} ${ox},${h+oy}" fill="none" stroke="${p.fg}" stroke-width="${sw}"/>
              <polygon points="${ox},${oy} ${w+ox},${oy} ${hw+ox},${h+oy}" fill="${p.accent}" opacity="0.15"/>
              <polygon points="${ox},${oy} ${w+ox},${oy} ${hw+ox},${h+oy}" fill="none" stroke="${p.accent}" stroke-width="${sw*0.7}"/>`;
    },
  },

  /* 6 — Octagon + Square */
  {
    id: 'octagon-tile', title: 'Octagon + Square', category: 'Geometric',
    keywords: ['octagon','eight','tile','stop','square'],
    defaults: { zoom:100, stroke:1.5, x:0, y:0, spacing:1, angle:0, bg:'#0a0a14', fg:'#22d3ee', accent:'#fbbf24' },
    tileW: p => (38+p.spacing)*p.zoom/100,
    tileH: p => (38+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(38+p.spacing)*p.zoom/100, t=sz*0.25, sw=p.stroke, ox=p.x, oy=p.y;
      const oct=`${t+ox},${oy} ${sz-t+ox},${oy} ${sz+ox},${t+oy} ${sz+ox},${sz-t+oy} ${sz-t+ox},${sz+oy} ${t+ox},${sz+oy} ${ox},${sz-t+oy} ${ox},${t+oy}`;
      return `<polygon points="${oct}" fill="${p.fg}" opacity="0.18"/>
              <polygon points="${oct}" fill="none" stroke="${p.fg}" stroke-width="${sw}"/>
              <rect x="${sz+ox}" y="${sz+oy}" width="${t}" height="${t}" fill="${p.accent}" opacity="0.7"/>`;
    },
  },

  /* 7 — Crosshatch */
  {
    id: 'crosshatch', title: 'Crosshatch', category: 'Geometric',
    keywords: ['cross','hatch','weave','diagonal','grid'],
    defaults: { zoom:100, stroke:1.2, x:0, y:0, spacing:0, angle:0, bg:'#0f172a', fg:'#64748b', accent:'#0ea5e9' },
    tileW: p => (24+p.spacing)*p.zoom/100,
    tileH: p => (24+p.spacing)*p.zoom/100,
    tile(p) {
      const sp=(24+p.spacing)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y;
      return `<line x1="${ox}" y1="${oy}" x2="${sp+ox}" y2="${sp+oy}" stroke="${p.fg}" stroke-width="${sw}" opacity="0.7"/>
              <line x1="${sp+ox}" y1="${oy}" x2="${ox}" y2="${sp+oy}" stroke="${p.accent}" stroke-width="${sw}" opacity="0.5"/>`;
    },
  },

  /* 8 — Moroccan Star */
  {
    id: 'moroccan', title: 'Moroccan Star', category: 'Geometric',
    keywords: ['moroccan','morocco','tile','ornament','islamic','star'],
    defaults: { zoom:100, stroke:1.5, x:0, y:0, spacing:2, angle:0, bg:'#1a0a2e', fg:'#c084fc', accent:'#fbbf24' },
    tileW: p => (50+p.spacing)*p.zoom/100,
    tileH: p => (50+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(50+p.spacing)*p.zoom/100, cx=sz/2+p.x, cy=sz/2+p.y, sw=p.stroke;
      const star=(cx,cy,r1,r2,n)=>Array.from({length:n*2},(_,i)=>{
        const a=(i/n)*Math.PI-(Math.PI/n), r=i%2===0?r1:r2;
        return `${(cx+r*Math.cos(a)).toFixed(2)},${(cy+r*Math.sin(a)).toFixed(2)}`;
      }).join(' ');
      const pts8=star(cx,cy,sz*0.44,sz*0.2,8);
      const pts4=star(cx,cy,sz*0.18,sz*0.1,4);
      return `<polygon points="${pts8}" fill="${p.fg}" opacity="0.25"/>
              <polygon points="${pts8}" fill="none" stroke="${p.fg}" stroke-width="${sw}"/>
              <polygon points="${pts4}" fill="${p.accent}" opacity="0.8"/>`;
    },
  },

  /* 9 — Fish Scales */
  {
    id: 'scallop', title: 'Fish Scales', category: 'Geometric',
    keywords: ['scallop','fish','scale','tile','arc'],
    defaults: { zoom:100, stroke:1.5, x:0, y:0, spacing:0, angle:0, bg:'#042f4f', fg:'#38bdf8', accent:'#0ea5e9' },
    tileW: p => (32+p.spacing)*p.zoom/100,
    tileH: p => (20+p.spacing)*p.zoom/100,
    tile(p) {
      const rw=(16+p.spacing*0.5)*p.zoom/100, rh=(12+p.spacing*0.25)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y;
      return `<path d="M${ox},${oy} A${rw},${rh} 0 0,1 ${rw*2+ox},${oy}" fill="${p.fg}" opacity="0.15"/>
              <path d="M${ox},${oy} A${rw},${rh} 0 0,1 ${rw*2+ox},${oy}" fill="none" stroke="${p.fg}" stroke-width="${sw}"/>
              <path d="M${rw+ox},${rh*0.5+oy} A${rw},${rh} 0 0,1 ${rw*3+ox},${rh*0.5+oy}" fill="${p.accent}" opacity="0.12"/>
              <path d="M${rw+ox},${rh*0.5+oy} A${rw},${rh} 0 0,1 ${rw*3+ox},${rh*0.5+oy}" fill="none" stroke="${p.accent}" stroke-width="${sw*0.7}"/>`;
    },
  },

  /* 10 — Brick Wall */
  {
    id: 'brick', title: 'Brick Wall', category: 'Geometric',
    keywords: ['brick','wall','masonry'],
    defaults: { zoom:100, stroke:1.5, x:0, y:0, spacing:0, angle:0, bg:'#2c1810', fg:'#b45309', accent:'#92400e' },
    tileW: p => (64+p.spacing)*p.zoom/100,
    tileH: p => (30+p.spacing*0.5)*p.zoom/100,
    tile(p) {
      const bw=(32+p.spacing*0.5)*p.zoom/100, bh=(15+p.spacing*0.25)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y;
      const rx=1*p.zoom/100;
      return `<rect x="${1+ox}" y="${1+oy}" width="${bw-2}" height="${bh-2}" fill="${p.fg}" opacity="0.45" rx="${rx}"/>
              <rect x="${bw+1+ox}" y="${1+oy}" width="${bw-2}" height="${bh-2}" fill="${p.fg}" opacity="0.45" rx="${rx}"/>
              <rect x="${bw/2+1+ox}" y="${bh+1+oy}" width="${bw-2}" height="${bh-2}" fill="${p.accent}" opacity="0.4" rx="${rx}"/>
              <rect x="${bw*1.5+1+ox}" y="${bh+1+oy}" width="${bw/2-2}" height="${bh-2}" fill="${p.accent}" opacity="0.4" rx="${rx}"/>
              <rect x="${ox}" y="${bh+1+oy}" width="${bw/2-2}" height="${bh-2}" fill="${p.accent}" opacity="0.4" rx="${rx}"/>`;
    },
  },

  /* 11 — Sunburst Rays */
  {
    id: 'sunburst', title: 'Sunburst Rays', category: 'Geometric',
    keywords: ['sunburst','ray','sun','radial','starburst'],
    defaults: { zoom:100, stroke:1.5, x:0, y:0, spacing:0, angle:0, bg:'#1a100a', fg:'#F5C518', accent:'#f97316' },
    tileW: p => (70+p.spacing)*p.zoom/100,
    tileH: p => (70+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(70+p.spacing)*p.zoom/100, cx=sz/2+p.x, cy=sz/2+p.y, sw=p.stroke, rays=16, z=p.zoom/100;
      let lines='';
      for(let i=0;i<rays;i++){
        const a=(i/rays)*Math.PI*2;
        const outer=i%2===0?sz*0.47:sz*0.38;
        lines+=`<line x1="${cx}" y1="${cy}" x2="${(cx+Math.cos(a)*outer).toFixed(2)}" y2="${(cy+Math.sin(a)*outer).toFixed(2)}" stroke="${i%2===0?p.fg:p.accent}" stroke-width="${i%2===0?sw:sw*0.6}"/>`;
      }
      return lines
        +`<circle cx="${cx}" cy="${cy}" r="${7*z}" fill="${p.accent}"/>`
        +`<circle cx="${cx}" cy="${cy}" r="${14*z}" fill="none" stroke="${p.fg}" stroke-width="${sw*0.4}" opacity="0.5"/>`;
    },
  },

  /* ═══ LINES (8) ════════════════════════════════════════ */

  /* 12 — Diagonal Stripes */
  {
    id: 'diagonal-stripes', title: 'Diagonal Stripes', category: 'Lines',
    keywords: ['stripe','diagonal','slant','band'],
    defaults: { zoom:100, stroke:5, x:0, y:0, spacing:0, angle:0, bg:'#111827', fg:'#F5C518', accent:'#E63946' },
    tileW: p => (24+p.spacing)*p.zoom/100,
    tileH: p => (24+p.spacing)*p.zoom/100,
    tile(p) {
      const sp=(24+p.spacing)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y;
      return `<line x1="${-sw+ox}" y1="${sp+sw+oy}" x2="${sp+sw+ox}" y2="${-sw+oy}" stroke="${p.fg}" stroke-width="${sw}"/>`;
    },
  },

  /* 13 — Zigzag */
  {
    id: 'zigzag', title: 'Zigzag', category: 'Lines',
    keywords: ['zigzag','zig','zag','lightning'],
    defaults: { zoom:100, stroke:2.5, x:0, y:0, spacing:0, angle:0, bg:'#111827', fg:'#F5C518', accent:'#fbbf24' },
    tileW: p => (44+p.spacing)*p.zoom/100,
    tileH: p => (16+p.spacing*0.5)*p.zoom/100,
    tile(p) {
      const w=(44+p.spacing)*p.zoom/100, h=(16+p.spacing*0.5)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y;
      return `<polyline points="${ox},${h+oy} ${w*0.25+ox},${oy} ${w*0.5+ox},${h+oy} ${w*0.75+ox},${oy} ${w+ox},${h+oy}" fill="none" stroke="${p.fg}" stroke-width="${sw}" stroke-linejoin="miter"/>`;
    },
  },

  /* 14 — Chevron */
  {
    id: 'chevron', title: 'Chevron', category: 'Lines',
    keywords: ['chevron','arrow','herringbone','v-shape'],
    defaults: { zoom:100, stroke:3, x:0, y:0, spacing:0, angle:0, bg:'#0f172a', fg:'#06B6D4', accent:'#0284c7' },
    tileW: p => (44+p.spacing)*p.zoom/100,
    tileH: p => (22+p.spacing)*p.zoom/100,
    tile(p) {
      const w=(44+p.spacing)*p.zoom/100, h=(22+p.spacing)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y;
      return `<polyline points="${ox},${h*0.5+oy} ${w*0.5+ox},${oy} ${w+ox},${h*0.5+oy}" fill="none" stroke="${p.fg}" stroke-width="${sw}" stroke-linecap="square" stroke-linejoin="miter"/>
              <polyline points="${ox},${h+oy} ${w*0.5+ox},${h*0.5+oy} ${w+ox},${h+oy}" fill="none" stroke="${p.accent}" stroke-width="${sw*0.6}" stroke-linecap="square" stroke-linejoin="miter"/>`;
    },
  },

  /* 15 — Dotted Lines */
  {
    id: 'dotted-lines', title: 'Dotted Lines', category: 'Lines',
    keywords: ['dotted','dashed','stipple'],
    defaults: { zoom:100, stroke:2.5, x:0, y:0, spacing:0, angle:0, bg:'#0f172a', fg:'#475569', accent:'#06B6D4' },
    tileW: p => (40+p.spacing)*p.zoom/100,
    tileH: p => (16+p.spacing)*p.zoom/100,
    tile(p) {
      const w=(40+p.spacing)*p.zoom/100, h=(16+p.spacing)*p.zoom/100, sw=p.stroke, d=sw*1.2, ox=p.x, oy=p.y;
      return `<line x1="${ox}" y1="${h/2+oy}" x2="${w+ox}" y2="${h/2+oy}" stroke="${p.fg}" stroke-width="${sw}" stroke-dasharray="${d} ${d*1.5}" stroke-linecap="round"/>`;
    },
  },

  /* 16 — Double Stripe */
  {
    id: 'double-stripe', title: 'Double Stripe', category: 'Lines',
    keywords: ['double','stripe','diagonal','parallel'],
    defaults: { zoom:100, stroke:3, x:0, y:0, spacing:0, angle:0, bg:'#1e0a38', fg:'#a78bfa', accent:'#7c3aed' },
    tileW: p => (36+p.spacing)*p.zoom/100,
    tileH: p => (36+p.spacing)*p.zoom/100,
    tile(p) {
      const sp=(36+p.spacing)*p.zoom/100, sw=p.stroke, g=9*p.zoom/100, ox=p.x, oy=p.y;
      return `<line x1="${ox}" y1="${sp+oy}" x2="${sp+ox}" y2="${oy}" stroke="${p.fg}" stroke-width="${sw}"/>
              <line x1="${g+ox}" y1="${sp+oy}" x2="${sp+g+ox}" y2="${oy}" stroke="${p.accent}" stroke-width="${sw*0.6}"/>`;
    },
  },

  /* 17 — Cross Grid */
  {
    id: 'cross-grid', title: 'Cross Grid', category: 'Lines',
    keywords: ['cross','plus','grid','hash'],
    defaults: { zoom:100, stroke:1.5, x:0, y:0, spacing:0, angle:0, bg:'#0f172a', fg:'#334155', accent:'#06B6D4' },
    tileW: p => (28+p.spacing)*p.zoom/100,
    tileH: p => (28+p.spacing)*p.zoom/100,
    tile(p) {
      const sp=(28+p.spacing)*p.zoom/100, sw=p.stroke, cx=sp/2+p.x, cy=sp/2+p.y, arm=6*p.zoom/100;
      return `<line x1="${cx-arm}" y1="${cy}" x2="${cx+arm}" y2="${cy}" stroke="${p.accent}" stroke-width="${sw*1.5}" stroke-linecap="round"/>
              <line x1="${cx}" y1="${cy-arm}" x2="${cx}" y2="${cy+arm}" stroke="${p.accent}" stroke-width="${sw*1.5}" stroke-linecap="round"/>
              <line x1="${p.x}" y1="${cy}" x2="${cx-arm}" y2="${cy}" stroke="${p.fg}" stroke-width="${sw*0.6}" opacity="0.4"/>
              <line x1="${cx+arm}" y1="${cy}" x2="${sp+p.x}" y2="${cy}" stroke="${p.fg}" stroke-width="${sw*0.6}" opacity="0.4"/>
              <line x1="${cx}" y1="${p.y}" x2="${cx}" y2="${cy-arm}" stroke="${p.fg}" stroke-width="${sw*0.6}" opacity="0.4"/>
              <line x1="${cx}" y1="${cy+arm}" x2="${cx}" y2="${sp+p.y}" stroke="${p.fg}" stroke-width="${sw*0.6}" opacity="0.4"/>`;
    },
  },

  /* 18 — Herringbone */
  {
    id: 'herringbone', title: 'Herringbone', category: 'Lines',
    keywords: ['herringbone','parquet','wood','floor'],
    defaults: { zoom:100, stroke:1, x:0, y:0, spacing:0, angle:0, bg:'#1c1006', fg:'#b45309', accent:'#78350f' },
    tileW: p => (44+p.spacing)*p.zoom/100,
    tileH: p => (44+p.spacing)*p.zoom/100,
    tile(p) {
      const u=(11+p.spacing*0.3)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y;
      return `<rect x="${ox}" y="${oy}" width="${u*2}" height="${u}" fill="${p.fg}" opacity="0.5" stroke="${p.fg}" stroke-width="${sw*0.5}"/>
              <rect x="${u*2+ox}" y="${u+oy}" width="${u}" height="${u*2}" fill="${p.accent}" opacity="0.4" stroke="${p.accent}" stroke-width="${sw*0.5}"/>
              <rect x="${ox}" y="${u*2+oy}" width="${u*2}" height="${u}" fill="${p.fg}" opacity="0.35" stroke="${p.fg}" stroke-width="${sw*0.5}"/>
              <rect x="${u+ox}" y="${u*3+oy}" width="${u}" height="${u}" fill="${p.accent}" opacity="0.25" stroke="${p.accent}" stroke-width="${sw*0.5}"/>`;
    },
  },

  /* 19 — Pinstripe */
  {
    id: 'pinstripe', title: 'Pinstripe', category: 'Lines',
    keywords: ['pin','stripe','thin','suit','subtle'],
    defaults: { zoom:100, stroke:0.7, x:0, y:0, spacing:0, angle:0, bg:'#111820', fg:'#4b5563', accent:'#374151' },
    tileW: p => (12+p.spacing)*p.zoom/100,
    tileH: p => (12+p.spacing)*p.zoom/100,
    tile(p) {
      const sp=(12+p.spacing)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y;
      return `<line x1="${ox}" y1="${sp+oy}" x2="${sp+ox}" y2="${oy}" stroke="${p.fg}" stroke-width="${sw}" opacity="0.6"/>
              <line x1="${sp*0.5+ox}" y1="${sp+oy}" x2="${sp*1.5+ox}" y2="${oy}" stroke="${p.accent}" stroke-width="${sw*0.5}" opacity="0.3"/>`;
    },
  },

  /* ═══ ABSTRACT (9) ══════════════════════════════════════ */

  /* 20 — Ocean Waves */
  {
    id: 'waves', title: 'Ocean Waves', category: 'Abstract',
    keywords: ['wave','sea','ocean','fluid','sinusoidal'],
    defaults: { zoom:100, stroke:2.5, x:0, y:0, spacing:2, angle:0, bg:'#0a1628', fg:'#0ea5e9', accent:'#38bdf8' },
    tileW: p => (64+p.spacing)*p.zoom/100,
    tileH: p => (24+p.spacing)*p.zoom/100,
    tile(p) {
      const w=(64+p.spacing)*p.zoom/100, h=(24+p.spacing)*p.zoom/100, sw=p.stroke, amp=6*p.zoom/100, ox=p.x, oy=p.y;
      const y1=h*0.38+oy, y2=h*0.72+oy;
      return `<path d="M${ox} ${y1} C${w*0.25+ox} ${y1-amp} ${w*0.25+ox} ${y1-amp} ${w*0.5+ox} ${y1} S${w*0.75+ox} ${y1+amp} ${w+ox} ${y1}" fill="none" stroke="${p.fg}" stroke-width="${sw}"/>
              <path d="M${ox} ${y2} C${w*0.25+ox} ${y2+amp} ${w*0.25+ox} ${y2+amp} ${w*0.5+ox} ${y2} S${w*0.75+ox} ${y2-amp} ${w+ox} ${y2}" fill="none" stroke="${p.accent}" stroke-width="${sw*0.7}" opacity="0.7"/>`;
    },
  },

  /* 21 — Rainbow Waves */
  {
    id: 'waves-multicolor', title: 'Rainbow Waves', category: 'Abstract',
    keywords: ['wave','color','rainbow','multi'],
    defaults: { zoom:100, stroke:2, x:0, y:0, spacing:1, angle:0, bg:'#0a0a14', fg:'#F5C518', accent:'#E63946' },
    tileW: p => (64+p.spacing)*p.zoom/100,
    tileH: p => (64+p.spacing)*p.zoom/100,
    tile(p) {
      const w=(64+p.spacing)*p.zoom/100, h=(64+p.spacing)*p.zoom/100, sw=p.stroke, amp=5*p.zoom/100, ox=p.x, oy=p.y;
      const colors=[p.fg,'#E63946','#06B6D4','#a78bfa',p.accent,'#34d399'];
      return colors.map((c,i)=>{
        const cy=((i+0.5)/colors.length)*h+oy;
        return `<path d="M${ox} ${cy} C${w*.25+ox} ${cy-amp} ${w*.25+ox} ${cy-amp} ${w*.5+ox} ${cy} S${w*.75+ox} ${cy+amp} ${w+ox} ${cy}" fill="none" stroke="${c}" stroke-width="${sw}"/>`;
      }).join('');
    },
  },

  /* 22 — Halftone */
  {
    id: 'halftone', title: 'Halftone', category: 'Abstract',
    keywords: ['halftone','print','dots','gradient'],
    defaults: { zoom:100, stroke:0, x:0, y:0, spacing:0, angle:0, bg:'#0f172a', fg:'#e2e8f0', accent:'#06B6D4' },
    tileW: p => (60+p.spacing)*p.zoom/100,
    tileH: p => (60+p.spacing)*p.zoom/100,
    tile(p) {
      const rows=5, cols=5, cs=(12+p.spacing*0.2)*p.zoom/100, ox=p.x, oy=p.y;
      let out='';
      for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){
        const maxR=cs*0.46, idx=r*cols+c, rad=maxR*(0.15+0.85*(idx/(rows*cols-1)));
        out+=`<circle cx="${c*cs+cs/2+ox}" cy="${r*cs+cs/2+oy}" r="${rad}" fill="${idx>rows*cols*0.6?p.accent:p.fg}"/>`;
      }
      return out;
    },
  },

  /* 23 — Memphis Style */
  {
    id: 'memphis', title: 'Memphis Style', category: 'Abstract',
    keywords: ['memphis','retro','80s','postmodern'],
    defaults: { zoom:100, stroke:2, x:0, y:0, spacing:0, angle:0, bg:'#0a0a0a', fg:'#F5C518', accent:'#E63946' },
    tileW: p => (70+p.spacing)*p.zoom/100,
    tileH: p => (70+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(70+p.spacing)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y, z=p.zoom/100;
      return `<circle cx="${sz*0.15+ox}" cy="${sz*0.18+oy}" r="${6*z}" fill="${p.fg}"/>
              <rect x="${sz*0.42+ox}" y="${sz*0.05+oy}" width="${16*z}" height="${16*z}" fill="none" stroke="${p.fg}" stroke-width="${sw}" transform="rotate(15 ${sz*0.5+ox} ${sz*0.13+oy})"/>
              <line x1="${sz*0.65+ox}" y1="${oy}" x2="${sz*0.65+ox}" y2="${sz*0.4+oy}" stroke="${p.accent}" stroke-width="${sw*1.5}"/>
              <polygon points="${sz*0.1+ox},${sz*0.52+oy} ${sz*0.22+ox},${sz*0.38+oy} ${sz*0.34+ox},${sz*0.52+oy}" fill="${p.accent}"/>
              <line x1="${sz*0.05+ox}" y1="${sz*0.7+oy}" x2="${sz*0.4+ox}" y2="${sz*0.92+oy}" stroke="${p.fg}" stroke-width="${sw*1.8}" stroke-linecap="round"/>
              <circle cx="${sz*0.78+ox}" cy="${sz*0.22+oy}" r="${4*z}" fill="none" stroke="${p.fg}" stroke-width="${sw}"/>
              <line x1="${sz*0.55+ox}" y1="${sz*0.62+oy}" x2="${sz*0.85+ox}" y2="${sz*0.82+oy}" stroke="${p.accent}" stroke-width="${sw*2.2}" stroke-linecap="round"/>
              <rect x="${sz*0.72+ox}" y="${sz*0.5+oy}" width="${10*z}" height="${10*z}" fill="${p.fg}" opacity="0.4"/>`;
    },
  },

  /* 24 — Confetti */
  {
    id: 'confetti', title: 'Confetti', category: 'Abstract',
    keywords: ['confetti','party','random','celebrate'],
    defaults: { zoom:100, stroke:0, x:0, y:0, spacing:0, angle:0, bg:'#080812', fg:'#F5C518', accent:'#E63946' },
    tileW: p => (70+p.spacing)*p.zoom/100,
    tileH: p => (70+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(70+p.spacing)*p.zoom/100, ox=p.x, oy=p.y, z=p.zoom/100;
      const cols=['#F5C518','#E63946','#06B6D4','#a78bfa','#34d399','#fb923c','#f472b6'];
      const items=[
        {x:.06,y:.08,w:10,h:4,rot:20,c:0},{x:.28,y:.05,w:5,h:5,rot:0,c:1,circ:true},
        {x:.55,y:.12,w:9,h:3,rot:-30,c:2},{x:.78,y:.08,w:5,h:5,rot:0,c:3,circ:true},
        {x:.12,y:.32,w:5,h:5,rot:0,c:4,circ:true},{x:.42,y:.28,w:11,h:3,rot:45,c:5},
        {x:.68,y:.35,w:5,h:5,rot:0,c:6,circ:true},{x:.85,y:.28,w:8,h:3,rot:-15,c:0},
        {x:.05,y:.58,w:9,h:3,rot:35,c:1},{x:.3,y:.62,w:5,h:5,rot:0,c:2,circ:true},
        {x:.58,y:.55,w:10,h:3,rot:-25,c:3},{x:.82,y:.6,w:5,h:5,rot:0,c:4,circ:true},
        {x:.15,y:.82,w:5,h:5,rot:0,c:5,circ:true},{x:.44,y:.85,w:8,h:3,rot:18,c:6},
        {x:.7,y:.78,w:5,h:5,rot:0,c:0,circ:true},{x:.9,y:.85,w:7,h:3,rot:-40,c:1},
      ];
      return items.map(it=>{
        const cx=it.x*sz+ox, cy=it.y*sz+oy, clr=cols[it.c], w=it.w*z, h=it.h*z;
        return it.circ
          ? `<circle cx="${cx}" cy="${cy}" r="${w*0.5}" fill="${clr}"/>`
          : `<rect x="${cx-w/2}" y="${cy-h/2}" width="${w}" height="${h}" fill="${clr}" transform="rotate(${it.rot} ${cx} ${cy})"/>`;
      }).join('');
    },
  },

  /* 25 — Rose Curve */
  {
    id: 'spirograph', title: 'Rose Curve', category: 'Abstract',
    keywords: ['spiral','rose','swirl','petal','mathematical'],
    defaults: { zoom:100, stroke:1.5, x:0, y:0, spacing:0, angle:0, bg:'#0f0820', fg:'#a78bfa', accent:'#7c3aed' },
    tileW: p => (64+p.spacing)*p.zoom/100,
    tileH: p => (64+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(64+p.spacing)*p.zoom/100, sw=p.stroke, cx=sz/2+p.x, cy=sz/2+p.y, R=sz*0.44;
      let d='', d2='';
      for(let i=0;i<=360;i+=4){
        const a=i*Math.PI/180;
        d+=(i===0?'M':'L')+(cx+R*Math.cos(3*a)*Math.cos(a)).toFixed(2)+','+(cy+R*Math.cos(3*a)*Math.sin(a)).toFixed(2);
        d2+=(i===0?'M':'L')+(cx+(R*0.5)*Math.cos(5*a)*Math.cos(a)).toFixed(2)+','+(cy+(R*0.5)*Math.cos(5*a)*Math.sin(a)).toFixed(2);
      }
      return `<path d="${d}Z" fill="${p.fg}" opacity="0.1"/>
              <path d="${d}Z" fill="none" stroke="${p.fg}" stroke-width="${sw}"/>
              <path d="${d2}Z" fill="none" stroke="${p.accent}" stroke-width="${sw*0.7}" opacity="0.6"/>`;
    },
  },

  /* 26 — Voronoi Cells */
  {
    id: 'voronoi', title: 'Voronoi Cells', category: 'Abstract',
    keywords: ['voronoi','cell','tessellation','irregular'],
    defaults: { zoom:100, stroke:1.5, x:0, y:0, spacing:0, angle:0, bg:'#042020', fg:'#34d399', accent:'#059669' },
    tileW: p => (80+p.spacing)*p.zoom/100,
    tileH: p => (80+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(80+p.spacing)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y;
      const sc=(x,y)=>`${(x*sz+ox).toFixed(1)},${(y*sz+oy).toFixed(1)}`;
      const polys=[
        [[0,0],[.38,0],[.32,.3],[.12,.42]],
        [[.38,0],[1,0],[.88,.25],[.62,.2],[.32,.3]],
        [[0,.42],[.12,.42],[.32,.3],[.38,.62],[.15,.72],[0,.9]],
        [[.32,.3],[.62,.2],[.68,.58],[.38,.62]],
        [[.62,.2],[.88,.25],[1,.48],[.82,.78],[.68,.58]],
        [[0,.9],[.15,.72],[.38,.62],[.52,1],[0,1]],
        [[.38,.62],[.68,.58],[.6,1],[.52,1]],
        [[.68,.58],[.82,.78],[1,1],[.6,1]],
        [[.88,.25],[1,.48],[1,0]],
        [[1,.48],[.82,.78],[1,1]],
      ];
      return polys.map((pts,i)=>{
        const joined=pts.map(([x,y])=>sc(x,y)).join(' ');
        return `<polygon points="${joined}" fill="${p.fg}" opacity="${0.05+i*0.015}"/>
                <polygon points="${joined}" fill="none" stroke="${p.fg}" stroke-width="${sw}" opacity="0.8"/>`;
      }).join('');
    },
  },

  /* 27 — Labyrinth */
  {
    id: 'maze', title: 'Labyrinth', category: 'Abstract',
    keywords: ['maze','labyrinth','path','puzzle'],
    defaults: { zoom:100, stroke:2.5, x:0, y:0, spacing:0, angle:0, bg:'#0a0a0a', fg:'#22d3ee', accent:'#0891b2' },
    tileW: p => (64+p.spacing)*p.zoom/100,
    tileH: p => (64+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(64+p.spacing)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y;
      const s=v=>v*sz;
      const segs=[
        [0,0,.5,0],[0,0,0,.33],[.25,0,.25,.25],[.5,0,.5,.17],
        [.75,0,.75,.33],[1,0,1,.5],[.5,.17,1,.17],
        [0,.33,.25,.33],[.5,.33,.75,.33],[.25,.5,.25,.25],
        [0,.5,.25,.5],[.5,.5,.75,.5],[.75,.5,1,.5],
        [.25,.75,.25,.5],[.5,.67,.5,.5],[.75,.67,.75,.5],
        [0,.67,.25,.67],[.5,.67,1,.67],[0,.83,.5,.83],
        [.25,.75,.5,.75],[.75,.83,.75,1],[1,.67,1,1],
        [0,.83,0,1],[0,1,.5,1],[.5,.83,.5,1],
      ];
      return segs.map(([x1,y1,x2,y2])=>`<line x1="${s(x1)+ox}" y1="${s(y1)+oy}" x2="${s(x2)+ox}" y2="${s(y2)+oy}" stroke="${p.fg}" stroke-width="${sw}" stroke-linecap="square"/>`).join('');
    },
  },

  /* 28 — Bubble Wrap */
  {
    id: 'bubble-wrap', title: 'Bubble Wrap', category: 'Abstract',
    keywords: ['bubble','circle','wrap','sphere','round'],
    defaults: { zoom:100, stroke:1.5, x:0, y:0, spacing:0, angle:0, bg:'#060e1a', fg:'#38bdf8', accent:'#7dd3fc' },
    tileW: p => (56+p.spacing)*p.zoom/100,
    tileH: p => (56+p.spacing)*p.zoom/100,
    tile(p) {
      const sp=(28+p.spacing*0.5)*p.zoom/100, r=sp*0.42, sw=p.stroke, ox=p.x, oy=p.y;
      const bubble=(cx,cy)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${p.fg}" opacity="0.06"/>
              <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${p.fg}" stroke-width="${sw}"/>
              <circle cx="${(cx-r*0.32).toFixed(1)}" cy="${(cy-r*0.32).toFixed(1)}" r="${r*0.18}" fill="${p.accent}" opacity="0.6"/>`;
      return bubble(sp/2+ox,sp/2+oy)+bubble(sp+sp/2+ox,sp/2+oy)+bubble(sp/2+ox,sp+sp/2+oy)+bubble(sp+sp/2+ox,sp+sp/2+oy);
    },
  },

  /* ═══ ORGANIC (7) ═══════════════════════════════════════ */

  /* 29 — Flower Bloom */
  {
    id: 'floral', title: 'Flower Bloom', category: 'Organic',
    keywords: ['flower','petal','nature','bloom'],
    defaults: { zoom:100, stroke:1.2, x:0, y:0, spacing:0, angle:0, bg:'#0a0820', fg:'#f472b6', accent:'#fbbf24' },
    tileW: p => (54+p.spacing)*p.zoom/100,
    tileH: p => (54+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(54+p.spacing)*p.zoom/100, cx=sz/2+p.x, cy=sz/2+p.y, r=12*p.zoom/100, sw=p.stroke;
      let petals='';
      for(let i=0;i<6;i++){
        const a=(i/6)*Math.PI*2;
        const ex=(cx+r*Math.cos(a)).toFixed(2), ey=(cy+r*Math.sin(a)).toFixed(2);
        petals+=`<ellipse cx="${ex}" cy="${ey}" rx="${r*1.2}" ry="${r*0.5}" fill="${p.fg}" opacity="0.35" transform="rotate(${(a*180/Math.PI+90).toFixed(1)} ${ex} ${ey})"/>`;
      }
      return petals
        +`<circle cx="${cx}" cy="${cy}" r="${5.5*p.zoom/100}" fill="${p.accent}"/>`
        +`<circle cx="${cx}" cy="${cy}" r="${5.5*p.zoom/100}" fill="none" stroke="${p.fg}" stroke-width="${sw*0.8}" opacity="0.6"/>`;
    },
  },

  /* 30 — Leaf Pattern */
  {
    id: 'leaves', title: 'Leaf Pattern', category: 'Organic',
    keywords: ['leaf','nature','plant','botanic'],
    defaults: { zoom:100, stroke:1.2, x:0, y:0, spacing:0, angle:0, bg:'#031c03', fg:'#4ade80', accent:'#16a34a' },
    tileW: p => (44+p.spacing)*p.zoom/100,
    tileH: p => (44+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(44+p.spacing)*p.zoom/100, ox=p.x, oy=p.y, rx=11*p.zoom/100, ry=5*p.zoom/100, sw=p.stroke;
      const leaf=(cx,cy,rot)=>{
        const rad=rot*Math.PI/180;
        const lx1=(cx-rx*Math.cos(rad)).toFixed(2), ly1=(cy-rx*Math.sin(rad)).toFixed(2);
        const lx2=(cx+rx*Math.cos(rad)).toFixed(2), ly2=(cy+rx*Math.sin(rad)).toFixed(2);
        return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${p.fg}" opacity="0.4" transform="rotate(${rot} ${cx} ${cy})"/>
                <line x1="${lx1}" y1="${ly1}" x2="${lx2}" y2="${ly2}" stroke="${p.accent}" stroke-width="${sw*0.9}"/>`;
      };
      return leaf(sz*0.27+ox,sz*0.27+oy,-35)+leaf(sz*0.73+ox,sz*0.73+oy,55)+leaf(sz*0.73+ox,sz*0.27+oy,35);
    },
  },

  /* 31 — Topographic */
  {
    id: 'topographic', title: 'Topographic', category: 'Organic',
    keywords: ['topo','contour','map','terrain'],
    defaults: { zoom:100, stroke:1.2, x:0, y:0, spacing:0, angle:0, bg:'#0b1a0e', fg:'#86efac', accent:'#4ade80' },
    tileW: p => (90+p.spacing)*p.zoom/100,
    tileH: p => (60+p.spacing)*p.zoom/100,
    tile(p) {
      const w=(90+p.spacing)*p.zoom/100, h=(60+p.spacing)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y, z=p.zoom/100;
      const row=(y,a1,a2,a3)=>`<path d="M${ox} ${y+oy} C${w*.2+ox} ${y-a1+oy} ${w*.4+ox} ${y+a2+oy} ${w*.6+ox} ${y-a1*0.5+oy} S${w*.8+ox} ${y+a3+oy} ${w+ox} ${y+oy}" fill="none" stroke="${p.fg}" stroke-width="${sw}" opacity="0.7"/>`;
      return row(h*.15,8*z,5*z,4*z)+row(h*.32,6*z,9*z,7*z)+row(h*.5,9*z,4*z,6*z)+row(h*.68,5*z,8*z,3*z)+row(h*.84,7*z,6*z,5*z);
    },
  },

  /* 32 — Stone Pebbles */
  {
    id: 'pebbles', title: 'Stone Pebbles', category: 'Organic',
    keywords: ['pebble','stone','rock','organic'],
    defaults: { zoom:100, stroke:1.2, x:0, y:0, spacing:0, angle:0, bg:'#1c1c1f', fg:'#6b7280', accent:'#9ca3af' },
    tileW: p => (70+p.spacing)*p.zoom/100,
    tileH: p => (70+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(70+p.spacing)*p.zoom/100, ox=p.x, oy=p.y, sw=p.stroke;
      const st=[{cx:.18,cy:.22,rx:.13,ry:.09,r:22},{cx:.55,cy:.16,rx:.10,ry:.12,r:-15},
               {cx:.82,cy:.42,rx:.11,ry:.09,r:30},{cx:.22,cy:.65,rx:.12,ry:.13,r:-12},
               {cx:.65,cy:.68,rx:.13,ry:.10,r:18},{cx:.42,cy:.42,rx:.09,ry:.11,r:5}];
      return st.map(s=>`<ellipse cx="${s.cx*sz+ox}" cy="${s.cy*sz+oy}" rx="${s.rx*sz}" ry="${s.ry*sz}" fill="${p.fg}" opacity="0.35" transform="rotate(${s.r} ${s.cx*sz+ox} ${s.cy*sz+oy})"/>
              <ellipse cx="${s.cx*sz+ox}" cy="${s.cy*sz+oy}" rx="${s.rx*sz}" ry="${s.ry*sz}" fill="none" stroke="${p.accent}" stroke-width="${sw}" opacity="0.6" transform="rotate(${s.r} ${s.cx*sz+ox} ${s.cy*sz+oy})"/>`).join('');
    },
  },

  /* 33 — Bio Cells */
  {
    id: 'cells', title: 'Bio Cells', category: 'Organic',
    keywords: ['cell','bio','organic','biology'],
    defaults: { zoom:100, stroke:1.5, x:0, y:0, spacing:0, angle:0, bg:'#04071a', fg:'#818cf8', accent:'#c084fc' },
    tileW: p => 70*p.zoom/100,
    tileH: p => 70*p.zoom/100,
    tile(p) {
      const sc=p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y, t=v=>v*sc;
      return `<path d="M${t(12)+ox},${t(12)+oy} C${t(24)+ox},${t(3)+oy} ${t(42)+ox},${t(6)+oy} ${t(50)+ox},${t(22)+oy} C${t(58)+ox},${t(38)+oy} ${t(46)+ox},${t(56)+oy} ${t(30)+ox},${t(58)+oy} C${t(14)+ox},${t(60)+oy} ${t(2)+ox},${t(46)+oy} ${t(4)+ox},${t(30)+oy} C${t(6)+ox},${t(14)+oy} ${t(0)+ox},${t(21)+oy} ${t(12)+ox},${t(12)+oy}Z" fill="${p.fg}" opacity="0.12"/>
              <path d="M${t(12)+ox},${t(12)+oy} C${t(24)+ox},${t(3)+oy} ${t(42)+ox},${t(6)+oy} ${t(50)+ox},${t(22)+oy} C${t(58)+ox},${t(38)+oy} ${t(46)+ox},${t(56)+oy} ${t(30)+ox},${t(58)+oy} C${t(14)+ox},${t(60)+oy} ${t(2)+ox},${t(46)+oy} ${t(4)+ox},${t(30)+oy} C${t(6)+ox},${t(14)+oy} ${t(0)+ox},${t(21)+oy} ${t(12)+ox},${t(12)+oy}Z" fill="none" stroke="${p.fg}" stroke-width="${sw}"/>
              <circle cx="${t(28)+ox}" cy="${t(26)+oy}" r="${t(6)}" fill="${p.accent}" opacity="0.7"/>
              <path d="M${t(40)+ox},${t(34)+oy} C${t(58)+ox},${t(28)+oy} ${t(68)+ox},${t(48)+oy} ${t(60)+ox},${t(62)+oy} C${t(52)+ox},${t(72)+oy} ${t(38)+ox},${t(70)+oy} ${t(34)+ox},${t(60)+oy} C${t(30)+ox},${t(50)+oy} ${t(32)+ox},${t(38)+oy} ${t(40)+ox},${t(34)+oy}Z" fill="none" stroke="${p.accent}" stroke-width="${sw*0.8}" opacity="0.55"/>`;
    },
  },

  /* 34 — Wood Grain */
  {
    id: 'wood-bark', title: 'Wood Grain', category: 'Organic',
    keywords: ['wood','bark','grain','tree'],
    defaults: { zoom:100, stroke:1.2, x:0, y:0, spacing:0, angle:0, bg:'#1c0e04', fg:'#b45309', accent:'#92400e' },
    tileW: p => (44+p.spacing)*p.zoom/100,
    tileH: p => (70+p.spacing)*p.zoom/100,
    tile(p) {
      const w=(44+p.spacing)*p.zoom/100, h=(70+p.spacing)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y;
      const offsets=[0.06,0.18,0.3,0.42,0.56,0.68,0.8,0.92];
      return offsets.map((t,i)=>{
        const x=t*w+ox, a=(2.5+i%3*1.5)*p.zoom/100, b=(2+i%2*2)*p.zoom/100;
        return `<path d="M${x} ${oy} C${x+a} ${h*.25+oy} ${x-b} ${h*.5+oy} ${x+a*.5} ${h*.75+oy} C${x-a} ${h*.88+oy} ${x} ${h+oy} ${x} ${h+oy}" fill="none" stroke="${i%2===0?p.fg:p.accent}" stroke-width="${sw}" opacity="${0.3+i*0.07}"/>`;
      }).join('');
    },
  },

  /* 35 — Golden Spiral */
  {
    id: 'fibonacci', title: 'Golden Spiral', category: 'Organic',
    keywords: ['fibonacci','golden','spiral','nature','ratio'],
    defaults: { zoom:100, stroke:1.8, x:0, y:0, spacing:0, angle:0, bg:'#0a0820', fg:'#c084fc', accent:'#a855f7' },
    tileW: p => (70+p.spacing)*p.zoom/100,
    tileH: p => (70+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(70+p.spacing)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y;
      const b=[{x:0,y:0,w:.56,h:.56},{x:.56,y:0,w:.44,h:.34},{x:.56,y:.34,w:.27,h:.22},{x:.73,y:.56,w:.27,h:.44},{x:0,y:.56,w:.43,h:.44}];
      const arcs=[
        `M${.56*sz+ox},${oy} A${.56*sz},${.56*sz} 0 0,1 ${ox},${.56*sz+oy}`,
        `M${sz+ox},${oy} A${.44*sz},${.34*sz} 0 0,0 ${.56*sz+ox},${.34*sz+oy}`,
        `M${.56*sz+ox},${.56*sz+oy} A${.27*sz},${.22*sz} 0 0,1 ${.83*sz+ox},${.34*sz+oy}`,
      ];
      return b.map((bb,i)=>`<rect x="${bb.x*sz+ox}" y="${bb.y*sz+oy}" width="${bb.w*sz}" height="${bb.h*sz}" fill="none" stroke="${p.fg}" stroke-width="${sw}" opacity="${0.7-i*0.08}"/>`).join('')
        +arcs.map(d=>`<path d="${d}" fill="none" stroke="${p.accent}" stroke-width="${sw*1.4}" opacity="0.7"/>`).join('');
    },
  },

  /* ═══ MINIMAL (6) ════════════════════════════════════════ */

  /* 36 — Dot Grid */
  {
    id: 'dot-grid', title: 'Dot Grid', category: 'Minimal',
    keywords: ['dot','minimal','grid','notebook'],
    defaults: { zoom:100, stroke:0, x:0, y:0, spacing:0, angle:0, bg:'#0f172a', fg:'#4b5563', accent:'#06B6D4' },
    tileW: p => (22+p.spacing)*p.zoom/100,
    tileH: p => (22+p.spacing)*p.zoom/100,
    tile(p) {
      const sp=(22+p.spacing)*p.zoom/100, r=2*p.zoom/100;
      return `<circle cx="${sp/2+p.x}" cy="${sp/2+p.y}" r="${r}" fill="${p.fg}"/>`;
    },
  },

  /* 37 — Graph Paper */
  {
    id: 'graph-paper', title: 'Graph Paper', category: 'Minimal',
    keywords: ['graph','paper','grid','notebook','ruled'],
    defaults: { zoom:100, stroke:0.7, x:0, y:0, spacing:0, angle:0, bg:'#0c1220', fg:'#1e3a5f', accent:'#1d4ed8' },
    tileW: p => (40+p.spacing)*p.zoom/100,
    tileH: p => (40+p.spacing)*p.zoom/100,
    tile(p) {
      const sm=(8+p.spacing*0.2)*p.zoom/100, lg=(40+p.spacing)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y;
      let out='';
      for(let i=0;i<=5;i++){
        const major=i%5===0;
        out+=`<line x1="${i*sm+ox}" y1="${oy}" x2="${i*sm+ox}" y2="${lg+oy}" stroke="${major?p.accent:p.fg}" stroke-width="${sw*(major?1:0.5)}" opacity="${major?0.6:0.2}"/>`;
        out+=`<line x1="${ox}" y1="${i*sm+oy}" x2="${lg+ox}" y2="${i*sm+oy}" stroke="${major?p.accent:p.fg}" stroke-width="${sw*(major?1:0.5)}" opacity="${major?0.6:0.2}"/>`;
      }
      return out;
    },
  },

  /* 38 — Carbon Fiber */
  {
    id: 'carbon-fiber', title: 'Carbon Fiber', category: 'Minimal',
    keywords: ['carbon','fiber','weave','tech','material'],
    defaults: { zoom:100, stroke:0.5, x:0, y:0, spacing:0, angle:0, bg:'#0a0a0a', fg:'#27272a', accent:'#3f3f46' },
    tileW: p => (10+p.spacing*0.4)*p.zoom/100*2,
    tileH: p => (10+p.spacing*0.4)*p.zoom/100*2,
    tile(p) {
      const sz=(10+p.spacing*0.4)*p.zoom/100, hsz=sz/2, sw=p.stroke, ox=p.x, oy=p.y;
      return `<rect x="${ox}" y="${oy}" width="${hsz}" height="${sz}" fill="${p.accent}" stroke="${p.fg}" stroke-width="${sw}"/>
              <rect x="${hsz+ox}" y="${oy}" width="${hsz}" height="${sz}" fill="${p.fg}" stroke="${p.accent}" stroke-width="${sw}"/>
              <rect x="${ox}" y="${sz+oy}" width="${hsz}" height="${sz}" fill="${p.fg}" stroke="${p.accent}" stroke-width="${sw}"/>
              <rect x="${hsz+ox}" y="${sz+oy}" width="${hsz}" height="${sz}" fill="${p.accent}" stroke="${p.fg}" stroke-width="${sw}"/>`;
    },
  },

  /* 39 — Houndstooth */
  {
    id: 'houndstooth', title: 'Houndstooth', category: 'Minimal',
    keywords: ['houndstooth','fashion','classic','plaid'],
    defaults: { zoom:100, stroke:0, x:0, y:0, spacing:0, angle:0, bg:'#0f0f0f', fg:'#d1d5db', accent:'#6b7280' },
    tileW: p => (20+p.spacing)*p.zoom/100*2,
    tileH: p => (20+p.spacing)*p.zoom/100*2,
    tile(p) {
      const sz=(20+p.spacing)*p.zoom/100, ox=p.x, oy=p.y;
      return `<polygon points="${ox},${oy} ${sz+ox},${oy} ${sz+ox},${sz*0.5+oy} ${sz*0.5+ox},${sz*0.5+oy} ${sz*0.5+ox},${sz+oy} ${ox},${sz+oy}" fill="${p.fg}"/>
              <polygon points="${sz+ox},${sz+oy} ${sz*2+ox},${sz+oy} ${sz*2+ox},${sz*1.5+oy} ${sz*1.5+ox},${sz*1.5+oy} ${sz*1.5+ox},${sz*2+oy} ${sz+ox},${sz*2+oy}" fill="${p.fg}"/>
              <polygon points="${sz+ox},${oy} ${sz*2+ox},${oy} ${sz*2+ox},${sz*0.5+oy} ${sz*1.5+ox},${sz*0.5+oy} ${sz*1.5+ox},${sz+oy} ${sz+ox},${sz+oy}" fill="${p.accent}" opacity="0.4"/>`;
    },
  },

  /* 40 — Scattered Dots */
  {
    id: 'scattered-dots', title: 'Scattered Dots', category: 'Minimal',
    keywords: ['dot','scatter','random','minimal'],
    defaults: { zoom:100, stroke:0, x:0, y:0, spacing:0, angle:0, bg:'#0f172a', fg:'#374151', accent:'#4b5563' },
    tileW: p => (56+p.spacing)*p.zoom/100,
    tileH: p => (56+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(56+p.spacing)*p.zoom/100, ox=p.x, oy=p.y;
      const pts=[{x:.08,y:.12,r:2.5},{x:.34,y:.07,r:1.8},{x:.65,y:.18,r:2.2},{x:.88,y:.08,r:1.5},
                 {x:.14,y:.44,r:2},{x:.5,y:.38,r:3},{x:.78,y:.52,r:1.8},{x:.05,y:.7,r:2.5},
                 {x:.32,y:.75,r:1.5},{x:.62,y:.68,r:2},{x:.88,y:.82,r:2.5},{x:.45,y:.88,r:1.8}];
      return pts.map(pt=>`<circle cx="${pt.x*sz+ox}" cy="${pt.y*sz+oy}" r="${pt.r*p.zoom/100}" fill="${p.fg}"/>`).join('');
    },
  },

  /* 41 — Subtle Noise */
  {
    id: 'noise-subtle', title: 'Subtle Noise', category: 'Minimal',
    keywords: ['noise','grain','texture','film','subtle'],
    defaults: { zoom:100, stroke:0, x:0, y:0, spacing:0, angle:0, bg:'#111114', fg:'#27272a', accent:'#3f3f46' },
    tileW: p => (56+p.spacing)*p.zoom/100,
    tileH: p => (56+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(56+p.spacing)*p.zoom/100, ox=p.x, oy=p.y, z=p.zoom/100;
      const pts=[
        {x:.04,y:.09,s:2},{x:.18,y:.03,s:1.5},{x:.32,y:.15,s:2.5},{x:.48,y:.06,s:1.8},{x:.62,y:.2,s:2},{x:.76,y:.08,s:1.5},{x:.9,y:.14,s:2.2},
        {x:.1,y:.32,s:1.8},{x:.26,y:.42,s:2.5},{x:.44,y:.35,s:1.5},{x:.58,y:.48,s:2},{x:.74,y:.38,s:2.2},{x:.88,y:.45,s:1.5},
        {x:.06,y:.62,s:2.5},{x:.22,y:.7,s:1.5},{x:.38,y:.58,s:2},{x:.54,y:.72,s:2.5},{x:.7,y:.62,s:1.8},{x:.86,y:.75,s:2},
        {x:.12,y:.88,s:1.5},{x:.3,y:.92,s:2.2},{x:.5,y:.85,s:1.8},{x:.66,y:.9,s:2.5},{x:.82,y:.88,s:1.5},{x:.96,y:.92,s:2},
      ];
      return pts.map((pt,i)=>`<rect x="${pt.x*sz+ox}" y="${pt.y*sz+oy}" width="${pt.s*z}" height="${pt.s*z}" fill="${i%3===0?p.accent:p.fg}" opacity="${0.3+i%4*0.15}" transform="rotate(${i*13%45} ${pt.x*sz+ox+pt.s*z*0.5} ${pt.y*sz+oy+pt.s*z*0.5})"/>`).join('');
    },
  },

  /* ═══ TECH (9) ════════════════════════════════════════════ */

  /* 42 — Isometric Grid */
  {
    id: 'isometric', title: 'Isometric Grid', category: 'Tech',
    keywords: ['iso','isometric','3d','grid'],
    defaults: { zoom:100, stroke:1, x:0, y:0, spacing:0, angle:0, bg:'#050d1a', fg:'#0ea5e9', accent:'#0369a1' },
    tileW: p => (60+p.spacing)*p.zoom/100,
    tileH: p => (35+p.spacing*0.5)*p.zoom/100,
    tile(p) {
      const w=(60+p.spacing)*p.zoom/100, h=(35+p.spacing*0.5)*p.zoom/100, sw=p.stroke, hw=w/2, ox=p.x, oy=p.y;
      return `<line x1="${ox}" y1="${oy}" x2="${hw+ox}" y2="${h+oy}" stroke="${p.fg}" stroke-width="${sw}"/>
              <line x1="${w+ox}" y1="${oy}" x2="${hw+ox}" y2="${h+oy}" stroke="${p.fg}" stroke-width="${sw}"/>
              <line x1="${ox}" y1="${oy}" x2="${w+ox}" y2="${oy}" stroke="${p.accent}" stroke-width="${sw*0.8}"/>`;
    },
  },

  /* 43 — Isometric Cubes */
  {
    id: 'isometric-blocks', title: 'Isometric Cubes', category: 'Tech',
    keywords: ['iso','block','3d','cube','isometric'],
    defaults: { zoom:100, stroke:1, x:0, y:0, spacing:0, angle:0, bg:'#050d1a', fg:'#0ea5e9', accent:'#0284c7' },
    tileW: p => (60+p.spacing)*p.zoom/100,
    tileH: p => (52+p.spacing)*p.zoom/100,
    tile(p) {
      const w=(60+p.spacing)*p.zoom/100, h=(52+p.spacing)*p.zoom/100, hw=w/2, qh=h/4, sw=p.stroke, ox=p.x, oy=p.y;
      const top=`M${hw+ox},${oy} L${w+ox},${qh+oy} L${hw+ox},${h/2+oy} L${ox},${qh+oy}Z`;
      const lft=`M${ox},${qh+oy} L${hw+ox},${h/2+oy} L${hw+ox},${h+oy} L${ox},${h*0.75+oy}Z`;
      const rgt=`M${hw+ox},${h/2+oy} L${w+ox},${qh+oy} L${w+ox},${h*0.75+oy} L${hw+ox},${h+oy}Z`;
      return `<path d="${top}" fill="${p.fg}" opacity="0.65"/>
              <path d="${lft}" fill="${p.accent}" opacity="0.45"/>
              <path d="${rgt}" fill="${p.fg}" opacity="0.25"/>
              <path d="${top}${lft}${rgt}" fill="none" stroke="${p.fg}" stroke-width="${sw*0.6}" opacity="0.7"/>`;
    },
  },

  /* 44 — Circuit Board */
  {
    id: 'circuit', title: 'Circuit Board', category: 'Tech',
    keywords: ['circuit','pcb','tech','electronic'],
    defaults: { zoom:100, stroke:1.5, x:0, y:0, spacing:0, angle:0, bg:'#010d04', fg:'#22c55e', accent:'#4ade80' },
    tileW: p => (70+p.spacing)*p.zoom/100,
    tileH: p => (70+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(70+p.spacing)*p.zoom/100, sw=p.stroke, r=3*p.zoom/100, ox=p.x, oy=p.y;
      const pads=[{cx:.28,cy:.5},{cx:.72,cy:.5},{cx:.5,cy:.18},{cx:.5,cy:.82}];
      return `<polyline points="${sz*.08+ox},${sz*.5+oy} ${sz*.28+ox},${sz*.5+oy} ${sz*.28+ox},${sz*.18+oy} ${sz*.72+ox},${sz*.18+oy} ${sz*.72+ox},${sz*.5+oy} ${sz*.92+ox},${sz*.5+oy}" fill="none" stroke="${p.fg}" stroke-width="${sw}"/>
              <polyline points="${sz*.5+ox},${sz*.5+oy} ${sz*.5+ox},${sz*.82+oy} ${sz*.82+ox},${sz*.82+oy}" fill="none" stroke="${p.accent}" stroke-width="${sw}"/>
              <line x1="${sz*.08+ox}" y1="${sz*.68+oy}" x2="${sz*.28+ox}" y2="${sz*.68+oy}" stroke="${p.fg}" stroke-width="${sw*0.7}" stroke-dasharray="${2.5*p.zoom/100} ${2.5*p.zoom/100}"/>
              ${pads.map(c=>`<circle cx="${c.cx*sz+ox}" cy="${c.cy*sz+oy}" r="${r}" fill="${p.fg}"/><circle cx="${c.cx*sz+ox}" cy="${c.cy*sz+oy}" r="${r*2}" fill="none" stroke="${p.fg}" stroke-width="${sw*0.4}"/>`).join('')}`;
    },
  },

  /* 45 — Radar Sweep */
  {
    id: 'radar', title: 'Radar Sweep', category: 'Tech',
    keywords: ['radar','sonar','scan','circular','ring'],
    defaults: { zoom:100, stroke:1, x:0, y:0, spacing:0, angle:0, bg:'#010d04', fg:'#22c55e', accent:'#4ade80' },
    tileW: p => (70+p.spacing)*p.zoom/100,
    tileH: p => (70+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(70+p.spacing)*p.zoom/100, cx=sz/2+p.x, cy=sz/2+p.y, sw=p.stroke;
      return [.12,.25,.38].map((r,i)=>`<circle cx="${cx}" cy="${cy}" r="${r*sz}" fill="none" stroke="${p.fg}" stroke-width="${sw}" opacity="${0.7-i*0.15}"/>`).join('')
        +`<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy-sz*0.37}" stroke="${p.fg}" stroke-width="${sw}" opacity="0.5"/>
           <line x1="${cx}" y1="${cy}" x2="${cx+sz*0.37}" y2="${cy}" stroke="${p.fg}" stroke-width="${sw}" opacity="0.3"/>
           <line x1="${cx}" y1="${cy}" x2="${(cx+sz*0.26).toFixed(2)}" y2="${(cy-sz*0.26).toFixed(2)}" stroke="${p.accent}" stroke-width="${sw*2}" opacity="0.7"/>
           <circle cx="${(cx+sz*0.21).toFixed(2)}" cy="${(cy-sz*0.11).toFixed(2)}" r="${3*p.zoom/100}" fill="${p.accent}"/>`;
    },
  },

  /* 46 — Digital Rain */
  {
    id: 'matrix', title: 'Digital Rain', category: 'Tech',
    keywords: ['matrix','binary','code','digital','rain'],
    defaults: { zoom:100, stroke:0, x:0, y:0, spacing:0, angle:0, bg:'#010d04', fg:'#22c55e', accent:'#a7f3d0' },
    tileW: p => (60+p.spacing)*p.zoom/100,
    tileH: p => (60+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(60+p.spacing)*p.zoom/100, fs=7*p.zoom/100, ox=p.x, oy=p.y;
      const cols=[['1','0','1','0','1','1'],['0','1','0','1','0','0'],['1','1','0','0','1','0'],['0','0','1','1','0','1'],['1','0','0','1','1','0']];
      let out='';
      cols.forEach((col,ci)=>{
        col.forEach((c,ri)=>{
          const x=ci*(sz/cols.length)+sz*0.04+ox, y=ri*(sz/5.5)+fs+oy;
          out+=`<text x="${x}" y="${y}" font-size="${fs}" fill="${ri===0?p.accent:p.fg}" opacity="${ri===0?0.95:0.15+(ri*0.12)}" font-family="monospace" font-weight="bold">${c}</text>`;
        });
      });
      return out;
    },
  },

  /* 47 — QR Finder */
  {
    id: 'qr-fragment', title: 'QR Finder', category: 'Tech',
    keywords: ['qr','code','scan','tech','barcode'],
    defaults: { zoom:100, stroke:0, x:0, y:0, spacing:2, angle:0, bg:'#111114', fg:'#F5C518', accent:'#E63946' },
    tileW: p => (60+p.spacing)*p.zoom/100,
    tileH: p => (60+p.spacing)*p.zoom/100,
    tile(p) {
      const sz=(60+p.spacing)*p.zoom/100, cell=sz/7, ox=p.x, oy=p.y;
      const pat=[[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,1,1,1,0,1],[1,0,1,0,1,0,1],[1,0,1,1,1,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]];
      let out='';
      pat.forEach((row,r)=>row.forEach((v,c)=>{
        if(v){
          const isInner=r>=2&&r<=4&&c>=2&&c<=4;
          out+=`<rect x="${c*cell+ox}" y="${r*cell+oy}" width="${cell}" height="${cell}" fill="${isInner?p.accent:p.fg}" opacity="${isInner&&r===3&&c===3?0.4:0.9}"/>`;
        }
      }));
      return out;
    },
  },

  /* 48 — Blueprint Grid */
  {
    id: 'blueprint', title: 'Blueprint Grid', category: 'Tech',
    keywords: ['blueprint','technical','draft','architect'],
    defaults: { zoom:100, stroke:0.8, x:0, y:0, spacing:0, angle:0, bg:'#04133b', fg:'#93c5fd', accent:'#3b82f6' },
    tileW: p => (50+p.spacing)*p.zoom/100,
    tileH: p => (50+p.spacing)*p.zoom/100,
    tile(p) {
      const sp=(50+p.spacing)*p.zoom/100, sw=p.stroke, ox=p.x, oy=p.y, h=sp/2, q=sp/4;
      return `<line x1="${ox}" y1="${oy}" x2="${sp+ox}" y2="${oy}" stroke="${p.fg}" stroke-width="${sw}" opacity="0.55"/>
              <line x1="${ox}" y1="${oy}" x2="${ox}" y2="${sp+oy}" stroke="${p.fg}" stroke-width="${sw}" opacity="0.55"/>
              <line x1="${h+ox}" y1="${oy}" x2="${h+ox}" y2="${sp+oy}" stroke="${p.accent}" stroke-width="${sw*0.7}" stroke-dasharray="${2*p.zoom/100} ${2*p.zoom/100}" opacity="0.4"/>
              <line x1="${ox}" y1="${h+oy}" x2="${sp+ox}" y2="${h+oy}" stroke="${p.accent}" stroke-width="${sw*0.7}" stroke-dasharray="${2*p.zoom/100} ${2*p.zoom/100}" opacity="0.4"/>
              <line x1="${q+ox}" y1="${oy}" x2="${q+ox}" y2="${sp+oy}" stroke="${p.fg}" stroke-width="${sw*0.4}" opacity="0.2"/>
              <line x1="${ox}" y1="${q+oy}" x2="${sp+ox}" y2="${q+oy}" stroke="${p.fg}" stroke-width="${sw*0.4}" opacity="0.2"/>
              <circle cx="${sp+ox}" cy="${sp+oy}" r="${2.5*p.zoom/100}" fill="${p.fg}" opacity="0.6"/>`;
    },
  },

  /* 49 — Pixel Pattern */
  {
    id: 'pixel-art', title: 'Pixel Pattern', category: 'Tech',
    keywords: ['pixel','retro','8bit','game','art'],
    defaults: { zoom:100, stroke:0, x:0, y:0, spacing:0, angle:0, bg:'#0a0a14', fg:'#F5C518', accent:'#E63946' },
    tileW: p => (12+p.spacing*0.2)*p.zoom/100*5,
    tileH: p => (12+p.spacing*0.2)*p.zoom/100*5,
    tile(p) {
      const cell=(12+p.spacing*0.2)*p.zoom/100, ox=p.x, oy=p.y;
      const grid=[0,0,2,0,0, 0,2,1,2,0, 2,1,1,1,2, 0,2,1,2,0, 0,0,2,0,0];
      return grid.map((v,i)=>{
        const c=i%5, r=Math.floor(i/5);
        if(v===0) return '';
        return `<rect x="${c*cell+ox}" y="${r*cell+oy}" width="${cell}" height="${cell}" fill="${v===1?p.fg:p.accent}"/>`;
      }).join('');
    },
  },

  /* 50 — Static Noise */
  {
    id: 'noise-grid', title: 'Static Noise', category: 'Tech',
    keywords: ['noise','grid','random','static','glitch'],
    defaults: { zoom:100, stroke:0, x:0, y:0, spacing:0, angle:0, bg:'#080808', fg:'#1a1a1a', accent:'#052e16' },
    tileW: p => (8+p.spacing*0.2)*p.zoom/100*6,
    tileH: p => (8+p.spacing*0.2)*p.zoom/100*6,
    tile(p) {
      const cell=(8+p.spacing*0.2)*p.zoom/100, ox=p.x, oy=p.y;
      const ops=[0.9,0.1,0.6,0.05,0.8,0.3,0.2,0.95,0.1,0.7,0.15,0.8,0.7,0.3,0.85,0.2,0.6,0.1,0.05,0.75,0.2,0.9,0.1,0.55,0.8,0.1,0.6,0.3,0.85,0.2,0.15,0.7,0.05,0.8,0.25,0.65];
      return ops.map((op,i)=>`<rect x="${(i%6)*cell+ox}" y="${Math.floor(i/6)*cell+oy}" width="${cell}" height="${cell}" fill="${op>0.5?p.accent:p.fg}" opacity="${op}"/>`).join('');
    },
  },

];

/* ══════════════════════════════════════════════════════════
   2. RENDER ENGINE
   KEY FIX: each SVG uses a unique pattern id to avoid
   SVG id collision when multiple inline SVGs share id="p"
══════════════════════════════════════════════════════════ */

let _renderCounter = 0;

function renderPatternSVG(pattern, params, canvasW, canvasH) {
  const tw = Math.max(1, pattern.tileW(params));
  const th = Math.max(1, pattern.tileH(params));
  const tileContent = pattern.tile(params);
  // UNIQUE id per render call — prevents cross-SVG url(#p) collision
  const uid = 'pc' + (++_renderCounter);
  const transform = params.angle !== 0
    ? ` patternTransform="rotate(${params.angle})"`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasW}" height="${canvasH}">
  <defs>
    <pattern id="${uid}" x="${params.x}" y="${params.y}" width="${tw.toFixed(2)}" height="${th.toFixed(2)}" patternUnits="userSpaceOnUse"${transform}>
      ${tileContent}
    </pattern>
  </defs>
  <rect width="${canvasW}" height="${canvasH}" fill="${params.bg}"/>
  <rect width="${canvasW}" height="${canvasH}" fill="url(#${uid})"/>
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
  const pairs = [
    ['ctrl-zoom','val-zoom',p.zoom],['ctrl-stroke','val-stroke',p.stroke],
    ['ctrl-x','val-x',p.x],['ctrl-y','val-y',p.y],
    ['ctrl-spacing','val-spacing',p.spacing],['ctrl-angle','val-angle',p.angle]
  ];
  pairs.forEach(([sid,vid,v])=>{
    const sel=document.getElementById(sid); if(sel) sel.value=v;
    const vel=document.getElementById(vid); if(vel) vel.textContent=Number.isInteger(v)?v:parseFloat(v).toFixed(1);
  });
  document.getElementById('ctrl-bg').value     = p.bg;
  document.getElementById('ctrl-fg').value     = p.fg;
  document.getElementById('ctrl-accent').value = p.accent;
}

/* ── Live Preview ────────────────────────────────────────── */

function updatePreview() {
  if (!editorState.pattern) return;
  const canvas = document.getElementById('preview-canvas');
  if (!canvas) return;
  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;
  if (w < 4 || h < 4) return;
  const svg = renderPatternSVG(editorState.pattern, editorState.params, w, h);
  canvas.innerHTML = svg;
}

function initPreviewObserver() {
  const canvas = document.getElementById('preview-canvas');
  if (!canvas || typeof ResizeObserver === 'undefined') return;
  const ro = new ResizeObserver(() => {
    if (document.getElementById('editor-overlay').classList.contains('open')) {
      updatePreview();
    }
  });
  ro.observe(canvas);
}

/* ══════════════════════════════════════════════════════════
   4. URL ROUTING  (hash-based — back button + F5 work)
   Format: #editor/{pattern-id}  or  #gallery
══════════════════════════════════════════════════════════ */

function navigateTo(hash) {
  if (window.location.hash !== hash) history.pushState(null, '', hash);
  handleRoute();
}

function handleRoute() {
  const hash = window.location.hash;
  if (hash.startsWith('#editor/')) {
    const id = hash.slice('#editor/'.length);
    const pattern = PATTERNS.find(p => p.id === id);
    if (pattern) { _openEditorInternal(pattern); return; }
  }
  _closeEditorInternal();
}

window.addEventListener('popstate', handleRoute);

/* ══════════════════════════════════════════════════════════
   5. EDITOR OPEN / CLOSE
══════════════════════════════════════════════════════════ */

function openEditor(pattern) { navigateTo(`#editor/${pattern.id}`); }
function closeEditor()       { navigateTo('#gallery'); }

function _openEditorInternal(pattern) {
  editorState.pattern = pattern;
  editorState.params  = { ...pattern.defaults };
  document.getElementById('editor-title').textContent = pattern.title;
  syncSlidersFromState();

  const overlay = document.getElementById('editor-overlay');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Defer until after CSS transition so offsetWidth/Height are valid
  setTimeout(() => updatePreview(), 50);
  setTimeout(() => updatePreview(), 300);
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

  // Reconcile DOM — only add new cards, remove stale ones
  const existing = new Map([...grid.querySelectorAll('.pattern-card')].map(el=>[el.dataset.id, el]));
  const needed   = new Set(visible.map(p=>p.id));
  existing.forEach((el,id)=>{ if(!needed.has(id)) el.remove(); });

  const frag = document.createDocumentFragment();
  visible.forEach(p=>{ if(!existing.has(p.id)) frag.appendChild(buildCard(p)); });
  grid.appendChild(frag);
  visible.forEach(p=>{ const el=grid.querySelector(`[data-id="${p.id}"]`); if(el) grid.appendChild(el); });

  // Render thumbnails after cards are in DOM
  requestAnimationFrame(() => visible.forEach(p=>renderThumbnail(p)));
}

function buildCard(pattern) {
  const card = document.createElement('div');
  card.className = 'pattern-card';
  card.dataset.id = pattern.id;
  card.setAttribute('role', 'listitem');
  const catCls = 'cat-' + pattern.category.replace(/[^a-zA-Z]/g,'');
  card.innerHTML = `
    <div class="card-preview" id="thumb-${pattern.id}">
      <div class="card-overlay"><button class="card-overlay-btn">Edit Pattern</button></div>
    </div>
    <div class="card-footer">
      <span class="card-title">${pattern.title}</span>
      <span class="card-cat ${catCls}">${pattern.category}</span>
    </div>`;
  card.addEventListener('click', ()=>openEditor(pattern));
  return card;
}

function renderThumbnail(pattern) {
  const el = document.getElementById(`thumb-${pattern.id}`);
  if (!el) return;
  const w = el.offsetWidth  || el.clientWidth  || 260;
  const h = el.offsetHeight || el.clientHeight || 196;
  const svg = renderPatternSVG(pattern, pattern.defaults, w, h);
  // Replace only the SVG, keep the overlay div
  const existing = el.querySelector('svg');
  if (existing) existing.remove();
  el.insertAdjacentHTML('afterbegin', svg);
}

/* ══════════════════════════════════════════════════════════
   7. EXPORT
══════════════════════════════════════════════════════════ */

function getExportDimensions() {
  return {
    w: parseInt(document.getElementById('dim-w').value, 10) || 1080,
    h: parseInt(document.getElementById('dim-h').value, 10) || 1080,
  };
}

function getSVGString(w, h) {
  return renderPatternSVG(editorState.pattern, editorState.params, w, h);
}

function copyCSSToClipboard() {
  const { bg } = editorState.params;
  const { w, h } = getExportDimensions();
  const svgStr = getSVGString(w, h);
  const encoded = svgStr
    .replace(/\n/g,' ').replace(/\s+/g,' ')
    .replace(/"/g,"'").replace(/#/g,'%23')
    .replace(/</g,'%3C').replace(/>/g,'%3E');
  const css = `.${editorState.pattern.id}-bg {\n  background-color: ${bg};\n  background-image: url("data:image/svg+xml,${encoded}");\n  background-repeat: repeat;\n}`;
  writeToClipboard(css, '✓ CSS copied!');
}

function copySVGToClipboard() {
  const { w, h } = getExportDimensions();
  writeToClipboard(getSVGString(w, h), '✓ SVG markup copied!');
}

function downloadSVG() {
  const { w, h } = getExportDimensions();
  const blob = new Blob([getSVGString(w, h)], { type:'image/svg+xml' });
  triggerDownload(URL.createObjectURL(blob), `${editorState.pattern.id}.svg`);
  showToast('↓ SVG downloading…');
}

function downloadPNG() {
  const { w, h } = getExportDimensions();
  const svgStr = getSVGString(w, h);
  const blob   = new Blob([svgStr], { type:'image/svg+xml' });
  const url    = URL.createObjectURL(blob);
  const img    = new Image();
  img.onload = ()=>{
    const canvas = document.createElement('canvas');
    canvas.width=w; canvas.height=h;
    canvas.getContext('2d').drawImage(img,0,0);
    URL.revokeObjectURL(url);
    canvas.toBlob(pngBlob=>{
      triggerDownload(URL.createObjectURL(pngBlob), `${editorState.pattern.id}.png`);
      showToast(`↓ PNG ${w}×${h} downloading…`);
    },'image/png');
  };
  img.onerror = ()=>showToast('✗ PNG render failed.', true);
  img.src = url;
}

function triggerDownload(href, filename) {
  const a = Object.assign(document.createElement('a'), { href, download: filename });
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(href), 8000);
}

function writeToClipboard(text, msg) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(()=>showToast(msg), ()=>fallbackCopy(text, msg));
  } else { fallbackCopy(text, msg); }
}

function fallbackCopy(text, msg) {
  const ta = Object.assign(document.createElement('textarea'), { value:text, style:'position:fixed;opacity:0' });
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
  _toastTimer = setTimeout(()=>t.classList.remove('show'), 3000);
}

/* ══════════════════════════════════════════════════════════
   9. EVENT WIRING
══════════════════════════════════════════════════════════ */

function wireSlider(id, key, valId) {
  const el = document.getElementById(id);
  const ve = document.getElementById(valId);
  if (!el || !ve) return;
  el.addEventListener('input', ()=>{
    const v = parseFloat(el.value);
    editorState.params[key] = v;
    ve.textContent = Number.isInteger(v) ? v : v.toFixed(1);
    updatePreview();
  });
}

function wireColor(id, key) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', e=>{ editorState.params[key]=e.target.value; updatePreview(); });
}

function initEditorControls() {
  wireSlider('ctrl-zoom',    'zoom',    'val-zoom');
  wireSlider('ctrl-stroke',  'stroke',  'val-stroke');
  wireSlider('ctrl-x',       'x',       'val-x');
  wireSlider('ctrl-y',       'y',       'val-y');
  wireSlider('ctrl-spacing', 'spacing', 'val-spacing');
  wireSlider('ctrl-angle',   'angle',   'val-angle');
  wireColor('ctrl-bg',     'bg');
  wireColor('ctrl-fg',     'fg');
  wireColor('ctrl-accent', 'accent');

  document.getElementById('btn-reset').addEventListener('click', ()=>{ resetEditorToDefaults(); updatePreview(); });
  document.getElementById('editor-close').addEventListener('click', closeEditor);
  document.addEventListener('keydown', e=>{
    if (e.key==='Escape' && document.getElementById('editor-overlay').classList.contains('open')) closeEditor();
  });

  document.getElementById('btn-copy-css').addEventListener('click', copyCSSToClipboard);
  document.getElementById('btn-copy-svg').addEventListener('click', copySVGToClipboard);
  document.getElementById('btn-dl-svg').addEventListener('click', downloadSVG);
  document.getElementById('btn-dl-png').addEventListener('click', downloadPNG);

  initPreviewObserver();
}

function initGalleryControls() {
  document.getElementById('filter-bar').addEventListener('click', e=>{
    const tab = e.target.closest('.filter-tab');
    if (!tab) return;
    document.querySelectorAll('.filter-tab').forEach(t=>{ t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
    tab.classList.add('active'); tab.setAttribute('aria-selected','true');
    galleryFilter.cat = tab.dataset.cat;
    renderGallery();
  });

  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');
  let debounce;

  searchInput.addEventListener('input', ()=>{
    galleryFilter.search = searchInput.value.trim();
    searchClear.classList.toggle('visible', galleryFilter.search.length>0);
    clearTimeout(debounce);
    debounce = setTimeout(renderGallery, 180);
  });

  searchClear.addEventListener('click', ()=>{
    searchInput.value=''; galleryFilter.search='';
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

  // Handle initial URL (bookmarked editor or F5 on editor page)
  handleRoute();
}

document.addEventListener('DOMContentLoaded', init);
