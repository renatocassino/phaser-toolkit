import { useMemo, useState, useEffect } from 'react';
import { useFilters } from './use-filters';
import { useEvents } from './use-events';
import type { PhaserDataInspectorMessage } from './types';

type FilteredEvents = {
    events: PhaserDataInspectorMessage[];
    paginatedEvents: PhaserDataInspectorMessage[];
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    setCurrentPage: (page: number) => void;
    setItemsPerPage: (items: number) => void;
    goToNextPage: () => void;
    goToPreviousPage: () => void;
}

export const useFilteredEvents = (): FilteredEvents => {
    const { filters } = useFilters();
    const { events } = useEvents();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);

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

    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(filteredEvents.length / itemsPerPage));
    }, [filteredEvents.length, itemsPerPage]);

    const paginatedEvents = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredEvents.slice(startIndex, endIndex);
    }, [filteredEvents, currentPage, itemsPerPage]);

    // Reset to page 1 when filters change or itemsPerPage changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filters.search, filters.onlyPhaserHooks, itemsPerPage]);

    const goToNextPage = (): void => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const goToPreviousPage = (): void => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    return {
        events: filteredEvents,
        paginatedEvents,
        currentPage,
        totalPages,
        itemsPerPage,
        totalItems: filteredEvents.length,
        setCurrentPage,
        setItemsPerPage,
        goToNextPage,
        goToPreviousPage,
    };
};
