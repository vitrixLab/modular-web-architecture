const fs = require('fs');
const path = require('path');

class BuildSystem {
  constructor() {
    this.componentsDir = './src/components';
    this.templatesDir = './src/templates';
    this.stylesDir = './src/styles';
    this.scriptsDir = './src/scripts';
    this.distDir = './dist';
  }

  async init() {
    console.log('🚀 Starting Ascend Payments Dashboard build...');
    
    try {
      await this.ensureDistDirectory();
      const html = await this.assembleHTML();
      await this.writeOutput(html);
      console.log('✅ Build completed successfully!');
    } catch (error) {
      console.error('❌ Build failed:', error);
      process.exit(1);
    }
  }

  async ensureDistDirectory() {
    if (!fs.existsSync(this.distDir)) {
      fs.mkdirSync(this.distDir, { recursive: true });
    }
  }

  async assembleHTML() {
    // Read base template
    const baseTemplate = await this.readFile(path.join(this.templatesDir, 'base.html'));
    
    // Read components
    const components = await this.readComponents();
    
    // Replace placeholders in template
    let html = baseTemplate;
    for (const [key, value] of Object.entries(components)) {
      html = html.replace(`<!-- ${key.toUpperCase()} -->`, value);
    }
    
    return html;
  }

  async readComponents() {
    const componentFiles = {
      head: 'head.html',
      navigation: 'navigation.html',
      header: 'header.html',
      metrics: 'metrics-cards.html',
      activity: 'activity-list.html',
      health: 'health-status.html'
    };

    const components = {};
    
    for (const [key, filename] of Object.entries(componentFiles)) {
      const filePath = path.join(this.componentsDir, filename);
      components[key] = await this.readFile(filePath);
    }

    // Read and inline CSS
    const css = await this.readFile(path.join(this.stylesDir, 'main.css'));
    components.css = `<style>${css}</style>`;

    // Read and inline JavaScript
    const scripts = await this.bundleScripts();
    components.scripts = `<script>${scripts}</script>`;

    return components;
  }

  async bundleScripts() {
    const scriptFiles = [
      'theme-manager.js',
      'data-service.js',
      'visualization-components.js',
      'metrics-cards.js',
      'activity-list.js',
      'health-status.js',
      'app.js'
    ];

    let bundledScript = '';
    
    for (const filename of scriptFiles) {
      const filePath = path.join(this.scriptsDir, filename);
      const content = await this.readFile(filePath);
      bundledScript += `\n// ${filename}\n${content}\n`;
    }

    return bundledScript;
  }

  async readFile(filePath) {
    try {
      return await fs.promises.readFile(filePath, 'utf8');
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      throw error;
    }
  }

  async writeOutput(html) {
    const outputPath = path.join(this.distDir, 'index.html');
    await fs.promises.writeFile(outputPath, html, 'utf8');
    console.log(`📁 Output written to: ${outputPath}`);
  }
}

// Run build if called directly
if (require.main === module) {
  const buildSystem = new BuildSystem();
  buildSystem.init();
}

module.exports = BuildSystem;