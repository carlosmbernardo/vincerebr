document.addEventListener('DOMContentLoaded', () => {
    marcarAnoNoRodape();
    marcarAbaAtiva();
    prepararMenuMobile();

    initFeaturedCarousel().catch((e) =>
        console.error('Erro no carrossel:', e)
    );
});

function marcarAnoNoRodape() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function marcarAbaAtiva() {
    const page = (document.body.dataset.page || '').trim();
    document.querySelectorAll('.menu a').forEach((a) => {
        if ((a.dataset.nav || '') === page) a.classList.add('active');
    });
}

function prepararMenuMobile() {
    const btn = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        btn.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', String(open));
    });
}

/* LIMITADOR DE TEXTO*/
function limitarTextoHome(txt, max) {
    if (!txt) return "";
    txt = String(txt);
    return txt.length > max ? txt.substring(0, max) + "..." : txt;
}

/* PROJETOS EM DESTAQUE / CARROSSEL*/
async function initFeaturedCarousel() {
    const root = document.getElementById('pc-root');
    if (!root) return;

    let items = [];
    try {
        if (typeof window.apiListHighlightedProjects === 'function') {
            items = await window.apiListHighlightedProjects(3);
        } else {
            items = await buscarProjetosFallback();
            items = filtrarDestaquesOuPrimeiros(items, 3);
        }
    } catch (e) {
        console.warn('Falha ao obter projetos; usando fallback vazio.', e);
        items = [];
    }

    if (!Array.isArray(items) || !items.length) {
        root.style.display = 'none';
        return;
    }

    const elMedia = document.getElementById('pc-media');
    const elTitle = document.getElementById('pc-title');
    const elDesc = document.getElementById('pc-desc');
    const elTags = document.getElementById('pc-tags');
    const elLink = document.getElementById('pc-link');
    const prevBtn = document.getElementById('pc-prev');
    const nextBtn = document.getElementById('pc-next');
    const card = document.getElementById('pc-card');

    let idx = 0;

    function render() {
        const p = items[idx] || {};

        const img =
            p.imagemUrl ||
            p.imageUrl ||
            p.midiaUrl ||
            p.mediaUrl ||
            p.imagem ||
            p.capa ||
            p.cover ||
            p.thumb ||
            '';

        elMedia.innerHTML = '';
        elMedia.style.backgroundImage = 'none';

        if (img && isVideoUrlHome(img)) {
            const vid = document.createElement('video');
            vid.src = img;
            vid.muted = true;
            vid.playsInline = true;
            vid.preload = 'metadata';

            vid.style.width = '100%';
            vid.style.height = '100%';
            vid.style.objectFit = 'cover';
            vid.style.display = 'block';

            elMedia.appendChild(vid);
        } else {
            elMedia.style.backgroundImage = img ? `url("${img}")` : 'none';
        }

        /*LIMITA TITULO E DESCRIÇÃO*/
        elTitle.textContent = limitarTextoHome(
            p.titulo || p.title || 'Projeto',
            40
        );

        elDesc.textContent = limitarTextoHome(
            p.descricao || p.description || '',
            120
        );

        elTags.innerHTML = '';
        let tags = [];
        if (Array.isArray(p.tags)) {
            tags = p.tags;
        } else if (typeof p.tags === 'string') {
            tags = p.tags
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean);
        }

        tags.slice(0, 4).forEach((t) => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = t;
            elTags.appendChild(span);
        });

        if (p.link) {
            elLink.href = p.link;
            elLink.style.display = '';
        } else if (p.url || p.urlProjeto) {
            elLink.href = p.url || p.urlProjeto;
            elLink.style.display = '';
        } else {
            elLink.removeAttribute('href');
            elLink.style.display = 'none';
        }
    }

    function go(delta) {
        idx = (idx + delta + items.length) % items.length;
        render();
    }

    prevBtn?.addEventListener('click', () => go(-1));
    nextBtn?.addEventListener('click', () => go(+1));

    if (card) {
        card.tabIndex = 0;
        card.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                go(-1);
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                go(+1);
            }
        });
    }

    render();
}

async function buscarProjetosFallback() {
    try {
        if (window.API && typeof window.API.getProjects === 'function') {
            const list = await window.API.getProjects();
            if (Array.isArray(list)) return list;
        }
    } catch { }

    try {
        if (typeof window.fetchProjects === 'function') {
            const list = await window.fetchProjects();
            if (Array.isArray(list)) return list;
        }
    } catch { }

    try {
        const r = await fetch('/api/projects', { cache: 'no-store' });
        if (r && r.ok) {
            const list = await r.json();
            if (Array.isArray(list)) return list;
        }
    } catch { }

    try {
        const raw =
            localStorage.getItem('portfolio') ||
            localStorage.getItem('projects') ||
            '[]';
        const list = JSON.parse(raw);
        if (Array.isArray(list)) return list;
    } catch { }

    return [];
}

function filtrarDestaquesOuPrimeiros(items, limit = 3) {
    if (!Array.isArray(items)) return [];
    let destaques = items.filter(
        (p) =>
            p?.destaque === true ||
            p?.destacado === true ||
            p?.highlight === true ||
            p?.featured === true
    );

    if (!destaques.length) {
        destaques = items.slice(0, limit);
    }

    destaques.sort((a, b) => (a?.ordem ?? 999) - (b?.ordem ?? 999));

    return destaques.slice(0, limit);
}

function isVideoUrlHome(u = '') {
    return (
        u.startsWith('data:video/') ||
        /\.(mp4|webm|ogg)(\?|$)/i.test(u)
    );
}