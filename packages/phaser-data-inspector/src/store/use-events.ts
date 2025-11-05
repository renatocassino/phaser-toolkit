import { create } from 'zustand';
import type { PhaserDataInspectorMessage } from './types';

export const useEvents = create<{
    events: PhaserDataInspectorMessage[];
    addEvent: (event: PhaserDataInspectorMessage) => void;
    clearEvents: () => void;
}>((set) => ({
    events: [],
    addEvent: (event): void => {
        set((state) => ({ events: [event, ...state.events] }));
    },
    clearEvents: (): void => {
        set({ events: [] });
    },
}));
