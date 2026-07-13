const AppError = require('../utils/app-error');
const { verifyAccessToken } = require('../utils/jwt');

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('Token de autenticação não informado.', 401));
  }

  const token = header.replace('Bearer ', '');

  try {
    const payload = verifyAccessToken(token);
    req.user = payload; // { id, role, email }
    next();
  } catch (err) {
    next(new AppError('Token inválido ou expirado.', 401));
  }
}

module.exports = authMiddleware;
