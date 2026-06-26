// ─── Event Types ───
export type EventType =
    | "wedding"
    | "engagement"
    | "birthday"
    | "babyshower"
    | "housewarming"
    | "graduation"
    | "corporate"
    | "farewell"
    | "anniversary"
    | "pooja"
    | "reception"
    | "nameceremony";

// ─── Sub-Event (Mehendi, Sangeet, etc.) ───
export interface SubEvent {
    name: string;
    date: string;
    time: string;
    venue: string;
}

// ─── Color Scheme ───
export interface ColorScheme {
    id: string;
    name: string;
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
}

// ─── Font Pair ───
export interface FontPair {
    id: string;
    name: string;
    headingFont: string;
    bodyFont: string;
    headingWeight: string;
    preview: string;
}

// ─── Output Format ───
export interface OutputFormat {
    id: string;
    name: string;
    width: number;
    height: number;
    ratio: string;
    useCase: string;
}

// ─── Quality Option ───
export interface QualityOption {
    id: string;
    label: string;
    scale: number;
    dpi: number;
    description: string;
    fileSize: string;
}

// ─── Template ID ───
export type TemplateId =
    | "royal-gold"
    | "modern-minimal"
    | "floral-pink"
    | "traditional-red"
    | "luxury-black"
    | "garden-green"
    | "midnight-blue"
    | "rustic-brown"
    | "tropical-bright"
    | "pastel-dream"
    | "watercolor-bloom"
    | "geometric-bold"
    | "temple-arch"
    | "cinema-poster"
    | "newspaper-retro"
    | "floral-arch"
    | "majestic-gold"
    | "garden-bloom"
    | "balloon-party"
    | "golden-celebration";

// ─── Decorative Options ───
export interface DecorativeOptions {
    borderFrame: boolean;
    cornerDecorations: boolean;
    dividerLines: boolean;
    backgroundPattern: boolean;
    photoFrame: boolean;
}

// ─── Language ───
export type Language = "english" | "tamil" | "hindi" | "telugu" | "kannada";

// ─── Main Invitation Data ───
export interface InvitationData {
    // Core
    eventType: EventType;
    title: string;

    // People
    hostNames: string;
    groomName?: string;
    brideName?: string;
    honoree?: string;

    // Event Details
    eventName: string;
    date: string;
    time: string;
    venue: string;
    address: string;
    city: string;

    // Optional Extra
    dresscode?: string;
    rsvpPhone?: string;
    rsvpDate?: string;
    subEvent1?: SubEvent;
    subEvent2?: SubEvent;
    subEvent3?: SubEvent;

    // Personal Touch
    quote?: string;
    couplePhotoUrl?: string;
    logoUrl?: string;

    // Styling
    template: TemplateId;
    colorScheme: ColorScheme;
    fontPair: FontPair;
    format: OutputFormat;
    language: Language;
    decorations: DecorativeOptions;
    fontScale: number; // 0.7 to 1.5, default 1.0
}

// ─── Template Component Props ───
export interface TemplateProps {
    data: InvitationData;
}

// ─── Download format ───
export type DownloadFormat = "pdf" | "png" | "jpg" | "jpeg";
