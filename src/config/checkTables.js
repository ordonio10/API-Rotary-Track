import pool from "./db.js";

async function checkTables() {
  try {
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public';
    `);

    console.log("📌 Tabelas encontradas no banco:");
    console.log(result.rows);

    process.exit(0);
  } catch (err) {
    console.error("❌ Erro verificando tabelas:", err);
    process.exit(1);
  }
}

checkTables();
