import { useState, useCallback, useEffect } from 'react';
import type { AnyLayer, LogoDesign, CanvasBackground, CanvasSize } from '../types';
import { DEFAULT_CANVAS_SIZE } from '../data/sizes';
import { TEMPLATES } from '../data/templates';

const DRAFT_KEY = 'logo-creator-draft';
const MAX_HISTORY = 30;

const defaultBackground: CanvasBackground = {
  type: 'solid',
  color: '#FFFFFF',
  gradientColor1: '#1A73E8',
  gradientColor2: '#48CAE4',
  gradientAngle: 135,
  gradientType: 'linear',
};

const defaultDesign: LogoDesign = {
  layers: TEMPLATES[0]?.design.layers ?? [],
  background: TEMPLATES[0]?.design.background ?? defaultBackground,
  canvasSize: DEFAULT_CANVAS_SIZE,
};

export function useLogoState() {
  const [past, setPast] = useState<LogoDesign[]>([]);
  const [present, setPresent] = useState<LogoDesign>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) return JSON.parse(saved) as LogoDesign;
    } catch { /* ignore */ }
    return defaultDesign;
  });
  const [future, setFuture] = useState<LogoDesign[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Autosave
  useEffect(() => {
    const t = setTimeout(() => {
      try { localStorage.setItem(DRAFT_KEY, JSON.stringify(present)); } catch { /* ignore */ }
    }, 2000);
    return () => clearTimeout(t);
  }, [present]);

  const commit = useCallback((next: LogoDesign) => {
    setPast(p => [...p.slice(-MAX_HISTORY), present]);
    setPresent(next);
    setFuture([]);
  }, [present]);

  const undo = useCallback(() => {
    if (!past.length) return;
    const prev = past[past.length - 1];
    setPast(p => p.slice(0, -1));
    setFuture(f => [present, ...f]);
    setPresent(prev);
    setSelectedId(null);
  }, [past, present]);

  const redo = useCallback(() => {
    if (!future.length) return;
    const next = future[0];
    setFuture(f => f.slice(1));
    setPast(p => [...p, present]);
    setPresent(next);
    setSelectedId(null);
  }, [future, present]);

  // Layer operations
  const addLayer = useCallback((layer: AnyLayer) => {
    commit({ ...present, layers: [...present.layers, layer] });
  }, [present, commit]);

  const updateLayer = useCallback((id: string, updates: Partial<AnyLayer>) => {
    commit({
      ...present,
      layers: present.layers.map(l => l.id === id ? { ...l, ...updates } as AnyLayer : l),
    });
  }, [present, commit]);

  const deleteLayer = useCallback((id: string) => {
    commit({ ...present, layers: present.layers.filter(l => l.id !== id) });
    setSelectedId(s => s === id ? null : s);
  }, [present, commit]);

  const duplicateLayer = useCallback((id: string) => {
    const layer = present.layers.find(l => l.id === id);
    if (!layer) return;
    const copy: AnyLayer = { ...layer, id: `${Date.now()}`, x: layer.x + 10, y: layer.y + 10, name: layer.name + ' Copy' };
    const idx = present.layers.findIndex(l => l.id === id);
    const next = [...present.layers];
    next.splice(idx + 1, 0, copy);
    commit({ ...present, layers: next });
    setSelectedId(copy.id);
  }, [present, commit]);

  const moveLayerUp = useCallback((id: string) => {
    const idx = present.layers.findIndex(l => l.id === id);
    if (idx >= present.layers.length - 1) return;
    const next = [...present.layers];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    commit({ ...present, layers: next });
  }, [present, commit]);

  const moveLayerDown = useCallback((id: string) => {
    const idx = present.layers.findIndex(l => l.id === id);
    if (idx <= 0) return;
    const next = [...present.layers];
    [next[idx], next[idx - 1]] = [next[idx - 1], next[idx]];
    commit({ ...present, layers: next });
  }, [present, commit]);

  const setBackground = useCallback((bg: CanvasBackground) => {
    commit({ ...present, background: bg });
  }, [present, commit]);

  const setCanvasSize = useCallback((size: CanvasSize) => {
    commit({ ...present, canvasSize: size });
  }, [present, commit]);

  const loadTemplate = useCallback((design: LogoDesign) => {
    commit({ ...design, canvasSize: present.canvasSize });
    setSelectedId(null);
  }, [present, commit]);

  const clearCanvas = useCallback(() => {
    commit({ ...present, layers: [] });
    setSelectedId(null);
  }, [present, commit]);

  const selectedLayer = present.layers.find(l => l.id === selectedId) ?? null;

  return {
    design: present,
    selectedId,
    selectedLayer,
    setSelectedId,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    undo,
    redo,
    addLayer,
    updateLayer,
    deleteLayer,
    duplicateLayer,
    moveLayerUp,
    moveLayerDown,
    setBackground,
    setCanvasSize,
    loadTemplate,
    clearCanvas,
  };
}
