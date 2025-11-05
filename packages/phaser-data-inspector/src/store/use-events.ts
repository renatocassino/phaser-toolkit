import { create } from 'zustand';
import type { PhaserDataInspectorMessage } from './types';

export const useEvents = create<{
    eventsByGameId: Record<string, PhaserDataInspectorMessage[]>;
    selectedGameId: string | null;
    addEvent: (event: PhaserDataInspectorMessage) => void;
    clearEvents: () => void;
    setSelectedGameId: (gameId: string | null) => void;
    getGameIds: () => string[];
}>((set, get) => ({
    eventsByGameId: {},
    selectedGameId: null,
    addEvent: (event): void => {
        set((state) => {
            const gameId = event.gameId;
            const gameEvents = state.eventsByGameId[gameId] || [];
            const newEventsByGameId = {
                ...state.eventsByGameId,
                [gameId]: [event, ...gameEvents],
            };
            
            // Se não há gameId selecionado, seleciona automaticamente o gameId do evento
            const newSelectedGameId = state.selectedGameId || gameId;
            
            return {
                eventsByGameId: newEventsByGameId,
                selectedGameId: newSelectedGameId,
            };
        });
    },
    clearEvents: (): void => {
        set({ eventsByGameId: {}, selectedGameId: null });
    },
    setSelectedGameId: (gameId: string | null): void => {
        set({ selectedGameId: gameId });
    },
    getGameIds: (): string[] => {
        return Object.keys(get().eventsByGameId);
    },
}));
