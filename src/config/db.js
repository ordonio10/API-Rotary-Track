import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString:
    "postgresql://postgres:zUtODRrHVoZpXXTGzhLbGUoiklDIWOky@caboose.proxy.rlwy.net:39090/railway",
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;
