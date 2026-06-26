import React from 'react';
import type { TemplateProps } from '../types';

/** BalloonParty — Birthday with balloons, confetti, bunting, playful pastel colors */
export const BalloonParty: React.FC<TemplateProps> = ({ data }) => {
    const { fontPair: fp, decorations: dec } = data;

    return (
        <div
            className="relative w-full h-full overflow-hidden"
            style={{
                background: `linear-gradient(180deg, #FFF0F5, #FFE4EC, #FFF5EE)`,
                color: '#4A2040',
                fontFamily: fp.bodyFont,
            }}
        >
            {/* Confetti dots scattered */}
            {dec.backgroundPattern && (
                <div className="absolute inset-0 overflow-hidden">
                    {Array.from({ length: 40 }).map((_, i) => {
                        const colors = ['#F472B6', '#FBBF24', '#60A5FA', '#34D399', '#A78BFA', '#FB923C'];
                        const size = 3 + Math.random() * 6;
                        return (
                            <div
                                key={i}
                                className="absolute rounded-full"
                                style={{
                                    width: `${size}px`,
                                    height: `${size}px`,
                                    background: colors[i % colors.length],
                                    opacity: 0.25 + Math.random() * 0.2,
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    transform: `rotate(${Math.random() * 360}deg)`,
                                }}
                            />
                        );
                    })}
                </div>
            )}

            {/* Balloons — top left cluster */}
            <svg className="absolute top-0 left-2 w-24" viewBox="0 0 100 200" style={{ opacity: 0.85 }}>
                {[
                    { cx: 25, cy: 40, rx: 16, ry: 20, fill: '#F472B6' },
                    { cx: 50, cy: 35, rx: 18, ry: 22, fill: '#60A5FA' },
                    { cx: 70, cy: 50, rx: 14, ry: 18, fill: '#FBBF24' },
                    { cx: 40, cy: 55, rx: 12, ry: 16, fill: '#A78BFA' },
                ].map((b, i) => (
                    <g key={i}>
                        <ellipse cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fill={b.fill} opacity="0.7" />
                        <ellipse cx={b.cx - b.rx * 0.3} cy={b.cy - b.ry * 0.3} rx={b.rx * 0.15} ry={b.ry * 0.2} fill="#fff" opacity="0.3" />
                        <path d={`M${b.cx} ${b.cy + b.ry} Q${b.cx + 3} ${b.cy + b.ry + 20} ${b.cx - 2} ${b.cy + b.ry + 40}`} fill="none" stroke={b.fill} strokeWidth="0.8" opacity="0.5" />
                    </g>
                ))}
            </svg>

            {/* Balloons — top right */}
            <svg className="absolute top-0 right-2 w-24" viewBox="0 0 100 200" style={{ opacity: 0.85 }}>
                {[
                    { cx: 30, cy: 45, rx: 15, ry: 19, fill: '#34D399' },
                    { cx: 55, cy: 38, rx: 17, ry: 21, fill: '#FB923C' },
                    { cx: 75, cy: 48, rx: 14, ry: 18, fill: '#F472B6' },
                ].map((b, i) => (
                    <g key={i}>
                        <ellipse cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fill={b.fill} opacity="0.7" />
                        <ellipse cx={b.cx - b.rx * 0.3} cy={b.cy - b.ry * 0.3} rx={b.rx * 0.15} ry={b.ry * 0.2} fill="#fff" opacity="0.3" />
                    </g>
                ))}
            </svg>

            {/* Bunting / triangle flags */}
            {dec.cornerDecorations && (
                <svg className="absolute top-0 left-0 w-full" viewBox="0 0 800 60" style={{ opacity: 0.6 }}>
                    {Array.from({ length: 16 }).map((_, i) => {
                        const x = 25 + i * 50;
                        const colors = ['#F472B6', '#FBBF24', '#60A5FA', '#34D399', '#A78BFA', '#FB923C'];
                        return (
                            <polygon
                                key={i}
                                points={`${x},12 ${x + 20},12 ${x + 10},40`}
                                fill={colors[i % colors.length]}
                                opacity="0.5"
                            />
                        );
                    })}
                    <line x1="0" y1="12" x2="800" y2="12" stroke="#D4A017" strokeWidth="1.5" opacity="0.4" />
                </svg>
            )}

            {/* Cute border */}
            {dec.borderFrame && (
                <div className="absolute inset-4 border-2 border-dashed rounded-2xl" style={{ borderColor: '#F9A8D4' }} />
            )}

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-10 py-14 text-center">
                <p className="text-[0.55rem] uppercase tracking-[0.3em] mb-2 opacity-60">
                    {data.title || "You are invited to"}
                </p>

                {/* Big playful name */}
                {data.honoree ? (
                    <h1 className="text-[1.6rem] leading-tight mb-1" style={{ fontFamily: fp.headingFont, fontWeight: fp.headingWeight, color: '#EC4899' }}>
                        {data.honoree}'s
                    </h1>
                ) : (data.eventType === 'wedding' || data.eventType === 'engagement') ? (
                    <div className="mb-1">
                        <h1 className="text-[1.4rem] leading-tight" style={{ fontFamily: fp.headingFont, fontWeight: fp.headingWeight, color: '#EC4899' }}>
                            {data.groomName || 'Groom'} & {data.brideName || 'Bride'}
                        </h1>
                    </div>
                ) : null}

                {/* Event name — big fun text */}
                <h2 className="text-[1.8rem] mb-3 leading-tight" style={{
                    fontFamily: fp.headingFont,
                    fontWeight: fp.headingWeight,
                    background: 'linear-gradient(135deg, #EC4899, #8B5CF6, #3B82F6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    {data.eventName}
                </h2>

                {/* Star divider */}
                {dec.dividerLines && (
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm">⭐</span>
                        <div className="w-16 h-px bg-pink-300" />
                        <span className="text-sm">🎂</span>
                        <div className="w-16 h-px bg-pink-300" />
                        <span className="text-sm">⭐</span>
                    </div>
                )}

                {/* Date & Time in fun boxes */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-xl px-4 py-2 text-center" style={{ background: '#FCE7F3', border: '1px solid #F9A8D4' }}>
                        <div className="text-[0.45rem] uppercase tracking-wider opacity-50">Date</div>
                        <div className="text-[0.75rem] font-bold" style={{ color: '#BE185D' }}>{data.date}</div>
                    </div>
                    <div className="text-pink-400">|</div>
                    <div className="rounded-xl px-4 py-2 text-center" style={{ background: '#EDE9FE', border: '1px solid #C4B5FD' }}>
                        <div className="text-[0.45rem] uppercase tracking-wider opacity-50">Time</div>
                        <div className="text-[0.75rem] font-bold" style={{ color: '#7C3AED' }}>{data.time}</div>
                    </div>
                </div>

                {/* Venue */}
                <div className="mb-3 px-5 py-2 rounded-xl" style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}>
                    <p className="text-[0.7rem] font-semibold" style={{ color: '#C2410C' }}>{data.venue}</p>
                    <p className="text-[0.55rem] opacity-60 mt-0.5">{data.address}, {data.city}</p>
                </div>

                {data.quote && (
                    <p className="italic text-[0.55rem] opacity-50 max-w-xs mb-2" style={{ fontFamily: fp.headingFont }}>
                        "{data.quote}"
                    </p>
                )}

                <p className="text-[0.55rem] opacity-50 mt-auto">{data.hostNames}</p>

                <div className="flex items-center gap-3 mt-2 text-[0.5rem] opacity-40">
                    {data.rsvpPhone && <span>RSVP: {data.rsvpPhone}</span>}
                    {data.dresscode && <span>{data.dresscode}</span>}
                </div>

                {/* Party emojis */}
                <div className="text-lg mt-1 opacity-60">🎈🎉🎊</div>
            </div>
        </div>
    );
};
