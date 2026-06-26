export interface ShapeItem {
  id: string;
  name: string;
  category: string;
}

export const SHAPE_CATEGORIES = ['Basic', 'Stars', 'Arrows', 'Callouts', 'Badges', 'Abstract', 'Lines', 'Symbols'];

export const SHAPE_ITEMS: ShapeItem[] = [
  // Basic (20)
  { id: 'circle', name: 'Circle', category: 'Basic' },
  { id: 'rect', name: 'Rectangle', category: 'Basic' },
  { id: 'rounded-rect', name: 'Rounded Rect', category: 'Basic' },
  { id: 'triangle', name: 'Triangle', category: 'Basic' },
  { id: 'triangle-down', name: 'Triangle Down', category: 'Basic' },
  { id: 'triangle-left', name: 'Triangle Left', category: 'Basic' },
  { id: 'triangle-right', name: 'Triangle Right', category: 'Basic' },
  { id: 'diamond', name: 'Diamond', category: 'Basic' },
  { id: 'pentagon', name: 'Pentagon', category: 'Basic' },
  { id: 'hexagon', name: 'Hexagon', category: 'Basic' },
  { id: 'heptagon', name: 'Heptagon', category: 'Basic' },
  { id: 'octagon', name: 'Octagon', category: 'Basic' },
  { id: 'decagon', name: 'Decagon', category: 'Basic' },
  { id: 'ellipse-h', name: 'Ellipse H', category: 'Basic' },
  { id: 'ellipse-v', name: 'Ellipse V', category: 'Basic' },
  { id: 'half-circle', name: 'Half Circle', category: 'Basic' },
  { id: 'quarter-circle', name: 'Quarter Circle', category: 'Basic' },
  { id: 'trapezoid', name: 'Trapezoid', category: 'Basic' },
  { id: 'parallelogram', name: 'Parallelogram', category: 'Basic' },
  { id: 'pill', name: 'Pill', category: 'Basic' },

  // Stars (12)
  { id: 'star-3', name: '3-Point Star', category: 'Stars' },
  { id: 'star-4', name: '4-Point Star', category: 'Stars' },
  { id: 'star', name: '5-Point Star', category: 'Stars' },
  { id: 'star-6', name: '6-Point Star', category: 'Stars' },
  { id: 'star-8', name: '8-Point Star', category: 'Stars' },
  { id: 'star-12', name: '12-Point Star', category: 'Stars' },
  { id: 'starburst-4', name: 'Starburst 4', category: 'Stars' },
  { id: 'starburst-8', name: 'Starburst 8', category: 'Stars' },
  { id: 'flower-4', name: 'Flower 4', category: 'Stars' },
  { id: 'flower-6', name: 'Flower 6', category: 'Stars' },
  { id: 'sunburst', name: 'Sunburst', category: 'Stars' },
  { id: 'sparkle', name: 'Sparkle', category: 'Stars' },

  // Arrows (12)
  { id: 'arrow-right', name: 'Arrow Right', category: 'Arrows' },
  { id: 'arrow-left', name: 'Arrow Left', category: 'Arrows' },
  { id: 'arrow-up', name: 'Arrow Up', category: 'Arrows' },
  { id: 'arrow-down', name: 'Arrow Down', category: 'Arrows' },
  { id: 'double-arrow-h', name: 'Double Arrow H', category: 'Arrows' },
  { id: 'double-arrow-v', name: 'Double Arrow V', category: 'Arrows' },
  { id: 'chevron-right', name: 'Chevron Right', category: 'Arrows' },
  { id: 'chevron-left', name: 'Chevron Left', category: 'Arrows' },
  { id: 'chevron-up', name: 'Chevron Up', category: 'Arrows' },
  { id: 'chevron-down', name: 'Chevron Down', category: 'Arrows' },
  { id: 'corner-arrow', name: 'Corner Arrow', category: 'Arrows' },
  { id: 'curved-arrow', name: 'Curved Arrow', category: 'Arrows' },

  // Callouts (8)
  { id: 'speech-rect', name: 'Speech Bubble', category: 'Callouts' },
  { id: 'speech-round', name: 'Round Bubble', category: 'Callouts' },
  { id: 'thought-bubble', name: 'Thought Bubble', category: 'Callouts' },
  { id: 'tooltip-top', name: 'Tooltip Top', category: 'Callouts' },
  { id: 'tooltip-bottom', name: 'Tooltip Bottom', category: 'Callouts' },
  { id: 'tooltip-left', name: 'Tooltip Left', category: 'Callouts' },
  { id: 'tooltip-right', name: 'Tooltip Right', category: 'Callouts' },
  { id: 'chat-bubble', name: 'Chat Bubble', category: 'Callouts' },

  // Badges (10)
  { id: 'shield', name: 'Shield', category: 'Badges' },
  { id: 'badge-circle', name: 'Badge Circle', category: 'Badges' },
  { id: 'badge-hex', name: 'Badge Hex', category: 'Badges' },
  { id: 'banner', name: 'Banner', category: 'Badges' },
  { id: 'ribbon', name: 'Ribbon', category: 'Badges' },
  { id: 'tag', name: 'Tag', category: 'Badges' },
  { id: 'medal', name: 'Medal', category: 'Badges' },
  { id: 'stamp', name: 'Stamp', category: 'Badges' },
  { id: 'seal', name: 'Seal', category: 'Badges' },
  { id: 'crown', name: 'Crown', category: 'Badges' },

  // Abstract (12)
  { id: 'wave', name: 'Wave', category: 'Abstract' },
  { id: 'ring', name: 'Ring', category: 'Abstract' },
  { id: 'donut', name: 'Donut', category: 'Abstract' },
  { id: 'frame', name: 'Frame', category: 'Abstract' },
  { id: 'cross', name: 'Cross', category: 'Abstract' },
  { id: 'x-mark', name: 'X Mark', category: 'Abstract' },
  { id: 'infinity', name: 'Infinity', category: 'Abstract' },
  { id: 'gear', name: 'Gear', category: 'Abstract' },
  { id: 'lightning', name: 'Lightning', category: 'Abstract' },
  { id: 'flame', name: 'Flame', category: 'Abstract' },
  { id: 'water-drop', name: 'Water Drop', category: 'Abstract' },
  { id: 'cloud-shape', name: 'Cloud', category: 'Abstract' },

  // Lines (6)
  { id: 'line-h', name: 'Line H', category: 'Lines' },
  { id: 'line-v', name: 'Line V', category: 'Lines' },
  { id: 'line-diagonal', name: 'Diagonal', category: 'Lines' },
  { id: 'zigzag', name: 'Zigzag', category: 'Lines' },
  { id: 'bracket-left', name: 'Bracket [', category: 'Lines' },
  { id: 'bracket-right', name: 'Bracket ]', category: 'Lines' },

  // Symbols (8)
  { id: 'heart', name: 'Heart', category: 'Symbols' },
  { id: 'heart-outline', name: 'Heart Outline', category: 'Symbols' },
  { id: 'check', name: 'Check', category: 'Symbols' },
  { id: 'map-pin', name: 'Map Pin', category: 'Symbols' },
  { id: 'crescent', name: 'Crescent', category: 'Symbols' },
  { id: 'snowflake-sym', name: 'Snowflake', category: 'Symbols' },
  { id: 'anchor', name: 'Anchor', category: 'Symbols' },
  { id: 'eye-shape', name: 'Eye', category: 'Symbols' },
];

// Generate polygon points for regular polygon
function poly(sides: number, w: number, h: number, offsetAngle = 0): string {
  return Array.from({ length: sides }, (_, i) => {
    const a = (2 * Math.PI / sides) * i + offsetAngle;
    return `${w / 2 + (w / 2) * Math.cos(a)},${h / 2 + (h / 2) * Math.sin(a)}`;
  }).join(' ');
}

// Generate star polygon points
function star(outerPts: number, inner: number, w: number, h: number): string {
  const pts: string[] = [];
  const total = outerPts * 2;
  for (let i = 0; i < total; i++) {
    const a = (Math.PI / outerPts) * i - Math.PI / 2;
    const r = i % 2 === 0 ? 0.5 : inner * 0.5;
    pts.push(`${w / 2 + w * r * Math.cos(a)},${h / 2 + h * r * Math.sin(a)}`);
  }
  return pts.join(' ');
}

export function getShapeSVGElement(shapeType: string, w: number, h: number, fillAttr: string, strokeAttrs: string): string {
  const p = (sides: number, off = 0) => poly(sides, w, h, off);
  const s = (pts: number, inner: number) => star(pts, inner, w, h);

  switch (shapeType) {
    case 'circle': return `<ellipse cx="${w/2}" cy="${h/2}" rx="${w/2}" ry="${h/2}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'rect': return `<rect width="${w}" height="${h}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'rounded-rect': return `<rect width="${w}" height="${h}" rx="${Math.min(w,h)*0.15}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'triangle': return `<polygon points="${w/2},0 ${w},${h} 0,${h}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'triangle-down': return `<polygon points="0,0 ${w},0 ${w/2},${h}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'triangle-left': return `<polygon points="${w},0 ${w},${h} 0,${h/2}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'triangle-right': return `<polygon points="0,0 ${w},${h/2} 0,${h}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'diamond': return `<polygon points="${w/2},0 ${w},${h/2} ${w/2},${h} 0,${h/2}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'pentagon': return `<polygon points="${p(5, -Math.PI/2)}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'hexagon': return `<polygon points="${p(6, -Math.PI/6)}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'heptagon': return `<polygon points="${p(7, -Math.PI/2)}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'octagon': return `<polygon points="${p(8, -Math.PI/8)}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'decagon': return `<polygon points="${p(10, -Math.PI/2)}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'ellipse-h': return `<ellipse cx="${w/2}" cy="${h/2}" rx="${w/2}" ry="${h/3}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'ellipse-v': return `<ellipse cx="${w/2}" cy="${h/2}" rx="${w/3}" ry="${h/2}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'half-circle': return `<path d="M0,${h/2} A${w/2},${h/2} 0 0,1 ${w},${h/2} Z" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'quarter-circle': return `<path d="M0,${h} A${w},${h} 0 0,1 ${w},0 L0,0 Z" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'trapezoid': return `<polygon points="${w*0.2},${h} 0,0 ${w},0 ${w*0.8},${h}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'parallelogram': return `<polygon points="${w*0.25},0 ${w},0 ${w*0.75},${h} 0,${h}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'pill': return `<rect width="${w}" height="${h}" rx="${h/2}" fill="${fillAttr}" ${strokeAttrs}/>`;

    // Stars
    case 'star-3': return `<polygon points="${s(3, 0.4)}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'star-4': return `<polygon points="${s(4, 0.45)}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'star': return `<polygon points="${s(5, 0.4)}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'star-6': return `<polygon points="${s(6, 0.5)}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'star-8': return `<polygon points="${s(8, 0.5)}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'star-12': return `<polygon points="${s(12, 0.6)}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'starburst-4': return `<polygon points="${s(4, 0.25)}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'starburst-8': return `<polygon points="${s(8, 0.3)}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'flower-4': {
      const cx = w/2, cy = h/2, r = w/4;
      return `<circle cx="${cx}" cy="${cy-r}" r="${r}" fill="${fillAttr}" ${strokeAttrs}/><circle cx="${cx+r}" cy="${cy}" r="${r}" fill="${fillAttr}" ${strokeAttrs}/><circle cx="${cx}" cy="${cy+r}" r="${r}" fill="${fillAttr}" ${strokeAttrs}/><circle cx="${cx-r}" cy="${cy}" r="${r}" fill="${fillAttr}" ${strokeAttrs}/>`;
    }
    case 'flower-6': {
      const fPts = Array.from({length:6},(_,i) => {
        const a = (Math.PI/3)*i;
        const r = w/4;
        return `<circle cx="${w/2+r*Math.cos(a)}" cy="${h/2+r*Math.sin(a)}" r="${r}" fill="${fillAttr}" ${strokeAttrs}/>`;
      });
      return fPts.join('');
    }
    case 'sunburst': {
      const rays: string[] = [];
      for (let i=0;i<16;i++) {
        const a = (Math.PI/8)*i;
        const r1 = w*0.3, r2 = w*0.5;
        const x1 = w/2+r1*Math.cos(a), y1 = h/2+r1*Math.sin(a);
        const x2 = w/2+r2*Math.cos(a), y2 = h/2+r2*Math.sin(a);
        rays.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${fillAttr}" stroke-width="${w*0.04}"/>`);
      }
      return rays.join('')+`<circle cx="${w/2}" cy="${h/2}" r="${w*0.3}" fill="${fillAttr}" ${strokeAttrs}/>`;
    }
    case 'sparkle': return `<polygon points="${s(4, 0.15)}" fill="${fillAttr}" ${strokeAttrs}/>`;

    // Arrows
    case 'arrow-right': return `<polygon points="0,${h*0.3} ${w*0.6},${h*0.3} ${w*0.6},0 ${w},${h/2} ${w*0.6},${h} ${w*0.6},${h*0.7} 0,${h*0.7}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'arrow-left': return `<polygon points="${w},${h*0.3} ${w*0.4},${h*0.3} ${w*0.4},0 0,${h/2} ${w*0.4},${h} ${w*0.4},${h*0.7} ${w},${h*0.7}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'arrow-up': return `<polygon points="${w*0.3},${h} ${w*0.3},${h*0.4} 0,${h*0.4} ${w/2},0 ${w},${h*0.4} ${w*0.7},${h*0.4} ${w*0.7},${h}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'arrow-down': return `<polygon points="${w*0.3},0 ${w*0.3},${h*0.6} 0,${h*0.6} ${w/2},${h} ${w},${h*0.6} ${w*0.7},${h*0.6} ${w*0.7},0" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'double-arrow-h': return `<polygon points="0,${h/2} ${w*0.3},0 ${w*0.3},${h*0.3} ${w*0.7},${h*0.3} ${w*0.7},0 ${w},${h/2} ${w*0.7},${h} ${w*0.7},${h*0.7} ${w*0.3},${h*0.7} ${w*0.3},${h}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'double-arrow-v': return `<polygon points="${w/2},0 ${w},${h*0.3} ${w*0.7},${h*0.3} ${w*0.7},${h*0.7} ${w},${h*0.7} ${w/2},${h} 0,${h*0.7} ${w*0.3},${h*0.7} ${w*0.3},${h*0.3} 0,${h*0.3}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'chevron-right': return `<polygon points="0,0 ${w*0.6},${h/2} 0,${h} ${w*0.4},${h} ${w},${h/2} ${w*0.4},0" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'chevron-left': return `<polygon points="${w},0 ${w*0.4},${h/2} ${w},${h} ${w*0.6},${h} 0,${h/2} ${w*0.6},0" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'chevron-up': return `<polygon points="0,${h} ${w/2},${h*0.4} ${w},${h} ${w},${h*0.6} ${w/2},0 0,${h*0.6}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'chevron-down': return `<polygon points="0,0 ${w/2},${h*0.6} ${w},0 ${w},${h*0.4} ${w/2},${h} 0,${h*0.4}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'corner-arrow': return `<polygon points="0,0 ${w*0.4},0 ${w*0.4},${h*0.6} ${w*0.8},${h*0.2} ${w},${h*0.4} ${w*0.4},${h} 0,${h}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'curved-arrow': return `<path d="M${w*0.1},${h*0.5} Q${w*0.1},${h*0.1} ${w*0.5},${h*0.1} L${w*0.4},0 L${w},${h*0.2} L${w*0.4},${h*0.4} L${w*0.5},${h*0.3} Q${w*0.2},${h*0.3} ${w*0.2},${h*0.5} Q${w*0.2},${h*0.8} ${w*0.5},${h*0.8} L${w*0.5},${h} L${w*0.1},${h*0.8} Z" fill="${fillAttr}" ${strokeAttrs}/>`;

    // Callouts
    case 'speech-rect': return `<path d="M0,0 H${w} V${h*0.75} H${w*0.4} L${w*0.3},${h} L${w*0.25},${h*0.75} H0 Z" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'speech-round': return `<path d="M${w*0.1},0 Q0,0 0,${h*0.1} V${h*0.65} Q0,${h*0.75} ${w*0.1},${h*0.75} H${w*0.3} L${w*0.4},${h} L${w*0.45},${h*0.75} H${w*0.9} Q${w},${h*0.75} ${w},${h*0.65} V${h*0.1} Q${w},0 ${w*0.9},0 Z" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'thought-bubble': return `<circle cx="${w/2}" cy="${h*0.4}" r="${w*0.4}" fill="${fillAttr}" ${strokeAttrs}/><circle cx="${w*0.35}" cy="${h*0.82}" r="${w*0.1}" fill="${fillAttr}" ${strokeAttrs}/><circle cx="${w*0.25}" cy="${h*0.92}" r="${w*0.06}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'tooltip-top': return `<path d="M${w*0.1},${h*0.2} H${w*0.9} Q${w},${h*0.2} ${w},${h*0.3} V${h*0.85} Q${w},${h*0.95} ${w*0.9},${h*0.95} H${w*0.1} Q0,${h*0.95} 0,${h*0.85} V${h*0.3} Q0,${h*0.2} ${w*0.1},${h*0.2} Z M${w*0.4},${h*0.2} L${w/2},0 L${w*0.6},${h*0.2}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'tooltip-bottom': return `<path d="M${w*0.1},${h*0.05} H${w*0.9} Q${w},${h*0.05} ${w},${h*0.15} V${h*0.7} Q${w},${h*0.8} ${w*0.9},${h*0.8} H${w*0.6} L${w/2},${h} L${w*0.4},${h*0.8} H${w*0.1} Q0,${h*0.8} 0,${h*0.7} V${h*0.15} Q0,${h*0.05} ${w*0.1},${h*0.05} Z" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'tooltip-left': return `<path d="M${w*0.2},${h*0.1} H${w*0.95} Q${w},${h*0.1} ${w},${h*0.2} V${h*0.8} Q${w},${h*0.9} ${w*0.95},${h*0.9} H${w*0.2} Q${w*0.1},${h*0.9} ${w*0.1},${h*0.8} V${h*0.6} L0,${h/2} L${w*0.1},${h*0.4} V${h*0.2} Q${w*0.1},${h*0.1} ${w*0.2},${h*0.1} Z" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'tooltip-right': return `<path d="M${w*0.05},${h*0.1} H${w*0.8} Q${w*0.9},${h*0.1} ${w*0.9},${h*0.2} V${h*0.4} L${w},${h/2} L${w*0.9},${h*0.6} V${h*0.8} Q${w*0.9},${h*0.9} ${w*0.8},${h*0.9} H${w*0.05} Q0,${h*0.9} 0,${h*0.8} V${h*0.2} Q0,${h*0.1} ${w*0.05},${h*0.1} Z" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'chat-bubble': return `<path d="M${w*0.1},0 H${w*0.9} Q${w},0 ${w},${h*0.1} V${h*0.6} Q${w},${h*0.7} ${w*0.9},${h*0.7} H${w*0.5} L${w*0.3},${h} L${w*0.35},${h*0.7} H${w*0.1} Q0,${h*0.7} 0,${h*0.6} V${h*0.1} Q0,0 ${w*0.1},0 Z" fill="${fillAttr}" ${strokeAttrs}/>`;

    // Badges
    case 'shield': return `<path d="M${w/2},0 L${w},${h*0.2} V${h*0.6} Q${w/2},${h} ${w/2},${h} Q${w/2},${h} 0,${h*0.6} V${h*0.2} Z" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'badge-circle': return `<circle cx="${w/2}" cy="${h*0.4}" r="${w*0.4}" fill="${fillAttr}" ${strokeAttrs}/><rect x="${w*0.35}" y="${h*0.75}" width="${w*0.3}" height="${h*0.25}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'badge-hex': return `<polygon points="${p(6, -Math.PI/6)}" fill="${fillAttr}" ${strokeAttrs}/><polygon points="${Array.from({length:6},(_,i) => { const a=(Math.PI/3)*i-Math.PI/6; return `${w/2+(w*0.4)*Math.cos(a)},${h/2+(h*0.4)*Math.sin(a)}`; }).join(' ')}" fill="none" stroke="white" stroke-width="2"/>`;
    case 'banner': return `<path d="M0,0 H${w} V${h*0.75} L${w/2},${h} L0,${h*0.75} Z" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'ribbon': return `<path d="M${w*0.2},0 H${w*0.8} L${w},${h*0.4} L${w*0.8},${h*0.8} H${w*0.2} L0,${h*0.4} Z" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'tag': return `<path d="M0,0 H${w*0.8} L${w},${h/2} L${w*0.8},${h} H0 Z" fill="${fillAttr}" ${strokeAttrs}/><circle cx="${w*0.15}" cy="${h/2}" r="${w*0.08}" fill="white"/>`;
    case 'medal': return `<circle cx="${w/2}" cy="${h*0.5}" r="${w*0.4}" fill="${fillAttr}" ${strokeAttrs}/><rect x="${w*0.4}" y="0" width="${w*0.2}" height="${h*0.2}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'stamp': return `<rect x="${w*0.1}" y="${h*0.1}" width="${w*0.8}" height="${h*0.8}" rx="${w*0.05}" fill="${fillAttr}" ${strokeAttrs}/><rect x="${w*0.2}" y="${h*0.2}" width="${w*0.6}" height="${h*0.6}" fill="none" stroke="white" stroke-width="3"/>`;
    case 'seal': {
      const sealPts = star(16, 0.85, w, h);
      return `<polygon points="${sealPts}" fill="${fillAttr}" ${strokeAttrs}/><circle cx="${w/2}" cy="${h/2}" r="${w*0.35}" fill="none" stroke="white" stroke-width="2"/>`;
    }
    case 'crown': return `<path d="M0,${h*0.3} L${w*0.15},${h} H${w*0.85} L${w},${h*0.3} L${w*0.75},${h*0.6} L${w*0.5},0 L${w*0.25},${h*0.6} Z" fill="${fillAttr}" ${strokeAttrs}/>`;

    // Abstract
    case 'wave': return `<path d="M0,${h*0.5} C${w*0.25},${h*0.15} ${w*0.5},${h*0.15} ${w*0.75},${h*0.5} S${w},${h*0.85} ${w},${h*0.5} V${h} H0 Z" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'ring': return `<circle cx="${w/2}" cy="${h/2}" r="${Math.min(w,h)*0.45}" fill="none" stroke="${fillAttr}" stroke-width="${Math.min(w,h)*0.12}"/>`;
    case 'donut': return `<circle cx="${w/2}" cy="${h/2}" r="${w*0.45}" fill="${fillAttr}" ${strokeAttrs}/><circle cx="${w/2}" cy="${h/2}" r="${w*0.25}" fill="white"/>`;
    case 'frame': return `<rect width="${w}" height="${h}" fill="${fillAttr}" ${strokeAttrs}/><rect x="${w*0.1}" y="${h*0.1}" width="${w*0.8}" height="${h*0.8}" fill="white"/>`;
    case 'cross': {
      const t = w*0.25;
      return `<path d="M${t},0 h${w-2*t} v${t} h${t} v${h-2*t} h-${t} v${t} h-${w-2*t} v-${t} h-${t} v-${h-2*t} h${t} z" fill="${fillAttr}" ${strokeAttrs}/>`;
    }
    case 'x-mark': {
      const xw = w*0.25, xh = h*0.25;
      return `<path d="M${xw},0 L${w/2},${h/2-xh} L${w-xw},0 L${w},${xh} L${w/2+xh},${h/2} L${w},${h-xh} L${w-xw},${h} L${w/2},${h/2+xh} L${xw},${h} L0,${h-xh} L${w/2-xh},${h/2} L0,${xh} Z" fill="${fillAttr}" ${strokeAttrs}/>`;
    }
    case 'infinity': return `<path d="M${w*0.3},${h/2} C${w*0.3},${h*0.2} ${w*0.1},${h*0.2} ${w*0.1},${h/2} C${w*0.1},${h*0.8} ${w*0.3},${h*0.8} ${w/2},${h/2} C${w*0.7},${h*0.2} ${w*0.9},${h*0.2} ${w*0.9},${h/2} C${w*0.9},${h*0.8} ${w*0.7},${h*0.8} ${w*0.7},${h/2} C${w*0.7},${h*0.2} ${w*0.5},${h*0.2} ${w*0.5},${h/2}" fill="none" stroke="${fillAttr}" stroke-width="${Math.min(w,h)*0.1}"/>`;
    case 'gear': {
      const teeth = 8;
      const inner = w*0.3, outer = w*0.45;
      const gpts: string[] = [];
      for (let i=0;i<teeth*2;i++) {
        const a = (Math.PI/teeth)*i;
        const r = i%2===0 ? outer : inner;
        gpts.push(`${w/2+r*Math.cos(a)},${h/2+r*Math.sin(a)}`);
      }
      return `<polygon points="${gpts.join(' ')}" fill="${fillAttr}" ${strokeAttrs}/><circle cx="${w/2}" cy="${h/2}" r="${w*0.15}" fill="white"/>`;
    }
    case 'lightning': return `<polygon points="${w*0.6},0 ${w*0.2},${h*0.55} ${w*0.5},${h*0.45} ${w*0.35},${h} ${w*0.8},${h*0.4} ${w*0.5},${h*0.5}" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'flame': return `<path d="M${w/2},0 C${w*0.3},${h*0.2} ${w*0.1},${h*0.4} ${w*0.2},${h*0.6} C${w*0.05},${h*0.5} ${w*0.1},${h*0.35} ${w*0.15},${h*0.3} C${w*0.05},${h*0.5} ${w*0.05},${h*0.7} ${w*0.2},${h*0.8} C${w*0.1},${h*0.95} ${w*0.3},${h} ${w/2},${h} C${w*0.7},${h} ${w*0.9},${h*0.95} ${w*0.8},${h*0.8} C${w*0.95},${h*0.7} ${w*0.95},${h*0.5} ${w*0.85},${h*0.3} C${w*0.9},${h*0.35} ${w*0.95},${h*0.5} ${w*0.8},${h*0.6} C${w*0.9},${h*0.4} ${w*0.7},${h*0.2} ${w/2},0 Z" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'water-drop': return `<path d="M${w/2},0 C${w*0.7},${h*0.3} ${w},${h*0.6} ${w/2},${h} C0,${h*0.6} ${w*0.3},${h*0.3} ${w/2},0 Z" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'cloud-shape': return `<path d="M${w*0.2},${h*0.8} Q${w*0.05},${h*0.8} ${w*0.05},${h*0.65} Q${w*0.05},${h*0.5} ${w*0.2},${h*0.5} Q${w*0.15},${h*0.25} ${w*0.4},${h*0.25} Q${w*0.45},${h*0.1} ${w*0.6},${h*0.15} Q${w*0.7},${h*0.0} ${w*0.8},${h*0.15} Q${w},${h*0.15} ${w*0.95},${h*0.45} Q${w},${h*0.5} ${w*0.9},${h*0.65} Q${w*0.9},${h*0.8} ${w*0.75},${h*0.8} Z" fill="${fillAttr}" ${strokeAttrs}/>`;

    // Lines
    case 'line-h': return `<line x1="0" y1="${h/2}" x2="${w}" y2="${h/2}" stroke="${fillAttr}" stroke-width="${h*0.15}"/>`;
    case 'line-v': return `<line x1="${w/2}" y1="0" x2="${w/2}" y2="${h}" stroke="${fillAttr}" stroke-width="${w*0.15}"/>`;
    case 'line-diagonal': return `<line x1="0" y1="${h}" x2="${w}" y2="0" stroke="${fillAttr}" stroke-width="${Math.min(w,h)*0.12}"/>`;
    case 'zigzag': {
      const segs = 6;
      const segW = w/segs;
      let d = `M0,${h/2}`;
      for(let i=0;i<segs;i++) d += ` L${segW*(i+0.5)},${i%2===0?0:h} L${segW*(i+1)},${h/2}`;
      return `<path d="${d}" fill="none" stroke="${fillAttr}" stroke-width="${Math.min(w,h)*0.08}"/>`;
    }
    case 'bracket-left': return `<path d="M${w*0.6},0 H${w*0.3} V${h} H${w*0.6}" fill="none" stroke="${fillAttr}" stroke-width="${w*0.1}"/>`;
    case 'bracket-right': return `<path d="M${w*0.4},0 H${w*0.7} V${h} H${w*0.4}" fill="none" stroke="${fillAttr}" stroke-width="${w*0.1}"/>`;

    // Symbols
    case 'heart': return `<path d="M${w/2},${h*0.85} L${w*0.1},${h*0.4} Q0,${h*0.15} ${w*0.15},${h*0.1} Q${w*0.3},0 ${w/2},${h*0.25} Q${w*0.7},0 ${w*0.85},${h*0.1} Q${w},${h*0.15} ${w*0.9},${h*0.4} Z" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'heart-outline': return `<path d="M${w/2},${h*0.85} L${w*0.1},${h*0.4} Q0,${h*0.15} ${w*0.15},${h*0.1} Q${w*0.3},0 ${w/2},${h*0.25} Q${w*0.7},0 ${w*0.85},${h*0.1} Q${w},${h*0.15} ${w*0.9},${h*0.4} Z" fill="none" stroke="${fillAttr}" stroke-width="${Math.min(w,h)*0.08}"/>`;
    case 'check': return `<polyline points="${w*0.1},${h*0.5} ${w*0.4},${h*0.8} ${w*0.9},${h*0.2}" fill="none" stroke="${fillAttr}" stroke-width="${Math.min(w,h)*0.12}" stroke-linecap="round"/>`;
    case 'map-pin': return `<path d="M${w/2},${h} C${w/2},${h} ${w*0.1},${h*0.55} ${w*0.1},${h*0.35} A${w*0.4},${w*0.4} 0 1,1 ${w*0.9},${h*0.35} C${w*0.9},${h*0.55} ${w/2},${h} ${w/2},${h} Z" fill="${fillAttr}" ${strokeAttrs}/><circle cx="${w/2}" cy="${h*0.35}" r="${w*0.15}" fill="white"/>`;
    case 'crescent': return `<path d="M${w*0.7},${h*0.1} A${w*0.45},${h*0.45} 0 1,0 ${w*0.7},${h*0.9} A${w*0.3},${h*0.4} 0 1,1 ${w*0.7},${h*0.1} Z" fill="${fillAttr}" ${strokeAttrs}/>`;
    case 'snowflake-sym': {
      const arms = Array.from({length:6},(_,i) => {
        const a = (Math.PI/3)*i; const cx=w/2, cy=h/2, l=w*0.45;
        return `<line x1="${cx}" y1="${cy}" x2="${cx+l*Math.cos(a)}" y2="${cy+l*Math.sin(a)}" stroke="${fillAttr}" stroke-width="${w*0.06}"/>`;
      });
      return arms.join('')+`<circle cx="${w/2}" cy="${h/2}" r="${w*0.08}" fill="${fillAttr}"/>`;
    }
    case 'anchor': return `<circle cx="${w/2}" cy="${h*0.22}" r="${h*0.12}" fill="none" stroke="${fillAttr}" stroke-width="${w*0.07}"/><line x1="${w/2}" y1="${h*0.34}" x2="${w/2}" y2="${h*0.85}" stroke="${fillAttr}" stroke-width="${w*0.07}"/><path d="M${w*0.1},${h*0.55} H${w*0.9}" fill="none" stroke="${fillAttr}" stroke-width="${w*0.07}"/><path d="M${w*0.1},${h*0.55} C${w*0.1},${h*0.85} ${w*0.35},${h*0.88} ${w/2},${h*0.85}" fill="none" stroke="${fillAttr}" stroke-width="${w*0.07}"/><path d="M${w*0.9},${h*0.55} C${w*0.9},${h*0.85} ${w*0.65},${h*0.88} ${w/2},${h*0.85}" fill="none" stroke="${fillAttr}" stroke-width="${w*0.07}"/>`;
    case 'eye-shape': return `<path d="M${w*0.05},${h/2} Q${w/2},${h*0.1} ${w*0.95},${h/2} Q${w/2},${h*0.9} ${w*0.05},${h/2} Z" fill="${fillAttr}" ${strokeAttrs}/><circle cx="${w/2}" cy="${h/2}" r="${w*0.15}" fill="white"/><circle cx="${w/2}" cy="${h/2}" r="${w*0.1}" fill="${fillAttr === 'none' ? '#333' : fillAttr}"/>`;

    default: return `<ellipse cx="${w/2}" cy="${h/2}" rx="${w/2}" ry="${h/2}" fill="${fillAttr}" ${strokeAttrs}/>`;
  }
}
