import React from 'react';
import type { TemplateProps } from '../types';

/** GoldenCelebration — Dark/black with gold accents, sparkles, balloons — premium birthday/celebration */
export const GoldenCelebration: React.FC<TemplateProps> = ({ data }) => {
    const { fontPair: fp, decorations: dec } = data;
    const gold = '#FBBF24';

    return (
        <div
            className="relative w-full h-full overflow-hidden"
            style={{
                background: `linear-gradient(150deg, #0F0F0F, #1A1A2E, #0F0F0F)`,
                color: '#E2E8F0',
                fontFamily: fp.bodyFont,
            }}
        >
            {/* Sparkle dots */}
            {dec.backgroundPattern && (
                <div className="absolute inset-0 overflow-hidden">
                    {Array.from({ length: 50 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                width: `${1 + Math.random() * 3}px`,
                                height: `${1 + Math.random() * 3}px`,
                                background: i % 3 === 0 ? gold : '#fff',
                                opacity: 0.1 + Math.random() * 0.3,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Gold balloons — top */}
            <svg className="absolute top-0 left-0 w-full" viewBox="0 0 800 220" style={{ opacity: 0.8 }}>
                {/* Left cluster */}
                {[
                    { cx: 80, cy: 60, rx: 22, ry: 28 },
                    { cx: 110, cy: 50, rx: 25, ry: 30 },
                    { cx: 55, cy: 75, rx: 18, ry: 24 },
                    { cx: 130, cy: 70, rx: 20, ry: 25 },
                ].map((b, i) => (
                    <g key={`l${i}`}>
                        <ellipse cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fill={gold} opacity="0.55" />
                        <ellipse cx={b.cx - b.rx * 0.25} cy={b.cy - b.ry * 0.25} rx={b.rx * 0.15} ry={b.ry * 0.2} fill="#fff" opacity="0.2" />
                        <path d={`M${b.cx} ${b.cy + b.ry} C${b.cx + 5} ${b.cy + b.ry + 30} ${b.cx - 3} ${b.cy + b.ry + 50} ${b.cx + 2} ${b.cy + b.ry + 80}`} fill="none" stroke={gold} strokeWidth="0.6" opacity="0.3" />
                    </g>
                ))}
                {/* Right cluster */}
                {[
                    { cx: 700, cy: 55, rx: 24, ry: 30 },
                    { cx: 730, cy: 70, rx: 20, ry: 26 },
                    { cx: 670, cy: 65, rx: 18, ry: 22 },
                    { cx: 750, cy: 80, rx: 16, ry: 20 },
                ].map((b, i) => (
                    <g key={`r${i}`}>
                        <ellipse cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fill={gold} opacity="0.5" />
                        <ellipse cx={b.cx - b.rx * 0.25} cy={b.cy - b.ry * 0.25} rx={b.rx * 0.15} ry={b.ry * 0.2} fill="#fff" opacity="0.15" />
                    </g>
                ))}
            </svg>

            {/* Confetti streamers from top */}
            <svg className="absolute top-0 left-0 w-full" viewBox="0 0 800 400" style={{ opacity: 0.4 }}>
                {Array.from({ length: 20 }).map((_, i) => {
                    const x = 40 + i * 40;
                    const colors = [gold, '#F472B6', '#60A5FA', '#34D399', '#A78BFA'];
                    return (
                        <path
                            key={i}
                            d={`M${x} 0 Q${x + 10} ${30 + Math.random() * 40} ${x - 5} ${60 + Math.random() * 50} Q${x + 8} ${100 + Math.random() * 30} ${x + 3} ${130 + Math.random() * 40}`}
                            fill="none"
                            stroke={colors[i % colors.length]}
                            strokeWidth="1"
                            opacity="0.5"
                        />
                    );
                })}
            </svg>

            {/* Gold border */}
            {dec.borderFrame && (
                <>
                    <div className="absolute inset-3 border" style={{ borderColor: `${gold}30` }} />
                    <div className="absolute inset-5 border" style={{ borderColor: `${gold}15` }} />
                </>
            )}

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-10 py-14 text-center">
                <p className="text-[0.5rem] uppercase tracking-[0.5em] mb-2" style={{ color: `${gold}88` }}>
                    {data.title || "You are invited to"}
                </p>

                {/* Names */}
                {data.honoree ? (
                    <h1 className="text-[1.6rem] leading-tight mb-1" style={{ fontFamily: fp.headingFont, fontWeight: fp.headingWeight, color: gold }}>
                        {data.honoree}'s
                    </h1>
                ) : (data.eventType === 'wedding' || data.eventType === 'engagement') ? (
                    <div className="mb-2">
                        <h1 className="text-[1.4rem] leading-tight" style={{ fontFamily: fp.headingFont, fontWeight: fp.headingWeight, color: gold }}>
                            {data.groomName || 'Groom'}
                        </h1>
                        <span className="text-base" style={{ color: `${gold}60` }}>&</span>
                        <h1 className="text-[1.4rem] leading-tight" style={{ fontFamily: fp.headingFont, fontWeight: fp.headingWeight, color: gold }}>
                            {data.brideName || 'Bride'}
                        </h1>
                    </div>
                ) : null}

                {/* Event name */}
                <h2 className="text-[1.8rem] mb-3 leading-tight" style={{
                    fontFamily: fp.headingFont,
                    fontWeight: fp.headingWeight,
                    background: `linear-gradient(135deg, ${gold}, #F59E0B, ${gold})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    {data.eventName}
                </h2>

                {/* Sparkle divider */}
                {dec.dividerLines && (
                    <div className="flex items-center gap-2 mb-3 w-2/3">
                        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${gold}60)` }} />
                        <span style={{ color: gold }}>✦</span>
                        <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${gold}60)` }} />
                    </div>
                )}

                {/* Date/Time in gold-bordered boxes */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="rounded-lg px-4 py-2 text-center" style={{ border: `1px solid ${gold}30`, background: `${gold}08` }}>
                        <div className="text-[0.75rem] font-bold" style={{ color: gold }}>{data.date}</div>
                    </div>
                    <div className="w-px h-6" style={{ background: `${gold}30` }} />
                    <div className="rounded-lg px-4 py-2 text-center" style={{ border: `1px solid ${gold}30`, background: `${gold}08` }}>
                        <div className="text-[0.75rem] font-bold" style={{ color: gold }}>{data.time}</div>
                    </div>
                </div>

                <div className="mb-3">
                    <p className="text-[0.7rem] font-semibold" style={{ color: gold }}>{data.venue}</p>
                    <p className="text-[0.55rem] opacity-40 mt-0.5">{data.address}, {data.city}</p>
                </div>

                {(data.subEvent1 || data.subEvent2 || data.subEvent3) && (
                    <div className="w-full max-w-xs mb-3">
                        {[data.subEvent1, data.subEvent2, data.subEvent3].filter(Boolean).map((se, i) => (
                            <div key={i} className="flex justify-between py-1.5 text-[0.55rem]" style={{ borderBottom: `1px solid ${gold}10` }}>
                                <span className="font-semibold" style={{ color: gold }}>{se!.name}</span>
                                <span className="opacity-40">{se!.date} · {se!.time}</span>
                            </div>
                        ))}
                    </div>
                )}

                {data.quote && (
                    <p className="italic text-[0.55rem] opacity-30 max-w-xs mb-3" style={{ fontFamily: fp.headingFont, color: gold }}>
                        "{data.quote}"
                    </p>
                )}

                <p className="text-[0.5rem] uppercase tracking-[0.3em] opacity-25 mt-auto" style={{ color: gold }}>
                    {data.hostNames}
                </p>

                <div className="flex items-center gap-3 mt-2 text-[0.5rem] opacity-20">
                    {data.rsvpPhone && <span>RSVP: {data.rsvpPhone}</span>}
                    {data.dresscode && <span>{data.dresscode}</span>}
                </div>

                <div className="text-lg mt-1 opacity-50">🎊✨🎉</div>
            </div>
        </div>
    );
};
