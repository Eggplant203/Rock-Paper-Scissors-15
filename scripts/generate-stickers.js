import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STICKERS_DIR = path.join(__dirname, '../client/public/assets/images/stickers');
const OUTPUT_FILE = path.join(__dirname, '../client/src/utils/stickers.ts');

function generateStickersConfig() {
  const categories = [];
  
  // Read all directories in stickers folder
  const dirs = fs.readdirSync(STICKERS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .sort();

  for (const dirName of dirs) {
    const dirPath = path.join(STICKERS_DIR, dirName);
    
    // Get all image files (png, jpg, jpeg, gif) in the directory
    const files = fs.readdirSync(dirPath)
      .filter(file => /\.(png|jpg|jpeg|gif)$/i.test(file))
      .sort((a, b) => {
        // Sort numerically if files are named like 1.png, 2.png, etc.
        const numA = parseInt(a.match(/^\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/^\d+/)?.[0] || '0');
        return numA - numB;
      });

    if (files.length > 0) {
      const stickers = files.map(file => 
        `/assets/images/stickers/${dirName}/${file}`
      );
      
      categories.push({
        name: dirName,
        count: files.length,
        stickers
      });
    }
  }

  // Generate TypeScript file content - remove count field from output
  const categoriesForExport = categories.map(({ name, stickers }) => ({ name, stickers }));
  
  const content = `// Auto-generated file - DO NOT EDIT MANUALLY
// Run 'npm run generate:stickers' to regenerate this file

export interface StickerCategory {
  name: string;
  stickers: string[];
}

export const STICKER_CATEGORIES: StickerCategory[] = ${JSON.stringify(categoriesForExport, null, 2)
  .replace(/"name":/g, 'name:')
  .replace(/"stickers":/g, 'stickers:')};
`;

  fs.writeFileSync(OUTPUT_FILE, content, 'utf8');
  
  console.log('✅ Stickers configuration generated successfully!');
  console.log('\nCategories found:');
  categories.forEach(cat => {
    console.log(`  - ${cat.name}: ${cat.count} stickers`);
  });
  console.log(`\nTotal: ${categories.reduce((sum, cat) => sum + cat.count, 0)} stickers across ${categories.length} categories`);
}

try {
  generateStickersConfig();
} catch (error) {
  console.error('❌ Error generating stickers config:', error);
  process.exit(1);
}
