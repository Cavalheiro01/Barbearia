const db = require("../database/conexao");

function listarUsuarios(callback) {
    db.query(
        "SELECT id, nome, cpf, email, is_admin FROM clientes ORDER BY id",
        callback
    );
}

function criarUsuario(nome, cpf, email, senha, callback) {
  const sqlCheck = "SELECT * FROM clientes WHERE email = ?";

  db.query(sqlCheck, [email], (err, result) => {
    if (err) return callback(err);

    if (result.length > 0) {
      return callback(new Error("Email já cadastrado!"));
    }

    const sqlInsert = `
      INSERT INTO clientes (nome, cpf, email, senha, is_admin)
      VALUES (?, ?, ?, ?, 0)
    `;

    db.query(sqlInsert, [nome, cpf, email, senha], (err2) => {
      if (err2) return callback(err2);

      callback(null, "Cliente cadastrado com sucesso!");
    });
  });
}

function verificarAdminPorId(id, callback) {
    db.query(
        "SELECT is_admin FROM clientes WHERE id = ?",
        [id],
        callback
    );
}

function excluirUsuario(id, callback) {
    db.query(
        "DELETE FROM clientes WHERE id = ?",
        [id],
        callback
    );
}

function login(email, callback) {

  const sql = `
    SELECT id, nome, email, senha, is_admin
    FROM clientes
    WHERE email = ?
  `;

  db.query(sql, [email], (err, result) => {
    if (err) return callback(err);

    callback(null, result);
  });
}

module.exports = {
  criarUsuario,
  listarUsuarios,
  excluirUsuario,
  verificarAdminPorId,
  login
};