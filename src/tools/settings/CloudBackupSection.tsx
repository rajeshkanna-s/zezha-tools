import React, { useState, useEffect, useCallback } from 'react';
import {
  Cloud, CloudOff, RefreshCw, Download, Upload, Check, AlertTriangle,
  LogOut, Shield, Clock, HardDrive, ChevronDown, Loader2, X, Bell, BellOff
} from 'lucide-react';
import { toast } from 'sonner';
import {
  isConfigured,
  signInToGoogle,
  disconnectGoogle,
  backupToDrive,
  restoreFromDrive,
  listBackups,
  getBackupMeta,
  loadBackupMetaFromSupabase,
  setAutoBackup,
  setCloseAlert,
  isCloseAlertEnabled,
  initCloseAlert,
  formatBytes,
  formatTimeAgo,
  type BackupMeta,
  type BackupFileInfo,
} from '@/services/GoogleDriveBackup';

/* ═══════════════════════════════════════════════════════════════════
   Cloud Backup Section — WhatsApp‑style Google Drive backup UI
   ═══════════════════════════════════════════════════════════════════ */

const AUTO_OPTIONS: { value: BackupMeta['autoBackup']; label: string; desc: string }[] = [
  { value: 'off', label: 'Off', desc: 'Manual only' },
  { value: 'every5h', label: 'Every 5 Hours', desc: 'Most frequent' },
  { value: 'daily', label: 'Daily', desc: 'Every 24 hours' },
  { value: 'weekly', label: 'Weekly', desc: 'Every 7 days' },
  { value: 'monthly', label: 'Monthly', desc: 'Every 30 days' },
];

export const CloudBackupSection: React.FC = () => {
  const [meta, setMeta] = useState<BackupMeta>(getBackupMeta);
  const [connected, setConnected] = useState(() => !!getBackupMeta().googleEmail);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [backupList, setBackupList] = useState<BackupFileInfo[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showAutoDropdown, setShowAutoDropdown] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [restoreFileId, setRestoreFileId] = useState<string | undefined>();
  const [closeAlertOn, setCloseAlertOn] = useState(isCloseAlertEnabled);

  const configured = isConfigured();

  const refreshMeta = useCallback(() => {
    const m = getBackupMeta();
    setMeta(m);
    setConnected(!!m.googleEmail);
  }, []);

  useEffect(() => {
    initCloseAlert();

    // Load meta from Supabase on mount (syncs across devices)
    loadBackupMetaFromSupabase().then(m => {
      setMeta(m);
      setConnected(!!m.googleEmail);
    });

    const interval = setInterval(refreshMeta, 5000);
    return () => clearInterval(interval);
  }, [refreshMeta]);

  /* ── Connect / Disconnect ─────────────────────────────────── */

  const handleConnect = async () => {
    try {
      setLoading(true);
      setProgress('Connecting to Google Drive…');
      await signInToGoogle();
      refreshMeta();
      toast.success('Connected to Google Drive!');

      // Fetch backup list
      try {
        const list = await listBackups();
        setBackupList(list);
      } catch { /* ignore */ }
    } catch (err: any) {
      toast.error(err.message || 'Failed to connect');
    } finally {
      setLoading(false);
      setProgress('');
    }
  };

  const handleDisconnect = () => {
    disconnectGoogle();
    setConnected(false);
    setBackupList([]);
    refreshMeta();
    toast.info('Disconnected from Google Drive');
  };

  /* ── Backup ────────────────────────────────────────────────── */

  const handleBackup = async () => {
    try {
      setLoading(true);
      await backupToDrive(setProgress);
      refreshMeta();

      // Refresh list
      try {
        const list = await listBackups();
        setBackupList(list);
      } catch { /* ignore */ }

      toast.success('Backup saved to Google Drive!', {
        icon: <Cloud className="text-blue-500" size={16} />,
      });
    } catch (err: any) {
      toast.error(err.message || 'Backup failed');
    } finally {
      setLoading(false);
      setProgress('');
    }
  };

  /* ── Restore ───────────────────────────────────────────────── */

  const handleRestore = async () => {
    try {
      setShowRestoreConfirm(false);
      setLoading(true);
      const count = await restoreFromDrive(restoreFileId, setProgress);
      toast.success(`Restored ${count} items from backup! Reloading…`, {
        icon: <Download className="text-emerald-500" size={16} />,
      });
      setTimeout(() => window.location.reload(), 2000);
    } catch (err: any) {
      toast.error(err.message || 'Restore failed');
      setLoading(false);
      setProgress('');
    }
  };

  const confirmRestore = (fileId?: string) => {
    setRestoreFileId(fileId);
    setShowRestoreConfirm(true);
  };

  /* ── Auto-backup ───────────────────────────────────────────── */

  const handleAutoChange = (freq: BackupMeta['autoBackup']) => {
    setAutoBackup(freq);
    refreshMeta();
    setShowAutoDropdown(false);
    if (freq !== 'off') {
      toast.success(`Auto-backup set to ${freq}`);
    }
  };

  /* ── Not configured ────────────────────────────────────────── */

  if (!configured) {
    return (
      <div>
        <SectionHeader />
        <div className="border border-amber-200/60 rounded-xl bg-amber-50/50 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="shrink-0 text-amber-500 mt-0.5" size={16} />
            <div>
              <p className="text-xs font-semibold text-amber-800 mb-1">Google Drive not configured</p>
              <p className="text-[11px] text-amber-600 leading-relaxed">
                To enable cloud backups, add <code className="px-1 py-0.5 bg-amber-100 rounded text-[10px] font-mono">VITE_GOOGLE_CLIENT_ID</code> to your
                Supabase Edge Function secrets (Dashboard → Edge Functions → Secrets).
                You'll need a Google Cloud project with Drive API enabled.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main UI ───────────────────────────────────────────────── */

  return (
    <div>
      <SectionHeader />

      <div className="border border-slate-200/80 rounded-xl bg-white shadow-sm">

        {/* ── Google Account Row ──────────────────────────────── */}
        <div className="p-4 border-b border-slate-100">
          {connected ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-sm">
                  <span className="text-white text-sm font-bold">
                    {(meta.googleEmail || 'G')[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Cloud size={12} className="text-blue-500" />
                    Google Drive Connected
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{meta.googleEmail || 'Connected'}</p>
                </div>
              </div>
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-1.5 text-[11px] text-red-500 hover:text-red-600 font-medium px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut size={12} /> Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-white border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 rounded-xl transition-all group"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin text-blue-500" />
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="18" height="18" className="group-hover:scale-110 transition-transform">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-sm font-semibold text-slate-600 group-hover:text-blue-600 transition-colors">
                    Connect Google Drive
                  </span>
                </>
              )}
            </button>
          )}
        </div>

        {/* ── Backup Actions ─────────────────────────────────── */}
        {connected && (
          <>
            {/* Last backup info */}
            {meta.lastBackupAt && (
              <div className="px-4 py-3 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-emerald-500" />
                    <span className="text-[11px] text-slate-600">
                      Last backup: <strong className="text-slate-700">{formatTimeAgo(meta.lastBackupAt)}</strong>
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <HardDrive size={10} />
                    {formatBytes(meta.lastBackupSize)}
                  </span>
                </div>
              </div>
            )}

            {/* Progress bar */}
            {loading && progress && (
              <div className="px-4 py-3 border-b border-slate-100 bg-blue-50/30">
                <div className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-blue-500" />
                  <span className="text-xs text-blue-600 font-medium">{progress}</span>
                </div>
                <div className="mt-2 w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="p-4 border-b border-slate-100">
              <div className="grid grid-cols-2 gap-3">
                {/* Backup button */}
                <button
                  onClick={handleBackup}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-200 hover:shadow-md hover:shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Upload size={14} />
                  )}
                  Backup Now
                </button>

                {/* Restore button */}
                <button
                  onClick={() => confirmRestore()}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 hover:border-emerald-300 text-slate-600 hover:text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={14} />
                  Restore
                </button>
              </div>
            </div>

            {/* Auto-backup selector */}
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <RefreshCw size={14} className={meta.autoBackup !== 'off' ? 'text-blue-500' : 'text-slate-400'} />
                  <div>
                    <span className="text-xs font-semibold text-slate-700 block">Auto-Backup</span>
                    <span className="text-[10px] text-slate-400">Automatically back up on schedule</span>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowAutoDropdown(!showAutoDropdown)}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <span className={meta.autoBackup !== 'off' ? 'text-blue-600' : 'text-slate-600'}>
                      {AUTO_OPTIONS.find(o => o.value === meta.autoBackup)?.label || 'Off'}
                    </span>
                    <ChevronDown size={12} className="text-slate-400" />
                  </button>

                  {showAutoDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowAutoDropdown(false)} />
                      <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                        {AUTO_OPTIONS.map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => handleAutoChange(opt.value)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 text-xs text-left transition-colors ${
                              meta.autoBackup === opt.value
                                ? 'bg-blue-50 text-blue-700 font-semibold'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <div>
                              <span className="block font-medium">{opt.label}</span>
                              <span className="text-[10px] text-slate-400">{opt.desc}</span>
                            </div>
                            {meta.autoBackup === opt.value && <Check size={13} className="text-blue-500" />}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Browser close alert toggle */}
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {closeAlertOn ? (
                    <Bell size={14} className="text-amber-500" />
                  ) : (
                    <BellOff size={14} className="text-slate-400" />
                  )}
                  <div>
                    <span className="text-xs font-semibold text-slate-700 block">Close Reminder</span>
                    <span className="text-[10px] text-slate-400">Alert to backup when closing browser</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const next = !closeAlertOn;
                    setCloseAlert(next);
                    setCloseAlertOn(next);
                    toast.success(next ? 'Close reminder enabled' : 'Close reminder disabled');
                  }}
                  className={`relative w-10 h-5.5 rounded-full transition-colors ${
                    closeAlertOn ? 'bg-amber-500' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform ${
                      closeAlertOn ? 'translate-x-[18px]' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Backup history */}
            <div className="p-4">
              <button
                onClick={async () => {
                  if (!showHistory) {
                    try {
                      const list = await listBackups();
                      setBackupList(list);
                    } catch { /* ignore */ }
                  }
                  setShowHistory(!showHistory);
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
              >
                <Clock size={12} />
                {showHistory ? 'Hide' : 'Show'} Backup History
                <ChevronDown size={12} className={`transition-transform ${showHistory ? 'rotate-180' : ''}`} />
              </button>

              {showHistory && (
                <div className="mt-3 space-y-2">
                  {backupList.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic">No backups found yet.</p>
                  ) : (
                    backupList.map(b => (
                      <div
                        key={b.id}
                        className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2.5"
                      >
                        <div>
                          <p className="text-[11px] font-medium text-slate-700">
                            {new Date(b.createdTime).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric',
                              hour: '2-digit', minute: '2-digit',
                            })}
                          </p>
                          <p className="text-[10px] text-slate-400">{formatBytes(b.size)}</p>
                        </div>
                        <button
                          onClick={() => confirmRestore(b.id)}
                          disabled={loading}
                          className="text-[10px] font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md transition-colors"
                        >
                          Restore this
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Privacy info */}
      <div className="mt-3 bg-blue-50/60 border border-blue-100 rounded-xl p-3.5 flex gap-3 text-xs text-blue-700">
        <Shield className="shrink-0 mt-0.5 text-blue-400" size={15} />
        <div className="leading-relaxed">
          <strong>Privacy:</strong> Backups are stored in a private
          <code className="px-1 py-0.5 bg-blue-100/80 rounded text-[10px] font-mono mx-0.5">appDataFolder</code>
          on your Google Drive. Only ReportIQ can access them — they're invisible in your Drive.
        </div>
      </div>

      {/* Restore Confirmation Dialog */}
      {showRestoreConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-[400px] max-w-[90vw] overflow-hidden">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Restore from Backup?</h3>
                  <p className="text-[11px] text-slate-500">This action cannot be undone</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3 mb-4">
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  <AlertTriangle size={11} className="inline -mt-0.5 mr-1" />
                  This will <strong>overwrite ALL your current data</strong> (trackers, invoices, settings, history)
                  with the backup data from Google Drive. Your current local data will be replaced.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowRestoreConfirm(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
                >
                  <X size={13} /> Cancel
                </button>
                <button
                  onClick={handleRestore}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Download size={13} /> Yes, Restore
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Section Header ─────────────────────────────────────────── */

const SectionHeader: React.FC = () => (
  <>
    <div className="flex items-center gap-2.5 mb-1">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
        <Cloud size={16} className="text-blue-600" />
      </div>
      <h2 className="text-lg font-bold text-slate-900">Cloud Backup</h2>
    </div>
    <p className="text-slate-400 text-xs ml-[42px] mb-4">
      Back up your data to Google Drive — just like WhatsApp.
    </p>
  </>
);

export default CloudBackupSection;
