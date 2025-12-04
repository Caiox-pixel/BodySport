// Sistema de Desenvolvimento de Bodykits

// Estado do projeto
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

// Preços por material
const precosMaterial = {
  'fibra-vidro': { min: 2500, max: 4000 },
  'fibra-carbono': { min: 5000, max: 8000 },
  'abs': { min: 1500, max: 3000 }
};

// Preços por peça
const precosPecas = {
  'para-choque-dianteiro': 800,
  'para-choque-traseiro': 700,
  'spoiler': 600,
  'saias-laterais': 500,
  'capo': 900,
  'saia-dianteira': 400
};

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
  // Aguardar carregamento dos carros
  await carregarCarros();
  
  inicializarEventos();
  
  // Aguardar um pouco para o viewer 3D inicializar
  setTimeout(() => {
    atualizarPreview();
  }, 1000);
  
  atualizarResumo();
  carregarHistorico();
});

// Inicializar eventos
function inicializarEventos() {
  // Seleção de modelo
  const modeloSelect = document.getElementById('modeloCarro');
  modeloSelect.addEventListener('change', async (e) => {
    projeto.modeloCarro = e.target.value;
    atualizarInfoModelo();
    await atualizarPreview();
  });

  // Toggle de peças
  Object.keys(projeto.pecas).forEach(pecaId => {
    const checkbox = document.getElementById(`peca-${pecaId}`);
    if (checkbox) {
      checkbox.addEventListener('change', async (e) => {
        projeto.pecas[pecaId].ativo = e.target.checked;
        toggleOpcoesPeca(pecaId, e.target.checked);
        await atualizarPreview();
        atualizarResumo();
      });
    }

    // Seleção de tipo de peça
    const select = document.querySelector(`#opcoes-${pecaId} .select-peca`);
    if (select) {
      select.addEventListener('change', async (e) => {
        projeto.pecas[pecaId].tipo = e.target.value;
        await atualizarPreview();
      });
    }

    // Seleção de cor
    const colorInput = document.querySelector(`#opcoes-${pecaId} .input-color`);
    if (colorInput) {
      colorInput.addEventListener('change', async (e) => {
        projeto.pecas[pecaId].cor = e.target.value;
        await atualizarPreview();
      });
    }
  });

  // Seleção de material
  document.querySelectorAll('input[name="material"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      projeto.material = e.target.value;
      atualizarResumo();
    });
  });

  // Botões de controle do preview (já configurados no viewer3d.js)
  // Os controles são gerenciados diretamente no viewer3d.js

  // Tabs do painel lateral
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tabName = e.target.dataset.tab;
      trocarTab(tabName);
    });
  });

  // Toggle do painel
  document.getElementById('togglePainel')?.addEventListener('click', () => {
    togglePainel();
  });

  // Botões de ação
  document.getElementById('btnSalvar')?.addEventListener('click', salvarProjeto);
  document.getElementById('btnExportar')?.addEventListener('click', exportarProjeto);
  document.getElementById('btnSolicitarOrcamento')?.addEventListener('click', abrirModalOrcamento);

  // Modal
  document.getElementById('btnCloseModal')?.addEventListener('click', fecharModal);
  document.getElementById('btnCancelar')?.addEventListener('click', fecharModal);
  document.getElementById('formOrcamento')?.addEventListener('submit', enviarOrcamento);

  // Fechar modal ao clicar fora
  document.getElementById('modalOrcamento')?.addEventListener('click', (e) => {
    if (e.target.id === 'modalOrcamento') {
      fecharModal();
    }
  });
}

// Toggle opções da peça
function toggleOpcoesPeca(pecaId, ativo) {
  const opcoes = document.getElementById(`opcoes-${pecaId}`);
  if (opcoes) {
    opcoes.style.display = ativo ? 'flex' : 'none';
  }
}

// Atualizar preview visual (3D)
let viewer3DModule = null;

// Carregar módulo 3D
async function loadViewer3D() {
  if (!viewer3DModule) {
    try {
      viewer3DModule = await import('./viewer3d.js');
    } catch (error) {
      console.warn('Erro ao carregar viewer 3D:', error);
    }
  }
  return viewer3DModule;
}

// Atualizar preview visual
async function atualizarPreview() {
  const viewer = await loadViewer3D();
  if (!viewer) return;

  Object.keys(projeto.pecas).forEach(pecaId => {
    const peca = projeto.pecas[pecaId];
    if (viewer.updateBodykitPart) {
      viewer.updateBodykitPart(
        pecaId,
        peca.ativo,
        peca.tipo,
        peca.cor
      );
    }
  });
}

// Atualizar informações do modelo
function atualizarInfoModelo() {
  const infoModelo = document.getElementById('infoModelo');
  const modeloSelect = document.getElementById('modeloCarro');
  if (infoModelo && modeloSelect) {
    const carroId = modeloSelect.value;
    if (carroId) {
      const carro = buscarCarroPorId(carroId);
      if (carro) {
        infoModelo.textContent = `${carro.marca} ${carro.modelo} ${carro.ano}`;
      } else {
        const texto = modeloSelect.options[modeloSelect.selectedIndex]?.text || '-';
        infoModelo.textContent = texto || '-';
      }
    } else {
      infoModelo.textContent = '-';
    }
  }
}

// Atualizar resumo e preço
function atualizarResumo() {
  // Contar peças ativas
  const pecasAtivas = Object.values(projeto.pecas).filter(p => p.ativo).length;
  document.getElementById('contadorPecas').textContent = pecasAtivas;

  // Material selecionado
  const materialRadio = document.querySelector(`input[name="material"]:checked`);
  const materialNome = materialRadio?.parentElement.querySelector('.material-nome')?.textContent || 'Fibra de Vidro';
  document.getElementById('materialSelecionado').textContent = materialNome;

  // Calcular preço
  const precoBase = precosMaterial[projeto.material] || precosMaterial['fibra-vidro'];
  let precoTotalMin = precoBase.min;
  let precoTotalMax = precoBase.max;

  Object.keys(projeto.pecas).forEach(pecaId => {
    if (projeto.pecas[pecaId].ativo) {
      const precoPeca = precosPecas[pecaId] || 0;
      precoTotalMin += precoPeca;
      precoTotalMax += precoPeca;
    }
  });

  projeto.precoEstimado = { min: precoTotalMin, max: precoTotalMax };
  
  const precoElement = document.getElementById('precoEstimado');
  if (precoElement) {
    precoElement.textContent = `R$ ${precoTotalMin.toLocaleString('pt-BR')} - R$ ${precoTotalMax.toLocaleString('pt-BR')}`;
  }
}

// Resetar preview (já implementado no viewer3d.js via botão)
function resetarPreview() {
  // Reset é gerenciado pelo viewer3d.js
}

// Trocar tab
function trocarTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });

  document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
  document.getElementById(`tab-${tabName}`)?.classList.add('active');
}

// Toggle painel
function togglePainel() {
  const painelContent = document.getElementById('painelContent');
  const btnToggle = document.getElementById('togglePainel');
  
  if (painelContent && btnToggle) {
    const isHidden = painelContent.style.display === 'none';
    painelContent.style.display = isHidden ? 'block' : 'none';
    btnToggle.textContent = isHidden ? '▼' : '▲';
    btnToggle.classList.toggle('rotated');
  }
}

// Salvar projeto
function salvarProjeto() {
  const projetoData = {
    ...projeto,
    data: new Date().toISOString(),
    nome: `Projeto ${projeto.modeloCarro || 'Novo'} - ${new Date().toLocaleDateString('pt-BR')}`
  };

  // Salvar no localStorage
  const projetos = JSON.parse(localStorage.getItem('bodykit-projetos') || '[]');
  projetos.push(projetoData);
  localStorage.setItem('bodykit-projetos', JSON.stringify(projetos));

  mostrarMensagem('Projeto salvo com sucesso!', 'sucesso');
  carregarHistorico();
}

// Exportar projeto
function exportarProjeto() {
  const projetoData = {
    ...projeto,
    data: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(projetoData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bodykit-projeto-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);

  mostrarMensagem('Projeto exportado!', 'sucesso');
}

// Carregar histórico
function carregarHistorico() {
  const projetos = JSON.parse(localStorage.getItem('bodykit-projetos') || '[]');
  const historicoList = document.getElementById('historicoList');

  if (!historicoList) return;

  if (projetos.length === 0) {
    historicoList.innerHTML = `
      <div class="historico-item vazio">
        <p>Nenhum projeto salvo ainda</p>
        <small>Seus projetos aparecerão aqui</small>
      </div>
    `;
    return;
  }

  historicoList.innerHTML = projetos.slice(-5).reverse().map((proj, index) => `
    <div class="historico-item" data-index="${projetos.length - 1 - index}">
      <strong>${proj.nome || 'Projeto sem nome'}</strong>
      <small style="color: var(--muted); display: block; margin-top: 4px;">
        ${new Date(proj.data).toLocaleDateString('pt-BR')}
      </small>
    </div>
  `).join('');

  // Adicionar eventos de clique
  historicoList.querySelectorAll('.historico-item:not(.vazio)').forEach(item => {
    item.addEventListener('click', async () => {
      const index = parseInt(item.dataset.index);
      await carregarProjeto(projetos[index]);
    });
  });
}

// Carregar projeto
async function carregarProjeto(proj) {
  projeto.modeloCarro = proj.modeloCarro || '';
  projeto.pecas = proj.pecas || projeto.pecas;
  projeto.material = proj.material || 'fibra-vidro';

  // Atualizar UI
  document.getElementById('modeloCarro').value = projeto.modeloCarro;
  document.querySelector(`input[name="material"][value="${projeto.material}"]`).checked = true;

  Object.keys(projeto.pecas).forEach(pecaId => {
    const checkbox = document.getElementById(`peca-${pecaId}`);
    if (checkbox) {
      checkbox.checked = projeto.pecas[pecaId].ativo;
      toggleOpcoesPeca(pecaId, projeto.pecas[pecaId].ativo);
    }

    const select = document.querySelector(`#opcoes-${pecaId} .select-peca`);
    if (select) {
      select.value = projeto.pecas[pecaId].tipo;
    }

    const colorInput = document.querySelector(`#opcoes-${pecaId} .input-color`);
    if (colorInput) {
      colorInput.value = projeto.pecas[pecaId].cor;
    }
  });

  await atualizarPreview();
  atualizarResumo();
  atualizarInfoModelo();
  mostrarMensagem('Projeto carregado!', 'sucesso');
}

// Abrir modal de orçamento
function abrirModalOrcamento() {
  const modal = document.getElementById('modalOrcamento');
  if (modal) {
    modal.classList.add('active');
  }
}

// Fechar modal
function fecharModal() {
  const modal = document.getElementById('modalOrcamento');
  if (modal) {
    modal.classList.remove('active');
    document.getElementById('formOrcamento')?.reset();
  }
}

// Enviar orçamento
async function enviarOrcamento(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const dados = {
    nome: formData.get('nome'),
    email: formData.get('email'),
    telefone: formData.get('telefone'),
    observacoes: formData.get('observacoes'),
    projeto: projeto,
    tipo: 'desenvolvimento-bodykit'
  };

  const button = e.target.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = 'Enviando...';

  try {
    // Usar a mesma lógica de API_URL do main.js
    const API_URL = window.API_URL || 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000' 
        : 'https://bodysport-backend.onrender.com'); // ⚠️ ATUALIZE COM SUA URL DO RENDER
    const resp = await fetch(`${API_URL}/api/orcamento`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    if (resp.ok) {
      mostrarMensagem('Solicitação enviada com sucesso! Entraremos em contato em breve.', 'sucesso');
      fecharModal();
      e.target.reset();
    } else {
      throw new Error('Erro ao enviar');
    }
  } catch (error) {
    console.warn('Backend não disponível, salvando localmente:', error);
    // Fallback: salvar localmente
    const solicitacoes = JSON.parse(localStorage.getItem('bodykit-solicitacoes') || '[]');
    solicitacoes.push({ ...dados, data: new Date().toISOString() });
    localStorage.setItem('bodykit-solicitacoes', JSON.stringify(solicitacoes));
    
    mostrarMensagem('Solicitação salva! (Modo desenvolvimento)', 'sucesso');
    fecharModal();
    e.target.reset();
  } finally {
    button.disabled = false;
    button.textContent = 'Enviar Solicitação';
  }
}

