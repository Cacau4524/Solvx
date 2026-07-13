const pool = require('../config/database');

async function listAll() {
  const [rows] = await pool.query('SELECT * FROM categories ORDER BY nome');
  return rows;
}

module.exports = { listAll };
