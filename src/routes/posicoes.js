import { Router } from "express";
import pool from "../config/db.js";

const router = Router();

// Rota para pegar a última posição registrada
router.get("/ultima", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM posicoes
      ORDER BY data_hora DESC
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return res.json({ ok: true, posicao: null });
    }

    return res.json({ ok: true, posicao: result.rows[0] });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Erro ao buscar última posição" });
  }
});

export default router;
