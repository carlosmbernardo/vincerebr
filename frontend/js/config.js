window.APP_CONFIG = {
  API_URL:
    window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3001/api'
      : 'https://vincere-backend.onrender.com/api',

  API_BASE:
    window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3001/api'
      : 'https://vincere-backend.onrender.com/api',

  WHATSAPP_LINK: (function () {
    const phone = '5547991396387';
    const msg = 'Olá, vim pelo site e gostaria de mais informações!';
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  })(),

  ABOUT: {
    titulo: "Quem somos",

    paragrafo1:
      "QUEM SOMOS — Somos especialistas em presença digital para pessoas físicas e empresas. Unimos design, branding e estratégia para fortalecer marcas e transformar visibilidade em resultados reais, desenvolvendo comunicações profissionais alinhadas ao posicionamento e aos objetivos de cada cliente.",

    paragrafo2:
      "MISSÃO — Entregar presença digital de alto impacto por meio de design estratégico, identidade visual poderosa e comunicação que conecta. Nosso compromisso é transformar criatividade em resultado, elevando negócios com soluções visuais consistentes e memoráveis.",

    paragrafo3:
      "VISÃO — Ser referência em branding e comunicação visual para profissionais e empresas que buscam autenticidade, profissionalismo e posicionamento sólido. Queremos construir marcas que inspirem confiança, transmitam credibilidade e permaneçam na memória do público.",

    paragrafo4:
      "VALORES — Olhar único em cada projeto, originalidade em cada criação, excelência técnica como base de nossas entregas e foco em impacto real. Agimos com transparência, respeito ao cliente e criatividade responsável — sempre unindo estética, estratégia e performance."
  }
};