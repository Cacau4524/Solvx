const pool = require('../config/database');
const userModel = require('../models/user.model');
const AppError = require('../utils/app-error');

async function getProfile(userId) {
  const user = await userModel.findById(userId);
  if (!user) throw new AppError('Usuário não encontrado.', 404);

  const { senha_hash, ...safeUser } = user;
  return safeUser;
}

async function updateProfile(userId, dados) {
  await userModel.updateProfile(userId, dados);
  return getProfile(userId);
}

async function listUsers({ page = 1, limit = 20 }) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    'SELECT id, nome_completo, email, role, ativo, criado_em FROM users ORDER BY criado_em DESC LIMIT ? OFFSET ?',
    [Number(limit), Number(offset)]
  );
  return rows;
}

async function getUserById(id) {
  return getProfile(id);
}

async function deactivateUser(id) {
  await pool.query('UPDATE users SET ativo = FALSE WHERE id = ?', [id]);
}

module.exports = { getProfile, updateProfile, listUsers, getUserById, deactivateUser };
