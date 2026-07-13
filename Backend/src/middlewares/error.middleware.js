function errorMiddleware(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational === true;

  if (!isOperational) {
    // Erro inesperado (bug, falha de conexão, etc.) — loga completo no servidor,
    // mas não vaza detalhes internos para o cliente.
    console.error('[ERRO NÃO TRATADO]', err);
  }

  res.status(statusCode).json({
    success: false,
    message: isOperational ? err.message : 'Erro interno do servidor.',
  });
}

module.exports = errorMiddleware;
