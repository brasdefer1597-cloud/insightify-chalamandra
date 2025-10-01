// Advanced Popup Script with Chrome AI Integration
class InsightifyPopup {
  constructor() {
    this.currentTab = null;
    this.isAnalyzing = false;
    this.userSettings = {};
    
    this.initialize();
  }

  async initialize() {
    await this.loadCurrentTab();
    await this.loadUserSettings();
    this.initializeUI();
    this.bindEvents();
    this.checkAICapabilities();
    
    console.log('🦎 Insightify Popup Initialized');
  }

  async loadCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    this.currentTab = tab;
  }

  async loadUserSettings() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['insightify_settings'], (result) => {
        this.userSettings = result.insightify_settings || {};
        resolve();
      });
    });
  }

  initializeUI() {
    this.updateStatusIndicator();
    this.initializeAnimations();
  }

  updateStatusIndicator() {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');
    
    if (this.currentTab) {
      statusDot.classList.add('active');
      statusText.textContent = 'AI Ready';
    } else {
      statusDot.classList.remove('active');
      statusText.textContent = 'No Active Tab';
    }
  }

  initializeAnimations() {
    // Initialize any UI animations
    this.initializeHoverEffects();
    this.initializeClickAnimations();
  }

  initializeHoverEffects() {
    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('.primary-action, .action-item, .footer-btn');
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', this.handleHoverEnter);
      element.addEventListener('mouseleave', this.handleHoverLeave);
    });
  }

  handleHoverEnter(e) {
    e.currentTarget.style.transform = 'translateY(-2px)';
  }

  handleHoverLeave(e) {
    e.currentTarget.style.transform = 'translateY(0)';
  }

  initializeClickAnimations() {
    // Add click animations
    const clickableElements = document.querySelectorAll('.primary-action, .action-item');
    
    clickableElements.forEach(element => {
      element.addEventListener('click', this.handleClickAnimation);
    });
  }

  handleClickAnimation(e) {
    const element = e.currentTarget;
    element.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      element.style.transform = '';
    }, 150);
  }

  bindEvents() {
    // Primary analyze action
    document.getElementById('analyze-action').addEventListener('click', () => {
      this.analyzeCurrentPage();
    });

    // Quick actions
    document.getElementById('quick-insights').addEventListener('click', () => {
      this.quickInsights();
    });

    document.getElementById('multimodal-analysis').addEventListener('click', () => {
      this.multimodalAnalysis();
    });

    document.getElementById('translate-content').addEventListener('click', () => {
      this.translateContent();
    });

    document.getElementById('open-demo').addEventListener('click', () => {
      this.openDemo();
    });

    // Footer buttons
    document.getElementById('settings-btn').addEventListener('click', () => {
      this.openSettings();
    });

    document.getElementById('info-btn').addEventListener('click', () => {
      this.showInfo();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardShortcuts(e);
    });
  }

  async analyzeCurrentPage() {
    if (this.isAnalyzing) return;
    
    this.isAnalyzing = true;
    this.showLoadingState('analyze-action', 'Analyzing...');

    try {
      // Send message to content script to analyze page
      const response = await chrome.tabs.sendMessage(this.currentTab.id, {
        action: 'ANALYZE_CONTENT'
      });

      if (response && response.success) {
        this.showSuccessState('analyze-action', 'Analysis Complete!');
        this.celebrateSuccess();
      } else {
        throw new Error('Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      this.showErrorState('analyze-action', 'Analysis Failed');
      
      // Fallback: inject sidebar directly
      await this.fallbackAnalysis();
    } finally {
      setTimeout(() => {
        this.resetButtonState('analyze-action', 'Analyze Page');
        this.isAnalyzing = false;
      }, 2000);
    }
  }

  async fallbackAnalysis() {
    // Direct script injection as fallback
    await chrome.scripting.executeScript({
      target: { tabId: this.currentTab.id },
      function: () => {
        // Create and dispatch custom event for content script
        const event = new CustomEvent('insightifyToggleSidebar');
        document.dispatchEvent(event);
        
        // Trigger analysis after a delay
        setTimeout(() => {
          if (typeof window.insightifyAnalyzePage === 'function') {
            window.insightifyAnalyzePage();
          }
        }, 500);
      }
    });
  }

  async quickInsights() {
    this.showLoadingState('quick-insights', 'Processing...');
    
    await chrome.tabs.sendMessage(this.currentTab.id, {
      action: 'QUICK_INSIGHTS'
    });
    
    setTimeout(() => {
      this.resetButtonState('quick-insights', 'Quick Insights');
    }, 1000);
  }

  async multimodalAnalysis() {
    this.showToast('Multimodal analysis launched', 'success');
    
    // For demo purposes - in production would use Chrome Prompt API
    await chrome.tabs.create({
      url: chrome.runtime.getURL('demo-simulator.html#multimodal')
    });
  }

  async translateContent() {
    this.showLoadingState('translate-content', 'Translating...');
    
    const response = await chrome.tabs.sendMessage(this.currentTab.id, {
      action: 'TRANSLATE_CONTENT',
      data: { targetLanguage: 'en' }
    });
    
    this.showToast('Translation complete', 'success');
    this.resetButtonState('translate-content', 'Translate');
  }

  openDemo() {
    chrome.tabs.create({
      url: chrome.runtime.getURL('demo-simulator.html')
    });
  }

  openSettings() {
    // Could open options page or show settings modal
    this.showToast('Settings would open here', 'info');
  }

  showInfo() {
    const infoMessage = `
Insightify Salamander v1.0.0

Chrome AI APIs Used:
• Summarizer API - Content analysis
• Prompt API - Multimodal processing  
• Translator API - Language translation

Built for Google Chrome AI Challenge 2025
    `.trim();
    
    this.showToast(infoMessage, 'info', 5000);
  }

  showLoadingState(buttonId, text) {
    const button = document.getElementById(buttonId);
    const originalText = button.querySelector('span')?.textContent || 
                        button.querySelector('h3')?.textContent;
    
    button.setAttribute('data-original-text', originalText);
    button.style.opacity = '0.7';
    button.style.pointerEvents = 'none';
    
    if (button.querySelector('h3')) {
      button.querySelector('h3').textContent = text;
    } else if (button.querySelector('span')) {
      button.querySelector('span').textContent = text;
    }
  }

  resetButtonState(buttonId, originalText) {
    const button = document.getElementById(buttonId);
    button.style.opacity = '';
    button.style.pointerEvents = '';
    
    if (button.querySelector('h3')) {
      button.querySelector('h3').textContent = originalText;
    } else if (button.querySelector('span')) {
      button.querySelector('span').textContent = originalText;
    }
  }

  showSuccessState(buttonId, text) {
    const button = document.getElementById(buttonId);
    button.style.background = 'linear-gradient(135deg, #39FF14, #00FFEA)';
    
    if (button.querySelector('h3')) {
      button.querySelector('h3').textContent = text;
    }
  }

  showErrorState(buttonId, text) {
    const button = document.getElementById(buttonId);
    button.style.background = 'linear-gradient(135deg, #FF003C, #FF6600)';
    
    if (button.querySelector('h3')) {
      button.querySelector('h3').textContent = text;
    }
  }

  showToast(message, type = 'info', duration = 3000) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `insightify-toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--dark-bg);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      max-width: 300px;
      font-size: 0.8rem;
      animation: toastSlideIn 0.3s ease-out;
    `;

    document.body.appendChild(toast);

    // Remove toast after duration
    setTimeout(() => {
      toast.style.animation = 'toastSlideOut 0.3s ease-in forwards';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  celebrateSuccess() {
    const logo = document.querySelector('.logo');
    logo.style.animation = 'celebrate 0.6s ease-in-out';
    
    setTimeout(() => {
      logo.style.animation = '';
    }, 600);
  }

  async checkAICapabilities() {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'GET_AI_CAPABILITIES'
      });

      if (response && response.success) {
        this.updateAPIStatus(response.data);
      }
    } catch (error) {
      console.log('AI capabilities check failed:', error);
    }
  }

  updateAPIStatus(capabilities) {
    const apiTags = document.querySelectorAll('.api-tag');
    
    capabilities.available_apis.forEach(api => {
      const tag = Array.from(apiTags).find(tag => 
        tag.classList.contains(api.name.toLowerCase().split(' ')[0])
      );
      
      if (tag) {
        if (api.status === 'available') {
          tag.style.opacity = '1';
        } else {
          tag.style.opacity = '0.5';
        }
      }
    });
  }

  handleKeyboardShortcuts(e) {
    // Close popup with Escape
    if (e.key === 'Escape') {
      window.close();
    }
    
    // Analyze with Enter
    if (e.key === 'Enter' && !this.isAnalyzing) {
      this.analyzeCurrentPage();
    }
  }
}

// Add toast animations to document
const toastStyles = document.createElement('style');
toastStyles.textContent = `
  @keyframes toastSlideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes toastSlideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  @keyframes celebrate {
    0%, 100% { transform: scale(1) rotate(0deg); }
    25% { transform: scale(1.2) rotate(10deg); }
    50% { transform: scale(1.3) rotate(-10deg); }
    75% { transform: scale(1.2) rotate(5deg); }
  }
`;
document.head.appendChild(toastStyles);

// Initialize the popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new InsightifyPopup();
});
