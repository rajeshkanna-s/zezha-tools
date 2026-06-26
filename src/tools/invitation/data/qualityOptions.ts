import type { QualityOption } from '../types';

export const qualityOptions: QualityOption[] = [
    { id: "web", label: "Web (Fast)", scale: 1, dpi: 72, description: "Good for WhatsApp & social media", fileSize: "~200–400 KB" },
    { id: "good", label: "Good", scale: 1.5, dpi: 96, description: "Balanced quality and size", fileSize: "~500 KB–1 MB" },
    { id: "high", label: "High Quality", scale: 2, dpi: 150, description: "Best for digital sharing", fileSize: "~1–2 MB" },
    { id: "print", label: "Print Ready", scale: 3, dpi: 300, description: "Professional print quality", fileSize: "~3–6 MB" },
    { id: "ultra", label: "Ultra HD", scale: 4, dpi: 300, description: "Maximum resolution", fileSize: "~6–12 MB" },
];

export const defaultQuality = qualityOptions[2]; // High Quality
