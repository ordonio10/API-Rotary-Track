import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

// NÃO IMPORTAR dotenv-loader
// import "./config/dotenv-loader.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("API rotária rodando na porta " + PORT);
});

// Iniciar servidor TCP
import "./tcp/server.js";
