import pool from "./db.js";

async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100),
        email VARCHAR(150) UNIQUE,
        senha VARCHAR(200),
        tipo VARCHAR(20) -- admin ou cliente
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(120),
        email VARCHAR(150),
        telefone VARCHAR(20)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS veiculos (
        id SERIAL PRIMARY KEY,
        cliente_id INTEGER REFERENCES clientes(id) ON DELETE CASCADE,
        modelo VARCHAR(100),
        placa VARCHAR(20),
        cor VARCHAR(30),
        imei VARCHAR(30) UNIQUE,
        status VARCHAR(20) DEFAULT 'normal'
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS posicoes (
        id SERIAL PRIMARY KEY,
        veiculo_id INTEGER REFERENCES veiculos(id) ON DELETE CASCADE,
        latitude NUMERIC,
        longitude NUMERIC,
        velocidade NUMERIC,
        data_hora TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS comandos (
        id SERIAL PRIMARY KEY,
        veiculo_id INTEGER REFERENCES veiculos(id) ON DELETE CASCADE,
        comando VARCHAR(50),
        data_hora TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("Todas as tabelas foram criadas!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit();
  }
}

createTables();
