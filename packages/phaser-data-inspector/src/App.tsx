import { useEffect, useState } from 'react';

interface KeyPress {
  timestamp: string;
  datetime: string;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [keyPresses, setKeyPresses] = useState<KeyPress[]>([]);
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
    newPort.onMessage.addListener((payload: any) => {
      console.log('Received message:', payload);

      if (payload.type === 'KEY_PRESSED') {
        const now = new Date();
        setKeyPresses((prev) => [
          ...prev,
          {
            timestamp: payload.timestamp,
            datetime: now.toLocaleString()
          }
        ]);
      } else {
        console.log('Received unknown message:', payload);
        const now = new Date();

        setKeyPresses((prev) => {
          return [
            ...prev,
            {
              timestamp: now.toISOString(),
              datetime: JSON.stringify(payload)
            }
          ]
        })
      }
    });

    newPort.onDisconnect.addListener(() => {
      console.log('Disconnected from background');
    });

    // Cleanup on unmount
    return () => {
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
              Key presses: {keyPresses.length}
            </p>
          </div>

          <table role="grid">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Datetime</th>
              </tr>
            </thead>
            <tbody>
              {keyPresses.map((press) => (
                <tr key={press.timestamp}>
                  <td>{press.timestamp}</td>
                  <td>{press.datetime}</td>
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
