import React from 'react';
import type { TemplateProps } from '../types';

/** Luxury Black — All black + gold foil effect */
export const LuxuryBlack: React.FC<TemplateProps> = ({ data }) => {
    const { colorScheme: cs, fontPair: fp, decorations: dec } = data;

    return (
        <div
            className="relative w-full h-full overflow-hidden"
            style={{ background: `linear-gradient(145deg, #0a0a0a, ${cs.background}, #0a0a0a)`, color: cs.text, fontFamily: fp.bodyFont }}
        >
            {/* Subtle shimmer pattern */}
            {dec.backgroundPattern && (
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `linear-gradient(135deg, ${cs.secondary} 25%, transparent 25%), linear-gradient(225deg, ${cs.secondary} 25%, transparent 25%), linear-gradient(315deg, ${cs.secondary} 25%, transparent 25%), linear-gradient(45deg, ${cs.secondary} 25%, transparent 25%)`,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0',
                }} />
            )}

            {/* Gold border */}
            {dec.borderFrame && (
                <>
                    <div className="absolute inset-3 border" style={{ borderColor: `${cs.secondary}40` }} />
                    <div className="absolute inset-4 border" style={{ borderColor: `${cs.secondary}20` }} />
                </>
            )}

            {/* Corner accents */}
            {dec.cornerDecorations && (
                <>
                    {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos, i) => (
                        <div key={i} className={`absolute ${pos} w-6 h-6`}>
                            <div className="w-full h-full border-t border-l" style={{
                                borderColor: cs.secondary,
                                borderTopWidth: i < 2 ? '2px' : '0',
                                borderBottomWidth: i >= 2 ? '2px' : '0',
                                borderLeftWidth: i % 2 === 0 ? '2px' : '0',
                                borderRightWidth: i % 2 !== 0 ? '2px' : '0',
                                borderTopColor: i < 2 ? cs.secondary : 'transparent',
                                borderBottomColor: i >= 2 ? cs.secondary : 'transparent',
                                borderLeftColor: i % 2 === 0 ? cs.secondary : 'transparent',
                                borderRightColor: i % 2 !== 0 ? cs.secondary : 'transparent',
                            }} />
                        </div>
                    ))}
                </>
            )}

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-10 py-8 text-center">
                {/* Crown / luxury symbol */}
                <div className="text-lg mb-2" style={{ color: cs.secondary }}>♛</div>

                <p className="text-[0.55rem] uppercase tracking-[0.6em] mb-5" style={{ color: `${cs.secondary}99` }}>
                    {data.title}
                </p>

                {/* Names — with gradient-ish gold effect */}
                {(data.eventType === 'wedding' || data.eventType === 'engagement' || data.eventType === 'reception') ? (
                    <div className="mb-5">
                        <h1 className="text-3xl leading-tight" style={{ fontFamily: fp.headingFont, fontWeight: fp.headingWeight, color: cs.secondary }}>
                            {data.groomName || 'Groom'}
                        </h1>
                        <div className="flex items-center gap-3 justify-center my-2">
                            <div className="w-10 h-px" style={{ background: `linear-gradient(to right, transparent, ${cs.secondary})` }} />
                            <span className="text-xs" style={{ color: cs.secondary }}>✦</span>
                            <div className="w-10 h-px" style={{ background: `linear-gradient(to left, transparent, ${cs.secondary})` }} />
                        </div>
                        <h1 className="text-3xl leading-tight" style={{ fontFamily: fp.headingFont, fontWeight: fp.headingWeight, color: cs.secondary }}>
                            {data.brideName || 'Bride'}
                        </h1>
                    </div>
                ) : data.honoree ? (
                    <h1 className="text-3xl mb-5 leading-tight" style={{ fontFamily: fp.headingFont, fontWeight: fp.headingWeight, color: cs.secondary }}>
                        {data.honoree}
                    </h1>
                ) : null}

                {/* Divider */}
                {dec.dividerLines && (
                    <div className="w-2/3 h-px mb-5" style={{ background: `linear-gradient(to right, transparent, ${cs.secondary}60, transparent)` }} />
                )}

                {/* Event name */}
                <h2 className="text-xs uppercase tracking-[0.3em] mb-5 font-semibold" style={{ color: cs.secondary }}>
                    {data.eventName}
                </h2>

                {/* Date & Time in luxury pill */}
                <div className="rounded-full px-6 py-2 mb-4 border" style={{ borderColor: `${cs.secondary}30`, background: `${cs.secondary}08` }}>
                    <p className="text-[0.65rem] font-medium" style={{ color: cs.secondary }}>{data.date}</p>
                    <p className="text-[0.55rem] opacity-60 mt-0.5">{data.time}</p>
                </div>

                {/* Venue */}
                <div className="mb-4">
                    <p className="text-[0.65rem] font-semibold" style={{ color: cs.secondary }}>{data.venue}</p>
                    <p className="text-[0.55rem] opacity-40 mt-0.5">{data.address}, {data.city}</p>
                </div>

                {/* Sub-events */}
                {(data.subEvent1 || data.subEvent2 || data.subEvent3) && (
                    <div className="w-full max-w-xs mb-4">
                        {[data.subEvent1, data.subEvent2, data.subEvent3].filter(Boolean).map((se, i) => (
                            <div key={i} className="flex justify-between py-1.5 text-[0.55rem] border-t" style={{ borderColor: `${cs.secondary}15` }}>
                                <span className="font-semibold" style={{ color: cs.secondary }}>{se!.name}</span>
                                <span className="opacity-50">{se!.date} · {se!.time}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Quote */}
                {data.quote && (
                    <p className="italic text-[0.55rem] opacity-40 max-w-xs mb-4" style={{ fontFamily: fp.headingFont, color: cs.secondary }}>
                        "{data.quote}"
                    </p>
                )}

                <p className="text-[0.5rem] uppercase tracking-[0.3em] opacity-30 mt-auto" style={{ color: cs.secondary }}>
                    {data.hostNames}
                </p>

                <div className="flex items-center gap-3 mt-2 text-[0.5rem] opacity-20">
                    {data.rsvpPhone && <span>RSVP: {data.rsvpPhone}</span>}
                    {data.dresscode && <span>{data.dresscode}</span>}
                </div>

                <div className="text-lg mt-2" style={{ color: cs.secondary }}>♛</div>
            </div>
        </div>
    );
};
