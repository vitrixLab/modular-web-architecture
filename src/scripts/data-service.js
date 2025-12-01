// ===== DATA SERVICE MODULE =====
const DataService = {
  endpoints: {
    metrics: '/api/v1/metrics',
    activities: '/api/v1/activities',
    health: '/api/v1/health',
    clients: '/api/v1/clients'
  },

  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer demo-token'
  },

  async fetchMetrics() {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return this.getMockMetrics();
    } catch (error) {
      console.warn('API call failed, using mock data:', error);
      return this.getMockMetrics();
    }
  },

  async fetchActivities() {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      return this.getMockActivities();
    } catch (error) {
      console.warn('API call failed, using mock data:', error);
      return this.getMockActivities();
    }
  },

  async fetchHealthStatus() {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      return this.getMockHealthStatus();
    } catch (error) {
      console.warn('API call failed, using mock data:', error);
      return this.getMockHealthStatus();
    }
  },

  getMockMetrics() {
    // Generate sample data for visualizations
    const generateHistory = (count, min, max) => {
      return Array.from({length: count}, () => 
        Math.floor(Math.random() * (max - min + 1)) + min
      );
    };
    
    const generateBreakdown = (labels) => {
      const total = 100;
      const values = [];
      let remaining = total;
      
      for (let i = 0; i < labels.length - 1; i++) {
        const value = Math.floor(Math.random() * remaining * 0.7);
        values.push(value);
        remaining -= value;
      }
      values.push(remaining);
      
      return labels.map((label, i) => ({
        label,
        value: values[i],
        color: ['#4361ee', '#4895ef', '#4cc9f0', '#7209b7'][i]
      }));
    };
    
    // Determine status based on trend
    const getStatusFromTrend = (trend) => {
      const trendValue = parseFloat(trend);
      if (trendValue > 5) return 'positive';
      if (trendValue < -2) return 'negative';
      return 'neutral';
    };
    
    // Determine status class for API
    const getApiStatusClass = (uptime) => {
      const uptimeValue = parseFloat(uptime);
      if (uptimeValue >= 99.9) return 'success';
      if (uptimeValue >= 99.5) return 'warning';
      return 'error';
    };

    return {
      clients: {
        total: 42 + Math.floor(Math.random() * 5),
        enterprise: 8,
        growth: 24,
        startup: 10,
        trend: '+12%',
        status: getStatusFromTrend('+12%'),
        history: generateHistory(12, 35, 50)
      },
      transactions: {
        volume: `$${(2.5 + Math.random() * 0.5).toFixed(1)}M`,
        successRate: `${(98.5 + Math.random() * 1.5).toFixed(1)}%`,
        avgTransaction: `$${(85 + Math.random() * 10).toFixed(2)}`,
        chargebacks: `${(0.02 + Math.random() * 0.02).toFixed(2)}%`,
        trend: '+18%',
        history: generateHistory(7, 20, 40)
      },
      api: {
        uptime: '99.98%',
        uptimeValue: 99.98,
        responseTime: `${(130 + Math.random() * 20).toFixed(0)}ms`,
        callsToday: (280000 + Math.floor(Math.random() * 10000)).toLocaleString(),
        errorRate: '0.02%',
        status: 'Stable',
        statusClass: getApiStatusClass(99.98)
      },
      revenue: {
        monthly: `$${(82000 + Math.random() * 5000).toLocaleString()}`,
        platformFees: `$${(42000 + Math.random() * 2000).toLocaleString()}`,
        transactionFees: `$${(40000 + Math.random() * 3000).toLocaleString()}`,
        growthRate: `${(14 + Math.random() * 2).toFixed(1)}%`,
        trend: '+22%',
        breakdown: generateBreakdown(['Platform', 'Processing', 'Subscription', 'Other'])
      }
    };
  },

  getMockActivities() {
    const activities = [
      {
        id: 1,
        client: 'TechFlow SaaS',
        plan: 'Enterprise plan - $50K MRR',
        time: '2 hours ago',
        status: 'success',
        tier: 'enterprise'
      },
      {
        id: 2,
        client: 'DataSphere Analytics',
        plan: 'Growth plan - $25K MRR',
        time: '5 hours ago',
        status: 'success',
        tier: 'growth'
      },
      {
        id: 3,
        client: 'CloudSecure API',
        plan: 'Underwriting in progress',
        time: 'Yesterday',
        status: 'pending',
        tier: 'startup'
      }
    ];

    // Occasionally add a new activity
    if (Math.random() > 0.7) {
      const newClient = `NewClient${Math.floor(Math.random() * 100)}`;
      const tiers = ['startup', 'growth', 'enterprise'];
      activities.unshift({
        id: Date.now(),
        client: newClient,
        plan: 'Signup completed',
        time: 'Just now',
        status: 'success',
        tier: tiers[Math.floor(Math.random() * 3)]
      });
    }

    return activities;
  },

  getMockHealthStatus() {
    return [
      {
        service: 'Payment Processing',
        status: 'success',
        metric: 'All systems operational'
      },
      {
        service: 'Subscription Engine',
        status: 'success',
        metric: `Processing ${(1200 + Math.floor(Math.random() * 100)).toLocaleString()} renewals/hour`
      },
      {
        service: '3D Secure Service',
        status: Math.random() > 0.8 ? 'warning' : 'success',
        metric: Math.random() > 0.8 ? 'Elevated latency in EU region' : 'All regions operational'
      },
      {
        service: 'Fraud Detection',
        status: 'success',
        metric: `Blocked ${(20 + Math.floor(Math.random() * 10))} suspicious transactions`
      }
    ];
  }
};