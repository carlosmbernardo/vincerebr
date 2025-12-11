(() => {
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  const RENDER_API = "https://vincere-backend.onrender.com/api";

  const CFG = window.APP_CONFIG || {
    API_URL: isLocalhost
      ? "http://localhost:3001/api"
      : RENDER_API,
    WHATSAPP_LINK: "#"
  };

  const API_BASE = (CFG.API_URL || "").replace(/\/$/, "");
  const safe = (s) => String(s ?? "").replace(/[<>]/g, "");

  async function get(path) {
    const res = await fetch(API_BASE + path, {
      headers: { Accept: "application/json" }
    });

    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.json();
  }

  async function post(path, body) {
    const res = await fetch(API_BASE + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.json();
  }

  const apiObj = {
    cfg: CFG,
    safe,

    services: () => get("/services"),
    getServices: () => get("/services"),

    projects: () => get("/projects"),
    getProjects: () => get("/projects"),

    testimonials: () => get("/testimonials"),
    getTestimonials: () => get("/testimonials"),

    lead: (payload) => post("/leads", payload)
  };

  window.API = apiObj;
})();

async function apiListProjectsRaw() {
  if (window.API && typeof window.API.projects === "function") {
    try {
      const list = await window.API.projects();
      if (Array.isArray(list)) return list;
    } catch (e) {
      console.warn(
        "Erro ao buscar projetos via API /projects, caindo para fallback.",
        e
      );
    }
  }

  const base =
    (window.CONFIG &&
      (window.CONFIG.API_BASE_URL || window.CONFIG.API_URL)) ||
    null;

  if (base) {
    try {
      const url = `${base.replace(/\/$/, "")}/projects`;
      const res = await fetch(url);
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list)) return list;
      }
    } catch (e) {
      console.warn("Fallback via CONFIG falhou, tentando localStorage.", e);
    }
  }

  try {
    const raw =
      localStorage.getItem("portfolio") ||
      localStorage.getItem("projects") ||
      "[]";
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function normalizarTagsProjeto(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

async function apiListHighlightedProjects(limit = 3) {
  const itens = await apiListProjectsRaw();

  let destaques = itens.filter(
    (p) =>
      p?.destaque === true ||
      p?.destacado === true ||
      p?.highlight === true ||
      p?.featured === true
  );

  if (!destaques.length) {
    destaques = itens.slice(0, limit);
  }

  destaques.sort((a, b) => (a?.ordem ?? 999) - (b?.ordem ?? 999));

  return destaques.slice(0, limit).map((p) => ({
    ...p,
    tags: normalizarTagsProjeto(p.tags)
  }));
}

window.apiListHighlightedProjects = apiListHighlightedProjects;