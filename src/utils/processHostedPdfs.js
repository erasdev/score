import { readdirSync, writeFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

// Ensure the content/pdfs directory exists
const pdfsDir = join(process.cwd(), 'content', 'pdfs');
if (!existsSync(pdfsDir)) {
  mkdirSync(pdfsDir, { recursive: true });
}

// Get all Markdown files and their frontmatter
const pdfFiles = readdirSync(pdfsDir)
  .filter(file => file.endsWith('.md'))
  .map(file => {
    const markdownPath = join(pdfsDir, file);
    const content = readFileSync(markdownPath, 'utf-8');
    const { data: frontmatter } = matter(content);
    
    // Extract slug from filename
    const slug = file.replace('.md', '');
    
    // Ensure file path starts with /uploads/ if it's a relative path
    const pdfPath = frontmatter.file || `/uploads/${slug}.pdf`;
    const normalizedFilePath = pdfPath.startsWith('/') ? pdfPath : `/uploads/${pdfPath}`;
    
    return {
      title: frontmatter.title || slug,
      slug: frontmatter.slug || slug,
      description: frontmatter.description || '',
      file: normalizedFilePath,
      tags: frontmatter.tags || [],
      genres: frontmatter.genres || [],
      instruments: frontmatter.instruments || [],
      artists: frontmatter.artists || []
    };
  });

// Create index file
const indexPath = join(process.cwd(), 'public', 'pdf-index.json');
writeFileSync(indexPath, JSON.stringify(pdfFiles, null, 2));

console.log('PDF index file generated successfully.');
