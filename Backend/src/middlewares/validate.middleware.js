const { validationResult } = require('express-validator');
const AppError = require('../utils/app-error');

/** Colocar depois das regras de validação de cada rota. */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const firstError = errors.array()[0];
  next(new AppError(firstError.msg, 422));
}

module.exports = validate;
