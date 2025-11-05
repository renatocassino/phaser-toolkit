import { useEffect, useState, type ReactElement } from 'react';
import styled from 'styled-components';
import type { PhaserDataInspectorMessage } from './store/types';
import { EVENT_NAME } from './constants';
import { useEvents } from './store/use-events';
import { useFilters } from './store/use-filters';
import { useFilteredEvents } from './store/use-filtered-events';
import { PreviewStateEvent } from './components/preview-state-event';
import { EventsTable } from './components/events-table';
import { PaginationControls } from './components/pagination-controls';

const MainContainer = styled.main`
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 1rem;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 5px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
`;

const Tab = styled.button<{ $active?: boolean }>`
  padding: 8px 16px;
  border: none;
  background: ${(props): string => props.$active ? '#e0e0e0' : 'transparent'};
  border-bottom: ${(props): string => props.$active ? '2px solid #007bff' : '2px solid transparent'};
  cursor: pointer;
  font-weight: ${(props): string => props.$active ? 'bold' : 'normal'};
  color: ${(props): string => props.$active ? '#000' : '#666'};
  font-size: 14px;
  border-radius: 4px 4px 0 0;
  
  &:hover {
    background: ${(props): string => props.$active ? '#e0e0e0' : '#e8e8e8'};
    color: ${(props): string => props.$active ? '#000' : '#333'};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  color: #666;
  
  &:hover {
    background: #f0f0f0;
    color: #333;
  }
  
  i {
    font-size: 14px;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  height: 100%;
  overflow: hidden;
  width: 100%;
`;

const FieldsetContainer = styled.fieldset`
  margin: 0;
  padding: 1rem;
  border: none;
`;

function App(): ReactElement {
  const [loading, setLoading] = useState(true);
  const { filters, toggleOnlyPhaserHooks, setSearch } = useFilters();
  const {
    paginatedEvents,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    setCurrentPage,
    setItemsPerPage,
  } = useFilteredEvents();
  const { addEvent, clearEvents, selectedGameId, setSelectedGameId, getGameIds } = useEvents();
  const gameIds = getGameIds();
  const [selectedEvent, setSelectedEvent] = useState<PhaserDataInspectorMessage | null>(null);
  const closePreview = (): void => setSelectedEvent(null);

  useEffect(() => {
    // Detect if we're in DevTools panel
    const devTools = window.location.href.includes('devtools-panel');

    if (devTools) {
      document.body.classList.add('devtools-panel');
    }

    console.log('Phaser Data Inspector initialized', devTools ? '(DevTools)' : '(Popup)');
    setLoading(false);

    // Connect to background service worker
    const newPort = chrome.runtime.connect({ name: 'phaser-devtools' });

    // Listen for messages from background
    newPort.onMessage.addListener((payload: PhaserDataInspectorMessage) => {
      console.log('Received message:', payload);

      if (payload.source === EVENT_NAME) {
        addEvent(payload);
      }
    });

    newPort.onDisconnect.addListener(() => {
      console.log('Disconnected from background');
    });

    // Cleanup on unmount
    return (): void => {
      if (newPort) {
        newPort.disconnect();
      }
    };
  }, []);

  return (
    <MainContainer>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>          
          <div className="container-fluid">
            {gameIds.length > 1 && (
              <TabsContainer>
                {gameIds.map((gameId) => {
                  const isActive = selectedGameId === gameId;
                  return (
                    <Tab
                      key={gameId}
                      $active={isActive}
                      disabled={isActive}
                      onClick={(): void => {
                        if (!isActive) {
                          setSelectedGameId(gameId);
                          setSelectedEvent(null);
                        }
                      }}
                    >
                      {gameId}
                    </Tab>
                  );
                })}
              </TabsContainer>
            )}
            <FiltersContainer>
              <input type="text" placeholder="Search" value={filters.search} onChange={(e) => setSearch(e.target.value)} />
              <ClearButton 
                onClick={(): void => {
                  clearEvents();
                  setCurrentPage(1);
                  setSelectedEvent(null);
                }}
                title="Clear events"
              >
                <i className="fas fa-trash"></i>
              </ClearButton>
            </FiltersContainer>
          </div>

          <ContentContainer>
            <EventsTable 
              events={paginatedEvents} 
              onSelectEvent={setSelectedEvent}
              hasPreview={!!selectedEvent}
            />

            {selectedEvent && (
              <PreviewStateEvent event={selectedEvent} onClose={closePreview} />
            )}
          </ContentContainer>

          <FieldsetContainer className="container-fluid">
            <label>
              <input
                type="checkbox"
                name="only-phaser-hooks"
                role="switch"
                checked={filters.onlyPhaserHooks}
                onChange={() => toggleOnlyPhaserHooks()}
              />
              Show only <a href="https://www.npmjs.com/package/phaser-hooks/" target="_blank" rel="noopener noreferrer">Phaser Hooks</a>
            </label>
          </FieldsetContainer>

          <div className="container-fluid">
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        </>
      )}
    </MainContainer>
  );
}

export default App;