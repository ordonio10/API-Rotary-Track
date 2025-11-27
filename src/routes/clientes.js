import { Router } from "express";
import pool from "../config/db.js";

const router = Router();

// ========================
// LISTAR CLIENTES
// ========================
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clientes ORDER BY id ASC");
    res.json({ ok: true, clientes: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Erro ao listar clientes" });
  }
});

// ========================
// CRIAR CLIENTE
// ========================
router.post("/", async (req, res) => {
  try {
    const { nome, email, telefone, veiculo, placa } = req.body;

    // Salva o cliente
    const result = await pool.query(
      "INSERT INTO clientes (nome, email, telefone) VALUES ($1, $2, $3) RETURNING id",
      [nome, email, telefone]
    );

    const clienteId = result.rows[0].id;

    // Salva veículo se veio junto
    if (veiculo && placa) {
      await pool.query(
        "INSERT INTO veiculos (cliente_id, modelo, placa, cor, imei) VALUES ($1, $2, $3, '', '')",
        [clienteId, veiculo, placa]
      );
    }

    res.json({ ok: true, msg: "Cliente cadastrado!", id: clienteId });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Erro ao cadastrar cliente" });
  }
});

// ========================
// ATUALIZAR CLIENTE
// ========================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone } = req.body;

    await pool.query(
      "UPDATE clientes SET nome=$1, email=$2, telefone=$3 WHERE id=$4",
      [nome, email, telefone, id]
    );

    res.json({ ok: true, msg: "Cliente atualizado!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Erro ao atualizar cliente" });
  }
});

// ========================
// REMOVER CLIENTE
// ========================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM clientes WHERE id=$1", [id]);

    res.json({ ok: true, msg: "Cliente removido!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Erro ao remover cliente" });
  }
});

export default router;
