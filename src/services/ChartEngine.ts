import type { ChartConfig } from '../types/dataTypes';

// Helper to get current theme color from localStorage/CSS
function getThemeColors(): { primary: string; colors: string[] } {
    const savedColor = localStorage.getItem('riq-theme-color') || 'Indigo';
    const presets: Record<string, { primary: string; palette: string[] }> = {
        Indigo: { primary: '#4f46e5', palette: ['#4f46e5', '#818cf8', '#6366f1', '#4338ca', '#3730a3'] },
        Emerald: { primary: '#059669', palette: ['#059669', '#34d399', '#10b981', '#047857', '#065f46'] },
        Rose: { primary: '#e11d48', palette: ['#e11d48', '#fb7185', '#f43f5e', '#be123c', '#9f1239'] },
        Amber: { primary: '#d97706', palette: ['#d97706', '#fbbf24', '#f59e0b', '#b45309', '#92400e'] },
        Violet: { primary: '#7c3aed', palette: ['#7c3aed', '#a78bfa', '#8b5cf6', '#6d28d9', '#5b21b6'] },
        Cyan: { primary: '#0891b2', palette: ['#0891b2', '#22d3ee', '#06b6d4', '#0e7490', '#155e75'] },
        Slate: { primary: '#475569', palette: ['#475569', '#94a3b8', '#64748b', '#334155', '#1e293b'] },
        Pink: { primary: '#db2777', palette: ['#db2777', '#f472b6', '#ec4899', '#be185d', '#9d174d'] },
    };
    const preset = presets[savedColor] || presets.Indigo;
    // Extend with complementary colors for pie charts
    const extendedColors = [
        ...preset.palette,
        '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
        '#06b6d4', '#ec4899', '#f97316', '#64748b', '#84cc16',
        '#eab308', '#14b8a6', '#f43f5e', '#6366f1', '#0ea5e9'
    ];
    // Deduplicate
    const unique = [...new Set(extendedColors)];
    return { primary: preset.primary, colors: unique };
}

function getChartStyle(): string {
    return localStorage.getItem('riq-chart-style') || 'default';
}

export class ChartEngine {
    static generateDefaultConfigs(schema: any[]): ChartConfig[] {
        const ignoredKeywords = ['year', 'years', 'pincode', 'zip', 'id', 'sno', 's.no', 's_no', 'slno', 'sl.no', 'mobile', 'mobileno', 'contact', 'phone'];
        const isIgnored = (f: string) => {
            const lower = f.toLowerCase().replace(/[^a-z0-9]/g, '');
            return ignoredKeywords.some(kw => lower === kw.replace(/[^a-z0-9]/g, '') || f.toLowerCase() === kw);
        };

        // Gather groupable columns: category first, then text with fewer unique values
        const catCols = schema.filter(c => c.type === 'category' && !isIgnored(c.field));
        const textCols = schema.filter(c => c.type === 'text' && !isIgnored(c.field))
            .sort((a, b) => (a.uniqueValues?.length || 0) - (b.uniqueValues?.length || 0));
        // Fallback: use text columns with fewest unique values as groupable
        const groupCols = catCols.length > 0 ? catCols : textCols.slice(0, 3);

        const numCols = schema.filter(c => {
            if (c.type !== 'number') return false;
            return !isIgnored(c.field);
        });

        if (groupCols.length === 0 && numCols.length === 0) return [];

        const configs: ChartConfig[] = [];
        let chartIndex = 0;
        const ts = Date.now();

        const primaryGroup = groupCols[0];
        const secondaryGroup = groupCols.length > 1 ? groupCols[1] : null;

        if (groupCols.length > 0 && numCols.length > 0) {
            // Case 1: We have both groupable and numeric columns — best case
            numCols.slice(0, 3).forEach((numCol, i) => {
                // Bar or Line chart grouped by primary column
                configs.push({
                    id: `chart-${ts}-${chartIndex++}`,
                    type: i % 2 === 0 ? 'bar' : 'line',
                    labelCol: primaryGroup.field,
                    valCol: numCol.field,
                    aggType: 'sum',
                    title: `${numCol.field} by ${primaryGroup.field}`
                });

                // Pie or Doughnut grouped by secondary (or primary)
                const groupField = secondaryGroup ? secondaryGroup.field : primaryGroup.field;
                configs.push({
                    id: `chart-${ts}-${chartIndex++}`,
                    type: i % 2 === 0 ? 'doughnut' : 'pie',
                    labelCol: groupField,
                    valCol: numCol.field,
                    aggType: 'sum',
                    title: `${numCol.field} by ${groupField}`
                });
            });

            // If we have 2+ numeric columns, add an avg chart for variety
            if (numCols.length >= 2) {
                configs.push({
                    id: `chart-${ts}-${chartIndex++}`,
                    type: 'bar',
                    labelCol: primaryGroup.field,
                    valCol: numCols[1].field,
                    aggType: 'avg',
                    title: `Avg ${numCols[1].field} by ${primaryGroup.field}`
                });
            }
        } else if (groupCols.length > 0 && numCols.length === 0) {
            // Case 2: Only groupable columns, no numeric — use COUNT
            groupCols.slice(0, 2).forEach((grp) => {
                configs.push({
                    id: `chart-${ts}-${chartIndex++}`,
                    type: 'bar',
                    labelCol: grp.field,
                    valCol: grp.field,
                    aggType: 'count',
                    title: `Count by ${grp.field}`
                });
                configs.push({
                    id: `chart-${ts}-${chartIndex++}`,
                    type: 'pie',
                    labelCol: grp.field,
                    valCol: grp.field,
                    aggType: 'count',
                    title: `Distribution of ${grp.field}`
                });
            });
        } else if (numCols.length > 0 && groupCols.length === 0) {
            // Case 3: Only numeric columns — pick first text/date column as label fallback
            const fallbackLabel = schema.find(c => (c.type === 'text' || c.type === 'date') && !isIgnored(c.field));
            if (fallbackLabel) {
                numCols.slice(0, 2).forEach((numCol) => {
                    configs.push({
                        id: `chart-${ts}-${chartIndex++}`,
                        type: 'bar',
                        labelCol: fallbackLabel.field,
                        valCol: numCol.field,
                        aggType: 'sum',
                        title: `${numCol.field} by ${fallbackLabel.field}`
                    });
                });
            }
        }

        return configs;
    }

    static generateSingleRandomChart(schema: any[]): ChartConfig | null {
        const catCols = schema.filter(c => c.type === 'category');
        const textCols = schema.filter(c => c.type === 'text')
            .sort((a, b) => (a.uniqueValues?.length || 0) - (b.uniqueValues?.length || 0));
        const groupCols = catCols.length > 0 ? catCols : textCols;
        const numCols = schema.filter(c => c.type === 'number');

        if (groupCols.length === 0) return null;

        const randomGroup = groupCols[Math.floor(Math.random() * groupCols.length)];
        const chartTypes: ('bar' | 'doughnut' | 'line' | 'pie')[] = ['bar', 'doughnut', 'line', 'pie'];
        const randomType = chartTypes[Math.floor(Math.random() * chartTypes.length)];

        if (numCols.length > 0) {
            const randomNum = numCols[Math.floor(Math.random() * numCols.length)];
            const aggTypes: ('sum' | 'avg' | 'count')[] = ['sum', 'avg', 'count'];
            const randomAgg = aggTypes[Math.floor(Math.random() * aggTypes.length)];
            return {
                id: `chart-manual-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                type: randomType,
                labelCol: randomGroup.field,
                valCol: randomNum.field,
                aggType: randomAgg,
                title: `${randomAgg === 'sum' ? '' : randomAgg === 'avg' ? 'Avg ' : 'Count '}${randomNum.field} by ${randomGroup.field}`
            };
        }

        // No numeric columns — count-only chart
        return {
            id: `chart-manual-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            type: randomType,
            labelCol: randomGroup.field,
            valCol: randomGroup.field,
            aggType: 'count',
            title: `Count by ${randomGroup.field}`
        };
    }

    // Scatter chart options from raw XY data
    static getScatterOptions(config: ChartConfig, scatterData: { x: number; y: number }[]) {
        const theme = getThemeColors();
        return {
            title: { show: false },
            color: [theme.primary],
            tooltip: {
                trigger: 'item',
                formatter: (params: any) => `${config.xCol || 'X'}: ${params.value[0]}<br/>${config.yCol || 'Y'}: ${params.value[1]}`
            },
            grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
            xAxis: {
                type: 'value',
                name: config.xCol,
                nameLocation: 'middle',
                nameGap: 25,
                splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } }
            },
            yAxis: {
                type: 'value',
                name: config.yCol,
                nameLocation: 'middle',
                nameGap: 40,
                splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } }
            },
            series: [{
                type: 'scatter',
                data: scatterData.map(d => [d.x, d.y]),
                symbolSize: 8,
                itemStyle: { color: theme.primary, opacity: 0.75 }
            }]
        };
    }

    // Waterfall chart options from aggregated data
    static getWaterfallOptions(config: ChartConfig, aggregatedData: any[]) {
        const theme = getThemeColors();
        const maxBars = 12;
        const displayData = aggregatedData.slice(0, maxBars);
        const labels = displayData.map(row => row._label || '(Blank)');
        const values = displayData.map(row => Number(row[`${config.valCol}_${config.aggType}`]) || 0);

        const baseData: number[] = [];
        const barData: number[] = [];
        let running = 0;
        values.forEach(v => {
            baseData.push(running);
            barData.push(v);
            running += v;
        });

        return {
            title: { show: false },
            color: [theme.primary],
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: (params: any) => {
                    const bar = params.find((p: any) => p.seriesName === 'Value');
                    return bar ? `${bar.name}: ${new Intl.NumberFormat('en-US').format(bar.value)}` : '';
                }
            },
            grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
            xAxis: {
                type: 'category',
                data: labels,
                axisLabel: { interval: 0, rotate: labels.length > 5 ? 30 : 0 },
                axisLine: { lineStyle: { color: '#cbd5e1' } }
            },
            yAxis: {
                type: 'value',
                splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } }
            },
            series: [
                {
                    name: 'Base',
                    type: 'bar',
                    stack: 'waterfall',
                    data: baseData,
                    itemStyle: { borderColor: 'transparent', color: 'transparent' },
                    tooltip: { show: false }
                },
                {
                    name: 'Value',
                    type: 'bar',
                    stack: 'waterfall',
                    data: barData,
                    itemStyle: { color: theme.primary, borderRadius: [4, 4, 0, 0] },
                    label: {
                        show: true,
                        position: 'top',
                        fontSize: 10,
                        formatter: (p: any) => new Intl.NumberFormat('en-US', { notation: 'compact' } as any).format(p.value)
                    }
                }
            ]
        };
    }

    static getEChartOptions(config: ChartConfig, aggregatedData: any[]) {
        const maxBars = 15;
        const displayData = aggregatedData.slice(0, maxBars);

        const labels = displayData.map(row => row._label || '(Blank)');
        const dataArr = displayData.map(row => row[`${config.valCol}_${config.aggType}`]);

        const isPieOrDoughnut = config.type === 'pie' || config.type === 'doughnut';

        let pieData: { name: string, value: any }[] = [];
        if (isPieOrDoughnut) {
            pieData = labels.map((label, i) => ({
                name: label,
                value: dataArr[i]
            }));
        }

        const theme = getThemeColors();
        const chartStyle = getChartStyle();
        const primaryColor = theme.primary;
        const colors = theme.colors;

        // Build style-specific options
        let itemStyle: any = {
            borderRadius: config.type === 'bar' ? [4, 4, 0, 0] : 0,
        };

        let areaStyle: any = config.type === 'line' ? { opacity: 0.1, color: primaryColor } : undefined;
        let lineWidth = 2;
        if (chartStyle === 'flat') {
            itemStyle = { borderRadius: 0 };
            areaStyle = undefined;
        } else if (chartStyle === 'gradient') {
            if (config.type === 'bar' || config.type === 'line') {
                itemStyle = {
                    borderRadius: config.type === 'bar' ? [6, 6, 0, 0] : 0,
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: primaryColor },
                            { offset: 1, color: primaryColor + '33' }
                        ]
                    }
                };
            }
            areaStyle = config.type === 'line' ? {
                opacity: 0.3,
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        { offset: 0, color: primaryColor + '66' },
                        { offset: 1, color: primaryColor + '05' }
                    ]
                }
            } : undefined;
        } else if (chartStyle === 'minimal') {
            itemStyle = { borderRadius: 2 };
            lineWidth = 1.5;
            areaStyle = undefined;
        }

        return {
            title: { show: false },
            color: isPieOrDoughnut ? colors : [primaryColor],
            tooltip: {
                trigger: isPieOrDoughnut ? 'item' : 'axis',
                axisPointer: { type: 'shadow' },
                formatter: isPieOrDoughnut ? '{b}: {c} ({d}%)' : undefined,
                valueFormatter: !isPieOrDoughnut ? (value: number) => new Intl.NumberFormat('en-US').format(value) : undefined
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
                show: false
            },
            xAxis: isPieOrDoughnut ? undefined : {
                type: 'category',
                data: labels,
                axisLabel: { interval: 0, rotate: labels.length > 5 ? 30 : 0 },
                axisLine: { lineStyle: { color: '#cbd5e1' } }
            },
            yAxis: isPieOrDoughnut ? undefined : {
                type: 'value',
                splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } }
            },
            series: [
                {
                    name: `${config.aggType} ${config.valCol}`,
                    type: config.type === 'doughnut' ? 'pie' : config.type,
                    data: isPieOrDoughnut ? pieData : dataArr,
                    radius: config.type === 'doughnut' ? ['40%', '70%'] : (config.type === 'pie' ? '70%' : undefined),
                    itemStyle: isPieOrDoughnut ? {} : itemStyle,
                    areaStyle: areaStyle,
                    lineStyle: config.type === 'line' ? { width: lineWidth } : undefined,
                    smooth: config.type === 'line',
                    emphasis: {
                        itemStyle: {
                            shadowBlur: chartStyle === 'flat' ? 0 : 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: isPieOrDoughnut ? {
                        show: true,
                        formatter: '{b} ({d}%)'
                    } : undefined
                }
            ]
        };
    }
}