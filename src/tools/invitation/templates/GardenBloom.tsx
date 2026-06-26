import React from 'react';
import type { TemplateProps } from '../types';

/** GardenBloom — Watercolor botanical, soft greens/pinks, elegant leaves */
export const GardenBloom: React.FC<TemplateProps> = ({ data }) => {
    const { fontPair: fp, decorations: dec } = data;

    return (
        <div
            className="relative w-full h-full overflow-hidden"
            style={{
                background: `linear-gradient(180deg, #FEFDF8, #FFF8F0, #FEFDF8)`,
                color: '#2D3B2D',
                fontFamily: fp.bodyFont,
            }}
        >
            {/* Watercolor leaves — top left */}
            <svg className="absolute top-0 left-0 w-40 h-56" viewBox="0 0 160 220" style={{ opacity: 0.7 }}>
                {/* Eucalyptus branch */}
                <path d="M80 0 Q75 40 70 80 Q68 120 72 160 Q74 180 70 210" fill="none" stroke="#4B7A4B" strokeWidth="1.5" opacity="0.4" />
                {/* Leaves along the branch */}
                {[20, 50, 80, 110, 140, 170].map((y, i) => (
                    <g key={i}>
                        <ellipse cx={i % 2 === 0 ? 60 : 85} cy={y} rx="15" ry="8" fill="#6B8E6B" opacity="0.2" transform={`rotate(${i % 2 === 0 ? -30 : 30} ${i % 2 === 0 ? 60 : 85} ${y})`} />
                    </g>
                ))}
                {/* Small pink flowers */}
                {[{ x: 45, y: 30 }, { x: 90, y: 70 }, { x: 50, y: 130 }].map((p, i) => (
                    <g key={`f${i}`}>
                        {[0, 72, 144, 216, 288].map(a => (
                            <ellipse key={a} cx={p.x} cy={p.y - 5} rx="3" ry="6" fill="#F9A8D4" opacity="0.4" transform={`rotate(${a} ${p.x} ${p.y})`} />
                        ))}
                        <circle cx={p.x} cy={p.y} r="2.5" fill="#FBBF24" opacity="0.5" />
                    </g>
                ))}
            </svg>

            {/* Watercolor leaves — top right (mirrored) */}
            <svg className="absolute top-0 right-0 w-40 h-56" viewBox="0 0 160 220" style={{ opacity: 0.7, transform: 'scaleX(-1)' }}>
                <path d="M80 0 Q75 40 70 80 Q68 120 72 160 Q74 180 70 210" fill="none" stroke="#4B7A4B" strokeWidth="1.5" opacity="0.4" />
                {[20, 50, 80, 110, 140, 170].map((y, i) => (
                    <ellipse key={i} cx={i % 2 === 0 ? 60 : 85} cy={y} rx="15" ry="8" fill="#6B8E6B" opacity="0.2" transform={`rotate(${i % 2 === 0 ? -30 : 30} ${i % 2 === 0 ? 60 : 85} ${y})`} />
                ))}
                {[{ x: 50, y: 45 }, { x: 85, y: 90 }].map((p, i) => (
                    <g key={`f${i}`}>
                        {[0, 72, 144, 216, 288].map(a => (
                            <ellipse key={a} cx={p.x} cy={p.y - 5} rx="3" ry="6" fill="#FCA5A5" opacity="0.4" transform={`rotate(${a} ${p.x} ${p.y})`} />
                        ))}
                        <circle cx={p.x} cy={p.y} r="2.5" fill="#FBBF24" opacity="0.5" />
                    </g>
                ))}
            </svg>

            {/* Bottom floral */}
            <svg className="absolute bottom-0 left-0 w-full h-40" viewBox="0 0 800 160" style={{ opacity: 0.65 }}>
                {/* Stems */}
                {[100, 250, 400, 550, 700].map((x, i) => (
                    <g key={i}>
                        <path d={`M${x} 160 Q${x + 5} 120 ${x - 10} 80 Q${x} 60 ${x + 5} 40`} fill="none" stroke="#4B7A4B" strokeWidth="1" opacity="0.3" />
                        {/* Leaves */}
                        <ellipse cx={x - 10} cy={100} rx="12" ry="6" fill="#6B8E6B" opacity="0.2" transform={`rotate(-25 ${x - 10} 100)`} />
                        <ellipse cx={x + 10} cy={80} rx="10" ry="5" fill="#6B8E6B" opacity="0.2" transform={`rotate(30 ${x + 10} 80)`} />
                        {/* Flower */}
                        {[0, 60, 120, 180, 240, 300].map(a => (
                            <ellipse key={a} cx={x + 5} cy={35} rx="4" ry="10" fill={i % 2 === 0 ? '#FCA5A5' : '#F9A8D4'} opacity="0.35" transform={`rotate(${a} ${x + 5} 40)`} />
                        ))}
                        <circle cx={x + 5} cy={40} r="4" fill="#FBBF24" opacity="0.4" />
                    </g>
                ))}
            </svg>

            {/* Light border */}
            {dec.borderFrame && (
                <div className="absolute inset-5 border rounded-xl" style={{ borderColor: '#D4A01730' }} />
            )}

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-10 py-14 text-center">
                <p className="text-[0.55rem] uppercase tracking-[0.35em] mb-3 opacity-60 font-medium" style={{ color: '#6B8E6B' }}>
                    {data.title}
                </p>

                {/* Names */}
                {(data.eventType === 'wedding' || data.eventType === 'engagement' || data.eventType === 'reception') ? (
                    <div className="mb-3">
                        <h1 className="text-[1.8rem] leading-tight" style={{ fontFamily: fp.headingFont, fontWeight: fp.headingWeight, color: '#5D5040' }}>
                            {data.groomName || 'Groom'}
                        </h1>
                        <div className="flex items-center gap-2 justify-center my-1">
                            <div className="w-8 h-px" style={{ background: '#D4A01766' }} />
                            <span className="text-base" style={{ color: '#D4A017' }}>♡</span>
                            <div className="w-8 h-px" style={{ background: '#D4A01766' }} />
                        </div>
                        <h1 className="text-[1.8rem] leading-tight" style={{ fontFamily: fp.headingFont, fontWeight: fp.headingWeight, color: '#5D5040' }}>
                            {data.brideName || 'Bride'}
                        </h1>
                    </div>
                ) : data.honoree ? (
                    <h1 className="text-[1.8rem] mb-3 leading-tight" style={{ fontFamily: fp.headingFont, fontWeight: fp.headingWeight, color: '#5D5040' }}>
                        {data.honoree}
                    </h1>
                ) : null}

                {/* Leaf divider */}
                {dec.dividerLines && (
                    <div className="flex items-center gap-2 mb-3 w-3/4">
                        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #6B8E6B44)' }} />
                        <span style={{ color: '#6B8E6B', opacity: 0.6 }}>🌿</span>
                        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #6B8E6B44)' }} />
                    </div>
                )}

                <h2 className="text-sm uppercase tracking-[0.2em] mb-3 font-semibold" style={{ color: '#6B8E6B' }}>
                    {data.eventName}
                </h2>

                <div className="mb-1 text-[0.7rem]" style={{ color: '#5D5040' }}>{data.date}</div>
                <div className="mb-3 text-[0.6rem] opacity-60">{data.time}</div>

                <div className="mb-3">
                    <p className="text-[0.7rem] font-semibold" style={{ color: '#5D5040' }}>{data.venue}</p>
                    <p className="text-[0.55rem] opacity-60 mt-0.5">{data.address}, {data.city}</p>
                </div>

                {(data.subEvent1 || data.subEvent2 || data.subEvent3) && (
                    <div className="w-full max-w-xs mb-3">
                        {[data.subEvent1, data.subEvent2, data.subEvent3].filter(Boolean).map((se, i) => (
                            <div key={i} className="flex justify-between py-1.5 text-[0.55rem]" style={{ borderBottom: '1px solid #6B8E6B15' }}>
                                <span className="font-medium" style={{ color: '#6B8E6B' }}>{se!.name}</span>
                                <span className="opacity-60">{se!.date} · {se!.time}</span>
                            </div>
                        ))}
                    </div>
                )}

                {data.quote && (
                    <p className="italic text-[0.55rem] opacity-40 max-w-xs mb-3" style={{ fontFamily: fp.headingFont }}>
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
