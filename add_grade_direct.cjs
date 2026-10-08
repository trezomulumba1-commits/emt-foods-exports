const fs = require('fs');
const path = require('path');

const additions = {
  fr: `    gradePremium: 'Premium A (Norme export)',\n    gradeStandard: 'Standard B (Vente en gros standard)',\n    gradeChoice: 'Choix C (Vrac économique)',\n    warehouseLusaka: 'Dépôt Principal de Lusaka',\n    warehouseKitwe: 'Entrepôt Central de Kitwe',\n    warehouseNdola: "Dépôt d'Export de Ndola",\n    warehouseLiving: 'Hub de Livingstone',`,
  zh: `    gradePremium: 'A级优质（出口标准）',\n    gradeStandard: 'B级标准（标准批发）',\n    gradeChoice: 'C级实惠（经济散装）',\n    warehouseLusaka: '卢萨卡主仓库',\n    warehouseKitwe: '基特韦中央仓库',\n    warehouseNdola: '恩多拉出口仓库',\n    warehouseLiving: '利文斯通中转站',`,
  ar: `    gradePremium: 'ممتاز A (معيار التصدير)',\n    gradeStandard: 'قياسي B (بيع بالجملة)',\n    gradeChoice: 'اقتصادي C (كميات كبيرة)',\n    warehouseLusaka: 'مستودع لوساكا الرئيسي',\n    warehouseKitwe: 'مستودع كيتوي المركزي',\n    warehouseNdola: 'مستودع ندولا للتصدير',\n    warehouseLiving: 'مركز ليفينغستون',`,
  pt: `    gradePremium: 'Premium A (Padrão de exportação)',\n    gradeStandard: 'Padrão B (Atacado padrão)',\n    gradeChoice: 'Econômico C (Granel econômico)',\n    warehouseLusaka: 'Depósito Principal de Lusaka',\n    warehouseKitwe: 'Armazém Central de Kitwe',\n    warehouseNdola: 'Depósito de Exportação de Ndola',\n    warehouseLiving: 'Hub de Livingstone',`,
  de: `    gradePremium: 'Premium A (Exportstandard)',\n    gradeStandard: 'Standard B (Standard-Großhandel)',\n    gradeChoice: 'Auswahl C (Günstige Großmenge)',\n    warehouseLusaka: 'Hauptlager Lusaka',\n    warehouseKitwe: 'Zentrallager Kitwe',\n    warehouseNdola: 'Exportlager Ndola',\n    warehouseLiving: 'Livingstone Hub',`,
  sw: `    gradePremium: 'Premium A (Kiwango cha kuuza nje)',\n    gradeStandard: 'Kawaida B (Jumla ya kawaida)',\n    gradeChoice: 'Uchumi C (Wingi wa bei nafuu)',\n    warehouseLusaka: 'Ghala Kuu la Lusaka',\n    warehouseKitwe: 'Ghala la Kati la Kitwe',\n    warehouseNdola: 'Ghala la Usafirishaji Ndola',\n    warehouseLiving: 'Kituo cha Livingstone',`,
};

const dir = path.join(process.cwd(), 'src/lib/translations');

Object.entries(additions).forEach(([lang, newKeys]) => {
  const fullPath = path.join(dir, `${lang}.ts`);
  const lines = fs.readFileSync(fullPath, 'utf8').split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('errorSupplier:')) {
      // Ensure the line ends with a comma
      lines[i] = lines[i].replace(/,?\s*$/, ',');
      // Insert new keys after this line
      lines.splice(i + 1, 0, newKeys);
      break;
    }
  }
  
  fs.writeFileSync(fullPath, lines.join('\n'), 'utf8');
  console.log(`Done: ${lang}.ts`);
});
