
// Script da página de login — controla envio do formulário, feedback e redirecionamento

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const msg = document.getElementById("msg");
  const showBtn = document.querySelector(".show-pass");
  const pass = document.getElementById("senha");

  // Função para mostrar mensagens na tela
  function mostrarMensagem(texto, tipo = "info") {
    msg.textContent = texto;
    msg.className = "mensagem " + tipo + " visivel";
    setTimeout(() => msg.classList.remove("visivel"), 4000);
  }

  // Mostrar/ocultar senha
  showBtn?.addEventListener("click", () => {
    if (!pass) return;
    pass.type = pass.type === "password" ? "text" : "password";
  });

  // Escuta o envio do formulário
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const senha = form.senha.value.trim();

    if (!email || !senha) {
      mostrarMensagem("Preencha e-mail e senha.", "erro");
      return;
    }

    try {
      console.log("🔹 Enviando dados de login:", { email, senha });

      const resposta = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });

      const data = await resposta.json();
      console.log("🔹 Resposta do servidor:", data);

      if (resposta.ok && data.status === "ok") {
        // Login bem-sucedido
        localStorage.setItem("user_id", data.user_id);
        mostrarMensagem("Login efetuado com sucesso!", "sucesso");

        // Aguarda 1,5 segundo e redireciona
        setTimeout(() => {
          console.log("🔸 Redirecionando para / ...");
          window.location.href = "/";
        }, 1500);

      } else {
        // Erro retornado pela API
        const erro = data.erro || "Usuário ou senha incorretos.";
        mostrarMensagem(erro, "erro");
      }

    } catch (erro) {
      console.error("❌ Erro na requisição:", erro);
      mostrarMensagem("Erro ao conectar ao servidor.", "erro");
    }
  });
});

