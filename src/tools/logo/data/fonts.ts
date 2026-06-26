import type { FontOption } from '../types';

export const FONTS: FontOption[] = [
  // Modern Sans-Serif
  { name: 'Inter', importName: 'Inter', category: 'modern-sans', categoryLabel: 'Modern Sans', bestFor: 'Tech, SaaS, Startup' },
  { name: 'Poppins', importName: 'Poppins:wght@300;400;600;700;800', category: 'modern-sans', categoryLabel: 'Modern Sans', bestFor: 'Any business, startup' },
  { name: 'Montserrat', importName: 'Montserrat:wght@300;400;600;700;800', category: 'modern-sans', categoryLabel: 'Modern Sans', bestFor: 'Fashion, Premium brands' },
  { name: 'Raleway', importName: 'Raleway:wght@300;400;600;700;800', category: 'modern-sans', categoryLabel: 'Modern Sans', bestFor: 'Design studios, Fashion' },
  { name: 'Nunito', importName: 'Nunito:wght@300;400;600;700;800', category: 'modern-sans', categoryLabel: 'Modern Sans', bestFor: 'Education, Kids, Wellness' },
  { name: 'Outfit', importName: 'Outfit:wght@300;400;600;700;800', category: 'modern-sans', categoryLabel: 'Modern Sans', bestFor: 'Modern brands, Tech' },
  // Bold & Strong
  { name: 'Bebas Neue', importName: 'Bebas+Neue', category: 'bold', categoryLabel: 'Bold & Strong', bestFor: 'Gym, Sports, Construction' },
  { name: 'Oswald', importName: 'Oswald:wght@400;500;600;700', category: 'bold', categoryLabel: 'Bold & Strong', bestFor: 'Industrial, Automotive' },
  { name: 'Barlow Condensed', importName: 'Barlow+Condensed:wght@400;600;700;800', category: 'bold', categoryLabel: 'Bold & Strong', bestFor: 'Sports, Events, Bold brands' },
  { name: 'Anton', importName: 'Anton', category: 'bold', categoryLabel: 'Bold & Strong', bestFor: 'Posters, Bold statements' },
  { name: 'Exo 2', importName: 'Exo+2:wght@400;600;700;800', category: 'bold', categoryLabel: 'Bold & Strong', bestFor: 'Tech, Gaming, Futuristic' },
  // Serif
  { name: 'Playfair Display', importName: 'Playfair+Display:wght@400;600;700', category: 'serif', categoryLabel: 'Elegant Serif', bestFor: 'Restaurant, Law, Finance' },
  { name: 'Cormorant Garamond', importName: 'Cormorant+Garamond:wght@300;400;600', category: 'serif', categoryLabel: 'Elegant Serif', bestFor: 'Luxury brands, Fine dining' },
  { name: 'Libre Baskerville', importName: 'Libre+Baskerville:wght@400;700', category: 'serif', categoryLabel: 'Elegant Serif', bestFor: 'Law, Consulting, Academia' },
  { name: 'Lora', importName: 'Lora:wght@400;600;700', category: 'serif', categoryLabel: 'Elegant Serif', bestFor: 'Publishing, Wellness, Blog' },
  { name: 'Crimson Text', importName: 'Crimson+Text:wght@400;600', category: 'serif', categoryLabel: 'Elegant Serif', bestFor: 'Publishing, Fine dining' },
  // Script
  { name: 'Great Vibes', importName: 'Great+Vibes', category: 'script', categoryLabel: 'Script & Handwritten', bestFor: 'Beauty, Wedding, Floral' },
  { name: 'Dancing Script', importName: 'Dancing+Script:wght@400;600;700', category: 'script', categoryLabel: 'Script & Handwritten', bestFor: 'Bakery, Cafe, Kids brands' },
  { name: 'Pacifico', importName: 'Pacifico', category: 'script', categoryLabel: 'Script & Handwritten', bestFor: 'Beach, Food, Fun brands' },
  { name: 'Satisfy', importName: 'Satisfy', category: 'script', categoryLabel: 'Script & Handwritten', bestFor: 'Photography, Boutique' },
  { name: 'Sacramento', importName: 'Sacramento', category: 'script', categoryLabel: 'Script & Handwritten', bestFor: 'High-end beauty, Luxury' },
  { name: 'Kaushan Script', importName: 'Kaushan+Script', category: 'script', categoryLabel: 'Script & Handwritten', bestFor: 'Creative studio, Events' },
  // Monospace
  { name: 'Fira Code', importName: 'Fira+Code:wght@400;600;700', category: 'mono', categoryLabel: 'Monospace & Technical', bestFor: 'Tech, Developer tools, SaaS' },
  { name: 'Space Mono', importName: 'Space+Mono:wght@400;700', category: 'mono', categoryLabel: 'Monospace & Technical', bestFor: 'Tech brands, Retro style' },
  { name: 'Roboto Mono', importName: 'Roboto+Mono:wght@400;600;700', category: 'mono', categoryLabel: 'Monospace & Technical', bestFor: 'Technical, Data, Engineering' },
  { name: 'Orbitron', importName: 'Orbitron:wght@400;600;700;800', category: 'mono', categoryLabel: 'Monospace & Technical', bestFor: 'Gaming, Sci-fi, Innovation' },
];

export const FONT_CATEGORIES = [
  { id: 'modern-sans', label: 'Modern Sans' },
  { id: 'bold', label: 'Bold & Strong' },
  { id: 'serif', label: 'Elegant Serif' },
  { id: 'script', label: 'Script' },
  { id: 'mono', label: 'Monospace' },
] as const;

export const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?' +
  FONTS.map(f => `family=${f.importName}`).join('&') +
  '&display=swap';
