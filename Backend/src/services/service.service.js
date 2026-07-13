const pool = require('../config/database');
const providerModel = require('../models/provider.model');
const AppError = require('../utils/app-error');

async function list({ categoria, cidade } = {}) {
  const conditions = ['s.ativo = TRUE'];
  const params = [];

  if (categoria) { conditions.push('c.nome = ?'); params.push(categoria); }
  if (cidade) { conditions.push('p.cidade_atuacao = ?'); params.push(cidade); }

  const [rows] = await pool.query(
    `SELECT s.*, c.nome AS categoria_nome, p.id AS provider_id, u.nome_completo AS prestador_nome
     FROM services s
     JOIN providers p ON p.id = s.provider_id
     JOIN users u ON u.id = p.user_id
     LEFT JOIN categories c ON c.id = s.category_id
     WHERE ${conditions.join(' AND ')}
     ORDER BY s.criado_em DESC`,
    params
  );
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(
    `SELECT s.*, c.nome AS categoria_nome, p.id AS provider_id, u.nome_completo AS prestador_nome
     FROM services s
     JOIN providers p ON p.id = s.provider_id
     JOIN users u ON u.id = p.user_id
     LEFT JOIN categories c ON c.id = s.category_id
     WHERE s.id = ?`,
    [id]
  );
  if (rows.length === 0) throw new AppError('Serviço não encontrado.', 404);
  return rows[0];
}

async function create(userId, { titulo, descricao, preco, categoryId }) {
  const provider = await providerModel.findByUserId(userId);
  if (!provider) throw new AppError('Apenas prestadores podem cadastrar serviços.', 403);
  if (provider.status !== 'APROVADO') {
    throw new AppError('Sua conta ainda não foi aprovada para oferecer serviços.', 403);
  }

  const [result] = await pool.query(
    'INSERT INTO services (provider_id, category_id, titulo, descricao, preco) VALUES (?, ?, ?, ?, ?)',
    [provider.id, categoryId ?? null, titulo, descricao, preco]
  );
  return getById(result.insertId);
}

async function update(userId, serviceId, dados) {
  const provider = await providerModel.findByUserId(userId);
  const service = await getById(serviceId);

  if (!provider || service.provider_id !== provider.id) {
    throw new AppError('Você não tem permissão para editar este serviço.', 403);
  }

  await pool.query('UPDATE services SET titulo = ?, descricao = ?, preco = ? WHERE id = ?', [
    dados.titulo, dados.descricao, dados.preco, serviceId,
  ]);
  return getById(serviceId);
}

async function remove(userId, serviceId) {
  const provider = await providerModel.findByUserId(userId);
  const service = await getById(serviceId);

  if (!provider || service.provider_id !== provider.id) {
    throw new AppError('Você não tem permissão para remover este serviço.', 403);
  }

  await pool.query('DELETE FROM services WHERE id = ?', [serviceId]);
}

module.exports = { list, getById, create, update, remove };
