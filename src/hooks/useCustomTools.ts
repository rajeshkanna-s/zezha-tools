import { useState, useEffect, useCallback } from 'react';

const HIDDEN_TOOLS_KEY = 'reportiq_hidden_tools';

export function useCustomTools() {
    const [hiddenIds, setHiddenIds] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(HIDDEN_TOOLS_KEY);
            if (saved) {
                setHiddenIds(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Failed to parse hidden tools', e);
        }
        setIsLoaded(true);
    }, []);

    // Handle cross-tab/cross-component sync
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === HIDDEN_TOOLS_KEY && e.newValue) {
                try {
                    setHiddenIds(JSON.parse(e.newValue));
                } catch (err) { }
            }
        };
        const handleCustomEvent = () => {
            try {
                const saved = localStorage.getItem(HIDDEN_TOOLS_KEY);
                if (saved) {
                    setHiddenIds(JSON.parse(saved));
                } else {
                    setHiddenIds([]);
                }
            } catch (err) { }
        };
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('tools_visibility_changed', handleCustomEvent);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('tools_visibility_changed', handleCustomEvent);
        };
    }, []);

    const toggleItem = useCallback((id: string, isHidden: boolean) => {
        const currentSaved = localStorage.getItem(HIDDEN_TOOLS_KEY);
        const current: string[] = currentSaved ? JSON.parse(currentSaved) : [];
        let newIds = current;

        if (isHidden && !current.includes(id)) {
            newIds = [...current, id];
        } else if (!isHidden && current.includes(id)) {
            newIds = current.filter((item) => item !== id);
        }

        localStorage.setItem(HIDDEN_TOOLS_KEY, JSON.stringify(newIds));
        setHiddenIds(newIds);
        window.dispatchEvent(new Event('tools_visibility_changed'));
    }, []);

    const isHidden = useCallback((id: string) => hiddenIds.includes(id), [hiddenIds]);

    const resetVisibility = useCallback(() => {
        const newIds: string[] = [];
        localStorage.setItem(HIDDEN_TOOLS_KEY, JSON.stringify(newIds));
        setHiddenIds(newIds);
        window.dispatchEvent(new Event('tools_visibility_changed'));
    }, []);

    return {
        hiddenIds,
        toggleItem,
        isHidden,
        resetVisibility,
        isLoaded
    };
}
