import React from 'react';
import type { EventTemplateProps } from '../types';
import { useCountdown } from '../hooks/useCountdown';

/** Neon Dark — Dark background with vibrant neon accents */
export const NeonDark: React.FC<EventTemplateProps> = ({ data }) => {
    const countdown = useCountdown(data.eventDate);

    return (
        <div style={{ background: '#0a0a0f', color: '#e2e8f0', fontFamily: "'Inter', sans-serif", minHeight: '100%' }}>
            {/* Hero */}
            <section style={{ position: 'relative', padding: '80px 40px', textAlign: 'center', background: `linear-gradient(135deg, #0a0a0f 0%, ${data.primaryColor}15 50%, #0a0a0f 100%)`, borderBottom: `1px solid ${data.primaryColor}30` }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `radial-gradient(ellipse at center, ${data.primaryColor}08 0%, transparent 70%)` }} />
                <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', margin: '0 auto' }}>
                    <p style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: data.accentColor, marginBottom: '16px', fontWeight: 600 }}>{data.eventDate} • {data.city}</p>
                    <h1 style={{ fontSize: '42px', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px', background: `linear-gradient(135deg, ${data.primaryColor}, ${data.secondaryColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{data.eventName}</h1>
                    <p style={{ fontSize: '16px', opacity: 0.7, marginBottom: '24px', lineHeight: 1.6 }}>{data.tagline}</p>
                    <button style={{ background: `linear-gradient(135deg, ${data.primaryColor}, ${data.secondaryColor})`, color: '#fff', border: 'none', padding: '14px 36px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', letterSpacing: '1px' }}>{data.ctaText}</button>

                    {/* Countdown */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
                        {[{ v: countdown.days, l: 'Days' }, { v: countdown.hours, l: 'Hrs' }, { v: countdown.mins, l: 'Min' }, { v: countdown.secs, l: 'Sec' }].map(c => (
                            <div key={c.l} style={{ background: `${data.primaryColor}15`, border: `1px solid ${data.primaryColor}30`, borderRadius: '12px', padding: '16px 20px', minWidth: '70px' }}>
                                <div style={{ fontSize: '28px', fontWeight: 800, color: data.primaryColor }}>{String(c.v).padStart(2, '0')}</div>
                                <div style={{ fontSize: '10px', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '2px', marginTop: '4px' }}>{c.l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About */}
            <section style={{ padding: '60px 40px', maxWidth: '700px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', color: data.primaryColor }}>About the Event</h2>
                <p style={{ fontSize: '14px', lineHeight: 1.8, opacity: 0.7 }}>{data.description}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '24px' }}>
                    <div style={{ background: `${data.primaryColor}10`, borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.5, marginBottom: '6px' }}>Date</div>
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>{data.eventDate}</div>
                    </div>
                    <div style={{ background: `${data.primaryColor}10`, borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.5, marginBottom: '6px' }}>Time</div>
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>{data.eventTime}</div>
                    </div>
                    <div style={{ background: `${data.primaryColor}10`, borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.5, marginBottom: '6px' }}>Venue</div>
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>{data.venue}</div>
                    </div>
                </div>
            </section>

            {/* Speakers */}
            {data.speakers.length > 0 && (
                <section style={{ padding: '60px 40px', borderTop: `1px solid ${data.primaryColor}15` }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, textAlign: 'center', marginBottom: '32px', color: data.primaryColor }}>Speakers</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(data.speakers.length, 3)}, 1fr)`, gap: '20px', maxWidth: '700px', margin: '0 auto' }}>
                        {data.speakers.map((s, i) => (
                            <div key={i} style={{ background: `${data.primaryColor}08`, border: `1px solid ${data.primaryColor}20`, borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `linear-gradient(135deg, ${data.primaryColor}, ${data.secondaryColor})`, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, color: '#fff' }}>{s.name[0]}</div>
                                <h3 style={{ fontSize: '14px', fontWeight: 700 }}>{s.name}</h3>
                                <p style={{ fontSize: '11px', color: data.primaryColor, fontWeight: 600, marginTop: '4px' }}>{s.role}, {s.company}</p>
                                <p style={{ fontSize: '11px', opacity: 0.5, marginTop: '8px', lineHeight: 1.5 }}>{s.bio}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Agenda */}
            {data.agenda.length > 0 && (
                <section style={{ padding: '60px 40px', borderTop: `1px solid ${data.primaryColor}15` }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, textAlign: 'center', marginBottom: '32px', color: data.primaryColor }}>Agenda</h2>
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        {data.agenda.map((a, i) => (
                            <div key={i} style={{ display: 'flex', gap: '16px', padding: '16px 0', borderBottom: `1px solid ${data.primaryColor}10` }}>
                                <div style={{ minWidth: '80px', fontSize: '12px', fontWeight: 700, color: data.accentColor }}>{a.time}</div>
                                <div>
                                    <h3 style={{ fontSize: '14px', fontWeight: 600 }}>{a.title}</h3>
                                    <p style={{ fontSize: '11px', opacity: 0.5, marginTop: '4px' }}>{a.description}</p>
                                    {a.speaker && <p style={{ fontSize: '10px', color: data.primaryColor, fontWeight: 600, marginTop: '4px' }}>🎤 {a.speaker}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Tickets */}
            {data.tickets.length > 0 && (
                <section style={{ padding: '60px 40px', borderTop: `1px solid ${data.primaryColor}15` }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, textAlign: 'center', marginBottom: '32px', color: data.primaryColor }}>Tickets</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(data.tickets.length, 3)}, 1fr)`, gap: '16px', maxWidth: '700px', margin: '0 auto' }}>
                        {data.tickets.map((t, i) => (
                            <div key={i} style={{ background: t.highlighted ? `linear-gradient(135deg, ${data.primaryColor}20, ${data.secondaryColor}20)` : `${data.primaryColor}08`, border: `1px solid ${t.highlighted ? data.primaryColor : data.primaryColor + '20'}`, borderRadius: '16px', padding: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                                {t.highlighted && <div style={{ position: 'absolute', top: '12px', right: '-28px', background: data.accentColor, color: '#000', fontSize: '9px', fontWeight: 700, padding: '4px 32px', transform: 'rotate(45deg)' }}>POPULAR</div>}
                                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{t.name}</h3>
                                <div style={{ fontSize: '28px', fontWeight: 800, margin: '12px 0', color: data.primaryColor }}>{t.price}</div>
                                <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0' }}>
                                    {t.features.map((f, fi) => (
                                        <li key={fi} style={{ fontSize: '11px', padding: '6px 0', opacity: 0.7, borderTop: fi > 0 ? `1px solid ${data.primaryColor}10` : 'none' }}>✓ {f}</li>
                                    ))}
                                </ul>
                                <button style={{ background: t.highlighted ? `linear-gradient(135deg, ${data.primaryColor}, ${data.secondaryColor})` : 'transparent', color: t.highlighted ? '#fff' : data.primaryColor, border: t.highlighted ? 'none' : `1px solid ${data.primaryColor}`, padding: '10px 24px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', width: '100%' }}>Get Ticket</button>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* FAQ */}
            {data.faqs.length > 0 && (
                <section style={{ padding: '60px 40px', borderTop: `1px solid ${data.primaryColor}15` }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, textAlign: 'center', marginBottom: '32px', color: data.primaryColor }}>FAQ</h2>
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        {data.faqs.map((f, i) => (
                            <div key={i} style={{ padding: '16px 0', borderBottom: `1px solid ${data.primaryColor}10` }}>
                                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>{f.question}</h3>
                                <p style={{ fontSize: '12px', opacity: 0.6, lineHeight: 1.6 }}>{f.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Venue */}
            <section style={{ padding: '60px 40px', borderTop: `1px solid ${data.primaryColor}15` }}>
                <h2 style={{ fontSize: '24px', fontWeight: 700, textAlign: 'center', marginBottom: '32px', color: data.primaryColor }}>Venue</h2>
                <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{data.venue}</h3>
                    <p style={{ fontSize: '13px', opacity: 0.6, marginTop: '8px' }}>{data.address}, {data.city}</p>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '40px', borderTop: `1px solid ${data.primaryColor}15`, textAlign: 'center' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>{data.organizerName}</h3>
                <p style={{ fontSize: '11px', opacity: 0.5 }}>{data.contactEmail} • {data.contactPhone}</p>
                <p style={{ fontSize: '10px', opacity: 0.3, marginTop: '16px' }}>© 2025 {data.organizerName}. All rights reserved.</p>
            </footer>
        </div>
    );
};
