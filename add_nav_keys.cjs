const fs = require('fs');
const path = require('path');

const keys = {
  en: { changeLang: 'Change language', toggleTheme: 'Toggle theme' },
  fr: { changeLang: 'Changer la langue', toggleTheme: 'Changer le thème' },
  zh: { changeLang: '切换语言', toggleTheme: '切换主题' },
  ar: { changeLang: 'تغيير اللغة', toggleTheme: 'تغيير السمة' },
  pt: { changeLang: 'Mudar idioma', toggleTheme: 'Alternar tema' },
  de: { changeLang: 'Sprache wechseln', toggleTheme: 'Design umschalten' },
  sw: { changeLang: 'Badilisha lugha', toggleTheme: 'Geuza mandhari' },
};

const dir = path.join(process.cwd(), 'src/lib/translations');

Object.entries(keys).forEach(([lang, vals]) => {
  const fullPath = path.join(dir, `${lang}.ts`);
  const lines = fs.readFileSync(fullPath, 'utf8').split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    // Find the nav block's last key (home or shop) and append after it
    if (lines[i].includes('shop:') || lines[i].includes('home:')) {
      // Look ahead for the closing brace of nav block
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim() === '},') {
          // Insert before this closing brace
          lines.splice(j, 0,
            `    changeLang: '${vals.changeLang}',`,
            `    toggleTheme: '${vals.toggleTheme}',`
          );
          break;
        }
      }
      break;
    }
  }
  
  fs.writeFileSync(fullPath, lines.join('\n'), 'utf8');
  console.log(`Updated nav: ${lang}.ts`);
});
console.log('Done!');
