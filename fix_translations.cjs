const fs = require('fs');
const path = require('path');

// Fix all translation .ts files: remove the stray leading comma before the injected JSON block
const dir = path.join(process.cwd(), 'src/lib/translations');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const fullPath = path.join(dir, file);
  let content = fs.readFileSync(fullPath, 'utf8');

  // The injection created:  },\n,\n  "key": {
  // We need:               },\n  key: {
  // Also convert "key": "value" JSON style inside injected blocks to TS style key: 'value'
  
  // Step 1: Remove the stray comma line (a line that is just ',')
  content = content.replace(/\n,\n/g, '\n');

  // Step 2: Convert JSON-style "key": "value" to TS-style key: 'value'
  // Only replace lines that look like "  \"key\": \"value\","
  content = content.replace(/"([a-zA-Z_][a-zA-Z0-9_]*)": ("([^"]*)")/g, (match, key, jsonVal, strVal) => {
    // escape single quotes in value
    const safe = strVal.replace(/'/g, "\\'");
    return `${key}: '${safe}'`;
  });

  // Step 3: Convert JSON-style "key": { to key: {
  content = content.replace(/"([a-zA-Z_][a-zA-Z0-9_]*)": \{/g, '$1: {');

  // Step 4: Remove trailing commas on last items in blocks (before closing })
  // This is already handled by how we injected, so just a sanity check
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Fixed: ${file}`);
});

console.log('All translation files cleaned!');
