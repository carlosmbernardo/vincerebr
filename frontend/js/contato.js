window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const ok = document.getElementById('form-ok');
  const err = document.getElementById('form-err');
  const cta = document.getElementById('cta-whatsapp');

  function addUTM(u) {
    try {
      const x = new URL(u);
      x.searchParams.set('utm_source', 'site');
      x.searchParams.set('utm_medium', 'cta');
      x.searchParams.set('utm_campaign', 'contato');
      return x.toString();
    } catch { return u; }
  }
  if (cta && window.APP_CONFIG?.WHATSAPP_LINK) {
    cta.href = addUTM(window.APP_CONFIG.WHATSAPP_LINK);
  }

  const nomeEl = form.querySelector('input[name="nome"]');
  const emailEl = form.querySelector('input[name="email"]');
  const telEl = form.querySelector('input[name="telefone"]');
  const msgEl = form.querySelector('textarea[name="mensagem"]');
  const honey = form.querySelector('input[name="empresa"]');

  const sanitizeNameLive = (s) =>
    String(s || '')
      .replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '')
      .replace(/\s{2,}/g, ' ');

  const normalizeName = (s) =>
    String(s || '')
      .replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

  const isValidName = (s) => {
    const v = normalizeName(s);
    return v.length >= 2 && /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(v);
  };

  const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(s || '').trim());
  const onlyDigits = (s) => String(s || '').replace(/[^\d]/g, '');

  const setErr = (msg) => { if (err) { err.hidden = false; if (msg) err.textContent = msg; } };
  const clearMsgs = () => { if (ok) ok.hidden = true; if (err) err.hidden = true; };

  if (nomeEl) {
    nomeEl.setAttribute('inputmode', 'text');
    nomeEl.addEventListener('input', (e) => {
      const before = e.target.value;
      const after = sanitizeNameLive(before).slice(0, 80);
      if (before !== after) e.target.value = after;
      e.target.setCustomValidity(isValidName(after) ? '' : 'Use apenas letras (mín. 2).');
    });
  }

  telEl?.addEventListener('input', (e) => {
    let v = onlyDigits(e.target.value).slice(0, 11);
    if (v.length > 10) e.target.value = v.replace(/(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    else if (v.length > 6) e.target.value = v.replace(/(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    else if (v.length > 2) e.target.value = v.replace(/(\d{2})(\d{0,5}).*/, '($1) $2');
    else e.target.value = v;
  });

  const normalizePayload = (payload) => ({
    nome: normalizeName(payload.nome || '').slice(0, 80),
    email: (payload.email || '').trim().slice(0, 120),
    telefone: (payload.telefone || '').trim().slice(0, 30),
    mensagem: (payload.mensagem || '').trim().slice(0, 1000),
    empresa: (payload.empresa || '').trim(),
  });

  function salvarLeadLocal(lead) {
    const lista = JSON.parse(localStorage.getItem('leads') || '[]');
    lista.push({
      ...lead,
      data: new Date().toISOString()
    });
    localStorage.setItem('leads', JSON.stringify(lista));
  }

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    clearMsgs();

    const raw = Object.fromEntries(new FormData(form).entries());
    const data = normalizePayload(raw);

    if (honey && data.empresa) { setErr(); return; }
    if (!isValidName(data.nome)) { setErr('O nome deve conter apenas letras (mín. 2).'); nomeEl?.focus(); return; }
    if (!isEmail(data.email)) { setErr('E-mail inválido.'); emailEl?.focus(); return; }
    if ((data.mensagem || '').length < 10) { setErr('Descreva sua necessidade (mín. 10 caracteres).'); msgEl?.focus(); return; }

    try {
      salvarLeadLocal({
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        mensagem: data.mensagem
      });

      if (ok) ok.hidden = false;
      form.reset();
    } catch {
      setErr('Não foi possível enviar. Tente novamente.');
    }
  });
});