import React from 'react';
import type { TemplateId, TemplateProps } from '../types';
import { RoyalGold } from './RoyalGold';
import { ModernMinimal } from './ModernMinimal';
import { FloralPink } from './FloralPink';
import { TraditionalRed } from './TraditionalRed';
import { LuxuryBlack } from './LuxuryBlack';
import { FloralArch } from './FloralArch';
import { MajesticGold } from './MajesticGold';
import { GardenBloom } from './GardenBloom';
import { BalloonParty } from './BalloonParty';
import { GoldenCelebration } from './GoldenCelebration';

export interface TemplateEntry {
    id: TemplateId;
    name: string;
    description: string;
    component: React.FC<TemplateProps>;
    previewColors: { bg: string; accent: string };
}

export const templateRegistry: TemplateEntry[] = [
    { id: "royal-gold", name: "Royal Gold", description: "Dark maroon + gold, ornate borders", component: RoyalGold, previewColors: { bg: "#1A0000", accent: "#FFD700" } },
    { id: "modern-minimal", name: "Modern Minimal", description: "White + black, clean typography", component: ModernMinimal, previewColors: { bg: "#FFFFFF", accent: "#000000" } },
    { id: "floral-pink", name: "Floral Pink", description: "Soft pink + rose gold, flowers", component: FloralPink, previewColors: { bg: "#FFF5F5", accent: "#B76E79" } },
    { id: "traditional-red", name: "Traditional Red", description: "Deep red + gold, Indian classical", component: TraditionalRed, previewColors: { bg: "#8B0000", accent: "#FFD700" } },
    { id: "luxury-black", name: "Luxury Black", description: "All black + gold foil effect", component: LuxuryBlack, previewColors: { bg: "#0a0a0a", accent: "#FFD700" } },
    { id: "floral-arch", name: "Floral Arch", description: "Indian floral arch, marigolds + gold", component: FloralArch, previewColors: { bg: "#FDF6E3", accent: "#D4A017" } },
    { id: "majestic-gold", name: "Majestic Gold", description: "Ornate gold arch, temple motifs", component: MajesticGold, previewColors: { bg: "#FAF0D7", accent: "#D4A017" } },
    { id: "garden-bloom", name: "Garden Bloom", description: "Watercolor botanical, leaves + flowers", component: GardenBloom, previewColors: { bg: "#FEFDF8", accent: "#6B8E6B" } },
    { id: "balloon-party", name: "Balloon Party 🎈", description: "Pastel birthday, balloons + confetti", component: BalloonParty, previewColors: { bg: "#FFF0F5", accent: "#EC4899" } },
    { id: "golden-celebration", name: "Golden Night 🌟", description: "Dark + gold balloons, sparkles", component: GoldenCelebration, previewColors: { bg: "#0F0F0F", accent: "#FBBF24" } },
];

export function getTemplateComponent(id: TemplateId): React.FC<TemplateProps> {
    const entry = templateRegistry.find(t => t.id === id);
    return entry?.component || RoyalGold;
}
