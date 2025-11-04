// Inspector logic - vanilla JavaScript (no Alpine.js due to CSP restrictions)

interface KeyPress {
  timestamp: string;
  datetime: string;
}

class Inspector {
  private loading = true;
  private message = '';
  private keyPresses: KeyPress[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private port: any = null;
  private isDevTools: boolean;

  constructor() {
    // Detect if we're in DevTools panel
    this.isDevTools = window.location.href.includes('devtools-panel');
    if (this.isDevTools) {
      document.body.classList.add('devtools-panel');
    }

    console.log('Phaser Data Inspector initialized', this.isDevTools ? '(DevTools)' : '(Popup)');
    this.message = this.isDevTools ? 'DevTools panel ready!' : 'Inspector ready!';
    this.loading = false;

    this.init();
  }

  private init(): void {
    // Connect to background service worker
    this.port = chrome.runtime.connect({ name: 'phaser-devtools' });

    // Listen for messages from background
    this.port.onMessage.addListener((payload) => {
      console.log('Received message:', payload);

      if (payload.type === 'KEY_PRESSED') {
        const now = new Date();
        this.keyPresses.push({
          timestamp: payload.timestamp,
          datetime: now.toLocaleString()
        });
        this.updateUI();
      }
    });

    this.port.onDisconnect.addListener(() => {
      console.log('Disconnected from background');
    });

    // Initial UI update
    this.updateUI();
  }

  private updateUI(): void {
    const loadingEl = document.getElementById('loading');
    const contentEl = document.getElementById('content');
    const messageEl = document.getElementById('message');
    const countEl = document.getElementById('count');
    const listEl = document.getElementById('key-press-list');

    if (loadingEl) {
      loadingEl.style.display = this.loading ? 'block' : 'none';
    }

    if (contentEl) {
      contentEl.style.display = this.loading ? 'none' : 'block';
    }

    if (messageEl) {
      messageEl.textContent = this.message;
    }

    if (countEl) {
      countEl.textContent = this.keyPresses.length.toString();
    }

    if (listEl) {
      listEl.innerHTML = this.keyPresses.map((press) => 
        `<div class="key-press-item"><span>${press.datetime}</span></div>`
      ).join('');
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new Inspector());
} else {
  new Inspector();
}