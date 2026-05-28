const fs = require('fs');
const path = require('path');

const closeTabTranslations = {
  en: 'Close tab',
  ar: 'إغلاق التبويب',
  de: 'Tab schließen',
  el: 'Κλείσιμο καρτέλας',
  es: 'Cerrar pestaña',
  fr: "Fermer l'onglet",
  he: 'סגור את הכרטיסייה',
  hi: 'टैब बंद करें',
  id: 'Tutup tab',
  it: 'Chiudi scheda',
  ja: 'タブを閉じる',
  ko: '탭 닫기',
  nl: 'Tab sluiten',
  pl: 'Zamknij kartę',
  pt_BR: 'Fechar aba',
  pt_PT: 'Fechar separador',
  ru: 'Закрыть вкладку',
  tr: 'Sekmeyi kapat',
  zh_CN: '关闭标签页',
};

const dir = __dirname;

for (const [code, closeTab] of Object.entries(closeTabTranslations)) {
  const filePath = path.join(dir, `${code}.json`);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠ skipped ${code}.json — file not found`);
    continue;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (data.closeTab) {
    console.log(`— ${code}.json already has closeTab`);
    continue;
  }

  data.closeTab = closeTab;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`✓ ${code}.json`);
}
