const pool = require('../config/database');

async function create(userId, { cep, rua, numero, complemento, bairro, cidade, estado }) {
  const [result] = await pool.query(
    `INSERT INTO clients (user_id, cep, rua, numero, complemento, bairro, cidade, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, cep, rua, numero, complemento ?? null, bairro, cidade, estado]
  );
  return result.insertId;
}

async function findByUserId(userId) {
  const [rows] = await pool.query('SELECT * FROM clients WHERE user_id = ? LIMIT 1', [userId]);
  return rows[0] ?? null;
}

module.exports = { create, findByUserId };
