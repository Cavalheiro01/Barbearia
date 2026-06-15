
    const USUARIO_LOGADO = JSON.parse(localStorage.getItem("usuario"));
    if (!USUARIO_LOGADO || USUARIO_LOGADO.is_admin !== 1) {
        alert("Acesso negado! Você não é administrador.");
        window.location.href = "paginaInicial.html";
    }

    let usuariosNormais = [];
    let filtroAtual = "";

    async function carregarUsuarios() {
        try {
            const response = await fetch("http://localhost:3000/admin/users", {
                headers: { "X-User-Id": USUARIO_LOGADO.id }
            });
            if (!response.ok) {
                const erro = await response.json();
                throw new Error(erro.erro || "Falha ao carregar");
            }
            const todos = await response.json();
            usuariosNormais = todos.filter(user => user.is_admin === 0);
            aplicarFiltro();
            document.getElementById("loading").style.display = "none";
            document.getElementById("tabelaUsuarios").style.display = "table";
        } catch (err) {
            document.getElementById("loading").innerHTML = `Erro: ${err.message}`;
        }
    }

    function aplicarFiltro() {
        const termo = filtroAtual.toLowerCase();
        let filtrados = usuariosNormais;
        if (termo) {
            filtrados = usuariosNormais.filter(user =>
                user.nome.toLowerCase().includes(termo) ||
                user.email.toLowerCase().includes(termo) ||
                user.cpf.includes(termo)
            );
        }
        exibirTabela(filtrados);
        document.getElementById("contador").innerHTML = `${filtrados.length} usuário(s) encontrado(s)`;
    }

    function exibirTabela(usuarios) {
        const tbody = document.getElementById("corpoTabela");
        tbody.innerHTML = "";
        if (usuarios.length === 0) {
            const row = tbody.insertRow();
            const cell = row.insertCell(0);
            cell.colSpan = 5;
            cell.textContent = "Nenhum usuário comum cadastrado.";
            cell.style.textAlign = "center";
            cell.style.padding = "30px";
            return;
        }
        usuarios.forEach(user => {
            const row = tbody.insertRow();
            row.insertCell(0).innerText = user.id;
            row.insertCell(1).innerText = user.nome;
            row.insertCell(2).innerText = user.cpf;
            row.insertCell(3).innerText = user.email;
            const acoes = row.insertCell(4);
            const btnEditar = document.createElement("button");
            btnEditar.innerText = "Editar";
            btnEditar.className = "btn-editar";
            btnEditar.onclick = () => abrirModalEdicao(user);
            const btnExcluir = document.createElement("button");
            btnExcluir.innerText = "Excluir";
            btnExcluir.className = "btn-excluir";
            btnExcluir.onclick = () => confirmarExclusao(user.id, user.nome);
            acoes.appendChild(btnEditar);
            acoes.appendChild(btnExcluir);
        });
    }

    function abrirModalEdicao(user) {
        document.getElementById("editId").value = user.id;
        document.getElementById("editNome").value = user.nome;
        document.getElementById("editCpf").value = user.cpf;
        document.getElementById("editEmail").value = user.email;
        document.getElementById("editAdmin").value = user.is_admin;
        document.getElementById("modalEditar").style.display = "flex";
        document.getElementById("modalFeedback").style.display = "none";
    }

    function fecharModal() {
        document.getElementById("modalEditar").style.display = "none";
    }

    document.getElementById("btnSalvarEdicao").onclick = async () => {
        const id = document.getElementById("editId").value;
        const nome = document.getElementById("editNome").value;
        const cpf = document.getElementById("editCpf").value;
        const email = document.getElementById("editEmail").value;
        const is_admin = parseInt(document.getElementById("editAdmin").value);

        if (!nome || !cpf || !email) {
            mostrarModalFeedback("Preencha nome, CPF e e-mail.", "erro");
            return;
        }

        // Payload sem senha
        const payload = { nome, cpf, email, is_admin };

        try {
            const response = await fetch(`http://localhost:3000/admin/users/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-User-Id": USUARIO_LOGADO.id
                },
                body: JSON.stringify(payload)
            });
            const resultado = await response.json();
            if (!response.ok) throw new Error(resultado.erro || "Erro ao atualizar");
            mostrarModalFeedback("Usuário atualizado com sucesso!", "sucesso");
            setTimeout(() => {
                fecharModal();
                carregarUsuarios();
            }, 1200);
        } catch (err) {
            mostrarModalFeedback(err.message, "erro");
        }
    };

    function mostrarModalFeedback(msg, tipo) {
        const div = document.getElementById("modalFeedback");
        div.style.display = "block";
        div.style.backgroundColor = tipo === "sucesso" ? "#2e7d32" : "#b71c1c";
        div.style.color = "white";
        div.innerText = msg;
        setTimeout(() => { div.style.display = "none"; }, 2000);
    }

    async function confirmarExclusao(id, nome) {
        if (confirm(`Tem certeza que deseja excluir "${nome}"?`)) {
            try {
                const response = await fetch(`http://localhost:3000/admin/users/${id}`, {
                    method: "DELETE",
                    headers: { "X-User-Id": USUARIO_LOGADO.id }
                });
                const resultado = await response.json();
                if (!response.ok) throw new Error(resultado.erro || "Erro ao excluir");
                alert("Usuário excluído.");
                carregarUsuarios();
            } catch (err) {
                alert(`Erro: ${err.message}`);
            }
        }
    }

    document.getElementById("campoBusca").addEventListener("input", (e) => {
        filtroAtual = e.target.value;
        aplicarFiltro();
    });
    document.getElementById("btnLimparBusca").addEventListener("click", () => {
        document.getElementById("campoBusca").value = "";
        filtroAtual = "";
        aplicarFiltro();
    });

    
    carregarUsuarios();
