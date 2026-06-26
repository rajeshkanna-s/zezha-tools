import React from 'react';
import type { TemplateProps } from '../types';

/** Modern Minimal — White + black, clean typography */
export const ModernMinimal: React.FC<TemplateProps> = ({ data }) => {
    const { colorScheme: cs, fontPair: fp, decorations: dec } = data;

    return (
        <div
            className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center"
            style={{ background: cs.background, color: cs.text, fontFamily: fp.bodyFont }}
        >
            {/* Subtle border */}
            {dec.borderFrame && (
                <div className="absolute inset-6 border" style={{ borderColor: `${cs.primary}20` }} />
            )}

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-12 py-10 text-center max-w-lg">
                {/* Small title */}
                <p className="text-[0.6rem] uppercase tracking-[0.5em] mb-6 opacity-50" style={{ fontFamily: fp.bodyFont }}>
                    {data.title}
                </p>

                {/* Names */}
                {(data.eventType === 'wedding' || data.eventType === 'engagement' || data.eventType === 'reception') ? (
                    <div className="mb-6">
                        <h1 className="text-3xl leading-tight" style={{ fontFamily: fp.headingFont, fontWeight: fp.headingWeight }}>
                            {data.groomName || 'Groom'}
                        </h1>
                        <p className="text-xs my-1 opacity-40">&</p>
                        <h1 className="text-3xl leading-tight" style={{ fontFamily: fp.headingFont, fontWeight: fp.headingWeight }}>
                            {data.brideName || 'Bride'}
                        </h1>
                    </div>
                ) : data.honoree ? (
                    <h1 className="text-3xl mb-6 leading-tight" style={{ fontFamily: fp.headingFont, fontWeight: fp.headingWeight }}>
                        {data.honoree}
                    </h1>
                ) : null}

                {/* Thin divider */}
                {dec.dividerLines && (
                    <div className="w-12 h-px mb-6" style={{ background: cs.primary }} />
                )}

                {/* Event name */}
                <h2 className="text-xs uppercase tracking-[0.3em] mb-6 font-medium opacity-70">
                    {data.eventName}
                </h2>

                {/* Date, time, venue in clean blocks */}
                <div className="space-y-3 mb-6">
                    <p className="text-sm font-medium">{data.date}</p>
                    <p className="text-xs opacity-60">{data.time}</p>
                    <div className="pt-2">
                        <p className="text-xs font-medium">{data.venue}</p>
                        <p className="text-[0.6rem] opacity-50 mt-0.5">{data.address}, {data.city}</p>
                    </div>
                </div>

                {/* Sub-events */}
                {(data.subEvent1 || data.subEvent2 || data.subEvent3) && (
                    <div className="w-full max-w-xs mb-5">
                        {[data.subEvent1, data.subEvent2, data.subEvent3].filter(Boolean).map((se, i) => (
                            <div key={i} className="flex justify-between py-2 text-[0.6rem] border-t" style={{ borderColor: `${cs.primary}15` }}>
                                <span className="font-medium">{se!.name}</span>
                                <span className="opacity-50">{se!.date} · {se!.time}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Quote */}
                {data.quote && (
                    <p className="italic text-[0.6rem] opacity-40 mb-5 max-w-xs">
                        "{data.quote}"
                    </p>
                )}

                {/* Host */}
                <p className="text-[0.55rem] uppercase tracking-[0.3em] opacity-40 mt-auto">
                    {data.hostNames}
                </p>

                {/* RSVP */}
                <div className="flex items-center gap-3 mt-3 text-[0.5rem] opacity-30">
                    {data.rsvpPhone && <span>RSVP: {data.rsvpPhone}</span>}
                    {data.dresscode && <span>{data.dresscode}</span>}
                </div>
            </div>
        </div>
    );
};
