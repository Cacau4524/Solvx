const bcrypt = require('bcrypt');
const pool = require('../config/database');
const userModel = require('../models/user.model');
const clientModel = require('../models/client.model');
const providerModel = require('../models/provider.model');
const AppError = require('../utils/app-error');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

function buildUserResponse(user, extra = {}) {
  const base = {
    id: user.id,
    nomeCompleto: user.nome_completo,
    email: user.email,
    role: user.role,
  };
  return { ...base, ...extra };
}

async function registerClient(dados) {
  const jaExiste = await userModel.existsByEmailOrCpf(dados.email, dados.cpf);
  if (jaExiste) throw new AppError('Já existe uma conta com este e-mail ou CPF.', 409);

  const senhaHash = await bcrypt.hash(dados.senha, SALT_ROUNDS);

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const userId = await userModel.create({
      nomeCompleto: dados.nomeCompleto,
      email: dados.email,
      senhaHash,
      telefone: dados.telefone,
      cpf: dados.cpf,
      role: 'cliente',
      dataNascimento: dados.dataNascimento,
      genero: dados.genero,
    });

    await clientModel.create(userId, {
      cep: dados.cep, rua: dados.rua, numero: dados.numero, complemento: dados.complemento,
      bairro: dados.bairro, cidade: dados.cidade, estado: dados.estado,
    });

    await connection.commit();

    const user = await userModel.findById(userId);
    return issueSession(buildUserResponse(user));
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

async function registerProvider(dados) {
  const { dadosPessoais, endereco, informacoesProfissionais } = dados;

  const jaExiste = await userModel.existsByEmailOrCpf(dadosPessoais.email, dadosPessoais.cpf);
  if (jaExiste) throw new AppError('Já existe uma conta com este e-mail ou CPF.', 409);

  const senhaHash = await bcrypt.hash(dadosPessoais.senha, SALT_ROUNDS);

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const userId = await userModel.create({
      nomeCompleto: dadosPessoais.nomeCompleto,
      email: dadosPessoais.email,
      senhaHash,
      telefone: dadosPessoais.telefone,
      cpf: dadosPessoais.cpf,
      role: 'prestador',
      dataNascimento: dadosPessoais.dataNascimento,
      genero: dadosPessoais.genero,
    });

    await providerModel.create(userId, {
      rg: dadosPessoais.rg,
      ...endereco,
      categoriaPrincipal: informacoesProfissionais.categoriaPrincipal,
      especialidades: informacoesProfissionais.especialidades,
      descricao: informacoesProfissionais.descricao,
      experiencia: informacoesProfissionais.experiencia,
      precoMedio: informacoesProfissionais.precoMedio,
      cidadeAtuacao: informacoesProfissionais.cidadeAtuacao,
      raioAtendimento: informacoesProfissionais.raioAtendimento,
    });

    await connection.commit();

    const user = await userModel.findById(userId);
    const provider = await providerModel.findByUserId(userId);
    // O prestador já recebe uma sessão válida (com status EM_ANALISE no payload),
    // para que o providerStatusGuard do frontend consiga redirecioná-lo
    // corretamente caso ele navegue para outra rota antes da aprovação.
    return issueSession(buildUserResponse(user, { status: provider.status }));
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

async function loginClient(email, senha) {
  const user = await userModel.findByEmail(email);
  if (!user || user.role !== 'cliente') throw new AppError('E-mail ou senha incorretos.', 401);

  const senhaCorreta = await bcrypt.compare(senha, user.senha_hash);
  if (!senhaCorreta) throw new AppError('E-mail ou senha incorretos.', 401);

  return issueSession(buildUserResponse(user));
}

async function loginProvider(email, senha) {
  const user = await userModel.findByEmail(email);
  if (!user || user.role !== 'prestador') throw new AppError('E-mail ou senha incorretos.', 401);

  const senhaCorreta = await bcrypt.compare(senha, user.senha_hash);
  if (!senhaCorreta) throw new AppError('E-mail ou senha incorretos.', 401);

  const provider = await providerModel.findByUserId(user.id);

  return issueSession(
    buildUserResponse(user, {
      status: provider.status,
      motivoReprovacao: provider.motivo_reprovacao ?? undefined,
    })
  );
}

async function issueSession(userPayload) {
  const tokenPayload = { id: userPayload.id, role: userPayload.role, email: userPayload.email };
  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);

  const expiraEm = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias
  await pool.query('INSERT INTO refresh_tokens (user_id, token, expira_em) VALUES (?, ?, ?)', [
    userPayload.id,
    refreshToken,
    expiraEm,
  ]);

  return { accessToken, refreshToken, user: userPayload };
}

async function refresh(oldRefreshToken) {
  let payload;
  try {
    payload = verifyRefreshToken(oldRefreshToken);
  } catch {
    throw new AppError('Refresh token inválido ou expirado.', 401);
  }

  const [rows] = await pool.query(
    'SELECT * FROM refresh_tokens WHERE token = ? AND revogado = FALSE LIMIT 1',
    [oldRefreshToken]
  );
  if (rows.length === 0) throw new AppError('Refresh token inválido ou já utilizado.', 401);

  // Rotaciona o refresh token (revoga o antigo, emite um novo).
  await pool.query('UPDATE refresh_tokens SET revogado = TRUE WHERE id = ?', [rows[0].id]);

  const tokenPayload = { id: payload.id, role: payload.role, email: payload.email };
  const accessToken = signAccessToken(tokenPayload);
  const newRefreshToken = signRefreshToken(tokenPayload);

  const expiraEm = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await pool.query('INSERT INTO refresh_tokens (user_id, token, expira_em) VALUES (?, ?, ?)', [
    payload.id,
    newRefreshToken,
    expiraEm,
  ]);

  return { accessToken, refreshToken: newRefreshToken };
}

async function logout(refreshToken) {
  await pool.query('UPDATE refresh_tokens SET revogado = TRUE WHERE token = ?', [refreshToken]);
}

module.exports = { registerClient, registerProvider, loginClient, loginProvider, refresh, logout };
