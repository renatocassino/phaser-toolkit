// Content script for Phaser Data Inspector

console.log('Phaser Data Inspector content script loaded');

// Wait for page to load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  console.log('Phaser Data Inspector initialized on page:', window.location.href);
  
  // Check if Phaser is available
  const checkPhaser = setInterval(() => {
    if ((window as any).Phaser) {
      clearInterval(checkPhaser);
      console.log('Phaser detected!', (window as any).Phaser.VERSION);
    }
  }, 1000);
  
  // Clean up after 10 seconds
  setTimeout(() => {
    clearInterval(checkPhaser);
  }, 10000);
}
