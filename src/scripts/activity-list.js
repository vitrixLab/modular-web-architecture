// ===== ACTIVITY LIST COMPONENT =====
const ActivityListComponent = {
  container: null,
  currentActivities: [],

  async init(containerId) {
    this.container = document.getElementById(containerId);
    
    if (!this.container) {
      console.error('Activity list container not found:', containerId);
      return;
    }

    this.renderLoading();
    console.log('✅ ActivityListComponent initialized');
  },

  render(activities) {
    this.currentActivities = activities;
    
    if (!activities || !Array.isArray(activities)) {
      this.renderError('No activity data available');
      return;
    }

    try {
      const html = this.generateActivitiesHTML(activities);
      this.container.innerHTML = html;
      this.attachEventListeners();
      
    } catch (error) {
      console.error('Error rendering activities:', error);
      this.renderError('Failed to load activities');
    }
  },

  update(activities) {
    if (!this.currentActivities) {
      this.render(activities);
      return;
    }

    const newActivities = this.findNewActivities(activities, this.currentActivities);
    
    if (newActivities.length > 0) {
      this.addNewActivitiesWithAnimation(newActivities);
    }

    this.currentActivities = activities;
  },

  findNewActivities(newActivities, currentActivities) {
    const currentIds = new Set(currentActivities.map(activity => activity.id));
    return newActivities.filter(activity => !currentIds.has(activity.id));
  },

  addNewActivitiesWithAnimation(newActivities) {
    newActivities.forEach(activity => {
      const activityHTML = this.generateActivityHTML(activity);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = activityHTML;
      const newElement = tempDiv.firstChild;
      
      newElement.style.opacity = '0';
      newElement.style.transform = 'translateY(-20px)';
      
      this.container.insertBefore(newElement, this.container.firstChild);
      
      setTimeout(() => {
        newElement.style.transition = 'all 0.3s ease';
        newElement.style.opacity = '1';
        newElement.style.transform = 'translateY(0)';
      }, 10);
    });

    const allActivities = this.container.querySelectorAll('.activity-item');
    if (allActivities.length > 10) {
      for (let i = 10; i < allActivities.length; i++) {
        allActivities[i].remove();
      }
    }
  },

  generateActivitiesHTML(activities) {
    if (activities.length === 0) {
      return `
        <div class="activity-item">
          <div class="text-center" style="padding: 20px; color: var(--text-muted);">
            <p>No recent activities</p>
          </div>
        </div>
      `;
    }

    return activities.map(activity => this.generateActivityHTML(activity)).join('');
  },

  generateActivityHTML(activity) {
    const statusIcon = activity.status === 'success' ? '✓' : '⏳';
    const statusClass = activity.status === 'success' ? 'success' : 'pending';
    
    return `
      <div class="activity-item" data-activity-id="${activity.id}">
        <div class="activity-icon ${statusClass}">${statusIcon}</div>
        <div class="activity-content">
          <div class="activity-title">${this.escapeHTML(activity.client)}</div>
          <div class="activity-description">${this.escapeHTML(activity.plan)}</div>
          <div class="activity-time">${this.escapeHTML(activity.time)}</div>
        </div>
        <div class="activity-badge ${activity.tier}">${this.formatTier(activity.tier)}</div>
      </div>
    `;
  },

  formatTier(tier) {
    const tierMap = {
      enterprise: 'Enterprise',
      growth: 'Growth',
      startup: 'Startup'
    };
    return tierMap[tier] || tier;
  },

  escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  renderLoading() {
    this.container.innerHTML = `
      <div class="activity-item">
        <div class="skeleton-loader" style="width: 32px; height: 32px; border-radius: 50%;"></div>
        <div class="activity-content">
          <div class="skeleton-loader" style="width: 120px; height: 16px; margin-bottom: 8px;"></div>
          <div class="skeleton-loader" style="width: 180px; height: 14px; margin-bottom: 6px;"></div>
          <div class="skeleton-loader" style="width: 80px; height: 12px;"></div>
        </div>
        <div class="skeleton-loader" style="width: 60px; height: 20px; border-radius: 12px;"></div>
      </div>
    `;
  },

  renderError(message) {
    this.container.innerHTML = `
      <div class="activity-item">
        <div class="text-center" style="padding: 20px; color: var(--error-color);">
          <p>⚠️</p>
          <p>${message}</p>
        </div>
      </div>
    `;
  },

  attachEventListeners() {
    const activityItems = this.container.querySelectorAll('.activity-item');
    
    activityItems.forEach(item => {
      item.addEventListener('click', () => {
        const activityId = item.getAttribute('data-activity-id');
        const activity = this.currentActivities.find(a => a.id == activityId);
        this.handleActivityClick(activity);
      });
    });
  },

  handleActivityClick(activity) {
    console.log('Activity clicked:', activity);
    const item = this.container.querySelector(`[data-activity-id="${activity.id}"]`);
    item.style.backgroundColor = 'var(--bg-tertiary)';
    setTimeout(() => item.style.backgroundColor = '', 300);
  }
};
