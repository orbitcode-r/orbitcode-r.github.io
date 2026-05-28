// Updates otherPlaceholder in all locale files to the new generic "Any details? (optional)" text.
// Run: node uninstall/i18n/update-placeholder.js

const fs = require('fs');
const path = require('path');

const TRANSLATIONS = {
    en:    'Any details? (optional)',
    ar:    'أي تفاصيل؟ (اختياري)',
    de:    'Weitere Details? (optional)',
    el:    'Τυχόν λεπτομέρειες; (προαιρετικό)',
    es:    '¿Algún detalle? (opcional)',
    fr:    'Des détails ? (facultatif)',
    he:    'פרטים נוספים? (אופציונלי)',
    hi:    'कोई विवरण? (वैकल्पिक)',
    id:    'Ada detail? (opsional)',
    it:    'Dettagli? (opzionale)',
    ja:    '詳細はありますか？（任意）',
    ko:    '추가 내용이 있나요? (선택)',
    nl:    'Meer details? (optioneel)',
    pl:    'Jakieś szczegóły? (opcjonalne)',
    pt_BR: 'Algum detalhe? (opcional)',
    pt_PT: 'Algum detalhe? (opcional)',
    ru:    'Есть подробности? (необязательно)',
    tr:    'Ayrıntı var mı? (isteğe bağlı)',
    zh_CN: '有什么细节吗？（可选）',
};

const dir = __dirname;

for (const [locale, text] of Object.entries(TRANSLATIONS)) {
    const filePath = path.join(dir, `${locale}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.otherPlaceholder = text;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`✓ ${locale}`);
}

console.log('\nDone — otherPlaceholder updated in all locales.');
