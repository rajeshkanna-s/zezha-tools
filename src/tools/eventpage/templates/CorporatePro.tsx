import React from 'react';
import type { EventTemplateProps } from '../types';
import { useCountdown } from '../hooks/useCountdown';

/** Corporate Pro — Clean white/grey, professional look */
export const CorporatePro: React.FC<EventTemplateProps> = ({ data }) => {
    const countdown = useCountdown(data.eventDate);

    return (
        <div style={{ background: '#ffffff', color: '#1e293b', fontFamily: "'Inter', sans-serif", minHeight: '100%' }}>
            {/* Hero */}
            <section style={{ background: `linear-gradient(135deg, ${data.primaryColor}, ${data.secondaryColor})`, color: '#fff', padding: '70px 40px', textAlign: 'center' }}>
                <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.8, marginBottom: '12px' }}>{data.eventDate} • {data.city}</p>
                <h1 style={{ fontSize: '38px', fontWeight: 800, lineHeight: 1.2, marginBottom: '14px' }}>{data.eventName}</h1>
                <p style={{ fontSize: '15px', opacity: 0.85, maxWidth: '500px', margin: '0 auto 24px', lineHeight: 1.5 }}>{data.tagline}</p>
                <button style={{ background: '#fff', color: data.primaryColor, border: 'none', padding: '13px 36px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>{data.ctaText}</button>

                {/* Countdown */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '36px' }}>
                    {[{ v: countdown.days, l: 'Days' }, { v: countdown.hours, l: 'Hours' }, { v: countdown.mins, l: 'Minutes' }, { v: countdown.secs, l: 'Seconds' }].map(c => (
                        <div key={c.l} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '8px', padding: '14px 18px', minWidth: '65px' }}>
                            <div style={{ fontSize: '24px', fontWeight: 800 }}>{String(c.v).padStart(2, '0')}</div>
                            <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px', opacity: 0.7 }}>{c.l}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* About */}
            <section style={{ padding: '56px 40px', maxWidth: '700px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '14px', color: data.primaryColor }}>About</h2>
                <p style={{ fontSize: '14px', lineHeight: 1.8, color: '#475569' }}>{data.description}</p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                    {[{ l: 'Venue', v: data.venue }, { l: 'Date', v: data.eventDate }, { l: 'Time', v: data.eventTime }].map(info => (
                        <div key={info.l} style={{ flex: 1, background: '#f8fafc', borderRadius: '10px', padding: '18px', borderLeft: `3px solid ${data.primaryColor}` }}>
                            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>{info.l}</div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{info.v}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Speakers */}
            {data.speakers.length > 0 && (
                <section style={{ padding: '56px 40px', background: '#f8fafc' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, textAlign: 'center', marginBottom: '28px', color: data.primaryColor }}>Our Speakers</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(data.speakers.length, 3)}, 1fr)`, gap: '20px', maxWidth: '700px', margin: '0 auto' }}>
                        {data.speakers.map((s, i) => (
                            <div key={i} style={{ background: '#fff', borderRadius: '12px', padding: '24px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: `linear-gradient(135deg, ${data.primaryColor}, ${data.secondaryColor})`, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, color: '#fff' }}>{s.name[0]}</div>
                                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>{s.name}</h3>
                                <p style={{ fontSize: '11px', color: data.primaryColor, fontWeight: 600, marginTop: '2px' }}>{s.role}, {s.company}</p>
                                <p style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', lineHeight: 1.4 }}>{s.bio}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Agenda */}
            {data.agenda.length > 0 && (
                <section style={{ padding: '56px 40px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, textAlign: 'center', marginBottom: '28px', color: data.primaryColor }}>Schedule</h2>
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        {data.agenda.map((a, i) => (
                            <div key={i} style={{ display: 'flex', gap: '16px', padding: '14px 16px', borderRadius: '8px', background: i % 2 === 0 ? '#f8fafc' : 'transparent', marginBottom: '4px' }}>
                                <div style={{ minWidth: '75px', fontSize: '12px', fontWeight: 700, color: data.primaryColor }}>{a.time}</div>
                                <div>
                                    <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{a.title}</h3>
                                    <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{a.description}</p>
                                    {a.speaker && <p style={{ fontSize: '10px', color: data.primaryColor, marginTop: '4px', fontWeight: 500 }}>Speaker: {a.speaker}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Tickets */}
            {data.tickets.length > 0 && (
                <section style={{ padding: '56px 40px', background: '#f8fafc' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, textAlign: 'center', marginBottom: '28px', color: data.primaryColor }}>Pricing</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(data.tickets.length, 3)}, 1fr)`, gap: '16px', maxWidth: '700px', margin: '0 auto' }}>
                        {data.tickets.map((t, i) => (
                            <div key={i} style={{ background: '#fff', border: t.highlighted ? `2px solid ${data.primaryColor}` : '1px solid #e2e8f0', borderRadius: '12px', padding: '28px 20px', textAlign: 'center', position: 'relative', boxShadow: t.highlighted ? `0 4px 12px ${data.primaryColor}20` : 'none' }}>
                                {t.highlighted && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: data.primaryColor, color: '#fff', fontSize: '9px', fontWeight: 700, padding: '4px 14px', borderRadius: '20px' }}>RECOMMENDED</div>}
                                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>{t.name}</h3>
                                <div style={{ fontSize: '30px', fontWeight: 800, margin: '14px 0', color: data.primaryColor }}>{t.price}</div>
                                <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0' }}>
                                    {t.features.map((f, fi) => (
                                        <li key={fi} style={{ fontSize: '12px', padding: '5px 0', color: '#64748b' }}>✓ {f}</li>
                                    ))}
                                </ul>
                                <button style={{ background: t.highlighted ? data.primaryColor : '#fff', color: t.highlighted ? '#fff' : data.primaryColor, border: `1px solid ${data.primaryColor}`, padding: '10px 20px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', width: '100%' }}>Select Plan</button>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* FAQ */}
            {data.faqs.length > 0 && (
                <section style={{ padding: '56px 40px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, textAlign: 'center', marginBottom: '28px', color: data.primaryColor }}>Frequently Asked Questions</h2>
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        {data.faqs.map((f, i) => (
                            <div key={i} style={{ padding: '16px 0', borderBottom: '1px solid #e2e8f0' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>{f.question}</h3>
                                <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6 }}>{f.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Venue */}
            <section style={{ padding: '56px 40px', background: '#f8fafc' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 700, textAlign: 'center', marginBottom: '24px', color: data.primaryColor }}>Venue</h2>
                <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>{data.venue}</h3>
                    <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>{data.address}, {data.city}</p>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '36px 40px', background: data.primaryColor, color: '#fff', textAlign: 'center' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>{data.organizerName}</h3>
                <p style={{ fontSize: '11px', opacity: 0.7 }}>{data.contactEmail} • {data.contactPhone}</p>
                <p style={{ fontSize: '10px', opacity: 0.4, marginTop: '14px' }}>© 2025 {data.organizerName}</p>
            </footer>
        </div>
    );
};
