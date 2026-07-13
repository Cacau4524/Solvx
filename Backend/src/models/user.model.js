const pool = require('../config/database');

async function create({ nomeCompleto, email, senhaHash, telefone, cpf, role, dataNascimento, genero }) {
  const [result] = await pool.query(
    `INSERT INTO users (nome_completo, email, senha_hash, telefone, cpf, role, data_nascimento, genero)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [nomeCompleto, email, senhaHash, telefone ?? null, cpf ?? null, role, dataNascimento ?? null, genero ?? null]
  );
  return result.insertId;
}

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  return rows[0] ?? null;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
  return rows[0] ?? null;
}

async function updateProfile(id, { nomeCompleto, telefone }) {
  await pool.query('UPDATE users SET nome_completo = ?, telefone = ? WHERE id = ?', [nomeCompleto, telefone, id]);
}

async function existsByEmailOrCpf(email, cpf) {
  const [rows] = await pool.query('SELECT id FROM users WHERE email = ? OR (cpf IS NOT NULL AND cpf = ?) LIMIT 1', [
    email,
    cpf ?? null,
  ]);
  return rows.length > 0;
}

module.exports = { create, findByEmail, findById, updateProfile, existsByEmailOrCpf };
