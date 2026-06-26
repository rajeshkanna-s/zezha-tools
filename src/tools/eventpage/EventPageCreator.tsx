import React, { useState, useCallback } from 'react';
import {
    Globe, Download, Palette, Type as TypeIcon, Eye, Monitor, Tablet, Smartphone,
    Plus, Trash2, ChevronDown, ChevronUp, FileCode, FileDown, Archive,
    PartyPopper, Heart, Briefcase, GraduationCap, Music, Handshake,
    Presentation, Users, Image as ImageIcon, Gift, Building2, CalendarDays
} from 'lucide-react';
import { eventTemplateRegistry, getEventTemplateComponent } from './templates';
import { getDefaultEventPageData } from './data/sampleData';
import { useEventDownload } from './hooks/useEventDownload';
import type {
    EventPageType, EventPageData, Speaker, AgendaItem, TicketTier,
    FAQItem, EventTemplateId, DeviceFrame, EventDownloadFormat
} from './types';

const EVENT_TYPES: { id: EventPageType; label: string; icon: React.FC<any> }[] = [
    { id: 'conference', label: 'Conference', icon: Presentation },
    { id: 'wedding', label: 'Wedding', icon: Heart },
    { id: 'product-launch', label: 'Product Launch', icon: PartyPopper },
    { id: 'workshop', label: 'Workshop', icon: Users },
    { id: 'meetup', label: 'Meetup', icon: Handshake },
    { id: 'festival', label: 'Festival', icon: Music },
    { id: 'charity', label: 'Charity', icon: Gift },
    { id: 'webinar', label: 'Webinar', icon: Monitor },
    { id: 'exhibition', label: 'Exhibition', icon: ImageIcon },
    { id: 'birthday', label: 'Birthday', icon: CalendarDays },
    { id: 'corporate', label: 'Corporate', icon: Building2 },
    { id: 'graduation', label: 'Graduation', icon: GraduationCap },
];

const DEVICE_FRAMES: { id: DeviceFrame; label: string; icon: React.FC<any>; width: number }[] = [
    { id: 'desktop', label: 'Desktop', icon: Monitor, width: 900 },
    { id: 'tablet', label: 'Tablet', icon: Tablet, width: 580 },
    { id: 'mobile', label: 'Mobile', icon: Smartphone, width: 360 },
];

export const EventPageCreator: React.FC = () => {
    const [data, setData] = useState<EventPageData>(getDefaultEventPageData('conference'));
    const [activeTab, setActiveTab] = useState<'content' | 'sections' | 'style' | 'export'>('content');
    const [deviceFrame, setDeviceFrame] = useState<DeviceFrame>('desktop');
    const [expandedSection, setExpandedSection] = useState<string | null>('speakers');
    const { downloadAsHTML, downloadAsPDF, downloadAsZIP } = useEventDownload();

    const TemplateComponent = getEventTemplateComponent(data.template);
    const currentDevice = DEVICE_FRAMES.find(d => d.id === deviceFrame) || DEVICE_FRAMES[0];

    const updateField = useCallback(<K extends keyof EventPageData>(key: K, value: EventPageData[K]) => {
        setData(prev => ({ ...prev, [key]: value }));
    }, []);

    const changeEventType = useCallback((type: EventPageType) => {
        setData(getDefaultEventPageData(type));
    }, []);

    const handleDownload = useCallback((format: EventDownloadFormat) => {
        if (format === 'html') downloadAsHTML(data);
        else if (format === 'pdf') downloadAsPDF(data);
        else if (format === 'zip') downloadAsZIP(data);
    }, [data, downloadAsHTML, downloadAsPDF, downloadAsZIP]);

    // ─── Helpers for array sections ───
    const addSpeaker = () => updateField('speakers', [...data.speakers, { name: '', role: '', company: '', bio: '', photoUrl: '' }]);
    const removeSpeaker = (i: number) => updateField('speakers', data.speakers.filter((_, idx) => idx !== i));
    const updateSpeaker = (i: number, field: keyof Speaker, val: string) => {
        const arr = [...data.speakers]; arr[i] = { ...arr[i], [field]: val }; updateField('speakers', arr);
    };

    const addAgenda = () => updateField('agenda', [...data.agenda, { time: '', title: '', description: '', speaker: '' }]);
    const removeAgenda = (i: number) => updateField('agenda', data.agenda.filter((_, idx) => idx !== i));
    const updateAgenda = (i: number, field: keyof AgendaItem, val: string) => {
        const arr = [...data.agenda]; arr[i] = { ...arr[i], [field]: val }; updateField('agenda', arr);
    };

    const addTicket = () => updateField('tickets', [...data.tickets, { name: '', price: '', features: [], highlighted: false }]);
    const removeTicket = (i: number) => updateField('tickets', data.tickets.filter((_, idx) => idx !== i));
    const updateTicket = (i: number, field: keyof TicketTier, val: any) => {
        const arr = [...data.tickets]; arr[i] = { ...arr[i], [field]: val }; updateField('tickets', arr);
    };

    const addFaq = () => updateField('faqs', [...data.faqs, { question: '', answer: '' }]);
    const removeFaq = (i: number) => updateField('faqs', data.faqs.filter((_, idx) => idx !== i));
    const updateFaq = (i: number, field: keyof FAQItem, val: string) => {
        const arr = [...data.faqs]; arr[i] = { ...arr[i], [field]: val }; updateField('faqs', arr);
    };

    const Input: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
        <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
            <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                className="w-full text-xs border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400" />
        </div>
    );

    const TextArea: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }> = ({ label, value, onChange, placeholder, rows = 3 }) => (
        <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
            <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
                className="w-full text-xs border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 resize-none" />
        </div>
    );

    const SectionHeader: React.FC<{ id: string; title: string; count: number }> = ({ id, title, count }) => (
        <button onClick={() => setExpandedSection(prev => prev === id ? null : id)}
            className="w-full flex items-center justify-between py-2 text-xs font-semibold text-slate-700">
            <span>{title} ({count})</span>
            {expandedSection === id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
    );

    return (
        <div className="h-full flex flex-col bg-gradient-to-br from-violet-50/30 to-slate-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shadow-sm shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <Globe size={16} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-slate-800">Event Landing Page</h1>
                        <p className="text-[10px] text-slate-400">Generate pro event pages</p>
                    </div>
                </div>
                {/* Device Frame Switcher */}
                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                    {DEVICE_FRAMES.map(d => {
                        const Icon = d.icon;
                        return (
                            <button key={d.id} onClick={() => setDeviceFrame(d.id)} title={d.label}
                                className={`p-1.5 rounded-md transition-all ${deviceFrame === d.id ? 'bg-white shadow-sm text-violet-600' : 'text-slate-400 hover:text-slate-600'}`}>
                                <Icon size={14} />
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main */}
            <div className="flex-1 flex overflow-hidden">
                {/* ─── Left Panel ─── */}
                <div className="w-[340px] shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-200 shrink-0">
                        {[
                            { id: 'content' as const, label: 'Content', icon: TypeIcon },
                            { id: 'sections' as const, label: 'Sections', icon: Users },
                            { id: 'style' as const, label: 'Style', icon: Palette },
                            { id: 'export' as const, label: 'Export', icon: Download },
                        ].map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-[10px] font-semibold border-b-2 transition-all ${activeTab === tab.id ? 'border-violet-500 text-violet-600 bg-violet-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'
                                    }`}>
                                <tab.icon size={12} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Panel body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {activeTab === 'content' && (
                            <>
                                {/* Event Type */}
                                <div>
                                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Event Type</label>
                                    <div className="grid grid-cols-3 gap-1.5">
                                        {EVENT_TYPES.map(et => {
                                            const Icon = et.icon;
                                            const active = data.eventType === et.id;
                                            return (
                                                <button key={et.id} onClick={() => changeEventType(et.id)}
                                                    className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg border text-[9px] font-medium transition-all ${active ? 'border-violet-400 bg-violet-50 text-violet-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                                                        }`}>
                                                    <Icon size={14} />
                                                    {et.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <Input label="Event Name" value={data.eventName} onChange={v => updateField('eventName', v)} placeholder="TechSummit 2025" />
                                <Input label="Tagline" value={data.tagline} onChange={v => updateField('tagline', v)} placeholder="Where Innovation Meets Inspiration" />
                                <TextArea label="Description" value={data.description} onChange={v => updateField('description', v)} placeholder="Describe your event..." rows={3} />

                                <div className="grid grid-cols-2 gap-2">
                                    <Input label="Start Date" value={data.eventDate} onChange={v => updateField('eventDate', v)} placeholder="2025-06-14" />
                                    <Input label="End Date" value={data.eventEndDate} onChange={v => updateField('eventEndDate', v)} placeholder="2025-06-15" />
                                </div>
                                <Input label="Time" value={data.eventTime} onChange={v => updateField('eventTime', v)} placeholder="09:00 AM - 06:00 PM" />
                                <Input label="Venue" value={data.venue} onChange={v => updateField('venue', v)} placeholder="Convention Centre" />
                                <div className="grid grid-cols-2 gap-2">
                                    <Input label="Address" value={data.address} onChange={v => updateField('address', v)} placeholder="123 Main Road" />
                                    <Input label="City" value={data.city} onChange={v => updateField('city', v)} placeholder="Chennai" />
                                </div>

                                <Input label="CTA Button Text" value={data.ctaText} onChange={v => updateField('ctaText', v)} placeholder="Register Now" />
                                <Input label="CTA Link" value={data.ctaUrl} onChange={v => updateField('ctaUrl', v)} placeholder="#register" />

                                {/* Organizer */}
                                <div className="pt-2 border-t border-slate-100">
                                    <Input label="Organizer Name" value={data.organizerName} onChange={v => updateField('organizerName', v)} placeholder="TechSummit Foundation" />
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <Input label="Email" value={data.contactEmail} onChange={v => updateField('contactEmail', v)} placeholder="hello@event.com" />
                                        <Input label="Phone" value={data.contactPhone} onChange={v => updateField('contactPhone', v)} placeholder="+91 98765 43210" />
                                    </div>
                                    <Input label="Website" value={data.website} onChange={v => updateField('website', v)} placeholder="https://event.com" />
                                </div>
                            </>
                        )}

                        {activeTab === 'sections' && (
                            <>
                                {/* Speakers */}
                                <div>
                                    <SectionHeader id="speakers" title="Speakers" count={data.speakers.length} />
                                    {expandedSection === 'speakers' && (
                                        <div className="space-y-3 mt-2">
                                            {data.speakers.map((s, i) => (
                                                <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 relative">
                                                    <button onClick={() => removeSpeaker(i)} className="absolute top-2 right-2 p-0.5 text-red-400 hover:text-red-600"><Trash2 size={11} /></button>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <Input label="Name" value={s.name} onChange={v => updateSpeaker(i, 'name', v)} placeholder="Dr. Sarah Chen" />
                                                        <Input label="Role" value={s.role} onChange={v => updateSpeaker(i, 'role', v)} placeholder="CTO" />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                                        <Input label="Company" value={s.company} onChange={v => updateSpeaker(i, 'company', v)} placeholder="TechCorp" />
                                                        <Input label="Bio" value={s.bio} onChange={v => updateSpeaker(i, 'bio', v)} placeholder="Short bio..." />
                                                    </div>
                                                </div>
                                            ))}
                                            <button onClick={addSpeaker} className="w-full flex items-center justify-center gap-1 py-2 border border-dashed border-violet-300 rounded-lg text-violet-500 text-xs font-semibold hover:bg-violet-50 transition-colors">
                                                <Plus size={12} /> Add Speaker
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Agenda */}
                                <div>
                                    <SectionHeader id="agenda" title="Agenda" count={data.agenda.length} />
                                    {expandedSection === 'agenda' && (
                                        <div className="space-y-3 mt-2">
                                            {data.agenda.map((a, i) => (
                                                <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 relative">
                                                    <button onClick={() => removeAgenda(i)} className="absolute top-2 right-2 p-0.5 text-red-400 hover:text-red-600"><Trash2 size={11} /></button>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <Input label="Time" value={a.time} onChange={v => updateAgenda(i, 'time', v)} placeholder="09:00 AM" />
                                                        <div className="col-span-2"><Input label="Title" value={a.title} onChange={v => updateAgenda(i, 'title', v)} placeholder="Keynote Address" /></div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                                        <Input label="Description" value={a.description} onChange={v => updateAgenda(i, 'description', v)} placeholder="Session details..." />
                                                        <Input label="Speaker" value={a.speaker || ''} onChange={v => updateAgenda(i, 'speaker', v)} placeholder="Speaker name" />
                                                    </div>
                                                </div>
                                            ))}
                                            <button onClick={addAgenda} className="w-full flex items-center justify-center gap-1 py-2 border border-dashed border-violet-300 rounded-lg text-violet-500 text-xs font-semibold hover:bg-violet-50 transition-colors">
                                                <Plus size={12} /> Add Agenda Item
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Tickets */}
                                <div>
                                    <SectionHeader id="tickets" title="Tickets" count={data.tickets.length} />
                                    {expandedSection === 'tickets' && (
                                        <div className="space-y-3 mt-2">
                                            {data.tickets.map((t, i) => (
                                                <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 relative">
                                                    <button onClick={() => removeTicket(i)} className="absolute top-2 right-2 p-0.5 text-red-400 hover:text-red-600"><Trash2 size={11} /></button>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <Input label="Tier Name" value={t.name} onChange={v => updateTicket(i, 'name', v)} placeholder="VIP" />
                                                        <Input label="Price" value={t.price} onChange={v => updateTicket(i, 'price', v)} placeholder="₹1,999" />
                                                    </div>
                                                    <div className="mt-2">
                                                        <Input label="Features (comma separated)" value={t.features.join(', ')} onChange={v => updateTicket(i, 'features', v.split(',').map(s => s.trim()))} placeholder="All sessions, Lunch, Certificate" />
                                                    </div>
                                                    <label className="flex items-center gap-2 mt-2 text-xs text-slate-600 cursor-pointer">
                                                        <input type="checkbox" checked={t.highlighted} onChange={e => updateTicket(i, 'highlighted', e.target.checked)} className="rounded text-violet-500" />
                                                        Highlight as recommended
                                                    </label>
                                                </div>
                                            ))}
                                            <button onClick={addTicket} className="w-full flex items-center justify-center gap-1 py-2 border border-dashed border-violet-300 rounded-lg text-violet-500 text-xs font-semibold hover:bg-violet-50 transition-colors">
                                                <Plus size={12} /> Add Ticket Tier
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* FAQ */}
                                <div>
                                    <SectionHeader id="faqs" title="FAQ" count={data.faqs.length} />
                                    {expandedSection === 'faqs' && (
                                        <div className="space-y-3 mt-2">
                                            {data.faqs.map((f, i) => (
                                                <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 relative">
                                                    <button onClick={() => removeFaq(i)} className="absolute top-2 right-2 p-0.5 text-red-400 hover:text-red-600"><Trash2 size={11} /></button>
                                                    <Input label="Question" value={f.question} onChange={v => updateFaq(i, 'question', v)} placeholder="What's included?" />
                                                    <div className="mt-2">
                                                        <TextArea label="Answer" value={f.answer} onChange={v => updateFaq(i, 'answer', v)} placeholder="Your answer..." rows={2} />
                                                    </div>
                                                </div>
                                            ))}
                                            <button onClick={addFaq} className="w-full flex items-center justify-center gap-1 py-2 border border-dashed border-violet-300 rounded-lg text-violet-500 text-xs font-semibold hover:bg-violet-50 transition-colors">
                                                <Plus size={12} /> Add FAQ
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {activeTab === 'style' && (
                            <>
                                {/* Template Gallery */}
                                <div>
                                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Template</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {eventTemplateRegistry.map(t => (
                                            <button key={t.id} onClick={() => updateField('template', t.id)}
                                                className={`relative rounded-lg border-2 overflow-hidden text-left transition-all ${data.template === t.id ? 'border-violet-500 ring-2 ring-violet-200' : 'border-slate-200 hover:border-slate-300'
                                                    }`}>
                                                <div className="h-16 flex items-center justify-center text-[10px] font-bold text-white"
                                                    style={{ background: t.previewGradient }}>
                                                    {t.name}
                                                </div>
                                                <div className="px-2 py-1.5 bg-white">
                                                    <p className="text-[9px] font-semibold text-slate-700">{t.name}</p>
                                                    <p className="text-[7px] text-slate-400">{t.description}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Colors */}
                                <div>
                                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Brand Colors</label>
                                    <div className="flex items-center gap-3">
                                        {['primaryColor', 'secondaryColor', 'accentColor'].map(c => (
                                            <label key={c} className="flex items-center gap-1 cursor-pointer">
                                                <input type="color" value={(data as any)[c]} onChange={e => updateField(c as any, e.target.value)}
                                                    className="w-7 h-7 rounded cursor-pointer border-0 p-0" />
                                                <span className="text-[8px] text-slate-400 capitalize">{c.replace('Color', '')}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'export' && (
                            <>
                                <div>
                                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Download</label>
                                    <div className="space-y-2">
                                        {[
                                            { format: 'html' as const, icon: FileCode, label: 'HTML Page', desc: 'Single HTML file, opens in any browser' },
                                            { format: 'pdf' as const, icon: FileDown, label: 'PDF Document', desc: 'Multi-page A4 PDF, ready to print or share' },
                                            { format: 'zip' as const, icon: Archive, label: 'ZIP Package', desc: 'HTML + README in a ZIP archive' },
                                        ].map(d => {
                                            const Icon = d.icon;
                                            return (
                                                <button key={d.format} onClick={() => handleDownload(d.format)}
                                                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98]">
                                                    <Icon size={18} />
                                                    <div className="text-left">
                                                        <div className="text-xs font-bold">{d.label}</div>
                                                        <div className="text-[9px] opacity-70">{d.desc}</div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* ─── Right Panel — Preview ─── */}
                <div className="flex-1 flex flex-col items-center overflow-auto bg-slate-100/50 p-6">
                    {/* Device frame wrapper */}
                    <div className="relative" style={{ width: `${currentDevice.width}px`, maxWidth: '100%' }}>
                        {/* Browser chrome */}
                        <div className="bg-slate-800 rounded-t-lg px-3 py-2 flex items-center gap-2">
                            <div className="flex gap-1">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                            </div>
                            <div className="flex-1 bg-slate-700 rounded px-3 py-0.5 text-[9px] text-slate-400 truncate">
                                https://{data.eventName.toLowerCase().replace(/\s+/g, '-')}.events.com
                            </div>
                        </div>
                        {/* Page content */}
                        <div className="bg-white border border-slate-200 rounded-b-lg overflow-hidden shadow-2xl"
                            style={{ height: deviceFrame === 'desktop' ? '600px' : deviceFrame === 'tablet' ? '700px' : '600px' }}>
                            <div className="w-full h-full overflow-y-auto" id="event-page-preview">
                                <TemplateComponent data={data} />
                            </div>
                        </div>
                        {/* Badge */}
                        <div className="flex justify-center mt-3">
                            <div className="bg-white rounded-full px-3 py-1 shadow-md flex items-center gap-1.5">
                                <Eye size={10} className="text-violet-500" />
                                <span className="text-[9px] font-semibold text-slate-600">{currentDevice.label} • {currentDevice.width}px</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
