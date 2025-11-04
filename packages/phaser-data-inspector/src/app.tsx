import { useEffect, useState } from 'react';
import type { PhaserDataInspectorMessage } from './store/types';
import { EVENT_NAME } from './constants';

function App() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<PhaserDataInspectorMessage[]>([]);
  const [isDevTools, setIsDevTools] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [port, setPort] = useState<any>(null);

  useEffect(() => {
    // Detect if we're in DevTools panel
    const devTools = window.location.href.includes('devtools-panel');
    setIsDevTools(devTools);
    
    if (devTools) {
      document.body.classList.add('devtools-panel');
    }

    console.log('Phaser Data Inspector initialized', devTools ? '(DevTools)' : '(Popup)');
    setMessage(devTools ? 'DevTools panel ready!' : 'Inspector ready!');
    setLoading(false);

    // Connect to background service worker
    const newPort = chrome.runtime.connect({ name: 'phaser-devtools' });
    setPort(newPort);

    // Listen for messages from background
    newPort.onMessage.addListener((payload: PhaserDataInspectorMessage) => {
      console.log('Received message:', payload);

      if (payload.source === EVENT_NAME) {
        setMessages((prev) => [
          ...prev,
          payload
        ]);
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
    <main className="container">
      <h1>🎮 Phaser Data Inspector</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-auto">
          <p>{message}</p>
          
          <div style={{ marginTop: '16px' }}>
            <p><strong>Press 'P' key on any page to test!</strong></p>
            <p style={{ fontSize: '0.875rem', color: 'var(--pico-muted-color)' }}>
              Messages: {messages.length}
            </p>
          </div>

          <table role="grid">
            <thead>
              <tr>
                <th>Datetime</th>
                <th>Game ID</th>
                <th>Scene Key</th>
                <th>Registry</th>
                <th>Scope</th>
                <th>Key</th>
                <th>Old Value</th>
                <th>New Value</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message.datetime}>
                  <td>{message.datetime}</td>
                  <td>{message.gameId}</td>
                  <td>{message.sceneKey}</td>
                  <td>{message.registry}</td>
                  <td>{message.scope}</td>
                  <td>{message.key}</td>
                  <td>{message.oldValue ? JSON.stringify(message.oldValue) : ''}</td>
                  <td>{message.newValue ? JSON.stringify(message.newValue) : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default App;
