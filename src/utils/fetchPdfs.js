
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.resolve('content/pdfs');
const outputPath = path.resolve('public/pdf-index.json');

const files = fs.readdirSync(contentDir);
const index = [];

for (const file of files) {
  if (!file.endsWith('.md')) continue;

  const raw = fs.readFileSync(path.join(contentDir, file), 'utf8');
  const { data } = matter(raw);

  index.push({
    slug: file.replace(/\.md$/, ''),
    title: data.title,
    description: data.description,
    tags: data.tags || [],
    file: data.file, // relative to /public
  });
}

fs.writeFileSync(outputPath, JSON.stringify(index, null, 2));
console.log(`✅ PDF index generated: ${outputPath}`);
