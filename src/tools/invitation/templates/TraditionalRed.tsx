import React from 'react';
import type { TemplateProps } from '../types';

/** Traditional Red — Deep red + gold, Indian classical */
export const TraditionalRed: React.FC<TemplateProps> = ({ data }) => {
    const { colorScheme: cs, fontPair: fp, decorations: dec } = data;

    return (
        <div
            className="relative w-full h-full overflow-hidden"
            style={{ background: cs.background, color: cs.text, fontFamily: fp.bodyFont }}
        >
            {/* Background pattern — paisley-like */}
            {dec.backgroundPattern && (
                <div className="absolute inset-0 opacity-[0.04]" style={{
                    backgroundImage: `radial-gradient(circle at 20% 30%, ${cs.secondary} 1px, transparent 1px), radial-gradient(circle at 80% 70%, ${cs.secondary} 1px, transparent 1px)`,
                    backgroundSize: '30px 30px',
                }} />
            )}

            {/* Double border */}
            {dec.borderFrame && (
                <>
                    <div className="absolute inset-2 border-2" style={{ borderColor: cs.secondary }} />
                    <div className="absolute inset-4 border" style={{ borderColor: `${cs.secondary}55` }} />
                    <div className="absolute inset-[1.25rem] border" style={{ borderColor: `${cs.secondary}25` }} />
                </>
            )}

            {/* Mandala-like corner decorations */}
            {dec.cornerDecorations && (
                <>
                    {['top-2 left-2', 'top-2 right-2 -scale-x-100', 'bottom-2 right-2 scale-[-1]', 'bottom-2 left-2 -scale-y-100'].map((pos, i) => (
                        <div key={i} className={`absolute ${pos} w-16 h-16`}>
                            <svg viewBox="0 0 60 60" className="w-full h-full">
                                <path d="M5 5 Q15 5 20 15 Q25 5 35 5" fill="none" stroke={cs.secondary} strokeWidth="1" opacity="0.5" />
                                <circle cx="10" cy="10" r="3" fill={cs.secondary} opacity="0.3" />
                                <circle cx="20" cy="5" r="2" fill={cs.secondary} opacity="0.4" />
                            </svg>
                        </div>
                    ))}
                </>
            )}

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-10 py-8 text-center">
                {/* Om / Ganesh symbol */}
                <div className="text-2xl mb-1" style={{ color: cs.secondary }}>☸</div>
                <p className="text-[0.5rem] uppercase tracking-[0.5em] mb-1 opacity-60" style={{ color: cs.secondary }}>
                    ॥ शुभ विवाह ॥
                </p>

                <p className="text-[0.6rem] uppercase tracking-[0.35em] mb-3 opacity-70">
                    {data.title}
                </p>

                {/* Names */}
                {(data.eventType === 'wedding' || data.eventType === 'engagement' || data.eventType === 'reception') ? (
                    <div className="mb-3">
                        <h1 className="text-2xl" style={{ fontFamily: fp.headingFont, fontWeight: fp.headingWeight, color: cs.secondary }}>
                            {data.groomName || 'Groom'}
                        </h1>
                        <div className="flex items-center gap-2 justify-center my-1">
                            <div className="w-8 h-px" style={{ background: cs.secondary }} />
                            <span style={{ color: cs.secondary }} className="text-sm">✦</span>
                            <div className="w-8 h-px" style={{ background: cs.secondary }} />
                        </div>
                        <h1 className="text-2xl" style={{ fontFamily: fp.headingFont, fontWeight: fp.headingWeight, color: cs.secondary }}>
                            {data.brideName || 'Bride'}
                        </h1>
                    </div>
                ) : data.honoree ? (
                    <h1 className="text-2xl mb-3" style={{ fontFamily: fp.headingFont, fontWeight: fp.headingWeight, color: cs.secondary }}>
                        {data.honoree}
                    </h1>
                ) : null}

                {/* Divider */}
                {dec.dividerLines && (
                    <div className="flex items-center gap-2 mb-3 w-3/4">
                        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${cs.secondary})` }} />
                        <div className="w-2 h-2 rotate-45" style={{ background: cs.secondary }} />
                        <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${cs.secondary})` }} />
                    </div>
                )}

                {/* Event name */}
                <h2 className="text-sm uppercase tracking-[0.2em] mb-4 font-bold" style={{ color: cs.secondary }}>
                    {data.eventName}
                </h2>

                {/* Date & Time */}
                <div className="bg-black/10 rounded-lg px-6 py-3 mb-4">
                    <p className="text-[0.7rem] font-semibold" style={{ color: cs.secondary }}>{data.date}</p>
                    <p className="text-[0.6rem] mt-1 opacity-70">{data.time}</p>
                </div>

                {/* Venue */}
                <div className="mb-4">
                    <p className="text-[0.7rem] font-semibold" style={{ color: cs.secondary }}>{data.venue}</p>
                    <p className="text-[0.55rem] opacity-60 mt-0.5">{data.address}, {data.city}</p>
                </div>

                {/* Sub-events */}
                {(data.subEvent1 || data.subEvent2 || data.subEvent3) && (
                    <div className="w-full max-w-xs mb-3 rounded-lg overflow-hidden" style={{ background: `${cs.secondary}10` }}>
                        {[data.subEvent1, data.subEvent2, data.subEvent3].filter(Boolean).map((se, i) => (
                            <div key={i} className="flex justify-between px-3 py-2 text-[0.55rem]" style={{ borderBottom: `1px solid ${cs.secondary}20` }}>
                                <span className="font-bold" style={{ color: cs.secondary }}>{se!.name}</span>
                                <span className="opacity-70">{se!.date} · {se!.time} · {se!.venue}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Quote */}
                {data.quote && (
                    <p className="italic text-[0.55rem] opacity-60 max-w-xs mb-3" style={{ fontFamily: fp.headingFont }}>
                        "{data.quote}"
                    </p>
                )}

                <p className="text-[0.55rem] opacity-50 mt-auto">{data.hostNames}</p>

                <div className="flex items-center gap-3 mt-2 text-[0.5rem] opacity-40">
                    {data.rsvpPhone && <span>RSVP: {data.rsvpPhone}</span>}
                    {data.dresscode && <span>{data.dresscode}</span>}
                </div>

                <div className="text-lg mt-1" style={{ color: cs.secondary }}>☸</div>
            </div>
        </div>
    );
};
