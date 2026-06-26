import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Palette, Copy, Check } from 'lucide-react';

/* ──────────────── Color conversion utilities ──────────────── */
interface RGB { r: number; g: number; b: number; }
interface HSL { h: number; s: number; l: number; }

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)); }

function hexToRgb(hex: string): RGB | null {
    const clean = hex.replace(/^#/, '');
    if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(clean)) return null;
    let r: number, g: number, b: number;
    if (clean.length === 3) {
        r = parseInt(clean[0] + clean[0], 16);
        g = parseInt(clean[1] + clean[1], 16);
        b = parseInt(clean[2] + clean[2], 16);
    } else {
        r = parseInt(clean.slice(0, 2), 16);
        g = parseInt(clean.slice(2, 4), 16);
        b = parseInt(clean.slice(4, 6), 16);
    }
    return { r, g, b };
}

function rgbToHex(rgb: RGB): string {
    const toHex = (c: number) => clamp(Math.round(c), 0, 255).toString(16).padStart(2, '0');
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

function rgbToHsl(rgb: RGB): HSL {
    const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h: number;
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(hsl: HSL): RGB {
    const h = hsl.h / 360, s = hsl.s / 100, l = hsl.l / 100;
    if (s === 0) {
        const v = Math.round(l * 255);
        return { r: v, g: v, b: v };
    }
    const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return {
        r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
        g: Math.round(hue2rgb(p, q, h) * 255),
        b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
    };
}

function parseColorInput(input: string): RGB | null {
    const trimmed = input.trim();
    // HEX
    if (/^#?[0-9a-fA-F]{3}$|^#?[0-9a-fA-F]{6}$/.test(trimmed)) {
        return hexToRgb(trimmed.startsWith('#') ? trimmed : `#${trimmed}`);
    }
    // rgb(r, g, b) or r, g, b
    const rgbMatch = trimmed.match(/^rgba?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/);
    if (rgbMatch) {
        return { r: clamp(+rgbMatch[1], 0, 255), g: clamp(+rgbMatch[2], 0, 255), b: clamp(+rgbMatch[3], 0, 255) };
    }
    // hsl(h, s%, l%)
    const hslMatch = trimmed.match(/^hsla?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?/);
    if (hslMatch) {
        return hslToRgb({ h: clamp(+hslMatch[1], 0, 360), s: clamp(+hslMatch[2], 0, 100), l: clamp(+hslMatch[3], 0, 100) });
    }
    return null;
}

function getComplementary(rgb: RGB): RGB {
    return { r: 255 - rgb.r, g: 255 - rgb.g, b: 255 - rgb.b };
}

export const ColorConverter: React.FC = () => {
    const [rgb, setRgb] = useState<RGB>({ r: 255, g: 87, b: 51 });
    const [alpha, setAlpha] = useState(1);
    const [inputText, setInputText] = useState('#FF5733');
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const colorInputRef = useRef<HTMLInputElement>(null);

    const hsl = rgbToHsl(rgb);
    const hex = rgbToHex(rgb);
    const complementary = getComplementary(rgb);
    const compHex = rgbToHex(complementary);

    const updateFromRgb = useCallback((newRgb: RGB) => {
        const clamped = { r: clamp(Math.round(newRgb.r), 0, 255), g: clamp(Math.round(newRgb.g), 0, 255), b: clamp(Math.round(newRgb.b), 0, 255) };
        setRgb(clamped);
        setInputText(rgbToHex(clamped));
    }, []);

    const updateFromHsl = useCallback((newHsl: HSL) => {
        const clamped = { h: clamp(Math.round(newHsl.h), 0, 360), s: clamp(Math.round(newHsl.s), 0, 100), l: clamp(Math.round(newHsl.l), 0, 100) };
        const newRgb = hslToRgb(clamped);
        setRgb(newRgb);
        setInputText(rgbToHex(newRgb));
    }, []);

    const handleInputChange = (value: string) => {
        setInputText(value);
        const parsed = parseColorInput(value);
        if (parsed) setRgb(parsed);
    };

    const handleColorPicker = (e: React.ChangeEvent<HTMLInputElement>) => {
        const parsed = hexToRgb(e.target.value);
        if (parsed) {
            setRgb(parsed);
            setInputText(e.target.value.toUpperCase());
        }
    };

    const copyValue = async (key: string, value: string) => {
        await navigator.clipboard.writeText(value);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 1500);
    };

    const formats = [
        { key: 'hex', label: 'HEX', value: hex.toUpperCase() },
        { key: 'rgb', label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
        { key: 'rgba', label: 'RGBA', value: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})` },
        { key: 'hsl', label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
        { key: 'css', label: 'CSS Variable', value: `--color-primary: ${hex.toUpperCase()};` },
    ];

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <Palette className="w-5 h-5 text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-800">Color Converter</h2>
            </div>

            {/* Input & Preview */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
                <label className="text-xs font-semibold text-slate-600">Enter Color (HEX, RGB, or HSL)</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={e => handleInputChange(e.target.value)}
                        placeholder="#FF5733 or rgb(255,87,51) or hsl(11,100%,60%)"
                        className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                    <input
                        ref={colorInputRef}
                        type="color"
                        value={hex}
                        onChange={handleColorPicker}
                        className="w-10 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                    />
                </div>

                {/* Color Swatches */}
                <div className="flex gap-3">
                    <div>
                        <p className="text-xs text-slate-400 mb-1">Selected Color</p>
                        <div
                            className="w-24 h-24 rounded-xl border border-slate-200 shadow-inner"
                            style={{ backgroundColor: `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})` }}
                        />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 mb-1">Complementary</p>
                        <div
                            className="w-24 h-24 rounded-xl border border-slate-200 shadow-inner cursor-pointer"
                            onClick={() => updateFromRgb(complementary)}
                            title="Click to use this color"
                            style={{ backgroundColor: compHex }}
                        />
                        <p className="text-xs text-slate-500 mt-1 font-mono">{compHex.toUpperCase()}</p>
                    </div>
                </div>
            </div>

            {/* RGB Sliders */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-700">RGB Sliders</h3>
                {([['R', 'r', rgb.r, '#ef4444'] as const, ['G', 'g', rgb.g, '#22c55e'] as const, ['B', 'b', rgb.b, '#3b82f6'] as const]).map(([label, key, val, color]) => (
                    <div key={key} className="flex items-center gap-3">
                        <span className="text-xs font-bold w-4" style={{ color }}>{label}</span>
                        <input
                            type="range"
                            min={0}
                            max={255}
                            value={val}
                            onChange={e => updateFromRgb({ ...rgb, [key]: Number(e.target.value) })}
                            className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                            style={{ accentColor: color }}
                        />
                        <input
                            type="number"
                            min={0}
                            max={255}
                            value={val}
                            onChange={e => updateFromRgb({ ...rgb, [key]: clamp(Number(e.target.value) || 0, 0, 255) })}
                            className="w-14 text-xs text-center bg-slate-50 border border-slate-200 rounded px-1 py-0.5 font-mono"
                        />
                    </div>
                ))}
            </div>

            {/* HSL Sliders */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-700">HSL Sliders</h3>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-600 w-4">H</span>
                    <input
                        type="range" min={0} max={360} value={hsl.h}
                        onChange={e => updateFromHsl({ ...hsl, h: Number(e.target.value) })}
                        className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{ accentColor: hex }}
                    />
                    <input
                        type="number" min={0} max={360} value={hsl.h}
                        onChange={e => updateFromHsl({ ...hsl, h: clamp(Number(e.target.value) || 0, 0, 360) })}
                        className="w-14 text-xs text-center bg-slate-50 border border-slate-200 rounded px-1 py-0.5 font-mono"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-600 w-4">S</span>
                    <input
                        type="range" min={0} max={100} value={hsl.s}
                        onChange={e => updateFromHsl({ ...hsl, s: Number(e.target.value) })}
                        className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{ accentColor: hex }}
                    />
                    <input
                        type="number" min={0} max={100} value={hsl.s}
                        onChange={e => updateFromHsl({ ...hsl, s: clamp(Number(e.target.value) || 0, 0, 100) })}
                        className="w-14 text-xs text-center bg-slate-50 border border-slate-200 rounded px-1 py-0.5 font-mono"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-600 w-4">L</span>
                    <input
                        type="range" min={0} max={100} value={hsl.l}
                        onChange={e => updateFromHsl({ ...hsl, l: Number(e.target.value) })}
                        className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{ accentColor: hex }}
                    />
                    <input
                        type="number" min={0} max={100} value={hsl.l}
                        onChange={e => updateFromHsl({ ...hsl, l: clamp(Number(e.target.value) || 0, 0, 100) })}
                        className="w-14 text-xs text-center bg-slate-50 border border-slate-200 rounded px-1 py-0.5 font-mono"
                    />
                </div>
            </div>

            {/* Alpha Slider */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-2">
                <h3 className="text-xs font-bold text-slate-700">Alpha (Opacity)</h3>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-600 w-4">A</span>
                    <input
                        type="range" min={0} max={1} step={0.01} value={alpha}
                        onChange={e => setAlpha(Number(e.target.value))}
                        className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{ accentColor: hex }}
                    />
                    <span className="text-xs font-mono w-10 text-center text-slate-600">{alpha.toFixed(2)}</span>
                </div>
            </div>

            {/* Output Formats */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-2">
                <h3 className="text-xs font-bold text-slate-700 mb-2">Output Formats</h3>
                {formats.map(f => (
                    <div key={f.key} className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500 w-20 shrink-0">{f.label}</span>
                        <code className="text-xs font-mono text-slate-700 flex-1 bg-slate-50 rounded px-2 py-1">{f.value}</code>
                        <button
                            onClick={() => copyValue(f.key, f.value)}
                            className="px-2 py-1 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-50 shrink-0"
                        >
                            {copiedKey === f.key ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
