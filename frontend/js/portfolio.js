window.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('projects-grid');
    const empty = document.getElementById('projects-empty');
    const filters = document.getElementById('proj-filters');

    const norm = (s) => (window.API?.safe ? API.safe(String(s || '')) : String(s || ''));
    const mk = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };

    function limitarTexto(txt, max) {
        if (!txt) return "";
        txt = String(txt);
        return txt.length > max ? txt.substring(0, max) + "..." : txt;
    }

    const skeletons = [];
    const drawSkeletons = (n = 6) => {
        for (let i = 0; i < n; i++) {
            const el = mk(`
        <div class="card">
          <div class="card-img skel"></div>
          <div class="p-2">
            <div class="skel-line w80"></div>
            <div class="skel-line w60"></div>
          </div>
        </div>
      `);
            grid.appendChild(el);
            skeletons.push(el);
        }
    };
    const clearSkeletons = () => skeletons.splice(0).forEach(el => el.remove());

    const activeSet = new Set();

    const drawFilters = (tags = []) => {
        filters.innerHTML = '';
        if (!tags.length) return;
        const unique = [...new Set(tags)].sort();

        unique.forEach((t) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'chip';
            btn.dataset.tag = t;
            btn.textContent = `#${norm(t)}`;
            btn.classList.toggle('is-active', activeSet.has(t));
            btn.setAttribute('aria-pressed', String(activeSet.has(t)));

            btn.addEventListener('click', () => {
                if (activeSet.has(t)) activeSet.delete(t); else activeSet.add(t);
                btn.classList.toggle('is-active', activeSet.has(t));
                btn.setAttribute('aria-pressed', String(activeSet.has(t)));
                render();
            });

            filters.appendChild(btn);
        });
    };

    const isVideoUrl = (u = '') =>
        u.startsWith('data:video/') || /\.(mp4|webm|ogg)(\?|$)/i.test(u);

    const render = () => {
        grid.innerHTML = '';
        let items = data;

        if (activeSet.size) {
            items = data.filter(p => (p.tags || []).some(t => activeSet.has(t)));
        }

        if (!items.length) {
            empty.hidden = false;
            return;
        }
        empty.hidden = true;

        items.forEach(p => {
            const a = document.createElement('a');
            a.className = 'card portfolio-card';
            a.href = p.link || '#';
            a.target = p.link ? '_blank' : '_self';
            a.rel = p.link ? 'noopener' : '';

            if (p.imagemUrl && isVideoUrl(p.imagemUrl)) {
                const wrap = mk(`<div class="card-img"></div>`);
                const vid = document.createElement('video');
                vid.src = p.imagemUrl;
                vid.muted = true;
                vid.playsInline = true;
                vid.preload = "metadata";
                vid.style.width = "100%";
                vid.style.height = "100%";
                vid.style.objectFit = "cover";
                vid.style.display = "block";
                vid.controls = false;
                wrap.appendChild(vid);
                a.appendChild(wrap);
            } else {
                const img = document.createElement('div');
                img.className = 'card-img';
                if (p.imagemUrl) img.style.backgroundImage = `url(${norm(p.imagemUrl)})`;
                a.appendChild(img);
            }

            const tags = (p.tags || []).map(t => `<span class="tag">#${norm(t)}</span>`).join('');

            const box = mk(`
        <div>
          <h3>${limitarTexto(norm(p.titulo || 'Projeto'), 40)}</h3>
          <p>${limitarTexto(norm(p.descricao || ''), 120)}</p>
          <div class="tags">${tags}</div>
        </div>
      `);

            a.appendChild(box);
            grid.appendChild(a);
        });
    };

    drawSkeletons(6);

    let data = [];
    try {
        data = await API.projects();
    } catch (e) {
        console.warn('Falha ao carregar projetos:', e);
    }

    clearSkeletons();

    if (!data || !data.length) {
        empty.hidden = true;
        data = Array.from({ length: 6 }).map((_, i) => ({
            titulo: `Projeto ${i + 1}`,
            descricao: '',
            imagemUrl: '',
            link: ''
        }));
    }

    drawFilters(data.flatMap(p => Array.isArray(p.tags) ? p.tags : []));
    render();
});