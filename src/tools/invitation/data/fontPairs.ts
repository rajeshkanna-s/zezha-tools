import type { FontPair } from '../types';

export const fontPairs: FontPair[] = [
    { id: "classic-elegant", name: "Classic Elegant", headingFont: "'Playfair Display', serif", bodyFont: "'Lato', sans-serif", headingWeight: "700", preview: "You're Invited" },
    { id: "modern-clean", name: "Modern Clean", headingFont: "'Cormorant Garamond', serif", bodyFont: "'Montserrat', sans-serif", headingWeight: "600", preview: "You're Invited" },
    { id: "romantic-script", name: "Romantic Script", headingFont: "'Great Vibes', cursive", bodyFont: "'Raleway', sans-serif", headingWeight: "400", preview: "You're Invited" },
    { id: "traditional", name: "Traditional", headingFont: "'IM Fell English', serif", bodyFont: "'Crimson Text', serif", headingWeight: "400", preview: "You're Invited" },
    { id: "bold-modern", name: "Bold Modern", headingFont: "'Bebas Neue', sans-serif", bodyFont: "'Open Sans', sans-serif", headingWeight: "400", preview: "You're Invited" },
    { id: "handwritten", name: "Handwritten", headingFont: "'Dancing Script', cursive", bodyFont: "'Nunito', sans-serif", headingWeight: "700", preview: "You're Invited" },
    { id: "luxury-serif", name: "Luxury Serif", headingFont: "'Libre Baskerville', serif", bodyFont: "'Source Sans Pro', sans-serif", headingWeight: "700", preview: "You're Invited" },
    { id: "south-indian", name: "South Indian", headingFont: "'Yatra One', cursive", bodyFont: "'Hind', sans-serif", headingWeight: "400", preview: "You're Invited" },
];

export const defaultFontPair = fontPairs[0];

/** All Google Font families used — for dynamic loading */
export const allGoogleFonts = [
    "Playfair+Display:wght@400;700",
    "Lato:wght@300;400;700",
    "Cormorant+Garamond:wght@400;600;700",
    "Montserrat:wght@300;400;600",
    "Great+Vibes",
    "Raleway:wght@300;400;600",
    "IM+Fell+English",
    "Crimson+Text:wght@400;600",
    "Bebas+Neue",
    "Open+Sans:wght@300;400;600",
    "Dancing+Script:wght@400;700",
    "Nunito:wght@300;400;700",
    "Libre+Baskerville:wght@400;700",
    "Source+Sans+Pro:wght@300;400;600",
    "Yatra+One",
    "Hind:wght@300;400;500",
];

export function loadGoogleFonts() {
    const id = "invitation-google-fonts";
    if (document.getElementById(id)) return;
    const families = allGoogleFonts.join("&family=");
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
    document.head.appendChild(link);
}
