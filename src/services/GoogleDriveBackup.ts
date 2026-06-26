/**
 * ═══════════════════════════════════════════════════════════════════════
 *  Google Drive Cloud Backup Service
 *  ─────────────────────────────────────────────────────────────────────
 *  WhatsApp‑style backup / restore for ReportIQ.
 *  Uses Google Identity Services (GIS) for OAuth and the Drive REST v3
 *  API to store encrypted JSON snapshots in the hidden appDataFolder.
 * ═══════════════════════════════════════════════════════════════════════
 */

import { supabase } from '@/integrations/supabase/client';

/* ── Constants ──────────────────────────────────────────────────── */

const SCOPES = 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/userinfo.email';
const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3';
const BACKUP_FILE_PREFIX = 'reportiq-backup';
const BACKUP_MIME = 'application/json';
const META_KEY = 'riq-gdrive-backup-meta';
const MAX_BACKUPS = 3;

/* ── Types ──────────────────────────────────────────────────────── */

export interface BackupMeta {
  lastBackupAt: string | null;
  lastBackupSize: number;
  backupCount: number;
  googleEmail: string | null;
  autoBackup: 'off' | 'every5h' | 'daily' | 'weekly' | 'monthly';
}

export interface BackupFileInfo {
  id: string;
  name: string;
  createdTime: string;
  size: number;
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  error?: string;
}

/* ── State ──────────────────────────────────────────────────────── */

let accessToken: string | null = null;
let tokenExpiresAt = 0;
let tokenClient: any = null;
let autoBackupTimer: ReturnType<typeof setInterval> | null = null;
let cachedClientId: string | null = null;
let clientIdPromise: Promise<string> | null = null;

/* ── Constants for Supabase ─────────────────────────────────────── */

const SUPABASE_URL = 'https://xprafkvyhdztdxprbqfw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwcmFma3Z5aGR6dGR4cHJicWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MjQwMTAsImV4cCI6MjA4NzQwMDAxMH0.SfZlsqmQr9vCFQhCnma5hKSRqUzLo_dQ9t3FLpa0QGE';

/* ── Helpers ────────────────────────────────────────────────────── */

/**
 * Fetch Google Client ID from Supabase Edge Function (cached).
 */
const fetchClientId = async (): Promise<string> => {
  if (cachedClientId) return cachedClientId;

  // Deduplicate concurrent calls
  if (clientIdPromise) return clientIdPromise;

  clientIdPromise = (async () => {
    try {
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/get-config`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
        },
      });
      if (!resp.ok) throw new Error(`Config fetch failed: ${resp.status}`);
      const data = await resp.json();
      cachedClientId = data.google_client_id || '';
      return cachedClientId || '';
    } catch (err) {
      console.error('[GDrive] Failed to fetch config from Supabase:', err);
      return '';
    } finally {
      clientIdPromise = null;
    }
  })();

  return clientIdPromise!;
};

/**
 * Synchronous check — returns cached value or empty string.
 */
const getClientIdSync = (): string => cachedClientId || '';


export const getBackupMeta = (): BackupMeta => {
  try {
    const raw = localStorage.getItem(META_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {
    lastBackupAt: null,
    lastBackupSize: 0,
    backupCount: 0,
    googleEmail: null,
    autoBackup: 'off',
  };
};

const DEFAULT_META: BackupMeta = {
  lastBackupAt: null,
  lastBackupSize: 0,
  backupCount: 0,
  googleEmail: null,
  autoBackup: 'off',
};

/**
 * Save meta to both localStorage (instant) and Supabase (background).
 */
const saveBackupMeta = (meta: Partial<BackupMeta>) => {
  const current = getBackupMeta();
  const updated = { ...current, ...meta };
  localStorage.setItem(META_KEY, JSON.stringify(updated));

  // Sync to Supabase in background
  syncMetaToSupabase(updated);
};

/**
 * Push backup meta to Supabase profiles table.
 */
const syncMetaToSupabase = async (meta: BackupMeta) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('profiles')
      .update({ gdrive_backup_meta: meta as any })
      .eq('id', user.id);
  } catch (err) {
    console.error('[GDrive] Failed to sync meta to Supabase:', err);
  }
};

/**
 * Load backup meta from Supabase and update localStorage cache.
 * Called once on component mount.
 */
export const loadBackupMetaFromSupabase = async (): Promise<BackupMeta> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return getBackupMeta();

    const { data } = await supabase
      .from('profiles')
      .select('gdrive_backup_meta')
      .eq('id', user.id)
      .single();

    if (data?.gdrive_backup_meta) {
      const meta = { ...DEFAULT_META, ...(data.gdrive_backup_meta as any) } as BackupMeta;
      localStorage.setItem(META_KEY, JSON.stringify(meta));
      return meta;
    }
  } catch (err) {
    console.error('[GDrive] Failed to load meta from Supabase:', err);
  }
  return getBackupMeta();
};

/**
 * Check if Google Drive backup is configured.
 * Triggers an async fetch if not yet loaded.
 */
export const isConfigured = (): boolean => {
  // Trigger background fetch if not cached yet
  if (cachedClientId === null) {
    fetchClientId();
    return true; // Assume configured, will show loading state
  }
  return !!cachedClientId;
};

/* ── Auth ───────────────────────────────────────────────────────── */

/**
 * Returns true if we have a non‑expired token.
 */
export const isSignedIn = (): boolean =>
  !!accessToken && Date.now() < tokenExpiresAt;

/**
 * Wait for the Google Identity Services library to load (async script).
 * Polls every 200ms for up to 10 seconds.
 */
const waitForGIS = (): Promise<void> =>
  new Promise((resolve, reject) => {
    // Already loaded
    if (typeof google !== 'undefined' && google?.accounts?.oauth2) {
      resolve();
      return;
    }

    let attempts = 0;
    const maxAttempts = 50; // 50 × 200ms = 10 seconds
    const timer = setInterval(() => {
      attempts++;
      if (typeof google !== 'undefined' && google?.accounts?.oauth2) {
        clearInterval(timer);
        resolve();
      } else if (attempts >= maxAttempts) {
        clearInterval(timer);
        reject(new Error('Google Identity Services library failed to load. Please check your internet connection and try again.'));
      }
    }, 200);
  });

/**
 * Fetch the signed-in user's email from Google userinfo API.
 */
const fetchGoogleEmail = async (): Promise<string> => {
  try {
    const resp = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!resp.ok) return 'Unknown';
    const data = await resp.json();
    return data.email || 'Unknown';
  } catch {
    return 'Unknown';
  }
};

/**
 * Prompt user to grant Google Drive scope. Returns access_token.
 * Uses GIS popup flow (no redirect).
 */
export const signInToGoogle = async (): Promise<string> => {
  const clientId = await fetchClientId();
  if (!clientId) {
    throw new Error('Google Client ID not configured. Please add VITE_GOOGLE_CLIENT_ID to Supabase secrets.');
  }

  // Wait for GIS library to load (async script)
  await waitForGIS();

  return new Promise((resolve, reject) => {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPES,
      callback: async (resp: TokenResponse) => {
        if (resp.error) {
          reject(new Error(`Google auth error: ${resp.error}`));
          return;
        }
        accessToken = resp.access_token;
        tokenExpiresAt = Date.now() + (resp.expires_in - 60) * 1000; // 1 min buffer

        // Fetch and save user email
        const email = await fetchGoogleEmail();
        saveBackupMeta({ googleEmail: email });

        resolve(resp.access_token);
      },
      error_callback: (err: any) => {
        reject(new Error(err?.message || 'Google sign-in was cancelled'));
      },
    });

    tokenClient.requestAccessToken();
  });
};

/**
 * Ensure we have a valid token, re‑authenticating if needed.
 */
const ensureAuth = async (): Promise<string> => {
  if (isSignedIn()) return accessToken!;
  return signInToGoogle();
};

/**
 * Disconnect (revoke token + clear local state).
 */
export const disconnectGoogle = () => {
  if (accessToken) {
    try {
      google.accounts.oauth2.revoke(accessToken, () => {});
    } catch { /* ignore */ }
  }
  accessToken = null;
  tokenExpiresAt = 0;
  saveBackupMeta({ googleEmail: null });
  stopAutoBackup();
};


/* ── Drive API Helpers ──────────────────────────────────────────── */

/**
 * List all ReportIQ backup files in the hidden appDataFolder.
 */
export const listBackups = async (): Promise<BackupFileInfo[]> => {
  const token = await ensureAuth();
  const q = encodeURIComponent(`name contains '${BACKUP_FILE_PREFIX}' and trashed = false`);
  const resp = await fetch(
    `${DRIVE_API}/files?spaces=appDataFolder&q=${q}&fields=files(id,name,createdTime,size)&orderBy=createdTime desc&pageSize=10`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error?.message || `Drive API error: ${resp.status}`);
  }
  const data = await resp.json();
  return (data.files || []).map((f: any) => ({
    id: f.id,
    name: f.name,
    createdTime: f.createdTime,
    size: parseInt(f.size || '0', 10),
  }));
};

/**
 * Upload a backup JSON string to appDataFolder (multipart upload).
 */
const uploadBackup = async (content: string, fileName: string): Promise<BackupFileInfo> => {
  const token = await ensureAuth();

  const metadata = {
    name: fileName,
    parents: ['appDataFolder'],
    mimeType: BACKUP_MIME,
  };

  const boundary = '-----reportiq_backup_boundary';
  const body =
    `--${boundary}\r\n` +
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    `${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\n` +
    `Content-Type: ${BACKUP_MIME}\r\n\r\n` +
    `${content}\r\n` +
    `--${boundary}--`;

  const resp = await fetch(
    `${UPLOAD_API}/files?uploadType=multipart&fields=id,name,createdTime,size`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body,
    },
  );

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error?.message || `Upload failed: ${resp.status}`);
  }

  const file = await resp.json();
  return {
    id: file.id,
    name: file.name,
    createdTime: file.createdTime,
    size: parseInt(file.size || '0', 10),
  };
};

/**
 * Download a backup file's content by file ID.
 */
const downloadBackup = async (fileId: string): Promise<string> => {
  const token = await ensureAuth();
  const resp = await fetch(`${DRIVE_API}/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) {
    throw new Error(`Failed to download backup: ${resp.status}`);
  }
  return resp.text();
};

/**
 * Delete a file from Drive.
 */
const deleteFile = async (fileId: string): Promise<void> => {
  const token = await ensureAuth();
  await fetch(`${DRIVE_API}/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
};

/* ── Backup / Restore ───────────────────────────────────────────── */

/**
 * Collect all localStorage data and upload to Google Drive.
 * Keeps only the last MAX_BACKUPS files.
 */
export const backupToDrive = async (
  onProgress?: (stage: string) => void,
): Promise<BackupFileInfo> => {
  onProgress?.('Authenticating with Google…');
  await ensureAuth();

  // Collect localStorage
  onProgress?.('Collecting your data…');
  const data: Record<string, any> = {};
  const skipKeys = [META_KEY, 'sb-xprafkvyhdztdxprbqfw-auth-token']; // don't backup auth tokens

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || skipKeys.some(sk => key.startsWith(sk))) continue;
    try {
      data[key] = JSON.parse(localStorage.getItem(key) || 'null');
    } catch {
      data[key] = localStorage.getItem(key);
    }
  }

  const payload = JSON.stringify({
    version: '2.0',
    platform: 'ReportIQ',
    exportedAt: new Date().toISOString(),
    keyCount: Object.keys(data).length,
    data,
  }, null, 0); // compact JSON

  // Upload
  onProgress?.('Uploading to Google Drive…');
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `${BACKUP_FILE_PREFIX}-${ts}.json`;
  const result = await uploadBackup(payload, fileName);

  // Save meta immediately — backup is done!
  saveBackupMeta({
    lastBackupAt: new Date().toISOString(),
    lastBackupSize: payload.length,
  });

  // Cleanup old backups in background (non-blocking)
  listBackups()
    .then(async (allBackups) => {
      if (allBackups.length > MAX_BACKUPS) {
        const toDelete = allBackups.slice(MAX_BACKUPS);
        await Promise.all(toDelete.map(f => deleteFile(f.id).catch(() => {})));
      }
      saveBackupMeta({ backupCount: Math.min(allBackups.length, MAX_BACKUPS) });
    })
    .catch(() => { /* non-critical */ });

  return result;
};

/**
 * Restore from the latest (or specified) backup on Google Drive.
 * Returns the number of keys restored.
 */
export const restoreFromDrive = async (
  fileId?: string,
  onProgress?: (stage: string) => void,
): Promise<number> => {
  onProgress?.('Authenticating with Google…');
  await ensureAuth();

  // Find file
  let targetId = fileId;
  if (!targetId) {
    onProgress?.('Finding latest backup…');
    const backups = await listBackups();
    if (backups.length === 0) {
      throw new Error('No backup found on Google Drive. Create a backup first.');
    }
    targetId = backups[0].id;
  }

  // Download
  onProgress?.('Downloading backup…');
  const raw = await downloadBackup(targetId);

  // Parse & validate
  onProgress?.('Restoring your data…');
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Backup file is corrupted. Unable to parse JSON.');
  }

  if (!parsed.data || typeof parsed.data !== 'object') {
    throw new Error('Invalid backup format — missing data payload.');
  }

  // Write to localStorage
  const data = parsed.data as Record<string, any>;
  const keys = Object.keys(data);
  const skipKeys = [META_KEY, 'sb-xprafkvyhdztdxprbqfw-auth-token'];

  keys.forEach(key => {
    if (skipKeys.some(sk => key.startsWith(sk))) return;
    const value = data[key];
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  });

  return keys.length;
};

/* ── Auto‑Backup ────────────────────────────────────────────────── */

const INTERVALS: Record<string, number> = {
  every5h: 5 * 60 * 60 * 1000,
  daily: 24 * 60 * 60 * 1000,
  weekly: 7 * 24 * 60 * 60 * 1000,
  monthly: 30 * 24 * 60 * 60 * 1000,
};

export const setAutoBackup = (freq: BackupMeta['autoBackup']) => {
  saveBackupMeta({ autoBackup: freq });
  stopAutoBackup();
  if (freq === 'off') return;
  startAutoBackup(freq);
};

const startAutoBackup = (freq: Exclude<BackupMeta['autoBackup'], 'off'>) => {
  const interval = INTERVALS[freq];
  if (!interval) return;

  // Check if enough time has passed since last backup
  const meta = getBackupMeta();
  if (meta.lastBackupAt) {
    const since = Date.now() - new Date(meta.lastBackupAt).getTime();
    if (since < interval) {
      // Schedule for remaining time
      const remaining = interval - since;
      autoBackupTimer = setTimeout(() => {
        runAutoBackup(freq);
      }, remaining) as any;
      return;
    }
  }

  // Run now then schedule
  runAutoBackup(freq);
};

const runAutoBackup = async (freq: Exclude<BackupMeta['autoBackup'], 'off'>) => {
  try {
    if (!isSignedIn()) return; // Need user to be signed in
    await backupToDrive();
    console.log('[GDrive] Auto-backup complete');
  } catch (err) {
    console.error('[GDrive] Auto-backup failed:', err);
  }

  // Schedule next
  const interval = INTERVALS[freq];
  if (interval) {
    autoBackupTimer = setInterval(async () => {
      try {
        if (isSignedIn()) await backupToDrive();
      } catch { /* silent */ }
    }, interval) as any;
  }
};

export const stopAutoBackup = () => {
  if (autoBackupTimer) {
    clearInterval(autoBackupTimer);
    clearTimeout(autoBackupTimer);
    autoBackupTimer = null;
  }
};

/**
 * Initialize auto‑backup on app start if configured.
 */
export const initAutoBackup = () => {
  const meta = getBackupMeta();
  if (meta.autoBackup !== 'off' && isSignedIn()) {
    startAutoBackup(meta.autoBackup);
  }
};

/* ── Format helpers ─────────────────────────────────────────────── */

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const formatTimeAgo = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
};

/* ── Browser Close Alert ────────────────────────────────────────── */

let closeAlertActive = false;

const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  const meta = getBackupMeta();

  // Only show alert if there's no recent backup (more than 1 hour old or never backed up)
  const needsBackup =
    !meta.lastBackupAt ||
    (Date.now() - new Date(meta.lastBackupAt).getTime() > 60 * 60 * 1000);

  if (needsBackup) {
    e.preventDefault();
    // Modern browsers ignore custom messages but still show a generic prompt
    return '';
  }
};

/**
 * Enable or disable the browser close backup reminder.
 */
export const setCloseAlert = (enabled: boolean) => {
  if (enabled && !closeAlertActive) {
    window.addEventListener('beforeunload', handleBeforeUnload);
    closeAlertActive = true;
  } else if (!enabled && closeAlertActive) {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    closeAlertActive = false;
  }
  localStorage.setItem('riq-gdrive-close-alert', JSON.stringify(enabled));
};

export const isCloseAlertEnabled = (): boolean => {
  try {
    return JSON.parse(localStorage.getItem('riq-gdrive-close-alert') || 'false');
  } catch { return false; }
};

/**
 * Initialize close alert on app start if configured.
 */
export const initCloseAlert = () => {
  if (isCloseAlertEnabled()) {
    setCloseAlert(true);
  }
};
