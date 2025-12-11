window.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('services-grid');
    const empty = document.getElementById('services-empty');

    const ICON = {
        marca: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M7 12h10M12 7v10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
        estrategia: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 20l4-4m0 0l-4-4m4 4h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="8" r="3" stroke="currentColor" stroke-width="2"/></svg>`,
        audiovisual: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="14" height="10" rx="2" stroke="currentColor" stroke-width="2"/><path d="M17 9l4-2v10l-4-2V9z" stroke="currentColor" stroke-width="2"/></svg>`,
        analise: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 3v18h18" stroke="currentColor" stroke-width="2"/><path d="M7 15l3-3 3 2 4-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        branding: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3l3 6 6 .9-4.5 4.2 1 6-5.5-3-5.5 3 1-6L3 9.9 9 9l3-6z" stroke="currentColor" stroke-width="2" fill="none"/></svg>`,
        captacao: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/><path d="M4 12a8 8 0 0016 0 8 8 0 00-16 0z" stroke="currentColor" stroke-width="2"/></svg>`
    };

    const SEED = [
        {
            titulo: 'Gestão de Marcas',
            descricao: 'Cuidamos da identidade e reputação da sua marca para fortalecer sua presença no mercado.',
            icone: 'marca'
        },
        {
            titulo: 'Estratégia Digital',
            descricao: 'Planejamos ações focadas em resultados para posicionar sua marca onde ela deve estar.',
            icone: 'estrategia'
        },
        {
            titulo: 'Produção Audiovisual',
            descricao: 'Vídeos e conteúdos dinâmicos para contar histórias que conectam seu público.',
            icone: 'audiovisual'
        },
        {
            titulo: 'Análise de Resultados',
            descricao: 'Monitoramos e ajustamos campanhas para garantir desempenho e ROI.',
            icone: 'analise'
        },
        {
            titulo: 'Branding',
            descricao: 'Construímos e consolidamos a personalidade da sua marca.',
            icone: 'branding'
        },
        {
            titulo: 'Captação Visual',
            descricao: 'Imagens que traduzem a essência da sua marca com qualidade e impacto.',
            icone: 'captacao'
        }
    ];

    async function fetchFromAPI() {
        try {
            const itens = await API.services();
            return (itens || []).map(s => ({
                titulo: s.titulo,
                descricao: s.descricao,
                icone: 'branding'
            }));
        } catch {
            return null;
        }
    }

    function renderCard({ titulo, descricao, icone }) {
        const icon = ICON[icone] || ICON.branding;
        return `
      <article class="card service-card">
        <div class="icon-bubble">${icon}</div>
        <h3>${titulo}</h3>
        <p>${descricao}</p>
      </article>
    `;
    }

    const apiData = await fetchFromAPI();
    const data = (apiData && apiData.length) ? apiData : SEED;

    if (!data.length) {
        empty.hidden = false;
        return;
    }

    grid.innerHTML = data.map(renderCard).join('');
});