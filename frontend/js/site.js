window.addEventListener('DOMContentLoaded', () => {
    const year = document.getElementById('year'); if (year) year.textContent = new Date().getFullYear();

    const active = document.body.dataset.page || '';
    document.querySelectorAll('.menu a[data-nav]').forEach(a => {
        if (a.dataset.nav === active) a.classList.add('active');
    });

    const cta = document.getElementById('cta-whatsapp');
    if (cta && window.APP_CONFIG?.WHATSAPP_LINK) cta.href = window.APP_CONFIG.WHATSAPP_LINK;
});