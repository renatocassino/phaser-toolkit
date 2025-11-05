import { useEffect, useState, type ReactElement } from 'react';
import styled from 'styled-components';
import type { PhaserDataInspectorMessage } from './store/types';
import { EVENT_NAME } from './constants';
import { useEvents } from './store/use-events';
import { useFilters } from './store/use-filters';
import { useFilteredEvents } from './store/use-filtered-events';
import { PreviewStateEvent } from './components/preview-state-event';

const MainContainer = styled.main`
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  height: 100%;
  overflow: hidden;
  width: 100%;
`;

const TableContainer = styled.div<{ $hasPreview?: boolean }>`
  flex: ${(props): string => props.$hasPreview ? '0 0 calc(50% - 5px)' : '1 1 100%'};
  overflow: auto;
  box-sizing: border-box;
`;

const TableRow = styled.tr`
  cursor: pointer;
`;

const FieldsetContainer = styled.fieldset`
  margin: 0;
  padding: 1rem;
  border: none;
`;

function App(): ReactElement {
  const [loading, setLoading] = useState(true);
  const { filters, toggleOnlyPhaserHooks, setSearch } = useFilters();
  const { events } = useFilteredEvents();
  const { addEvent, clearEvents } = useEvents();
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
            <p>
              Events: {events.length}
            </p>
            <FiltersContainer>
              <input type="text" placeholder="Search" value={filters.search} onChange={(e) => setSearch(e.target.value)} />
              <button onClick={() => clearEvents()}>Clear</button>
            </FiltersContainer>
          </div>

          <ContentContainer>
            <TableContainer className="overflow-auto" $hasPreview={!!selectedEvent}>
              <table role="grid" className="table-row striped">
                <thead>
                  <tr>
                    <th>Datetime</th>
                    <th>Scene Key</th>
                    <th>Registry</th>
                    <th>Scope</th>
                    <th>Key</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((message) => (
                    <TableRow onClick={() => setSelectedEvent(message)} key={`${message.datetime}-${message.sceneKey}-${message.registry}-${message.scope}-${message.key}`}>
                      <td>{message.datetime.split('T')[1]}</td>
                      <td>{message.sceneKey}</td>
                      <td>{message.registry}</td>
                      <td>{message.scope}</td>
                      <td>{message.key.replace(/^phaser-hooks:(global|local):/, '')}</td>
                    </TableRow>
                  ))}
                </tbody>
              </table>
            </TableContainer>

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
              Show only Phaser Hooks
            </label>
          </FieldsetContainer>
        </>
      )}
    </MainContainer>
  );
}

export default App;