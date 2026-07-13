const reviewModel = require('../models/review.model');
const clientModel = require('../models/client.model');
const orderModel = require('../models/order.model');
const AppError = require('../utils/app-error');

async function create(userId, { orderId, nota, comentario }) {
  const client = await clientModel.findByUserId(userId);
  if (!client) throw new AppError('Apenas clientes podem avaliar um serviço.', 403);

  const order = await orderModel.findById(orderId);
  if (!order || order.client_id !== client.id) {
    throw new AppError('Solicitação não encontrada para este cliente.', 404);
  }
  if (order.status !== 'CONCLUIDA') {
    throw new AppError('Só é possível avaliar serviços concluídos.', 422);
  }

  return reviewModel.create({ orderId, clientId: client.id, providerId: order.provider_id, nota, comentario });
}

async function listForProvider(providerId) {
  return reviewModel.listByProvider(providerId);
}

async function getSummary(providerId) {
  const summary = await reviewModel.getSummaryByProvider(providerId);
  return { mediaNotas: Number(summary.media) || 0, totalAvaliacoes: summary.total };
}

module.exports = { create, listForProvider, getSummary };
