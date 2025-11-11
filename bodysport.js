document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("orcamentoRapido");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const modelo = form.modelo.value.trim();

    if (!nome || !email || !modelo) {
      mostrarMensagem("Preencha todos os campos corretamente.", "erro");
      return;
    }

    form.querySelector("button").disabled = true;
    mostrarMensagem("Enviando...", "info");

    setTimeout(() => {
      form.reset();
      form.querySelector("button").disabled = false;
      mostrarMensagem("Orçamento enviado com sucesso!", "sucesso");
    }, 1500);
  });

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
});
