const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'src/lib/translations');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const fullPath = path.join(dir, file);
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // The problem line pattern across all files:
  // successDesc: '...\\'...\\"."
  // The original JSON was: "...under \"Pending Verification\"."
  // The regex converter turned it into: '...under \'Pending Verification\"."
  // We need to find this broken pattern and fix it
  
  // Find lines with successDesc that end in a broken way (\'".", or \'.","  etc.)
  content = content.replace(
    /successDesc: '(.*?)(?:\\'([^']*?)\\"\."|\\'\\"\."|'\\\"\.?")/gs,
    (match, part1, quotedPart) => {
      // rebuild cleanly
      const cleanPart = quotedPart || '';
      return `successDesc: '${part1}"${cleanPart}".',`;
    }
  );

  // Simpler approach: just find the specific bad ending patterns
  // Pattern: ends with \\'Something\\"." or similar
  content = content.replace(/\\'(\w[^']*?)\\"\.",/g, '"$1".');
  content = content.replace(/\\"\.",/g, '".',);
  
  // Also handle the double quote artifact at end of line
  content = content.replace(/'"',/g, "',");
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Processed: ${file}`);
});
console.log('Done!');
