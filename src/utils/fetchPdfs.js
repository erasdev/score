import { readdirSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

// Ensure the content/pdfs directory exists
const pdfsDir = join(process.cwd(), 'content', 'pdfs');
if (!existsSync(pdfsDir)) {
  mkdirSync(pdfsDir, { recursive: true });
}

// Get all PDF files
const pdfFiles = readdirSync(pdfsDir).filter(file => file.endsWith('.pdf'));

// Create index file
const indexPath = join(process.cwd(), 'public', 'pdf-index.json');
writeFileSync(indexPath, JSON.stringify(pdfFiles.map(file => ({
  title: file.replace('.pdf', ''),
  slug: file.replace('.pdf', ''),
  description: '',
  file: `/pdfs/${file}`,
  tags: [],
  genres: [],
  instruments: [],
  artists: []
})), null, 2));

console.log('PDF index file generated successfully.');
