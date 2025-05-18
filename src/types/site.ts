export interface SiteConfig {
  title: string;
  description: string;
  colors: {
    background: string;  // Main background color
    surface: string;     // Background color for tables, cards, etc.
    text: string;        // Main text color
    accent: string;      // Accent color for interactive elements
  };
  _lastModified?: string;
} 