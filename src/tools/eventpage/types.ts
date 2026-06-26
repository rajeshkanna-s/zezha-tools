// ─── Event Types ───
export type EventPageType =
    | "conference"
    | "wedding"
    | "product-launch"
    | "workshop"
    | "meetup"
    | "festival"
    | "charity"
    | "webinar"
    | "exhibition"
    | "birthday"
    | "corporate"
    | "graduation";

// ─── Speaker ───
export interface Speaker {
    name: string;
    role: string;
    company: string;
    bio: string;
    photoUrl: string;
}

// ─── Agenda Item ───
export interface AgendaItem {
    time: string;
    title: string;
    description: string;
    speaker?: string;
}

// ─── Ticket Tier ───
export interface TicketTier {
    name: string;
    price: string;
    features: string[];
    highlighted: boolean;
}

// ─── Sponsor ───
export interface Sponsor {
    name: string;
    tier: "platinum" | "gold" | "silver" | "bronze";
    logoUrl: string;
    website: string;
}

// ─── FAQ ───
export interface FAQItem {
    question: string;
    answer: string;
}

// ─── Gallery Image ───
export interface GalleryImage {
    url: string;
    caption: string;
}

// ─── Template ID ───
export type EventTemplateId =
    | "neon-dark"
    | "corporate-pro"
    | "glassmorphism"
    | "vibrant-gradient"
    | "minimal-light"
    | "retro-bold"
    | "nature-green"
    | "luxury-gold"
    | "tech-blue"
    | "creative-splash";

// ─── Device Frame ───
export type DeviceFrame = "desktop" | "tablet" | "mobile";

// ─── Main Event Page Data ───
export interface EventPageData {
    // Event basics
    eventType: EventPageType;
    eventName: string;
    tagline: string;
    description: string;
    eventDate: string;
    eventEndDate: string;
    eventTime: string;
    venue: string;
    address: string;
    city: string;
    mapUrl: string;

    // Hero
    heroImageUrl: string;
    ctaText: string;
    ctaUrl: string;

    // Content
    speakers: Speaker[];
    agenda: AgendaItem[];
    tickets: TicketTier[];
    sponsors: Sponsor[];
    faqs: FAQItem[];
    gallery: GalleryImage[];

    // Branding
    organizerName: string;
    organizerLogo: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    contactEmail: string;
    contactPhone: string;
    website: string;
    socialLinks: { platform: string; url: string }[];

    // Template
    template: EventTemplateId;
}

// ─── Template Component Props ───
export interface EventTemplateProps {
    data: EventPageData;
}

// ─── Download Format ───
export type EventDownloadFormat = "html" | "pdf" | "zip";
