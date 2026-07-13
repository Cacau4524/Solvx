const pool = require('../config/database');

async function create({ userId, tipo, url, nomeOriginal }) {
  const [result] = await pool.query(
    'INSERT INTO uploads (user_id, tipo, url, nome_original) VALUES (?, ?, ?, ?)',
    [userId, tipo, url, nomeOriginal ?? null]
  );
  return result.insertId;
}

module.exports = { create };
