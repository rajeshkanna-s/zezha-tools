import type { FilterState, SchemaField, CalculatedColumn } from '../types/dataTypes';
import { dbEngine } from './DuckDBEngine';

export class DataEngine {
    private rawData: any[] = [];
    private schema: SchemaField[] = [];
    private activeFilters: FilterState = {};
    private dateRangeFilters: Record<string, { from: string; to: string }> = {};
    private globalSearchTerm: string = '';
    private calculatedColumns: CalculatedColumn[] = [];
    private isReady = false;
    private worker: Worker | null = null;
    private lastSheetNames: string[] = [];

    readonly TABLE_NAME = 'report_data';

    constructor() {
        this.initDuckDB();
    }

    private async initDuckDB() {
        await dbEngine.init();
    }

    public async loadDataFromFile(file: File, sheetIndex = 0): Promise<{ success: boolean; sheetNames: string[] }> {
        return new Promise((resolve) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const buffer = e.target?.result as ArrayBuffer;

                this.worker = new Worker(new URL('../workers/fileParser.worker.ts', import.meta.url), { type: 'module' });

                this.worker.onmessage = async (msgEvent) => {
                    const result = msgEvent.data;

                    if (result.type === 'PARSE_SUCCESS' && result.data) {
                        this.rawData = result.data;
                        this.schema = this.inferSchema(this.rawData);

                        // Post-process: convert any remaining Excel serial dates to readable strings
                        this.convertSerialDates();

                        this.activeFilters = {};
                        this.dateRangeFilters = {};
                        this.globalSearchTerm = '';
                        this.calculatedColumns = [];
                        this.lastSheetNames = result.sheetNames || [];

                        try {
                            await dbEngine.insertJSON(this.TABLE_NAME, this.rawData);
                            this.isReady = true;
                            resolve({ success: true, sheetNames: result.sheetNames || [] });
                        } catch (err) {
                            console.error('Failed to load into DuckDB:', err);
                            resolve({ success: false, sheetNames: [] });
                        }
                    } else {
                        console.error('Worker failed to parse:', result.error);
                        resolve({ success: false, sheetNames: [] });
                    }

                    this.worker?.terminate();
                };

                this.worker.postMessage({ type: 'PARSE_FILE', buffer, sheetIndex });
            };

            reader.readAsArrayBuffer(file);
        });
    }

    public isInitialized(): boolean {
        return this.isReady;
    }

    public getSchema(): SchemaField[] {
        return this.schema;
    }

    public getSheetNames(): string[] {
        return this.lastSheetNames;
    }

    // ── Filters ──────────────────────────────────────────────────────

    public async getUniqueValuesForField(field: string): Promise<string[]> {
        if (!this.isReady) return [];
        const sql = `SELECT DISTINCT "${field}" as val FROM ${this.TABLE_NAME} WHERE "${field}" IS NOT NULL ORDER BY val ASC LIMIT 1000`;
        const res = await dbEngine.query(sql);
        return res.map(r => String(r.val));
    }

    public applyFilter(field: string, values: string[]) {
        if (values.length === 0) {
            delete this.activeFilters[field];
        } else {
            this.activeFilters[field] = values;
        }
    }

    public applyDateRangeFilter(field: string, from: string, to: string) {
        if (!from && !to) {
            delete this.dateRangeFilters[field];
        } else {
            this.dateRangeFilters[field] = { from, to };
        }
    }

    public clearDateRangeFilter(field: string) {
        delete this.dateRangeFilters[field];
    }

    public getDateRangeFilters(): Record<string, { from: string; to: string }> {
        return this.dateRangeFilters;
    }

    public setGlobalSearch(term: string) {
        this.globalSearchTerm = term.trim();
    }

    public getGlobalSearch(): string {
        return this.globalSearchTerm;
    }

    public clearFilters() {
        this.activeFilters = {};
        this.dateRangeFilters = {};
        this.globalSearchTerm = '';
    }

    public getFilterWhereClause(): string {
        const conditions: string[] = [];

        // Category/value filters
        for (const [field, values] of Object.entries(this.activeFilters)) {
            if (values.length === 0) continue;
            const escapedVals = values.map(v => `'${v.replace(/'/g, "''")}'`).join(', ');
            conditions.push(`"${field}" IN (${escapedVals})`);
        }

        // Date range filters
        for (const [field, range] of Object.entries(this.dateRangeFilters)) {
            if (range.from) {
                conditions.push(`TRY_CAST("${field}" AS DATE) >= DATE '${range.from}'`);
            }
            if (range.to) {
                conditions.push(`TRY_CAST("${field}" AS DATE) <= DATE '${range.to}'`);
            }
        }

        // Global search across text/category columns
        if (this.globalSearchTerm && this.schema.length > 0) {
            const searchTerm = this.globalSearchTerm.replace(/'/g, "''");
            const textCols = this.schema.filter(c => (c.type === 'text' || c.type === 'category') && !c.isCalculated);
            if (textCols.length > 0) {
                const searchConditions = textCols.map(c =>
                    `LOWER(CAST("${c.field}" AS VARCHAR)) LIKE '%${searchTerm.toLowerCase()}%'`
                );
                conditions.push(`(${searchConditions.join(' OR ')})`);
            }
        }

        return conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    }

    // ── Calculated Columns ─────────────────────────────────────────

    public addCalculatedColumn(col: CalculatedColumn) {
        this.calculatedColumns = this.calculatedColumns.filter(c => c.name !== col.name);
        this.calculatedColumns.push(col);
        const existing = this.schema.find(c => c.field === col.name);
        if (!existing) {
            this.schema.push({ field: col.name, type: 'number', uniqueValues: [], isCalculated: true });
        }
    }

    public removeCalculatedColumn(name: string) {
        this.calculatedColumns = this.calculatedColumns.filter(c => c.name !== name);
        this.schema = this.schema.filter(c => c.field !== name);
    }

    public getCalculatedColumns(): CalculatedColumn[] {
        return this.calculatedColumns;
    }

    private buildCalcExpr(col: CalculatedColumn): string {
        const a = `CAST("${col.colA}" AS DOUBLE)`;
        const b = `CAST("${col.colB}" AS DOUBLE)`;
        if (col.op === '/') {
            return `CASE WHEN ${b} = 0 THEN NULL ELSE (${a} / ${b}) END`;
        }
        return `(${a} ${col.op} ${b})`;
    }

    private getCalcExprByName(name: string): string | null {
        const calc = this.calculatedColumns.find(c => c.name === name);
        if (!calc) return null;
        return this.buildCalcExpr(calc);
    }

    // ── Core Queries ──────────────────────────────────────────────

    public async getFilteredData(limit: number = 100, offset: number = 0): Promise<any[]> {
        if (!this.isReady) return [];
        const where = this.getFilterWhereClause();
        const calcExprs = this.calculatedColumns.map(c => `${this.buildCalcExpr(c)} as "${c.name}"`).join(', ');
        const selectExtra = calcExprs ? `, ${calcExprs}` : '';
        const sql = `SELECT *${selectExtra} FROM ${this.TABLE_NAME} ${where} LIMIT ${limit} OFFSET ${offset}`;
        return await dbEngine.query(sql);
    }

    public async getAllFilteredData(): Promise<any[]> {
        if (!this.isReady) return [];
        const where = this.getFilterWhereClause();
        const calcExprs = this.calculatedColumns.map(c => `${this.buildCalcExpr(c)} as "${c.name}"`).join(', ');
        const selectExtra = calcExprs ? `, ${calcExprs}` : '';
        const sql = `SELECT *${selectExtra} FROM ${this.TABLE_NAME} ${where}`;
        return await dbEngine.query(sql);
    }

    public async getTotalRowscount(): Promise<number> {
        if (!this.isReady) return 0;
        const where = this.getFilterWhereClause();
        const res = await dbEngine.query(`SELECT COUNT(*) as cnt FROM ${this.TABLE_NAME} ${where}`);
        return Number(res[0]?.cnt) || 0;
    }

    public async aggregateData(labelCol: string, valCol: string, aggType: 'sum' | 'avg' | 'count'): Promise<any[]> {
        if (!this.isReady) return [];
        const where = this.getFilterWhereClause();

        const calcExpr = this.getCalcExprByName(valCol);
        const valExpr = calcExpr ?? `CAST("${valCol}" AS DOUBLE)`;

        let aggExpr = '';
        if (aggType === 'sum') aggExpr = `SUM(${valExpr})`;
        else if (aggType === 'avg') aggExpr = `AVG(${valExpr})`;
        else aggExpr = calcExpr ? `COUNT(${valExpr})` : `COUNT("${valCol}")`;

        const sql = `
            SELECT
                COALESCE(CAST("${labelCol}" AS VARCHAR), '(Blank)') as _label,
                ${aggExpr} as _value
            FROM ${this.TABLE_NAME}
            ${where}
            GROUP BY _label
            ORDER BY _value DESC
        `;

        const res = await dbEngine.query(sql);
        return res.map(row => ({
            _label: row._label,
            [`${valCol}_${aggType}`]: row._value
        }));
    }

    // Scatter chart: raw X/Y pairs
    public async getScatterData(xCol: string, yCol: string, limit = 500): Promise<{ x: number; y: number }[]> {
        if (!this.isReady) return [];
        const where = this.getFilterWhereClause();
        const xExpr = this.getCalcExprByName(xCol) ?? `CAST("${xCol}" AS DOUBLE)`;
        const yExpr = this.getCalcExprByName(yCol) ?? `CAST("${yCol}" AS DOUBLE)`;
        const sql = `
            SELECT ${xExpr} as x, ${yExpr} as y
            FROM ${this.TABLE_NAME}
            ${where}
            WHERE ${xExpr} IS NOT NULL AND ${yExpr} IS NOT NULL
            LIMIT ${limit}
        `;
        try {
            return await dbEngine.query(sql);
        } catch {
            return [];
        }
    }

    // Trend data for sparklines (last N values of a numeric column ordered by rowid)
    public async getSparklineData(valCol: string, points = 12): Promise<number[]> {
        if (!this.isReady) return [];
        const calcExpr = this.getCalcExprByName(valCol);
        const valExpr = calcExpr ?? `CAST("${valCol}" AS DOUBLE)`;
        const dateCols = this.schema.filter(c => c.type === 'date');
        let orderBy = '';
        if (dateCols.length > 0) {
            orderBy = `ORDER BY "${dateCols[0].field}" ASC`;
        }
        const sql = `
            SELECT ${valExpr} as v
            FROM ${this.TABLE_NAME}
            WHERE ${valExpr} IS NOT NULL
            ${orderBy}
            LIMIT ${points}
        `;
        try {
            const res = await dbEngine.query(sql);
            return res.map(r => Number(r.v) || 0);
        } catch {
            return [];
        }
    }

    // ── Data Quality ──────────────────────────────────────────────

    public async getDataQualityScore(): Promise<{ missingPercent: number; duplicateCount: number; issues: string[] }> {
        if (!this.isReady || this.schema.length === 0) return { missingPercent: 0, duplicateCount: 0, issues: [] };

        const totalRows = await this.getTotalRowscount();
        if (totalRows === 0) return { missingPercent: 0, duplicateCount: 0, issues: [] };

        const realCols = this.schema.filter(c => !c.isCalculated);
        let totalCells = totalRows * realCols.length;
        let totalNulls = 0;
        const issues: string[] = [];

        for (const col of realCols) {
            const nullRes = await dbEngine.query(
                `SELECT COUNT(*) as cnt FROM ${this.TABLE_NAME} WHERE "${col.field}" IS NULL OR CAST("${col.field}" AS VARCHAR) = ''`
            );
            const nullCount = Number(nullRes[0]?.cnt || 0);
            totalNulls += nullCount;
            if (nullCount > 0) {
                const pct = ((nullCount / totalRows) * 100).toFixed(1);
                if (parseFloat(pct) > 5) issues.push(`Column '${col.field}' has ${pct}% missing values.`);
            }
        }

        const missingPercent = parseFloat(((totalNulls / totalCells) * 100).toFixed(2));

        const allCols = realCols.map(c => `"${c.field}"`).join(', ');
        let duplicateCount = 0;
        try {
            const dupRes = await dbEngine.query(
                `SELECT COUNT(*) as dup_cnt FROM (SELECT ${allCols}, COUNT(*) FROM ${this.TABLE_NAME} GROUP BY ${allCols} HAVING COUNT(*) > 1) sub`
            );
            duplicateCount = Number(dupRes[0]?.dup_cnt || 0);
            if (duplicateCount > 0) issues.push(`Dataset contains ${duplicateCount} duplicate rows.`);
        } catch (e) {
            console.warn('Duplicate check failed', e);
        }

        if (missingPercent > 10) issues.push('High volume of missing data. Consider imputation or dropping empty rows.');

        return { missingPercent, duplicateCount, issues };
    }

    // Remove duplicate rows, returns number of rows removed
    public async removeDuplicates(): Promise<number> {
        if (!this.isReady) return 0;
        const before = await this.getTotalRowscount();
        const realCols = this.schema.filter(c => !c.isCalculated).map(c => `"${c.field}"`).join(', ');
        const deduped = await dbEngine.query(`SELECT DISTINCT ${realCols} FROM ${this.TABLE_NAME}`);
        await dbEngine.insertJSON(this.TABLE_NAME, deduped);
        this.rawData = deduped;
        const after = await this.getTotalRowscount();
        return before - after;
    }

    // ── Analytics ────────────────────────────────────────────────

    public async getAutoInsights(): Promise<string[]> {
        if (!this.isReady || this.schema.length === 0) return [];

        const insights: string[] = [];
        const numCols = this.schema.filter(c => c.type === 'number');
        const catCols = this.schema.filter(c => c.type === 'category');
        const dateCols = this.schema.filter(c => c.type === 'date');

        if (numCols.length === 0 || catCols.length === 0) return [];

        const primaryNum = numCols.find(c => ['price', 'amount', 'revenue', 'sales'].some(k => c.field.toLowerCase().includes(k))) || numCols[0];
        const primaryCat = catCols[0];

        try {
            const distRes = await dbEngine.query(`
                SELECT "${primaryCat.field}" as cat, SUM(CAST("${primaryNum.field}" AS DOUBLE)) as val
                FROM ${this.TABLE_NAME} GROUP BY "${primaryCat.field}" ORDER BY val DESC
            `);
            if (distRes.length > 1) {
                const total = distRes.reduce((acc, r) => acc + (Number(r.val) || 0), 0);
                const topVal = Number(distRes[0].val) || 0;
                if (total > 0 && topVal / total > 0.4) {
                    insights.push(`**${distRes[0].cat}** dominates **${primaryCat.field}**, accounting for **${((topVal / total) * 100).toFixed(1)}%** of total **${primaryNum.field}**.`);
                }
                const bottom = distRes[distRes.length - 1];
                if (total > 0 && Number(bottom.val) / total < 0.05 && distRes.length > 3) {
                    insights.push(`Consider reviewing **${bottom.cat}**, which generates less than 5% of overall **${primaryNum.field}**.`);
                }
            }

            if (dateCols.length > 0) {
                const trendRes = await dbEngine.query(`
                    SELECT DATE_TRUNC('month', CAST("${dateCols[0].field}" AS DATE)) as month, SUM(CAST("${primaryNum.field}" AS DOUBLE)) as val
                    FROM ${this.TABLE_NAME}
                    WHERE "${dateCols[0].field}" IS NOT NULL AND CAST("${dateCols[0].field}" AS VARCHAR) != ''
                    GROUP BY month ORDER BY month ASC
                `);
                if (trendRes.length >= 2) {
                    const lastVal = Number(trendRes[trendRes.length - 1]?.val || 0);
                    const prevVal = Number(trendRes[trendRes.length - 2]?.val || 0);
                    if (prevVal > 0) {
                        const diff = ((lastVal - prevVal) / prevVal) * 100;
                        if (Math.abs(diff) > 10) {
                            insights.push(`Recent **${primaryNum.field}** ${diff > 0 ? 'grew' : 'dropped'} by **${Math.abs(diff).toFixed(1)}%** vs the previous period.`);
                        }
                    }
                }
            }
        } catch (e) {
            console.warn('Auto insights failed', e);
        }

        return insights;
    }

    public async getAnomalies(): Promise<{ col: string; count: number; maxOutlierStr: string }[]> {
        if (!this.isReady || this.schema.length === 0) return [];

        const numCols = this.schema.filter(c => c.type === 'number' && !c.isCalculated);
        if (numCols.length === 0) return [];

        const anomalies: { col: string; count: number; maxOutlierStr: string }[] = [];
        for (const col of numCols.slice(0, 3)) {
            try {
                const res = await dbEngine.query(`
                    WITH stats AS (SELECT AVG(CAST("${col.field}" AS DOUBLE)) as mean, STDDEV_SAMP(CAST("${col.field}" AS DOUBLE)) as stddev FROM ${this.TABLE_NAME} WHERE "${col.field}" IS NOT NULL),
                    outliers AS (SELECT t."${col.field}" as val, ABS(CAST(t."${col.field}" AS DOUBLE) - s.mean) / s.stddev as z_score FROM ${this.TABLE_NAME} t, stats s WHERE t."${col.field}" IS NOT NULL AND s.stddev > 0 AND ABS(CAST(t."${col.field}" AS DOUBLE) - s.mean) / s.stddev > 3)
                    SELECT COUNT(*) as anomaly_count, MAX(val) as max_val FROM outliers
                `);
                const count = Number(res[0]?.anomaly_count || 0);
                if (count > 0) {
                    anomalies.push({ col: col.field, count, maxOutlierStr: new Intl.NumberFormat('en-US').format(Number(res[0]?.max_val)) });
                }
            } catch (e) {
                console.warn(`Z-Score failed for ${col.field}`, e);
            }
        }
        return anomalies;
    }

    // Column correlation matrix (numeric pairs)
    public async getCorrelationMatrix(): Promise<{ col1: string; col2: string; corr: number }[]> {
        if (!this.isReady) return [];
        const numCols = this.schema.filter(c => c.type === 'number' && !c.isCalculated).slice(0, 7);
        if (numCols.length < 2) return [];

        const results: { col1: string; col2: string; corr: number }[] = [];
        for (let i = 0; i < numCols.length; i++) {
            for (let j = i + 1; j < numCols.length; j++) {
                const c1 = numCols[i].field;
                const c2 = numCols[j].field;
                try {
                    const res = await dbEngine.query(`
                        SELECT CORR(CAST("${c1}" AS DOUBLE), CAST("${c2}" AS DOUBLE)) as corr_val
                        FROM ${this.TABLE_NAME} WHERE "${c1}" IS NOT NULL AND "${c2}" IS NOT NULL
                    `);
                    const corr = Number(res[0]?.corr_val || 0);
                    results.push({ col1: c1, col2: c2, corr: isNaN(corr) ? 0 : parseFloat(corr.toFixed(3)) });
                } catch {
                    results.push({ col1: c1, col2: c2, corr: 0 });
                }
            }
        }
        return results;
    }

    // Execute raw SQL (user-supplied)
    public async executeRawSQL(sql: string): Promise<{ columns: string[]; rows: any[] }> {
        if (!this.isReady) throw new Error('Data not loaded yet.');
        const rows = await dbEngine.query(sql);
        const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
        return { columns, rows };
    }

    // ── Date Serial Conversion ──────────────────────────────────

    private convertSerialDates() {
        // Find date-type columns that still have numeric values (Excel serial dates)
        const dateCols = this.schema.filter(c => c.type === 'date');
        if (dateCols.length === 0 || this.rawData.length === 0) return;

        for (const col of dateCols) {
            // Check if first non-null value is a number (serial date)
            const sample = this.rawData.find(r => r[col.field] !== null && r[col.field] !== undefined && r[col.field] !== '');
            if (!sample || typeof sample[col.field] !== 'number') continue;

            // Convert entire column
            for (const row of this.rawData) {
                const val = row[col.field];
                if (typeof val === 'number' && val > 1 && val < 200000) {
                    const excelEpoch = new Date(1899, 11, 30);
                    const date = new Date(excelEpoch.getTime() + val * 86400000);
                    const y = date.getFullYear();
                    const m = String(date.getMonth() + 1).padStart(2, '0');
                    const d = String(date.getDate()).padStart(2, '0');
                    row[col.field] = `${y}-${m}-${d}`;
                }
            }
        }
    }

    // ── Schema Inference ─────────────────────────────────────────

    // Check if column name hints at a date field
    private isDateColumnName(name: string): boolean {
        const lower = name.toLowerCase().replace(/[^a-z]/g, '');
        const dateKeywords = ['date', 'dob', 'birth', 'join', 'start', 'end', 'created', 'updated',
            'modified', 'expir', 'due', 'deliver', 'assign', 'target', 'complet', 'live', 'dead',
            'timestamp', 'datetime', 'createdat', 'updatedat', 'joinedon', 'hiredate', 'terminat'];
        return dateKeywords.some(kw => lower.includes(kw));
    }

    // Check if column name hints at an ID / serial / non-aggregatable number
    // These are numeric columns that should NEVER be summed/averaged (not money)
    private isIdColumnName(name: string): boolean {
        const lower = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const lowerRaw = name.toLowerCase();

        // Exact/partial match keywords — these are NOT money, NOT summable
        const nonSummableKeywords = [
            // IDs and serial numbers
            'id', 'sno', 'slno', 'serialno', 'srno', 'rowid', 'index', 'uid', 'guid',
            // Codes and reference numbers
            'pincode', 'zipcode', 'zip', 'pin', 'postalcode', 'areacode', 'ifsc', 'ifsccode',
            'code', 'hsn', 'hsncode', 'saccode',
            // Phone / contact
            'mobile', 'mobileno', 'mobilenumber', 'phone', 'phoneno', 'phonenumber',
            'contact', 'contactno', 'contactnumber', 'telephone', 'tel', 'fax', 'faxno',
            'whatsapp',
            // Identity documents
            'aadhar', 'aadhaar', 'aadharno', 'pan', 'panno', 'pannumber', 'passport',
            'passportno', 'driverlicense', 'licenseno', 'voterid', 'rationcard',
            // Account / registration numbers
            'accountno', 'acno', 'accountnumber', 'bankaccount',
            'rollno', 'rollnumber', 'regno', 'regis', 'registrationno', 'registrationnumber',
            'enrollmentno', 'admissionno', 'seatno',
            // Entity IDs
            'employeeid', 'empid', 'empno', 'employeeno', 'staffid',
            'studentid', 'studentno', 'scholarno',
            'orderid', 'orderno', 'ordno', 'ordernum',
            'invoiceno', 'invoiceid', 'invoicenum', 'billno', 'billnumber',
            'ticketid', 'ticketno', 'ticketnumber',
            'customerid', 'custid', 'vendorid', 'supplierid', 'productid',
            'transactionid', 'txnid', 'refno', 'referenceno', 'referencenumber',
            // Vehicle
            'vehicleno', 'vehiclenumber', 'vehicle', 'registrationno', 'chassisno',
            'engineno', 'numberplate', 'plateno',
            // Date/time parts that come as numbers
            'year', 'years', 'month', 'months', 'day', 'days', 'week', 'weeks',
            'hour', 'hours', 'minute', 'minutes', 'quarter',
            'manufacturingyear', 'mfgyear', 'modelyear', 'buildyear',
            'financialyear', 'fy', 'academicyear', 'batchyear', 'joinyear',
            // Rating / ranking (not money)
            'rating', 'ratings', 'rank', 'ranking', 'position', 'priority', 'level',
            'floor', 'floorno', 'roomno', 'room', 'section', 'zone',
            // Age, count-type
            'age', 'experience', 'tenure',
            // Geo coordinates
            'latitude', 'longitude', 'lat', 'lng', 'long', 'elevation', 'altitude',
        ];

        // Check exact match (after removing special chars)
        if (nonSummableKeywords.some(kw => lower === kw.replace(/[^a-z0-9]/g, ''))) return true;

        // Check contains match for the raw lowercase name
        const containsKeywords = [
            'pincode', 'zipcode', 'mobile', 'phone', 'contact', 'aadhar', 'aadhaar',
            'passport', 'vehicle', 'chassis', 'engine', 'plate',
            'year', 'month', 'latitude', 'longitude',
            '_id', '_no', '_code',
        ];
        if (containsKeywords.some(kw => lowerRaw.includes(kw))) return true;

        // Patterns like "order_id", "emp_id", ends with "id" (max 15 chars)
        if (/id$/.test(lower) && lower.length <= 15) return true;
        if (/^id/.test(lower) && lower.length <= 8) return true;
        // Ends with "no" but NOT money-related words
        if (/no$/.test(lower) && lower.length <= 15
            && !lower.includes('amount') && !lower.includes('price')
            && !lower.includes('discount') && !lower.includes('total')) return true;
        // Ends with "number"
        if (/number$/.test(lower) && !lower.includes('amount')) return true;
        // Ends with "code"
        if (/code$/.test(lower)) return true;

        return false;
    }

    // Detect if a string value looks like a date
    private looksLikeDate(val: string): boolean {
        if (!val || val.length < 6) return false;
        // Common date patterns: YYYY-MM-DD, DD/MM/YYYY, MM-DD-YYYY, etc.
        if (/^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}/.test(val)) return true;
        if (/^\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}/.test(val)) return true;
        // ISO with time: 2024-01-15T10:30:00
        if (/^\d{4}-\d{2}-\d{2}T/.test(val)) return true;
        // Textual: "Jan 15, 2024", "15-Mar-2024"
        if (/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i.test(val)) {
            const d = new Date(val);
            if (!isNaN(d.getTime())) return true;
        }
        return false;
    }

    // Detect if a numeric value is likely an Excel serial date
    private isExcelSerialDate(val: number, colName: string): boolean {
        // Excel serial dates: ~1 (1900-01-01) to ~55000+ (2050+)
        // Typical range for modern dates: 35000 (1995) to 55000 (2050)
        if (!Number.isInteger(val)) return false;
        if (val < 30000 || val > 60000) return false;
        // Must also have a date-like column name for safety
        return this.isDateColumnName(colName);
    }

    private inferSchema(data: any[]): SchemaField[] {
        if (!data || data.length === 0) return [];

        const schema: SchemaField[] = [];
        const sampleSize = Math.min(data.length, 100);

        // Collect ALL unique keys from ALL rows (not just first row)
        // This ensures columns with empty first-row values are not missed
        const keySet = new Set<string>();
        const scanForKeys = Math.min(data.length, 500);
        for (let i = 0; i < scanForKeys; i++) {
            if (data[i] && typeof data[i] === 'object') {
                for (const k of Object.keys(data[i])) {
                    keySet.add(k);
                }
            }
        }
        // Preserve column order: start with first row keys, then add any extras
        const firstRowKeys = data[0] ? Object.keys(data[0]) : [];
        const extraKeys = [...keySet].filter(k => !firstRowKeys.includes(k));
        const keys = [...firstRowKeys, ...extraKeys];

        keys.forEach(key => {
            // Skip SheetJS artifact columns (__EMPTY, __EMPTY_1, etc.) and empty/whitespace names
            const trimmed = String(key).trim();
            if (!trimmed || /^__?EMPTY/i.test(trimmed) || trimmed === '__' || trimmed === '_') return;

            const uniqueValues = new Set<any>();
            let numCount = 0;
            let dateCount = 0;
            let excelSerialDateCount = 0;
            let integerCount = 0;
            let decimalCount = 0;
            let percentCount = 0;
            let totalValid = 0;

            for (let i = 0; i < sampleSize; i++) {
                const val = data[i][key];
                if (val === null || val === undefined || val === '') continue;

                totalValid++;
                uniqueValues.add(val);

                if (typeof val === 'number') {
                    numCount++;
                    if (Number.isInteger(val)) integerCount++;
                    else decimalCount++;
                    // Check for Excel serial date
                    if (this.isExcelSerialDate(val, key)) {
                        excelSerialDateCount++;
                    }
                } else if (typeof val === 'string') {
                    const trimVal = val.trim();

                    // Check percentage: "45%", "12.5%"
                    if (/^-?\d+\.?\d*\s*%$/.test(trimVal)) {
                        percentCount++;
                        numCount++;
                    }
                    // Check date string patterns
                    else if (this.looksLikeDate(trimVal)) {
                        dateCount++;
                    }
                    // Check if parseable as number (but not a date string)
                    else if (!isNaN(Number(trimVal.replace(/,/g, ''))) && trimVal.length > 0) {
                        numCount++;
                        const n = Number(trimVal.replace(/,/g, ''));
                        if (Number.isInteger(n)) integerCount++;
                        else decimalCount++;
                    }
                }
            }

            if (totalValid === 0) {
                schema.push({ field: key, type: 'text', uniqueValues: [] });
                return;
            }

            const numRatio = numCount / totalValid;
            const dateRatio = dateCount / totalValid;
            const serialDateRatio = excelSerialDateCount / totalValid;

            let type: 'number' | 'text' | 'date' | 'category' = 'text';

            // Priority 1: Date detection
            // If column name says "date" and values are Excel serial numbers → date
            if (serialDateRatio > 0.5 && this.isDateColumnName(key)) {
                type = 'date';
            }
            // String dates
            else if (dateRatio > 0.6) {
                type = 'date';
            }
            // Column name strongly hints date + all values are integers in serial range
            else if (this.isDateColumnName(key) && numRatio > 0.8 && integerCount > decimalCount) {
                // All integers with a date-named column — likely serial dates
                const sampleVals = Array.from(uniqueValues).filter(v => typeof v === 'number') as number[];
                const allInSerialRange = sampleVals.length > 0 && sampleVals.every(v => v > 25000 && v < 65000);
                if (allInSerialRange) {
                    type = 'date';
                } else {
                    type = 'number';
                }
            }
            // Priority 2: Numeric (but not IDs)
            else if (numRatio > 0.8) {
                if (this.isIdColumnName(key)) {
                    // IDs should be category or text, not aggregated as numbers
                    type = uniqueValues.size <= 50 ? 'category' : 'text';
                } else {
                    type = 'number';
                }
            }
            // Priority 3: Category (low cardinality)
            else if (uniqueValues.size <= 50 || uniqueValues.size / totalValid < 0.4) {
                type = 'category';
            }

            schema.push({ field: key, type, uniqueValues: Array.from(uniqueValues) as string[] });
        });

        return schema;
    }
}

export const dataEngine = new DataEngine();
