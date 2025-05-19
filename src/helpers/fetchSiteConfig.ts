import deepEqual from './deepEqual';

export interface SiteConfig {
  title: string;
  description: string;
  background: string;  // Main background color
  surface: string;     // Background color for tables, cards, etc.
  text: string;        // Main text color
  accent: string;      // Accent color for interactive elements
} 

export default async function fetchSiteConfig() {
  let siteConfig
    try {
        const configRes = await fetch('/site-config.json');
        const configData = await configRes.json();
        const localConfig = loadLocalConfig();
        
        if (localConfig && !deepEqual(localConfig, configData)) {
          siteConfig = localConfig;
        } else {
          siteConfig = configData;
          // Remove local config if it's identical to hosted
          localStorage.removeItem('draft:site-config');
        }

        return siteConfig;
      } catch (error) {
        console.error('Failed to load site configuration:', error);
      }


}



function loadLocalConfig(): SiteConfig | null {
  const localConfig = localStorage.getItem('draft:site-config');
  if (localConfig) {
    try {
      return JSON.parse(localConfig);
    } catch {
      return null;
    }
  }
  return null;
}