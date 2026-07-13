const orderService = require('../services/order.service');
const asyncHandler = require('../utils/async-handler');

const create = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.user.id, req.body);
  res.status(201).json(order);
});

const listMine = asyncHandler(async (req, res) => {
  const orders = await orderService.listMine(req.user.id);
  res.json(orders);
});

const listReceived = asyncHandler(async (req, res) => {
  const orders = await orderService.listReceived(req.user.id);
  res.json(orders);
});

const accept = asyncHandler(async (req, res) => {
  const order = await orderService.accept(req.user.id, req.params.id, req.body.valorOrcado);
  res.json(order);
});

const reject = asyncHandler(async (req, res) => {
  await orderService.reject(req.user.id, req.params.id);
  res.status(204).send();
});

const complete = asyncHandler(async (req, res) => {
  const order = await orderService.markCompleted(req.user.id, req.params.id);
  res.json(order);
});

const cancel = asyncHandler(async (req, res) => {
  await orderService.cancel(req.user.id, req.params.id);
  res.status(204).send();
});

module.exports = { create, listMine, listReceived, accept, reject, complete, cancel };
