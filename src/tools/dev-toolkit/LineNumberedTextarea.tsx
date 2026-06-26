import React, { useRef, useState, useMemo } from 'react';

interface LineNumberedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    containerClassName?: string;
    className?: string;
    style?: React.CSSProperties;
}

export const LineNumberedTextarea: React.FC<LineNumberedTextareaProps> = ({
    value,
    onChange,
    containerClassName = '',
    className = '',
    style = {},
    ...props
}) => {
    const [scrollTop, setScrollTop] = useState(0);

    const lineCount = useMemo(() => {
        const matches = value.match(/\n/g);
        return matches ? matches.length + 1 : 1;
    }, [value]);

    const linesArr = useMemo(
        () => Array.from({ length: Math.max(1, lineCount) }, (_, i) => i + 1),
        [lineCount]
    );

    return (
        <div className={`flex bg-slate-50 border border-slate-200 rounded-lg overflow-hidden relative focus-within:ring-2 focus-within:ring-blue-300 ${containerClassName}`}>
            <div className="w-12 bg-slate-100 border-r border-slate-200 text-right pr-2 py-3 font-mono text-xs text-slate-400 select-none overflow-hidden relative shrink-0">
                <div
                    style={{
                        transform: `translateY(-${scrollTop}px)`,
                        position: 'absolute',
                        right: '0.5rem',
                        top: '0.75rem',
                        width: '100%',
                        lineHeight: '1.5rem' // Exact match to textarea lineHeight
                    }}
                >
                    {linesArr.map(n => (
                        <div key={n} className="h-[1.5rem] flex items-center justify-end">
                            {n}
                        </div>
                    ))}
                </div>
            </div>
            <textarea
                value={value}
                onChange={onChange}
                onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
                wrap="off"
                className={`flex-1 w-full font-mono text-xs p-3 resize-y focus:outline-none bg-transparent ${className}`}
                style={{
                    lineHeight: '1.5rem', // Synchronized line height
                    whiteSpace: 'pre',    // Crucial: prevent soft wraps so numbers align
                    ...style
                }}
                {...props}
            />
        </div>
    );
};
