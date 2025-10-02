// Background service worker for Insightify Chalamandra
console.log('🦎 Insightify Chalamandra background worker started');

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Insightify Chalamandra installed successfully');
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractContent') {
    console.log('Content extraction requested');
    // Future: Process content with local AI models
  }
  
  if (request.action === 'getSummary') {
    console.log('Summary generation requested');
    // Future: Generate AI summary locally
  }
});
