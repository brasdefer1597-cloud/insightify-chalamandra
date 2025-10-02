// Content Script for Insightify Chalamandra
// Injects into web pages to extract and process content

console.log('🦎 Insightify Chalamandra content script loaded');

function extractVisibleText() {
  const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, article, section');
  let textContent = '';
  
  elements.forEach(element => {
    if (element.offsetParent !== null) { // Only visible elements
      textContent += element.textContent + '\n';
    }
  });
  
  return textContent.trim();
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractContent') {
    const content = extractVisibleText();
    sendResponse({ content: content, success: true });
  }
  
  if (request.action === 'analyzePage') {
    const pageInfo = {
      title: document.title,
      url: window.location.href,
      wordCount: extractVisibleText().split(/\s+/).length,
      timestamp: new Date().toISOString()
    };
    sendResponse({ pageInfo: pageInfo, success: true });
  }
});
