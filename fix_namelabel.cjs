const fs = require('fs');
const path = require('path');

// Each language's nameLabel value
const nameLabels = {
  'ar.ts': `    nameLabel: '???? ??????? *',`,
  'de.ts': `    nameLabel: 'Produktname *',`,
  'fr.ts': `    nameLabel: 'Nom du Produit *',`,
  'pt.ts': `    nameLabel: 'Nome do Produto *',`,
  'sw.ts': `    nameLabel: 'Jina la Bidhaa *',`,
};

const dir = path.join(process.cwd(), 'src/lib/translations');

Object.entries(nameLabels).forEach(([file, nameLabel]) => {
  const fullPath = path.join(dir, file);
  const lines = fs.readFileSync(fullPath, 'utf8').split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    // Find the line with namePlaceholder and insert nameLabel before it
    if (lines[i].includes('namePlaceholder:') && !lines[i - 1]?.includes('nameLabel:')) {
      lines.splice(i, 0, nameLabel);
      break;
    }
  }
  
  fs.writeFileSync(fullPath, lines.join('\n'), 'utf8');
  console.log(`Fixed nameLabel: ${file}`);
});
console.log('Done!');
