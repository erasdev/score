import { ref } from 'vue';
import type { Ref } from 'vue';

interface ThemeColors {
  'color-background': string;
  'color-surface-light': string;
  'color-surface-dark': string;
  'color-text-light': string;
  'color-text-dark': string;
  'color-accent-light': string;
  'color-accent-dark': string;
}

const hexToOklch = (hex: unknown): string => {
  // Handle non-string values
  if (typeof hex !== 'string') {
    console.warn('Expected string for color value, got:', typeof hex);
    return 'oklch(0.5 0 0)'; // Return a neutral gray as fallback
  }

  // If it's already in OKLCH format, return as is
  if (hex.startsWith('oklch')) return hex;
  
  // Validate hex format
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
    console.warn('Invalid hex color format:', hex);
    return 'oklch(0.5 0 0)'; // Return a neutral gray as fallback
  }
  
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  
  // Convert RGB to OKLCH (simplified conversion)
  const l = (r + g + b) / 3;
  const c = Math.sqrt(Math.pow(r - g, 2) + Math.pow(g - b, 2) + Math.pow(b - r, 2)) / 2;
  const h = Math.atan2(g - b, r - g) * (180 / Math.PI);
  
  return `oklch(${l.toFixed(2)} ${c.toFixed(2)} ${h.toFixed(2)})`;
};


export function useTheme() {
  const colors: Ref<ThemeColors> = ref({
    'color-background': 'var(--color-background)',
    'color-surface-light': 'var(--color-surface-light)',
    'color-surface-dark': 'var(--color-surface-dark)',
    'color-text-light': 'var(--color-text-light)',
    'color-text-dark': 'var(--color-text-dark)',
    'color-accent-light': 'var(--color-accent-light)',
    'color-accent-dark': 'var(--color-accent-dark)',
  });

  const loadThemeFromConfig = async () => {
    try {
      const response = await fetch(`/site-config.json`);
      const config = await response.json();
      
      // Update CSS variables with OKLCH values
      const root = document.documentElement;
      Object.entries(config).forEach(([key, value]) => {
        if(key.startsWith('color-')) {
          const oklchValue = hexToOklch(value);
          root.style.setProperty(`--${key}`, oklchValue);
        }
      });
    } catch (error) {
      console.error('Error loading theme from config:', error);
    }
  };

  // Always load theme on initialization
  loadThemeFromConfig();

  return {
    colors,
    loadThemeFromConfig,
  };
} 