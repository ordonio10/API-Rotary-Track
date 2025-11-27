import { Router } from "express";
import pool from "../config/db.js";

const router = Router();

// ========================
// LISTAR VEÍCULOS
// ========================
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        v.id,
        v.modelo,
        v.placa,
        v.cor,
        v.imei,
        v.status,
        c.nome AS cliente
      FROM veiculos v
      LEFT JOIN clientes c ON c.id = v.cliente_id
      ORDER BY v.id ASC
    `);

    res.json({ ok: true, veiculos: result.rows });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Erro ao listar veículos" });
  }
});

// ========================
// CRIAR VEÍCULO
// ========================
router.post("/", async (req, res) => {
  try {
    const { cliente_id, modelo, placa, cor, imei } = req.body;

    await pool.query(
      `INSERT INTO veiculos (cliente_id, modelo, placa, cor, imei, status)
       VALUES ($1, $2, $3, $4, $5, 'normal')`,
      [cliente_id, modelo, placa, cor, imei]
    );

    res.json({ ok: true, msg: "Veículo cadastrado!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Erro ao cadastrar veículo" });
  }
});

// ========================
// EDITAR VEÍCULO
// ========================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { cliente_id, modelo, placa, cor, imei, status } = req.body;

    await pool.query(
      `UPDATE veiculos
       SET cliente_id=$1, modelo=$2, placa=$3, cor=$4, imei=$5, status=$6
       WHERE id=$7`,
      [cliente_id, modelo, placa, cor, imei, status, id]
    );

    res.json({ ok: true, msg: "Veículo atualizado!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Erro ao atualizar veículo" });
  }
});

// ========================
// REMOVER VEÍCULO
// ========================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM veiculos WHERE id=$1", [id]);

    res.json({ ok: true, msg: "Veículo removido!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Erro ao remover veículo" });
  }
});

// ========================
// BLOQUEAR VEÍCULO
// ========================
router.post("/bloquear", async (req, res) => {
  try {
    const { veiculo_id, imei } = req.body;

    // Registra comando
    await pool.query(
      `INSERT INTO comandos (veiculo_id, comando)
       VALUES ($1, 'BLOQUEAR')`,
      [veiculo_id]
    );

    // Atualiza status
    await pool.query(
      "UPDATE veiculos SET status='bloqueado' WHERE id=$1",
      [veiculo_id]
    );

    console.log("Comando BLOQUEAR enviado para IMEI:", imei);

    res.json({ ok: true, msg: "Veículo bloqueado!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Erro ao bloquear veículo" });
  }
});

// ========================
// DESBLOQUEAR VEÍCULO
// ========================
router.post("/desbloquear", async (req, res) => {
  try {
    const { veiculo_id, imei } = req.body;

    // Registra comando
    await pool.query(
      `INSERT INTO comandos (veiculo_id, comando)
       VALUES ($1, 'DESBLOQUEAR')`,
      [veiculo_id]
    );

    // Atualiza status
    await pool.query(
      "UPDATE veiculos SET status='normal' WHERE id=$1",
      [veiculo_id]
    );

    console.log("Comando DESBLOQUEAR enviado para IMEI:", imei);

    res.json({ ok: true, msg: "Veículo desbloqueado!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Erro ao desbloquear veículo" });
  }
});

export default router;
