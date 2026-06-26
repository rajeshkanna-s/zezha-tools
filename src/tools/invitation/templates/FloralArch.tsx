import React from 'react';
import type { TemplateProps } from '../types';

/** FloralArch — Ornate Indian wedding with floral arch, marigolds, gold accents */
export const FloralArch: React.FC<TemplateProps> = ({ data }) => {
    const { colorScheme: cs, fontPair: fp, decorations: dec } = data;
    const gold = cs.secondary;

    return (
        <div
            className="relative w-full h-full overflow-hidden"
            style={{ background: `linear-gradient(180deg, ${cs.accent}ee, ${cs.background})`, color: cs.text, fontFamily: fp.bodyFont }}
        >
            {/* Floral arch — SVG top */}
            <svg className="absolute top-0 left-0 w-full" viewBox="0 0 800 180" style={{ opacity: 0.9 }}>
                <defs>
                    <linearGradient id="archGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={cs.primary} stopOpacity="0.3" />
                        <stop offset="50%" stopColor={gold} stopOpacity="0.5" />
                        <stop offset="100%" stopColor={cs.primary} stopOpacity="0.3" />
                    </linearGradient>
                </defs>
                {/* Arch shape */}
                <path d="M0 180 Q100 20 400 30 Q700 20 800 180" fill="none" stroke={gold} strokeWidth="2" opacity="0.6" />
                <path d="M20 180 Q120 40 400 50 Q680 40 780 180" fill="none" stroke={gold} strokeWidth="1" opacity="0.3" />
                {/* Marigold garland circles along the arch */}
                {[100, 200, 300, 400, 500, 600, 700].map((x, i) => {
                    const y = 30 + Math.abs(400 - x) * 0.15;
                    return (
                        <g key={i}>
                            <circle cx={x} cy={y + 15} r="8" fill="#F59E0B" opacity="0.6" />
                            <circle cx={x + 15} cy={y + 10} r="6" fill="#EF4444" opacity="0.4" />
                            <circle cx={x - 15} cy={y + 10} r="6" fill="#F97316" opacity="0.5" />
                            <circle cx={x} cy={y + 5} r="5" fill="#FBBF24" opacity="0.5" />
                        </g>
                    );
                })}
                {/* Corner flowers */}
                {[{ x: 40, y: 40 }, { x: 760, y: 40 }].map((p, i) => (
                    <g key={`f${i}`}>
                        <circle cx={p.x} cy={p.y} r="18" fill={cs.primary} opacity="0.15" />
                        <circle cx={p.x} cy={p.y} r="10" fill={gold} opacity="0.2" />
                        <circle cx={p.x} cy={p.y} r="4" fill={gold} opacity="0.4" />
                    </g>
                ))}
            </svg>

            {/* Bottom floral */}
            <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 800 120" style={{ opacity: 0.8 }}>
                {[50, 150, 250, 350, 450, 550, 650, 750].map((x, i) => (
                    <g key={i} transform={`translate(${x}, ${80 + (i % 2) * 15})`}>
                        {/* Petals */}
                        {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                            <ellipse key={angle} cx="0" cy="-8" rx="3" ry="8"
                                fill={i % 3 === 0 ? '#F59E0B' : i % 3 === 1 ? '#EF4444' : '#F97316'}
                                opacity="0.5" transform={`rotate(${angle})`} />
                        ))}
                        <circle cx="0" cy="0" r="4" fill={gold} opacity="0.6" />
                    </g>
                ))}
                {/* Leaves */}
                {[100, 300, 500, 700].map((x, i) => (
                    <path key={`l${i}`} d={`M${x} 110 Q${x + 10} 80 ${x + 5} 60`} fill="none" stroke="#22C55E" strokeWidth="1.5" opacity="0.3" />
                ))}
            </svg>

            {/* Gold border */}
            {dec.borderFrame && (
                <>
                    <div className="absolute inset-3 border-2 rounded-lg" style={{ borderColor: `${gold}55` }} />
                    <div className="absolute inset-5 border rounded-lg" style={{ borderColor: `${gold}30` }} />
                </>
            )}

            {/* Corner mandala decorations */}
            {dec.cornerDecorations && (
                <>
                    {['top-6 left-6', 'top-6 right-6 -scale-x-100', 'bottom-6 right-6 scale-[-1]', 'bottom-6 left-6 -scale-y-100'].map((pos, i) => (
                        <div key={i} className={`absolute ${pos}`}>
                            <svg width="50" height="50" viewBox="0 0 50 50">
                                <path d="M5 5 Q15 2 20 12 Q25 2 35 5 M5 5 Q2 15 12 20 Q2 25 5 35" fill="none" stroke={gold} strokeWidth="1.2" opacity="0.5" />
                                <circle cx="12" cy="12" r="3" fill={gold} opacity="0.3" />
                            </svg>
                        </div>
                    ))}
                </>
            )}

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-10 py-16 text-center">
                {/* Om/Ganesh */}
                <div className="text-2xl mb-1" style={{ color: gold }}>🙏</div>
                <p className="text-[0.5rem] uppercase tracking-[0.4em] mb-1 opacity-60" style={{ color: gold }}>
                    ॥ शुभ मंगल ॥
                </p>

                <p className="text-[0.6rem] uppercase tracking-[0.3em] mb-4 opacity-80" style={{ fontFamily: fp.bodyFont }}>
                    {data.title}
                </p>

                {/* Names with ornate styling */}
                {(data.eventType === 'wedding' || data.eventType === 'engagement' || data.eventType === 'reception') ? (
                    <div className="mb-3">
                        <h1 className="text-[1.8rem] leading-tight" style={{ fontFamily: fp.headingFont, fontWeight: fp.headingWeight, color: cs.primary }}>
                            {data.groomName || 'Groom'}
                        </h1>
                        <div className="flex items-center gap-3 justify-center my-1">
                            <div className="w-10 h-px" style={{ background: `linear-gradient(to right, transparent, ${gold})` }} />
                            <span className="text-lg" style={{ color: gold }}>❦</span>
                            <div className="w-10 h-px" style={{ background: `linear-gradient(to left, transparent, ${gold})` }} />
                        </div>
                        <h1 className="text-[1.8rem] leading-tight" style={{ fontFamily: fp.headingFont, fontWeight: fp.headingWeight, color: cs.primary }}>
                            {data.brideName || 'Bride'}
                        </h1>
                    </div>
                ) : data.honoree ? (
                    <h1 className="text-[1.8rem] mb-3 leading-tight" style={{ fontFamily: fp.headingFont, fontWeight: fp.headingWeight, color: cs.primary }}>
                        {data.honoree}
                    </h1>
                ) : null}

                {/* Divider with marigold */}
                {dec.dividerLines && (
                    <div className="flex items-center gap-2 mb-3 w-3/4">
                        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${gold}88)` }} />
                        <span style={{ color: gold }}>🌺</span>
                        <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${gold}88)` }} />
                    </div>
                )}

                {/* Event name */}
                <h2 className="text-sm uppercase tracking-[0.2em] mb-3 font-bold" style={{ color: gold }}>
                    {data.eventName}
                </h2>

                {/* Date box */}
                <div className="rounded-xl px-6 py-3 mb-3 border" style={{ borderColor: `${gold}40`, background: `${gold}08` }}>
                    <p className="text-[0.75rem] font-bold" style={{ color: cs.primary }}>{data.date}</p>
                    <p className="text-[0.6rem] mt-1 opacity-70">{data.time}</p>
                </div>

                {/* Venue */}
                <div className="mb-3">
                    <p className="text-[0.7rem] font-semibold" style={{ color: cs.primary }}>{data.venue}</p>
                    <p className="text-[0.55rem] opacity-60 mt-0.5">{data.address}, {data.city}</p>
                </div>

                {/* Sub-events */}
                {(data.subEvent1 || data.subEvent2 || data.subEvent3) && (
                    <div className="w-full max-w-xs mb-3 rounded-lg overflow-hidden" style={{ background: `${gold}08`, border: `1px solid ${gold}20` }}>
                        {[data.subEvent1, data.subEvent2, data.subEvent3].filter(Boolean).map((se, i) => (
                            <div key={i} className="flex justify-between px-3 py-2 text-[0.55rem]" style={{ borderBottom: `1px solid ${gold}15` }}>
                                <span className="font-bold" style={{ color: cs.primary }}>{se!.name}</span>
                                <span className="opacity-70">{se!.date} · {se!.time}</span>
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
            </div>
        </div>
    );
};
