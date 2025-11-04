import { useMemo } from 'react';
import { useFilters } from './use-filters';
import { useEvents } from './use-events';
import type { PhaserDataInspectorMessage } from './types';

type FilteredEvents = {
    events: PhaserDataInspectorMessage[];
}

export const useFilteredEvents = (): FilteredEvents => {
    const { filters } = useFilters();
    const { events } = useEvents();

    const filteredEvents = useMemo(() => {
        return events.filter((event) => {
            if (filters.onlyPhaserHooks) {
                if (!event.key.includes(filters.search)) {
                    return false;
                }
                return event.key.startsWith('phaser-hooks:');
            }

            if (filters.search && filters.search.length > 0) {
                if (!event.key.includes(filters.search)) {
                    return false;
                }
            }
            return true;
        });
    }, [events, filters]);

    return { events: filteredEvents };
}
