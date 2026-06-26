import type { EventPageType, EventPageData } from '../types';

interface EventDefaults {
    eventName: string;
    tagline: string;
    description: string;
    ctaText: string;
    organizerName: string;
}

export const eventPageDefaults: Record<EventPageType, EventDefaults> = {
    conference: {
        eventName: "TechSummit 2025",
        tagline: "Where Innovation Meets Inspiration",
        description: "Join 2000+ tech leaders, developers, and entrepreneurs for 2 days of cutting-edge talks, hands-on workshops, and unparalleled networking opportunities.",
        ctaText: "Register Now",
        organizerName: "TechSummit Foundation",
    },
    wedding: {
        eventName: "Rahul & Priya's Wedding",
        tagline: "A Celebration of Love",
        description: "We invite you to witness the beautiful union of Rahul and Priya as they begin their journey together. Join us for an evening of love, laughter, and celebration.",
        ctaText: "RSVP Now",
        organizerName: "The Kumar Family",
    },
    "product-launch": {
        eventName: "ProductX Launch Event",
        tagline: "The Future Starts Here",
        description: "Be among the first to experience our revolutionary new product. Live demos, exclusive offers, and a chance to meet the team behind the innovation.",
        ctaText: "Get Early Access",
        organizerName: "ProductX Inc.",
    },
    workshop: {
        eventName: "UI/UX Design Masterclass",
        tagline: "Learn. Build. Ship.",
        description: "An intensive 3-day workshop on modern UI/UX design principles, Figma workflows, and design systems. Certificate included.",
        ctaText: "Enroll Now",
        organizerName: "Design Academy",
    },
    meetup: {
        eventName: "Developer Meetup Chennai",
        tagline: "Code. Connect. Collaborate.",
        description: "Monthly gathering of developers, designers, and tech enthusiasts. Lightning talks, project showcases, and pizza!",
        ctaText: "Join Free",
        organizerName: "Chennai Dev Community",
    },
    festival: {
        eventName: "Harmony Music Festival 2025",
        tagline: "3 Days. 50 Artists. 1 Epic Experience.",
        description: "The biggest music festival in South India returns with top artists, food courts, art installations, and camping under the stars.",
        ctaText: "Buy Tickets",
        organizerName: "Harmony Events",
    },
    charity: {
        eventName: "Run for Education 2025",
        tagline: "Every Step Counts",
        description: "A charity run to raise funds for underprivileged children's education. 5K, 10K, and Half Marathon categories available.",
        ctaText: "Register to Run",
        organizerName: "Education for All Foundation",
    },
    webinar: {
        eventName: "AI in Business: Live Webinar",
        tagline: "Transform Your Business with AI",
        description: "Learn how leading companies are leveraging AI to drive growth. Live Q&A with industry experts. Free entry.",
        ctaText: "Register Free",
        organizerName: "Business AI Forum",
    },
    exhibition: {
        eventName: "Modern Art Exhibition",
        tagline: "Where Art Meets Emotion",
        description: "Featuring 100+ works from emerging and established artists. Sculpture, painting, digital art, and interactive installations.",
        ctaText: "Book Visit",
        organizerName: "National Gallery",
    },
    birthday: {
        eventName: "Arjun's 30th Birthday Bash",
        tagline: "Thirty & Thriving!",
        description: "Join us for an unforgettable evening of music, dance, and celebration as Arjun turns 30!",
        ctaText: "RSVP",
        organizerName: "Friends of Arjun",
    },
    corporate: {
        eventName: "Annual Awards Gala 2025",
        tagline: "Celebrating Excellence",
        description: "An evening of recognition, networking, and fine dining. Black tie event honoring the year's top performers.",
        ctaText: "Reserve Your Seat",
        organizerName: "Kumar Enterprises",
    },
    graduation: {
        eventName: "Class of 2025 Graduation",
        tagline: "The Tassel Was Worth the Hassle",
        description: "Celebrate the achievements of the graduating class. Ceremony followed by reception and photo sessions.",
        ctaText: "RSVP",
        organizerName: "University of Chennai",
    },
};

export function getDefaultEventPageData(eventType: EventPageType = "conference"): EventPageData {
    const defaults = eventPageDefaults[eventType];
    return {
        eventType,
        eventName: defaults.eventName,
        tagline: defaults.tagline,
        description: defaults.description,
        eventDate: "2025-06-14",
        eventEndDate: "2025-06-15",
        eventTime: "09:00 AM - 06:00 PM",
        venue: "Chennai Convention Centre",
        address: "123 Anna Salai, T. Nagar",
        city: "Chennai, Tamil Nadu",
        mapUrl: "",
        heroImageUrl: "",
        ctaText: defaults.ctaText,
        ctaUrl: "#register",
        speakers: [
            { name: "Dr. Sarah Chen", role: "CTO", company: "TechCorp", bio: "AI researcher and tech leader", photoUrl: "" },
            { name: "Raj Patel", role: "Founder", company: "StartupXYZ", bio: "Serial entrepreneur", photoUrl: "" },
            { name: "Emma Wilson", role: "Head of Design", company: "DesignCo", bio: "Award-winning UX designer", photoUrl: "" },
        ],
        agenda: [
            { time: "09:00 AM", title: "Registration & Breakfast", description: "Check-in and networking", speaker: "" },
            { time: "10:00 AM", title: "Keynote Address", description: "Opening keynote on the future of technology", speaker: "Dr. Sarah Chen" },
            { time: "11:30 AM", title: "Workshop Session", description: "Hands-on building with AI tools", speaker: "Raj Patel" },
            { time: "01:00 PM", title: "Lunch & Networking", description: "Buffet lunch and networking session", speaker: "" },
            { time: "02:30 PM", title: "Design Thinking Panel", description: "Panel discussion on modern design", speaker: "Emma Wilson" },
            { time: "04:00 PM", title: "Closing Remarks", description: "Summary and next steps", speaker: "" },
        ],
        tickets: [
            { name: "Early Bird", price: "₹999", features: ["All sessions", "Lunch included", "Certificate"], highlighted: false },
            { name: "Standard", price: "₹1,999", features: ["All sessions", "Lunch + dinner", "Certificate", "Workshop access"], highlighted: true },
            { name: "VIP", price: "₹4,999", features: ["All sessions", "All meals", "Certificate", "Workshop access", "1-on-1 with speakers", "VIP lounge"], highlighted: false },
        ],
        sponsors: [
            { name: "TechCorp", tier: "platinum", logoUrl: "", website: "https://example.com" },
            { name: "DesignCo", tier: "gold", logoUrl: "", website: "https://example.com" },
        ],
        faqs: [
            { question: "What's included in the ticket?", answer: "Your ticket includes access to all sessions, meals as per your tier, and a participation certificate." },
            { question: "Is parking available?", answer: "Yes, free parking is available at the venue for all attendees." },
            { question: "Can I get a refund?", answer: "Refunds are available up to 7 days before the event. A 10% processing fee applies." },
        ],
        gallery: [],
        organizerName: defaults.organizerName,
        organizerLogo: "",
        primaryColor: "#6366f1",
        secondaryColor: "#8b5cf6",
        accentColor: "#f59e0b",
        contactEmail: "hello@event.com",
        contactPhone: "+91 98765 43210",
        website: "https://event.com",
        socialLinks: [],
        template: "neon-dark",
    };
}
