const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
 
// app.use("/frontend", express.static(path.join(__dirname, "frontend")));
 
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "frontend", "paginaInicial.html"));
// });
 
 
 
const clientesRoutes = require("./backend/routes/cliente");
const adminRoutes = require("./backend/routes/admin");
 
app.use("/cliente", clientesRoutes);
app.use("/admin", adminRoutes);
 
const PORT = process.env.PORT || 3000;
 
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});