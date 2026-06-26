export type LayerType = 'text' | 'icon' | 'shape' | 'image';

export interface BaseLayer {
  id: string;
  type: LayerType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  name: string;
  flipX: boolean;
  flipY: boolean;
}

export interface TextLayer extends BaseLayer {
  type: 'text';
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: 'normal' | 'italic';
  textAlign: 'left' | 'center' | 'right';
  color: string;
  letterSpacing: number;
  lineHeight: number;
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  shadow: boolean;
  shadowColor: string;
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
  useGradient: boolean;
  gradientColor1: string;
  gradientColor2: string;
  textDecoration: 'none' | 'underline';
}

export interface IconLayer extends BaseLayer {
  type: 'icon';
  iconId: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
  shadow: boolean;
  shadowColor: string;
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
}

export interface ShapeLayer extends BaseLayer {
  type: 'shape';
  shapeType: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
  strokeDash: boolean;
  cornerRadius: number;
  fillType: 'solid' | 'gradient' | 'none';
  gradientColor1: string;
  gradientColor2: string;
  gradientAngle: number;
  shadow: boolean;
  shadowColor: string;
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
}

export interface ImageLayer extends BaseLayer {
  type: 'image';
  src: string;
  objectFit: 'contain' | 'cover' | 'fill';
  borderRadius: number;
  shadow: boolean;
  shadowColor: string;
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
}

export type AnyLayer = TextLayer | IconLayer | ShapeLayer | ImageLayer;

export interface CanvasBackground {
  type: 'solid' | 'gradient' | 'transparent';
  color: string;
  gradientColor1: string;
  gradientColor2: string;
  gradientAngle: number;
  gradientType: 'linear' | 'radial';
}

export interface CanvasSize {
  id: string;
  label: string;
  width: number;
  height: number;
}

export interface LogoDesign {
  layers: AnyLayer[];
  background: CanvasBackground;
  canvasSize: CanvasSize;
}

export interface Icon {
  id: string;
  name: string;
  category: string;
  keywords: string[];
  svg: string;
  viewBox: string;
}

export interface FontOption {
  name: string;
  importName: string;
  category: 'modern-sans' | 'bold' | 'serif' | 'script' | 'mono';
  categoryLabel: string;
  bestFor: string;
}

export interface ColorSwatch {
  hex: string;
  name: string;
}

export interface GradientPreset {
  name: string;
  color1: string;
  color2: string;
  angle: number;
  type: 'linear' | 'radial';
}

export interface Template {
  id: string;
  name: string;
  category: string;
  design: LogoDesign;
}

export type DownloadFormat = 'png' | 'jpg' | 'svg' | 'pdf';

export type LeftTab = 'templates' | 'icons' | 'text' | 'shapes' | 'colors' | 'upload' | 'tools';
