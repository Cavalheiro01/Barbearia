/*----------- REDIRECIONAR PARA CADASTRO -----------*/
const btnIrCadastro = document.getElementById("btnIrCadastro");
const baseUrl = "https://barbearia-l5v8.onrender.com/"
if (btnIrCadastro) {
    btnIrCadastro.addEventListener("click", function () {
        window.location.href = "paginaCadastro.html";
    });
}

const btnVoltar = document.getElementById("btnVoltar");

if (btnVoltar) {
    btnVoltar.addEventListener("click", function () {

        if (window.innerWidth <= 768) {
            window.location.href = "loginMobile.html";
        } else {
            window.location.href = "paginaInicial.html";
        }

    });
}


// -------- CADASTRO DE USUÁRIO --------
const formCadastro = document.getElementById("formCadastro");

if (formCadastro) {
    formCadastro.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nome = document.getElementById("nome").value;
        const cpf = document.getElementById("cpf").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;
        const confirmarSenha = document.getElementById("confirmarSenha").value;

        // valida senha
        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem!");
            return;
        }

        try {
            const resposta = await fetch(`${baseUrl}cliente`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome,
                    cpf,
                    email,
                    senha
                })
            });

            const mensagem = await resposta.text();

            alert(mensagem);

            if (resposta.ok) {
                formCadastro.reset();
            }

        } catch (erro) {
            console.error(erro);
            alert("Erro ao conectar com o servidor.");
        }
    });
}

