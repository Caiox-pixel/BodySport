// ==============================
// SCRIPT — Página de Cadastro
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formularioCadastro");
  const mensagem = document.getElementById("mensagem");
  const botaoMostrar = document.getElementById("mostrarSenha");

  // Exibe uma mensagem flutuante na tela
  function exibirMensagem(texto, tipo = "info") {
    mensagem.textContent = texto;
    mensagem.className = "mensagem " + tipo + " visivel";
    setTimeout(() => mensagem.classList.remove("visivel"), 4000);
  }

  // Alterna entre mostrar e ocultar senha
  botaoMostrar?.addEventListener("click", () => {
    const campoSenha = document.getElementById("senha");
    if (!campoSenha) return;
    campoSenha.type = campoSenha.type === "password" ? "text" : "password";
    botaoMostrar.textContent = campoSenha.type === "password" ? "Mostrar" : "Ocultar";
  });

  // Envio do formulário de cadastro
  formulario?.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const nome = formulario.nome.value.trim();
    const email = formulario.email.value.trim();
    const senha = formulario.senha.value.trim();
    const confirmar = formulario.confirmar.value.trim();

    // Validação básica
    if (!nome || !email || !senha || !confirmar) {
      exibirMensagem("Preencha todos os campos.", "erro");
      return;
    }

    if (senha !== confirmar) {
      exibirMensagem("As senhas não coincidem.", "erro");
      return;
    }

    try {
      // Envia dados para o backend
      const resposta = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha })
      });

      const dados = await resposta.json();

      if (resposta.ok && dados.status === "ok") {
        exibirMensagem("Cadastro realizado com sucesso!", "sucesso");
        setTimeout(() => (window.location.href = "/login"), 1500);
      } else {
        exibirMensagem(dados.erro || "Erro ao criar conta.", "erro");
      }
    } catch (erro) {
      console.error("Erro ao conectar com o servidor:", erro);
      exibirMensagem("Falha na conexão com o servidor.", "erro");
    }
  });
});
