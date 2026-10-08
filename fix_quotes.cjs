const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'src/lib/translations');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const fullPath = path.join(dir, file);
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Fix the specific broken successDesc pattern:
  // The original JSON had: "successDesc": "...under \"Pending Verification\"."
  // After conversion this becomes: successDesc: '...under \'Pending Verification\"."
  // We want: successDesc: '...under "Pending Verification".',
  content = content.replace(
    /successDesc: '(.*?)\\\'Pending Verification\\"\."\,/gs,
    (match, before) => `successDesc: '${before}"Pending Verification".',`
  );
  
  // More general fix: find any line with mixed quote closing like \'" or "\' at end
  content = content.replace(/\\'Pending Verification\\"\."/g, '"Pending Verification"');
  
  // Clean up any trailing ." that shouldn't be there (artifact from JSON escape conversion)
  content = content.replace(/\\'\.",/g, "',");
  content = content.replace(/\\",/g, '",');
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Processed: ${file}`);
});
console.log('Done!');
