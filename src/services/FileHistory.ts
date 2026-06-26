import { getISTTimestamp } from '@/utils/dateUtils';

const STORAGE_KEY = 'reportiq_file_history';
const MAX_FILES = 20;

export interface FileRecord {
  id: string;
  fileName: string;
  fileSize: number;
  rowCount?: number;
  columnCount?: number;
  uploadedAt: string;
  schema?: { field: string; type: string }[];
}

export const fileHistory = {
  getAll(): FileRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  add(record: Omit<FileRecord, 'id' | 'uploadedAt'>): { success: boolean; message?: string; id?: string } {
    const files = this.getAll();
    if (files.some(f => f.fileName === record.fileName)) {
      return { success: false, message: 'Are you want open same file again?' };
    }
    if (files.length >= MAX_FILES) {
      return { success: false, message: `You can store up to ${MAX_FILES} file records. Please remove an existing one first.` };
    }
    const id = crypto.randomUUID();
    const newRecord: FileRecord = {
      ...record,
      id,
      uploadedAt: getISTTimestamp(),
    };
    files.unshift(newRecord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
    return { success: true, id };
  },

  remove(id: string) {
    const files = this.getAll().filter(f => f.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY);
  },

  exportJSON(): string {
    return JSON.stringify(this.getAll(), null, 2);
  },

  importJSON(jsonString: string): { success: boolean; message?: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) return { success: false, message: 'Invalid format: expected an array.' };
      for (const item of parsed) {
        if (!item.fileName || !item.id) return { success: false, message: 'Invalid file record format.' };
      }
      if (parsed.length > MAX_FILES) return { success: false, message: `Cannot import more than ${MAX_FILES} records.` };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      return { success: true };
    } catch {
      return { success: false, message: 'Invalid JSON file.' };
    }
  },

  count(): number {
    return this.getAll().length;
  },
};
