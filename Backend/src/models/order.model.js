const pool = require('../config/database');

async function create(clientId, { categoriaId, descricao, cep, rua, numero, complemento, bairro, cidade, estado, dataPreferida }) {
  const [result] = await pool.query(
    `INSERT INTO orders (client_id, category_id, descricao, cep, rua, numero, complemento, bairro, cidade, estado, data_preferida)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [clientId, categoriaId ?? null, descricao, cep, rua, numero, complemento ?? null, bairro, cidade, estado, dataPreferida ?? null]
  );
  return result.insertId;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM orders WHERE id = ? LIMIT 1', [id]);
  return rows[0] ?? null;
}

async function listByClient(clientId) {
  const [rows] = await pool.query(
    `SELECT o.*, c.nome_completo AS prestador_nome
     FROM orders o
     LEFT JOIN providers p ON p.id = o.provider_id
     LEFT JOIN users c ON c.id = p.user_id
     WHERE o.client_id = ?
     ORDER BY o.criado_em DESC`,
    [clientId]
  );
  return rows;
}

async function listByProvider(providerId) {
  const [rows] = await pool.query(
    `SELECT o.*, u.nome_completo AS cliente_nome
     FROM orders o
     JOIN clients cl ON cl.id = o.client_id
     JOIN users u ON u.id = cl.user_id
     WHERE o.provider_id = ? OR (o.provider_id IS NULL AND o.status = 'AGUARDANDO_ORCAMENTO')
     ORDER BY o.criado_em DESC`,
    [providerId]
  );
  return rows;
}

async function updateStatus(id, status, extra = {}) {
  const fields = ['status = ?'];
  const values = [status];

  if (extra.providerId !== undefined) { fields.push('provider_id = ?'); values.push(extra.providerId); }
  if (extra.valorOrcado !== undefined) { fields.push('valor_orcado = ?'); values.push(extra.valorOrcado); }

  values.push(id);
  await pool.query(`UPDATE orders SET ${fields.join(', ')} WHERE id = ?`, values);
}

module.exports = { create, findById, listByClient, listByProvider, updateStatus };
