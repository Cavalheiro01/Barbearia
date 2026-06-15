const express = require("express");
const router = express.Router();

const adminController = require("../controller/adminController");

router.get(
    "/users",
    adminController.verificarAdmin,
    adminController.listarUsuarios
);

router.put(
    "/users/:id",
    adminController.verificarAdmin,
    adminController.atualizarUsuario
);

router.delete(
    "/users/:id",
    adminController.verificarAdmin,
    adminController.excluirUsuario
);

module.exports = router;