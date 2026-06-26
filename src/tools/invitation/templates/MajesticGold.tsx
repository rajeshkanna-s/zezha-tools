import React from 'react';
import type { TemplateProps } from '../types';

/** MajesticGold — Ornate gold borders, mandala, temple arch motifs */
export const MajesticGold: React.FC<TemplateProps> = ({ data }) => {
    const { fontPair: fp, decorations: dec } = data;
    const gold = '#D4A017';

    return (
        <div
            className="relative w-full h-full overflow-hidden"
            style={{ background: `linear-gradient(180deg, #FDF6E3, #FAF0D7)`, color: '#3D2B1F', fontFamily: fp.bodyFont }}
        >
            {/* Ornate top arch */}
            <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%]" viewBox="0 0 600 160" style={{ opacity: 0.85 }}>
                {/* Temple arch */}
                <path d="M50 160 Q50 20 300 10 Q550 20 550 160" fill="none" stroke={gold} strokeWidth="2.5" />
                <path d="M70 160 Q70 40 300 30 Q530 40 530 160" fill="none" stroke={gold} strokeWidth="1" opacity="0.4" />
                {/* Kalash on top */}
                <g transform="translate(300, 5)">
                    <ellipse cx="0" cy="8" rx="8" ry="5" fill={gold} opacity="0.5" />
                    <line x1="0" y1="0" x2="0" y2="3" stroke={gold} strokeWidth="1.5" />
                    <circle cx="0" cy="-2" r="2" fill={gold} opacity="0.6" />
                </g>
                {/* Side paisley swirls */}
                {[1, -1].map(dir => (
                    <g key={dir} transform={`translate(${300 + dir * 250}, 80)`}>
                        <path d={`M0 0 Q${dir * 15} -20 ${dir * 5} -40 Q${dir * -5} -30 0 -15`} fill={gold} opacity="0.15" />
                        <circle cx={dir * 8} cy="-25" r="3" fill={gold} opacity="0.3" />
                    </g>
                ))}
                {/* Decorative dots along arch */}
                {[-200, -150, -100, -50, 0, 50, 100, 150, 200].map((offset, i) => {
                    const x = 300 + offset;
                    const y = 20 + Math.abs(offset) * 0.18;
                    return <circle key={i} cx={x} cy={y + 15} r="2" fill={gold} opacity="0.4" />;
                })}
            </svg>

            {/* Bottom ornate border */}
            <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 800 100" style={{ opacity: 0.7 }}>
                <path d="M0 30 Q200 0 400 30 Q600 60 800 30 L800 100 L0 100 Z" fill={gold} opacity="0.06" />
                <path d="M0 50 Q200 30 400 50 Q600 70 800 50" fill="none" stroke={gold} strokeWidth="1.5" opacity="0.3" />
                {/* Corner mandala */}
                {[{ x: 60, y: 70 }, { x: 740, y: 70 }].map((p, i) => (
                    <g key={i}>
                        <circle cx={p.x} cy={p.y} r="15" fill="none" stroke={gold} strokeWidth="1" opacity="0.3" />
                        <circle cx={p.x} cy={p.y} r="8" fill="none" stroke={gold} strokeWidth="0.8" opacity="0.4" />
                        <circle cx={p.x} cy={p.y} r="3" fill={gold} opacity="0.3" />
                    </g>
                ))}
            </svg>

            {/* Gold border */}
            {dec.borderFrame && (
                <>
                    <div className="absolute inset-3" style={{ border: `2px solid ${gold}55` }} />
                    <div className="absolute inset-5" style={{ border: `1px solid ${gold}25` }} />
                </>
            )}

            {/* Corner ornamental pieces */}
            {dec.cornerDecorations && (
                <>
                    {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map((pos, i) => (
                        <div key={i} className={`absolute ${pos}`}>
                            <svg width="40" height="40" viewBox="0 0 40 40">
                                <path d={`M${i % 2 === 0 ? '5 5' : '35 5'} L${i % 2 === 0 ? '5 20' : '35 20'}`} stroke={gold} strokeWidth="2" opacity="0.5" />
                                <path d={`M${i % 2 === 0 ? '5 5' : '35 5'} L${i % 2 === 0 ? '20 5' : '20 5'}`} stroke={gold} strokeWidth="2" opacity="0.5" />
                                <circle cx={i % 2 === 0 ? 8 : 32} cy="8" r="2.5" fill={gold} opacity="0.4" />
                            </svg>
                        </div>
                    ))}
                </>
            )}

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-10 py-14 text-center">
                {/* Swastik / auspicious symbol */}
                <div className="text-xl mb-1" style={{ color: gold }}>☸</div>
                <p className="text-[0.45rem] uppercase tracking-[0.5em] mb-1" style={{ color: gold, opacity: 0.7 }}>
                    ✦ Shubh Vivah ✦
                </p>

                <p className="text-[0.6rem] uppercase tracking-[0.3em] mb-4 opacity-70" style={{ color: '#5D4037' }}>
                    {data.title}
                </p>

                {/* Names in ornate frame */}
                <div className="relative mb-3 px-8 py-3" style={{ border: `1px solid ${gold}30`, borderRadius: '4px', background: `${gold}05` }}>
                    {(data.eventType === 'wedding' || data.eventType === 'engagement' || data.eventType === 'reception') ? (
                        <>
                            <h1 className="text-[1.6rem] leading-tight" style={{ fontFamily: fp.headingFont, fontWeight: fp.headingWeight, color: '#8B0000' }}>
                                {data.groomName || 'Groom'}
                            </h1>
                            <div className="flex items-center gap-2 justify-center my-1">
                                <div className="w-8 h-px" style={{ background: gold }} />
                                <span className="text-base" style={{ color: gold }}>✦</span>
                                <div className="w-8 h-px" style={{ background: gold }} />
                            </div>
                            <h1 className="text-[1.6rem] leading-tight" style={{ fontFamily: fp.headingFont, fontWeight: fp.headingWeight, color: '#8B0000' }}>
                                {data.brideName || 'Bride'}
                            </h1>
                        </>
                    ) : data.honoree ? (
                        <h1 className="text-[1.6rem] leading-tight" style={{ fontFamily: fp.headingFont, fontWeight: fp.headingWeight, color: '#8B0000' }}>
                            {data.honoree}
                        </h1>
                    ) : null}
                </div>

                {/* Divider */}
                {dec.dividerLines && (
                    <div className="flex items-center gap-2 mb-3 w-3/4">
                        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${gold})` }} />
                        <div className="w-2 h-2 rotate-45" style={{ background: gold, opacity: 0.5 }} />
                        <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${gold})` }} />
                    </div>
                )}

                <h2 className="text-sm uppercase tracking-[0.2em] mb-3 font-bold" style={{ color: '#5D4037' }}>
                    {data.eventName}
                </h2>

                {/* Date in decorative box */}
                <div className="flex items-center gap-3 mb-3 rounded-lg px-5 py-2" style={{ background: `${gold}10`, border: `1px solid ${gold}25` }}>
                    <div className="text-center">
                        <div className="text-[0.5rem] uppercase tracking-wider opacity-50">Date</div>
                        <div className="text-[0.75rem] font-bold" style={{ color: '#8B0000' }}>{data.date}</div>
                    </div>
                    <div className="w-px h-6" style={{ background: `${gold}40` }} />
                    <div className="text-center">
                        <div className="text-[0.5rem] uppercase tracking-wider opacity-50">Time</div>
                        <div className="text-[0.75rem] font-bold" style={{ color: '#8B0000' }}>{data.time}</div>
                    </div>
                </div>

                <div className="mb-3">
                    <p className="text-[0.7rem] font-semibold" style={{ color: '#5D4037' }}>{data.venue}</p>
                    <p className="text-[0.55rem] opacity-60 mt-0.5">{data.address}, {data.city}</p>
                </div>

                {(data.subEvent1 || data.subEvent2 || data.subEvent3) && (
                    <div className="w-full max-w-xs mb-3">
                        {[data.subEvent1, data.subEvent2, data.subEvent3].filter(Boolean).map((se, i) => (
                            <div key={i} className="flex justify-between py-1.5 text-[0.55rem]" style={{ borderBottom: `1px solid ${gold}15` }}>
                                <span className="font-bold" style={{ color: '#8B0000' }}>{se!.name}</span>
                                <span className="opacity-60">{se!.date} · {se!.time}</span>
                            </div>
                        ))}
                    </div>
                )}

                {data.quote && (
                    <p className="italic text-[0.55rem] opacity-50 max-w-xs mb-3" style={{ fontFamily: fp.headingFont, color: '#5D4037' }}>
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
