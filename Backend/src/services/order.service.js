const orderModel = require('../models/order.model');
const clientModel = require('../models/client.model');
const providerModel = require('../models/provider.model');
const AppError = require('../utils/app-error');

async function createOrder(userId, dados) {
  const client = await clientModel.findByUserId(userId);
  if (!client) throw new AppError('Apenas clientes podem solicitar serviços.', 403);

  const orderId = await orderModel.create(client.id, dados);
  return orderModel.findById(orderId);
}

async function listMine(userId) {
  const client = await clientModel.findByUserId(userId);
  if (!client) throw new AppError('Apenas clientes podem acessar esta rota.', 403);
  return orderModel.listByClient(client.id);
}

async function listReceived(userId) {
  const provider = await providerModel.findByUserId(userId);
  if (!provider) throw new AppError('Apenas prestadores podem acessar esta rota.', 403);
  return orderModel.listByProvider(provider.id);
}

async function accept(userId, orderId, valorOrcado) {
  const provider = await providerModel.findByUserId(userId);
  if (!provider) throw new AppError('Apenas prestadores podem aceitar solicitações.', 403);
  if (provider.status !== 'APROVADO') throw new AppError('Sua conta ainda não foi aprovada.', 403);

  await orderModel.updateStatus(orderId, 'ACEITA', { providerId: provider.id, valorOrcado });
  return orderModel.findById(orderId);
}

async function reject(userId, orderId) {
  await orderModel.updateStatus(orderId, 'RECUSADA');
}

async function markCompleted(userId, orderId) {
  await orderModel.updateStatus(orderId, 'CONCLUIDA');
  return orderModel.findById(orderId);
}

async function cancel(userId, orderId) {
  await orderModel.updateStatus(orderId, 'CANCELADA');
}

module.exports = { createOrder, listMine, listReceived, accept, reject, markCompleted, cancel };
