/* ═══════════════════════════════════════════════════════════════
   useAppPreferences — theme, format, display preferences
   All settings are APPLIED to the DOM as side-effects.
   ═══════════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'riq-app-preferences';

export type ThemeMode = 'light' | 'dark' | 'system';
export type FontSize = 'compact' | 'default' | 'comfortable';
export type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
export type NumberFormat = 'indian' | 'international';

export interface AppPreferences {
  theme: ThemeMode;
  fontSize: FontSize;
  dateFormat: DateFormat;
  numberFormat: NumberFormat;
  currencySymbol: string;
  defaultDomainOnLogin: string; // domain id or '' for home
  sidebarDensity: 'compact' | 'default';
  soundEffects: boolean;
  animationsEnabled: boolean;
}

const DEFAULT_PREFS: AppPreferences = {
  theme: 'light',
  fontSize: 'default',
  dateFormat: 'DD/MM/YYYY',
  numberFormat: 'indian',
  currencySymbol: '₹',
  defaultDomainOnLogin: '',
  sidebarDensity: 'default',
  soundEffects: true,
  animationsEnabled: true,
};

const notifyChange = () => window.dispatchEvent(new Event('riq-prefs-changed'));

/* ── Apply preferences to the DOM ─────────────────────────────── */
function applyToDOM(prefs: AppPreferences) {
  const root = document.documentElement;

  // 1. Theme: set data-theme attribute
  if (prefs.theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    root.setAttribute('data-theme', prefs.theme);
  }

  // 2. Font size: set data-font-size attribute
  root.setAttribute('data-font-size', prefs.fontSize);

  // 3. Animations: toggle class
  if (prefs.animationsEnabled) {
    root.classList.remove('riq-no-animations');
  } else {
    root.classList.add('riq-no-animations');
  }

  // 4. Sidebar density
  root.setAttribute('data-sidebar-density', prefs.sidebarDensity);
}

export function useAppPreferences() {
  const [prefs, setPrefs] = useState<AppPreferences>(DEFAULT_PREFS);
  const [isLoaded, setIsLoaded] = useState(false);

  const load = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const merged = { ...DEFAULT_PREFS, ...parsed };
        setPrefs(merged);
        applyToDOM(merged);
      } else {
        applyToDOM(DEFAULT_PREFS);
      }
    } catch {
      setPrefs(DEFAULT_PREFS);
      applyToDOM(DEFAULT_PREFS);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener('riq-prefs-changed', handler);
    window.addEventListener('storage', handler);

    // Listen for system theme changes when using 'system' mode
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const mqHandler = () => {
      const raw = localStorage.getItem(STORAGE_KEY);
      const current = raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
      if (current.theme === 'system') {
        document.documentElement.setAttribute('data-theme', mq.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', mqHandler);

    return () => {
      window.removeEventListener('riq-prefs-changed', handler);
      window.removeEventListener('storage', handler);
      mq.removeEventListener('change', mqHandler);
    };
  }, [load]);

  // Re-apply to DOM whenever prefs change
  useEffect(() => {
    if (isLoaded) applyToDOM(prefs);
  }, [prefs, isLoaded]);

  const updatePref = useCallback(<K extends keyof AppPreferences>(key: K, value: AppPreferences[K]) => {
    setPrefs(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      applyToDOM(next);
      notifyChange();
      return next;
    });
  }, []);

  const resetPrefs = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setPrefs(DEFAULT_PREFS);
    applyToDOM(DEFAULT_PREFS);
    notifyChange();
  }, []);

  return { prefs, updatePref, resetPrefs, isLoaded };
}
