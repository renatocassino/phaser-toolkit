import Alpine from 'alpinejs';

Alpine.data('inspector', () => ({
  loading: true,
  message: '',
  
  init() {
    // Detect if we're in DevTools panel
    const isDevTools = window.location.href.includes('devtools-panel');
    if (isDevTools) {
      document.body.classList.add('devtools-panel');
    }
    
    console.log('Phaser Data Inspector initialized', isDevTools ? '(DevTools)' : '(Popup)');
    this.message = isDevTools ? 'DevTools panel ready!' : 'Inspector ready!';
    this.loading = false;
  }
}));

Alpine.start();
