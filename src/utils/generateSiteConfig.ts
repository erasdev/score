import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import type { SiteConfig } from '../types/site';

const defaultConfig: SiteConfig = {
  title: "Ricky Bob Dog's Collection",
  description: "A collection of musical scores and arrangements.",
  colors: {
    background: '#ffffff',  // White
    surface: '#ffffff',     // White
    text: '#1f2937',        // Gray-800
    accent: '#4f46e5',      // Indigo-600
  },
  _lastModified: new Date().toISOString()
};

// Ensure the public directory exists
const publicDir = join(process.cwd(), 'public');
if (!existsSync(publicDir)) {
  mkdirSync(publicDir, { recursive: true });
}

// Write the site configuration to a file
const configPath = join(publicDir, 'site-config.json');
writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));

console.log('Site configuration file generated successfully.'); 