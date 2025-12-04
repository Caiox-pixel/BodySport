

// Espera o carregamento total da página
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const msg = document.getElementById("msg");
  const showBtn = document.querySelector(".show-pass");
  const pass = document.getElementById("senha");

  // Função auxiliar para mostrar mensagens na tela
  function mostrarMensagem(texto, tipo = "info") {
    msg.textContent = texto;
    msg.className = "mensagem " + tipo + " visivel";
    setTimeout(() => msg.classList.remove("visivel"), 4000);
  }

  // Mostrar ou ocultar senha
  showBtn?.addEventListener("click", () => {
    if (!pass) return;
    pass.type = pass.type === "password" ? "text" : "password";
  });

  // Captura o envio do formulário
  form?.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita recarregar a página

    // Coleta os dados do formulário
    const email = form.email.value.trim();
    const senha = form.senha.value.trim();

    // Validação básica antes do envio
    if (!email || !senha) {
      mostrarMensagem("Preencha e-mail e senha.", "erro");
      return;
    }

    try {
      // Envia requisição para a API de login
      const resposta = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });

      // Tenta ler o JSON retornado
      const data = await resposta.json();

      if (resposta.ok && data.status === "ok") {
        // Se o login deu certo, salva o user_id no localStorage
        localStorage.setItem("user_id", data.user_id);

        mostrarMensagem("Login efetuado com sucesso!", "sucesso");

        // Redireciona para a página inicial após 1,5s
        setTimeout(() => {
          window.location.href = "home";
        }, 1500);
      } else {
        // Caso a API retorne erro
        const erro = data.erro || "Usuário ou senha incorretos.";
        mostrarMensagem(erro, "erro");
      }
    } catch (erro) {
      // Caso a requisição falhe (sem internet, servidor offline, etc.)
      console.error("Erro na requisição:", erro);
      mostrarMensagem("Erro ao conectar ao servidor.", "erro");
    }
  });
});