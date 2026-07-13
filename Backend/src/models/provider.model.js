const pool = require('../config/database');

async function create(userId, dados) {
  const [result] = await pool.query(
    `INSERT INTO providers
       (user_id, rg, cep, rua, numero, complemento, bairro, cidade, estado,
        categoria_principal, especialidades, descricao, experiencia,
        preco_medio, cidade_atuacao, raio_atendimento)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId, dados.rg ?? null, dados.cep, dados.rua, dados.numero, dados.complemento ?? null,
      dados.bairro, dados.cidade, dados.estado, dados.categoriaPrincipal, dados.especialidades,
      dados.descricao, dados.experiencia, dados.precoMedio, dados.cidadeAtuacao, dados.raioAtendimento,
    ]
  );
  return result.insertId;
}

async function findByUserId(userId) {
  const [rows] = await pool.query('SELECT * FROM providers WHERE user_id = ? LIMIT 1', [userId]);
  return rows[0] ?? null;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM providers WHERE id = ? LIMIT 1', [id]);
  return rows[0] ?? null;
}

async function updateStatus(id, status, motivoReprovacao = null) {
  await pool.query('UPDATE providers SET status = ?, motivo_reprovacao = ? WHERE id = ?', [
    status,
    motivoReprovacao,
    id,
  ]);
}

async function updateVerification(id, { cpfValidado, documentoValidado, antecedentesVerificados }) {
  await pool.query(
    'UPDATE providers SET cpf_validado = ?, documento_validado = ?, antecedentes_verificados = ? WHERE id = ?',
    [cpfValidado, documentoValidado, antecedentesVerificados, id]
  );
}

async function updateProfile(id, dados) {
  await pool.query(
    `UPDATE providers SET categoria_principal = ?, especialidades = ?, descricao = ?,
       experiencia = ?, preco_medio = ?, cidade_atuacao = ?, raio_atendimento = ?
     WHERE id = ?`,
    [
      dados.categoriaPrincipal, dados.especialidades, dados.descricao, dados.experiencia,
      dados.precoMedio, dados.cidadeAtuacao, dados.raioAtendimento, id,
    ]
  );
}

module.exports = { create, findByUserId, findById, updateStatus, updateVerification, updateProfile };
