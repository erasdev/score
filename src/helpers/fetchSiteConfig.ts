
export interface SiteConfig {
  title: string;
  description: string;
  background: string;  // Main background color
  surface: string;     // Background color for tables, cards, etc.
  text: string;        // Main text color
  accent: string;      // Accent color for interactive elements
} 

export default async function fetchSiteConfig() {

    try {
        const configRes = await fetch('/site-config.json');
        return await configRes.json();

      } catch (error) {
        console.error('Failed to load site configuration:', error);
      }


}

