import React from 'react';
import type { EventTemplateId, EventTemplateProps } from '../types';
import { NeonDark } from './NeonDark';
import { CorporatePro } from './CorporatePro';
import { Glassmorphism } from './Glassmorphism';

export interface EventTemplateEntry {
    id: EventTemplateId;
    name: string;
    description: string;
    component: React.FC<EventTemplateProps>;
    previewGradient: string;
}

export const eventTemplateRegistry: EventTemplateEntry[] = [
    { id: "neon-dark", name: "Neon Dark", description: "Dark background with vibrant neon accents", component: NeonDark, previewGradient: "linear-gradient(135deg, #0a0a0f, #6366f1)" },
    { id: "corporate-pro", name: "Corporate Pro", description: "Clean white/grey, professional business look", component: CorporatePro, previewGradient: "linear-gradient(135deg, #6366f1, #8b5cf6)" },
    { id: "glassmorphism", name: "Glassmorphism", description: "Frosted glass panels with gradient background", component: Glassmorphism, previewGradient: "linear-gradient(135deg, #6366f1aa, #8b5cf6aa)" },
    { id: "vibrant-gradient", name: "Vibrant Gradient", description: "Bold colorful gradients, energetic feel", component: NeonDark, previewGradient: "linear-gradient(135deg, #f59e0b, #ef4444, #8b5cf6)" },
    { id: "minimal-light", name: "Minimal Light", description: "Ultra clean, whitespace focused", component: CorporatePro, previewGradient: "linear-gradient(135deg, #f8fafc, #e2e8f0)" },
    { id: "retro-bold", name: "Retro Bold", description: "Bold typography, vintage color palette", component: NeonDark, previewGradient: "linear-gradient(135deg, #b91c1c, #fbbf24)" },
    { id: "nature-green", name: "Nature Green", description: "Earth tones, organic shapes", component: CorporatePro, previewGradient: "linear-gradient(135deg, #166534, #86efac)" },
    { id: "luxury-gold", name: "Luxury Gold", description: "Black + gold accents, premium feel", component: Glassmorphism, previewGradient: "linear-gradient(135deg, #0a0a0a, #fbbf24)" },
    { id: "tech-blue", name: "Tech Blue", description: "Blue gradients, futuristic grid patterns", component: NeonDark, previewGradient: "linear-gradient(135deg, #0c4a6e, #38bdf8)" },
    { id: "creative-splash", name: "Creative Splash", description: "Playful colors, dynamic art-inspired layout", component: Glassmorphism, previewGradient: "linear-gradient(135deg, #ec4899, #f59e0b, #10b981)" },
];

export function getEventTemplateComponent(id: EventTemplateId): React.FC<EventTemplateProps> {
    const entry = eventTemplateRegistry.find(t => t.id === id);
    return entry?.component || NeonDark;
}
