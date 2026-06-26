import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    HeartHandshake, Download, Undo2, Redo2, Save, RotateCcw,
    Palette, Type as TypeIcon, RectangleHorizontal, Sparkles, Eye,
    PartyPopper, Heart, Baby, Home, GraduationCap, Building2, Star, Gift, Flame, Church,
    ChevronDown, ChevronRight, Calendar, Clock, Upload, QrCode, Maximize2, Minimize2,
    ZoomIn, ZoomOut, Share2, Check, Copy, Image as ImageIcon, X, MapPin, Phone,
    Shirt, MessageSquare
} from 'lucide-react';
import { useInvitationState } from './hooks/useInvitationState';
import { useDownload } from './hooks/useDownload';
import { colorSchemes } from './data/colorSchemes';
import { fontPairs, loadGoogleFonts } from './data/fontPairs';
import { formats } from './data/formats';
import { qualityOptions, defaultQuality } from './data/qualityOptions';
import { templateRegistry, getTemplateComponent } from './templates';
import type {
    EventType, ColorScheme,
    QualityOption, DownloadFormat, SubEvent, DecorativeOptions, Language
} from './types';

const EVENT_TYPES: { id: EventType; label: string; icon: React.FC<any> }[] = [
    { id: 'wedding', label: 'Wedding', icon: Heart },
    { id: 'engagement', label: 'Engagement', icon: HeartHandshake },
    { id: 'birthday', label: 'Birthday', icon: PartyPopper },
    { id: 'babyshower', label: 'Baby Shower', icon: Baby },
    { id: 'housewarming', label: 'Housewarming', icon: Home },
    { id: 'graduation', label: 'Graduation', icon: GraduationCap },
    { id: 'corporate', label: 'Corporate', icon: Building2 },
    { id: 'farewell', label: 'Farewell', icon: Star },
    { id: 'anniversary', label: 'Anniversary', icon: Gift },
    { id: 'pooja', label: 'Pooja', icon: Flame },
    { id: 'reception', label: 'Reception', icon: Church },
    { id: 'nameceremony', label: 'Name Ceremony', icon: Baby },
];

const LANGUAGES: { id: Language; label: string; flag: string }[] = [
    { id: 'english', label: 'English', flag: '🇬🇧' },
    { id: 'tamil', label: 'Tamil', flag: '🇮🇳' },
    { id: 'hindi', label: 'Hindi', flag: '🇮🇳' },
    { id: 'telugu', label: 'Telugu', flag: '🇮🇳' },
    { id: 'kannada', label: 'Kannada', flag: '🇮🇳' },
];

const DECORATION_ICONS: Record<string, React.FC<any>> = {
    borderFrame: RectangleHorizontal,
    cornerDecorations: Sparkles,
    dividerLines: RectangleHorizontal,
    backgroundPattern: Palette,
    photoFrame: ImageIcon,
};

/* ─── Collapsible Section Component ─── */
const Section: React.FC<{
    title: string; icon: React.FC<any>; defaultOpen?: boolean; children: React.ReactNode; badge?: string;
}> = ({ title, icon: Icon, defaultOpen = true, children, badge }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50/80 transition-colors"
            >
                <Icon size={13} className="text-indigo-500" />
                <span className="flex-1 text-left">{title}</span>
                {badge && (
                    <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-600 rounded-full text-[9px] font-bold">{badge}</span>
                )}
                {open ? <ChevronDown size={12} className="text-slate-400" /> : <ChevronRight size={12} className="text-slate-400" />}
            </button>
            {open && <div className="px-3 pb-3 space-y-3 border-t border-slate-100">{children}</div>}
        </div>
    );
};

/* ─── Toast Notification ─── */
const Toast: React.FC<{ message: string; visible: boolean }> = ({ message, visible }) => (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg border transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        } bg-white/90 backdrop-blur-md border-slate-200`}
    >
        <Check size={14} className="text-emerald-500" />
        <span className="text-xs font-medium text-slate-700">{message}</span>
    </div>
);

export const InvitationCreator: React.FC = () => {
    const {
        data, canUndo, canRedo,
        setField, setData, changeEventType,
        undo, redo, saveDraft, loadDraft, clearDraft,
    } = useInvitationState();

    const { downloadAsImage, downloadAsPDF } = useDownload();
    const [quality, setQuality] = useState<QualityOption>(defaultQuality);

    const [draftLoaded, setDraftLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState<'content' | 'style' | 'export'>('content');
    const previewRef = useRef<HTMLDivElement>(null);
    const [previewSize, setPreviewSize] = useState({ w: 700, h: 500 });
    const [previewZoom, setPreviewZoom] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [toastVisible, setToastVisible] = useState(false);
    const [downloading, setDownloading] = useState<string | null>(null);
    const [copiedLink, setCopiedLink] = useState(false);

    const showToast = useCallback((msg: string) => {
        setToastMsg(msg);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 2500);
    }, []);

    // Measure preview container
    useEffect(() => {
        const el = previewRef.current;
        if (!el) return;
        const measure = () => setPreviewSize({ w: el.clientWidth, h: el.clientHeight });
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // Load Google Fonts
    useEffect(() => { loadGoogleFonts(); }, []);

    // Offer to restore draft
    useEffect(() => {
        const draft = loadDraft();
        if (draft && !draftLoaded) {
            setData(draft);
            setDraftLoaded(true);
            showToast('Draft restored');
        }
    }, []);

    // Auto-save draft every 10s
    useEffect(() => {
        const t = setInterval(() => { saveDraft(); }, 10000);
        return () => clearInterval(t);
    }, [saveDraft]);

    const TemplateComponent = getTemplateComponent(data.template);

    const handleDownload = useCallback(async (format: DownloadFormat) => {
        setDownloading(format);
        try {
            if (format === 'pdf') {
                await downloadAsPDF('invitation-preview', quality, data.format, `${data.eventName}-invitation`);
            } else {
                await downloadAsImage('invitation-preview', format, quality, data.format, `${data.eventName}-invitation`);
            }
            showToast(`Downloaded as ${format.toUpperCase()}!`);
        } catch (e) {
            console.error(e);
        }
        setDownloading(null);
    }, [quality, data.format, data.eventName, downloadAsImage, downloadAsPDF, showToast]);

    const handleSetSubEvent = (index: 1 | 2 | 3, field: keyof SubEvent, value: string) => {
        const key = `subEvent${index}` as 'subEvent1' | 'subEvent2' | 'subEvent3';
        const current = data[key] || { name: '', date: '', time: '', venue: '' };
        setField(key, { ...current, [field]: value });
    };

    const handleDecoration = (key: keyof DecorativeOptions) => {
        setField('decorations', { ...data.decorations, [key]: !data.decorations[key] });
    };

    const handleCustomColor = (field: keyof ColorScheme, value: string) => {
        setField('colorScheme', { ...data.colorScheme, id: 'custom', name: 'Custom', [field]: value });
    };

    const handleSaveDraft = () => {
        saveDraft();
        showToast('Draft saved!');
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setField('couplePhotoUrl', reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleWhatsAppShare = () => {
        const text = `You're invited! 🎉\n\n${data.title}\n${data.eventName}\n📅 ${data.date} at ${data.time}\n📍 ${data.venue}, ${data.address}, ${data.city}\n\nHosted by ${data.hostNames}${data.rsvpPhone ? `\n📱 RSVP: ${data.rsvpPhone}` : ''}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleCopyDetails = () => {
        const text = `${data.title}\n${data.eventName}\nDate: ${data.date}\nTime: ${data.time}\nVenue: ${data.venue}, ${data.address}, ${data.city}\nHosted by: ${data.hostNames}${data.rsvpPhone ? `\nRSVP: ${data.rsvpPhone}` : ''}`;
        navigator.clipboard.writeText(text);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
        showToast('Details copied!');
    };

    // ─── Input Field Component ───
    const Field: React.FC<{
        label: string; value: string; field: string; placeholder?: string; rows?: number;
        icon?: React.FC<any>; type?: string; maxLength?: number
    }> = ({ label, value, field, placeholder, rows, icon: Icon, type = 'text', maxLength }) => (
        <div>
            <label className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                {Icon && <Icon size={10} className="text-slate-400" />}
                {label}
                {maxLength && <span className="ml-auto text-[9px] text-slate-300 font-normal normal-case">{value.length}/{maxLength}</span>}
            </label>
            {rows ? (
                <textarea
                    value={value}
                    onChange={e => setField(field, e.target.value)}
                    placeholder={placeholder}
                    rows={rows}
                    maxLength={maxLength}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-none bg-white/80 transition-all"
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={e => setField(field, e.target.value)}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-white/80 transition-all"
                />
            )}
        </div>
    );

    // ─── Fullscreen Preview ───
    if (isFullscreen) {
        return (
            <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-8">
                <button
                    onClick={() => setIsFullscreen(false)}
                    className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                    <Minimize2 size={20} />
                </button>
                <div className="flex items-center justify-center" style={{ transform: `scale(${previewZoom})` }}>
                    <div id="invitation-preview-fullscreen"
                        style={{
                            width: `${data.format.width}px`,
                            height: `${data.format.height}px`,
                            transform: `scale(${Math.min(
                                (window.innerWidth - 120) / data.format.width,
                                (window.innerHeight - 120) / data.format.height,
                                1
                            )})`,
                            transformOrigin: 'center center',
                        }}
                    >
                        <div style={{
                            width: `${data.format.width / (data.fontScale || 1)}px`,
                            height: `${data.format.height / (data.fontScale || 1)}px`,
                            transform: `scale(${data.fontScale || 1})`,
                            transformOrigin: 'top left'
                        }}>
                            <TemplateComponent data={data} />
                        </div>
                    </div>
                </div>
                {/* Zoom controls */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
                    <button onClick={() => setPreviewZoom(z => Math.max(0.3, z - 0.1))} className="p-1 text-white/70 hover:text-white"><ZoomOut size={16} /></button>
                    <span className="text-xs text-white/80 font-medium w-12 text-center">{Math.round(previewZoom * 100)}%</span>
                    <button onClick={() => setPreviewZoom(z => Math.min(3, z + 0.1))} className="p-1 text-white/70 hover:text-white"><ZoomIn size={16} /></button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 overflow-hidden">
            {/* ═══ Header ═══ */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 shadow-sm shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
                        <HeartHandshake size={17} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                            Invitation Creator
                            <span className="text-[8px] bg-gradient-to-r from-pink-500 to-purple-500 text-white px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Pro</span>
                        </h1>
                        <p className="text-[10px] text-slate-400">Design beautiful invitations for every occasion</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)"
                        className="group p-2 rounded-lg hover:bg-slate-100 disabled:opacity-20 transition-all">
                        <Undo2 size={14} className="text-slate-600" />
                    </button>
                    <button onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)"
                        className="group p-2 rounded-lg hover:bg-slate-100 disabled:opacity-20 transition-all">
                        <Redo2 size={14} className="text-slate-600" />
                    </button>
                    <div className="w-px h-5 bg-slate-200 mx-1" />
                    <button onClick={handleSaveDraft} title="Save Draft (Ctrl+S)"
                        className="p-2 rounded-lg hover:bg-emerald-50 transition-all group">
                        <Save size={14} className="text-slate-600 group-hover:text-emerald-600" />
                    </button>
                    <button onClick={() => { clearDraft(); changeEventType('wedding'); showToast('Reset to default'); }} title="Reset All"
                        className="p-2 rounded-lg hover:bg-red-50 transition-all group">
                        <RotateCcw size={14} className="text-slate-600 group-hover:text-red-500" />
                    </button>
                </div>
            </div>

            {/* ═══ Main content ═══ */}
            <div className="flex-1 flex overflow-hidden">
                {/* ─── Left Panel ─── */}
                <div className="w-[360px] shrink-0 bg-white/60 backdrop-blur-sm border-r border-slate-200/50 flex flex-col overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-200/60 shrink-0 bg-white/50">
                        {[
                            { id: 'content' as const, label: 'Content', icon: TypeIcon },
                            { id: 'style' as const, label: 'Style', icon: Palette },
                            { id: 'export' as const, label: 'Export', icon: Download },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-[11px] font-semibold border-b-2 transition-all ${activeTab === tab.id
                                    ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50'
                                    : 'border-transparent text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                <tab.icon size={13} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Panel content */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                        {activeTab === 'content' && (
                            <>
                                {/* ── Event Type ── */}
                                <Section title="Event Type" icon={Sparkles} badge={EVENT_TYPES.find(e => e.id === data.eventType)?.label}>
                                    <div className="grid grid-cols-4 gap-1.5 pt-2">
                                        {EVENT_TYPES.map(et => {
                                            const Icon = et.icon;
                                            const active = data.eventType === et.id;
                                            return (
                                                <button
                                                    key={et.id}
                                                    onClick={() => changeEventType(et.id)}
                                                    className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg border text-[8px] font-semibold transition-all ${active
                                                        ? 'border-indigo-400 bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100'
                                                        : 'border-slate-200/60 text-slate-500 hover:border-indigo-200 hover:bg-indigo-50/30'
                                                        }`}
                                                >
                                                    <Icon size={14} />
                                                    {et.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </Section>

                                {/* ── Language ── */}
                                <div className="flex items-center gap-2 px-1">
                                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Language</label>
                                    <div className="flex gap-1 flex-1">
                                        {LANGUAGES.map(l => (
                                            <button key={l.id} onClick={() => setField('language', l.id)}
                                                className={`flex-1 text-[9px] py-1.5 rounded-lg font-semibold transition-all ${data.language === l.id
                                                    ? 'bg-indigo-500 text-white shadow-sm'
                                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                    }`}
                                            >
                                                {l.flag} {l.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* ── People ── */}
                                <Section title="People & Title" icon={Heart}>
                                    <div className="space-y-2 pt-2">
                                        <Field label="Invitation Title" value={data.title} field="title" placeholder="You're Invited ✨" icon={TypeIcon} />
                                        <Field label="Host Names" value={data.hostNames} field="hostNames" placeholder="Mr. & Mrs. Kumar" />

                                        {(data.eventType === 'wedding' || data.eventType === 'engagement' || data.eventType === 'reception') && (
                                            <div className="grid grid-cols-2 gap-2">
                                                <Field label="Groom" value={data.groomName || ''} field="groomName" placeholder="Groom's Name" />
                                                <Field label="Bride" value={data.brideName || ''} field="brideName" placeholder="Bride's Name" />
                                            </div>
                                        )}

                                        {(data.eventType === 'birthday' || data.eventType === 'graduation' || data.eventType === 'farewell' || data.eventType === 'nameceremony') && (
                                            <Field label="Honoree" value={data.honoree || ''} field="honoree" placeholder="Person's Name" />
                                        )}
                                    </div>
                                </Section>

                                {/* ── Event Details ── */}
                                <Section title="Event Details" icon={Calendar}>
                                    <div className="space-y-2 pt-2">
                                        <Field label="Event Name" value={data.eventName} field="eventName" placeholder="Wedding Ceremony" />
                                        <div className="grid grid-cols-2 gap-2">
                                            <Field label="Date" value={data.date} field="date" placeholder="14th June 2025" icon={Calendar} />
                                            <Field label="Time" value={data.time} field="time" placeholder="6:30 PM onwards" icon={Clock} />
                                        </div>
                                        <Field label="Venue" value={data.venue} field="venue" placeholder="Grand Ballroom" icon={MapPin} />
                                        <div className="grid grid-cols-2 gap-2">
                                            <Field label="Address" value={data.address} field="address" placeholder="123 Main Road" />
                                            <Field label="City" value={data.city} field="city" placeholder="Chennai" />
                                        </div>
                                    </div>
                                </Section>

                                {/* ── RSVP & Extras ── */}
                                <Section title="RSVP & Extras" icon={MessageSquare} defaultOpen={false}>
                                    <div className="space-y-2 pt-2">
                                        <Field label="Quote / Message" value={data.quote || ''} field="quote" placeholder="A beautiful quote for your guests..." rows={2} maxLength={200} />
                                        <div className="grid grid-cols-2 gap-2">
                                            <Field label="Dress Code" value={data.dresscode || ''} field="dresscode" placeholder="Traditional" icon={Shirt} />
                                            <Field label="RSVP Phone" value={data.rsvpPhone || ''} field="rsvpPhone" placeholder="+91 98765 43210" icon={Phone} />
                                        </div>
                                        <Field label="RSVP By Date" value={data.rsvpDate || ''} field="rsvpDate" placeholder="10th June 2025" icon={Calendar} />
                                    </div>
                                </Section>

                                {/* ── Photo Upload ── */}
                                <Section title="Photo Upload" icon={ImageIcon} defaultOpen={false}>
                                    <div className="pt-2">
                                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-indigo-300 transition-colors">
                                            {data.couplePhotoUrl ? (
                                                <div className="relative">
                                                    <img src={data.couplePhotoUrl} alt="Uploaded" className="w-20 h-20 rounded-full mx-auto object-cover shadow-md" />
                                                    <button onClick={() => setField('couplePhotoUrl', '')}
                                                        className="absolute top-0 right-1/2 translate-x-10 -translate-y-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                                                        <X size={10} />
                                                    </button>
                                                    <p className="text-[10px] text-slate-400 mt-2">Photo uploaded</p>
                                                </div>
                                            ) : (
                                                <label className="cursor-pointer block">
                                                    <Upload size={20} className="mx-auto text-slate-300 mb-1" />
                                                    <p className="text-[10px] text-slate-400 font-medium">Click to upload photo</p>
                                                    <p className="text-[8px] text-slate-300">JPG, PNG up to 5MB</p>
                                                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </Section>

                                {/* ── Sub-Events ── */}
                                <Section title="Sub-Events" icon={Star} defaultOpen={false} badge="Optional">
                                    <div className="space-y-2 pt-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="bg-slate-50/80 rounded-lg p-2 space-y-1">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase">Event {i}</p>
                                                <div className="grid grid-cols-2 gap-1">
                                                    <input type="text" placeholder="Name (e.g. Mehendi)" value={(data as any)[`subEvent${i}`]?.name || ''}
                                                        onChange={e => handleSetSubEvent(i as 1 | 2 | 3, 'name', e.target.value)}
                                                        className="text-[10px] border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white" />
                                                    <input type="text" placeholder="Date" value={(data as any)[`subEvent${i}`]?.date || ''}
                                                        onChange={e => handleSetSubEvent(i as 1 | 2 | 3, 'date', e.target.value)}
                                                        className="text-[10px] border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white" />
                                                    <input type="text" placeholder="Time" value={(data as any)[`subEvent${i}`]?.time || ''}
                                                        onChange={e => handleSetSubEvent(i as 1 | 2 | 3, 'time', e.target.value)}
                                                        className="text-[10px] border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white" />
                                                    <input type="text" placeholder="Venue" value={(data as any)[`subEvent${i}`]?.venue || ''}
                                                        onChange={e => handleSetSubEvent(i as 1 | 2 | 3, 'venue', e.target.value)}
                                                        className="text-[10px] border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Section>
                            </>
                        )}

                        {activeTab === 'style' && (
                            <>
                                {/* ── Template Gallery ── */}
                                <Section title="Template" icon={Palette} badge={templateRegistry.find(t => t.id === data.template)?.name}>
                                    <div className="grid grid-cols-2 gap-2 pt-2">
                                        {templateRegistry.map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => setField('template', t.id)}
                                                className={`relative rounded-xl border-2 overflow-hidden text-left transition-all hover:scale-[1.02] ${data.template === t.id
                                                    ? 'border-indigo-500 ring-2 ring-indigo-200 shadow-lg shadow-indigo-100'
                                                    : 'border-slate-200/60 hover:border-slate-300'
                                                    }`}
                                            >
                                                <div className="h-24 flex items-center justify-center text-xs font-bold"
                                                    style={{ background: t.previewColors.bg, color: t.previewColors.accent }}>
                                                    <div className="text-center">
                                                        <p className="text-sm font-bold">{t.name}</p>
                                                        <p className="text-[8px] opacity-60 mt-0.5">{t.description}</p>
                                                    </div>
                                                </div>
                                                {data.template === t.id && (
                                                    <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center shadow-md">
                                                        <Check size={10} className="text-white" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </Section>

                                {/* ── Color Scheme ── */}
                                <Section title="Color Scheme" icon={Palette}>
                                    <div className="pt-2">
                                        <div className="grid grid-cols-5 gap-2 mb-3">
                                            {colorSchemes.map(c => (
                                                <button
                                                    key={c.id}
                                                    onClick={() => setField('colorScheme', c)}
                                                    title={c.name}
                                                    className={`group relative h-10 rounded-xl border-2 transition-all overflow-hidden ${data.colorScheme.id === c.id
                                                        ? 'border-indigo-500 ring-2 ring-indigo-200 scale-110 shadow-md'
                                                        : 'border-slate-200/60 hover:scale-105 hover:shadow-sm'
                                                        }`}
                                                >
                                                    <div className="w-full h-full flex">
                                                        <div className="flex-1" style={{ background: c.primary }} />
                                                        <div className="flex-1" style={{ background: c.secondary }} />
                                                        <div className="flex-1" style={{ background: c.background }} />
                                                    </div>
                                                    {/* Tooltip */}
                                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                        <span className="bg-slate-800 text-white text-[8px] px-2 py-0.5 rounded whitespace-nowrap">{c.name}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        {/* Custom colors */}
                                        <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                                            <span className="text-[9px] text-slate-400 font-semibold">CUSTOM:</span>
                                            {['primary', 'secondary', 'accent', 'background', 'text'].map(f => (
                                                <label key={f} className="flex flex-col items-center gap-0.5 cursor-pointer" title={f}>
                                                    <input type="color" value={(data.colorScheme as any)[f]}
                                                        onChange={e => handleCustomColor(f as any, e.target.value)}
                                                        className="w-6 h-6 rounded-lg cursor-pointer border-0 p-0" />
                                                    <span className="text-[7px] text-slate-400 capitalize font-medium">{f}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </Section>

                                {/* ── Font Pair ── */}
                                <Section title="Typography" icon={TypeIcon}>
                                    <div className="space-y-1.5 pt-2">
                                        {fontPairs.map(f => (
                                            <button
                                                key={f.id}
                                                onClick={() => setField('fontPair', f)}
                                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all ${data.fontPair.id === f.id
                                                    ? 'border-indigo-500 bg-indigo-50/80 shadow-sm shadow-indigo-100'
                                                    : 'border-slate-200/60 hover:border-slate-300 hover:bg-slate-50/50'
                                                    }`}
                                            >
                                                <div>
                                                    <span className="text-sm block" style={{ fontFamily: f.headingFont, fontWeight: f.headingWeight as any }}>
                                                        {f.preview}
                                                    </span>
                                                    <span className="text-[8px] text-slate-400 block mt-0.5" style={{ fontFamily: f.bodyFont }}>
                                                        Body text sample
                                                    </span>
                                                </div>
                                                <span className="text-[9px] text-slate-400 font-medium">{f.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </Section>

                                {/* ── Text Size ── */}
                                <Section title="Text Size" icon={TypeIcon} defaultOpen={false}>
                                    <div className="pt-2">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setField('fontScale', Math.max(0.6, Math.round(((data.fontScale || 1) - 0.1) * 10) / 10))}
                                                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors text-sm font-bold"
                                            >−</button>
                                            <input
                                                type="range" min="0.6" max="3.0" step="0.1"
                                                value={data.fontScale || 1}
                                                onChange={e => setField('fontScale', parseFloat(e.target.value))}
                                                className="flex-1 accent-indigo-500"
                                            />
                                            <button
                                                onClick={() => setField('fontScale', Math.min(3.0, Math.round(((data.fontScale || 1) + 0.1) * 10) / 10))}
                                                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors text-sm font-bold"
                                            >+</button>
                                        </div>
                                        <div className="flex justify-between mt-1.5 px-1">
                                            <span className="text-[9px] text-slate-400 font-semibold">{Math.round((data.fontScale || 1) * 100)}%</span>
                                            <button onClick={() => setField('fontScale', 1)}
                                                className="text-[9px] text-indigo-500 hover:text-indigo-700 font-semibold">Reset</button>
                                        </div>
                                    </div>
                                </Section>

                                {/* ── Decorations ── */}
                                <Section title="Decorations" icon={Sparkles} defaultOpen={false}>
                                    <div className="space-y-1 pt-2">
                                        {Object.entries(data.decorations).map(([key, val]) => {
                                            const DecIcon = DECORATION_ICONS[key] || Sparkles;
                                            return (
                                                <label key={key}
                                                    className={`flex items-center gap-2.5 cursor-pointer text-xs px-2.5 py-2 rounded-lg transition-all ${val ? 'bg-indigo-50/80 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    <input type="checkbox" checked={val} onChange={() => handleDecoration(key as keyof DecorativeOptions)}
                                                        className="rounded text-indigo-500 border-slate-300 focus:ring-indigo-400" />
                                                    <DecIcon size={12} className={val ? 'text-indigo-500' : 'text-slate-400'} />
                                                    <span className="font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </Section>
                            </>
                        )}

                        {activeTab === 'export' && (
                            <>
                                {/* ── Format ── */}
                                <Section title="Output Format" icon={RectangleHorizontal} badge={data.format.name}>
                                    <div className="space-y-1.5 pt-2">
                                        {formats.map(f => (
                                            <button
                                                key={f.id}
                                                onClick={() => setField('format', f)}
                                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${data.format.id === f.id
                                                    ? 'border-indigo-500 bg-indigo-50/80 shadow-sm shadow-indigo-100'
                                                    : 'border-slate-200/60 hover:border-slate-300 hover:bg-slate-50/50'
                                                    }`}
                                            >
                                                {/* Aspect ratio preview */}
                                                <div className="w-8 h-8 rounded border border-slate-300/50 flex items-center justify-center bg-white overflow-hidden">
                                                    <div
                                                        className={`bg-indigo-500/20 border border-indigo-400/30 rounded-sm ${data.format.id === f.id ? 'bg-indigo-500/30' : ''}`}
                                                        style={{
                                                            width: `${Math.min(24, 24 * (f.width / Math.max(f.width, f.height)))}px`,
                                                            height: `${Math.min(24, 24 * (f.height / Math.max(f.width, f.height)))}px`,
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <span className="text-xs font-semibold block">{f.name}</span>
                                                    <span className="text-[9px] text-slate-400">{f.ratio} — {f.useCase}</span>
                                                </div>
                                                {data.format.id === f.id && <Check size={14} className="text-indigo-500" />}
                                            </button>
                                        ))}
                                    </div>
                                </Section>

                                {/* ── Quality ── */}
                                <Section title="Image Quality" icon={ImageIcon}>
                                    <div className="space-y-1.5 pt-2">
                                        {qualityOptions.map(q => (
                                            <button
                                                key={q.id}
                                                onClick={() => setQuality(q)}
                                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all ${quality.id === q.id
                                                    ? 'border-indigo-500 bg-indigo-50/80 shadow-sm shadow-indigo-100'
                                                    : 'border-slate-200/60 hover:border-slate-300'
                                                    }`}
                                            >
                                                <div>
                                                    <span className="text-xs font-semibold">{q.label}</span>
                                                    <span className="text-[9px] text-slate-400 ml-2">{q.description}</span>
                                                </div>
                                                <span className="text-[9px] text-slate-400 font-medium">{q.fileSize}</span>
                                            </button>
                                        ))}
                                    </div>
                                </Section>

                                {/* ── Download Buttons ── */}
                                <Section title="Download" icon={Download}>
                                    <div className="grid grid-cols-2 gap-2 pt-2">
                                        {(['pdf', 'png', 'jpg', 'jpeg'] as DownloadFormat[]).map(fmt => (
                                            <button
                                                key={fmt}
                                                onClick={() => handleDownload(fmt)}
                                                disabled={downloading !== null}
                                                className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-95 disabled:opacity-60"
                                            >
                                                {downloading === fmt ? (
                                                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <Download size={13} />
                                                )}
                                                {fmt.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </Section>

                                {/* ── Share ── */}
                                <Section title="Share" icon={Share2}>
                                    <div className="space-y-2 pt-2">
                                        <button onClick={handleWhatsAppShare}
                                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20 active:scale-95">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.506 3.932 1.395 5.608L0 24l6.565-1.365A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.838 0-3.604-.5-5.141-1.444l-.369-.218-3.826.796.828-3.696-.242-.382A9.724 9.724 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" /></svg>
                                            Share via WhatsApp
                                        </button>
                                        <button onClick={handleCopyDetails}
                                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all active:scale-95">
                                            {copiedLink ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                                            {copiedLink ? 'Copied!' : 'Copy Event Details'}
                                        </button>
                                    </div>
                                </Section>
                            </>
                        )}
                    </div>
                </div>

                {/* ─── Right Panel — Preview ─── */}
                <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-slate-100/50 to-slate-200/30 min-h-[500px] min-w-[500px]">
                    {/* Preview toolbar */}
                    <div className="flex items-center justify-between px-4 py-2 bg-white/40 backdrop-blur-sm border-b border-slate-200/40 shrink-0">
                        <div className="flex items-center gap-2">
                            <Eye size={12} className="text-indigo-500" />
                            <span className="text-[10px] font-semibold text-slate-500">Live Preview</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <button onClick={() => setPreviewZoom(z => Math.max(0.3, z - 0.1))}
                                className="p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"><ZoomOut size={13} className="text-slate-500" /></button>
                            <span className="text-[10px] text-slate-500 font-semibold w-10 text-center">{Math.round(previewZoom * 100)}%</span>
                            <button onClick={() => setPreviewZoom(z => Math.min(2, z + 0.1))}
                                className="p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"><ZoomIn size={13} className="text-slate-500" /></button>
                            <button onClick={() => setPreviewZoom(1)}
                                className="text-[9px] text-indigo-500 font-semibold px-2 hover:text-indigo-700">Fit</button>
                            <div className="w-px h-4 bg-slate-200 mx-1" />
                            <button onClick={() => setIsFullscreen(true)}
                                className="p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors" title="Fullscreen">
                                <Maximize2 size={13} className="text-slate-500" />
                            </button>
                        </div>
                    </div>

                    {/* Preview area */}
                    <div className="flex-1 flex items-center justify-center p-4 overflow-auto" ref={previewRef}>
                        {(() => {
                            const padded_W = previewSize.w - 32;
                            const padded_H = previewSize.h - 100;
                            const scaleX = padded_W / data.format.width;
                            const scaleY = padded_H / data.format.height;
                            const baseScale = Math.min(scaleX, scaleY, 1);
                            const finalScale = baseScale * previewZoom;
                            const displayW = data.format.width * finalScale;
                            const displayH = data.format.height * finalScale;
                            return (
                                <div className="flex flex-col items-center">
                                    <div
                                        className="shadow-2xl rounded-xl overflow-hidden ring-1 ring-black/5"
                                        style={{
                                            width: `${displayW}px`,
                                            height: `${displayH}px`,
                                        }}
                                    >
                                        <div
                                            id="invitation-preview"
                                            style={{
                                                width: `${data.format.width}px`,
                                                height: `${data.format.height}px`,
                                                transform: `scale(${finalScale})`,
                                                transformOrigin: 'top left',
                                            }}
                                        >
                                            <div style={{
                                                width: `${data.format.width / (data.fontScale || 1)}px`,
                                                height: `${data.format.height / (data.fontScale || 1)}px`,
                                                transform: `scale(${data.fontScale || 1})`,
                                                transformOrigin: 'top left'
                                            }}>
                                                <TemplateComponent data={data} />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Format badge */}
                                    <div className="mt-3">
                                        <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-md flex items-center gap-2">
                                            <Eye size={10} className="text-indigo-500" />
                                            <span className="text-[9px] font-semibold text-slate-600">{data.format.name}</span>
                                            <span className="text-[8px] text-slate-400">{data.format.width}×{data.format.height}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>

            {/* Toast */}
            <Toast message={toastMsg} visible={toastVisible} />
        </div>
    );
};
