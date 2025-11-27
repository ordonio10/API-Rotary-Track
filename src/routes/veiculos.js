import { Router } from "express";

const router = Router();

// LISTAR
router.get("/", (req, res) => {
  res.json({ ok: true, veiculos: [] });
});

// CRIAR
router.post("/", (req, res) => {
  res.json({ ok: true, msg: "veiculo cadastrado" });
});

// BLOQUEAR
router.post("/bloquear", (req, res) => {
  const { imei } = req.body;
  console.log("Comando BLOQUEAR recebido para IMEI:", imei);
  res.json({ ok: true, msg: "comando enviado" });
});

// DESBLOQUEAR
router.post("/desbloquear", (req, res) => {
  const { imei } = req.body;
  console.log("Comando DESBLOQUEAR recebido para IMEI:", imei);
  res.json({ ok: true, msg: "comando enviado" });
});

export default router;
