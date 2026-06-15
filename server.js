const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static(__dirname));

const clientesRoutes = require("./backend/routes/clientes");
const adminRoutes = require("./backend/routes/admin");  
app.use("/clientes", clientesRoutes);
app.use("/admin", adminRoutes);                  

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});