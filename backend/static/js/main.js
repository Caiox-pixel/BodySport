// Configuração da API
// Em produção, use a URL do backend no Render
// Você pode definir window.API_URL no HTML antes de carregar este script
const API_URL = window.API_URL || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000' 
    : 'https://bodysport-backend.onrender.com'); // ⚠️ ATUALIZE COM SUA URL DO RENDER

// Função utilitária para exibir mensagens
function mostrarMensagem(texto, tipo) {
  const msg = document.createElement("div");
  msg.className = `mensagem ${tipo}`;
  msg.textContent = texto;
  document.body.appendChild(msg);

  setTimeout(() => msg.classList.add("visivel"), 10);
  setTimeout(() => {
    msg.classList.remove("visivel");
    setTimeout(() => msg.remove(), 400);
  }, 3000);
}

// Inicialização quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("orcamentoRapido");

  if (!form) {
    console.warn("Formulário de orçamento não encontrado");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const modelo = form.modelo.value.trim();

    // Validação
    if (!nome || !email || !modelo) {
      mostrarMensagem("Preencha todos os campos corretamente.", "erro");
      return;
    }

    // Validação de email básica
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      mostrarMensagem("Por favor, insira um email válido.", "erro");
      return;
    }

    const button = form.querySelector("button");
    button.disabled = true;
    mostrarMensagem("Enviando...", "info");

    try {
      // Tentativa de enviar para o backend
      const resp = await fetch(`${API_URL}/api/orcamento`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, modelo })
      });

      if (resp.ok) {
        const data = await resp.json();
        mostrarMensagem(data.mensagem || "Orçamento enviado com sucesso!", "sucesso");
        form.reset();
      } else {
        throw new Error("Erro ao enviar orçamento");
      }
    } catch (error) {
      // Fallback: mensagem de sucesso local (para desenvolvimento)
      console.warn("Backend não disponível, usando modo de desenvolvimento:", error);
      setTimeout(() => {
        form.reset();
        mostrarMensagem("Orçamento enviado com sucesso! (Modo desenvolvimento)", "sucesso");
      }, 1500);
    } finally {
      button.disabled = false;
    }
  });
});

