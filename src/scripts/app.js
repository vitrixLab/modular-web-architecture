// ===== MAIN APPLICATION =====
const App = {
  config: {
    refreshInterval: 15000, // 15 seconds
    criticalRefreshInterval: 10000 // 10 seconds
  },

  state: {
    isLoading: false,
    lastUpdate: null
  },

  async init() {
    try {
      console.log('🚀 Initializing Ascend Payments Platform...');
      
      await this.initializeComponents();
      this.setupEventListeners();
      await this.loadInitialData();
      this.startBackgroundUpdates();
      
      console.log('✅ Application initialized successfully');
      
    } catch (error) {
      console.error('❌ Application initialization failed:', error);
      this.handleError(error);
    }
  },

  async initializeComponents() {
    await MetricsCardsComponent.init('metricsCardsContainer');
    await ActivityListComponent.init('activityListContainer');
    await HealthStatusComponent.init('healthStatusContainer');
  },

  setupEventListeners() {
    // Navigation
    const navItems = document.querySelectorAll('.nav-item[data-route]');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const route = item.getAttribute('data-route');
        this.handleNavigation(route, item);
      });
    });

    // Global error handling
    window.addEventListener('error', this.handleGlobalError.bind(this));
    window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
  },

  handleNavigation(route, clickedItem) {
    console.log('Navigating to:', route);
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    clickedItem.classList.add('active');
    
    // Update page title
    document.title = `${route.charAt(0).toUpperCase() + route.slice(1)} - Ascend Payments`;
    
    // Show notification for non-dashboard routes
    if (route !== 'dashboard') {
      this.showNotification(`${route} view coming soon!`, 'info');
    }
  },

  async loadInitialData() {
    this.state.isLoading = true;
    
    try {
      const [metrics, activities, health] = await Promise.all([
        DataService.fetchMetrics(),
        DataService.fetchActivities(),
        DataService.fetchHealthStatus()
      ]);

      MetricsCardsComponent.render(metrics);
      ActivityListComponent.render(activities);
      HealthStatusComponent.render(health);

      this.state.lastUpdate = new Date();
      this.state.isLoading = false;

      console.log('📊 Initial data loaded successfully');
      this.showNotification('Dashboard loaded successfully!', 'success');

    } catch (error) {
      console.error('Failed to load initial data:', error);
      this.useMockData();
      this.state.isLoading = false;
      this.showNotification('Using demo data - API unavailable', 'warning');
    }
  },

  useMockData() {
    console.warn('Using mock data as fallback');
    
    const mockMetrics = DataService.getMockMetrics();
    const mockActivities = DataService.getMockActivities();
    const mockHealth = DataService.getMockHealthStatus();

    MetricsCardsComponent.render(mockMetrics);
    ActivityListComponent.render(mockActivities);
    HealthStatusComponent.render(mockHealth);
  },

  startBackgroundUpdates() {
    // Update data periodically
    setInterval(async () => {
      if (!this.state.isLoading && document.visibilityState === 'visible') {
        await this.refreshData();
      }
    }, this.config.refreshInterval);

    // Real-time updates for critical metrics
    setInterval(() => {
      if (document.visibilityState === 'visible') {
        this.refreshCriticalMetrics();
      }
    }, this.config.criticalRefreshInterval);
  },

  async refreshData() {
    try {
      const [metrics, activities, health] = await Promise.all([
        DataService.fetchMetrics(),
        DataService.fetchActivities(),
        DataService.fetchHealthStatus()
      ]);

      MetricsCardsComponent.update(metrics);
      ActivityListComponent.update(activities);
      HealthStatusComponent.update(health);

      this.state.lastUpdate = new Date();
      
      console.log('🔄 Data updated at:', new Date().toLocaleTimeString());

    } catch (error) {
      console.warn('Background update failed:', error);
    }
  },

  async refreshCriticalMetrics() {
    try {
      const metrics = await DataService.fetchMetrics();
      MetricsCardsComponent.update(metrics);
    } catch (error) {
      console.warn('Critical metrics update failed:', error);
    }
  },

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'var(--success-color)' : 
                    type === 'warning' ? 'var(--warning-color)' : 
                    type === 'error' ? 'var(--error-color)' : 'var(--primary-color)';
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${bgColor};
      color: white;
      padding: 12px 16px;
      border-radius: var(--border-radius);
      z-index: 10000;
      box-shadow: var(--shadow);
      max-width: 300px;
      animation: slideIn 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  },

  handleGlobalError(event) {
    console.error('Global error:', event.error);
    this.showNotification('An unexpected error occurred', 'error');
  },

  handlePromiseRejection(event) {
    console.error('Unhandled promise rejection:', event.reason);
    this.showNotification('Async operation failed', 'error');
  },

  handleError(error) {
    console.error('Application error:', error);
    this.showNotification(error.message || 'An error occurred', 'error');
  }
};

// Initialize enhanced theme manager
document.addEventListener('DOMContentLoaded', () => {
  EnhancedThemeManager.init();
  App.init();
});

// Export for debugging
window.AscendPaymentsApp = App;
window.ThemeManager = EnhancedThemeManager;