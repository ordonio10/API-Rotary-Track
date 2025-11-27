import { Router } from "express";
import clienteRoutes from "./clientes.js";
import veiculoRoutes from "./veiculos.js";

const router = Router();

router.use("/clientes", clienteRoutes);
router.use("/veiculos", veiculoRoutes);

export default router;
