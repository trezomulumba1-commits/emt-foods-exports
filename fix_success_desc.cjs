const fs = require('fs');
const path = require('path');

const fixes = {
  'ar.ts': `    successDesc: '??? ????? ??? ??????????? ????. ??? ????? ???? ??? "??? ??????".',`,
  'de.ts': `    successDesc: 'Ihre Bewerbung wurde erfolgreich eingereicht. Die Ware wurde unter "Ausstehende Überprüfung" hinzugefügt.',`,
  'fr.ts': `    successDesc: 'Votre candidature a été soumise avec succès. Pour simulation, ce produit a été ajouté sous "Vérification en attente".',`,
  'pt.ts': `    successDesc: 'Sua inscrição como parceiro de exportação foi enviada. Para fins de simulação, esta mercadoria foi adicionada ao catálogo global como "Verificação Pendente".',`,
  'sw.ts': `    successDesc: 'Ombi lako limetumwa kikamilifu. Bidhaa imeongezwa kwenye katalogi chini ya "Inasubiri Uhakiki".',`,
};

const dir = path.join(process.cwd(), 'src/lib/translations');

Object.entries(fixes).forEach(([file, fixedLine]) => {
  const fullPath = path.join(dir, file);
  const lines = fs.readFileSync(fullPath, 'utf8').split('\n');
  
  // Find and replace the successDesc line
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('successDesc:')) {
      // Check if this is a multi-line broken string — consume until we find the closing
      let endIdx = i;
      while (endIdx < lines.length && !lines[endIdx].endsWith("',") && !lines[endIdx].endsWith("\".,")) {
        endIdx++;
      }
      // Replace lines[i..endIdx] with the fixed line
      lines.splice(i, endIdx - i + 1, fixedLine);
      break;
    }
  }
  
  fs.writeFileSync(fullPath, lines.join('\n'), 'utf8');
  console.log(`Fixed: ${file}`);
});

console.log('Done!');
