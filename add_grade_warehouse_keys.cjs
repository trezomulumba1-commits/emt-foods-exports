const fs = require('fs');
const path = require('path');

const additions = {
  en: {
    gradePremium: 'Premium A (Export standard)',
    gradeStandard: 'Standard B (Standard wholesale)',
    gradeChoice: 'Choice C (Economy bulk)',
    warehouseLusaka: 'Lusaka Main Depot',
    warehouseKitwe: 'Kitwe Central Warehouse',
    warehouseNdola: 'Ndola Export Depot',
    warehouseLiving: 'Livingstone Hub',
  },
  fr: {
    gradePremium: 'Premium A (Norme export)',
    gradeStandard: 'Standard B (Vente en gros standard)',
    gradeChoice: 'Choix C (Vrac économique)',
    warehouseLusaka: 'Dépôt Principal de Lusaka',
    warehouseKitwe: 'Entrepôt Central de Kitwe',
    warehouseNdola: 'Dépôt d\'Export de Ndola',
    warehouseLiving: 'Hub de Livingstone',
  },
  zh: {
    gradePremium: 'A级优质（出口标准）',
    gradeStandard: 'B级标准（标准批发）',
    gradeChoice: 'C级实惠（经济散装）',
    warehouseLusaka: '卢萨卡主仓库',
    warehouseKitwe: '基特韦中央仓库',
    warehouseNdola: '恩多拉出口仓库',
    warehouseLiving: '利文斯通中转站',
  },
  ar: {
    gradePremium: 'ممتاز A (معيار التصدير)',
    gradeStandard: 'قياسي B (بيع بالجملة)',
    gradeChoice: 'اقتصادي C (كميات كبيرة)',
    warehouseLusaka: 'مستودع لوساكا الرئيسي',
    warehouseKitwe: 'مستودع كيتوي المركزي',
    warehouseNdola: 'مستودع ندولا للتصدير',
    warehouseLiving: 'مركز ليفينغستون',
  },
  pt: {
    gradePremium: 'Premium A (Padrão de exportação)',
    gradeStandard: 'Padrão B (Atacado padrão)',
    gradeChoice: 'Econômico C (Granel econômico)',
    warehouseLusaka: 'Depósito Principal de Lusaka',
    warehouseKitwe: 'Armazém Central de Kitwe',
    warehouseNdola: 'Depósito de Exportação de Ndola',
    warehouseLiving: 'Hub de Livingstone',
  },
  de: {
    gradePremium: 'Premium A (Exportstandard)',
    gradeStandard: 'Standard B (Standard-Großhandel)',
    gradeChoice: 'Auswahl C (Günstige Großmenge)',
    warehouseLusaka: 'Hauptlager Lusaka',
    warehouseKitwe: 'Zentrallager Kitwe',
    warehouseNdola: 'Exportlager Ndola',
    warehouseLiving: 'Livingstone Hub',
  },
  sw: {
    gradePremium: 'Premium A (Kiwango cha kuuza nje)',
    gradeStandard: 'Kawaida B (Jumla ya kawaida)',
    gradeChoice: 'Uchumi C (Wingi wa bei nafuu)',
    warehouseLusaka: 'Ghala Kuu la Lusaka',
    warehouseKitwe: 'Ghala la Kati la Kitwe',
    warehouseNdola: 'Ghala la Usafirishaji Ndola',
    warehouseLiving: 'Kituo cha Livingstone',
  },
};

const dir = path.join(process.cwd(), 'src/lib/translations');

Object.entries(additions).forEach(([lang, keys]) => {
  const fullPath = path.join(dir, `${lang}.ts`);
  let content = fs.readFileSync(fullPath, 'utf8');
  
  const insertKeys = Object.entries(keys)
    .map(([k, v]) => `    ${k}: '${v.replace(/'/g, "\\'")}',`)
    .join('\n');
  
  // Insert before the closing errorSupplier line (last key in addProduct)
  content = content.replace(
    /(errorSupplier: '[^']*',\n\s+})/,
    `errorSupplier: '${content.match(/errorSupplier: '([^']*)'/)?.[1] || 'Supplier name / cooperative is required.'}',\n${insertKeys}\n  }`
  );
  
  // Clean up double errorSupplier if it happened
  const lines = content.split('\n');
  const seen = new Set();
  const deduped = lines.filter(line => {
    const key = line.trim().split(':')[0];
    if (key && line.includes("errorSupplier") && seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  
  fs.writeFileSync(fullPath, deduped.join('\n'), 'utf8');
  console.log(`Updated addProduct section: ${lang}.ts`);
});
console.log('Done!');
