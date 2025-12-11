const API_BASE = (window.APP_CONFIG?.API_URL || "").replace(/\/$/, "");
const API = `${API_BASE}/projects`;

const $form = document.querySelector("#formProjeto");
const $grid = document.querySelector("#listaProjetos");
const $titulo = document.getElementById("titulo");
const $descricao = document.getElementById("descricao");
const $imagemUrl = document.getElementById("imagemUrl");
const $link = document.getElementById("link");
const $tags = document.getElementById("tags");
const $destaque = document.getElementById("destaque");
const $ordem = document.getElementById("ordem");
const $mediaFile = document.getElementById("mediaFile");
const $mediaPreview = document.getElementById("mediaPreview");

const $leadsBox = document.getElementById("listaLeads");

const isVideoUrl = (u = "") =>
  u.startsWith("data:video/") || /\.(mp4|webm|ogg)(\?|$)/i.test(u);


function removerLead(index) {
  const leads = JSON.parse(localStorage.getItem("leads") || "[]");
  leads.splice(index, 1);
  localStorage.setItem("leads", JSON.stringify(leads));
  carregarLeads();
}

function carregarLeads() {
  const leads = JSON.parse(localStorage.getItem('leads') || '[]');
  if (!$leadsBox) return;

  if (!leads.length) {
    $leadsBox.innerHTML = "<p>Nenhum formulário recebido ainda.</p>";
    return;
  }

  $leadsBox.innerHTML = "";

  leads.forEach((l, i) => {
    const item = document.createElement("div");
    item.className = "lead-item";

    item.innerHTML = `
      <div class="card" style="padding:15px;margin-bottom:15px; position:relative;">
        <h3>${l.nome}</h3>
        <p><strong>Email:</strong> ${l.email}</p>
        <p><strong>Telefone:</strong> ${l.telefone}</p>
        <p><strong>Mensagem:</strong> ${l.mensagem}</p>
        <small>Recebido em: ${new Date(l.data).toLocaleString()}</small>

        <button class="btn btn-dark atender-btn" data-index="${i}" 
            style="position:absolute; top:15px; right:15px; padding:6px 12px; font-size:.8rem;">
          Atendido
        </button>
      </div>
    `;

    item.querySelector(".atender-btn").addEventListener("click", () => {
      removerLead(i);
    });

    $leadsBox.appendChild(item);
  });
}


$mediaFile.addEventListener("change", () => {
  const file = $mediaFile.files?.[0];
  if (!file) {
    $mediaPreview.style.display = "none";
    $mediaPreview.innerHTML = "";
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = reader.result;
    $imagemUrl.value = dataUrl;

    const isVideo = file.type.startsWith("video/");
    $mediaPreview.style.display = "block";
    $mediaPreview.innerHTML = isVideo
      ? `<video src="${dataUrl}" autoplay muted loop playsinline style="width:100%;height:300px;object-fit:cover;"></video>`
      : `<img src="${dataUrl}" alt="Preview" style="width:100%;height:auto;display:block;">`;
  };
  reader.readAsDataURL(file);
});


async function carregarProjetos() {
  const res = await fetch(API);
  const lista = await res.json();

  $grid.innerHTML = "";
  lista.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card portfolio-card";

    const media = isVideoUrl(p.imagemUrl || "")
      ? `<div class="card-img"><video src="${p.imagemUrl}" autoplay muted loop playsinline></video></div>`
      : `<div class="card-img" style="background-image:url('${p.imagemUrl || ""}')"></div>`;

    card.innerHTML = `
      ${media}
      <h3>${p.titulo || ""}</h3>
      <p>${p.descricao || ""}</p>
      <div class="tags">
        ${(Array.isArray(p.tags) ? p.tags : [])
        .map((t) => `<span class="tag">${t}</span>`)
        .join("")}
      </div>
      <button data-id="${p._id}" class="btn btn-dark" style="margin-top:10px;">Excluir</button>
    `;

    card
      .querySelector("button[data-id]")
      .addEventListener("click", async (ev) => {
        const id = ev.currentTarget.getAttribute("data-id");
        if (!confirm("Tem certeza?")) return;
        await fetch(`${API}/${id}`, { method: "DELETE" });
        carregarProjetos();
      });

    $grid.appendChild(card);
  });
}

$form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    titulo: $titulo.value,
    descricao: $descricao.value,
    imagemUrl: $imagemUrl.value,
    link: $link.value,
    tags: ($tags.value || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    destaque: $destaque.checked,
    ordem: Number($ordem.value || 0)
  };

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  e.target.reset();
  $mediaPreview.style.display = "none";
  $mediaPreview.innerHTML = "";
  carregarProjetos();
});


carregarProjetos();
carregarLeads();