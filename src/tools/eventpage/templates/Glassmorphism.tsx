import React from 'react';
import type { EventTemplateProps } from '../types';
import { useCountdown } from '../hooks/useCountdown';

/** Glassmorphism — Frosted glass, gradient background */
export const Glassmorphism: React.FC<EventTemplateProps> = ({ data }) => {
    const countdown = useCountdown(data.eventDate);
    const glass = { background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px' };

    return (
        <div style={{ background: `linear-gradient(135deg, ${data.primaryColor}dd, ${data.secondaryColor}cc, #1a1a2e)`, color: '#e2e8f0', fontFamily: "'Inter', sans-serif", minHeight: '100%', position: 'relative' }}>
            {/* Decorative blobs */}
            <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '40%', height: '40%', borderRadius: '50%', background: data.primaryColor, opacity: 0.15, filter: 'blur(80px)' }} />
            <div style={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '35%', height: '35%', borderRadius: '50%', background: data.accentColor, opacity: 0.1, filter: 'blur(80px)' }} />

            {/* Hero */}
            <section style={{ position: 'relative', padding: '80px 40px', textAlign: 'center', zIndex: 1 }}>
                <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                    <p style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', opacity: 0.6, marginBottom: '16px' }}>{data.eventDate} • {data.city}</p>
                    <h1 style={{ fontSize: '40px', fontWeight: 800, lineHeight: 1.15, marginBottom: '16px' }}>{data.eventName}</h1>
                    <p style={{ fontSize: '15px', opacity: 0.7, maxWidth: '450px', margin: '0 auto 28px', lineHeight: 1.6 }}>{data.tagline}</p>
                    <button style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', padding: '14px 36px', borderRadius: '50px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', letterSpacing: '1px' }}>{data.ctaText}</button>

                    {/* Countdown */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '40px' }}>
                        {[{ v: countdown.days, l: 'Days' }, { v: countdown.hours, l: 'Hours' }, { v: countdown.mins, l: 'Min' }, { v: countdown.secs, l: 'Sec' }].map(c => (
                            <div key={c.l} style={{ ...glass, padding: '16px 18px', minWidth: '65px' }}>
                                <div style={{ fontSize: '26px', fontWeight: 800 }}>{String(c.v).padStart(2, '0')}</div>
                                <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '4px', opacity: 0.5 }}>{c.l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About */}
            <section style={{ position: 'relative', zIndex: 1, padding: '50px 40px', maxWidth: '700px', margin: '0 auto' }}>
                <div style={{ ...glass, padding: '32px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '14px' }}>About</h2>
                    <p style={{ fontSize: '13px', lineHeight: 1.8, opacity: 0.7 }}>{data.description}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '20px' }}>
                        {[{ l: '📅 Date', v: data.eventDate }, { l: '⏰ Time', v: data.eventTime }, { l: '📍 Venue', v: data.venue }].map(info => (
                            <div key={info.l} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                                <div style={{ fontSize: '10px', opacity: 0.5, marginBottom: '4px' }}>{info.l}</div>
                                <div style={{ fontSize: '12px', fontWeight: 600 }}>{info.v}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Speakers */}
            {data.speakers.length > 0 && (
                <section style={{ position: 'relative', zIndex: 1, padding: '50px 40px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, textAlign: 'center', marginBottom: '28px' }}>Speakers</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(data.speakers.length, 3)}, 1fr)`, gap: '16px', maxWidth: '700px', margin: '0 auto' }}>
                        {data.speakers.map((s, i) => (
                            <div key={i} style={{ ...glass, padding: '24px', textAlign: 'center' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700 }}>{s.name[0]}</div>
                                <h3 style={{ fontSize: '14px', fontWeight: 700 }}>{s.name}</h3>
                                <p style={{ fontSize: '10px', color: data.accentColor, fontWeight: 600, marginTop: '2px' }}>{s.role}, {s.company}</p>
                                <p style={{ fontSize: '10px', opacity: 0.5, marginTop: '6px', lineHeight: 1.4 }}>{s.bio}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Agenda */}
            {data.agenda.length > 0 && (
                <section style={{ position: 'relative', zIndex: 1, padding: '50px 40px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, textAlign: 'center', marginBottom: '28px' }}>Schedule</h2>
                    <div style={{ ...glass, padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
                        {data.agenda.map((a, i) => (
                            <div key={i} style={{ display: 'flex', gap: '14px', padding: '14px 0', borderBottom: i < data.agenda.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                                <div style={{ minWidth: '70px', fontSize: '11px', fontWeight: 700, color: data.accentColor }}>{a.time}</div>
                                <div>
                                    <h3 style={{ fontSize: '13px', fontWeight: 600 }}>{a.title}</h3>
                                    <p style={{ fontSize: '10px', opacity: 0.5, marginTop: '3px' }}>{a.description}</p>
                                    {a.speaker && <p style={{ fontSize: '10px', color: data.accentColor, marginTop: '3px' }}>🎤 {a.speaker}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Tickets */}
            {data.tickets.length > 0 && (
                <section style={{ position: 'relative', zIndex: 1, padding: '50px 40px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, textAlign: 'center', marginBottom: '28px' }}>Tickets</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(data.tickets.length, 3)}, 1fr)`, gap: '16px', maxWidth: '700px', margin: '0 auto' }}>
                        {data.tickets.map((t, i) => (
                            <div key={i} style={{ ...glass, padding: '28px 20px', textAlign: 'center', border: t.highlighted ? `2px solid ${data.accentColor}` : glass.border }}>
                                <h3 style={{ fontSize: '15px', fontWeight: 700 }}>{t.name}</h3>
                                <div style={{ fontSize: '28px', fontWeight: 800, margin: '10px 0', color: data.accentColor }}>{t.price}</div>
                                <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0' }}>
                                    {t.features.map((f, fi) => (
                                        <li key={fi} style={{ fontSize: '11px', padding: '5px 0', opacity: 0.6 }}>✓ {f}</li>
                                    ))}
                                </ul>
                                <button style={{ background: t.highlighted ? data.accentColor : 'rgba(255,255,255,0.1)', color: t.highlighted ? '#000' : '#fff', border: t.highlighted ? 'none' : '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '50px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', width: '100%' }}>Select</button>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* FAQ */}
            {data.faqs.length > 0 && (
                <section style={{ position: 'relative', zIndex: 1, padding: '50px 40px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, textAlign: 'center', marginBottom: '28px' }}>FAQ</h2>
                    <div style={{ ...glass, padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
                        {data.faqs.map((f, i) => (
                            <div key={i} style={{ padding: '14px 0', borderBottom: i < data.faqs.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                                <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>{f.question}</h3>
                                <p style={{ fontSize: '11px', opacity: 0.5, lineHeight: 1.6 }}>{f.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Venue + Footer */}
            <section style={{ position: 'relative', zIndex: 1, padding: '50px 40px', textAlign: 'center' }}>
                <div style={{ ...glass, padding: '28px', maxWidth: '500px', margin: '0 auto 30px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>📍 Venue</h2>
                    <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{data.venue}</h3>
                    <p style={{ fontSize: '12px', opacity: 0.6, marginTop: '6px' }}>{data.address}, {data.city}</p>
                </div>
            </section>

            <footer style={{ position: 'relative', zIndex: 1, padding: '30px 40px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <p style={{ fontSize: '12px', fontWeight: 600 }}>{data.organizerName}</p>
                <p style={{ fontSize: '10px', opacity: 0.4, marginTop: '4px' }}>{data.contactEmail} • {data.contactPhone}</p>
                <p style={{ fontSize: '9px', opacity: 0.2, marginTop: '12px' }}>© 2025 {data.organizerName}</p>
            </footer>
        </div>
    );
};
