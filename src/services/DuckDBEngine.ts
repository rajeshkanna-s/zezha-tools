import * as duckdb from '@duckdb/duckdb-wasm';
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
import mvp_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';
import duckdb_wasm_eh from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url';
import eh_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url';



const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
    mvp: {
        mainModule: duckdb_wasm,
        mainWorker: mvp_worker,
    },
    eh: {
        mainModule: duckdb_wasm_eh,
        mainWorker: eh_worker,
    },
};

export class DuckDBEngine {
    private static instance: DuckDBEngine | null = null;
    private db: duckdb.AsyncDuckDB | null = null;
    private connection: duckdb.AsyncDuckDBConnection | null = null;
    private initialized = false;

    private constructor() { }

    static getInstance(): DuckDBEngine {
        if (!DuckDBEngine.instance) {
            DuckDBEngine.instance = new DuckDBEngine();
        }
        return DuckDBEngine.instance;
    }

    async init() {
        if (this.initialized) return;

        try {
            console.log('[DuckDB] Initializing WASM environment...');

            // Select bundle
            const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);

            // Spawn worker
            const worker = new Worker(bundle.mainWorker!);
            const logger = new duckdb.ConsoleLogger();

            this.db = new duckdb.AsyncDuckDB(logger, worker);
            await this.db.instantiate(bundle.mainModule, bundle.pthreadWorker);

            this.connection = await this.db.connect();

            this.initialized = true;
            console.log('[DuckDB] Ready.');
        } catch (error) {
            console.error('[DuckDB] Initialization failed:', error);
            throw error;
        }
    }

    // Ingests an array of JS objects into a DuckDB table using JSON passing
    // (We stringify, put to WASM filesystem, then query to create table)
    async insertJSON(tableName: string, data: any[]) {
        if (!this.connection || !this.db) throw new Error("DuckDB not initialized");

        console.log(`[DuckDB] Ingesting ${data.length} rows into '${tableName}'...`);

        // Convert the array of objects to a JSON string buffer
        const encoder = new TextEncoder();
        const jsonStr = data.map(row => JSON.stringify(row)).join('\n');
        const buffer = encoder.encode(jsonStr);

        // Map it to DuckDB's internal WASM file system
        const fileName = `${tableName}_input.json`;
        await this.db.registerFileBuffer(fileName, buffer);

        // Load into a table using DuckDB's highly optimized JSON reader
        await this.connection.query(`
            DROP TABLE IF EXISTS ${tableName};
            CREATE TABLE ${tableName} AS SELECT * FROM read_json_auto('${fileName}');
        `);

        console.log(`[DuckDB] Table '${tableName}' successfully created.`);
    }

    // Convert BigInt values to Number (DuckDB returns BigInt for COUNT/SUM on integers,
    // but JSON.stringify and React cannot handle BigInt, causing crashes)
    private sanitizeRow(obj: Record<string, any>): Record<string, any> {
        const clean: Record<string, any> = {};
        for (const key in obj) {
            const val = obj[key];
            clean[key] = typeof val === 'bigint' ? Number(val) : val;
        }
        return clean;
    }

    // Generic query execution
    async query(sql: string): Promise<any[]> {
        if (!this.connection) throw new Error("DuckDB not initialized");

        try {
            const result = await this.connection.query(sql);
            // Return an Arrow Table -> array of JS Objects for easy React consumption
            // sanitizeRow converts BigInt → Number to prevent JSON.stringify crashes
            return result.toArray().map((row: any) => this.sanitizeRow(row.toJSON()));
        } catch (error) {
            console.error("[DuckDB] Query Error:", sql, error);
            throw error;
        }
    }

    // Cleanup
    async terminate() {
        if (this.connection) await this.connection.close();
        if (this.db) await this.db.terminate();
        this.initialized = false;
    }
}

export const dbEngine = DuckDBEngine.getInstance();
