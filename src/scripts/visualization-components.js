// ===== VISUALIZATION COMPONENTS =====
const VisualizationComponents = {
  // Sparkline chart for transactions
  renderSparkline(container, data, maxHeight = 40) {
    if (!data || !data.length) return;
    
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1; // Avoid division by zero
    
    container.innerHTML = '';
    
    data.forEach(value => {
      const height = ((value - minValue) / range) * maxHeight;
      const bar = document.createElement('div');
      bar.className = 'sparkline-bar';
      bar.style.height = `${height}px`;
      container.appendChild(bar);
    });
  },
  
  // Progress bar for API performance
  renderProgressBar(container, value, statusClass) {
    if (!container) return;
    
    const uptimeValue = parseFloat(value);
    const progressBar = container.querySelector('.progress-bar-fill');
    if (progressBar) {
      progressBar.style.width = `${uptimeValue}%`;
      progressBar.className = `progress-bar-fill ${statusClass}`;
    }
  },
  
  // Mini bar chart for revenue breakdown
  renderBarChart(container, data, maxHeight = 40) {
    if (!data || !data.length) return;
    
    const maxValue = Math.max(...data.map(item => item.value));
    
    container.innerHTML = '';
    
    data.forEach(item => {
      const height = (item.value / maxValue) * maxHeight;
      const bar = document.createElement('div');
      bar.className = 'bar-chart-item';
      bar.style.height = `${height}px`;
      bar.style.backgroundColor = item.color;
      bar.setAttribute('data-label', item.label);
      container.appendChild(bar);
    });
  }
};