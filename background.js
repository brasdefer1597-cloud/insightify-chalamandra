// Background service worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('🦎 Insightify Chalamandra installed');
});

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      const existingSidebar = document.getElementById('insightify-sidebar');
      if (existingSidebar) {
        existingSidebar.remove();
      } else {
        // Inject sidebar
        const sidebar = document.createElement('div');
        sidebar.id = 'insightify-sidebar';
        sidebar.innerHTML = `
          <div class="sidebar-header">
            <h3>🦎 Insightify Chalamandra</h3>
            <button class="close-btn">×</button>
          </div>
          <div class="sidebar-content">
            <button id="analyze-btn">Analyze This Page</button>
            <div id="results"></div>
          </div>
        `;
        document.body.appendChild(sidebar);
      }
    }
  });
});
