import type { Template, TextLayer, IconLayer, ShapeLayer, CanvasBackground } from '../types';

const DEFAULT_CANVAS_SIZE = { id: 'sq500', label: 'Square 500×500', width: 500, height: 500 };

const solidBg = (color: string): CanvasBackground => ({
  type: 'solid', color, gradientColor1: '#1A73E8', gradientColor2: '#48CAE4', gradientAngle: 135, gradientType: 'linear',
});
const gradientBg = (c1: string, c2: string, angle = 135): CanvasBackground => ({
  type: 'gradient', color: c1, gradientColor1: c1, gradientColor2: c2, gradientAngle: angle, gradientType: 'linear',
});
const transparentBg = (): CanvasBackground => ({
  type: 'transparent', color: '#ffffff', gradientColor1: '#1A73E8', gradientColor2: '#48CAE4', gradientAngle: 135, gradientType: 'linear',
});

const baseLayer = {
  rotation: 0, opacity: 1, visible: true, locked: false, flipX: false, flipY: false,
};
const baseText = (overrides: Partial<TextLayer>): TextLayer => ({
  ...baseLayer,
  type: 'text', id: '', name: 'Text',
  x: 50, y: 50, width: 400, height: 60,
  fontFamily: 'Montserrat', fontSize: 36, fontWeight: '700',
  fontStyle: 'normal', textAlign: 'center', color: '#1C1C1C',
  letterSpacing: 0, lineHeight: 1.2,
  textTransform: 'none', shadow: false, shadowColor: '#00000040',
  shadowX: 2, shadowY: 2, shadowBlur: 4,
  useGradient: false, gradientColor1: '#1A73E8', gradientColor2: '#9B59B6',
  textDecoration: 'none',
  content: 'BRAND NAME',
  ...overrides,
});
const baseIcon = (overrides: Partial<IconLayer>): IconLayer => ({
  ...baseLayer,
  type: 'icon', id: '', name: 'Icon',
  x: 200, y: 120, width: 100, height: 100,
  iconId: 'rocket', fill: '#1A73E8', stroke: 'none', strokeWidth: 0,
  shadow: false, shadowColor: '#00000040', shadowX: 3, shadowY: 3, shadowBlur: 6,
  ...overrides,
});
const baseShape = (overrides: Partial<ShapeLayer>): ShapeLayer => ({
  ...baseLayer,
  type: 'shape', id: '', name: 'Shape',
  x: 175, y: 100, width: 150, height: 150,
  shapeType: 'circle', fill: '#1A73E8', stroke: 'none', strokeWidth: 0,
  strokeDash: false, cornerRadius: 0,
  fillType: 'solid', gradientColor1: '#1A73E8', gradientColor2: '#48CAE4', gradientAngle: 135,
  shadow: false, shadowColor: '#00000040', shadowX: 4, shadowY: 4, shadowBlur: 8,
  ...overrides,
});

let _id = 1;
const lid = () => `tl-${_id++}`;

export const TEMPLATES: Template[] = [

  // ── TECHNOLOGY (8 templates) ──
  {
    id: 't-tech-circle',
    name: 'Tech Circle',
    category: 'Technology',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#0D1B2A'),
      layers: [
        baseShape({ id: lid(), name: 'BG Circle', shapeType: 'circle', x: 175, y: 90, width: 150, height: 150, fill: '#1A73E8', shadow: true, shadowColor: '#1A73E840', shadowX: 0, shadowY: 8, shadowBlur: 24 }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'gear', x: 200, y: 115, width: 100, height: 100, fill: '#FFFFFF' }),
        baseText({ id: lid(), name: 'Brand', content: 'TECHCORE', y: 278, fontFamily: 'Montserrat', fontSize: 38, fontWeight: '800', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 5 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Smart Solutions', y: 332, fontFamily: 'Inter', fontSize: 15, fontWeight: '400', color: '#48CAE4', letterSpacing: 2 }),
      ],
    },
  },
  {
    id: 't-tech-minimal',
    name: 'Code Minimal',
    category: 'Technology',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#FFFFFF'),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'code', x: 80, y: 180, width: 80, height: 80, fill: '#1A73E8' }),
        baseText({ id: lid(), name: 'Brand', content: 'devstudio', x: 170, y: 185, width: 260, height: 50, fontFamily: 'Roboto', fontSize: 32, fontWeight: '700', color: '#0D1B2A', textAlign: 'left' }),
        baseText({ id: lid(), name: 'Tagline', content: 'Code. Build. Launch.', x: 170, y: 245, width: 260, height: 30, fontFamily: 'Inter', fontSize: 14, fontWeight: '400', color: '#6B7280', textAlign: 'left', letterSpacing: 1 }),
      ],
    },
  },
  {
    id: 't-tech-dark-terminal',
    name: 'Terminal Dark',
    category: 'Technology',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#0A0A0A'),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'terminal', x: 190, y: 100, width: 120, height: 120, fill: '#00FF41' }),
        baseText({ id: lid(), name: 'Brand', content: 'NEXCORE', y: 262, fontFamily: 'Oswald', fontSize: 48, fontWeight: '700', color: '#00FF41', textTransform: 'uppercase', letterSpacing: 6 }),
        baseText({ id: lid(), name: 'Tagline', content: 'SYSTEMS & SOFTWARE', y: 322, fontFamily: 'Roboto', fontSize: 12, fontWeight: '400', color: '#48CAE4', textTransform: 'uppercase', letterSpacing: 4 }),
      ],
    },
  },
  {
    id: 't-tech-gradient-hex',
    name: 'Hex Gradient',
    category: 'Technology',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: gradientBg('#1A0533', '#0D1B2A', 135),
      layers: [
        baseShape({ id: lid(), name: 'Hex', shapeType: 'hexagon', x: 175, y: 85, width: 150, height: 150, fillType: 'gradient', gradientColor1: '#7B2FBE', gradientColor2: '#1A73E8', gradientAngle: 135, fill: '#7B2FBE', shadow: true, shadowColor: '#7B2FBE50', shadowX: 0, shadowY: 10, shadowBlur: 30 }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'chip', x: 205, y: 115, width: 90, height: 90, fill: '#FFFFFF' }),
        baseText({ id: lid(), name: 'Brand', content: 'SYNTHEX', y: 270, fontFamily: 'Poppins', fontSize: 40, fontWeight: '800', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 4 }),
        baseText({ id: lid(), name: 'Tagline', content: 'AI & Cloud Infrastructure', y: 326, fontFamily: 'Inter', fontSize: 13, fontWeight: '300', color: '#A78BFA', letterSpacing: 1 }),
      ],
    },
  },
  {
    id: 't-tech-neon-blue',
    name: 'Neon Blue',
    category: 'Technology',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#030712'),
      layers: [
        baseShape({ id: lid(), name: 'Glow', shapeType: 'circle', x: 160, y: 80, width: 180, height: 180, fill: '#1A73E8', opacity: 0.15 }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'rocket', x: 200, y: 105, width: 100, height: 110, fill: '#38BDF8', shadow: true, shadowColor: '#38BDF880', shadowX: 0, shadowY: 0, shadowBlur: 20 }),
        baseText({ id: lid(), name: 'Brand', content: 'LAUNCHPAD', y: 262, fontFamily: 'Montserrat', fontSize: 36, fontWeight: '900', color: '#F0F9FF', textTransform: 'uppercase', letterSpacing: 5 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Accelerate Your Vision', y: 316, fontFamily: 'Lato', fontSize: 14, fontWeight: '300', color: '#38BDF8', letterSpacing: 2 }),
      ],
    },
  },
  {
    id: 't-tech-white-clean',
    name: 'Clean White Tech',
    category: 'Technology',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#F8FAFC'),
      layers: [
        baseShape({ id: lid(), name: 'Square BG', shapeType: 'rect', x: 185, y: 100, width: 130, height: 130, fill: '#1E293B', cornerRadius: 20, shadow: true, shadowColor: '#1E293B30', shadowX: 0, shadowY: 8, shadowBlur: 20 }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'wifi', x: 215, y: 128, width: 70, height: 70, fill: '#38BDF8' }),
        baseText({ id: lid(), name: 'Brand', content: 'NETLINK', y: 270, fontFamily: 'Poppins', fontSize: 38, fontWeight: '700', color: '#0F172A', textTransform: 'uppercase', letterSpacing: 4 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Connected. Secure. Fast.', y: 323, fontFamily: 'Inter', fontSize: 14, fontWeight: '400', color: '#64748B' }),
      ],
    },
  },
  {
    id: 't-tech-purple-wave',
    name: 'Purple Wave',
    category: 'Technology',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: gradientBg('#4F1787', '#1A0533', 160),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'cloud', x: 185, y: 90, width: 130, height: 100, fill: '#FFFFFF', shadow: true, shadowColor: '#FFFFFF40', shadowX: 0, shadowY: 4, shadowBlur: 16 }),
        baseText({ id: lid(), name: 'Brand', content: 'CLOUDVEX', y: 240, fontFamily: 'Montserrat', fontSize: 40, fontWeight: '800', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 3 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Cloud · Data · DevOps', y: 296, fontFamily: 'Raleway', fontSize: 15, fontWeight: '400', color: '#E9D5FF', letterSpacing: 2 }),
      ],
    },
  },
  {
    id: 't-tech-side-icon',
    name: 'Side Icon Tech',
    category: 'Technology',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#EFF6FF'),
      layers: [
        baseShape({ id: lid(), name: 'Pill', shapeType: 'rect', x: 60, y: 155, width: 380, height: 90, fill: '#1E40AF', cornerRadius: 45 }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'bolt', x: 75, y: 168, width: 65, height: 65, fill: '#FFFFFF' }),
        baseText({ id: lid(), name: 'Brand', content: 'VOLTBIT', x: 150, y: 178, width: 260, height: 55, fontFamily: 'Poppins', fontSize: 36, fontWeight: '800', color: '#FFFFFF', textAlign: 'left', textTransform: 'uppercase', letterSpacing: 3 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Powering the Future of Tech', y: 282, fontFamily: 'Inter', fontSize: 14, fontWeight: '400', color: '#1E40AF' }),
      ],
    },
  },

  // ── FOOD & DRINK (8 templates) ──
  {
    id: 't-food-classic',
    name: 'Fork & Knife Classic',
    category: 'Food & Drink',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#FDF6EC'),
      layers: [
        baseShape({ id: lid(), name: 'BG Circle', shapeType: 'circle', x: 187, y: 90, width: 126, height: 126, fill: '#2C1810', shadow: true }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'fork-knife', x: 218, y: 115, width: 64, height: 80, fill: '#D4A017' }),
        baseText({ id: lid(), name: 'Restaurant', content: 'LA CUCINA', y: 252, fontFamily: 'Playfair Display', fontSize: 36, fontWeight: '700', color: '#2C1810', textTransform: 'uppercase', letterSpacing: 4 }),
        baseText({ id: lid(), name: 'Type', content: 'FINE DINING', y: 302, fontFamily: 'Raleway', fontSize: 14, fontWeight: '400', color: '#D4A017', textTransform: 'uppercase', letterSpacing: 6, fontStyle: 'italic' }),
      ],
    },
  },
  {
    id: 't-food-flame-bbq',
    name: 'Flame Bold BBQ',
    category: 'Food & Drink',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#1A0800'),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'flame', x: 175, y: 75, width: 150, height: 155, fill: '#FF6B00' }),
        baseText({ id: lid(), name: 'Restaurant', content: 'BLAZING', y: 268, fontFamily: 'Bebas Neue', fontSize: 72, fontWeight: '400', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 8 }),
        baseText({ id: lid(), name: 'Sub', content: 'GRILL & BBQ', y: 346, fontFamily: 'Oswald', fontSize: 20, fontWeight: '400', color: '#FF6B00', textTransform: 'uppercase', letterSpacing: 6 }),
      ],
    },
  },
  {
    id: 't-food-coffee-warm',
    name: 'Coffee House',
    category: 'Food & Drink',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#2C1A0E'),
      layers: [
        baseShape({ id: lid(), name: 'Circle BG', shapeType: 'circle', x: 178, y: 88, width: 144, height: 144, fill: '#6B3A1F', shadow: false }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'coffee', x: 208, y: 115, width: 84, height: 90, fill: '#F5CBA7' }),
        baseText({ id: lid(), name: 'Brand', content: 'BREW & CO.', y: 272, fontFamily: 'Playfair Display', fontSize: 34, fontWeight: '700', color: '#F5CBA7', letterSpacing: 3 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Artisan Coffee Roasters', y: 322, fontFamily: 'Lato', fontSize: 14, fontWeight: '300', color: '#C8956C', fontStyle: 'italic' }),
      ],
    },
  },
  {
    id: 't-food-pizza-red',
    name: 'Pizza House',
    category: 'Food & Drink',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: gradientBg('#C0392B', '#8B0000', 160),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'pizza', x: 185, y: 80, width: 130, height: 130, fill: '#FFFFFF', shadow: true, shadowColor: '#00000050', shadowX: 0, shadowY: 6, shadowBlur: 12 }),
        baseText({ id: lid(), name: 'Brand', content: 'NAPOLI', y: 252, fontFamily: 'Oswald', fontSize: 56, fontWeight: '700', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 6 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Authentic Italian Pizza', y: 316, fontFamily: 'Lato', fontSize: 14, fontWeight: '300', color: '#FECACA', letterSpacing: 2 }),
      ],
    },
  },
  {
    id: 't-food-smoothie-fresh',
    name: 'Fresh Smoothie',
    category: 'Food & Drink',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: gradientBg('#F9A825', '#FF6F00', 145),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'leaf', x: 195, y: 85, width: 110, height: 120, fill: '#FFFFFF' }),
        baseText({ id: lid(), name: 'Brand', content: 'FRESCA', y: 248, fontFamily: 'Pacifico', fontSize: 52, fontWeight: '400', color: '#FFFFFF' }),
        baseText({ id: lid(), name: 'Tagline', content: 'FRESH JUICE & SMOOTHIES', y: 316, fontFamily: 'Montserrat', fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: 3 }),
      ],
    },
  },
  {
    id: 't-food-sushi-minimal',
    name: 'Sushi Minimal',
    category: 'Food & Drink',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#FAFAFA'),
      layers: [
        baseShape({ id: lid(), name: 'Accent', shapeType: 'rect', x: 50, y: 230, width: 400, height: 2, fill: '#E53E3E' }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'chopsticks', x: 200, y: 90, width: 100, height: 130, fill: '#1A1A1A' }),
        baseText({ id: lid(), name: 'Brand', content: 'SAKURA', y: 248, fontFamily: 'Raleway', fontSize: 50, fontWeight: '800', color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: 8 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Japanese Cuisine', y: 276, fontFamily: 'Lato', fontSize: 16, fontWeight: '300', color: '#E53E3E', fontStyle: 'italic' }),
      ],
    },
  },
  {
    id: 't-food-burger-bold',
    name: 'Burger Bold',
    category: 'Food & Drink',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#FFFBEB'),
      layers: [
        baseShape({ id: lid(), name: 'Badge', shapeType: 'circle', x: 165, y: 75, width: 170, height: 170, fill: '#D97706', shadow: true, shadowColor: '#D9770640', shadowX: 0, shadowY: 8, shadowBlur: 20 }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'burger', x: 200, y: 110, width: 100, height: 90, fill: '#FFFFFF' }),
        baseText({ id: lid(), name: 'Brand', content: "BIG JO'S", y: 288, fontFamily: 'Bebas Neue', fontSize: 60, fontWeight: '400', color: '#1C1917', textTransform: 'uppercase', letterSpacing: 4 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Smash Burgers & Shakes', y: 352, fontFamily: 'Lato', fontSize: 14, fontWeight: '400', color: '#D97706' }),
      ],
    },
  },
  {
    id: 't-food-wine-elegant',
    name: 'Wine Elegant',
    category: 'Food & Drink',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#1A0A2E'),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'wine-glass', x: 205, y: 85, width: 90, height: 130, fill: '#C9A84C', shadow: true, shadowColor: '#C9A84C40', shadowX: 0, shadowY: 6, shadowBlur: 16 }),
        baseText({ id: lid(), name: 'Brand', content: 'VINO NOIR', y: 258, fontFamily: 'Playfair Display', fontSize: 38, fontWeight: '700', color: '#F5F0E8', letterSpacing: 2 }),
        baseText({ id: lid(), name: 'Tagline', content: 'FINE WINES & SPIRITS', y: 310, fontFamily: 'Raleway', fontSize: 12, fontWeight: '300', color: '#C9A84C', textTransform: 'uppercase', letterSpacing: 5 }),
      ],
    },
  },

  // ── HEALTH & WELLNESS (8 templates) ──
  {
    id: 't-health-cross-clean',
    name: 'Cross Clean',
    category: 'Health & Wellness',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#FFFFFF'),
      layers: [
        baseShape({ id: lid(), name: 'BG Circle', shapeType: 'circle', x: 185, y: 95, width: 130, height: 130, fill: '#16A085', shadow: true, shadowColor: '#16A08540', shadowX: 0, shadowY: 8, shadowBlur: 20 }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'cross-plus', x: 215, y: 122, width: 70, height: 70, fill: '#FFFFFF' }),
        baseText({ id: lid(), name: 'Brand', content: 'MEDCARE', y: 266, fontFamily: 'Poppins', fontSize: 36, fontWeight: '700', color: '#0B3D2E', textTransform: 'uppercase', letterSpacing: 4 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Caring For You', y: 318, fontFamily: 'Lato', fontSize: 16, fontWeight: '400', color: '#16A085', fontStyle: 'italic' }),
      ],
    },
  },
  {
    id: 't-health-leaf-wellness',
    name: 'Leaf Wellness',
    category: 'Health & Wellness',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: gradientBg('#F0FFF4', '#D5F5E3', 180),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'lotus', x: 175, y: 85, width: 150, height: 135, fill: '#1E8449' }),
        baseText({ id: lid(), name: 'Brand', content: 'ZenLife', y: 258, fontFamily: 'Playfair Display', fontSize: 48, fontWeight: '600', color: '#0B3D2E' }),
        baseText({ id: lid(), name: 'Tagline', content: 'WELLNESS & SPA', y: 318, fontFamily: 'Raleway', fontSize: 13, fontWeight: '400', color: '#27AE60', textTransform: 'uppercase', letterSpacing: 4 }),
      ],
    },
  },
  {
    id: 't-health-yoga-soft',
    name: 'Yoga Soft',
    category: 'Health & Wellness',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: gradientBg('#FFF5F5', '#FFE4E6', 160),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'yoga', x: 185, y: 80, width: 130, height: 140, fill: '#BE185D', shadow: false }),
        baseText({ id: lid(), name: 'Brand', content: 'Serenity', y: 262, fontFamily: 'Dancing Script', fontSize: 52, fontWeight: '700', color: '#831843' }),
        baseText({ id: lid(), name: 'Tagline', content: 'YOGA & MINDFULNESS STUDIO', y: 324, fontFamily: 'Raleway', fontSize: 11, fontWeight: '400', color: '#BE185D', textTransform: 'uppercase', letterSpacing: 3 }),
      ],
    },
  },
  {
    id: 't-health-nutrition-green',
    name: 'Nutrition Green',
    category: 'Health & Wellness',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#ECFDF5'),
      layers: [
        baseShape({ id: lid(), name: 'Hex', shapeType: 'hexagon', x: 180, y: 88, width: 140, height: 140, fill: '#059669', shadow: true, shadowColor: '#05966940', shadowX: 0, shadowY: 6, shadowBlur: 18 }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'apple', x: 213, y: 118, width: 74, height: 74, fill: '#FFFFFF' }),
        baseText({ id: lid(), name: 'Brand', content: 'NOURISH', y: 268, fontFamily: 'Poppins', fontSize: 38, fontWeight: '700', color: '#064E3B', textTransform: 'uppercase', letterSpacing: 4 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Fuel Your Best Self', y: 318, fontFamily: 'Open Sans', fontSize: 15, fontWeight: '300', color: '#059669', fontStyle: 'italic' }),
      ],
    },
  },
  {
    id: 't-health-clinic-blue',
    name: 'Clinic Blue',
    category: 'Health & Wellness',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#EFF6FF'),
      layers: [
        baseShape({ id: lid(), name: 'Shield', shapeType: 'shield', x: 185, y: 85, width: 130, height: 150, fill: '#1D4ED8', shadow: true, shadowColor: '#1D4ED830', shadowX: 0, shadowY: 8, shadowBlur: 16 }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'heart', x: 215, y: 120, width: 70, height: 65, fill: '#FFFFFF' }),
        baseText({ id: lid(), name: 'Brand', content: 'VITALIS', y: 276, fontFamily: 'Montserrat', fontSize: 38, fontWeight: '800', color: '#1E3A8A', textTransform: 'uppercase', letterSpacing: 5 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Your Health, Our Priority', y: 326, fontFamily: 'Lato', fontSize: 14, fontWeight: '400', color: '#3B82F6' }),
      ],
    },
  },
  {
    id: 't-health-fitness-dark',
    name: 'Fitness Dark',
    category: 'Health & Wellness',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#111827'),
      layers: [
        baseShape({ id: lid(), name: 'Glow', shapeType: 'circle', x: 165, y: 78, width: 170, height: 170, fill: '#10B981', opacity: 0.1 }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'dumbbell', x: 175, y: 100, width: 150, height: 100, fill: '#10B981', shadow: true, shadowColor: '#10B98160', shadowX: 0, shadowY: 0, shadowBlur: 20 }),
        baseText({ id: lid(), name: 'Brand', content: 'PEAK FIT', y: 252, fontFamily: 'Oswald', fontSize: 52, fontWeight: '700', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 4 }),
        baseText({ id: lid(), name: 'Tagline', content: 'TRAIN · RECOVER · TRANSFORM', y: 314, fontFamily: 'Inter', fontSize: 12, fontWeight: '400', color: '#10B981', textTransform: 'uppercase', letterSpacing: 3 }),
      ],
    },
  },
  {
    id: 't-health-pharmacy',
    name: 'Pharmacy Clean',
    category: 'Health & Wellness',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#FFFFFF'),
      layers: [
        baseShape({ id: lid(), name: 'Cross BG', shapeType: 'cross', x: 192, y: 95, width: 116, height: 116, fill: '#0EA5E9', shadow: false }),
        baseText({ id: lid(), name: 'Brand', content: 'PHARMAPLUS', y: 255, fontFamily: 'Inter', fontSize: 30, fontWeight: '700', color: '#0369A1', textTransform: 'uppercase', letterSpacing: 3 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Your Trusted Pharmacy', y: 302, fontFamily: 'Open Sans', fontSize: 15, fontWeight: '400', color: '#0EA5E9' }),
      ],
    },
  },
  {
    id: 't-health-mental-calm',
    name: 'Mental Calm',
    category: 'Health & Wellness',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: gradientBg('#EDE9FE', '#DDD6FE', 170),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'brain', x: 185, y: 85, width: 130, height: 120, fill: '#7C3AED' }),
        baseText({ id: lid(), name: 'Brand', content: 'Mindwell', y: 248, fontFamily: 'Playfair Display', fontSize: 46, fontWeight: '600', color: '#3B0764' }),
        baseText({ id: lid(), name: 'Tagline', content: 'Mental Health & Therapy', y: 306, fontFamily: 'Lato', fontSize: 15, fontWeight: '300', color: '#7C3AED', fontStyle: 'italic' }),
      ],
    },
  },

  // ── EDUCATION (7 templates) ──
  {
    id: 't-edu-classic-book',
    name: 'Academy Classic',
    category: 'Education',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#EEF2FF'),
      layers: [
        baseShape({ id: lid(), name: 'BG Hex', shapeType: 'hexagon', x: 175, y: 88, width: 150, height: 150, fill: '#2E4482', shadow: true }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'book', x: 200, y: 115, width: 100, height: 100, fill: '#C9A84C' }),
        baseText({ id: lid(), name: 'Institute', content: 'ACADEMIA', y: 276, fontFamily: 'Playfair Display', fontSize: 34, fontWeight: '700', color: '#2E4482', textTransform: 'uppercase', letterSpacing: 4 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Knowledge · Growth · Excellence', y: 326, fontFamily: 'Raleway', fontSize: 13, fontWeight: '400', color: '#C9A84C', letterSpacing: 2 }),
      ],
    },
  },
  {
    id: 't-edu-modern-online',
    name: 'Online Learning',
    category: 'Education',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: gradientBg('#1E3A8A', '#1D4ED8', 145),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'laptop', x: 175, y: 88, width: 150, height: 115, fill: '#FFFFFF', shadow: true, shadowColor: '#FFFFFF30', shadowX: 0, shadowY: 6, shadowBlur: 14 }),
        baseText({ id: lid(), name: 'Brand', content: 'LEARNIFY', y: 252, fontFamily: 'Poppins', fontSize: 40, fontWeight: '800', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 3 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Learn Smarter. Grow Faster.', y: 306, fontFamily: 'Inter', fontSize: 14, fontWeight: '300', color: '#BFDBFE', letterSpacing: 1 }),
      ],
    },
  },
  {
    id: 't-edu-university-crest',
    name: 'University Crest',
    category: 'Education',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#FAFAF5'),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'mortarboard', x: 185, y: 80, width: 130, height: 110, fill: '#7C2D12', shadow: false }),
        baseShape({ id: lid(), name: 'Line', shapeType: 'rect', x: 100, y: 228, width: 300, height: 2, fill: '#7C2D12' }),
        baseText({ id: lid(), name: 'Brand', content: 'OXFORD PREP', y: 246, fontFamily: 'Playfair Display', fontSize: 30, fontWeight: '700', color: '#7C2D12', textTransform: 'uppercase', letterSpacing: 3 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Est. 1892 · Excellence in Education', y: 294, fontFamily: 'Lato', fontSize: 13, fontWeight: '400', color: '#78350F', fontStyle: 'italic' }),
      ],
    },
  },
  {
    id: 't-edu-kids-bright',
    name: 'Kids Bright',
    category: 'Education',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#FFFBEB'),
      layers: [
        baseShape({ id: lid(), name: 'Star', shapeType: 'star', x: 178, y: 80, width: 144, height: 144, fill: '#F59E0B', shadow: true, shadowColor: '#F59E0B40', shadowX: 0, shadowY: 8, shadowBlur: 16 }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'pencil', x: 210, y: 113, width: 80, height: 80, fill: '#FFFFFF' }),
        baseText({ id: lid(), name: 'Brand', content: 'BRIGHT MINDS', y: 268, fontFamily: 'Poppins', fontSize: 30, fontWeight: '800', color: '#92400E', textTransform: 'uppercase', letterSpacing: 2 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Fun Learning for Kids', y: 314, fontFamily: 'Open Sans', fontSize: 15, fontWeight: '400', color: '#D97706' }),
      ],
    },
  },
  {
    id: 't-edu-science-lab',
    name: 'Science Lab',
    category: 'Education',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#0F172A'),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'flask', x: 205, y: 85, width: 90, height: 125, fill: '#34D399', shadow: true, shadowColor: '#34D39950', shadowX: 0, shadowY: 0, shadowBlur: 20 }),
        baseText({ id: lid(), name: 'Brand', content: 'STEMLAB', y: 258, fontFamily: 'Montserrat', fontSize: 40, fontWeight: '900', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 5 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Science · Technology · Engineering', y: 312, fontFamily: 'Inter', fontSize: 13, fontWeight: '300', color: '#34D399', letterSpacing: 1 }),
      ],
    },
  },
  {
    id: 't-edu-language-school',
    name: 'Language School',
    category: 'Education',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: gradientBg('#FEF3C7', '#FDE68A', 180),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'globe', x: 185, y: 85, width: 130, height: 130, fill: '#B45309', shadow: false }),
        baseText({ id: lid(), name: 'Brand', content: 'LINGUA', y: 256, fontFamily: 'Raleway', fontSize: 50, fontWeight: '800', color: '#78350F', textTransform: 'uppercase', letterSpacing: 6 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Language Learning Center', y: 314, fontFamily: 'Lato', fontSize: 15, fontWeight: '400', color: '#92400E' }),
      ],
    },
  },
  {
    id: 't-edu-music-school',
    name: 'Music School',
    category: 'Education',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#1E1B4B'),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'music-note', x: 200, y: 85, width: 100, height: 130, fill: '#A5B4FC', shadow: true, shadowColor: '#A5B4FC50', shadowX: 0, shadowY: 0, shadowBlur: 18 }),
        baseText({ id: lid(), name: 'Brand', content: 'HARMONIA', y: 258, fontFamily: 'Playfair Display', fontSize: 38, fontWeight: '700', color: '#E0E7FF', textTransform: 'uppercase', letterSpacing: 4 }),
        baseText({ id: lid(), name: 'Tagline', content: 'School of Music & Arts', y: 308, fontFamily: 'Raleway', fontSize: 14, fontWeight: '300', color: '#A5B4FC', fontStyle: 'italic' }),
      ],
    },
  },

  // ── BEAUTY & FASHION (7 templates) ──
  {
    id: 't-beauty-rose-elegant',
    name: 'Rose Elegant',
    category: 'Beauty & Fashion',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#FFF5F7'),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'rose', x: 195, y: 85, width: 110, height: 125, fill: '#C9967A' }),
        baseText({ id: lid(), name: 'Brand', content: 'Rosé Belle', y: 252, fontFamily: 'Dancing Script', fontSize: 56, fontWeight: '700', color: '#C9967A' }),
        baseText({ id: lid(), name: 'Tagline', content: 'BEAUTY & SKINCARE', y: 320, fontFamily: 'Raleway', fontSize: 12, fontWeight: '300', color: '#8B4558', textTransform: 'uppercase', letterSpacing: 5 }),
      ],
    },
  },
  {
    id: 't-beauty-crown-luxury',
    name: 'Crown Luxury',
    category: 'Beauty & Fashion',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#0A0A0A'),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'crown', x: 185, y: 95, width: 130, height: 105, fill: '#C9A84C' }),
        baseText({ id: lid(), name: 'Brand', content: 'LUXORIA', y: 244, fontFamily: 'Playfair Display', fontSize: 48, fontWeight: '400', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 10 }),
        baseText({ id: lid(), name: 'Tagline', content: 'FASHION & LIFESTYLE', y: 304, fontFamily: 'Raleway', fontSize: 12, fontWeight: '300', color: '#C9A84C', textTransform: 'uppercase', letterSpacing: 6 }),
      ],
    },
  },
  {
    id: 't-beauty-blush-soft',
    name: 'Blush Soft',
    category: 'Beauty & Fashion',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: gradientBg('#FDF2F8', '#FCE7F3', 160),
      layers: [
        baseShape({ id: lid(), name: 'Circle', shapeType: 'circle', x: 185, y: 90, width: 130, height: 130, fill: '#EC4899', opacity: 0.15 }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'lipstick', x: 215, y: 110, width: 70, height: 100, fill: '#DB2777' }),
        baseText({ id: lid(), name: 'Brand', content: 'VELVET', y: 252, fontFamily: 'Montserrat', fontSize: 44, fontWeight: '900', color: '#831843', textTransform: 'uppercase', letterSpacing: 8 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Premium Cosmetics', y: 306, fontFamily: 'Lato', fontSize: 15, fontWeight: '300', color: '#DB2777', fontStyle: 'italic' }),
      ],
    },
  },
  {
    id: 't-beauty-gold-minimal',
    name: 'Gold Minimal',
    category: 'Beauty & Fashion',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#FFFFF8'),
      layers: [
        baseShape({ id: lid(), name: 'Line Top', shapeType: 'rect', x: 150, y: 170, width: 200, height: 1, fill: '#B7950B' }),
        baseText({ id: lid(), name: 'Brand', content: 'AURORE', y: 188, fontFamily: 'Playfair Display', fontSize: 52, fontWeight: '400', color: '#B7950B', textTransform: 'uppercase', letterSpacing: 8 }),
        baseShape({ id: lid(), name: 'Line Bot', shapeType: 'rect', x: 150, y: 258, width: 200, height: 1, fill: '#B7950B' }),
        baseText({ id: lid(), name: 'Tagline', content: 'Haute Couture', y: 276, fontFamily: 'Lato', fontSize: 16, fontWeight: '300', color: '#7D6608', fontStyle: 'italic' }),
      ],
    },
  },
  {
    id: 't-beauty-nail-pink',
    name: 'Nail & Spa Pink',
    category: 'Beauty & Fashion',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: gradientBg('#FF6EB4', '#FF1493', 135),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'nail', x: 205, y: 85, width: 90, height: 120, fill: '#FFFFFF', shadow: true, shadowColor: '#FFFFFF40', shadowX: 0, shadowY: 6, shadowBlur: 14 }),
        baseText({ id: lid(), name: 'Brand', content: 'GLAM BAR', y: 252, fontFamily: 'Pacifico', fontSize: 40, fontWeight: '400', color: '#FFFFFF' }),
        baseText({ id: lid(), name: 'Tagline', content: 'NAILS · LASHES · BEAUTY', y: 314, fontFamily: 'Montserrat', fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', letterSpacing: 3 }),
      ],
    },
  },
  {
    id: 't-beauty-streetwear',
    name: 'Streetwear Bold',
    category: 'Beauty & Fashion',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#111111'),
      layers: [
        baseText({ id: lid(), name: 'Brand', content: 'CRUDE', x: 50, y: 150, width: 400, height: 120, fontFamily: 'Bebas Neue', fontSize: 110, fontWeight: '400', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 6 }),
        baseShape({ id: lid(), name: 'Accent', shapeType: 'rect', x: 50, y: 272, width: 130, height: 5, fill: '#EF4444' }),
        baseText({ id: lid(), name: 'Tagline', content: 'URBAN STREETWEAR', y: 294, fontFamily: 'Oswald', fontSize: 16, fontWeight: '400', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 4 }),
      ],
    },
  },
  {
    id: 't-beauty-perfume',
    name: 'Perfume House',
    category: 'Beauty & Fashion',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: gradientBg('#2D1B69', '#0F0C29', 160),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'perfume', x: 205, y: 80, width: 90, height: 130, fill: '#DDD6FE', shadow: true, shadowColor: '#DDD6FE50', shadowX: 0, shadowY: 0, shadowBlur: 24 }),
        baseText({ id: lid(), name: 'Brand', content: 'AMBRÉE', y: 254, fontFamily: 'Playfair Display', fontSize: 46, fontWeight: '400', color: '#F5F3FF', textTransform: 'uppercase', letterSpacing: 6 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Luxury Fragrance', y: 310, fontFamily: 'Raleway', fontSize: 14, fontWeight: '300', color: '#A78BFA', fontStyle: 'italic' }),
      ],
    },
  },

  // ── CONSTRUCTION (7 templates) ──
  {
    id: 't-construct-iron-bold',
    name: 'Iron Bold',
    category: 'Construction',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#1C1C1C'),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'building', x: 195, y: 78, width: 110, height: 132, fill: '#E87722' }),
        baseText({ id: lid(), name: 'Brand', content: 'IRONBUILD', y: 252, fontFamily: 'Bebas Neue', fontSize: 60, fontWeight: '400', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 4 }),
        baseText({ id: lid(), name: 'Sub', content: 'CONSTRUCTION & INFRASTRUCTURE', y: 320, fontFamily: 'Oswald', fontSize: 12, fontWeight: '400', color: '#E87722', textTransform: 'uppercase', letterSpacing: 3 }),
      ],
    },
  },
  {
    id: 't-construct-hardhat',
    name: 'Hard Hat Safety',
    category: 'Construction',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#1A1A00'),
      layers: [
        baseShape({ id: lid(), name: 'Badge', shapeType: 'circle', x: 170, y: 78, width: 160, height: 160, fill: '#F59E0B', shadow: true, shadowColor: '#F59E0B50', shadowX: 0, shadowY: 8, shadowBlur: 20 }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'hardhat', x: 200, y: 108, width: 100, height: 90, fill: '#1C1C00' }),
        baseText({ id: lid(), name: 'Brand', content: 'SAFESITE', y: 280, fontFamily: 'Oswald', fontSize: 48, fontWeight: '700', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 4 }),
        baseText({ id: lid(), name: 'Tagline', content: 'SAFETY · QUALITY · INTEGRITY', y: 338, fontFamily: 'Inter', fontSize: 12, fontWeight: '400', color: '#F59E0B', textTransform: 'uppercase', letterSpacing: 3 }),
      ],
    },
  },
  {
    id: 't-construct-steel-grey',
    name: 'Steel & Grey',
    category: 'Construction',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: gradientBg('#374151', '#111827', 160),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'crane', x: 170, y: 75, width: 160, height: 140, fill: '#F59E0B' }),
        baseText({ id: lid(), name: 'Brand', content: 'STEELFORM', y: 256, fontFamily: 'Bebas Neue', fontSize: 56, fontWeight: '400', color: '#F9FAFB', textTransform: 'uppercase', letterSpacing: 3 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Engineering Excellence Since 1988', y: 318, fontFamily: 'Lato', fontSize: 13, fontWeight: '300', color: '#9CA3AF' }),
      ],
    },
  },
  {
    id: 't-construct-brick-red',
    name: 'Brick Red',
    category: 'Construction',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#FFF7ED'),
      layers: [
        baseShape({ id: lid(), name: 'BG Rect', shapeType: 'rect', x: 60, y: 88, width: 380, height: 160, fill: '#B45309', cornerRadius: 8, shadow: true, shadowColor: '#B4530930', shadowX: 0, shadowY: 8, shadowBlur: 16 }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'brick', x: 80, y: 110, width: 110, height: 110, fill: '#FFFFFF' }),
        baseText({ id: lid(), name: 'Brand', content: 'REDSTONE', x: 200, y: 120, width: 230, height: 55, fontFamily: 'Oswald', fontSize: 38, fontWeight: '700', color: '#FFFFFF', textAlign: 'left', textTransform: 'uppercase', letterSpacing: 2 }),
        baseText({ id: lid(), name: 'Sub', content: 'Masonry & Construction', x: 200, y: 175, width: 230, height: 30, fontFamily: 'Lato', fontSize: 13, fontWeight: '300', color: '#FDE68A', textAlign: 'left' }),
        baseText({ id: lid(), name: 'Tagline', content: 'Built to Last. Built to Impress.', y: 298, fontFamily: 'Open Sans', fontSize: 15, fontWeight: '400', color: '#78350F', fontStyle: 'italic' }),
      ],
    },
  },
  {
    id: 't-construct-road-works',
    name: 'Road Works',
    category: 'Construction',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#0A0A0A'),
      layers: [
        baseShape({ id: lid(), name: 'Triangle', shapeType: 'triangle', x: 175, y: 75, width: 150, height: 150, fill: '#FBBF24', shadow: false }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'shovel', x: 215, y: 118, width: 70, height: 80, fill: '#0A0A0A' }),
        baseText({ id: lid(), name: 'Brand', content: 'GROUNDUP', y: 268, fontFamily: 'Bebas Neue', fontSize: 58, fontWeight: '400', color: '#FBBF24', textTransform: 'uppercase', letterSpacing: 4 }),
        baseText({ id: lid(), name: 'Tagline', content: 'CIVIL ENGINEERING & ROADWORKS', y: 334, fontFamily: 'Inter', fontSize: 11, fontWeight: '400', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 3 }),
      ],
    },
  },
  {
    id: 't-construct-plumbing',
    name: 'Plumbing & HVAC',
    category: 'Construction',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#EFF6FF'),
      layers: [
        baseShape({ id: lid(), name: 'Shield', shapeType: 'shield', x: 185, y: 85, width: 130, height: 148, fill: '#1E40AF', shadow: true }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'wrench', x: 218, y: 118, width: 64, height: 80, fill: '#FFFFFF' }),
        baseText({ id: lid(), name: 'Brand', content: 'PIPEMASTER', y: 276, fontFamily: 'Oswald', fontSize: 38, fontWeight: '700', color: '#1E3A8A', textTransform: 'uppercase', letterSpacing: 3 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Plumbing · HVAC · Electrical', y: 324, fontFamily: 'Inter', fontSize: 13, fontWeight: '400', color: '#3B82F6' }),
      ],
    },
  },
  {
    id: 't-construct-architect',
    name: 'Architecture Firm',
    category: 'Construction',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#F8F8F8'),
      layers: [
        baseShape({ id: lid(), name: 'Line 1', shapeType: 'rect', x: 50, y: 220, width: 400, height: 1, fill: '#1A1A1A' }),
        baseText({ id: lid(), name: 'Brand', content: 'FORMA', x: 50, y: 120, width: 400, height: 110, fontFamily: 'Raleway', fontSize: 90, fontWeight: '200', color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: 14 }),
        baseText({ id: lid(), name: 'Sub', content: 'ARCHITECTS & PLANNERS', y: 240, fontFamily: 'Inter', fontSize: 12, fontWeight: '600', color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: 5 }),
        baseText({ id: lid(), name: 'Est', content: 'Est. 2004', y: 286, fontFamily: 'Lato', fontSize: 14, fontWeight: '300', color: '#6B7280', fontStyle: 'italic' }),
      ],
    },
  },

  // ── SPORTS (7 templates) ──
  {
    id: 't-sports-lightning-gym',
    name: 'Lightning Gym',
    category: 'Sports',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#0A0A0A'),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'lightning', x: 215, y: 78, width: 70, height: 145, fill: '#FBBF24', shadow: true, shadowColor: '#FBBF2460', shadowX: 0, shadowY: 0, shadowBlur: 24 }),
        baseText({ id: lid(), name: 'Brand', content: 'TITAN GYM', y: 264, fontFamily: 'Bebas Neue', fontSize: 60, fontWeight: '400', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 4 }),
        baseText({ id: lid(), name: 'Sub', content: 'STRENGTH · POWER · PERFORMANCE', y: 332, fontFamily: 'Oswald', fontSize: 12, fontWeight: '400', color: '#FBBF24', textTransform: 'uppercase', letterSpacing: 3 }),
      ],
    },
  },
  {
    id: 't-sports-football-red',
    name: 'Football Club',
    category: 'Sports',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: gradientBg('#7F1D1D', '#991B1B', 160),
      layers: [
        baseShape({ id: lid(), name: 'Shield', shapeType: 'shield', x: 178, y: 78, width: 144, height: 164, fill: '#1C1C1C', shadow: true, shadowColor: '#00000060', shadowX: 0, shadowY: 8, shadowBlur: 20 }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'football', x: 210, y: 115, width: 80, height: 80, fill: '#EF4444' }),
        baseText({ id: lid(), name: 'Brand', content: 'RED WOLVES', y: 286, fontFamily: 'Oswald', fontSize: 38, fontWeight: '700', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 3 }),
        baseText({ id: lid(), name: 'Sub', content: 'FOOTBALL CLUB · EST. 1998', y: 334, fontFamily: 'Raleway', fontSize: 11, fontWeight: '400', color: '#FCA5A5', textTransform: 'uppercase', letterSpacing: 4 }),
      ],
    },
  },
  {
    id: 't-sports-basketball-orange',
    name: 'Basketball Orange',
    category: 'Sports',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#0C0C0C'),
      layers: [
        baseShape({ id: lid(), name: 'Circle', shapeType: 'circle', x: 170, y: 78, width: 160, height: 160, fill: '#EA580C', shadow: true, shadowColor: '#EA580C50', shadowX: 0, shadowY: 8, shadowBlur: 24 }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'basketball', x: 200, y: 108, width: 100, height: 100, fill: '#FFFFFF' }),
        baseText({ id: lid(), name: 'Brand', content: 'SLAM DUNK', y: 280, fontFamily: 'Bebas Neue', fontSize: 56, fontWeight: '400', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 4 }),
        baseText({ id: lid(), name: 'Sub', content: 'ELITE BASKETBALL ACADEMY', y: 344, fontFamily: 'Inter', fontSize: 11, fontWeight: '400', color: '#EA580C', textTransform: 'uppercase', letterSpacing: 3 }),
      ],
    },
  },
  {
    id: 't-sports-running-blue',
    name: 'Running Club',
    category: 'Sports',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: gradientBg('#1D4ED8', '#1E3A8A', 145),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'runner', x: 185, y: 78, width: 130, height: 145, fill: '#FFFFFF', shadow: true, shadowColor: '#FFFFFF30', shadowX: 0, shadowY: 6, shadowBlur: 14 }),
        baseText({ id: lid(), name: 'Brand', content: 'PACE NATION', y: 266, fontFamily: 'Montserrat', fontSize: 34, fontWeight: '900', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 3 }),
        baseText({ id: lid(), name: 'Sub', content: 'RUN · TRAIN · COMPETE', y: 316, fontFamily: 'Inter', fontSize: 13, fontWeight: '400', color: '#BFDBFE', textTransform: 'uppercase', letterSpacing: 4 }),
      ],
    },
  },
  {
    id: 't-sports-chess-classic',
    name: 'Chess Classic',
    category: 'Sports',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#F8F4E8'),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'chess-king', x: 200, y: 80, width: 100, height: 140, fill: '#1C1C1C', shadow: false }),
        baseShape({ id: lid(), name: 'Line', shapeType: 'rect', x: 100, y: 260, width: 300, height: 2, fill: '#1C1C1C' }),
        baseText({ id: lid(), name: 'Brand', content: 'GRANDMASTER', y: 278, fontFamily: 'Playfair Display', fontSize: 28, fontWeight: '700', color: '#1C1C1C', textTransform: 'uppercase', letterSpacing: 2 }),
        baseText({ id: lid(), name: 'Sub', content: 'Chess Academy & Club', y: 320, fontFamily: 'Lato', fontSize: 15, fontWeight: '400', color: '#4B5563', fontStyle: 'italic' }),
      ],
    },
  },
  {
    id: 't-sports-esports-neon',
    name: 'Esports Neon',
    category: 'Sports',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#05001A'),
      layers: [
        baseShape({ id: lid(), name: 'Glow', shapeType: 'circle', x: 165, y: 78, width: 170, height: 170, fill: '#7C3AED', opacity: 0.15 }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'controller', x: 175, y: 100, width: 150, height: 110, fill: '#A78BFA', shadow: true, shadowColor: '#A78BFA70', shadowX: 0, shadowY: 0, shadowBlur: 22 }),
        baseText({ id: lid(), name: 'Brand', content: 'VOID SQUAD', y: 258, fontFamily: 'Montserrat', fontSize: 36, fontWeight: '900', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 4 }),
        baseText({ id: lid(), name: 'Sub', content: 'PROFESSIONAL ESPORTS TEAM', y: 308, fontFamily: 'Inter', fontSize: 11, fontWeight: '400', color: '#A78BFA', textTransform: 'uppercase', letterSpacing: 3 }),
      ],
    },
  },
  {
    id: 't-sports-swimming',
    name: 'Swimming Club',
    category: 'Sports',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: gradientBg('#0369A1', '#075985', 160),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'waves', x: 160, y: 88, width: 180, height: 100, fill: '#FFFFFF', opacity: 0.9 }),
        baseText({ id: lid(), name: 'Brand', content: 'AQUA SWIFT', y: 240, fontFamily: 'Poppins', fontSize: 38, fontWeight: '800', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 3 }),
        baseText({ id: lid(), name: 'Sub', content: 'AQUATIC CENTER & SWIM CLUB', y: 292, fontFamily: 'Inter', fontSize: 12, fontWeight: '400', color: '#BAE6FD', textTransform: 'uppercase', letterSpacing: 3 }),
      ],
    },
  },

  // ── FINANCE (7 templates) ──
  {
    id: 't-finance-shield-gold',
    name: 'Shield Gold',
    category: 'Finance',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#0D2137'),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'shield', x: 185, y: 85, width: 130, height: 135, fill: '#C9A84C' }),
        baseText({ id: lid(), name: 'Brand', content: 'FORTIS', y: 264, fontFamily: 'Playfair Display', fontSize: 44, fontWeight: '700', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 8 }),
        baseText({ id: lid(), name: 'Sub', content: 'TRUST · INTEGRITY · EXCELLENCE', y: 318, fontFamily: 'Raleway', fontSize: 11, fontWeight: '300', color: '#C9A84C', textTransform: 'uppercase', letterSpacing: 4 }),
      ],
    },
  },
  {
    id: 't-finance-bank-navy',
    name: 'Bank Navy',
    category: 'Finance',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#1E3A5F'),
      layers: [
        baseShape({ id: lid(), name: 'Column', shapeType: 'rect', x: 210, y: 85, width: 80, height: 140, fill: '#FFFFFF', cornerRadius: 4, shadow: false }),
        baseShape({ id: lid(), name: 'Base', shapeType: 'rect', x: 155, y: 218, width: 190, height: 14, fill: '#FFFFFF', cornerRadius: 3 }),
        baseText({ id: lid(), name: 'Brand', content: 'MERIDIAN BANK', y: 268, fontFamily: 'Montserrat', fontSize: 28, fontWeight: '700', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 3 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Banking You Can Trust', y: 316, fontFamily: 'Lato', fontSize: 15, fontWeight: '300', color: '#93C5FD', fontStyle: 'italic' }),
      ],
    },
  },
  {
    id: 't-finance-investment-green',
    name: 'Investment Growth',
    category: 'Finance',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#ECFDF5'),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'chart-line', x: 170, y: 85, width: 160, height: 130, fill: '#059669', shadow: false }),
        baseText({ id: lid(), name: 'Brand', content: 'GROWTHWISE', y: 258, fontFamily: 'Poppins', fontSize: 32, fontWeight: '700', color: '#064E3B', textTransform: 'uppercase', letterSpacing: 2 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Smart Investment Solutions', y: 306, fontFamily: 'Open Sans', fontSize: 15, fontWeight: '400', color: '#059669' }),
      ],
    },
  },
  {
    id: 't-finance-crypto-dark',
    name: 'Crypto Dark',
    category: 'Finance',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#060B14'),
      layers: [
        baseShape({ id: lid(), name: 'Glow', shapeType: 'circle', x: 165, y: 80, width: 170, height: 170, fill: '#F59E0B', opacity: 0.08 }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'bitcoin', x: 195, y: 100, width: 110, height: 110, fill: '#F59E0B', shadow: true, shadowColor: '#F59E0B60', shadowX: 0, shadowY: 0, shadowBlur: 24 }),
        baseText({ id: lid(), name: 'Brand', content: 'CRYPTOVAULT', y: 260, fontFamily: 'Montserrat', fontSize: 30, fontWeight: '800', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 3 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Decentralized. Secure. Yours.', y: 308, fontFamily: 'Inter', fontSize: 14, fontWeight: '300', color: '#F59E0B' }),
      ],
    },
  },
  {
    id: 't-finance-insurance',
    name: 'Insurance Clean',
    category: 'Finance',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#F0F9FF'),
      layers: [
        baseShape({ id: lid(), name: 'Shield', shapeType: 'shield', x: 185, y: 82, width: 130, height: 150, fill: '#0284C7', shadow: true, shadowColor: '#0284C730', shadowX: 0, shadowY: 8, shadowBlur: 20 }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'home', x: 215, y: 120, width: 70, height: 70, fill: '#FFFFFF' }),
        baseText({ id: lid(), name: 'Brand', content: 'SAFECOVER', y: 276, fontFamily: 'Poppins', fontSize: 32, fontWeight: '700', color: '#0C4A6E', textTransform: 'uppercase', letterSpacing: 3 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Home · Life · Auto Insurance', y: 320, fontFamily: 'Lato', fontSize: 14, fontWeight: '400', color: '#0284C7' }),
      ],
    },
  },
  {
    id: 't-finance-accounting',
    name: 'Accounting Firm',
    category: 'Finance',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#FFFFFF'),
      layers: [
        baseShape({ id: lid(), name: 'Rect BG', shapeType: 'rect', x: 50, y: 95, width: 400, height: 155, fill: '#1E293B', cornerRadius: 12, shadow: true, shadowColor: '#1E293B20', shadowX: 0, shadowY: 10, shadowBlur: 24 }),
        baseText({ id: lid(), name: 'Brand', content: 'APEX CPA', x: 60, y: 130, width: 280, height: 60, fontFamily: 'Montserrat', fontSize: 38, fontWeight: '800', color: '#FFFFFF', textAlign: 'left', textTransform: 'uppercase', letterSpacing: 3 }),
        baseText({ id: lid(), name: 'Sub', content: 'Certified Public Accountants', x: 60, y: 195, width: 310, height: 30, fontFamily: 'Inter', fontSize: 14, fontWeight: '300', color: '#94A3B8', textAlign: 'left' }),
        baseText({ id: lid(), name: 'Tagline', content: 'Tax · Audit · Advisory', y: 302, fontFamily: 'Open Sans', fontSize: 15, fontWeight: '400', color: '#64748B' }),
      ],
    },
  },
  {
    id: 't-finance-wealth-gold',
    name: 'Wealth Gold',
    category: 'Finance',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: gradientBg('#1C1204', '#2D1E00', 160),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'diamond', x: 198, y: 85, width: 104, height: 115, fill: '#D4AF37', shadow: true, shadowColor: '#D4AF3760', shadowX: 0, shadowY: 6, shadowBlur: 20 }),
        baseText({ id: lid(), name: 'Brand', content: 'AURELIUS', y: 250, fontFamily: 'Playfair Display', fontSize: 44, fontWeight: '400', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: 6 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Private Wealth Management', y: 308, fontFamily: 'Raleway', fontSize: 14, fontWeight: '300', color: '#C9A96E', fontStyle: 'italic' }),
      ],
    },
  },

  // ── CREATIVE AGENCY (8 templates) ──
  {
    id: 't-creative-eye-studio',
    name: 'Eye Creative',
    category: 'Creative Agency',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#FFFFFF'),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'eye', x: 163, y: 96, width: 174, height: 115, fill: '#1C1C1C' }),
        baseText({ id: lid(), name: 'Brand', content: 'VISIO', y: 256, fontFamily: 'Montserrat', fontSize: 56, fontWeight: '800', color: '#1C1C1C', textTransform: 'uppercase', letterSpacing: 10 }),
        baseText({ id: lid(), name: 'Sub', content: 'CREATIVE STUDIO', y: 320, fontFamily: 'Raleway', fontSize: 14, fontWeight: '300', color: '#E74C3C', textTransform: 'uppercase', letterSpacing: 6 }),
      ],
    },
  },
  {
    id: 't-creative-gradient-bold',
    name: 'Gradient Bold',
    category: 'Creative Agency',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: gradientBg('#9B59B6', '#E91E63', 135),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'layers', x: 190, y: 85, width: 120, height: 125, fill: '#FFFFFF' }),
        baseText({ id: lid(), name: 'Brand', content: 'STRATA', y: 258, fontFamily: 'Montserrat', fontSize: 52, fontWeight: '800', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 6 }),
        baseText({ id: lid(), name: 'Sub', content: 'Design & Branding Agency', y: 318, fontFamily: 'Poppins', fontSize: 14, fontWeight: '300', color: 'rgba(255,255,255,0.85)' }),
      ],
    },
  },
  {
    id: 't-creative-ink-brush',
    name: 'Ink & Brush',
    category: 'Creative Agency',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#FAFAFA'),
      layers: [
        baseShape({ id: lid(), name: 'Brush Stroke', shapeType: 'rect', x: 50, y: 205, width: 400, height: 18, fill: '#FFD600', cornerRadius: 4, opacity: 0.8 }),
        baseText({ id: lid(), name: 'Brand', content: 'INKCRAFT', x: 50, y: 130, width: 400, height: 85, fontFamily: 'Bebas Neue', fontSize: 88, fontWeight: '400', color: '#111111', textTransform: 'uppercase', letterSpacing: 4 }),
        baseText({ id: lid(), name: 'Sub', content: 'ILLUSTRATION & DESIGN', y: 248, fontFamily: 'Poppins', fontSize: 13, fontWeight: '600', color: '#111111', textTransform: 'uppercase', letterSpacing: 4 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Where ideas become art.', y: 290, fontFamily: 'Lato', fontSize: 15, fontWeight: '300', color: '#6B7280', fontStyle: 'italic' }),
      ],
    },
  },
  {
    id: 't-creative-neon-agency',
    name: 'Neon Agency',
    category: 'Creative Agency',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#0D0D0D'),
      layers: [
        baseShape({ id: lid(), name: 'Accent Rect', shapeType: 'rect', x: 50, y: 270, width: 60, height: 6, fill: '#FF2D55', cornerRadius: 3 }),
        baseText({ id: lid(), name: 'Brand', content: 'PULSE', x: 50, y: 140, width: 400, height: 120, fontFamily: 'Montserrat', fontSize: 100, fontWeight: '900', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 6, shadow: true, shadowColor: '#FF2D5550', shadowX: 0, shadowY: 0, shadowBlur: 20 }),
        baseText({ id: lid(), name: 'Sub', content: 'CREATIVE DIGITAL AGENCY', y: 290, fontFamily: 'Inter', fontSize: 13, fontWeight: '400', color: '#FF2D55', textTransform: 'uppercase', letterSpacing: 4 }),
      ],
    },
  },
  {
    id: 't-creative-motion-purple',
    name: 'Motion Purple',
    category: 'Creative Agency',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: gradientBg('#1A0533', '#0D001A', 180),
      layers: [
        baseShape({ id: lid(), name: 'Circle 1', shapeType: 'circle', x: 155, y: 78, width: 70, height: 70, fill: '#7C3AED', opacity: 0.5 }),
        baseShape({ id: lid(), name: 'Circle 2', shapeType: 'circle', x: 205, y: 100, width: 90, height: 90, fill: '#A855F7', opacity: 0.4 }),
        baseShape({ id: lid(), name: 'Circle 3', shapeType: 'circle', x: 265, y: 78, width: 60, height: 60, fill: '#D946EF', opacity: 0.5 }),
        baseText({ id: lid(), name: 'Brand', content: 'LUMINARY', y: 230, fontFamily: 'Raleway', fontSize: 44, fontWeight: '800', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 5 }),
        baseText({ id: lid(), name: 'Sub', content: 'Video & Motion Studio', y: 286, fontFamily: 'Lato', fontSize: 16, fontWeight: '300', color: '#D8B4FE', fontStyle: 'italic' }),
      ],
    },
  },
  {
    id: 't-creative-typographic',
    name: 'Typographic Bold',
    category: 'Creative Agency',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#F5F0E8'),
      layers: [
        baseShape({ id: lid(), name: 'Block', shapeType: 'rect', x: 50, y: 148, width: 120, height: 120, fill: '#1C1C1C', cornerRadius: 0 }),
        baseText({ id: lid(), name: 'Letter', content: 'A', x: 50, y: 134, width: 120, height: 120, fontFamily: 'Montserrat', fontSize: 110, fontWeight: '900', color: '#F5F0E8', textAlign: 'center' }),
        baseText({ id: lid(), name: 'Brand', content: 'ATLAS DESIGN', x: 185, y: 162, width: 270, height: 55, fontFamily: 'Oswald', fontSize: 34, fontWeight: '700', color: '#1C1C1C', textAlign: 'left', textTransform: 'uppercase', letterSpacing: 2 }),
        baseText({ id: lid(), name: 'Sub', content: 'Brand Strategy & Identity', x: 185, y: 218, width: 270, height: 30, fontFamily: 'Lato', fontSize: 14, fontWeight: '300', color: '#6B7280', textAlign: 'left' }),
      ],
    },
  },
  {
    id: 't-creative-photo-studio',
    name: 'Photo Studio',
    category: 'Creative Agency',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#18181B'),
      layers: [
        baseShape({ id: lid(), name: 'Aperture', shapeType: 'circle', x: 185, y: 85, width: 130, height: 130, fill: 'none', stroke: '#FFFFFF', strokeWidth: 3 }),
        baseShape({ id: lid(), name: 'Inner', shapeType: 'circle', x: 212, y: 112, width: 76, height: 76, fill: '#FFFFFF', opacity: 0.08 }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'camera', x: 205, y: 110, width: 90, height: 78, fill: '#FFFFFF' }),
        baseText({ id: lid(), name: 'Brand', content: 'APERTURE', y: 258, fontFamily: 'Montserrat', fontSize: 38, fontWeight: '800', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 5 }),
        baseText({ id: lid(), name: 'Sub', content: 'Photography & Retouching', y: 308, fontFamily: 'Raleway', fontSize: 14, fontWeight: '300', color: '#A1A1AA', fontStyle: 'italic' }),
      ],
    },
  },
  {
    id: 't-creative-web-agency',
    name: 'Web Agency',
    category: 'Creative Agency',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: gradientBg('#0F172A', '#1E293B', 160),
      layers: [
        baseShape({ id: lid(), name: 'Code Block', shapeType: 'rect', x: 80, y: 95, width: 340, height: 150, fill: '#1E293B', cornerRadius: 12, stroke: '#334155', strokeWidth: 1 }),
        baseText({ id: lid(), name: 'Code', content: '< PIXELCRAFT />', x: 80, y: 138, width: 340, height: 60, fontFamily: 'Roboto', fontSize: 28, fontWeight: '700', color: '#38BDF8', textAlign: 'center', letterSpacing: 1 }),
        baseText({ id: lid(), name: 'Sub', content: 'Web Design & Development', y: 290, fontFamily: 'Inter', fontSize: 16, fontWeight: '300', color: '#94A3B8' }),
        baseText({ id: lid(), name: 'Tagline', content: 'Beautiful products. Flawless code.', y: 334, fontFamily: 'Lato', fontSize: 13, fontWeight: '300', color: '#64748B', fontStyle: 'italic' }),
      ],
    },
  },

  // ── RESTAURANT (7 templates) ──
  {
    id: 't-restaurant-bistro',
    name: 'French Bistro',
    category: 'Restaurant',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#1A0A00'),
      layers: [
        baseShape({ id: lid(), name: 'Oval', shapeType: 'ellipse', x: 162, y: 78, width: 176, height: 176, fill: '#8B1A00', shadow: true, shadowColor: '#8B1A0040', shadowX: 0, shadowY: 8, shadowBlur: 20 }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'chef-hat', x: 200, y: 105, width: 100, height: 100, fill: '#F5CBA7' }),
        baseText({ id: lid(), name: 'Brand', content: 'LE MOULIN', y: 296, fontFamily: 'Playfair Display', fontSize: 36, fontWeight: '700', color: '#F5CBA7', letterSpacing: 3 }),
        baseText({ id: lid(), name: 'Sub', content: 'RESTAURANT & BRASSERIE', y: 344, fontFamily: 'Raleway', fontSize: 11, fontWeight: '300', color: '#C0855A', textTransform: 'uppercase', letterSpacing: 5 }),
      ],
    },
  },
  {
    id: 't-restaurant-taco-vibrant',
    name: 'Taco Vibrant',
    category: 'Restaurant',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: gradientBg('#F97316', '#DC2626', 140),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'taco', x: 185, y: 75, width: 130, height: 130, fill: '#FFFFFF', shadow: true, shadowColor: '#00000040', shadowX: 0, shadowY: 6, shadowBlur: 12 }),
        baseText({ id: lid(), name: 'Brand', content: 'LOCO TACOS', y: 250, fontFamily: 'Pacifico', fontSize: 42, fontWeight: '400', color: '#FFFFFF' }),
        baseText({ id: lid(), name: 'Sub', content: 'AUTHENTIC MEXICAN STREET FOOD', y: 316, fontFamily: 'Montserrat', fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', letterSpacing: 3 }),
      ],
    },
  },
  {
    id: 't-restaurant-steakhouse',
    name: 'Steakhouse',
    category: 'Restaurant',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#0A0A0A'),
      layers: [
        baseShape({ id: lid(), name: 'Diamond', shapeType: 'diamond', x: 185, y: 80, width: 130, height: 130, fill: '#8B0000', shadow: true, shadowColor: '#8B000060', shadowX: 0, shadowY: 8, shadowBlur: 20 }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'steak', x: 210, y: 108, width: 80, height: 80, fill: '#FFFFFF' }),
        baseText({ id: lid(), name: 'Brand', content: 'PRIME CUT', y: 256, fontFamily: 'Oswald', fontSize: 50, fontWeight: '700', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 4 }),
        baseText({ id: lid(), name: 'Sub', content: 'PREMIUM STEAKHOUSE', y: 318, fontFamily: 'Raleway', fontSize: 13, fontWeight: '300', color: '#DC2626', textTransform: 'uppercase', letterSpacing: 5 }),
      ],
    },
  },
  {
    id: 't-restaurant-ramen-japan',
    name: 'Ramen Japanese',
    category: 'Restaurant',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#FFF8F0'),
      layers: [
        baseShape({ id: lid(), name: 'Circle', shapeType: 'circle', x: 180, y: 82, width: 140, height: 140, fill: '#E11D48', shadow: false }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'bowl', x: 210, y: 110, width: 80, height: 80, fill: '#FFFFFF' }),
        baseText({ id: lid(), name: 'Brand', content: 'TONKOTSU', y: 265, fontFamily: 'Oswald', fontSize: 44, fontWeight: '700', color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: 4 }),
        baseText({ id: lid(), name: 'Sub', content: 'Japanese Ramen House', y: 318, fontFamily: 'Lato', fontSize: 16, fontWeight: '300', color: '#E11D48', fontStyle: 'italic' }),
      ],
    },
  },
  {
    id: 't-restaurant-bakery',
    name: 'Artisan Bakery',
    category: 'Restaurant',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: gradientBg('#FEF9C3', '#FDE68A', 180),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'bread', x: 185, y: 80, width: 130, height: 125, fill: '#92400E' }),
        baseText({ id: lid(), name: 'Brand', content: 'Golden Crust', y: 248, fontFamily: 'Dancing Script', fontSize: 52, fontWeight: '700', color: '#78350F' }),
        baseText({ id: lid(), name: 'Sub', content: 'ARTISAN BAKERY & PATISSERIE', y: 316, fontFamily: 'Raleway', fontSize: 11, fontWeight: '500', color: '#92400E', textTransform: 'uppercase', letterSpacing: 3 }),
      ],
    },
  },
  {
    id: 't-restaurant-indian',
    name: 'Indian Spice',
    category: 'Restaurant',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#1A0500'),
      layers: [
        baseShape({ id: lid(), name: 'Mandala', shapeType: 'circle', x: 168, y: 75, width: 164, height: 164, fill: '#D97706', opacity: 0.15 }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'spices', x: 185, y: 90, width: 130, height: 120, fill: '#F59E0B' }),
        baseText({ id: lid(), name: 'Brand', content: 'MAHARAJA', y: 256, fontFamily: 'Playfair Display', fontSize: 40, fontWeight: '700', color: '#F59E0B', textTransform: 'uppercase', letterSpacing: 4 }),
        baseText({ id: lid(), name: 'Sub', content: 'Authentic Indian Cuisine', y: 308, fontFamily: 'Lato', fontSize: 15, fontWeight: '300', color: '#FDE68A', fontStyle: 'italic' }),
      ],
    },
  },
  {
    id: 't-restaurant-vegan',
    name: 'Vegan Cafe',
    category: 'Restaurant',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#F0FDF4'),
      layers: [
        baseShape({ id: lid(), name: 'Leaf BG', shapeType: 'circle', x: 182, y: 85, width: 136, height: 136, fill: '#16A34A', shadow: true, shadowColor: '#16A34A30', shadowX: 0, shadowY: 6, shadowBlur: 16 }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'salad', x: 210, y: 112, width: 80, height: 80, fill: '#FFFFFF' }),
        baseText({ id: lid(), name: 'Brand', content: 'GREEN TABLE', y: 264, fontFamily: 'Poppins', fontSize: 30, fontWeight: '700', color: '#14532D', textTransform: 'uppercase', letterSpacing: 3 }),
        baseText({ id: lid(), name: 'Sub', content: '100% Plant-Based · Organic', y: 308, fontFamily: 'Open Sans', fontSize: 14, fontWeight: '400', color: '#16A34A' }),
      ],
    },
  },

  // ── TRAVEL (7 templates) ──
  {
    id: 't-travel-globe-adventure',
    name: 'Globe Adventure',
    category: 'Travel',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: gradientBg('#0369A1', '#0C4A6E', 160),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'globe', x: 180, y: 82, width: 140, height: 140, fill: '#FFFFFF', shadow: true, shadowColor: '#FFFFFF30', shadowX: 0, shadowY: 6, shadowBlur: 16 }),
        baseText({ id: lid(), name: 'Brand', content: 'WANDERLUST', y: 268, fontFamily: 'Montserrat', fontSize: 34, fontWeight: '800', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 3 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Explore. Dream. Discover.', y: 316, fontFamily: 'Lato', fontSize: 16, fontWeight: '300', color: '#BAE6FD', fontStyle: 'italic' }),
      ],
    },
  },
  {
    id: 't-travel-mountain-trek',
    name: 'Mountain Trek',
    category: 'Travel',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: gradientBg('#1E3A5F', '#0F2027', 160),
      layers: [
        baseShape({ id: lid(), name: 'Mountain', shapeType: 'triangle', x: 165, y: 78, width: 170, height: 155, fill: '#FFFFFF', opacity: 0.9 }),
        baseShape({ id: lid(), name: 'Snow', shapeType: 'triangle', x: 203, y: 78, width: 94, height: 72, fill: '#E0F2FE' }),
        baseText({ id: lid(), name: 'Brand', content: 'SUMMIT', y: 270, fontFamily: 'Oswald', fontSize: 56, fontWeight: '700', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 8 }),
        baseText({ id: lid(), name: 'Sub', content: 'ADVENTURE TRAVEL COMPANY', y: 334, fontFamily: 'Inter', fontSize: 11, fontWeight: '400', color: '#7DD3FC', textTransform: 'uppercase', letterSpacing: 4 }),
      ],
    },
  },
  {
    id: 't-travel-beach-resort',
    name: 'Beach Resort',
    category: 'Travel',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: gradientBg('#06B6D4', '#0284C7', 170),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'palm-tree', x: 185, y: 78, width: 130, height: 145, fill: '#FFFFFF', shadow: true, shadowColor: '#FFFFFF30', shadowX: 0, shadowY: 6, shadowBlur: 14 }),
        baseText({ id: lid(), name: 'Brand', content: 'PARADISE', y: 264, fontFamily: 'Pacifico', fontSize: 46, fontWeight: '400', color: '#FFFFFF' }),
        baseText({ id: lid(), name: 'Sub', content: 'TROPICAL RESORTS & VILLAS', y: 326, fontFamily: 'Montserrat', fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', letterSpacing: 3 }),
      ],
    },
  },
  {
    id: 't-travel-airline',
    name: 'Airline',
    category: 'Travel',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#FFFFFF'),
      layers: [
        baseShape({ id: lid(), name: 'Tail', shapeType: 'rect', x: 60, y: 165, width: 380, height: 70, fill: '#1E40AF', cornerRadius: 6, shadow: true, shadowColor: '#1E40AF20', shadowX: 0, shadowY: 6, shadowBlur: 14 }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'airplane', x: 68, y: 175, width: 68, height: 50, fill: '#FFFFFF' }),
        baseText({ id: lid(), name: 'Brand', content: 'SKYLINE AIR', x: 145, y: 178, width: 280, height: 50, fontFamily: 'Poppins', fontSize: 30, fontWeight: '700', color: '#FFFFFF', textAlign: 'left', textTransform: 'uppercase', letterSpacing: 2 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Fly Farther. Arrive Better.', y: 278, fontFamily: 'Open Sans', fontSize: 15, fontWeight: '300', color: '#1E40AF', fontStyle: 'italic' }),
      ],
    },
  },
  {
    id: 't-travel-camping',
    name: 'Camping Outdoors',
    category: 'Travel',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#1A2E05'),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'tent', x: 175, y: 85, width: 150, height: 130, fill: '#84CC16', shadow: true, shadowColor: '#84CC1640', shadowX: 0, shadowY: 6, shadowBlur: 16 }),
        baseText({ id: lid(), name: 'Brand', content: 'TRAILHEAD', y: 258, fontFamily: 'Oswald', fontSize: 46, fontWeight: '700', color: '#ECFCCB', textTransform: 'uppercase', letterSpacing: 4 }),
        baseText({ id: lid(), name: 'Sub', content: 'Outdoor Adventures & Camping', y: 316, fontFamily: 'Lato', fontSize: 14, fontWeight: '300', color: '#84CC16', fontStyle: 'italic' }),
      ],
    },
  },
  {
    id: 't-travel-cruise',
    name: 'Cruise Line',
    category: 'Travel',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: gradientBg('#0C2340', '#1A3A5C', 160),
      layers: [
        baseIcon({ id: lid(), name: 'Icon', iconId: 'ship', x: 165, y: 82, width: 170, height: 130, fill: '#FFFFFF', shadow: false }),
        baseShape({ id: lid(), name: 'Wave', shapeType: 'rect', x: 50, y: 226, width: 400, height: 8, fill: '#38BDF8', cornerRadius: 4, opacity: 0.5 }),
        baseText({ id: lid(), name: 'Brand', content: 'AZURA CRUISES', y: 272, fontFamily: 'Raleway', fontSize: 32, fontWeight: '700', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 3 }),
        baseText({ id: lid(), name: 'Sub', content: 'Luxury Cruises Worldwide', y: 318, fontFamily: 'Lato', fontSize: 15, fontWeight: '300', color: '#BAE6FD', fontStyle: 'italic' }),
      ],
    },
  },
  {
    id: 't-travel-hostel-backpacker',
    name: 'Backpacker Hostel',
    category: 'Travel',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#FFFBEB'),
      layers: [
        baseShape({ id: lid(), name: 'Bag', shapeType: 'rect', x: 185, y: 78, width: 130, height: 148, fill: '#D97706', cornerRadius: 12, shadow: true, shadowColor: '#D9770630', shadowX: 0, shadowY: 8, shadowBlur: 16 }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'backpack', x: 210, y: 100, width: 80, height: 110, fill: '#FFFFFF' }),
        baseText({ id: lid(), name: 'Brand', content: 'ROAM FREE', y: 272, fontFamily: 'Poppins', fontSize: 36, fontWeight: '800', color: '#78350F', textTransform: 'uppercase', letterSpacing: 3 }),
        baseText({ id: lid(), name: 'Sub', content: 'Budget Travel & Hostels', y: 320, fontFamily: 'Open Sans', fontSize: 15, fontWeight: '400', color: '#D97706' }),
      ],
    },
  },

  // ── GENERAL (8 templates) ──
  {
    id: 't-general-lettermark',
    name: 'Lettermark Bold',
    category: 'General',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#FFFFFF'),
      layers: [
        baseText({ id: lid(), name: 'Initial', content: 'A', x: 130, y: 55, width: 240, height: 220, fontFamily: 'Montserrat', fontSize: 200, fontWeight: '900', color: '#1A73E8', textAlign: 'center', textTransform: 'uppercase' }),
        baseText({ id: lid(), name: 'Brand', content: 'APEX BRAND', y: 308, fontFamily: 'Montserrat', fontSize: 28, fontWeight: '300', color: '#1C1C1C', textTransform: 'uppercase', letterSpacing: 6 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Your tagline here', y: 356, fontFamily: 'Poppins', fontSize: 14, fontWeight: '300', color: '#9CA3AF', fontStyle: 'italic' }),
      ],
    },
  },
  {
    id: 't-general-wordmark-clean',
    name: 'Wordmark Clean',
    category: 'General',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#FFFFFF'),
      layers: [
        baseText({ id: lid(), name: 'Brand', content: 'brandname', y: 183, fontFamily: 'Poppins', fontSize: 56, fontWeight: '700', color: '#1C1C1C' }),
        baseShape({ id: lid(), name: 'Line', shapeType: 'rect', x: 150, y: 258, width: 200, height: 3, fill: '#E74C3C', cornerRadius: 2 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Your Business Tagline', y: 282, fontFamily: 'Poppins', fontSize: 16, fontWeight: '300', color: '#6B7280' }),
      ],
    },
  },
  {
    id: 't-general-badge-vintage',
    name: 'Vintage Badge',
    category: 'General',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#F8F0E0'),
      layers: [
        baseShape({ id: lid(), name: 'Outer', shapeType: 'circle', x: 152, y: 72, width: 196, height: 196, fill: 'none', stroke: '#3D2B1F', strokeWidth: 4 }),
        baseShape({ id: lid(), name: 'Inner', shapeType: 'circle', x: 168, y: 88, width: 164, height: 164, fill: '#3D2B1F', shadow: false }),
        baseText({ id: lid(), name: 'Brand', content: 'HERITAGE', x: 50, y: 134, width: 400, height: 55, fontFamily: 'Oswald', fontSize: 38, fontWeight: '700', color: '#F8E4A0', textTransform: 'uppercase', letterSpacing: 4 }),
        baseText({ id: lid(), name: 'Est', content: '— EST. 1975 —', x: 50, y: 190, width: 400, height: 28, fontFamily: 'Raleway', fontSize: 12, fontWeight: '400', color: '#C9A84C', textTransform: 'uppercase', letterSpacing: 5 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Timeless Quality', y: 316, fontFamily: 'Playfair Display', fontSize: 22, fontWeight: '400', color: '#3D2B1F', fontStyle: 'italic' }),
      ],
    },
  },
  {
    id: 't-general-dark-gradient',
    name: 'Dark Gradient',
    category: 'General',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: gradientBg('#1A1A2E', '#16213E', 160),
      layers: [
        baseShape({ id: lid(), name: 'Glow 1', shapeType: 'circle', x: 80, y: 80, width: 120, height: 120, fill: '#7B2FBE', opacity: 0.25 }),
        baseShape({ id: lid(), name: 'Glow 2', shapeType: 'circle', x: 300, y: 130, width: 100, height: 100, fill: '#1A73E8', opacity: 0.25 }),
        baseText({ id: lid(), name: 'Brand', content: 'NEXUS', y: 168, fontFamily: 'Montserrat', fontSize: 72, fontWeight: '900', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 8 }),
        baseShape({ id: lid(), name: 'Underline', shapeType: 'rect', x: 150, y: 258, width: 200, height: 3, fillType: 'gradient', gradientColor1: '#7B2FBE', gradientColor2: '#1A73E8', gradientAngle: 90, fill: '#7B2FBE' }),
        baseText({ id: lid(), name: 'Tagline', content: 'Built for the bold.', y: 282, fontFamily: 'Inter', fontSize: 18, fontWeight: '300', color: '#94A3B8', fontStyle: 'italic' }),
      ],
    },
  },
  {
    id: 't-general-monogram-elegant',
    name: 'Monogram Elegant',
    category: 'General',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#0A0A0A'),
      layers: [
        baseShape({ id: lid(), name: 'Circle', shapeType: 'circle', x: 170, y: 80, width: 160, height: 160, fill: 'none', stroke: '#C9A84C', strokeWidth: 2 }),
        baseText({ id: lid(), name: 'Initials', content: 'JB', x: 130, y: 94, width: 240, height: 130, fontFamily: 'Playfair Display', fontSize: 90, fontWeight: '400', color: '#C9A84C', textAlign: 'center' }),
        baseText({ id: lid(), name: 'Brand', content: 'JAMES BLANC', y: 284, fontFamily: 'Raleway', fontSize: 22, fontWeight: '300', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 7 }),
        baseText({ id: lid(), name: 'Sub', content: 'PERSONAL BRAND', y: 326, fontFamily: 'Inter', fontSize: 11, fontWeight: '400', color: '#C9A84C', textTransform: 'uppercase', letterSpacing: 5 }),
      ],
    },
  },
  {
    id: 't-general-startup-bold',
    name: 'Startup Bold',
    category: 'General',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#FFFFFF'),
      layers: [
        baseShape({ id: lid(), name: 'Block', shapeType: 'rect', x: 50, y: 140, width: 400, height: 95, fill: '#111827', cornerRadius: 0 }),
        baseText({ id: lid(), name: 'Brand', content: 'MOMENTUM', x: 50, y: 152, width: 400, height: 80, fontFamily: 'Oswald', fontSize: 52, fontWeight: '700', color: '#FFFFFF', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 4 }),
        baseText({ id: lid(), name: 'Sub', content: 'Moving Forward. Every Day.', y: 280, fontFamily: 'Poppins', fontSize: 16, fontWeight: '300', color: '#374151', fontStyle: 'italic' }),
      ],
    },
  },
  {
    id: 't-general-ngo-circle',
    name: 'NGO & Nonprofit',
    category: 'General',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#F8FAFC'),
      layers: [
        baseShape({ id: lid(), name: 'Circle BG', shapeType: 'circle', x: 182, y: 85, width: 136, height: 136, fill: '#0891B2', shadow: true, shadowColor: '#0891B230', shadowX: 0, shadowY: 6, shadowBlur: 16 }),
        baseIcon({ id: lid(), name: 'Icon', iconId: 'hands-heart', x: 210, y: 112, width: 80, height: 80, fill: '#FFFFFF' }),
        baseText({ id: lid(), name: 'Brand', content: 'HOPE FOUNDATION', y: 266, fontFamily: 'Poppins', fontSize: 26, fontWeight: '700', color: '#0C4A6E', textTransform: 'uppercase', letterSpacing: 2 }),
        baseText({ id: lid(), name: 'Sub', content: 'Empowering Communities Worldwide', y: 308, fontFamily: 'Open Sans', fontSize: 13, fontWeight: '400', color: '#0891B2' }),
      ],
    },
  },
  {
    id: 't-general-consulting',
    name: 'Consulting Firm',
    category: 'General',
    design: {
      canvasSize: DEFAULT_CANVAS_SIZE,
      background: solidBg('#1E293B'),
      layers: [
        baseShape({ id: lid(), name: 'Left Bar', shapeType: 'rect', x: 70, y: 120, width: 8, height: 160, fill: '#38BDF8', cornerRadius: 4 }),
        baseText({ id: lid(), name: 'Brand', content: 'MERIDIAN', x: 92, y: 133, width: 340, height: 70, fontFamily: 'Raleway', fontSize: 52, fontWeight: '800', color: '#FFFFFF', textAlign: 'left', textTransform: 'uppercase', letterSpacing: 4 }),
        baseText({ id: lid(), name: 'Sub', content: 'CONSULTING GROUP', x: 92, y: 208, width: 340, height: 30, fontFamily: 'Inter', fontSize: 16, fontWeight: '300', color: '#38BDF8', textAlign: 'left', textTransform: 'uppercase', letterSpacing: 5 }),
        baseText({ id: lid(), name: 'Tagline', content: 'Strategy · Growth · Results', y: 326, fontFamily: 'Lato', fontSize: 15, fontWeight: '300', color: '#64748B', fontStyle: 'italic' }),
      ],
    },
  },
];

export const TEMPLATE_CATEGORIES = [...new Set(TEMPLATES.map(t => t.category))];
