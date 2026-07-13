const pool = require('../config/database');

async function create({ orderId, clientId, providerId, nota, comentario }) {
  const [result] = await pool.query(
    `INSERT INTO reviews (order_id, client_id, provider_id, nota, comentario) VALUES (?, ?, ?, ?, ?)`,
    [orderId, clientId, providerId, nota, comentario ?? null]
  );
  return result.insertId;
}

async function listByProvider(providerId) {
  const [rows] = await pool.query(
    `SELECT r.*, u.nome_completo AS cliente_nome
     FROM reviews r
     JOIN clients c ON c.id = r.client_id
     JOIN users u ON u.id = c.user_id
     WHERE r.provider_id = ?
     ORDER BY r.criado_em DESC`,
    [providerId]
  );
  return rows;
}

async function getSummaryByProvider(providerId) {
  const [rows] = await pool.query(
    `SELECT ROUND(AVG(nota), 1) AS media, COUNT(*) AS total FROM reviews WHERE provider_id = ?`,
    [providerId]
  );
  return rows[0];
}

module.exports = { create, listByProvider, getSummaryByProvider };
