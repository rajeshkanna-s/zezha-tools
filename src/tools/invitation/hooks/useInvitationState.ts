import { useReducer, useCallback, useEffect, useRef } from 'react';
import type { InvitationData, EventType } from '../types';
import { getDefaultInvitationData } from '../data/sampleData';

// ─── Actions ───
type Action =
    | { type: 'SET_FIELD'; field: string; value: any }
    | { type: 'SET_DATA'; data: InvitationData }
    | { type: 'CHANGE_EVENT_TYPE'; eventType: EventType }
    | { type: 'UNDO' }
    | { type: 'REDO' };

interface State {
    past: InvitationData[];
    present: InvitationData;
    future: InvitationData[];
}

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_FIELD': {
            const next = { ...state.present, [action.field]: action.value };
            return {
                past: [...state.past, state.present],
                present: next,
                future: [],
            };
        }
        case 'SET_DATA':
            return {
                past: [...state.past, state.present],
                present: action.data,
                future: [],
            };
        case 'CHANGE_EVENT_TYPE': {
            const next = getDefaultInvitationData(action.eventType);
            // Keep styling choices
            next.template = state.present.template;
            next.colorScheme = state.present.colorScheme;
            next.fontPair = state.present.fontPair;
            next.format = state.present.format;
            next.language = state.present.language;
            next.decorations = state.present.decorations;
            return {
                past: [...state.past, state.present],
                present: next,
                future: [],
            };
        }
        case 'UNDO': {
            if (state.past.length === 0) return state;
            const prev = state.past[state.past.length - 1];
            return {
                past: state.past.slice(0, -1),
                present: prev,
                future: [state.present, ...state.future],
            };
        }
        case 'REDO': {
            if (state.future.length === 0) return state;
            const next = state.future[0];
            return {
                past: [...state.past, state.present],
                present: next,
                future: state.future.slice(1),
            };
        }
        default:
            return state;
    }
}

const DRAFT_KEY = 'invitation-creator-draft';

export function useInvitationState() {
    const initialData = getDefaultInvitationData("wedding");

    const [state, dispatch] = useReducer(reducer, {
        past: [],
        present: initialData,
        future: [],
    });

    const stateRef = useRef(state);
    stateRef.current = state;

    // Keyboard shortcuts for undo/redo
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                dispatch({ type: 'UNDO' });
            }
            if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                dispatch({ type: 'REDO' });
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const setField = useCallback((field: string, value: any) => {
        dispatch({ type: 'SET_FIELD', field, value });
    }, []);

    const setData = useCallback((data: InvitationData) => {
        dispatch({ type: 'SET_DATA', data });
    }, []);

    const changeEventType = useCallback((eventType: EventType) => {
        dispatch({ type: 'CHANGE_EVENT_TYPE', eventType });
    }, []);

    const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
    const redo = useCallback(() => dispatch({ type: 'REDO' }), []);

    const saveDraft = useCallback(() => {
        try {
            localStorage.setItem(DRAFT_KEY, JSON.stringify(stateRef.current.present));
        } catch { /* ignore */ }
    }, []);

    const loadDraft = useCallback((): InvitationData | null => {
        try {
            const raw = localStorage.getItem(DRAFT_KEY);
            if (raw) return JSON.parse(raw) as InvitationData;
        } catch { /* ignore */ }
        return null;
    }, []);

    const clearDraft = useCallback(() => {
        localStorage.removeItem(DRAFT_KEY);
    }, []);

    return {
        data: state.present,
        canUndo: state.past.length > 0,
        canRedo: state.future.length > 0,
        setField,
        setData,
        changeEventType,
        undo,
        redo,
        saveDraft,
        loadDraft,
        clearDraft,
    };
}
