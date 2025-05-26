import { ref } from 'vue';
import type { Ref } from 'vue';

interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  accent: string;
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

const adjustOklchLightness = (oklch: string, amount: number): string => {
  const match = oklch.match(/oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)/);
  if (!match) return oklch;
  
  const [, l, c, h] = match;
  const newL = Math.max(0, Math.min(1, parseFloat(l) + amount));
  return `oklch(${newL.toFixed(2)} ${c} ${h})`;
};

export function useTheme() {
  const colors: Ref<ThemeColors> = ref({
    background: 'var(--color-background)',
    surface: 'var(--color-surface)',
    text: 'var(--color-text)',
    accent: 'var(--color-accent)',
  });

  const loadThemeFromConfig = async () => {
    try {
      // Add cache-busting query parameter
      const response = await fetch(`/site-config.json?t=${Date.now()}`);
      const config = await response.json();
      
      // Update CSS variables with OKLCH values
      const root = document.documentElement;
      Object.entries(config).forEach(([key, value]) => {
        if(key.startsWith('color-')) {
          const oklchValue = hexToOklch(value);
          root.style.setProperty(`--color-${key}`, oklchValue);
          
          // Generate and set accent variants if this is the accent color
          if (key === 'accent') {
            const darkAccent = adjustOklchLightness(oklchValue, -0.1);
            const lightAccent = adjustOklchLightness(oklchValue, 0.1);
            root.style.setProperty('--color-accent-dark', darkAccent);
            root.style.setProperty('--color-accent-light', lightAccent);
          }
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