import pool from "./db.js";

async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(150),
        telefone VARCHAR(50),
        senha VARCHAR(200),
        criado_em TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS veiculos (
        id SERIAL PRIMARY KEY,
        cliente_id INTEGER REFERENCES clientes(id) ON DELETE CASCADE,
        modelo VARCHAR(100),
        placa VARCHAR(20),
        cor VARCHAR(50),
        imei VARCHAR(30),
        status VARCHAR(20) DEFAULT 'normal',
        criado_em TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS posicoes (
        id SERIAL PRIMARY KEY,
        veiculo_id INTEGER REFERENCES veiculos(id) ON DELETE CASCADE,
        latitude DOUBLE PRECISION NOT NULL,
        longitude DOUBLE PRECISION NOT NULL,
        velocidade INTEGER DEFAULT 0,
        curso INTEGER DEFAULT 0,
        satelites INTEGER DEFAULT 0,
        data_hora TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS cercas (
        id SERIAL PRIMARY KEY,
        cliente_id INTEGER REFERENCES clientes(id) ON DELETE CASCADE,
        nome VARCHAR(100),
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        raio INTEGER,
        criado_em TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS comandos (
        id SERIAL PRIMARY KEY,
        veiculo_id INTEGER REFERENCES veiculos(id) ON DELETE CASCADE,
        comando VARCHAR(200),
        resposta TEXT,
        enviado_em TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS historico (
        id SERIAL PRIMARY KEY,
        veiculo_id INTEGER REFERENCES veiculos(id) ON DELETE CASCADE,
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        velocidade INTEGER,
        data_hora TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("Todas as tabelas foram criadas com sucesso!");
  } catch (err) {
    console.error("Erro ao criar tabelas:", err);
  } finally {
    pool.end();
  }
}

createTables();
