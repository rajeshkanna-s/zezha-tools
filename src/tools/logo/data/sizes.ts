import type { CanvasSize } from '../types';

export const CANVAS_SIZES: CanvasSize[] = [
  { id: 'square', label: 'Square (500×500)', width: 500, height: 500 },
  { id: 'wide', label: 'Wide (800×400)', width: 800, height: 400 },
  { id: 'portrait', label: 'Portrait (400×600)', width: 400, height: 600 },
  { id: 'business-card', label: 'Business Card (350×200)', width: 350, height: 200 },
  { id: 'favicon', label: 'Favicon (64×64)', width: 64, height: 64 },
];

export const DEFAULT_CANVAS_SIZE = CANVAS_SIZES[0];
