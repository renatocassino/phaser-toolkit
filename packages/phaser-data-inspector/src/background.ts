// Background service worker for Phaser Data Inspector

chrome.runtime.onInstalled.addListener(() => {
  console.log('Phaser Data Inspector installed');
});

chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked on tab:', tab.url);
});
