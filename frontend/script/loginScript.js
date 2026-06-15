/*----------- LOGIN POPUP -----------*/
const btnEntrar = document.getElementById("btnEntrar");
const popupLogin = document.getElementById("popupLogin");

if (btnEntrar && popupLogin) {
    btnEntrar.addEventListener("click", function (e) {
        e.preventDefault();
        popupLogin.classList.toggle("ativo");
    });
}



/*-------- LOGIN --------*/
const btnLogin = document.getElementById("btnLogin");

if (btnLogin) {
    btnLogin.addEventListener("click", async () => {
        const email = document.getElementById("loginEmail").value;
        const senha = document.getElementById("loginSenha").value;

        try {
            const resposta = await fetch("/clientes/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, senha })
            });

            if (!resposta.ok) {
                alert("Email ou senha inválidos");
                return;
            }

            const dados = await resposta.json();

            // salva usuário no navegador
            localStorage.setItem("usuario", JSON.stringify(dados.usuario));

            // recarrega a página
            location.reload();

        } catch (erro) {
            console.error(erro);
            alert("Erro ao conectar ao servidor");
        }
    });
}

/*-------- EXIBIR USUÁRIO LOGADO --------*/
const usuarioLogadoSpan = document.getElementById("usuarioLogado");
const btnSair = document.getElementById("btnSair");

const usuario = JSON.parse(localStorage.getItem("usuario"));

if (usuario) {
    let nomeExibicao = usuario.nome;

    // se for admin
    if (usuario.is_admin === 1) {
        nomeExibicao += " (Administrador)";
    }

    if (usuarioLogadoSpan) {
        usuarioLogadoSpan.innerText = `Bem-vindo, ${nomeExibicao}!`;
        usuarioLogadoSpan.style.color = "white";
    }

    // esconde botão entrar
    if (btnEntrar) btnEntrar.style.display = "none";

    // mostra botão sair
    if (btnSair) btnSair.style.display = "inline-block";

    // botão admin (se for admin)
    if (usuario.is_admin === 1) {
        let btnAdmin = document.getElementById("btnAcessoAdmin");

        if (!btnAdmin) {
            btnAdmin = document.createElement("button");
            btnAdmin.id = "btnAcessoAdmin";
            btnAdmin.innerText = "Acesso Administrativo";

            btnAdmin.onclick = () => {
                window.location.href = "admin.html";
            };

            if (btnSair) {
                btnSair.parentNode.insertBefore(btnAdmin, btnSair.nextSibling);
            }
        }
    }

} else {
    // se NÃO tiver usuário logado
    if (btnSair) btnSair.style.display = "none";
}

// -------- LOGOUT --------
if (btnSair) {
    btnSair.addEventListener("click", () => {
        localStorage.removeItem("usuario");
        location.reload();
    });
}
