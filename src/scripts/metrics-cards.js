// ===== METRICS CARDS COMPONENT =====
const MetricsCardsComponent = {
  container: null,
  currentData: null,

  async init(containerId) {
    this.container = document.getElementById(containerId);
    
    if (!this.container) {
      console.error('Metrics cards container not found:', containerId);
      return;
    }

    this.renderLoading();
    console.log('✅ MetricsCardsComponent initialized');
  },

  render(data) {
    this.currentData = data;
    
    if (!data) {
      this.renderError('No data available');
      return;
    }

    try {
      const html = this.generateMetricsHTML(data);
      this.container.innerHTML = html;
      this.renderVisualizations(data);
      this.attachEventListeners();
      
    } catch (error) {
      console.error('Error rendering metrics cards:', error);
      this.renderError('Failed to render metrics');
    }
  },

  update(data) {
    if (!this.currentData) {
      this.render(data);
      return;
    }

    this.currentData = data;
    
    Object.keys(data).forEach(metricType => {
      const card = this.container.querySelector(`[data-metric="${metricType}"]`);
      if (card) {
        this.updateCard(card, data[metricType], metricType);
      }
    });
    
    this.renderVisualizations(data);
  },

  updateCard(card, data, metricType) {
    const valueElement = card.querySelector('.metric-value');
    const trendElement = card.querySelector('.metric-trend');
    
    if (valueElement) {
      valueElement.textContent = this.getPrimaryValue(data, metricType);
    }
    
    if (trendElement && data.trend) {
      trendElement.textContent = data.trend;
      // Update trend class based on data
      trendElement.className = `metric-trend ${data.status || 'positive'}`;
    }
    
    this.updateBreakdown(card, data, metricType);
    
    card.style.animation = 'highlight 1s ease';
    setTimeout(() => card.style.animation = '', 1000);
  },

  updateBreakdown(card, data, metricType) {
    const breakdownContainer = card.querySelector('.metric-breakdown');
    if (!breakdownContainer) return;

    const breakdownHTML = this.generateBreakdownHTML(data, metricType);
    breakdownContainer.innerHTML = breakdownHTML;
  },

  renderVisualizations(data) {
    // Render sparkline for transactions
    const transactionsChart = document.querySelector('[data-metric="transactions"] .sparkline-chart');
    if (transactionsChart && data.transactions.history) {
      VisualizationComponents.renderSparkline(transactionsChart, data.transactions.history);
    }
    
    // Render progress bar for API
    const apiProgressContainer = document.querySelector('[data-metric="api"] .progress-bar-container');
    if (apiProgressContainer && data.api.uptimeValue) {
      VisualizationComponents.renderProgressBar(
        apiProgressContainer, 
        data.api.uptimeValue, 
        data.api.statusClass
      );
    }
    
    // Render bar chart for revenue
    const revenueChart = document.querySelector('[data-metric="revenue"] .bar-chart');
    if (revenueChart && data.revenue.breakdown) {
      VisualizationComponents.renderBarChart(revenueChart, data.revenue.breakdown);
    }
  },

  generateMetricsHTML(data) {
    const { clients, transactions, api, revenue } = data;
    
    return `
      <div class="dashboard-card" data-metric="clients">
        <div class="card-header">
          <div class="card-icon">👥</div>
          <h3 class="card-title">Active Clients</h3>
        </div>
        <div class="card-content">
          <div class="metric-display">
            <div class="metric-value">${clients.total}</div>
            <div class="metric-label">SaaS Companies</div>
            <div class="metric-trend ${clients.status}">
              <span>${clients.trend}</span>
            </div>
          </div>
            <hr style="border: 0; border-top: 0.5px solid #444444; width: 100%; margin: 20px 0;">
          <div class="metric-breakdown">
            ${this.generateBreakdownHTML(clients, 'clients')}
          </div>
        </div>
        <div class="card-status-bar ${clients.status}"></div>
      </div>

      <div class="dashboard-card" data-metric="transactions">
        <div class="card-header">
          <div class="card-icon">💳</div>
          <h3 class="card-title">Transaction Volume</h3>
        </div>
        <div class="card-content">
          <div class="metric-display">
            <div class="metric-value">${transactions.volume}</div>
            <div class="metric-label">Monthly Processed</div>
            <div class="metric-trend positive">
              <span>${transactions.trend}</span>
            </div>
          </div>
          <hr style="border: 0; border-top: 0.5px solid #444444; width: 100%; margin: 20px 0;">  
          <div class="viz-container sparkline-chart"></div>
          <div class="metric-breakdown">
            ${this.generateBreakdownHTML(transactions, 'transactions')}
          </div>
        </div>
        <div class="card-status-bar ${clients.status}"></div>
      </div>

      <div class="dashboard-card" data-metric="api">
        <div class="card-header">
          <div class="card-icon">🔧</div>
          <h3 class="card-title">API Performance</h3>
        </div>
        <div class="card-content">
          <div class="progress-bar-container">
            <div class="metric-value-label">
              <div class="metric-value">${api.uptime}</div>
              <div class="metric-label">Uptime</div>
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill ${api.statusClass}" style="width: ${api.uptimeValue}%"></div>
            </div>
          </div>
          <div class="metric-trend positive">
            <span>${api.status}</span> 
          </div> 
          <div><hr style="border: 0; border-top: 0.5px solid #444444; width: 100%; margin: 20px 0;">
            </div>
          <div class="metric-breakdown">
            ${this.generateBreakdownHTML(api, 'api')}
          </div>  
        </div>
        <div class="card-status-bar ${clients.status}"></div>
      </div>

      <div class="dashboard-card" data-metric="revenue">
        <div class="card-header">
          <div class="card-icon">💰</div>
          <h3 class="card-title">Revenue Metrics</h3>
        </div>
        <div class="card-content">
          <div class="metric-display">
            <div class="metric-value">${revenue.monthly}</div>
            <div class="metric-label">Monthly Revenue</div>
            <div class="metric-trend positive">
              <span>${revenue.trend}</span>
            </div>
          </div>
          <div><hr style="border: 0; border-top: 0.5px solid #444444; width: 100%; margin: 20px 0;">
            </div>
          <div class="viz-container bar-chart"></div>
          <br>  
          <div class="metric-breakdown">
            ${this.generateBreakdownHTML(revenue, 'revenue')}
          </div>
        </div>
        <div class="card-status-bar ${clients.status}"></div>
      </div>
    `;
  },

  generateBreakdownHTML(data, type) {
    switch (type) {
      case 'clients':
        return `
          <div class="breakdown-item">
            <span class="breakdown-label">Enterprise:</span>
            <span class="breakdown-value">${data.enterprise} clients</span>
          </div>
          <div class="breakdown-item">
            <span class="breakdown-label">Growth:</span>
            <span class="breakdown-value">${data.growth} clients</span>
          </div>
          <div class="breakdown-item">
            <span class="breakdown-label">Startup:</span>
            <span class="breakdown-value">${data.startup} clients</span>
          </div>
        `;
      
      case 'transactions':
        return `
          <div class="breakdown-item">
            <span class="breakdown-label">Success Rate:</span>
            <span class="breakdown-value success">${data.successRate}</span>
          </div>
          <div class="breakdown-item">
            <span class="breakdown-label">Avg Transaction:</span>
            <span class="breakdown-value">${data.avgTransaction}</span>
          </div>
          <div class="breakdown-item">
            <span class="breakdown-label">Chargebacks:</span>
            <span class="breakdown-value warning">${data.chargebacks}</span>
          </div>
        `;
      
      case 'api':
        return `
          <div class="breakdown-item">
            <span class="breakdown-label">Avg Response:</span>
            <span class="breakdown-value success">${data.responseTime}</span>
          </div>
          <div class="breakdown-item">
            <span class="breakdown-label">API Calls Today:</span>
            <span class="breakdown-value">${data.callsToday}</span>
          </div>
          <div class="breakdown-item">
            <span class="breakdown-label">Error Rate:</span>
            <span class="breakdown-value success">${data.errorRate}</span>
          </div>
        `;
      
      case 'revenue':
        return `
          <div class="breakdown-item">
            <span class="breakdown-label">Platform Fees:</span>
            <span class="breakdown-value">${data.platformFees}</span>
          </div>
          <div class="breakdown-item">
            <span class="breakdown-label">Transaction Fees:</span>
            <span class="breakdown-value">${data.transactionFees}</span>
          </div>
          <div class="breakdown-item">
            <span class="breakdown-label">MRR Growth:</span>
            <span class="breakdown-value success">${data.growthRate}</span>
          </div>
        `;
      
      default:
        return '';
    }
  },

  getPrimaryValue(data, type) {
    const valueMap = {
      clients: data.total,
      transactions: data.volume,
      api: data.uptime,
      revenue: data.monthly
    };
    
    return valueMap[type] || 'N/A';
  },

  renderLoading() {
    this.container.innerHTML = `
      <div class="dashboard-card">
        <div class="skeleton-loader" style="height: 120px;"></div>
      </div>
      <div class="dashboard-card">
        <div class="skeleton-loader" style="height: 120px;"></div>
      </div>
      <div class="dashboard-card">
        <div class="skeleton-loader" style="height: 120px;"></div>
      </div>
      <div class="dashboard-card">
        <div class="skeleton-loader" style="height: 120px;"></div>
      </div>
    `;
  },

  renderError(message) {
    this.container.innerHTML = `
      <div class="dashboard-card">
        <div class="card-content text-center">
          <div style="padding: 20px; color: var(--error-color);">
            <p>📊</p>
            <p>${message}</p>
          </div>
        </div>
      </div>
    `;
  },

  attachEventListeners() {
    const cards = this.container.querySelectorAll('.dashboard-card');
    
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const metricType = card.getAttribute('data-metric');
        this.handleCardClick(metricType, this.currentData[metricType]);
      });
    });
  },

  handleCardClick(metricType, data) {
    console.log(`Card clicked: ${metricType}`, data);
    const card = this.container.querySelector(`[data-metric="${metricType}"]`);
    card.style.transform = 'scale(0.98)';
    setTimeout(() => card.style.transform = '', 150);
  }
};