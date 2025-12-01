// ===== ENHANCED THEME MANAGER =====
const EnhancedThemeManager = {
  currentTheme: 'dark',
  systemPreference: null,
  
  init() {
    this.detectSystemPreference();
    this.loadThemePreference();
    this.setupEventListeners();
    this.applyTheme(this.currentTheme);
    this.setupIntersectionObserver();
  },
  
  detectSystemPreference() {
    this.systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      this.systemPreference = e.matches ? 'dark' : 'light';
      if (this.currentTheme === 'system') {
        this.applyTheme(this.systemPreference);
      }
    });
  },
  
  loadThemePreference() {
    const savedTheme = localStorage.getItem('ascend-theme') || 'dark';
    this.currentTheme = savedTheme;
  },
  
  setupEventListeners() {
    const toggleBtn = document.getElementById('themeToggle');
    const preferenceBtn = document.querySelector('.preference-btn');
    
    toggleBtn.addEventListener('click', () => {
      this.toggleTheme();
      this.animateToggle();
    });
    
    toggleBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleTheme();
        this.animateToggle();
      }
    });
    
    if (preferenceBtn) {
      preferenceBtn.addEventListener('click', () => {
        this.setSystemTheme();
      });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.key === 't') {
        e.preventDefault();
        this.toggleTheme();
        this.animateToggle();
        this.showKeyboardShortcutHint();
      }
    });
  },
  
  setupIntersectionObserver() {
    // Observe toggle visibility for performance
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    });
    
    const toggleContainer = document.querySelector('.theme-toggle-container');
    if (toggleContainer) {
      observer.observe(toggleContainer);
    }
  },
  
  toggleTheme() {
    const themes = ['dark', 'light'];
    const currentIndex = themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.currentTheme = themes[nextIndex];
    
    this.applyTheme(this.currentTheme);
    this.savePreference();
  },
  
  setSystemTheme() {
    this.currentTheme = 'system';
    this.applyTheme(this.systemPreference);
    this.savePreference();
    this.updatePreferenceButton();
  },
  
  applyTheme(theme) {
    const actualTheme = theme === 'system' ? this.systemPreference : theme;
    
    // Update data attribute for CSS
    document.documentElement.setAttribute('data-theme', actualTheme);
    
    // Update UI elements
    this.updateToggleUI(actualTheme);
    this.updateMetaTheme(actualTheme);
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: actualTheme, preference: this.currentTheme }
    }));
  },
  
  updateToggleUI(theme) {
    const toggleLabel = document.getElementById('toggleLabel');
    const toggle = document.getElementById('themeToggle');
    const currentThemeSpan = document.getElementById('currentTheme');
    
    if (toggleLabel) {
      toggleLabel.textContent = theme === 'light' ? 'Light Mode' : 'Dark Mode';
    }
    
    if (currentThemeSpan) {
      currentThemeSpan.textContent = theme === 'light' ? 'Light Mode' : 'Dark Mode';
    }
    
    // Update ARIA label for accessibility
    if (toggle) {
      toggle.setAttribute('aria-label', `Toggle theme - Currently ${theme} mode`);
      toggle.setAttribute('title', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
    }
  },
  
  updatePreferenceButton() {
    const preferenceBtn = document.querySelector('.preference-btn');
    if (preferenceBtn) {
      if (this.currentTheme === 'system') {
        preferenceBtn.classList.add('active');
        preferenceBtn.setAttribute('aria-pressed', 'true');
      } else {
        preferenceBtn.classList.remove('active');
        preferenceBtn.setAttribute('aria-pressed', 'false');
      }
    }
  },
  
  updateMetaTheme(theme) {
    // Update meta theme-color for mobile browsers
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = theme === 'light' ? '#ffffff' : '#121212';
  },
  
  animateToggle() {
    const toggle = document.getElementById('themeToggle');
    const thumb = toggle?.querySelector('.toggle-thumb');
    
    if (thumb) {
      thumb.style.transform = 'scale(1.1)';
      setTimeout(() => {
        thumb.style.transform = '';
      }, 150);
    }
  },
  
  savePreference() {
    localStorage.setItem('ascend-theme', this.currentTheme);
  },
  
  showKeyboardShortcutHint() {
    // Optional: Show a subtle hint about the keyboard shortcut
    console.log('💡 Pro tip: Press Alt + T to toggle themes quickly');
  }
};