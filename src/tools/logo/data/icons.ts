import type { Icon } from '../types';

export const ICONS: Icon[] = [
  // ──────────────────────────────────────────────
  //  SOCIAL MEDIA (mandatory)
  // ──────────────────────────────────────────────
  {
    id: 'facebook', name: 'Facebook', category: 'Social Media', keywords: ['social', 'fb', 'meta'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="2" width="20" height="20" rx="4" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M13 8.5h2V6h-2c-1.7 0-3 1.3-3 3v1.5H8V13h2v7h2.5v-7H15l.5-2.5H12.5V9c0-.28.22-.5.5-.5z" fill="currentColor"/>',
  },
  {
    id: 'instagram', name: 'Instagram', category: 'Social Media', keywords: ['social', 'photo', 'ig'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="2" width="20" height="20" rx="5" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/>',
  },
  {
    id: 'twitter-x', name: 'X (Twitter)', category: 'Social Media', keywords: ['social', 'twitter', 'x', 'tweet'],
    viewBox: '0 0 24 24',
    svg: '<path d="M4 4l6.5 9L4 20h2.5l5-6.5L16.5 20H21L14 10.5 20.5 4H18l-4.5 5.5L9 4z" fill="currentColor"/>',
  },
  {
    id: 'linkedin', name: 'LinkedIn', category: 'Social Media', keywords: ['social', 'professional', 'job'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="2" width="20" height="20" rx="3" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><rect x="6" y="10" width="2.5" height="8" fill="currentColor"/><circle cx="7.25" cy="7.25" r="1.5" fill="currentColor"/><path d="M11 10v8h2.5v-4.5a2.5 2.5 0 015 0V18H21v-5.5a5 5 0 00-5-4.7 4.5 4.5 0 00-2.5.8V10z" fill="currentColor"/>',
  },
  {
    id: 'youtube', name: 'YouTube', category: 'Social Media', keywords: ['social', 'video', 'watch'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><polygon points="10 9 10 15 16 12" fill="white"/>',
  },
  {
    id: 'whatsapp', name: 'WhatsApp', category: 'Social Media', keywords: ['social', 'chat', 'message'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M17.5 14.8c-.3.8-1.3 1.5-2.2 1.6-.6.1-1.3.1-2-.2-2.5-.9-4.1-3.3-4.3-3.5-.2-.2-.9-1.2-.9-2.3 0-1.1.6-1.7 1-2 .3-.3.5-.3.7-.3h.5c.2 0 .3.1.4.4l.7 1.8c.1.2.1.4 0 .6l-.6.7c.2.5.8 1.3 1.4 1.7.6.5 1.3.9 1.8 1.1l.6-.7c.2-.2.4-.3.6-.2l1.8.8c.2.1.4.3.4.5v.5z" fill="currentColor"/>',
  },
  {
    id: 'tiktok', name: 'TikTok', category: 'Social Media', keywords: ['social', 'video', 'short'],
    viewBox: '0 0 24 24',
    svg: '<path d="M19 6.7a5 5 0 01-3.7-1.7A5 5 0 0114 1.5h-3v13.2a2.3 2.3 0 11-2.8-2.2V9.7a6 6 0 104.8 5.9V8.5a8 8 0 004.7 1.5V7.1a5 5 0 01-.7-.4z" fill="currentColor"/>',
  },
  {
    id: 'discord', name: 'Discord', category: 'Social Media', keywords: ['social', 'gaming', 'chat'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.12" stroke="currentColor" stroke-width="1.5"/><path d="M16.5 7.5A14 14 0 0013 7a9 9 0 00-.5 1 13 13 0 00-4 0A9 9 0 008.5 7 14 14 0 005.4 7.8C3.7 10.5 3.2 13 3.4 15.5c1.5 1.1 2.9 1.7 4.3 2.1.3-.4.6-.9.9-1.4a9 9 0 01-1.4-.7l.3-.2a9.5 9.5 0 008.9 0l.3.2-1.4.7c.2.5.5 1 .9 1.4 1.4-.4 2.8-1 4.3-2.1.2-3-.5-5.5-2.3-7.9zM9.5 14a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="currentColor"/>',
  },
  {
    id: 'telegram', name: 'Telegram', category: 'Social Media', keywords: ['social', 'message', 'chat'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.12" stroke="currentColor" stroke-width="1.5"/><path d="M17 7.5L6.5 11.5 9 13l1.5 4.5 2-2.5 3 2.5 1.5-10z" fill="currentColor"/>',
  },
  {
    id: 'github', name: 'GitHub', category: 'Social Media', keywords: ['code', 'developer', 'git'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.56 9.56 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z" fill="currentColor"/>',
  },
  {
    id: 'pinterest', name: 'Pinterest', category: 'Social Media', keywords: ['social', 'photos', 'ideas'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.12" stroke="currentColor" stroke-width="1.5"/><path d="M12 4a8 8 0 00-2.9 15.4l1.4-5.9a2.8 2.8 0 01-.4-1.5c0-1.5.9-2.6 1.9-2.6.9 0 1.4.7 1.4 1.5 0 .9-.6 2.2-.9 3.4-.3 1 .5 1.8 1.5 1.8 1.8 0 3-1.9 3-4.7 0-2.4-1.7-4.1-4.2-4.1a4.7 4.7 0 00-4.9 4.7c0 .9.3 1.9.9 2.4.1.1.1.2 0 .4l-.3 1.3c-.1.2-.2.3-.4.2-1.6-.7-2.5-2.9-2.5-4.7 0-3.8 2.8-7.3 8.1-7.3 4.2 0 7.5 3 7.5 7.1 0 4.2-2.7 7.6-6.4 7.6-1.2 0-2.4-.6-2.8-1.4l-.8 3c-.3 1.1-1 2.4-1.5 3.2A8 8 0 0020 12a8 8 0 00-8-8z" fill="currentColor"/>',
  },
  {
    id: 'reddit', name: 'Reddit', category: 'Social Media', keywords: ['social', 'forum', 'community'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.12" stroke="currentColor" stroke-width="1.5"/><circle cx="8.5" cy="12.5" r="1.3" fill="currentColor"/><circle cx="15.5" cy="12.5" r="1.3" fill="currentColor"/><path d="M8.5 15.5c1 1.3 6 1.3 7 0M12 7a2 2 0 010 3.5" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><circle cx="18" cy="8" r="1.8" fill="currentColor" opacity="0.4"/><path d="M14 7l3-1" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>',
  },
  {
    id: 'snapchat', name: 'Snapchat', category: 'Social Media', keywords: ['social', 'stories', 'snap'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 2C9.5 2 7 4 7 7v1H5l.5 2.5c.2.5.8.7 1.3.7a6 6 0 001 0c.3.4.7.7 1.2.9 1 .4 1.5.8 1.5 1.5 0 .3-.2.6-.4.9-.5.7-1.5 1-2.8 1.2l-.3 1.8c2.5.1 4 1.5 5 1.5s2.5-1.4 5-1.5l-.3-1.8c-1.3-.2-2.3-.5-2.8-1.2-.2-.3-.4-.6-.4-.9 0-.7.5-1.1 1.5-1.5.5-.2.9-.5 1.2-.9a6 6 0 001 0c.5 0 1.1-.2 1.3-.7L18 8h-2V7c0-3-2.5-5-4-5z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  },
  {
    id: 'twitch', name: 'Twitch', category: 'Social Media', keywords: ['gaming', 'stream', 'live'],
    viewBox: '0 0 24 24',
    svg: '<path d="M4 2L3 6v14h5v3l3-3h3l5-5V2H4zm14 11l-3 3h-3l-3 3v-3H6V4h12v9z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.2"/><line x1="11" y1="7" x2="11" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="15" y1="7" x2="15" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  },
  {
    id: 'medium', name: 'Medium', category: 'Social Media', keywords: ['blog', 'writing', 'article'],
    viewBox: '0 0 24 24',
    svg: '<ellipse cx="7" cy="12" rx="5" ry="5.5" fill="currentColor"/><ellipse cx="16.5" cy="12" rx="3.5" ry="5" fill="currentColor" opacity="0.7"/><ellipse cx="22" cy="12" rx="1.5" ry="4.5" fill="currentColor" opacity="0.5"/>',
  },
  {
    id: 'spotify', name: 'Spotify', category: 'Social Media', keywords: ['music', 'audio', 'streaming'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M7 9.5c3-1 6.5-.5 9 1.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M7.5 12c2.5-.8 5.5-.3 7.5 1.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M8 14.5c2-.6 4-.2 5.5.8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
  },
  {
    id: 'slack', name: 'Slack', category: 'Social Media', keywords: ['team', 'work', 'chat'],
    viewBox: '0 0 24 24',
    svg: '<path d="M14.5 2a2 2 0 00-2 2v5a2 2 0 004 0V4a2 2 0 00-2-2z" fill="currentColor"/><path d="M2 9.5a2 2 0 002 2h5a2 2 0 000-4H4a2 2 0 00-2 2z" fill="currentColor"/><path d="M9.5 22a2 2 0 002-2v-5a2 2 0 00-4 0v5a2 2 0 002 2z" fill="currentColor"/><path d="M22 14.5a2 2 0 00-2-2h-5a2 2 0 000 4h5a2 2 0 002-2z" fill="currentColor"/>',
  },
  {
    id: 'google', name: 'Google', category: 'Social Media', keywords: ['search', 'google', 'browser'],
    viewBox: '0 0 24 24',
    svg: '<path d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.5a4.7 4.7 0 01-2 3.1v2.5h3.2c1.9-1.7 3-4.3 3-7.4z" fill="currentColor" opacity="0.7"/><path d="M12 22a9.8 9.8 0 006.8-2.5l-3.2-2.5a6.2 6.2 0 01-9.2-3.2H3v2.6C4.9 19.9 8.2 22 12 22z" fill="currentColor" opacity="0.5"/><path d="M6.4 13.8A6 6 0 016 12c0-.6.1-1.2.3-1.8V7.6H3A10 10 0 002 12c0 1.6.4 3.1 1 4.4z" fill="currentColor" opacity="0.3"/><path d="M12 5.8c1.7 0 3.2.6 4.4 1.8l3.2-3.2C17.7 2.5 15 1.5 12 1.5 8.2 1.5 4.9 3.6 3 6.7l3.3 2.6a6.2 6.2 0 015.7-3.5z" fill="currentColor"/>',
  },
  {
    id: 'apple', name: 'Apple', category: 'Social Media', keywords: ['ios', 'mac', 'brand'],
    viewBox: '0 0 24 24',
    svg: '<path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.44c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.54 3.95zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="currentColor"/>',
  },
  {
    id: 'microsoft', name: 'Microsoft', category: 'Social Media', keywords: ['windows', 'brand', 'office'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="2" width="9.5" height="9.5" fill="currentColor"/><rect x="12.5" y="2" width="9.5" height="9.5" fill="currentColor" opacity="0.7"/><rect x="2" y="12.5" width="9.5" height="9.5" fill="currentColor" opacity="0.7"/><rect x="12.5" y="12.5" width="9.5" height="9.5" fill="currentColor" opacity="0.5"/>',
  },
  {
    id: 'android', name: 'Android', category: 'Social Media', keywords: ['mobile', 'google', 'phone'],
    viewBox: '0 0 24 24',
    svg: '<path d="M6 13a6 6 0 0012 0V9H6v4zm4-2a1 1 0 110 2 1 1 0 010-2zm4 0a1 1 0 110 2 1 1 0 010-2z" fill="currentColor"/><path d="M4 9h16v4a8 8 0 01-16 0V9z" fill="currentColor" opacity="0.2"/><line x1="8.5" y1="2" x2="6" y2="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="15.5" y1="2" x2="18" y2="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="4" y1="13" x2="2" y2="13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="20" y1="13" x2="22" y2="13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'behance', name: 'Behance', category: 'Social Media', keywords: ['portfolio', 'design', 'creative'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="2" width="20" height="20" rx="3" fill="currentColor" opacity="0.12" stroke="currentColor" stroke-width="1.5"/><path d="M8 7h3c1.6 0 2.5.8 2.5 2s-.6 1.8-1.5 2 2 .6 2 2.2C14 15 12.8 16 11 16H8V7zm2 3.5h1c.6 0 .9-.3.9-.8s-.3-.8-.9-.8h-1v1.6zm0 3.5h1.2c.7 0 1-.4 1-1s-.3-1-1-1H10V14zm5.5-7h4v1.5h-4V7zm-.5 4c0-2 1.2-3.3 3.2-3.3S21 9 21 11v.7h-4.2c0 1 .5 1.6 1.4 1.6.7 0 1.1-.3 1.3-.8h1.4c-.3 1.3-1.3 2-2.8 2-1.9 0-3-1.2-3-3.5z" fill="currentColor"/>',
  },
  {
    id: 'dribbble', name: 'Dribbble', category: 'Social Media', keywords: ['design', 'portfolio', 'creative'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1.5"/><path d="M4.5 8.5C6.3 11 9 13 12 13.5s5.5.5 7.5-.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M6 17.5c1.5-4 4.5-6 8.5-6s4.5.5 5.5 1" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M7.5 5c1 2.5 3 5 5 6.5s4 3.5 6 5" fill="none" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'figma', name: 'Figma', category: 'Social Media', keywords: ['design', 'ui', 'tool'],
    viewBox: '0 0 24 24',
    svg: '<rect x="8" y="2" width="8" height="6" rx="3" fill="currentColor" opacity="0.5"/><rect x="2" y="2" width="8" height="6" rx="3" fill="currentColor" opacity="0.7"/><rect x="2" y="9" width="8" height="6" rx="3" fill="currentColor" opacity="0.6"/><circle cx="18" cy="12" r="3" fill="currentColor"/><rect x="2" y="16" width="8" height="6" rx="3" fill="currentColor" opacity="0.4"/>',
  },
  {
    id: 'notion', name: 'Notion', category: 'Social Media', keywords: ['notes', 'productivity', 'tool'],
    viewBox: '0 0 24 24',
    svg: '<rect x="3" y="2" width="18" height="20" rx="2" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1.5"/><path d="M7 7h4l5 8V7m0 4h-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    id: 'zoom', name: 'Zoom', category: 'Social Media', keywords: ['video', 'meeting', 'call'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="6" width="14" height="12" rx="3" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><path d="M16 9.5l6-4v13l-6-4V9.5z" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/>',
  },
  {
    id: 'airbnb', name: 'Airbnb', category: 'Social Media', keywords: ['travel', 'booking', 'home'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 2C8.7 2 7 4.5 7 7c0 2 1.4 4.5 3.5 7.5.5.7 1 1.5 1.5 2.2.5-.7 1-1.5 1.5-2.2C15.6 11.5 17 9 17 7c0-2.5-1.7-5-5-5zM12 9a2 2 0 110-4 2 2 0 010 4z" fill="currentColor"/><path d="M5 20c0-2 2-3.5 7-4s7 2 7 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'paypal', name: 'PayPal', category: 'Social Media', keywords: ['payment', 'money', 'finance'],
    viewBox: '0 0 24 24',
    svg: '<path d="M5.5 2h9c2.5 0 4 1.5 3.5 4.5-1 4.5-3.5 5.5-6.5 5.5H10L9 17H6l2.5-15zm3 2L7 13h2c1.5 0 3.5-1 4-4 .5-2.5-.5-3-2.5-3H8.5z" fill="currentColor"/><path d="M8.5 19h2.5l1 3H9l-.5-3z" fill="currentColor" opacity="0.5"/>',
  },
  {
    id: 'amazon', name: 'Amazon', category: 'Social Media', keywords: ['shopping', 'ecommerce', 'brand'],
    viewBox: '0 0 24 24',
    svg: '<path d="M4 17c4 3 11 3 16-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18 17l2-1-1-2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M7 7h10M7 11h7M7 15h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'netflix', name: 'Netflix', category: 'Social Media', keywords: ['streaming', 'video', 'movies'],
    viewBox: '0 0 24 24',
    svg: '<path d="M7 3v18l5-13v13l5-18H7z" fill="currentColor"/>',
  },
  {
    id: 'shopify', name: 'Shopify', category: 'Social Media', keywords: ['ecommerce', 'store', 'shop'],
    viewBox: '0 0 24 24',
    svg: '<path d="M16 3.5a4 4 0 00-3.8-1.5c-.4 0-.8.1-1.1.4l-.6-.6-1 .2.3 1.5A6 6 0 008.5 7L7 7.5 9 19l9-1.7-2-14zm-3-1a2 2 0 011.8 1l-1.8.3V2.5zm-3.5 2.7l1.5-.3V7L8.5 8l1-3.8z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1"/><path d="M9 8l1 9.5L16 16l-1-10-2 .3-4 1.7z" fill="currentColor" opacity="0.2"/>',
  },
  // ──────────────────────────────────────────────
  //  TECHNOLOGY
  // ──────────────────────────────────────────────
  {
    id: 'laptop', name: 'Laptop', category: 'Technology', keywords: ['computer', 'tech', 'device'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="3" width="20" height="13" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><polyline points="1 19 23 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>',
  },
  {
    id: 'code', name: 'Code', category: 'Technology', keywords: ['developer', 'programming', 'brackets'],
    viewBox: '0 0 24 24',
    svg: '<polyline points="16 18 22 12 16 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><polyline points="8 6 2 12 8 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  },
  {
    id: 'database', name: 'Database', category: 'Technology', keywords: ['data', 'storage', 'server'],
    viewBox: '0 0 24 24',
    svg: '<ellipse cx="12" cy="5" rx="9" ry="3" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M3 5v4c0 1.66 4.03 3 9 3s9-1.34 9-3V5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M3 9v4c0 1.66 4.03 3 9 3s9-1.34 9-3V9" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M3 13v4c0 1.66 4.03 3 9 3s9-1.34 9-3v-4" fill="none" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'cloud', name: 'Cloud', category: 'Technology', keywords: ['cloud', 'saas', 'internet'],
    viewBox: '0 0 24 24',
    svg: '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'wifi', name: 'WiFi', category: 'Technology', keywords: ['wireless', 'internet', 'network'],
    viewBox: '0 0 24 24',
    svg: '<path d="M5 12.55a11 11 0 0 1 14.08 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M1.42 9a16 16 0 0 1 21.16 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="20" r="1" fill="currentColor"/>',
  },
  {
    id: 'lock', name: 'Lock', category: 'Technology', keywords: ['security', 'safe', 'protect'],
    viewBox: '0 0 24 24',
    svg: '<rect x="3" y="11" width="18" height="11" rx="2" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'cpu', name: 'CPU / Chip', category: 'Technology', keywords: ['processor', 'hardware', 'chip'],
    viewBox: '0 0 24 24',
    svg: '<rect x="9" y="9" width="6" height="6" fill="currentColor"/><rect x="7" y="7" width="10" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="9" y1="2" x2="9" y2="7" stroke="currentColor" stroke-width="1.5"/><line x1="15" y1="2" x2="15" y2="7" stroke="currentColor" stroke-width="1.5"/><line x1="9" y1="17" x2="9" y2="22" stroke="currentColor" stroke-width="1.5"/><line x1="15" y1="17" x2="15" y2="22" stroke="currentColor" stroke-width="1.5"/><line x1="2" y1="9" x2="7" y2="9" stroke="currentColor" stroke-width="1.5"/><line x1="2" y1="15" x2="7" y2="15" stroke="currentColor" stroke-width="1.5"/><line x1="17" y1="9" x2="22" y2="9" stroke="currentColor" stroke-width="1.5"/><line x1="17" y1="15" x2="22" y2="15" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'gear', name: 'Settings', category: 'Technology', keywords: ['settings', 'config', 'gear'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" fill="none" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'smartphone', name: 'Smartphone', category: 'Technology', keywords: ['phone', 'mobile', 'device'],
    viewBox: '0 0 24 24',
    svg: '<rect x="5" y="2" width="14" height="20" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="18" x2="12.01" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  },
  {
    id: 'terminal', name: 'Terminal', category: 'Technology', keywords: ['command', 'cli', 'developer'],
    viewBox: '0 0 24 24',
    svg: '<polyline points="4 17 10 11 4 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><line x1="12" y1="19" x2="20" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  },
  {
    id: 'monitor', name: 'Monitor', category: 'Technology', keywords: ['screen', 'display', 'desktop'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="3" width="20" height="14" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'headphones', name: 'Headphones', category: 'Technology', keywords: ['audio', 'music', 'listen'],
    viewBox: '0 0 24 24',
    svg: '<path d="M3 18v-6a9 9 0 0 1 18 0v6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'microphone', name: 'Microphone', category: 'Technology', keywords: ['record', 'audio', 'voice'],
    viewBox: '0 0 24 24',
    svg: '<rect x="9" y="2" width="6" height="11" rx="3" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><path d="M5 10a7 7 0 0 0 14 0" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'gamepad', name: 'Gamepad', category: 'Technology', keywords: ['gaming', 'game', 'controller'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="6" width="20" height="12" rx="4" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M6 10v4M4 12h4M16 11h2M17 12v.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'robot', name: 'AI Robot', category: 'Technology', keywords: ['ai', 'robot', 'automation'],
    viewBox: '0 0 24 24',
    svg: '<rect x="7" y="11" width="10" height="8" rx="2" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><rect x="10" y="7" width="4" height="4" rx="1" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><circle cx="10" cy="15" r="1.2" fill="currentColor"/><circle cx="14" cy="15" r="1.2" fill="currentColor"/><line x1="12" y1="7" x2="12" y2="5" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="4.5" r="1" fill="currentColor"/><line x1="7" y1="14" x2="5" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="17" y1="14" x2="19" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'cloud-upload', name: 'Cloud Upload', category: 'Technology', keywords: ['upload', 'cloud', 'sync'],
    viewBox: '0 0 24 24',
    svg: '<path d="M16 16l-4-4-4 4M12 12v9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'satellite', name: 'Satellite', category: 'Technology', keywords: ['signal', 'broadcast', 'tech'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  // ──────────────────────────────────────────────
  //  BUSINESS & FINANCE
  // ──────────────────────────────────────────────
  {
    id: 'briefcase', name: 'Briefcase', category: 'Business', keywords: ['business', 'work', 'professional'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="7" width="20" height="14" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" fill="none" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'bar-chart', name: 'Bar Chart', category: 'Business', keywords: ['analytics', 'data', 'stats'],
    viewBox: '0 0 24 24',
    svg: '<line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
  },
  {
    id: 'trending-up', name: 'Trending Up', category: 'Business', keywords: ['growth', 'finance', 'chart'],
    viewBox: '0 0 24 24',
    svg: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="17 6 23 6 23 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    id: 'rocket', name: 'Rocket', category: 'Business', keywords: ['startup', 'launch', 'growth'],
    viewBox: '0 0 24 24',
    svg: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" fill="currentColor"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" fill="currentColor" opacity="0.8"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" fill="currentColor" opacity="0.5"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" fill="currentColor" opacity="0.5"/>',
  },
  {
    id: 'globe', name: 'Globe', category: 'Business', keywords: ['world', 'global', 'international'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1.5"/><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="1.5"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" fill="none" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'target', name: 'Target', category: 'Business', keywords: ['goal', 'aim', 'focus'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/>',
  },
  {
    id: 'trophy', name: 'Trophy', category: 'Business', keywords: ['award', 'winner', 'achievement'],
    viewBox: '0 0 24 24',
    svg: '<path d="M6 2h12v6a6 6 0 0 1-12 0V2z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M6 7.7V8a6 6 0 0 1-4-5.65V2h4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M18 7.7V8a6 6 0 0 0 4-5.65V2h-4" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="14" x2="12" y2="17" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'lightbulb', name: 'Lightbulb', category: 'Business', keywords: ['idea', 'innovation', 'creative'],
    viewBox: '0 0 24 24',
    svg: '<line x1="9" y1="18" x2="15" y2="18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="10" y1="22" x2="14" y2="22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'shield', name: 'Shield', category: 'Business', keywords: ['protection', 'security', 'trust'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'handshake', name: 'Handshake', category: 'Business', keywords: ['partnership', 'deal', 'agreement'],
    viewBox: '0 0 24 24',
    svg: '<path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 7.65l1.06 1.06L12 21.23l7.77-7.77 1.06-1.06a5.4 5.4 0 00-.41-7.82z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'pie-chart', name: 'Pie Chart', category: 'Business', keywords: ['analytics', 'finance', 'stats'],
    viewBox: '0 0 24 24',
    svg: '<path d="M21.21 15.89A10 10 0 1 1 8 2.83" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M22 12A10 10 0 0 0 12 2v10z" fill="currentColor" opacity="0.5" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'money-bag', name: 'Money Bag', category: 'Business', keywords: ['money', 'finance', 'rich'],
    viewBox: '0 0 24 24',
    svg: '<path d="M9 8c-3 0-7 2-7 7s4 7 10 7 10-2 10-7-4-7-7-7" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M10 8c0-1 .5-2 2-3s2.5-3 .5-4c-1.5-1-3 0-3 1s.5 1.5 1 2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><text x="12" y="17" font-size="6" text-anchor="middle" fill="currentColor" font-weight="bold">$</text>',
  },
  {
    id: 'calendar', name: 'Calendar', category: 'Business', keywords: ['date', 'schedule', 'plan'],
    viewBox: '0 0 24 24',
    svg: '<rect x="3" y="4" width="18" height="18" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'megaphone', name: 'Megaphone', category: 'Business', keywords: ['announce', 'marketing', 'promotion'],
    viewBox: '0 0 24 24',
    svg: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'compass', name: 'Compass', category: 'Business', keywords: ['navigate', 'direction', 'explore'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor"/>',
  },
  // ──────────────────────────────────────────────
  //  FOOD & RESTAURANT
  // ──────────────────────────────────────────────
  {
    id: 'fork-knife', name: 'Fork & Knife', category: 'Food', keywords: ['restaurant', 'dining', 'food'],
    viewBox: '0 0 24 24',
    svg: '<line x1="8" y1="2" x2="8" y2="22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 2v6a4 4 0 0 0 4 4v10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8 2v4a4 4 0 0 1-4 4v12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'chef-hat', name: 'Chef Hat', category: 'Food', keywords: ['chef', 'cook', 'restaurant'],
    viewBox: '0 0 24 24',
    svg: '<path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><line x1="6" y1="17" x2="18" y2="17" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'flame', name: 'Flame', category: 'Food', keywords: ['fire', 'hot', 'spicy', 'bbq'],
    viewBox: '0 0 24 24',
    svg: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" fill="currentColor" opacity="0.7" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'coffee', name: 'Coffee', category: 'Food', keywords: ['cafe', 'coffee', 'drink'],
    viewBox: '0 0 24 24',
    svg: '<path d="M18 8h1a4 4 0 0 1 0 8h-1" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><line x1="6" y1="1" x2="6" y2="4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="10" y1="1" x2="10" y2="4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="14" y1="1" x2="14" y2="4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'leaf', name: 'Leaf', category: 'Food', keywords: ['organic', 'nature', 'vegan', 'fresh'],
    viewBox: '0 0 24 24',
    svg: '<path d="M2 12S7 4 12 4s10 8 10 8-5 8-10 8S2 12 2 12z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'wine', name: 'Wine Glass', category: 'Food', keywords: ['wine', 'luxury', 'drink'],
    viewBox: '0 0 24 24',
    svg: '<path d="M8 2h8l-4 10z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><line x1="12" y1="12" x2="12" y2="19" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="22" x2="16" y2="22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'pizza', name: 'Pizza', category: 'Food', keywords: ['pizza', 'slice', 'italian'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 2L2 22h20L12 2z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="12" cy="10" r="1.5" fill="currentColor"/><circle cx="8" cy="15" r="1" fill="currentColor"/><circle cx="16" cy="15" r="1" fill="currentColor"/>',
  },
  {
    id: 'cake', name: 'Cake', category: 'Food', keywords: ['cake', 'birthday', 'celebration'],
    viewBox: '0 0 24 24',
    svg: '<path d="M20 21H4a2 2 0 01-2-2v-7h20v7a2 2 0 01-2 2z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><rect x="2" y="12" width="20" height="4" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><line x1="7" y1="12" x2="7" y2="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="12" y1="12" x2="12" y2="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="17" y1="12" x2="17" y2="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'cocktail', name: 'Cocktail', category: 'Food', keywords: ['drink', 'bar', 'cocktail'],
    viewBox: '0 0 24 24',
    svg: '<path d="M5 2l7 9 7-9H5zM12 11v11M8 22h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  },
  // ──────────────────────────────────────────────
  //  HEALTH & MEDICAL
  // ──────────────────────────────────────────────
  {
    id: 'heart', name: 'Heart', category: 'Health', keywords: ['health', 'love', 'medical'],
    viewBox: '0 0 24 24',
    svg: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor" stroke="currentColor" stroke-width="1"/>',
  },
  {
    id: 'cross-plus', name: 'Medical Cross', category: 'Health', keywords: ['medical', 'hospital', 'health'],
    viewBox: '0 0 24 24',
    svg: '<rect x="10" y="2" width="4" height="20" rx="1" fill="currentColor"/><rect x="2" y="10" width="20" height="4" rx="1" fill="currentColor"/>',
  },
  {
    id: 'heartbeat', name: 'Heartbeat', category: 'Health', keywords: ['ecg', 'pulse', 'health'],
    viewBox: '0 0 24 24',
    svg: '<path d="M22 12h-4l-3 9L9 3l-3 9H2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    id: 'lotus', name: 'Lotus', category: 'Health', keywords: ['yoga', 'wellness', 'spa', 'meditation'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 2C6 2 4 7 4 7s2 0 4 2c0 0-4 0-6 5 0 0 5 0 7 3 0 0 3-3 3-3s3 3 3 3c2-3 7-3 7-3-2-5-6-5-6-5 2-2 4-2 4-2s-2-5-8-5z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'brain', name: 'Brain', category: 'Health', keywords: ['mind', 'intelligence', 'mental'],
    viewBox: '0 0 24 24',
    svg: '<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.04-4.97A3 3 0 0 1 6 11c0-1.35.56-2.57 1.46-3.44A2.5 2.5 0 0 1 9.5 2z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.04-4.97A3 3 0 0 0 18 11a5 5 0 0 0-1.46-3.44A2.5 2.5 0 0 0 14.5 2z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'stethoscope', name: 'Stethoscope', category: 'Health', keywords: ['doctor', 'medical', 'clinic'],
    viewBox: '0 0 24 24',
    svg: '<path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="17" cy="17" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="14" y1="14" x2="10" y2="11" stroke="currentColor" stroke-width="1.5"/>',
  },
  // ──────────────────────────────────────────────
  //  EDUCATION
  // ──────────────────────────────────────────────
  {
    id: 'graduation-cap', name: 'Graduation Cap', category: 'Education', keywords: ['graduate', 'school', 'degree'],
    viewBox: '0 0 24 24',
    svg: '<path d="M22 10v6M2 10l10-5 10 5-10 5z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M6 12v5c3 3 9 3 12 0v-5" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'book', name: 'Open Book', category: 'Education', keywords: ['book', 'read', 'knowledge'],
    viewBox: '0 0 24 24',
    svg: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'pencil', name: 'Pencil', category: 'Education', keywords: ['write', 'edit', 'school'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 20h9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'atom', name: 'Atom', category: 'Education', keywords: ['science', 'physics', 'chemistry'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="1" fill="currentColor"/><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9C11.17 3.86 5.8 1.83 3.8 3.8c-2.04 2.03-.02 7.36 4.5 11.9 4.52 4.52 9.85 6.55 11.9 4.5z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M3.8 20.2c2.03 2.04 7.36.02 11.9-4.5 4.52-4.52 6.55-9.85 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.52-6.55 9.85-4.5 11.9z" fill="none" stroke="currentColor" stroke-width="1.5"/>',
  },
  // ──────────────────────────────────────────────
  //  BEAUTY & FASHION
  // ──────────────────────────────────────────────
  {
    id: 'scissors', name: 'Scissors', category: 'Beauty', keywords: ['salon', 'hair', 'cut'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="6" cy="6" r="3" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><circle cx="6" cy="18" r="3" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><line x1="20" y1="4" x2="8.12" y2="15.88" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="14.47" y1="14.48" x2="20" y2="20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="8.12" y1="8.12" x2="12" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'crown', name: 'Crown', category: 'Beauty', keywords: ['royal', 'luxury', 'premium', 'king'],
    viewBox: '0 0 24 24',
    svg: '<path d="M2 18h20l-3-10-5 5-2-8-2 8-5-5z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><line x1="2" y1="21" x2="22" y2="21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'diamond', name: 'Diamond', category: 'Beauty', keywords: ['jewel', 'luxury', 'gem'],
    viewBox: '0 0 24 24',
    svg: '<path d="M1 11l5-9h12l5 9-11 11z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><line x1="1" y1="11" x2="23" y2="11" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'rose', name: 'Rose', category: 'Beauty', keywords: ['flower', 'beauty', 'floral'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 2a4 4 0 0 0-4 4 4 4 0 0 0 2 3.46A4 4 0 0 0 8 13a4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-2-3.54A4 4 0 0 0 16 6a4 4 0 0 0-4-4z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="17" x2="12" y2="22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  // ──────────────────────────────────────────────
  //  CONSTRUCTION
  // ──────────────────────────────────────────────
  {
    id: 'home', name: 'Home', category: 'Construction', keywords: ['house', 'real-estate', 'property'],
    viewBox: '0 0 24 24',
    svg: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" stroke-width="1.5" fill="none"/>',
  },
  {
    id: 'building', name: 'Building', category: 'Construction', keywords: ['office', 'city', 'real-estate'],
    viewBox: '0 0 24 24',
    svg: '<rect x="3" y="3" width="13" height="18" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M16 8h4l1 13H16" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1.5"/><line x1="7" y1="7" x2="8" y2="7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="7" y1="11" x2="8" y2="11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="7" y1="15" x2="8" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  },
  {
    id: 'hammer', name: 'Hammer', category: 'Construction', keywords: ['build', 'construction', 'tool'],
    viewBox: '0 0 24 24',
    svg: '<path d="M15 12l-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M17.64 15L22 10.64l-5-5-4.36 4.36" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 8l2-2m9 1l1-1" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'key', name: 'Key', category: 'Construction', keywords: ['key', 'access', 'property'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="7.5" cy="15.5" r="5.5" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M21 2l-9.6 9.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M15.5 7.5l3 3L21 8l-3-3" fill="none" stroke="currentColor" stroke-width="1.5"/>',
  },
  // ──────────────────────────────────────────────
  //  SPORTS & FITNESS
  // ──────────────────────────────────────────────
  {
    id: 'lightning', name: 'Lightning', category: 'Sports', keywords: ['energy', 'power', 'fast'],
    viewBox: '0 0 24 24',
    svg: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" opacity="0.7" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/>',
  },
  {
    id: 'dumbbell', name: 'Dumbbell', category: 'Sports', keywords: ['gym', 'fitness', 'workout'],
    viewBox: '0 0 24 24',
    svg: '<path d="M6 5v14M18 5v14" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M3 8v8M21 8v8" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" stroke-width="2"/>',
  },
  {
    id: 'medal', name: 'Medal', category: 'Sports', keywords: ['award', 'achievement', 'winner'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="15" r="7" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M8 2h8l-2 6H10z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  },
  {
    id: 'football', name: 'Football', category: 'Sports', keywords: ['soccer', 'sport', 'ball'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1.5"/><path d="M12 2a10 10 0 00-4 8h8a10 10 0 00-4-8z" fill="currentColor" opacity="0.2"/><path d="M4 14a10 10 0 007 6v-6H4zm16 0H14v6a10 10 0 007-6z" fill="currentColor" opacity="0.2"/>',
  },
  // ──────────────────────────────────────────────
  //  CREATIVE & DESIGN
  // ──────────────────────────────────────────────
  {
    id: 'eye', name: 'Eye', category: 'Creative', keywords: ['vision', 'look', 'creative', 'photography'],
    viewBox: '0 0 24 24',
    svg: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3" fill="currentColor"/>',
  },
  {
    id: 'camera', name: 'Camera', category: 'Creative', keywords: ['photo', 'photography', 'picture'],
    viewBox: '0 0 24 24',
    svg: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="13" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'layers', name: 'Layers', category: 'Creative', keywords: ['stack', 'design', 'depth'],
    viewBox: '0 0 24 24',
    svg: '<polygon points="12 2 2 7 12 12 22 7 12 2" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><polyline points="2 17 12 22 22 17" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><polyline points="2 12 12 17 22 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'pen-nib', name: 'Pen Nib', category: 'Creative', keywords: ['design', 'pen', 'creative', 'studio'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 19l7-7 3 3-7 7-3-3z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><circle cx="11" cy="11" r="2" fill="currentColor"/>',
  },
  {
    id: 'music-note', name: 'Music Note', category: 'Creative', keywords: ['music', 'audio', 'song'],
    viewBox: '0 0 24 24',
    svg: '<path d="M9 18V5l12-2v13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="6" cy="18" r="3" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="16" r="3" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'film', name: 'Film', category: 'Creative', keywords: ['movie', 'video', 'cinema'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="2" width="20" height="20" rx="2" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1.5"/><line x1="7" y1="2" x2="7" y2="22" stroke="currentColor" stroke-width="1.5"/><line x1="17" y1="2" x2="17" y2="22" stroke="currentColor" stroke-width="1.5"/><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="1.5"/><line x1="2" y1="7" x2="7" y2="7" stroke="currentColor" stroke-width="1.5"/><line x1="17" y1="7" x2="22" y2="7" stroke="currentColor" stroke-width="1.5"/><line x1="2" y1="17" x2="7" y2="17" stroke="currentColor" stroke-width="1.5"/><line x1="17" y1="17" x2="22" y2="17" stroke="currentColor" stroke-width="1.5"/>',
  },
  // ──────────────────────────────────────────────
  //  ABSTRACT & GEOMETRIC
  // ──────────────────────────────────────────────
  {
    id: 'hexagon', name: 'Hexagon', category: 'Abstract', keywords: ['geometry', 'shape', 'modern'],
    viewBox: '0 0 24 24',
    svg: '<polygon points="12 2 22 7 22 17 12 22 2 17 2 7" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'star-5', name: 'Star', category: 'Abstract', keywords: ['star', 'favorite', 'rating'],
    viewBox: '0 0 24 24',
    svg: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/>',
  },
  {
    id: 'infinity', name: 'Infinity', category: 'Abstract', keywords: ['infinite', 'loop', 'forever'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4zm0 0c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z" fill="none" stroke="currentColor" stroke-width="2"/>',
  },
  {
    id: 'wave', name: 'Wave', category: 'Abstract', keywords: ['wave', 'flow', 'motion'],
    viewBox: '0 0 24 24',
    svg: '<path d="M2 12c1.5-4 3-4 4.5 0s3 4 4.5 0 3-4 4.5 0 3 4 4.5 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  },
  {
    id: 'dots-grid', name: 'Grid Dots', category: 'Abstract', keywords: ['grid', 'pattern', 'minimal'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="4" cy="4" r="2" fill="currentColor"/><circle cx="12" cy="4" r="2" fill="currentColor"/><circle cx="20" cy="4" r="2" fill="currentColor"/><circle cx="4" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="20" cy="12" r="2" fill="currentColor"/><circle cx="4" cy="20" r="2" fill="currentColor"/><circle cx="12" cy="20" r="2" fill="currentColor"/><circle cx="20" cy="20" r="2" fill="currentColor"/>',
  },
  {
    id: 'spiral', name: 'Spiral', category: 'Abstract', keywords: ['spiral', 'design', 'creative'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 16a6 6 0 1 1 6-6 6 6 0 0 1-6 6zm0-10a4 4 0 1 0 4 4 4 4 0 0 0-4-4zm0 6a2 2 0 1 1 2-2 2 2 0 0 1-2 2z" fill="currentColor" opacity="0.3"/>',
  },
  {
    id: 'arrow-right', name: 'Arrow Right', category: 'Abstract', keywords: ['arrow', 'direction', 'forward'],
    viewBox: '0 0 24 24',
    svg: '<line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><polyline points="12 5 19 12 12 19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  // ──────────────────────────────────────────────
  //  FINANCE & LEGAL
  // ──────────────────────────────────────────────
  {
    id: 'scale', name: 'Balance Scale', category: 'Finance', keywords: ['justice', 'law', 'balance'],
    viewBox: '0 0 24 24',
    svg: '<line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M3 6l9-3 9 3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M3 6l3 6a3 3 0 1 1-6 0z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M21 6l-3 6a3 3 0 0 0 6 0z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><line x1="5" y1="21" x2="19" y2="21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  // ──────────────────────────────────────────────
  //  TRAVEL & NATURE
  // ──────────────────────────────────────────────
  {
    id: 'airplane', name: 'Airplane', category: 'Travel', keywords: ['travel', 'flight', 'transport'],
    viewBox: '0 0 24 24',
    svg: '<path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  },
  {
    id: 'map-pin', name: 'Map Pin', category: 'Travel', keywords: ['location', 'place', 'map'],
    viewBox: '0 0 24 24',
    svg: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="10" r="3" fill="currentColor"/>',
  },
  {
    id: 'tree', name: 'Tree', category: 'Travel', keywords: ['nature', 'eco', 'environment'],
    viewBox: '0 0 24 24',
    svg: '<path d="M17 14l3-3-7-7-7 7 3 3-3 3h6v4h2v-4h6z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  },
  {
    id: 'mountain', name: 'Mountain', category: 'Travel', keywords: ['mountain', 'peak', 'adventure'],
    viewBox: '0 0 24 24',
    svg: '<path d="M3 20l6-10 4 5 3-4 5 9z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M13 10l2-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'car', name: 'Car', category: 'Travel', keywords: ['car', 'vehicle', 'transport', 'auto'],
    viewBox: '0 0 24 24',
    svg: '<path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1.5"/><rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><circle cx="7.5" cy="21" r="1" fill="currentColor"/><circle cx="16.5" cy="21" r="1" fill="currentColor"/><path d="M5 11l2-4h10l2 4" stroke="currentColor" stroke-width="1.5" fill="none"/>',
  },

  // ──────────────────────────────────────────────
  //  FOOD & BEVERAGE (extended)
  // ──────────────────────────────────────────────
  {
    id: 'burger', name: 'Burger', category: 'Food', keywords: ['burger', 'fast-food', 'restaurant'],
    viewBox: '0 0 24 24',
    svg: '<path d="M4 9h16M4 15h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M3 12h18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M5 6c0-1.1 3.1-2 7-2s7 .9 7 2" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><rect x="3" y="15" width="18" height="3" rx="1.5" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'ice-cream', name: 'Ice Cream', category: 'Food', keywords: ['dessert', 'sweet', 'cold'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 22l-4-10h8z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="12" cy="9" r="5" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'tea', name: 'Tea Cup', category: 'Food', keywords: ['tea', 'drink', 'hot'],
    viewBox: '0 0 24 24',
    svg: '<path d="M4 10h12a0 0 0 010 0l-1.5 7A2 2 0 0112.5 19h-5A2 2 0 015.5 17L4 10z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M16 11h2a2 2 0 010 4h-2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 7c0-2 1-3 1-3M11 6c0-2 1-3 1-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'sushi', name: 'Sushi', category: 'Food', keywords: ['sushi', 'japanese', 'food'],
    viewBox: '0 0 24 24',
    svg: '<ellipse cx="12" cy="13" rx="9" ry="5" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><ellipse cx="12" cy="11" rx="9" ry="5" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><ellipse cx="12" cy="11" rx="5" ry="3" fill="currentColor" opacity="0.5"/>',
  },
  {
    id: 'bread', name: 'Bread', category: 'Food', keywords: ['bakery', 'bread', 'food'],
    viewBox: '0 0 24 24',
    svg: '<path d="M6 13v7h12v-7" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M4 10a4 4 0 014-4h8a4 4 0 014 4v3H4z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'bottle', name: 'Bottle', category: 'Food', keywords: ['bottle', 'drink', 'beverage'],
    viewBox: '0 0 24 24',
    svg: '<path d="M9 2h6v3l2 3v12a2 2 0 01-2 2H9a2 2 0 01-2-2V8l2-3V2z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M7 11h10" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'salad', name: 'Salad Bowl', category: 'Food', keywords: ['salad', 'healthy', 'vegan'],
    viewBox: '0 0 24 24',
    svg: '<path d="M3 11a9 9 0 0018 0H3z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><path d="M7 11c1-3 3-5 5-5s4 2 5 5" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M5 20h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },

  // ──────────────────────────────────────────────
  //  BUSINESS & FINANCE (extended)
  // ──────────────────────────────────────────────
  {
    id: 'credit-card', name: 'Credit Card', category: 'Business', keywords: ['payment', 'finance', 'card'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="5" width="20" height="14" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M2 10h20" stroke="currentColor" stroke-width="2"/><path d="M6 15h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'coins', name: 'Coins', category: 'Business', keywords: ['money', 'finance', 'coins'],
    viewBox: '0 0 24 24',
    svg: '<ellipse cx="9" cy="7" rx="7" ry="3" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M2 7v4c0 1.66 3.13 3 7 3s7-1.34 7-3V7" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M2 11v4c0 1.66 3.13 3 7 3" stroke="currentColor" stroke-width="1.5" fill="none"/><ellipse cx="17" cy="15" rx="5" ry="2" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><path d="M12 15v4c0 1.1 2.24 2 5 2s5-.9 5-2v-4" stroke="currentColor" stroke-width="1.5" fill="none"/>',
  },
  {
    id: 'invoice', name: 'Invoice', category: 'Business', keywords: ['invoice', 'receipt', 'billing'],
    viewBox: '0 0 24 24',
    svg: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M14 2v6h6M8 13h8M8 17h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'growth', name: 'Growth Arrow', category: 'Business', keywords: ['growth', 'increase', 'profit'],
    viewBox: '0 0 24 24',
    svg: '<path d="M3 20l5-7 4 3 5-6 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M17 6h4v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  },
  {
    id: 'handshake2', name: 'Deal', category: 'Business', keywords: ['deal', 'partnership', 'agreement'],
    viewBox: '0 0 24 24',
    svg: '<path d="M20 7l-4-4-7 7-3-3-4 4 3 3-4 4 7 7 4-4 3 3 4-4-3-3z" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  },
  {
    id: 'folder', name: 'Folder', category: 'Business', keywords: ['folder', 'files', 'documents'],
    viewBox: '0 0 24 24',
    svg: '<path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'wallet', name: 'Wallet', category: 'Business', keywords: ['wallet', 'money', 'finance'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="6" width="20" height="14" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M16 13a1 1 0 100-2 1 1 0 000 2z" fill="currentColor"/><path d="M22 10V7a2 2 0 00-2-2H4a2 2 0 00-2 2v3" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'store', name: 'Store', category: 'Business', keywords: ['shop', 'store', 'retail'],
    viewBox: '0 0 24 24',
    svg: '<path d="M4 6l1.5-3h13L20 6" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/><rect x="2" y="6" width="20" height="3" fill="currentColor" opacity="0.3"/><path d="M2 9v12h20V9" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="9" y="13" width="6" height="8" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'tag', name: 'Price Tag', category: 'Business', keywords: ['price', 'tag', 'label'],
    viewBox: '0 0 24 24',
    svg: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><circle cx="7" cy="7" r="1.5" fill="currentColor"/>',
  },

  // ──────────────────────────────────────────────
  //  TECHNOLOGY (extended)
  // ──────────────────────────────────────────────
  {
    id: 'server', name: 'Server', category: 'Technology', keywords: ['server', 'hosting', 'backend'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="3" width="20" height="5" rx="2" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><rect x="2" y="10" width="20" height="5" rx="2" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><rect x="2" y="17" width="20" height="4" rx="2" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><circle cx="6" cy="5.5" r="1" fill="currentColor"/><circle cx="6" cy="12.5" r="1" fill="currentColor"/>',
  },
  {
    id: 'router', name: 'Router / WiFi', category: 'Technology', keywords: ['network', 'router', 'internet'],
    viewBox: '0 0 24 24',
    svg: '<rect x="3" y="15" width="18" height="6" rx="2" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M6 15V9M12 15V6M18 15V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="6" cy="18" r="1" fill="currentColor"/><circle cx="12" cy="18" r="1" fill="currentColor"/><circle cx="18" cy="18" r="1" fill="currentColor"/>',
  },
  {
    id: 'bug', name: 'Bug', category: 'Technology', keywords: ['bug', 'debug', 'error'],
    viewBox: '0 0 24 24',
    svg: '<path d="M8 6a4 4 0 018 0v8a4 4 0 01-8 0V6z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M4 10h3M17 10h3M4 14h3M17 14h3M9 4l-3-2M15 4l3-2M8 18l-2 3M16 18l2 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'api', name: 'API', category: 'Technology', keywords: ['api', 'integration', 'developer'],
    viewBox: '0 0 24 24',
    svg: '<path d="M4 9h2l2-5 2 12 2-9 2 6 1-4h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><rect x="1" y="5" width="22" height="14" rx="3" fill="currentColor" opacity="0.08" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'blockchain', name: 'Blockchain', category: 'Technology', keywords: ['blockchain', 'crypto', 'web3'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="3" width="6" height="6" rx="1" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><rect x="16" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="15" width="6" height="6" rx="1" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><path d="M8 12h1M15 12h1M12 9v-1M12 15v1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'ai-brain', name: 'AI Brain', category: 'Technology', keywords: ['ai', 'machine-learning', 'neural'],
    viewBox: '0 0 24 24',
    svg: '<path d="M9 3a6 6 0 110 12H9V3z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M15 9a6 6 0 110 12h-6V9" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><circle cx="9" cy="8" r="1.5" fill="currentColor"/><circle cx="15" cy="14" r="1.5" fill="currentColor"/>',
  },
  {
    id: 'qr-code', name: 'QR Code', category: 'Technology', keywords: ['qr', 'scan', 'code'],
    viewBox: '0 0 24 24',
    svg: '<rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><rect x="5" y="5" width="3" height="3" fill="currentColor"/><rect x="16" y="5" width="3" height="3" fill="currentColor"/><rect x="5" y="16" width="3" height="3" fill="currentColor"/><path d="M14 14h3v3M17 17h3M14 20h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'vr-headset', name: 'VR Headset', category: 'Technology', keywords: ['vr', 'virtual reality', 'metaverse'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="7" width="20" height="12" rx="4" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><circle cx="8.5" cy="13" r="2.5" fill="currentColor" opacity="0.4"/><circle cx="15.5" cy="13" r="2.5" fill="currentColor" opacity="0.4"/><path d="M11 13h2" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'drone', name: 'Drone', category: 'Technology', keywords: ['drone', 'uav', 'tech'],
    viewBox: '0 0 24 24',
    svg: '<rect x="8" y="8" width="8" height="8" rx="2" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M4 4a2 2 0 014 0M16 4a2 2 0 014 0M4 20a2 2 0 014 0M16 20a2 2 0 014 0" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 8L6 6M16 8l2-2M8 16l-2 2M16 16l2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'satellite-dish', name: 'Satellite Dish', category: 'Technology', keywords: ['satellite', 'signal', 'broadcast'],
    viewBox: '0 0 24 24',
    svg: '<path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M7.8 16.2C5.3 13.7 5.3 9.7 7.8 7.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M12 14l4 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M16.2 7.8c2.5 2.5 2.5 6.5 0 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>',
  },

  // ──────────────────────────────────────────────
  //  HEALTH & MEDICAL (extended)
  // ──────────────────────────────────────────────
  {
    id: 'pill', name: 'Pill', category: 'Health', keywords: ['medicine', 'pill', 'drug'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="9" width="20" height="6" rx="3" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" transform="rotate(-45 12 12)"/><path d="M8.5 8.5l7 7" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'hospital', name: 'Hospital', category: 'Health', keywords: ['hospital', 'medical', 'clinic'],
    viewBox: '0 0 24 24',
    svg: '<rect x="3" y="5" width="18" height="17" rx="1" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M3 9h18" stroke="currentColor" stroke-width="1.5"/><path d="M9 9v13M15 9v13" stroke="currentColor" stroke-width="1.5"/><path d="M10 2h4v3h-4z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><path d="M10 14h4M12 12v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'dna', name: 'DNA', category: 'Health', keywords: ['dna', 'genetics', 'biology'],
    viewBox: '0 0 24 24',
    svg: '<path d="M5 3c1.5 4 6 5 6 9s-4.5 5-6 9M19 3c-1.5 4-6 5-6 9s4.5 5 6 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M7 7h10M7 17h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'ambulance', name: 'Ambulance', category: 'Health', keywords: ['ambulance', 'emergency', 'medical'],
    viewBox: '0 0 24 24',
    svg: '<rect x="1" y="8" width="15" height="11" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M16 12l5 2v5h-5V12z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><circle cx="5.5" cy="19" r="1.5" fill="currentColor" opacity="0.8"/><circle cx="18.5" cy="19" r="1.5" fill="currentColor" opacity="0.8"/><path d="M6 13h4M8 11v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'yoga', name: 'Yoga', category: 'Health', keywords: ['yoga', 'wellness', 'meditation'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="4" r="2" fill="currentColor"/><path d="M12 6v5M9 11l-4 3M15 11l4 3M7 14l-2 5M17 14l2 5M9 11l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  },

  // ──────────────────────────────────────────────
  //  SPORTS & FITNESS (extended)
  // ──────────────────────────────────────────────
  {
    id: 'basketball', name: 'Basketball', category: 'Sports', keywords: ['basketball', 'sport', 'ball'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M12 2v20M2 12h20M5.6 5.6c1.8 1.8 2.8 4.2 2.8 6.4s-1 4.6-2.8 6.4M18.4 5.6c-1.8 1.8-2.8 4.2-2.8 6.4s1 4.6 2.8 6.4" stroke="currentColor" stroke-width="1.5" fill="none"/>',
  },
  {
    id: 'tennis', name: 'Tennis', category: 'Sports', keywords: ['tennis', 'sport', 'ball'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M5.6 5.6c1.8 4.7 1.8 8.2 0 12.8M18.4 5.6c-1.8 4.7-1.8 8.2 0 12.8" stroke="currentColor" stroke-width="1.5" fill="none"/>',
  },
  {
    id: 'cycling', name: 'Cycling', category: 'Sports', keywords: ['bike', 'cycling', 'bicycle'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="6" cy="16" r="4" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="16" r="4" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M6 16l4-8h4l2 8M14 8l2-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="16" cy="5" r="1.5" fill="currentColor"/>',
  },
  {
    id: 'swimming', name: 'Swimming', category: 'Sports', keywords: ['swim', 'pool', 'water'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="17" cy="5" r="2" fill="currentColor"/><path d="M7 9l5 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M2 16c1 0 2-1 3-1s2 1 3 1 2-1 3-1 2 1 3 1 2-1 3-1 2 1 3 1M2 20c1 0 2-1 3-1s2 1 3 1 2-1 3-1 2 1 3 1 2-1 3-1 2 1 3 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'boxing', name: 'Boxing Glove', category: 'Sports', keywords: ['boxing', 'fight', 'martial arts'],
    viewBox: '0 0 24 24',
    svg: '<rect x="5" y="4" width="10" height="13" rx="4" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M15 8h3a2 2 0 010 4h-3" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="5" y="17" width="10" height="3" rx="1.5" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'hiking', name: 'Hiking', category: 'Sports', keywords: ['hiking', 'trekking', 'outdoor'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="4" r="2" fill="currentColor"/><path d="M10 8l-3 7 3 2-2 5M14 8l3 7-3 2 2 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M12 6v6M5 12h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },

  // ──────────────────────────────────────────────
  //  EDUCATION (extended)
  // ──────────────────────────────────────────────
  {
    id: 'pencil-ruler', name: 'Pencil & Ruler', category: 'Education', keywords: ['design', 'draw', 'measure'],
    viewBox: '0 0 24 24',
    svg: '<path d="M3 21l4-4 12-12-4-4L3 13v8zM15 3l4 4" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/><path d="M18 21h3M18 17h3M18 13h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'microscope', name: 'Microscope', category: 'Education', keywords: ['science', 'lab', 'research'],
    viewBox: '0 0 24 24',
    svg: '<path d="M10 2l3 3-6 6-3-3 6-6z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 11l-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="15" cy="16" r="5" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M3 22h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'certificate', name: 'Certificate', category: 'Education', keywords: ['certificate', 'award', 'diploma'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="3" width="20" height="14" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><circle cx="16" cy="19" r="3" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><path d="M14 21l-2 1-2-1v-3h4v3z" fill="currentColor" opacity="0.5"/><path d="M6 8h8M6 12h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'telescope', name: 'Telescope', category: 'Education', keywords: ['astronomy', 'space', 'science'],
    viewBox: '0 0 24 24',
    svg: '<path d="M3 8l3-5 14 8-3 5-14-8z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 11l-3 9M14 13l3 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M7 20h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'calculator', name: 'Calculator', category: 'Education', keywords: ['calculator', 'math', 'numbers'],
    viewBox: '0 0 24 24',
    svg: '<rect x="4" y="2" width="16" height="20" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><rect x="6" y="4" width="12" height="5" rx="1" fill="currentColor" opacity="0.3"/><circle cx="8" cy="13" r="1.2" fill="currentColor"/><circle cx="12" cy="13" r="1.2" fill="currentColor"/><circle cx="16" cy="13" r="1.2" fill="currentColor"/><circle cx="8" cy="17" r="1.2" fill="currentColor"/><circle cx="12" cy="17" r="1.2" fill="currentColor"/><circle cx="16" cy="17" r="1.2" fill="currentColor"/>',
  },

  // ──────────────────────────────────────────────
  //  CREATIVE & DESIGN (extended)
  // ──────────────────────────────────────────────
  {
    id: 'paint-brush', name: 'Paint Brush', category: 'Creative', keywords: ['art', 'paint', 'design'],
    viewBox: '0 0 24 24',
    svg: '<path d="M3 21a4 4 0 010-5.66l11-11 5.66 5.66-11 11A4 4 0 013 21z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M14 4l6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'palette', name: 'Color Palette', category: 'Creative', keywords: ['color', 'art', 'design'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 2a10 10 0 100 20 4 4 0 004-4c0-1.1-.9-2-2-2H13a2 2 0 01-2-2 2 2 0 012-2h1" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><circle cx="6.5" cy="11.5" r="1.5" fill="currentColor"/><circle cx="8" cy="7" r="1.5" fill="currentColor"/><circle cx="12" cy="5.5" r="1.5" fill="currentColor"/><circle cx="16" cy="7" r="1.5" fill="currentColor"/>',
  },
  {
    id: '3d-cube', name: '3D Cube', category: 'Creative', keywords: ['3d', 'cube', 'design'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M2 7v10l10 5V12L2 7z" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M22 7v10l-10 5V12l10-5z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  },
  {
    id: 'vector', name: 'Vector Pen', category: 'Creative', keywords: ['vector', 'path', 'design'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 19l7-7-5-5-7 7 5 5z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M5 12l4 4M19 5l-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="5" cy="19" r="2" fill="currentColor" opacity="0.4"/><circle cx="19" cy="5" r="2" fill="currentColor" opacity="0.4"/>',
  },
  {
    id: 'animation', name: 'Animation', category: 'Creative', keywords: ['animation', 'motion', 'video'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="3" fill="currentColor"/><circle cx="5" cy="12" r="2" fill="currentColor" opacity="0.4"/><circle cx="19" cy="12" r="2" fill="currentColor" opacity="0.4"/><circle cx="8.5" cy="5.5" r="1.5" fill="currentColor" opacity="0.3"/><circle cx="15.5" cy="5.5" r="1.5" fill="currentColor" opacity="0.3"/><circle cx="8.5" cy="18.5" r="1.5" fill="currentColor" opacity="0.3"/><circle cx="15.5" cy="18.5" r="1.5" fill="currentColor" opacity="0.3"/>',
  },

  // ──────────────────────────────────────────────
  //  COMMUNICATION
  // ──────────────────────────────────────────────
  {
    id: 'email', name: 'Email', category: 'Communication', keywords: ['email', 'mail', 'message'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="4" width="20" height="16" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M2 7l10 7 10-7" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/>',
  },
  {
    id: 'chat-bubble', name: 'Chat Bubble', category: 'Communication', keywords: ['chat', 'message', 'talk'],
    viewBox: '0 0 24 24',
    svg: '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  },
  {
    id: 'phone', name: 'Phone', category: 'Communication', keywords: ['phone', 'call', 'contact'],
    viewBox: '0 0 24 24',
    svg: '<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  },
  {
    id: 'notification-bell', name: 'Notification Bell', category: 'Communication', keywords: ['bell', 'notification', 'alert'],
    viewBox: '0 0 24 24',
    svg: '<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M6 8a6 6 0 016-6v0a6 6 0 016 6c0 7 3 9 3 9H3s3-2 3-9z" fill="currentColor" opacity="0.15"/>',
  },
  {
    id: 'video-call', name: 'Video Call', category: 'Communication', keywords: ['video', 'call', 'conference'],
    viewBox: '0 0 24 24',
    svg: '<path d="M23 7l-7 5 7 5V7z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><rect x="1" y="5" width="15" height="14" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'broadcast', name: 'Broadcast', category: 'Communication', keywords: ['broadcast', 'radio', 'signal'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 12m-2 0a2 2 0 104 0 2 2 0 00-4 0" fill="currentColor"/><path d="M4.9 19.1a10 10 0 010-14.14M19.1 4.96a10 10 0 010 14.14M7.76 16.24a6 6 0 010-8.49M16.24 7.76a6 6 0 010 8.49" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>',
  },

  // ──────────────────────────────────────────────
  //  FASHION & BEAUTY (extended)
  // ──────────────────────────────────────────────
  {
    id: 'lipstick', name: 'Lipstick', category: 'Beauty', keywords: ['lipstick', 'makeup', 'beauty'],
    viewBox: '0 0 24 24',
    svg: '<rect x="9" y="13" width="6" height="9" rx="1" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M9 13V8l3-5 3 5v5H9z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  },
  {
    id: 'handbag', name: 'Handbag', category: 'Beauty', keywords: ['bag', 'fashion', 'accessories'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="8" width="20" height="13" rx="2" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M9 8V6a3 3 0 016 0v2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 14h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'perfume', name: 'Perfume', category: 'Beauty', keywords: ['perfume', 'fragrance', 'beauty'],
    viewBox: '0 0 24 24',
    svg: '<rect x="5" y="9" width="14" height="13" rx="2" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="5" width="6" height="4" rx="1" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><path d="M12 2v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M8 15c1-1 2-1 4 0s3 1 4 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>',
  },
  {
    id: 'scissors2', name: 'Scissors', category: 'Beauty', keywords: ['scissors', 'cut', 'barber'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="6" cy="6" r="3" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><circle cx="6" cy="18" r="3" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'shirt', name: 'T-Shirt', category: 'Beauty', keywords: ['shirt', 'clothing', 'fashion'],
    viewBox: '0 0 24 24',
    svg: '<path d="M20 7l-4-5H8L4 7l4 2v12h8V9l4-2z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  },

  // ──────────────────────────────────────────────
  //  WEATHER
  // ──────────────────────────────────────────────
  {
    id: 'sun', name: 'Sun', category: 'Weather', keywords: ['sun', 'sunny', 'weather'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="5" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'rain', name: 'Rain', category: 'Weather', keywords: ['rain', 'weather', 'storm'],
    viewBox: '0 0 24 24',
    svg: '<path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M8 19v2M8 13v2M16 19v2M16 13v2M12 21v2M12 15v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'snow', name: 'Snow', category: 'Weather', keywords: ['snow', 'winter', 'cold'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="12" r="2" fill="currentColor"/>',
  },
  {
    id: 'thunder', name: 'Thunder', category: 'Weather', keywords: ['thunder', 'lightning', 'storm'],
    viewBox: '0 0 24 24',
    svg: '<path d="M19 16.9A5 5 0 0018 7h-1.26a8 8 0 10-11.62 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><polyline points="13 11 9 17 15 17 11 23" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  },
  {
    id: 'wind', name: 'Wind', category: 'Weather', keywords: ['wind', 'breeze', 'air'],
    viewBox: '0 0 24 24',
    svg: '<path d="M9.59 4.59A2 2 0 1111 8H2M12.59 19.41A2 2 0 1014 16H2M17.73 7.73A2.5 2.5 0 1119.5 12H2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>',
  },
  {
    id: 'rainbow', name: 'Rainbow', category: 'Weather', keywords: ['rainbow', 'color', 'hope'],
    viewBox: '0 0 24 24',
    svg: '<path d="M22 17a10 10 0 00-20 0" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.2"/><path d="M22 17a10 10 0 00-20 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M18 17a6 6 0 00-12 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.6"/><path d="M15 17a3 3 0 00-6 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.4"/>',
  },

  // ──────────────────────────────────────────────
  //  SHOPPING & E-COMMERCE
  // ──────────────────────────────────────────────
  {
    id: 'shopping-cart', name: 'Shopping Cart', category: 'Business', keywords: ['cart', 'shop', 'ecommerce'],
    viewBox: '0 0 24 24',
    svg: '<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="1.5"/><path d="M16 10a4 4 0 01-8 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>',
  },
  {
    id: 'gift', name: 'Gift', category: 'Business', keywords: ['gift', 'present', 'surprise'],
    viewBox: '0 0 24 24',
    svg: '<rect x="3" y="9" width="18" height="13" rx="1" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M3 13h18" stroke="currentColor" stroke-width="1.5"/><path d="M12 9V22M12 9c0-2 2-5 4-5s2 3 0 5h-4zM12 9c0-2-2-5-4-5s-2 3 0 5h4z" stroke="currentColor" stroke-width="1.5" fill="none"/>',
  },
  {
    id: 'barcode', name: 'Barcode', category: 'Business', keywords: ['barcode', 'scan', 'product'],
    viewBox: '0 0 24 24',
    svg: '<path d="M3 5v14M6 5v14M10 5v14M14 5v14M17 5v14M20 5v8M20 17v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><rect x="1" y="3" width="22" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>',
  },
  {
    id: 'box', name: 'Package Box', category: 'Business', keywords: ['box', 'package', 'delivery'],
    viewBox: '0 0 24 24',
    svg: '<path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'truck', name: 'Delivery Truck', category: 'Business', keywords: ['truck', 'delivery', 'shipping'],
    viewBox: '0 0 24 24',
    svg: '<rect x="1" y="3" width="15" height="13" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M16 8h4l3 5v5h-7V8z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="5.5" cy="18.5" r="2.5" fill="currentColor" opacity="0.8"/><circle cx="18.5" cy="18.5" r="2.5" fill="currentColor" opacity="0.8"/><path d="M3 16h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },

  // ──────────────────────────────────────────────
  //  MUSIC & ENTERTAINMENT
  // ──────────────────────────────────────────────
  {
    id: 'piano', name: 'Piano Keys', category: 'Creative', keywords: ['piano', 'music', 'keyboard'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="4" width="20" height="16" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M7 4v16M12 4v16M17 4v16" stroke="currentColor" stroke-width="1.5"/><rect x="4.5" y="4" width="2.5" height="10" rx="1" fill="currentColor" opacity="0.6"/><rect x="9" y="4" width="2.5" height="10" rx="1" fill="currentColor" opacity="0.6"/><rect x="14" y="4" width="2.5" height="10" rx="1" fill="currentColor" opacity="0.6"/><rect x="18.5" y="4" width="2.5" height="10" rx="1" fill="currentColor" opacity="0.6"/>',
  },
  {
    id: 'guitar', name: 'Guitar', category: 'Creative', keywords: ['guitar', 'music', 'band'],
    viewBox: '0 0 24 24',
    svg: '<path d="M11.7 7.3L20 15.6a2.83 2.83 0 01-4 4L7.7 11.3A4 4 0 114 4a4 4 0 013.7 7.3z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M20 3l-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/>',
  },
  {
    id: 'podcast', name: 'Podcast', category: 'Creative', keywords: ['podcast', 'audio', 'radio'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="11" r="5" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M7.75 22c.25-3 1.75-5 4.25-5s4 2 4.25 5M12 16v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M12 6v2M15.54 8.46l1.42-1.42M8.46 8.46L7.04 7.04" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'vinyl', name: 'Vinyl Record', category: 'Creative', keywords: ['music', 'vinyl', 'record'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="6" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1"/><circle cx="12" cy="12" r="2" fill="currentColor"/>',
  },
  {
    id: 'theater', name: 'Theater', category: 'Creative', keywords: ['theater', 'drama', 'arts'],
    viewBox: '0 0 24 24',
    svg: '<path d="M2 12c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 2 12 2 2 6.48 2 12z" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1.5"/><path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><line x1="9" y1="9" x2="9.01" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="15" y1="9" x2="15.01" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  },

  // ──────────────────────────────────────────────
  //  ANIMALS & NATURE
  // ──────────────────────────────────────────────
  {
    id: 'paw', name: 'Paw Print', category: 'Animals', keywords: ['pet', 'animal', 'dog', 'cat'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="9" cy="4" r="2" fill="currentColor" opacity="0.5"/><circle cx="15" cy="4" r="2" fill="currentColor" opacity="0.5"/><circle cx="4" cy="10" r="2" fill="currentColor" opacity="0.5"/><circle cx="20" cy="10" r="2" fill="currentColor" opacity="0.5"/><path d="M12 22c-3 0-7-4-7-7 0-2 1-3 3-3h8c2 0 3 1 3 3 0 3-4 7-7 7z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'fish', name: 'Fish', category: 'Animals', keywords: ['fish', 'seafood', 'ocean'],
    viewBox: '0 0 24 24',
    svg: '<path d="M18 11a8 8 0 01-8 8 8 8 0 010-16h0" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M20 4l-4 3 4 3-4 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="10" cy="11" r="1.5" fill="currentColor"/>',
  },
  {
    id: 'butterfly', name: 'Butterfly', category: 'Animals', keywords: ['butterfly', 'nature', 'spring'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 4c-1-3-8-4-9 2s4 9 9 8c5 1 10-2 9-8s-8-5-9-2z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M12 4v16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'bird', name: 'Bird', category: 'Animals', keywords: ['bird', 'nature', 'wildlife'],
    viewBox: '0 0 24 24',
    svg: '<path d="M23 7c-2 1-3.5 1-5 0-2-1-4-3-7-3-4 0-8 3-8 8 0 4 3 7 7 7h3c6 0 9-4 9-9 0-1 0-2-1-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M3 14c0 0 2-1 3 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'flower', name: 'Flower', category: 'Animals', keywords: ['flower', 'nature', 'bloom'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.5"/><circle cx="12" cy="6" r="3" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1"/><circle cx="12" cy="18" r="3" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1"/><circle cx="6" cy="12" r="3" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1"/><circle cx="18" cy="12" r="3" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1"/>',
  },

  // ──────────────────────────────────────────────
  //  ABSTRACT & GEOMETRIC (extended)
  // ──────────────────────────────────────────────
  {
    id: 'triangle', name: 'Triangle', category: 'Abstract', keywords: ['triangle', 'shape', 'geometric'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 2L2 20h20L12 2z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  },
  {
    id: 'octagon', name: 'Octagon', category: 'Abstract', keywords: ['octagon', 'stop', 'shape'],
    viewBox: '0 0 24 24',
    svg: '<polygon points="7.86,2 16.14,2 22,7.86 22,16.14 16.14,22 7.86,22 2,16.14 2,7.86" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'yin-yang', name: 'Yin Yang', category: 'Abstract', keywords: ['yin-yang', 'balance', 'harmony'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1.5"/><path d="M12 2a10 10 0 010 20A5 5 0 0112 12a5 5 0 000-10z" fill="currentColor" opacity="0.4"/><circle cx="12" cy="7" r="1.5" fill="white"/><circle cx="12" cy="17" r="1.5" fill="currentColor"/>',
  },
  {
    id: 'mandala', name: 'Mandala', category: 'Abstract', keywords: ['mandala', 'pattern', 'spiritual'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.08" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="6" fill="currentColor" opacity="0.08" stroke="currentColor" stroke-width="1"/><circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.2"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5.64 5.64l2.83 2.83M15.54 15.54l2.83 2.83M18.36 5.64l-2.83 2.83M8.46 15.54l-2.83 2.83" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'vortex', name: 'Vortex', category: 'Abstract', keywords: ['vortex', 'spiral', 'swirl'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 12c0-3 3-6 6-4s4 6 1 9-8 4-11 1-3-8 1-11 9-3 11 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><circle cx="12" cy="12" r="2" fill="currentColor"/>',
  },
  {
    id: 'cross', name: 'Cross', category: 'Abstract', keywords: ['cross', 'plus', 'add'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 2v20M2 12h20" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
  },

  // ──────────────────────────────────────────────
  //  LEGAL & SECURITY (extended)
  // ──────────────────────────────────────────────
  {
    id: 'fingerprint', name: 'Fingerprint', category: 'Business', keywords: ['security', 'biometric', 'identity'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 10a2 2 0 00-2 2c0 1.02-.1 2.51-.26 4M14 13.12c0 2.38.05 4.23.09 4.88M14 10a2 2 0 012 2M12 8a4 4 0 014 4M12 8a4 4 0 00-4 4c0 1.5-.08 3.42-.22 5.5M11.64 21.98c.26-1.97.62-5.07.73-6.98M15.97 19.5A21 21 0 0016 16M12 6a6 6 0 016 6c0 1.23-.08 2.53-.21 3.88M6 12a6 6 0 016-6M3 12a9 9 0 019-9M6.5 19.5A22 22 0 016 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>',
  },
  {
    id: 'vpn', name: 'VPN Shield', category: 'Business', keywords: ['vpn', 'security', 'privacy'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 2l9 4v5c0 5-4 9.5-9 11C7 20.5 3 16 3 11V6l9-4z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M12 9v-4M12 15v4M9 12H5M15 12h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },

  // ──────────────────────────────────────────────
  //  MORE SOCIAL MEDIA BRANDS
  // ──────────────────────────────────────────────
  {
    id: 'threads', name: 'Threads', category: 'Social Media', keywords: ['threads', 'meta', 'social'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 2C7 2 4 5.5 4 10c0 2.5 1 4.5 3 6-1 .8-2 2-2 4 0 2.2 1.8 2 3 2 2 0 3.5-1 4-2.5.5 1.5 2 2.5 4 2.5 1.2 0 3 .2 3-2 0-2-1-3.2-2-4 2-1.5 3-3.5 3-6 0-4.5-3-8-8-8z" stroke="currentColor" stroke-width="1.5" fill="none"/>',
  },
  {
    id: 'mastodon', name: 'Mastodon', category: 'Social Media', keywords: ['mastodon', 'social', 'fediverse'],
    viewBox: '0 0 24 24',
    svg: '<path d="M20.9 8.8C20.5 5.5 17.6 3 14.1 2.5 13.5 2.4 11.5 2 7.5 2h0C3.5 2 2.5 2.9 2 3.5c-.3.4-.5 1-.6 1.6-.1.7-.1 1.5-.1 2.4 0 3.1 0 7.2 2.5 9.6 1 1 2.4 1.6 3.9 2 .7.2 1.5.3 2.3.3s1.5-.1 2.3-.3c1.5-.4 2.9-1 3.9-2C18.7 15.7 21 12.3 21 8.5c0-.4 0-.7-.1-1.7" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M7 16v-5a3 3 0 013-3 3 3 0 013 3v5M17 13v-2a3 3 0 00-3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>',
  },
  {
    id: 'twitch2', name: 'Live Stream', category: 'Social Media', keywords: ['live', 'stream', 'gaming'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.3"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><path d="M16 8l4-4M8 8L4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },

  // ──────────────────────────────────────────────
  //  CONSTRUCTION & REAL ESTATE
  // ──────────────────────────────────────────────
  {
    id: 'house', name: 'House', category: 'Construction', keywords: ['house', 'home', 'real-estate'],
    viewBox: '0 0 24 24',
    svg: '<path d="M3 9.5L12 2l9 7.5V20a2 2 0 01-2 2H5a2 2 0 01-2-2V9.5z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><rect x="9" y="13" width="6" height="9" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'crane', name: 'Crane', category: 'Construction', keywords: ['crane', 'construction', 'build'],
    viewBox: '0 0 24 24',
    svg: '<path d="M2 20h20M6 20V4M6 4h14M6 4l8 8M18 8v4M18 4v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M16 18v2M12 18v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'blueprint', name: 'Blueprint', category: 'Construction', keywords: ['blueprint', 'plan', 'architecture'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="2" width="20" height="20" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M7 7h10M7 12h6M7 17h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M15 12v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'wrench', name: 'Wrench', category: 'Construction', keywords: ['wrench', 'repair', 'fix'],
    viewBox: '0 0 24 24',
    svg: '<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    id: 'ruler', name: 'Ruler', category: 'Construction', keywords: ['ruler', 'measure', 'design'],
    viewBox: '0 0 24 24',
    svg: '<path d="M5 3L3 5l16 16 2-2L5 3z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 7l-2 2M13 11l-2 2M17 15l-2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },

  // ──────────────────────────────────────────────
  //  MISC / UTILITY
  // ──────────────────────────────────────────────
  {
    id: 'clock', name: 'Clock', category: 'Business', keywords: ['clock', 'time', 'schedule'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M12 6v6l4 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  },
  {
    id: 'flag', name: 'Flag', category: 'Business', keywords: ['flag', 'goal', 'milestone'],
    viewBox: '0 0 24 24',
    svg: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M4 22V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'map', name: 'Map', category: 'Travel', keywords: ['map', 'navigate', 'location'],
    viewBox: '0 0 24 24',
    svg: '<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 3v15M15 6v15" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'anchor', name: 'Anchor', category: 'Travel', keywords: ['anchor', 'maritime', 'navy'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="6" r="3" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M12 9v13M5 12H3a9 9 0 0018 0h-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>',
  },
  {
    id: 'compass2', name: 'Compass Rose', category: 'Travel', keywords: ['compass', 'direction', 'navigate'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.08" stroke="currentColor" stroke-width="1.5"/><polygon points="12 2 14 10 12 12 10 10" fill="currentColor" opacity="0.6"/><polygon points="22 12 14 14 12 12 14 10" fill="currentColor" opacity="0.3"/><polygon points="12 22 10 14 12 12 14 14" fill="currentColor" opacity="0.4"/><polygon points="2 12 10 10 12 12 10 14" fill="currentColor" opacity="0.2"/>',
  },
  {
    id: 'hourglass', name: 'Hourglass', category: 'Business', keywords: ['time', 'hourglass', 'wait'],
    viewBox: '0 0 24 24',
    svg: '<path d="M5 2h14M5 22h14M7 2v5l5 5-5 5v5M17 2v5l-5 5 5 5v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M7 7h10M7 17h10" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>',
  },
  {
    id: 'puzzle', name: 'Puzzle Piece', category: 'Abstract', keywords: ['puzzle', 'solution', 'game'],
    viewBox: '0 0 24 24',
    svg: '<path d="M4 4h6v2a2 2 0 004 0V4h6v6h-2a2 2 0 000 4h2v6h-6v-2a2 2 0 00-4 0v2H4v-6h2a2 2 0 000-4H4V4z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  },
  {
    id: 'light-switch', name: 'Power Button', category: 'Technology', keywords: ['power', 'on-off', 'switch'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 2v8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M7.76 4.24a10 10 0 100 15.52" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.3"/>',
  },
  {
    id: 'printer', name: 'Printer', category: 'Business', keywords: ['print', 'office', 'document'],
    viewBox: '0 0 24 24',
    svg: '<rect x="6" y="16" width="12" height="6" rx="1" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M6 16v-5H4a2 2 0 00-2 2v5h4zM18 16v-5h2a2 2 0 012 2v5h-4z" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><rect x="6" y="2" width="12" height="9" rx="1" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M9 19h6M9 21h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'magnify', name: 'Magnify', category: 'Business', keywords: ['search', 'find', 'zoom'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="11" cy="11" r="8" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  },
  {
    id: 'user-group', name: 'Team', category: 'Business', keywords: ['team', 'group', 'people'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="9" cy="7" r="4" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M2 21v-2a4 4 0 014-4h6a4 4 0 014 4v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><circle cx="18" cy="8" r="3" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M22 21v-2a3 3 0 00-2-2.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>',
  },
  {
    id: 'network', name: 'Network', category: 'Technology', keywords: ['network', 'connect', 'graph'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="5" r="3" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><circle cx="5" cy="19" r="3" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><circle cx="19" cy="19" r="3" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v3l-5 5M12 8v3l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'moon', name: 'Moon', category: 'Abstract', keywords: ['moon', 'night', 'dark-mode'],
    viewBox: '0 0 24 24',
    svg: '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    id: 'planet', name: 'Planet', category: 'Abstract', keywords: ['planet', 'space', 'orbit'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="6" fill="currentColor" opacity="0.25" stroke="currentColor" stroke-width="1.5"/><path d="M4.22 4.22C2 6.45 2 12 4.22 17.78S9.55 22 12 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.3" fill="none"/><ellipse cx="12" cy="12" rx="12" ry="4" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>',
  },
  {
    id: 'recycle', name: 'Recycle', category: 'Abstract', keywords: ['recycle', 'eco', 'green'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 2l3 5h-2v3l4 7H7l4-7V7H9L12 2z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M5 16l-3 4h5M19 16l3 4h-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  },
  {
    id: 'filter', name: 'Filter', category: 'Business', keywords: ['filter', 'sort', 'organize'],
    viewBox: '0 0 24 24',
    svg: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    id: 'bookmark', name: 'Bookmark', category: 'Business', keywords: ['bookmark', 'save', 'favorite'],
    viewBox: '0 0 24 24',
    svg: '<path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    id: 'link', name: 'Link Chain', category: 'Technology', keywords: ['link', 'url', 'connect'],
    viewBox: '0 0 24 24',
    svg: '<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>',
  },
  {
    id: 'share', name: 'Share', category: 'Technology', keywords: ['share', 'distribute', 'social'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="18" cy="5" r="3" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><circle cx="6" cy="12" r="3" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="19" r="3" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },

  // ──────────────────────────────────────────────
  //  MORE ICONS – BATCH 3 (reaching 300+)
  // ──────────────────────────────────────────────

  // Finance & Crypto
  {
    id: 'bitcoin', name: 'Bitcoin', category: 'Business', keywords: ['bitcoin', 'crypto', 'currency'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1.5"/><path d="M9 8h4a2 2 0 010 4 2 2 0 010 4H9V8zM9 12h5M11 8v-1.5M13 8v-1.5M11 16v1.5M13 16v1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>',
  },
  {
    id: 'ethereum', name: 'Ethereum', category: 'Business', keywords: ['ethereum', 'crypto', 'blockchain'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 2L4 12l8 5 8-5L12 2z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M4 12l8 11 8-11" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  },
  {
    id: 'piggy-bank', name: 'Piggy Bank', category: 'Business', keywords: ['savings', 'bank', 'money'],
    viewBox: '0 0 24 24',
    svg: '<path d="M19 11c0-3.87-3.13-7-7-7H9C5.13 4 2 7.13 2 11v2c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5v-2h-3z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M22 11h-3M8 18v2M13 18v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="16" cy="10" r="1" fill="currentColor"/><path d="M9 8h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'stock-chart', name: 'Stock Chart', category: 'Business', keywords: ['stock', 'trading', 'finance'],
    viewBox: '0 0 24 24',
    svg: '<path d="M4 19V5M20 5v14M4 19h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M7 15l3-4 3 2 4-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  },

  // UI/UX & Design Tools
  {
    id: 'grid', name: 'Grid Layout', category: 'Creative', keywords: ['grid', 'layout', 'design'],
    viewBox: '0 0 24 24',
    svg: '<rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'cursor', name: 'Cursor', category: 'Creative', keywords: ['cursor', 'mouse', 'click'],
    viewBox: '0 0 24 24',
    svg: '<path d="M4 3l8 19 2.5-7.5L22 12 4 3z" fill="currentColor" opacity="0.25" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  },
  {
    id: 'crop', name: 'Crop', category: 'Creative', keywords: ['crop', 'trim', 'edit'],
    viewBox: '0 0 24 24',
    svg: '<path d="M6 2v14a2 2 0 002 2h14M18 22V8a2 2 0 00-2-2H2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>',
  },
  {
    id: 'wand', name: 'Magic Wand', category: 'Creative', keywords: ['magic', 'wand', 'effect'],
    viewBox: '0 0 24 24',
    svg: '<path d="M15 4l5 5-12 12-5-5L15 4z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 9l-1-1M16 16l1 1M9 16l-1 1M14 9l2-2M20 7l1 1M7 20l-1 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'eraser', name: 'Eraser', category: 'Creative', keywords: ['erase', 'delete', 'clean'],
    viewBox: '0 0 24 24',
    svg: '<path d="M20 20H7L3 16l12-12 8 8-3 8z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M6.5 17.5l5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'typography', name: 'Typography', category: 'Creative', keywords: ['font', 'text', 'typography'],
    viewBox: '0 0 24 24',
    svg: '<path d="M4 7h16M12 7v14M8 21h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  },

  // Science & Research
  {
    id: 'flask', name: 'Flask', category: 'Education', keywords: ['flask', 'chemistry', 'lab'],
    viewBox: '0 0 24 24',
    svg: '<path d="M9 3h6M9 3v8l-5 10h16L15 11V3" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.5 16h9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'magnet', name: 'Magnet', category: 'Education', keywords: ['magnet', 'attract', 'physics'],
    viewBox: '0 0 24 24',
    svg: '<path d="M6 15a6 6 0 006 6 6 6 0 006-6V5h-4v10a2 2 0 01-4 0V5H6v10z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M6 5H2M22 5h-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'planet-saturn', name: 'Saturn', category: 'Education', keywords: ['saturn', 'space', 'planet'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="5" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="11" ry="4" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>',
  },
  {
    id: 'chart-radar', name: 'Radar Chart', category: 'Business', keywords: ['radar', 'analytics', 'data'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 2l3 7h7l-5.5 4 2 7-6.5-4-6.5 4 2-7L2 9h7z" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><polygon points="12,5 14.5,11.5 20,11.5 15.5,15 17,21 12,17.5 7,21 8.5,15 4,11.5 9.5,11.5" fill="currentColor" opacity="0.1"/>',
  },

  // Real Estate & Architecture
  {
    id: 'apartment', name: 'Apartment', category: 'Construction', keywords: ['apartment', 'building', 'real-estate'],
    viewBox: '0 0 24 24',
    svg: '<rect x="3" y="3" width="18" height="19" rx="1" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M3 8h18M3 13h18" stroke="currentColor" stroke-width="1.5"/><rect x="7" y="15" width="3" height="7" fill="currentColor" opacity="0.3"/><rect x="14" y="15" width="3" height="7" fill="currentColor" opacity="0.3"/><rect x="7" y="10" width="2.5" height="2" fill="currentColor" opacity="0.4"/><rect x="14" y="10" width="2.5" height="2" fill="currentColor" opacity="0.4"/><rect x="7" y="5" width="2.5" height="2" fill="currentColor" opacity="0.4"/><rect x="14" y="5" width="2.5" height="2" fill="currentColor" opacity="0.4"/>',
  },
  {
    id: 'key2', name: 'Key', category: 'Construction', keywords: ['key', 'access', 'unlock'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="7.5" cy="10.5" r="5.5" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M13 10.5h9M18 10.5v3M21 10.5v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },

  // Fitness & Wellness
  {
    id: 'meditation', name: 'Meditation', category: 'Health', keywords: ['meditation', 'mindfulness', 'calm'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="5" r="2" fill="currentColor"/><path d="M6 21c0-4 2.5-6 6-6s6 2 6 6M3 14c0-2 1.5-3 3-3h12c1.5 0 3 1 3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M12 7v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'running', name: 'Running', category: 'Sports', keywords: ['run', 'jog', 'sprint'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="16" cy="4" r="2" fill="currentColor"/><path d="M10 18l2.5-5L16 16l3-4M5 10l4 2 3-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  },
  {
    id: 'weight-scale', name: 'Weight Scale', category: 'Health', keywords: ['scale', 'weight', 'fitness'],
    viewBox: '0 0 24 24',
    svg: '<ellipse cx="12" cy="6" rx="9" ry="3" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M3 6v12c0 1.66 4.03 3 9 3s9-1.34 9-3V6" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  },

  // Automotive
  {
    id: 'motorcycle', name: 'Motorcycle', category: 'Travel', keywords: ['motorcycle', 'bike', 'vehicle'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="5" cy="16" r="4" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><circle cx="19" cy="16" r="4" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M5 16h4l4-6h4l2 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M13 10l-2-4H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'bus', name: 'Bus', category: 'Travel', keywords: ['bus', 'public-transport', 'vehicle'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="4" width="20" height="14" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M2 9h20" stroke="currentColor" stroke-width="1.5"/><path d="M7 18v2M17 18v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="7" cy="14" r="1.5" fill="currentColor" opacity="0.5"/><circle cx="17" cy="14" r="1.5" fill="currentColor" opacity="0.5"/><path d="M7 4v5M12 4v5M17 4v5" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'train', name: 'Train', category: 'Travel', keywords: ['train', 'railway', 'transport'],
    viewBox: '0 0 24 24',
    svg: '<rect x="4" y="2" width="16" height="16" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M4 10h16" stroke="currentColor" stroke-width="1.5"/><circle cx="8.5" cy="15" r="1.5" fill="currentColor" opacity="0.5"/><circle cx="15.5" cy="15" r="1.5" fill="currentColor" opacity="0.5"/><path d="M4 18l-2 4M20 18l2 4M8 22h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'ship', name: 'Ship', category: 'Travel', keywords: ['ship', 'boat', 'cruise'],
    viewBox: '0 0 24 24',
    svg: '<path d="M2 20a2.4 2.4 0 003.5 0 2.4 2.4 0 013.5 0 2.4 2.4 0 003.5 0 2.4 2.4 0 013.5 0 2.4 2.4 0 003.5 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M5 20L3 11h18l-2 9" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M12 4v7M8 4h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },

  // Office & Productivity
  {
    id: 'clipboard', name: 'Clipboard', category: 'Business', keywords: ['clipboard', 'notes', 'list'],
    viewBox: '0 0 24 24',
    svg: '<rect x="8" y="2" width="8" height="4" rx="1" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1.5"/><path d="M8 11h8M8 15h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'inbox', name: 'Inbox', category: 'Business', keywords: ['inbox', 'mail', 'tray'],
    viewBox: '0 0 24 24',
    svg: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  },
  {
    id: 'presentation', name: 'Presentation', category: 'Business', keywords: ['presentation', 'slides', 'report'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="3" width="20" height="13" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M8 21l4-4 4 4M12 17V16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  },
  {
    id: 'task-done', name: 'Task Done', category: 'Business', keywords: ['task', 'done', 'checklist'],
    viewBox: '0 0 24 24',
    svg: '<rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M8 12l3 3 5-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  },
  {
    id: 'timeline', name: 'Timeline', category: 'Business', keywords: ['timeline', 'schedule', 'plan'],
    viewBox: '0 0 24 24',
    svg: '<path d="M3 12h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="6" cy="12" r="2.5" fill="currentColor" opacity="0.5" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.5" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="12" r="2.5" fill="currentColor" opacity="0.5" stroke="currentColor" stroke-width="1.5"/><path d="M6 9v-3M12 9v-3M18 9v-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },

  // Gaming
  {
    id: 'joystick', name: 'Joystick', category: 'Creative', keywords: ['joystick', 'gaming', 'arcade'],
    viewBox: '0 0 24 24',
    svg: '<rect x="4" y="12" width="16" height="9" rx="3" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M12 12V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="6" r="3" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="17" r="1.5" fill="currentColor" opacity="0.5"/><path d="M15 15.5h3M16.5 14v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'controller', name: 'Game Controller', category: 'Creative', keywords: ['controller', 'gaming', 'console'],
    viewBox: '0 0 24 24',
    svg: '<path d="M17 12h-5l-2 4-2-4H6a4 4 0 01-4-4V8a4 4 0 014-4h12a4 4 0 014 4v0a4 4 0 01-4 4z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M7 8v4M5 10h4M15 9h2M17 10v0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },

  // Space & Universe
  {
    id: 'rocket2', name: 'Space Rocket', category: 'Abstract', keywords: ['rocket', 'launch', 'startup'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 2c0 6-4 10-4 10h8S12 8 12 2z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 12v6l4 4 4-4v-6H8z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M6 15l-2 2M18 15l2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'comet', name: 'Comet', category: 'Abstract', keywords: ['comet', 'space', 'star'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="6" cy="6" r="4" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><path d="M12 12l8 8M10 14l8 6M14 10l6 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>',
  },
  {
    id: 'telescope2', name: 'Space View', category: 'Abstract', keywords: ['space', 'stars', 'astronomy'],
    viewBox: '0 0 24 24',
    svg: '<path d="M2 9l5 3L12 2l5 10 5-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M12 12v10M9 22h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },

  // More Food
  {
    id: 'shrimp', name: 'Seafood', category: 'Food', keywords: ['seafood', 'shrimp', 'ocean'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 4c-4 0-7 3-7 7 0 2 1 4 2.5 5.5C9 18 11 19 12 22c1-3 3-4 4.5-5.5C18 15 19 13 19 11c0-4-3-7-7-7z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M9 7c0 2 1.5 4 3 5M15 7c0 2-1.5 4-3 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>',
  },
  {
    id: 'donut', name: 'Donut', category: 'Food', keywords: ['donut', 'dessert', 'sweet'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="4" fill="white" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'noodles', name: 'Noodles', category: 'Food', keywords: ['noodles', 'pasta', 'asian'],
    viewBox: '0 0 24 24',
    svg: '<path d="M4 8h16M4 12c2-2 4 2 6 0s4-2 6 0M4 16c2-2 4 2 6 0s4-2 6 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><rect x="2" y="6" width="20" height="14" rx="3" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1.5"/>',
  },

  // Nature & Environment
  {
    id: 'water-drop', name: 'Water Drop', category: 'Animals', keywords: ['water', 'drop', 'hydration'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 2C6 10 4 14 4 17a8 8 0 0016 0c0-3-2-7-8-15z" fill="currentColor" opacity="0.25" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  },
  {
    id: 'wave2', name: 'Ocean Wave', category: 'Animals', keywords: ['wave', 'ocean', 'sea'],
    viewBox: '0 0 24 24',
    svg: '<path d="M2 10c2-3 4-3 6 0s4 3 6 0 4-3 6 0M2 16c2-3 4-3 6 0s4 3 6 0 4-3 6 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>',
  },
  {
    id: 'cactus', name: 'Cactus', category: 'Animals', keywords: ['cactus', 'desert', 'nature'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 22V12M12 12c0-5 5-5 5-10M12 12c0-5-5-5-5-10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M7 13h-3v-4M17 13h3v-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  },
  {
    id: 'seedling', name: 'Seedling', category: 'Animals', keywords: ['plant', 'grow', 'eco'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 22V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 12C12 7 16 3 21 3c0 5-3 9-9 9z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><path d="M12 12C12 7 8 3 3 3c0 5 3 9 9 9z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/>',
  },

  // More Abstract & Patterns
  {
    id: 'hexagon2', name: 'Hex Grid', category: 'Abstract', keywords: ['hexagon', 'honeycomb', 'pattern'],
    viewBox: '0 0 24 24',
    svg: '<polygon points="12,2 20,7 20,17 12,22 4,17 4,7" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><polygon points="12,6 17,9 17,15 12,18 7,15 7,9" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1"/>',
  },
  {
    id: 'shield2', name: 'Shield Star', category: 'Abstract', keywords: ['shield', 'protection', 'secure'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 2l9 4v5c0 5-4 9.5-9 11C7 20.5 3 16 3 11V6l9-4z" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 7l1.5 3h3l-2.5 2 1 3-3-2-3 2 1-3-2.5-2h3z" fill="currentColor" opacity="0.4"/>',
  },
  {
    id: 'layers2', name: 'Stack Layers', category: 'Abstract', keywords: ['layers', 'stack', 'depth'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/><path d="M2 17l10 5 10-5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/>',
  },
  {
    id: 'infinity2', name: 'Infinity Loop', category: 'Abstract', keywords: ['infinity', 'endless', 'loop'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 12c-2-2.5-4-4-6-4a4 4 0 000 8c2 0 4-1.5 6-4z" fill="currentColor" opacity="0.25" stroke="currentColor" stroke-width="1.5"/><path d="M12 12c2 2.5 4 4 6 4a4 4 0 000-8c-2 0-4 1.5-6 4z" fill="currentColor" opacity="0.25" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'badge', name: 'Badge', category: 'Abstract', keywords: ['badge', 'award', 'achievement'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 2l2.5 5 5.5.8-4 3.9.9 5.5L12 14.5 7.1 17.2l.9-5.5-4-3.9 5.5-.8z" fill="currentColor" opacity="0.25" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="12" cy="19" r="3" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/>',
  },

  // Social interactions
  {
    id: 'like', name: 'Thumbs Up', category: 'Communication', keywords: ['like', 'approve', 'positive'],
    viewBox: '0 0 24 24',
    svg: '<path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" stroke="currentColor" stroke-width="1.5" fill="none"/>',
  },
  {
    id: 'comment', name: 'Comment', category: 'Communication', keywords: ['comment', 'reply', 'discuss'],
    viewBox: '0 0 24 24',
    svg: '<path d="M21 15a2 2 0 01-2 2h-11l-4 4V5a2 2 0 012-2h13a2 2 0 012 2v10z" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 10h8M8 14h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'mention', name: 'Mention', category: 'Communication', keywords: ['mention', 'at', 'tag'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M16 8v5a3 3 0 006 0v-1a10 10 0 10-3.92 7.94" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>',
  },

  // More Technology
  {
    id: 'chip', name: 'Microchip', category: 'Technology', keywords: ['chip', 'processor', 'hardware'],
    viewBox: '0 0 24 24',
    svg: '<rect x="7" y="7" width="10" height="10" rx="1" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><path d="M9 7V4M12 7V4M15 7V4M9 20v-3M12 20v-3M15 20v-3M4 9h3M4 12h3M4 15h3M17 9h3M17 12h3M17 15h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'battery', name: 'Battery', category: 'Technology', keywords: ['battery', 'power', 'energy'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="7" width="18" height="10" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M20 11h2v2h-2M6 11h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'usb', name: 'USB', category: 'Technology', keywords: ['usb', 'connect', 'cable'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 2v14M6 10l6-4 6 4M8 14h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="12" cy="19" r="3" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'headphones2', name: 'Wireless Headphones', category: 'Technology', keywords: ['headphones', 'audio', 'music'],
    viewBox: '0 0 24 24',
    svg: '<path d="M3 18v-6a9 9 0 0118 0v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/>',
  },
  {
    id: 'speaker', name: 'Speaker', category: 'Technology', keywords: ['speaker', 'sound', 'audio'],
    viewBox: '0 0 24 24',
    svg: '<rect x="4" y="4" width="10" height="16" rx="2" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><circle cx="9" cy="15" r="3" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><circle cx="9" cy="15" r="1" fill="currentColor"/><circle cx="9" cy="8" r="1.5" fill="currentColor" opacity="0.5"/>',
  },
  {
    id: 'smartwatch', name: 'Smartwatch', category: 'Technology', keywords: ['watch', 'wearable', 'smartwatch'],
    viewBox: '0 0 24 24',
    svg: '<rect x="7" y="5" width="10" height="14" rx="3" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M9 3h6M9 21h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 9v3l2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  },

  // More Health
  {
    id: 'baby', name: 'Baby', category: 'Health', keywords: ['baby', 'child', 'family'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="6" r="4" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><path d="M6 22v-2a6 6 0 0112 0v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>',
  },
  {
    id: 'teeth', name: 'Dental', category: 'Health', keywords: ['dental', 'teeth', 'dentist'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 5.5C11 3 8 2 6 3S3 6 3 8c0 3 1 8 3 10h2l1-4 1 4h2l1-4 1 4h2c2-2 3-7 3-10 0-2-.5-5-3-5s-4 1.5-4 2.5z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  },
  {
    id: 'eye2', name: 'Eye Care', category: 'Health', keywords: ['eye', 'vision', 'optic'],
    viewBox: '0 0 24 24',
    svg: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>',
  },

  // Legal & Government
  {
    id: 'balance', name: 'Justice Scale', category: 'Business', keywords: ['law', 'justice', 'balance'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 3v18M3 6l9-3 9 3M5 20h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M5 6l-3 7h6L5 6zM19 6l-3 7h6L19 6z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  },
  {
    id: 'gavel', name: 'Gavel', category: 'Business', keywords: ['gavel', 'law', 'court'],
    viewBox: '0 0 24 24',
    svg: '<path d="M14 2l8 8-3 3-8-8 3-3z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M5 11l6 6-3 3-8-8 5-1z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M2 22l6-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  },

  // More Creative
  {
    id: 'neon-sign', name: 'Neon Sign', category: 'Creative', keywords: ['neon', 'sign', 'light'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="4" width="20" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7 8v6M7 11h4M11 8v6M13 8l4 6M13 14l4-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>',
  },
  {
    id: 'mosaic', name: 'Mosaic Pattern', category: 'Abstract', keywords: ['mosaic', 'tiles', 'pattern'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="2" width="9" height="9" rx="1" fill="currentColor" opacity="0.4"/><rect x="13" y="2" width="9" height="5" rx="1" fill="currentColor" opacity="0.25"/><rect x="13" y="9" width="9" height="4" rx="1" fill="currentColor" opacity="0.35"/><rect x="2" y="13" width="5" height="9" rx="1" fill="currentColor" opacity="0.2"/><rect x="9" y="13" width="5" height="4" rx="1" fill="currentColor" opacity="0.3"/><rect x="9" y="19" width="13" height="3" rx="1" fill="currentColor" opacity="0.2"/>',
  },
  {
    id: 'solar-panel', name: 'Solar Panel', category: 'Technology', keywords: ['solar', 'energy', 'green'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="5" width="20" height="14" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M2 9h20M2 13h20M8 5v14M16 5v14" stroke="currentColor" stroke-width="1"/>',
  },
  {
    id: 'wind-turbine', name: 'Wind Turbine', category: 'Technology', keywords: ['wind', 'energy', 'eco'],
    viewBox: '0 0 24 24',
    svg: '<path d="M12 12V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 12L8 4M12 12l8 2M12 12l-5 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="12" r="2" fill="currentColor"/>',
  },
  {
    id: 'globe2', name: 'Globe Network', category: 'Technology', keywords: ['global', 'internet', 'network'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1.5"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" stroke-width="1.5" fill="none"/>',
  },
  {
    id: 'chart-donut', name: 'Donut Chart', category: 'Business', keywords: ['chart', 'analytics', 'donut'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="5" fill="white" stroke="currentColor" stroke-width="1.5"/><path d="M12 2a10 10 0 017.07 17.07" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.5"/>',
  },
  {
    id: 'arrow-cycle', name: 'Cycle Arrows', category: 'Abstract', keywords: ['cycle', 'refresh', 'repeat'],
    viewBox: '0 0 24 24',
    svg: '<path d="M23 4v6h-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M1 20v-6h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  },
  {
    id: 'medal2', name: 'First Place', category: 'Sports', keywords: ['medal', 'gold', 'winner'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="12" cy="8" r="7" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M12 5v6M10 9h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'podium', name: 'Podium', category: 'Sports', keywords: ['podium', 'winner', 'rank'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="13" width="6" height="9" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="8" width="6" height="14" fill="currentColor" opacity="0.4" stroke="currentColor" stroke-width="1.5"/><rect x="16" y="10" width="6" height="12" fill="currentColor" opacity="0.25" stroke="currentColor" stroke-width="1.5"/><path d="M5 13V9M12 8V4M19 10V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'chess', name: 'Chess', category: 'Creative', keywords: ['chess', 'strategy', 'game'],
    viewBox: '0 0 24 24',
    svg: '<path d="M9 21h6M12 21v-4M8 17h8M9 13c0-2 1-4 3-6 2 2 3 4 3 6H9z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 7V5h4v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  },
  {
    id: 'film2', name: 'Movie Clapper', category: 'Creative', keywords: ['film', 'movie', 'clapper'],
    viewBox: '0 0 24 24',
    svg: '<path d="M4 11H20V20a2 2 0 01-2 2H6a2 2 0 01-2-2V11z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M4 11L2 7l4-1 2 5H4zM8 10L6 6l4-1 2 5H8zM12 9l-2-4 4-1 2 5h-4zM16 8l-2-4 4-1 2 5h-4z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1"/>',
  },
  {
    id: 'photo-album', name: 'Photo Album', category: 'Creative', keywords: ['photo', 'album', 'gallery'],
    viewBox: '0 0 24 24',
    svg: '<rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1.5"/><rect x="7" y="7" width="5" height="5" rx="1" fill="currentColor" opacity="0.3"/><rect x="14" y="7" width="3" height="5" rx="1" fill="currentColor" opacity="0.2"/><rect x="7" y="14" width="10" height="3" rx="1" fill="currentColor" opacity="0.2"/>',
  },
  {
    id: 'origami', name: 'Origami', category: 'Abstract', keywords: ['origami', 'fold', 'paper'],
    viewBox: '0 0 24 24',
    svg: '<path d="M2 22L12 2l10 20H2z" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 2L6 14l6 4 6-4L12 2z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1"/>',
  },
  {
    id: 'map-route', name: 'Map Route', category: 'Travel', keywords: ['route', 'directions', 'path'],
    viewBox: '0 0 24 24',
    svg: '<circle cx="6" cy="6" r="3" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="18" r="3" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><path d="M6 9v3a3 3 0 003 3h6a3 3 0 013 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>',
  },
  {
    id: 'sunglasses', name: 'Sunglasses', category: 'Beauty', keywords: ['sunglasses', 'cool', 'fashion'],
    viewBox: '0 0 24 24',
    svg: '<rect x="2" y="9" width="7" height="7" rx="3.5" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><rect x="15" y="9" width="7" height="7" rx="3.5" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/><path d="M2 12.5H1M22 12.5h1M9 12.5h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  {
    id: 'trophy2', name: 'Achievement', category: 'Business', keywords: ['trophy', 'win', 'achievement'],
    viewBox: '0 0 24 24',
    svg: '<path d="M6 9H4V4h3M18 9h2V4h-3M12 17v3M8 21h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M4 4h16v5a8 8 0 01-8 8A8 8 0 014 9V4z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/>',
  },
];

export const ICON_CATEGORIES = [...new Set(ICONS.map(i => i.category))];
