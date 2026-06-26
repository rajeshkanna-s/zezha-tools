import type { ColorScheme } from '../types';

export const colorSchemes: ColorScheme[] = [
    { id: "royal-gold", name: "Royal Gold", primary: "#8B0000", secondary: "#FFD700", accent: "#FFF8DC", background: "#1A0000", text: "#FFD700" },
    { id: "rose-gold", name: "Rose Gold", primary: "#B76E79", secondary: "#F4C2C2", accent: "#FFF0F0", background: "#FFF5F5", text: "#4A2030" },
    { id: "midnight", name: "Midnight Blue", primary: "#0D1B4B", secondary: "#C0C0C0", accent: "#E8E8FF", background: "#060D2E", text: "#FFFFFF" },
    { id: "forest", name: "Forest Green", primary: "#2D5016", secondary: "#8FBC8F", accent: "#F0FFF0", background: "#F5FFF0", text: "#1A3009" },
    { id: "sunset", name: "Sunset Orange", primary: "#D4521A", secondary: "#FFB347", accent: "#FFF3E0", background: "#FFF8F0", text: "#3D1500" },
    { id: "ocean", name: "Ocean Blue", primary: "#006994", secondary: "#48CAE4", accent: "#E0F4FF", background: "#F0FAFF", text: "#003347" },
    { id: "lavender", name: "Lavender Dream", primary: "#7B2D8B", secondary: "#DDA0DD", accent: "#F5E6FF", background: "#FDF0FF", text: "#3D0050" },
    { id: "cherry-blossom", name: "Cherry Blossom", primary: "#DE3163", secondary: "#FFB7C5", accent: "#FFF0F3", background: "#FFF5F7", text: "#5C001A" },
    { id: "earth", name: "Earthy Rustic", primary: "#8B4513", secondary: "#D2B48C", accent: "#FFF8F0", background: "#FAF0E6", text: "#3E1700" },
    { id: "monochrome", name: "Classic Black", primary: "#000000", secondary: "#555555", accent: "#F0F0F0", background: "#FFFFFF", text: "#000000" },
];

export const defaultColorScheme = colorSchemes[0];
