const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuario");

// Middleware para verificar se o usuário é administrador
function verificarAdmin(req, res, next) {

    const userId = req.headers["x-user-id"];

    if (!userId) {
        return res.status(401).json({
            erro: "Usuário não autenticado"
        });
    }

    Usuario.verificarAdminPorId(userId, (err, results) => {

        if (err || results.length === 0) {
            return res.status(403).json({
                erro: "Acesso negado"
            });
        }

        if (results[0].is_admin !== 1) {
            return res.status(403).json({
                erro: "Permissão de administrador necessária"
            });
        }

        next();

    });

}

// Listar todos os usuários
router.get("/users", verificarAdmin, (req, res) => {

    Usuario.listarUsuarios((err, results) => {

        if (err) {
            return res.status(500).json({
                erro: err.message
            });
        }

        res.json(results);

    });

});

// Atualizar usuário
router.put("/users/:id", verificarAdmin, (req, res) => {

    const userId = req.params.id;
    const { nome, cpf, email, senha, is_admin } = req.body;

    if (!nome || !cpf || !email) {
        return res.status(400).json({
            erro: "Nome, CPF e email são obrigatórios"
        });
    }

    let sql = "UPDATE clientes SET nome = ?, cpf = ?, email = ?, is_admin = ?";
    const params = [nome, cpf, email, is_admin];

    if (senha && senha.trim() !== "") {
        sql += ", senha = ?";
        params.push(senha);
    }

    sql += " WHERE id = ?";
    params.push(userId);

    // Por enquanto continua aqui
    // Depois podemos mover para Usuario.atualizarUsuario()

    const db = require("../database/conexão");

    db.query(sql, params, (err, result) => {

        if (err) {
            return res.status(500).json({
                erro: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                erro: "Usuário não encontrado"
            });
        }

        res.json({
            mensagem: "Usuário atualizado com sucesso!"
        });

    });

});

// Excluir usuário
router.delete("/users/:id", verificarAdmin, (req, res) => {

    const userId = req.params.id;
    const requesterId = req.headers["x-user-id"];

    // Impedir auto-exclusão
    if (parseInt(userId) === parseInt(requesterId)) {
        return res.status(400).json({
            erro: "Você não pode excluir seu próprio usuário."
        });
    }

    Usuario.excluirUsuario(userId, (err, result) => {

        if (err) {
            return res.status(500).json({
                erro: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                erro: "Usuário não encontrado"
            });
        }

        res.json({
            mensagem: "Usuário excluído permanentemente."
        });

    });

});

module.exports = router;