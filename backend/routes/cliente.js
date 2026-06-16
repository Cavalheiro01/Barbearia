const express = require("express");
const router = express.Router();

const clienteController = require("../controller/clientesController");

router.post("/", clienteController.cadastrar);

router.get("/", clienteController.listar);

router.delete("/:id", clienteController.excluir);

router.post("/login", clienteController.login);

module.exports = router;