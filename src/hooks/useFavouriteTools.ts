/* ═══════════════════════════════════════════════════════════════
   useFavouriteTools — manage pinned/favourite tool IDs
   ═══════════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'riq-favourite-tools';

/** Publish custom event so all hook instances stay in sync */
const notifyChange = () => window.dispatchEvent(new Event('riq-favourites-changed'));

export function useFavouriteTools() {
  const [favouriteIds, setFavouriteIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  const load = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setFavouriteIds(raw ? JSON.parse(raw) : []);
    } catch {
      setFavouriteIds([]);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener('riq-favourites-changed', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('riq-favourites-changed', handler);
      window.removeEventListener('storage', handler);
    };
  }, [load]);

  const toggleFavourite = useCallback((toolId: string) => {
    setFavouriteIds(prev => {
      const next = prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      notifyChange();
      return next;
    });
  }, []);

  const isFavourite = useCallback((toolId: string) => {
    return favouriteIds.includes(toolId);
  }, [favouriteIds]);

  const resetFavourites = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setFavouriteIds([]);
    notifyChange();
  }, []);

  return { favouriteIds, toggleFavourite, isFavourite, resetFavourites, isLoaded };
}
