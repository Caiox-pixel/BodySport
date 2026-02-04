// ===============================
// 📁 static/js/desenvolver.js
// Sistema de Desenvolvimento de Bodykits — Versão Flask + Three.js modular
// ===============================

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { initViewer3D, updateBodykitPart } from "./viewer3d.js";
// ===============================
// PARÂMETROS DA URL (ex: ?car=supra)
// ===============================
const params = new URLSearchParams(window.location.search);
const carroDaURL = (params.get("car") || "").trim().toLowerCase();

// Expõe THREE globalmente para o módulo do visualizador 3D
window.THREE = THREE;

// ===============================
// ESTADO GLOBAL DO PROJETO
// ===============================
const projeto = {
  modeloCarro: '',
  pecas: {
    'para-choque-dianteiro': { ativo: true, tipo: 'agressivo', cor: '#1a1a22' },
    'para-choque-traseiro': { ativo: true, tipo: 'agressivo', cor: '#1a1a22' },
    'spoiler': { ativo: false, tipo: 'alto', cor: '#1a1a22' },
    'saias-laterais': { ativo: false, tipo: 'completa', cor: '#1a1a22' },
    'capo': { ativo: false, tipo: 'dupla', cor: '#1a1a22' },
    'saia-dianteira': { ativo: false, tipo: 'agressiva', cor: '#1a1a22' }
  },
  material: 'fibra-vidro',
  precoEstimado: { min: 3000, max: 5000 }
};

// ===============================
// TABELAS DE PREÇOS
// ===============================
const precosMaterial = {
  'fibra-vidro': { min: 2500, max: 4000 },
  'fibra-carbono': { min: 5000, max: 8000 },
  'abs': { min: 1500, max: 3000 }
};

const precosPecas = {
  'para-choque-dianteiro': 800,
  'para-choque-traseiro': 700,
  'spoiler': 600,
  'saias-laterais': 500,
  'capo': 900,
  'saia-dianteira': 400
};

// ===============================
// INICIALIZAÇÃO GERAL
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await carregarCarros(); // Função vinda do carros.js
// Se vier ?car=supra, tenta selecionar automaticamente no select
if (carroDaURL) {
  const select = document.getElementById("modeloCarro");
  if (select) {
    const temValue = Array.from(select.options).some(
      opt => (opt.value || "").toLowerCase() === carroDaURL
    );

    if (temValue) {
      select.value = carroDaURL;
    } else {
      const opt = Array.from(select.options).find(o =>
        (o.textContent || "").toLowerCase().includes(carroDaURL)
      );
      if (opt) select.value = opt.value;
    }

    projeto.modeloCarro = select.value;
    atualizarInfoModelo();
  }
}

    inicializarEventos();
    initViewer3D("previewContainer");

   await atualizarPreview();
    atualizarResumo();
    carregarHistorico();
  } catch (error) {
    console.error("Erro ao iniciar o editor de bodykits:", error);
  }
});

// ===============================
// EVENTOS E INTERAÇÕES
// ===============================
function inicializarEventos() {
  // Seleção de modelo de carro
  const modeloSelect = document.getElementById("modeloCarro");
  modeloSelect?.addEventListener("change", async (e) => {
    projeto.modeloCarro = e.target.value;
    atualizarInfoModelo();
    await atualizarPreview();
  });

  // Alternar peças
  Object.keys(projeto.pecas).forEach((pecaId) => {
    const checkbox = document.getElementById(`peca-${pecaId}`);
    if (checkbox) {
      checkbox.addEventListener("change", async (e) => {
        projeto.pecas[pecaId].ativo = e.target.checked;
        toggleOpcoesPeca(pecaId, e.target.checked);
        await atualizarPreview();
        atualizarResumo();
      });
    }

    // Tipo da peça
    const select = document.querySelector(`#opcoes-${pecaId} .select-peca`);
    if (select) {
      select.addEventListener("change", async (e) => {
        projeto.pecas[pecaId].tipo = e.target.value;
        await atualizarPreview();
      });
    }

    // Cor da peça
    const colorInput = document.querySelector(`#opcoes-${pecaId} .input-color`);
    if (colorInput) {
      colorInput.addEventListener("change", async (e) => {
        projeto.pecas[pecaId].cor = e.target.value;
        await atualizarPreview();
      });
    }
  });

  // Seleção de material
  document.querySelectorAll('input[name="material"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      projeto.material = radio.value;
      atualizarResumo();
    });
  });

  // Abas (Histórico / Ajuda)
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => trocarTab(e.target.dataset.tab));
  });

  // Painel lateral
  document.getElementById("togglePainel")?.addEventListener("click", togglePainel);

  // Botões principais
  document.getElementById("btnSalvar")?.addEventListener("click", salvarProjeto);
  document.getElementById("btnExportar")?.addEventListener("click", exportarProjeto);
  document.getElementById("btnSolicitarOrcamento")?.addEventListener("click", abrirModalOrcamento);

  // Modal de orçamento
  document.getElementById("btnCloseModal")?.addEventListener("click", fecharModal);
  document.getElementById("btnCancelar")?.addEventListener("click", fecharModal);
  document.getElementById("formOrcamento")?.addEventListener("submit", enviarOrcamento);

  // Fechar modal ao clicar fora
  document.getElementById("modalOrcamento")?.addEventListener("click", (e) => {
    if (e.target.id === "modalOrcamento") fecharModal();
  });
}

// ===============================
// VISUALIZAÇÃO 3D
// ===============================
async function atualizarPreview() {
  Object.entries(projeto.pecas).forEach(([pecaId, peca]) => {
    updateBodykitPart(pecaId, peca.ativo, peca.tipo, peca.cor);
  });
}

// ===============================
// UI E LÓGICA DE PROJETO
// ===============================
function toggleOpcoesPeca(pecaId, ativo) {
  const opcoes = document.getElementById(`opcoes-${pecaId}`);
  if (opcoes) opcoes.style.display = ativo ? "flex" : "none";
}

function atualizarInfoModelo() {
  const infoModelo = document.getElementById("infoModelo");
  const modeloSelect = document.getElementById("modeloCarro");
  if (!infoModelo || !modeloSelect) return;

  const carroId = modeloSelect.value;
  if (carroId) {
    const carro = buscarCarroPorId(carroId);
    infoModelo.textContent = carro
      ? `${carro.marca} ${carro.modelo} ${carro.ano}`
      : modeloSelect.options[modeloSelect.selectedIndex]?.text || "-";
  } else {
    infoModelo.textContent = "-";
  }
}

function atualizarResumo() {
  const pecasAtivas = Object.values(projeto.pecas).filter((p) => p.ativo).length;
  document.getElementById("contadorPecas").textContent = pecasAtivas;

  const materialRadio = document.querySelector('input[name="material"]:checked');
  const materialNome = materialRadio?.parentElement.querySelector(".material-nome")?.textContent || "Fibra de Vidro";
  document.getElementById("materialSelecionado").textContent = materialNome;

  const precoBase = precosMaterial[projeto.material] || precosMaterial["fibra-vidro"];
  let precoMin = precoBase.min;
  let precoMax = precoBase.max;

  Object.keys(projeto.pecas).forEach((pecaId) => {
    if (projeto.pecas[pecaId].ativo) {
      const precoPeca = precosPecas[pecaId] || 0;
      precoMin += precoPeca;
      precoMax += precoPeca;
    }
  });

  projeto.precoEstimado = { min: precoMin, max: precoMax };
  document.getElementById("precoEstimado").textContent = `R$ ${precoMin.toLocaleString("pt-BR")} - R$ ${precoMax.toLocaleString("pt-BR")}`;
}

function trocarTab(tabName) {
  document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach((content) => content.classList.remove("active"));
  document.querySelector(`[data-tab="${tabName}"]`)?.classList.add("active");
  document.getElementById(`tab-${tabName}`)?.classList.add("active");
}

function togglePainel() {
  const painel = document.getElementById("painelContent");
  const btn = document.getElementById("togglePainel");
  if (painel && btn) {
    const oculto = painel.style.display === "none";
    painel.style.display = oculto ? "block" : "none";
    btn.textContent = oculto ? "▼" : "▲";
  }
}

// ===============================
// SALVAR / EXPORTAR / HISTÓRICO
// ===============================
function salvarProjeto() {
  const projetoData = {
    ...projeto,
    data: new Date().toISOString(),
    nome: `Projeto ${projeto.modeloCarro || "Novo"} - ${new Date().toLocaleDateString("pt-BR")}`
  };

  const projetos = JSON.parse(localStorage.getItem("bodykit-projetos") || "[]");
  projetos.push(projetoData);
  localStorage.setItem("bodykit-projetos", JSON.stringify(projetos));

  mostrarMensagem("Projeto salvo com sucesso!", "sucesso");
  carregarHistorico();
}

function exportarProjeto() {
  const blob = new Blob([JSON.stringify(projeto, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `bodykit-projeto-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  mostrarMensagem("Projeto exportado!", "sucesso");
}

function carregarHistorico() {
  const projetos = JSON.parse(localStorage.getItem("bodykit-projetos") || "[]");
  const lista = document.getElementById("historicoList");

  if (!lista) return;
  if (projetos.length === 0) {
    lista.innerHTML = `<div class="historico-item vazio"><p>Nenhum projeto salvo ainda</p></div>`;
    return;
  }

  lista.innerHTML = projetos.slice(-5).reverse().map((proj, i) => `
    <div class="historico-item" data-index="${projetos.length - 1 - i}">
      <strong>${proj.nome || "Projeto sem nome"}</strong>
      <small>${new Date(proj.data).toLocaleDateString("pt-BR")}</small>
    </div>`).join("");

  lista.querySelectorAll(".historico-item").forEach(item => {
    item.addEventListener("click", async () => {
      const index = parseInt(item.dataset.index);
      await carregarProjeto(projetos[index]);
    });
  });
}

async function carregarProjeto(proj) {
  projeto.modeloCarro = proj.modeloCarro || "";
  projeto.pecas = proj.pecas || projeto.pecas;
  projeto.material = proj.material || "fibra-vidro";

  document.getElementById("modeloCarro").value = projeto.modeloCarro;
  document.querySelector(`input[name="material"][value="${projeto.material}"]`).checked = true;

  for (const [pecaId, dados] of Object.entries(projeto.pecas)) {
    const checkbox = document.getElementById(`peca-${pecaId}`);
    if (checkbox) checkbox.checked = dados.ativo;
    toggleOpcoesPeca(pecaId, dados.ativo);

    const select = document.querySelector(`#opcoes-${pecaId} .select-peca`);
    if (select) select.value = dados.tipo;

    const color = document.querySelector(`#opcoes-${pecaId} .input-color`);
    if (color) color.value = dados.cor;
  }

  await atualizarPreview();
  atualizarResumo();
  atualizarInfoModelo();
  mostrarMensagem("Projeto carregado!", "sucesso");
}

// ===============================
// MODAL DE ORÇAMENTO
// ===============================
function abrirModalOrcamento() {
  document.getElementById("modalOrcamento")?.classList.add("active");
}

function fecharModal() {
  const modal = document.getElementById("modalOrcamento");
  if (modal) {
    modal.classList.remove("active");
    document.getElementById("formOrcamento")?.reset();
  }
}

async function enviarOrcamento(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const dados = {
    nome: formData.get("nome"),
    email: formData.get("email"),
    telefone: formData.get("telefone"),
    observacoes: formData.get("observacoes"),
    projeto
  };

  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = "Enviando...";

  try {
    const API_URL = window.API_URL ||
      (window.location.hostname.includes("localhost") ? "http://localhost:5000" : "https://bodysport-backend.onrender.com");
    const resp = await fetch(`${API_URL}/api/orcamento`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    if (resp.ok) {
      mostrarMensagem("Solicitação enviada com sucesso!", "sucesso");
      fecharModal();
      e.target.reset();
    } else throw new Error("Falha no envio");
  } catch (error) {
    console.warn("Servidor indisponível, salvando localmente:", error);
    const solicitacoes = JSON.parse(localStorage.getItem("bodykit-solicitacoes") || "[]");
    solicitacoes.push({ ...dados, data: new Date().toISOString() });
    localStorage.setItem("bodykit-solicitacoes", JSON.stringify(solicitacoes));
    mostrarMensagem("Solicitação salva localmente!", "sucesso");
    fecharModal();
  } finally {
    btn.disabled = false;
    btn.textContent = "Enviar Solicitação";
  }
}
