const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET = "segredo-super-seguro";

// CADASTRAR
exports.cadastrar = async (req, res) => {
    try {
        const { nome, cpf, email, senha } = req.body;

        const senhaHash = await bcrypt.hash(senha, 10);

        Usuario.criarUsuario(
            nome,
            cpf,
            email,
            senhaHash,
            (err, result) => {
                if (err) {

                    if (err.message === "Email já cadastrado!") {
                        return res.status(400).send(err.message);
                    }

                    return res.status(500).send(err.message);
                }

                res.status(201).send(result);
            }
        );

    } catch (erro) {
        res.status(500).send("Erro ao criptografar senha");
    }
};

// LISTAR
exports.listar = (req, res) => {

    Usuario.listarUsuarios((err, result) => {

        if (err) {
            return res.status(500).send(err.message);
        }

        res.json(result);

    });

};

// EXCLUIR
exports.excluir = (req, res) => {

    const id = req.params.id;

    Usuario.excluirUsuario(id, (err) => {

        if (err) {
            return res.status(500).send(err.message);
        }

        res.send("Cliente removido!");

    });

};

// LOGIN

exports.login = (req, res) => {
    const { email, senha } = req.body;

    Usuario.login(email, async (err, result) => {

        if (err) {
            return res.status(500).send(err.message);
        }

        if (result.length === 0) {
            return res.status(401).send("Email ou senha inválidos");
        }

        const usuario = result[0];

        // comparar senha
        const senhaValida = await require("bcryptjs").compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.status(401).send("Senha inválida");
        }

        // gerar token
        const token = jwt.sign(
            {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                is_admin: usuario.is_admin
            },
            SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            mensagem: "Login realizado com sucesso",
            token
        });

    });
};
