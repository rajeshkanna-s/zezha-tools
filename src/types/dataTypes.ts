export type ColumnType = 'numeric' | 'categorical' | 'date' | 'number' | 'text';

export interface SchemaField {
    field: string;
    type: 'number' | 'text' | 'date' | 'category';
    uniqueValues: string[];
    isCalculated?: boolean;
}

export interface ColumnMeta {
    type: ColumnType;
    uniqueCount: number;
}

export interface ProcessedData {
    headers: string[];
    data: any[];
    columnsMeta: Record<string, ColumnMeta>;
    globalRange: {
        minDate: Date | null;
        maxDate: Date | null;
    };
}

export interface KPI {
    id: string;
    title: string;
    value: string;
    subtext?: string;
    sparkline?: number[];
}

export interface ChartConfig {
    id: string;
    type: 'bar' | 'line' | 'pie' | 'doughnut' | 'scatter' | 'waterfall';
    labelCol: string;
    valCol: string;
    aggType: 'sum' | 'avg' | 'count';
    title?: string;
    xCol?: string;
    yCol?: string;
}

export interface FilterState {
    [columnName: string]: string[];
}

export interface DateRangeFilter {
    from: string;
    to: string;
}

export interface CalculatedColumn {
    name: string;
    colA: string;
    op: '+' | '-' | '*' | '/';
    colB: string;
}
