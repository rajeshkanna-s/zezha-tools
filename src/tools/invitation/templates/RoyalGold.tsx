import React from 'react';
import type { TemplateProps } from '../types';

/** Royal Gold — Dark maroon + gold, ornate borders */
export const RoyalGold: React.FC<TemplateProps> = ({ data }) => {
    const { colorScheme: cs, fontPair: fp, decorations: dec } = data;

    return (
        <div
            className="relative w-full h-full overflow-hidden"
            style={{ background: cs.background, color: cs.text, fontFamily: fp.bodyFont }}
        >
            {/* Background pattern */}
            {dec.backgroundPattern && (
                <div className="absolute inset-0 opacity-[0.06]" style={{
                    backgroundImage: `repeating-linear-gradient(45deg, ${cs.secondary} 0px, ${cs.secondary} 1px, transparent 1px, transparent 20px), repeating-linear-gradient(-45deg, ${cs.secondary} 0px, ${cs.secondary} 1px, transparent 1px, transparent 20px)`,
                }} />
            )}

            {/* Border frame */}
            {dec.borderFrame && (
                <>
                    <div className="absolute inset-3 border-2 rounded-sm" style={{ borderColor: cs.secondary }} />
                    <div className="absolute inset-5 border rounded-sm" style={{ borderColor: `${cs.secondary}66` }} />
                </>
            )}

            {/* Corner decorations */}
            {dec.cornerDecorations && (
                <>
                    {['-top-0 -left-0', '-top-0 -right-0 rotate-90', '-bottom-0 -right-0 rotate-180', '-bottom-0 -left-0 -rotate-90'].map((pos, i) => (
                        <div key={i} className={`absolute ${pos} w-20 h-20`}>
                            <svg viewBox="0 0 80 80" className="w-full h-full" style={{ color: cs.secondary }}>
                                <path d="M10 0 Q10 10 0 10 M20 0 Q20 20 0 20 M30 0 Q30 30 0 30" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
                            </svg>
                        </div>
                    ))}
                </>
            )}

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-10 py-8 text-center">
                {/* Ornamental top */}
                <div className="mb-2 text-2xl" style={{ color: cs.secondary }}>❧</div>

                {/* Title */}
                <p className="text-[0.65rem] uppercase tracking-[0.35em] mb-3 opacity-80" style={{ fontFamily: fp.bodyFont }}>
                    {data.title}
                </p>

                {/* Couple/Honoree names */}
                {(data.eventType === 'wedding' || data.eventType === 'engagement' || data.eventType === 'reception') ? (
                    <div className="mb-3">
                        <h1 className="text-2xl mb-1" style={{ fontFamily: fp.headingFont, fontWeight: fp.headingWeight, color: cs.secondary }}>
                            {data.groomName || 'Groom'}
                        </h1>
                        <span className="text-lg italic opacity-70" style={{ color: cs.secondary }}>&amp;</span>
                        <h1 className="text-2xl mt-1" style={{ fontFamily: fp.headingFont, fontWeight: fp.headingWeight, color: cs.secondary }}>
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
                    <div className="flex items-center gap-3 mb-3 w-3/4">
                        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${cs.secondary}88, transparent)` }} />
                        <span style={{ color: cs.secondary }}>✦</span>
                        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${cs.secondary}88, transparent)` }} />
                    </div>
                )}

                {/* Event name */}
                <h2 className="text-base uppercase tracking-[0.2em] mb-4 font-semibold" style={{ color: cs.secondary }}>
                    {data.eventName}
                </h2>

                {/* Date & Time */}
                <div className="mb-1 text-[0.7rem] tracking-wide" style={{ color: cs.accent }}>
                    {data.date}
                </div>
                <div className="mb-3 text-[0.65rem] tracking-wide opacity-80">
                    {data.time}
                </div>

                {/* Venue */}
                <div className="mb-4">
                    <p className="text-[0.7rem] font-semibold" style={{ color: cs.secondary }}>{data.venue}</p>
                    <p className="text-[0.6rem] opacity-70 mt-0.5">{data.address}, {data.city}</p>
                </div>

                {/* Sub-events */}
                {(data.subEvent1 || data.subEvent2 || data.subEvent3) && (
                    <div className="w-full max-w-xs mb-4">
                        {[data.subEvent1, data.subEvent2, data.subEvent3].filter(Boolean).map((se, i) => (
                            <div key={i} className="flex items-center justify-between py-1.5 text-[0.6rem] border-t" style={{ borderColor: `${cs.secondary}33` }}>
                                <span className="font-semibold" style={{ color: cs.secondary }}>{se!.name}</span>
                                <span className="opacity-80">{se!.date} · {se!.time}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Quote */}
                {data.quote && (
                    <p className="italic text-[0.6rem] opacity-70 max-w-xs mb-3" style={{ fontFamily: fp.headingFont }}>
                        "{data.quote}"
                    </p>
                )}

                {/* Host */}
                <p className="text-[0.6rem] opacity-60 mt-auto">
                    Hosted by {data.hostNames}
                </p>

                {/* RSVP & Dresscode */}
                <div className="flex items-center gap-4 mt-2 text-[0.55rem] opacity-60">
                    {data.rsvpPhone && <span>RSVP: {data.rsvpPhone}</span>}
                    {data.dresscode && <span>{data.dresscode}</span>}
                </div>

                {/* Ornamental bottom */}
                <div className="mt-2 text-2xl" style={{ color: cs.secondary }}>❧</div>
            </div>
        </div>
    );
};
