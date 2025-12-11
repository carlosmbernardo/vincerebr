window.addEventListener('DOMContentLoaded', () => {
  const about = window.APP_CONFIG?.ABOUT || { titulo: 'Quem somos' };
  const root = document.getElementById('about-content');
  const safe = (s) => API.safe(String(s || ''));

  if (!root) return;

  // pega todos os parágrafos: paragrafo1, paragrafo2, paragrafo3...
  const rawParagraphs = Object.keys(about)
    .filter((key) => key.startsWith('paragrafo'))
    .sort()
    .map((key) => String(about[key] || ''));

  // Sem dados: mantém o slider, só sem H2
  if (!rawParagraphs.length) {
    root.innerHTML = `
      <div class="about-slider">
        <button type="button" class="about-nav prev" aria-label="Anterior">❮</button>
        <div class="about-slide">
          <span class="about-label"></span>
          <p class="about-text">Conteúdo em atualização.</p>
          <div class="about-indicator"></div>
        </div>
        <button type="button" class="about-nav next" aria-label="Próximo">❯</button>
      </div>
    `;
    return;
  }

  // separa "LABEL — texto"
  const slides = rawParagraphs.map((raw) => {
    const [labelPart, ...rest] = raw.split('—');
    return {
      label: safe(labelPart).trim(),
      body: safe(rest.join('—')).trim(),
    };
  });

  // estrutura básica do slider (sem H2)
  root.innerHTML = `
    <div class="about-slider">
      <button type="button" class="about-nav prev" aria-label="Anterior">❮</button>
      <div class="about-slide">
        <span class="about-label"></span>
        <p class="about-text"></p>
        <div class="about-indicator"></div>
      </div>
      <button type="button" class="about-nav next" aria-label="Próximo">❯</button>
    </div>
  `;

  const labelEl = root.querySelector('.about-label');
  const textEl = root.querySelector('.about-text');
  const indicatorEl = root.querySelector('.about-indicator');
  const prevBtn = root.querySelector('.about-nav.prev');
  const nextBtn = root.querySelector('.about-nav.next');

  let index = 0;
  const total = slides.length;

  function render() {
    const slide = slides[index];

    if (slide.label) {
      labelEl.style.display = 'block';
      labelEl.textContent = slide.label;
    } else {
      labelEl.style.display = 'none';
      labelEl.textContent = '';
    }

    textEl.textContent = slide.body || '';
    indicatorEl.textContent = `${index + 1} / ${total}`;
  }

  prevBtn.addEventListener('click', () => {
    index = (index - 1 + total) % total; // volta e loopa
    render();
  });

  nextBtn.addEventListener('click', () => {
    index = (index + 1) % total; // avança e loopa
    render();
  });

  render();
});