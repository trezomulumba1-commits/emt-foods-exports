const fs = require('fs');
const path = require('path');

// Keys to add to the `contact` section in all language files
const contactAdditions = {
  en: { city: 'Lusaka, Zambia', messageSent: 'Message Sent', getBackSoon: 'We will get back to you shortly.', sendAnother: 'Send another message' },
  fr: { city: 'Lusaka, Zambie', messageSent: 'Message Envoyé', getBackSoon: 'Nous vous répondrons dans les plus brefs délais.', sendAnother: 'Envoyer un autre message' },
  zh: { city: '赞比亚，卢萨卡', messageSent: '消息已发送', getBackSoon: '我们将尽快回复您。', sendAnother: '再发一条消息' },
  ar: { city: 'لوساكا، زامبيا', messageSent: 'تم إرسال الرسالة', getBackSoon: 'سنتواصل معك قريباً.', sendAnother: 'إرسال رسالة أخرى' },
  pt: { city: 'Lusaka, Zâmbia', messageSent: 'Mensagem Enviada', getBackSoon: 'Entraremos em contato em breve.', sendAnother: 'Enviar outra mensagem' },
  de: { city: 'Lusaka, Sambia', messageSent: 'Nachricht gesendet', getBackSoon: 'Wir melden uns in Kürze bei Ihnen.', sendAnother: 'Weitere Nachricht senden' },
  sw: { city: 'Lusaka, Zambia', messageSent: 'Ujumbe Umetumwa', getBackSoon: 'Tutawasiliana nawe hivi karibuni.', sendAnother: 'Tuma ujumbe mwingine' },
};

const dir = path.join(process.cwd(), 'src/lib/translations');

Object.entries(contactAdditions).forEach(([lang, keys]) => {
  const fullPath = path.join(dir, `${lang}.ts`);
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Find the contact block closing brace and insert before it
  // The contact block ends with:  active: '...',\n  },
  const insertKeys = Object.entries(keys)
    .map(([k, v]) => `    ${k}: '${v.replace(/'/g, "\\'")}',`)
    .join('\n');
  
  // Find the active key inside contact (last known key) and add after it
  content = content.replace(
    /(\s+active: '[^']*',\n\s+},)/,
    `\n${insertKeys}\n  },`
  );
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Updated contact section: ${lang}.ts`);
});

console.log('Done!');
