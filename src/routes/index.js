import { Router } from "express";
import clienteRoutes from "./clientes.js";
import veiculoRoutes from "./veiculos.js";
import posicoes from "./posicoes.js"; // ADICIONAR

const router = Router();

router.use("/clientes", clienteRoutes);
router.use("/veiculos", veiculoRoutes);
router.use("/posicoes", posicoes); // ADICIONAR

export default router;
