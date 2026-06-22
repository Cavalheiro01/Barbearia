const Usuario = require("../models/usuario");
const db = require("../database/conexão");
const jwt = require("jsonwebtoken");
const SECRET = "segredo-super-seguro";


// Middleware para verificar se o usuário é administrador

exports.verificarAdmin = (req, res, next) => {

    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ erro: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, SECRET);

        if (decoded.is_admin !== 1) {
            return res.status(403).json({
                erro: "Permissão de administrador necessária"
            });
        }

        req.user = decoded;
        next();

    } catch (err) {
        return res.status(401).json({ erro: "Token inválido" });
    }
};


// Listar usuários
exports.listarUsuarios = (req, res) => {

    Usuario.listarUsuarios((err, results) => {

        if (err) {
            return res.status(500).json({
                erro: err.message
            });
        }

        res.json(results);

    });

};

// Atualizar usuário
exports.atualizarUsuario = (req, res) => {

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

};

// Excluir usuário
exports.excluirUsuario = (req, res) => {

    const userId = req.params.id;
    const requesterId = req.headers["x-user-id"];

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

};