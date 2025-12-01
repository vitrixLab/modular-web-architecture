// ===== HEALTH STATUS COMPONENT =====
const HealthStatusComponent = {
  container: null,
  currentStatus: [],

  async init(containerId) {
    this.container = document.getElementById(containerId);
    
    if (!this.container) {
      console.error('Health status container not found:', containerId);
      return;
    }

    this.renderLoading();
    console.log('✅ HealthStatusComponent initialized');
  },

  render(healthStatus) {
    this.currentStatus = healthStatus;
    
    if (!healthStatus || !Array.isArray(healthStatus)) {
      this.renderError('No health status data available');
      return;
    }

    try {
      const html = this.generateHealthHTML(healthStatus);
      this.container.innerHTML = html;
      this.attachEventListeners();
      
    } catch (error) {
      console.error('Error rendering health status:', error);
      this.renderError('Failed to load health status');
    }
  },

  update(healthStatus) {
    if (!this.currentStatus) {
      this.render(healthStatus);
      return;
    }

    this.currentStatus = healthStatus;
    
    healthStatus.forEach((status) => {
      const healthItem = this.container.querySelector(`[data-service="${this.slugify(status.service)}"]`);
      if (healthItem) {
        this.updateHealthItem(healthItem, status);
      }
    });
  },

  updateHealthItem(healthItem, status) {
    const statusElement = healthItem.querySelector('.health-status');
    const metricElement = healthItem.querySelector('.health-metric');
    
    if (statusElement) {
      statusElement.className = `health-status ${status.status}`;
    }
    
    if (metricElement) {
      metricElement.textContent = status.metric;
    }
    
    const currentStatus = healthItem.getAttribute('data-status');
    if (currentStatus !== status.status) {
      healthItem.style.animation = 'pulse 0.5s ease';
      setTimeout(() => healthItem.style.animation = '', 500);
      healthItem.setAttribute('data-status', status.status);
    }
  },

  generateHealthHTML(healthStatus) {
    return healthStatus.map(status => this.generateHealthItemHTML(status)).join('');
  },

  generateHealthItemHTML(status) {
    return `
      <div class="health-item" data-service="${this.slugify(status.service)}" data-status="${status.status}">
        <div class="health-status ${status.status}"></div>
        <div class="health-info">
          <div class="health-title">${this.escapeHTML(status.service)}</div>
          <div class="health-metric">${this.escapeHTML(status.metric)}</div>
        </div>
      </div>
    `;
  },

  slugify(text) {
    return text.toLowerCase().replace(/[^\w]+/g, '-');
  },

  escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  renderLoading() {
    this.container.innerHTML = `
      <div class="health-item">
        <div class="skeleton-loader" style="width: 12px; height: 12px; border-radius: 50%;"></div>
        <div class="health-info">
          <div class="skeleton-loader" style="width: 120px; height: 16px; margin-bottom: 8px;"></div>
          <div class="skeleton-loader" style="width: 180px; height: 14px;"></div>
        </div>
      </div>
      <div class="health-item">
        <div class="skeleton-loader" style="width: 12px; height: 12px; border-radius: 50%;"></div>
        <div class="health-info">
          <div class="skeleton-loader" style="width: 120px; height: 16px; margin-bottom: 8px;"></div>
          <div class="skeleton-loader" style="width: 180px; height: 14px;"></div>
        </div>
      </div>
      <div class="health-item">
        <div class="skeleton-loader" style="width: 12px; height: 12px; border-radius: 50%;"></div>
        <div class="health-info">
          <div class="skeleton-loader" style="width: 120px; height: 16px; margin-bottom: 8px;"></div>
          <div class="skeleton-loader" style="width: 180px; height: 14px;"></div>
        </div>
      </div>
      <div class="health-item">
        <div class="skeleton-loader" style="width: 12px; height: 12px; border-radius: 50%;"></div>
        <div class="health-info">
          <div class="skeleton-loader" style="width: 120px; height: 16px; margin-bottom: 8px;"></div>
          <div class="skeleton-loader" style="width: 180px; height: 14px;"></div>
        </div>
      </div>
    `;
  },

  renderError(message) {
    this.container.innerHTML = `
      <div class="health-item">
        <div class="text-center" style="padding: 20px; color: var(--error-color);">
          <p>🔄</p>
          <p>${message}</p>
        </div>
      </div>
    `;
  },

  attachEventListeners() {
    const healthItems = this.container.querySelectorAll('.health-item');
    
    healthItems.forEach(item => {
      item.addEventListener('click', () => {
        const service = item.getAttribute('data-service');
        const status = this.currentStatus.find(s => this.slugify(s.service) === service);
        this.handleHealthItemClick(status);
      });
    });
  },

  handleHealthItemClick(status) {
    console.log('Health item clicked:', status);
    const item = this.container.querySelector(`[data-service="${this.slugify(status.service)}"]`);
    item.style.transform = 'scale(0.98)';
    setTimeout(() => item.style.transform = '', 150);
  }
};