import { create } from 'zustand';

type Filters = {
    onlyPhaserHooks: boolean;
    search: string;
}

export const useFilters = create<{
    filters: Filters;
    setFilter: (filter: keyof Filters, value: boolean) => void;
    toggleOnlyPhaserHooks: () => void;
    setSearch: (search: string) => void;
}>((set) => ({
    filters: {
        onlyPhaserHooks: false,
        search: '',
    },
    setSearch: (search): void => set((state) => ({ filters: { ...state.filters, search } })),
    setFilter: (filter, value): void => set((state) => ({ filters: { ...state.filters, [filter]: value } })),
    toggleOnlyPhaserHooks: (): void => set((state) => ({ filters: { ...state.filters, onlyPhaserHooks: !state.filters.onlyPhaserHooks } })),
}));
