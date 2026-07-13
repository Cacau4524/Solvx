const AppError = require('../utils/app-error');

/** Uso: router.get('/rota', authMiddleware, requireRole('admin'), handler) */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AppError('Você não tem permissão para acessar este recurso.', 403));
    }
    next();
  };
}

module.exports = requireRole;
