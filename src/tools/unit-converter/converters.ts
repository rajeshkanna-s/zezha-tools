export type TempUnit = 'C' | 'F' | 'K' | 'R';

// Convert any temp to Celsius first
export function toCelsius(v: number, from: TempUnit): number {
    switch (from) {
        case 'C': return v;
        case 'F': return (v - 32) * 5 / 9;
        case 'K': return v - 273.15;
        case 'R': return (v * 5 / 9) - 273.15;
    }
}

// Convert from Celsius to any unit
export function fromCelsius(c: number, to: TempUnit): number {
    switch (to) {
        case 'C': return c;
        case 'F': return (c * 9 / 5) + 32;
        case 'K': return c + 273.15;
        case 'R': return (c + 273.15) * 9 / 5;
    }
}

// Show all 4 at once
export function convertTempAll(v: number, from: TempUnit) {
    const c = toCelsius(v, from);
    return {
        C: { result: fromCelsius(c, 'C'), label: 'Celsius', symbol: '°C' },
        F: { result: fromCelsius(c, 'F'), label: 'Fahrenheit', symbol: '°F' },
        K: { result: fromCelsius(c, 'K'), label: 'Kelvin', symbol: 'K' },
        R: { result: fromCelsius(c, 'R'), label: 'Rankine', symbol: '°R' },
    };
}

export const LENGTH_UNITS = {
    nm: { factor: 1e-9, label: 'Nanometre', symbol: 'nm' },
    um: { factor: 1e-6, label: 'Micrometre', symbol: 'µm' },
    mm: { factor: 0.001, label: 'Millimetre', symbol: 'mm' },
    cm: { factor: 0.01, label: 'Centimetre', symbol: 'cm' },
    dm: { factor: 0.1, label: 'Decimetre', symbol: 'dm' },
    m: { factor: 1.0, label: 'Metre', symbol: 'm' },
    km: { factor: 1000, label: 'Kilometre', symbol: 'km' },
    in: { factor: 0.0254, label: 'Inch', symbol: 'in' },
    ft: { factor: 0.3048, label: 'Foot', symbol: 'ft' },
    yd: { factor: 0.9144, label: 'Yard', symbol: 'yd' },
    mi: { factor: 1609.344, label: 'Mile', symbol: 'mi' },
    nmi: { factor: 1852.0, label: 'Nautical Mile', symbol: 'nmi' },
    ly: { factor: 9.461e15, label: 'Light Year', symbol: 'ly' },
    AU: { factor: 1.496e11, label: 'Astronomical Unit', symbol: 'AU' },
    haat: { factor: 0.4572, label: 'Haat (Indian)', symbol: 'haat' },
    gaj: { factor: 0.9144, label: 'Gaj (Indian)', symbol: 'gaj' },
} as const;

export const AREA_UNITS = {
    mm2: { factor: 1e-6, label: 'Sq. Millimetre', symbol: 'mm²' },
    cm2: { factor: 1e-4, label: 'Sq. Centimetre', symbol: 'cm²' },
    m2: { factor: 1, label: 'Sq. Metre', symbol: 'm²' },
    km2: { factor: 1e6, label: 'Sq. Kilometre', symbol: 'km²' },
    in2: { factor: 6.4516e-4, label: 'Sq. Inch', symbol: 'in²' },
    ft2: { factor: 0.0929, label: 'Sq. Foot', symbol: 'ft²' },
    yd2: { factor: 0.8361, label: 'Sq. Yard', symbol: 'yd²' },
    acre: { factor: 4046.856, label: 'Acre', symbol: 'ac' },
    ha: { factor: 10000, label: 'Hectare', symbol: 'ha' },
    cent: { factor: 40.4686, label: 'Cent (S.India)', symbol: 'cent' },
    ground: { factor: 222.967, label: 'Ground (TN)', symbol: 'gnd' },
    guntha: { factor: 101.171, label: 'Guntha', symbol: 'gtha' },
    bigha: { factor: 2508.38, label: 'Bigha (avg)', symbol: 'bigha' },
} as const;

export const WEIGHT_UNITS = {
    mg: { factor: 0.000001, label: 'Milligram', symbol: 'mg' },
    g: { factor: 0.001, label: 'Gram', symbol: 'g' },
    kg: { factor: 1.0, label: 'Kilogram', symbol: 'kg' },
    tonne: { factor: 1000, label: 'Metric Tonne', symbol: 't' },
    lb: { factor: 0.4536, label: 'Pound', symbol: 'lb' },
    oz: { factor: 0.02835, label: 'Ounce', symbol: 'oz' },
    stone: { factor: 6.3503, label: 'Stone (UK)', symbol: 'st' },
    tola: { factor: 0.01166, label: 'Tola (India)', symbol: 'tola' },
    seer: { factor: 0.9331, label: 'Seer (India)', symbol: 'seer' },
    maund: { factor: 37.324, label: 'Maund (India)', symbol: 'mnd' },
} as const;

export const VOLUME_UNITS = {
    ml: { factor: 1e-6, label: 'Millilitre', symbol: 'mL' },
    l: { factor: 0.001, label: 'Litre', symbol: 'L' },
    m3: { factor: 1, label: 'Cubic Metre', symbol: 'm³' },
    tsp: { factor: 4.929e-6, label: 'Teaspoon', symbol: 'tsp' },
    tbsp: { factor: 1.479e-5, label: 'Tablespoon', symbol: 'tbsp' },
    cup: { factor: 2.366e-4, label: 'Cup (US)', symbol: 'cup' },
    fl_oz: { factor: 2.957e-5, label: 'Fluid Oz', symbol: 'fl oz' },
    pint: { factor: 4.732e-4, label: 'Pint (US)', symbol: 'pt' },
    gal_us: { factor: 3.785e-3, label: 'Gallon (US)', symbol: 'gal' },
    gal_uk: { factor: 4.546e-3, label: 'Gallon (UK)', symbol: 'gal UK' },
} as const;

export const SPEED_UNITS = {
    mps: { factor: 1, label: 'Metre/sec', symbol: 'm/s' },
    kph: { factor: 1 / 3.6, label: 'Km/hour', symbol: 'km/h' },
    mph: { factor: 0.44704, label: 'Mile/hour', symbol: 'mph' },
    knot: { factor: 0.51444, label: 'Knot', symbol: 'kn' },
    mach: { factor: 340.29, label: 'Mach', symbol: 'Ma' },
} as const;

export const TIME_UNITS = {
    ms: { factor: 0.001, label: 'Millisecond', symbol: 'ms' },
    s: { factor: 1, label: 'Second', symbol: 's' },
    min: { factor: 60, label: 'Minute', symbol: 'min' },
    hr: { factor: 3600, label: 'Hour', symbol: 'hr' },
    day: { factor: 86400, label: 'Day', symbol: 'd' },
    week: { factor: 604800, label: 'Week', symbol: 'wk' },
    month: { factor: 2629746, label: 'Month (avg)', symbol: 'mo' },
    year: { factor: 31556952, label: 'Year', symbol: 'yr' },
} as const;

export const DATA_UNITS = {
    bit: { factor: 1, label: 'Bit', symbol: 'b' },
    byte: { factor: 8, label: 'Byte', symbol: 'B' },
    kb: { factor: 8192, label: 'Kilobyte', symbol: 'KB' },
    mb: { factor: 8388608, label: 'Megabyte', symbol: 'MB' },
    gb: { factor: 8.59e9, label: 'Gigabyte', symbol: 'GB' },
    tb: { factor: 8.796e12, label: 'Terabyte', symbol: 'TB' },
} as const;

export function formatResult(value: number): string {
    if (value === 0) return '0';
    const abs = Math.abs(value);

    // Very large numbers: use locale formatting with commas
    if (abs >= 1e15) return value.toLocaleString('en-IN', { maximumFractionDigits: 0 });
    if (abs >= 1000) return value.toLocaleString('en-IN', { maximumFractionDigits: 4 });

    // Numbers >= 1: show up to 8 significant digits
    if (abs >= 1) return parseFloat(value.toPrecision(8)).toString();

    // Small numbers (< 1): avoid scientific notation completely
    // Calculate how many decimal places we need to show significant digits
    if (abs > 0) {
        const decimalPlaces = Math.max(6, Math.ceil(-Math.log10(abs)) + 4);
        const capped = Math.min(decimalPlaces, 20); // JS max for toFixed is 20
        const fixed = value.toFixed(capped);
        // Trim trailing zeros but keep at least one significant group
        const trimmed = fixed.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.$/, '');
        return trimmed;
    }

    return parseFloat(value.toPrecision(6)).toString();
}
