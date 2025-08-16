// Theme Manager with Color Palettes
class ThemeManager {
  constructor() {
    this.themeSelector = document.getElementById('theme-selector');
    this.paletteSelector = document.getElementById('palette-selector');
    this.themeKey = 'restaurante-theme';
    this.paletteKey = 'restaurante-palette';
    this.init();
  }

  // Initialize theme manager
  init() {
    this.setupEventListeners();
    this.applySavedTheme();
    this.applySavedPalette();
    this.watchSystemTheme();
  }

  // Set up event listeners
  setupEventListeners() {
    if (this.themeSelector) {
      this.themeSelector.addEventListener('change', (e) => {
        this.setTheme(e.target.value);
      });
    }
    
    if (this.paletteSelector) {
      this.paletteSelector.addEventListener('change', (e) => {
        this.setPalette(e.target.value);
      });
    }
  }

  // Apply saved theme or use system preference
  applySavedTheme() {
    const savedTheme = localStorage.getItem(this.themeKey);
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      this.setTheme(savedTheme, false);
    } else {
      // Default to system preference if no saved theme
      this.setTheme(systemPrefersDark ? 'dark' : 'light', false);
    }
  }
  
  // Apply saved palette
  applySavedPalette() {
    const savedPalette = localStorage.getItem(this.paletteKey) || 'classic-pos';
    this.setPalette(savedPalette, false);
  }

  // Set the theme (light/dark)
  setTheme(theme, save = true) {
    // Update the selector
    if (this.themeSelector) {
      this.themeSelector.value = theme;
    }

    // Apply theme classes
    document.documentElement.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.add(systemTheme);
    } else {
      document.documentElement.classList.add(theme);
    }

    // Save to localStorage if needed
    if (save) {
      localStorage.setItem(this.themeKey, theme);
    }
  }
  
  // Set the color palette
  setPalette(palette, save = true) {
    // Remove all palette classes
    document.documentElement.classList.remove(
      'palette-classic-pos',
      'palette-glass-minimal',
      'palette-dark-pro'
    );
    
    // Add the selected palette class
    document.documentElement.classList.add(`palette-${palette}`);
    
    // Update the selector
    if (this.paletteSelector) {
      this.paletteSelector.value = palette;
    }
    
    // Save to localStorage if needed
    if (save) {
      localStorage.setItem(this.paletteKey, palette);
    }
  }

  // Watch for system theme changes
  watchSystemTheme() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      const savedTheme = localStorage.getItem(this.themeKey);
      if (savedTheme === 'system' || !savedTheme) {
        this.setTheme('system', false);
      }
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.themeManager = new ThemeManager();
});
