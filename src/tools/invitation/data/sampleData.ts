import type { EventType, InvitationData, DecorativeOptions } from '../types';
import { defaultColorScheme } from './colorSchemes';
import { defaultFontPair } from './fontPairs';
import { defaultFormat } from './formats';

interface EventDefaults {
    title: string;
    eventName: string;
    hostNames: string;
    quote: string;
    groomName?: string;
    brideName?: string;
    honoree?: string;
}

export const eventDefaults: Record<EventType, EventDefaults> = {
    wedding: {
        title: "Together with their families",
        eventName: "Wedding Ceremony",
        hostNames: "Mr. & Mrs. Ramesh Kumar",
        quote: "Two souls, one heart — forever starts today",
        groomName: "Rahul Kumar",
        brideName: "Priya Sharma",
    },
    engagement: {
        title: "We're Engaged!",
        eventName: "Engagement Ceremony",
        hostNames: "The Kumar & Sharma Families",
        quote: "A promise of forever begins today",
        groomName: "Rahul",
        brideName: "Priya",
    },
    birthday: {
        title: "You're Invited!",
        eventName: "Birthday Celebration",
        hostNames: "The Kumar Family",
        quote: "Another year, another adventure awaits",
        honoree: "Arjun Kumar",
    },
    babyshower: {
        title: "A Little One is on the Way!",
        eventName: "Baby Shower",
        hostNames: "Meera & Rahul Kumar",
        quote: "Tiny fingers, tiny toes — a bundle of joy soon arrives",
    },
    housewarming: {
        title: "Welcome to Our New Home",
        eventName: "Housewarming Ceremony",
        hostNames: "The Kumar Family",
        quote: "Bless our new home with your gracious presence",
    },
    graduation: {
        title: "We Did It!",
        eventName: "Graduation Celebration",
        hostNames: "The Kumar Family",
        quote: "The tassel was worth the hassle",
        honoree: "Arjun Kumar",
    },
    corporate: {
        title: "You're Invited",
        eventName: "Annual Corporate Gala",
        hostNames: "Kumar Enterprises Pvt. Ltd.",
        quote: "Celebrating excellence and innovation",
    },
    farewell: {
        title: "Farewell & Best Wishes",
        eventName: "Farewell Gathering",
        hostNames: "Team Kumar Enterprises",
        quote: "Don't cry because it's over, smile because it happened",
        honoree: "Mr. Suresh Kumar",
    },
    anniversary: {
        title: "Celebrating Love",
        eventName: "25th Wedding Anniversary",
        hostNames: "The Kumar Family",
        quote: "A love that grows stronger with every passing year",
    },
    pooja: {
        title: "Seeking Divine Blessings",
        eventName: "Griha Pravesh Pooja",
        hostNames: "The Kumar Family",
        quote: "May the Lord bless this occasion with peace and prosperity",
    },
    reception: {
        title: "Join Us for a Celebration",
        eventName: "Wedding Reception",
        hostNames: "Mr. & Mrs. Ramesh Kumar",
        quote: "Come celebrate the union of two beautiful souls",
        groomName: "Rahul Kumar",
        brideName: "Priya Sharma",
    },
    nameceremony: {
        title: "Naming Ceremony",
        eventName: "Namakarana Ceremony",
        hostNames: "Meera & Rahul Kumar",
        quote: "A name chosen with love for the newest star in our lives",
    },
};

export const defaultDecorations: DecorativeOptions = {
    borderFrame: true,
    cornerDecorations: true,
    dividerLines: true,
    backgroundPattern: true,
    photoFrame: false,
};

export function getDefaultInvitationData(eventType: EventType = "wedding"): InvitationData {
    const defaults = eventDefaults[eventType];
    return {
        eventType,
        title: defaults.title,
        hostNames: defaults.hostNames,
        groomName: defaults.groomName,
        brideName: defaults.brideName,
        honoree: defaults.honoree,
        eventName: defaults.eventName,
        date: "Saturday, 14th June 2025",
        time: "6:30 PM onwards",
        venue: "Grand Ballroom, Hotel Taj",
        address: "123 Main Road, T. Nagar",
        city: "Chennai",
        dresscode: "",
        rsvpPhone: "",
        rsvpDate: "",
        quote: defaults.quote,
        template: "royal-gold",
        colorScheme: defaultColorScheme,
        fontPair: defaultFontPair,
        format: defaultFormat,
        language: "english",
        decorations: { ...defaultDecorations },
        fontScale: 1,
    };
}
