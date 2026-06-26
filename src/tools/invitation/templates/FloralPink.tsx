import React from 'react';
import type { TemplateProps } from '../types';

/** Floral Pink — Soft pink + rose gold, flower illustrations */
export const FloralPink: React.FC<TemplateProps> = ({ data }) => {
    const { colorScheme: cs, fontPair: fp, decorations: dec } = data;

    return (
        <div
            className="relative w-full h-full overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${cs.background}, ${cs.accent})`, color: cs.text, fontFamily: fp.bodyFont }}
        >
            {/* Floral SVG corners */}
            {dec.cornerDecorations && (
                <>
                    <svg className="absolute top-0 left-0 w-28 h-28 opacity-30" viewBox="0 0 120 120">
                        <circle cx="15" cy="15" r="8" fill={cs.primary} opacity="0.3" />
                        <circle cx="35" cy="10" r="5" fill={cs.secondary} opacity="0.4" />
                        <circle cx="10" cy="35" r="6" fill={cs.secondary} opacity="0.35" />
                        <circle cx="25" cy="30" r="4" fill={cs.primary} opacity="0.25" />
                        <circle cx="45" cy="25" r="3" fill={cs.secondary} opacity="0.3" />
                        <path d="M0 50 Q20 40 40 50 Q30 30 50 40" fill="none" stroke={cs.primary} strokeWidth="0.5" opacity="0.3" />
                    </svg>
                    <svg className="absolute bottom-0 right-0 w-28 h-28 opacity-30 rotate-180" viewBox="0 0 120 120">
                        <circle cx="15" cy="15" r="8" fill={cs.primary} opacity="0.3" />
                        <circle cx="35" cy="10" r="5" fill={cs.secondary} opacity="0.4" />
                        <circle cx="10" cy="35" r="6" fill={cs.secondary} opacity="0.35" />
                        <circle cx="25" cy="30" r="4" fill={cs.primary} opacity="0.25" />
                        <path d="M0 50 Q20 40 40 50 Q30 30 50 40" fill="none" stroke={cs.primary} strokeWidth="0.5" opacity="0.3" />
                    </svg>
                    <svg className="absolute top-0 right-0 w-28 h-28 opacity-25" viewBox="0 0 120 120" style={{ transform: 'scaleX(-1)' }}>
                        <circle cx="15" cy="15" r="6" fill={cs.secondary} opacity="0.35" />
                        <circle cx="30" cy="8" r="4" fill={cs.primary} opacity="0.3" />
                    </svg>
                    <svg className="absolute bottom-0 left-0 w-28 h-28 opacity-25" viewBox="0 0 120 120" style={{ transform: 'scaleY(-1)' }}>
                        <circle cx="15" cy="15" r="6" fill={cs.secondary} opacity="0.35" />
                        <circle cx="30" cy="8" r="4" fill={cs.primary} opacity="0.3" />
                    </svg>
                </>
            )}

            {/* Soft border */}
            {dec.borderFrame && (
                <div className="absolute inset-4 border rounded-2xl" style={{ borderColor: `${cs.primary}30` }} />
            )}

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-10 py-8 text-center">
                {/* Floral emoji top */}
                <div className="text-xl mb-2 opacity-60">🌸</div>

                <p className="text-[0.55rem] uppercase tracking-[0.4em] mb-4 opacity-60">
                    {data.title}
                </p>

                {/* Names */}
                {(data.eventType === 'wedding' || data.eventType === 'engagement' || data.eventType === 'reception') ? (
                    <div className="mb-4">
                        <h1 className="text-2xl mb-1" style={{ fontFamily: fp.headingFont, fontWeight: fp.headingWeight, color: cs.primary }}>
                            {data.groomName || 'Groom'}
                        </h1>
                        <span className="text-sm opacity-50" style={{ color: cs.primary }}>♥</span>
                        <h1 className="text-2xl mt-1" style={{ fontFamily: fp.headingFont, fontWeight: fp.headingWeight, color: cs.primary }}>
                            {data.brideName || 'Bride'}
                        </h1>
                    </div>
                ) : data.honoree ? (
                    <h1 className="text-2xl mb-4" style={{ fontFamily: fp.headingFont, fontWeight: fp.headingWeight, color: cs.primary }}>
                        {data.honoree}
                    </h1>
                ) : null}

                {/* Divider */}
                {dec.dividerLines && (
                    <div className="flex items-center gap-2 mb-4 w-2/3">
                        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${cs.primary}40)` }} />
                        <span className="text-xs" style={{ color: cs.primary }}>✿</span>
                        <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${cs.primary}40)` }} />
                    </div>
                )}

                {/* Event details */}
                <h2 className="text-[0.7rem] uppercase tracking-[0.2em] mb-4 font-semibold" style={{ color: cs.primary }}>
                    {data.eventName}
                </h2>

                <div className="mb-1 text-[0.7rem]">{data.date}</div>
                <div className="mb-3 text-[0.6rem] opacity-60">{data.time}</div>

                <div className="mb-4">
                    <p className="text-[0.65rem] font-semibold" style={{ color: cs.primary }}>{data.venue}</p>
                    <p className="text-[0.55rem] opacity-60 mt-0.5">{data.address}, {data.city}</p>
                </div>

                {/* Sub-events */}
                {(data.subEvent1 || data.subEvent2 || data.subEvent3) && (
                    <div className="w-full max-w-xs mb-4">
                        {[data.subEvent1, data.subEvent2, data.subEvent3].filter(Boolean).map((se, i) => (
                            <div key={i} className="flex justify-between py-1.5 text-[0.55rem] border-t" style={{ borderColor: `${cs.primary}20` }}>
                                <span className="font-medium" style={{ color: cs.primary }}>{se!.name}</span>
                                <span className="opacity-60">{se!.date} · {se!.time}</span>
                            </div>
                        ))}
                    </div>
                )}

                {data.quote && (
                    <p className="italic text-[0.55rem] opacity-50 max-w-xs mb-3" style={{ fontFamily: fp.headingFont }}>
                        "{data.quote}"
                    </p>
                )}

                <p className="text-[0.55rem] opacity-50 mt-auto">{data.hostNames}</p>

                <div className="flex items-center gap-3 mt-2 text-[0.5rem] opacity-40">
                    {data.rsvpPhone && <span>RSVP: {data.rsvpPhone}</span>}
                    {data.dresscode && <span>{data.dresscode}</span>}
                </div>

                <div className="text-xl mt-2 opacity-60">🌸</div>
            </div>
        </div>
    );
};
