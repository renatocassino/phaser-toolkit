import { useEffect, useState } from 'react';
import type { PhaserDataInspectorMessage } from './store/types';
import { EVENT_NAME } from './constants';
import { useEvents } from './store/use-events';
import { useFilters } from './store/use-filters';
import { useFilteredEvents } from './store/use-filtered-events';

function App() {
  const [loading, setLoading] = useState(true);
  const [isDevTools, setIsDevTools] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [port, setPort] = useState<any>(null);
  const { filters, toggleOnlyPhaserHooks, setSearch } = useFilters();
  const { events } = useFilteredEvents();
  const { addEvent, clearEvents } = useEvents();

  useEffect(() => {
    // Detect if we're in DevTools panel
    const devTools = window.location.href.includes('devtools-panel');
    setIsDevTools(devTools);

    if (devTools) {
      document.body.classList.add('devtools-panel');
    }

    console.log('Phaser Data Inspector initialized', devTools ? '(DevTools)' : '(Popup)');
    setLoading(false);

    // Connect to background service worker
    const newPort = chrome.runtime.connect({ name: 'phaser-devtools' });
    setPort(newPort);

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
    <main style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-auto">          
          <div className="container-fluid">
            <p>
              Events: {events.length}
            </p>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input type="text" placeholder="Search" value={filters.search} onChange={(e) => setSearch(e.target.value)} />
              <button onClick={() => clearEvents()}>Clear</button>
            </div>
          </div>

          <div className="overflow-auto">
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
                  <tr style={{cursor: 'pointer'}} onClick={() => {}} key={`${message.datetime}-${message.sceneKey}-${message.registry}-${message.scope}-${message.key}`}>
                    <td>{message.datetime.split('T')[1]}</td>
                    <td>{message.sceneKey}</td>
                    <td>{message.registry}</td>
                    <td>{message.scope}</td>
                    <td>{message.key.replace(/^phaser-hooks:(global|local):/, '')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <fieldset className="container-fluid">
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
      </fieldset>
    </main>
  );
}

export default App;
