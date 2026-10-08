const fs = require('fs');
let c = fs.readFileSync('inject_remaining_i18n.cjs', 'utf-8');
c = c.replace(/\\'/g, "'");
fs.writeFileSync('inject_remaining_i18n.cjs', c, 'utf-8');
