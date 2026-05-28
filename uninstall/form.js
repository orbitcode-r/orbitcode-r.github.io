(() => {
  const WEBHOOK_URL =
    'https://script.google.com/macros/s/AKfycbyT7KmkpsFYIOKbpmFsfOiULqsI0el4AN54381U4DqLonQCkGI2_qle87bAVjE4Hc1S/exec';

  const SUPPORTED = [
    'en', 'ar', 'de', 'el', 'es', 'fr', 'he', 'hi', 'id', 'it',
    'ja', 'ko', 'nl', 'pl', 'pt_BR', 'pt_PT', 'ru', 'tr', 'zh_CN',
  ];
  const RTL = ['ar', 'he'];

  const REASON_KEYS = [
    'whatsapp_update',
    'performance',
    'not_working',
    'too_complex',
    'no_whatsapp',
    'better_solution',
    'just_testing',
    'other',
  ];

  // --- Resolve language from ?lang= param ---
  const params = new URLSearchParams(location.search);
  const rawLang = (params.get('lang') || '').replace('-', '_');
  const lang = SUPPORTED.includes(rawLang) ? rawLang : 'en';
  const version = params.get('v') || '';

  // Apply direction immediately to avoid layout flash
  document.documentElement.lang = lang.replace('_', '-');
  document.documentElement.dir = RTL.includes(lang) ? 'rtl' : 'ltr';

  // --- DOM refs ---
  const headlineEl        = document.getElementById('headline');
  const subheadingEl      = document.getElementById('subheading');
  const reasonsList       = document.getElementById('reasons-list');
  const textarea          = document.getElementById('detail-textarea');
  const submitBtn         = document.getElementById('submit-btn');
  const formSection       = document.getElementById('form-section');
  const thankyouEl        = document.getElementById('thankyou');
  const thankyouHeadlineEl = document.getElementById('thankyou-headline');
  const thankyouSubEl      = document.getElementById('thankyou-sub');

  // Form is hidden in CSS by default — show the right state immediately, no flash
  if (sessionStorage.getItem('submitted')) {
    thankyouEl.classList.add('visible');
  } else {
    formSection.classList.add('visible');
  }

  let selectedReason = null;

  // --- Render form with translations ---
  function render(t) {
    headlineEl.textContent          = t.headline;
    subheadingEl.textContent        = t.subheading;
    submitBtn.textContent           = t.submit;
    textarea.placeholder            = t.otherPlaceholder;
    thankyouHeadlineEl.textContent  = t.thankYou;
    thankyouSubEl.textContent       = t.thankYouSub;

    reasonsList.innerHTML = '';

    REASON_KEYS.forEach((key) => {
      const li    = document.createElement('li');
      const label = document.createElement('label');
      const input = document.createElement('input');

      input.type  = 'radio';
      input.name  = 'reason';
      input.value = key;

      label.className = 'reason-label';
      label.appendChild(input);
      label.appendChild(document.createTextNode(t.reasons[key]));
      li.appendChild(label);
      reasonsList.appendChild(li);

      input.addEventListener('change', () => {
        document.querySelectorAll('.reason-label').forEach(l => l.classList.remove('selected'));
        label.classList.add('selected');
        selectedReason = key;
        submitBtn.disabled = false;
        li.appendChild(textarea);
        textarea.classList.add('visible');
        setTimeout(() => textarea.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
      });
    });
  }

  // --- Submit ---
  function handleSubmit() {
    if (!selectedReason) return;

    submitBtn.disabled = true;

    const payload = { reason: selectedReason, locale: lang, version };
    const otherText = textarea.value.trim().slice(0, 300);
    if (otherText) {
      payload.other_text = otherText;
    }

    // Show thank-you instantly — fire and forget the request
    sessionStorage.setItem('submitted', '1');
    formSection.classList.remove('visible');
    thankyouEl.classList.add('visible');

    fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'text/plain' },
    }).catch(() => {});
  }

  submitBtn.addEventListener('click', handleSubmit);

  // --- Load translations and init ---
  fetch(`i18n/${lang}.json`)
    .then(r => r.ok ? r.json() : fetch('i18n/en.json').then(r => r.json()))
    .catch(() => fetch('i18n/en.json').then(r => r.json()))
    .then(render);
})();
