// Popup JavaScript for Insightify Chalamandra

document.addEventListener('DOMContentLoaded', function() {
  const extractBtn = document.getElementById('extractBtn');
  const summarizeBtn = document.getElementById('summarizeBtn');
  const demoBtn = document.getElementById('demoBtn');
  const status = document.getElementById('status');

  // Extract page content
  extractBtn.addEventListener('click', async () => {
    status.textContent = 'Extracting content...';
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      chrome.tabs.sendMessage(tab.id, { action: 'extractContent' }, (response) => {
        if (response && response.success) {
          status.textContent = `Content extracted: ${response.content.length} characters`;
        } else {
          status.textContent = 'Error extracting content';
        }
      });
    } catch (error) {
      status.textContent = 'Error: ' + error.message;
    }
  });

  // Generate AI Summary
  summarizeBtn.addEventListener('click', async () => {
    status.textContent = 'AI summarization coming in Q2 2025...';
    
    // Future: TensorFlow.js integration for local AI
    setTimeout(() => {
      status.textContent = 'Local AI models will process content here';
    }, 2000);
  });

  // Open demo
  demoBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://brasdefer1597-cloud.github.io/insightify-chalamandra/' });
  });
});
