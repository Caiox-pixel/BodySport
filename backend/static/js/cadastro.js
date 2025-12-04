// ===============================
// SCRIPT — Página de Cadastro
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCadastro");
  const msg = document.getElementById("msg");
  const mostrarSenha = document.getElementById("mostrarSenha");
  const campoSenha = document.getElementById("senha");

  // Função para exibir mensagens flutuantes
  function exibirMensagem(texto, tipo = "info") {
    msg.textContent = texto;
    msg.className = "mensagem " + tipo + " visivel";
    setTimeout(() => msg.classList.remove("visivel"), 4000);
  }

  // Alterna exibição da senha
  mostrarSenha?.addEventListener("click", () => {
    const visivel = campoSenha.type === "text";
    campoSenha.type = visivel ? "password" : "text";
    mostrarSenha.textContent = visivel ? "Mostrar" : "Ocultar";
  });

  // Envio do formulário
  form?.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const dados = {
      nome: form.nome.value.trim(),
      email: form.email.value.trim(),
      senha: form.senha.value.trim()
    };

    // Validação simples antes do envio
    if (!dados.nome || !dados.email || !dados.senha) {
      exibirMensagem("Preencha todos os campos.", "erro");
      return;
    }

    try {
      // Envia os dados para a API Flask
      const resposta = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      });

      const retorno = await resposta.json();

      if (resposta.ok && retorno.status === "ok") {
        exibirMensagem("Cadastro realizado com sucesso!", "sucesso");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        exibirMensagem(retorno.erro || "Erro ao cadastrar.", "erro");
      }
    } catch (erro) {
      console.error("Erro ao conectar com o servidor:", erro);
      exibirMensagem("Erro de conexão com o servidor.", "erro");
    }
  });
});
