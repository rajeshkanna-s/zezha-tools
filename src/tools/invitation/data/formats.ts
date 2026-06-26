import type { OutputFormat } from '../types';

export const formats: OutputFormat[] = [
    { id: "a4-vertical", name: "A4 Vertical", width: 794, height: 1123, ratio: "A4", useCase: "Print, PDF share" },
    { id: "a4-horizontal", name: "A4 Horizontal", width: 1123, height: 794, ratio: "A4", useCase: "Print, PDF share" },
    { id: "whatsapp-status", name: "WhatsApp Status", width: 1080, height: 1920, ratio: "9:16", useCase: "WhatsApp status" },
    { id: "instagram-story", name: "Instagram Story", width: 1080, height: 1920, ratio: "9:16", useCase: "Instagram story" },
    { id: "instagram-post", name: "Instagram Post", width: 1080, height: 1080, ratio: "1:1", useCase: "Instagram feed post" },
    { id: "instagram-portrait", name: "Instagram Portrait", width: 1080, height: 1350, ratio: "4:5", useCase: "Instagram portrait" },
    { id: "facebook-post", name: "Facebook Post", width: 1200, height: 630, ratio: "1.91:1", useCase: "Facebook post" },
    { id: "twitter-post", name: "Twitter / X Post", width: 1200, height: 675, ratio: "16:9", useCase: "Twitter post" },
    { id: "square-invite", name: "Square Invite", width: 1000, height: 1000, ratio: "1:1", useCase: "Digital sharing" },
];

export const defaultFormat = formats[0];
