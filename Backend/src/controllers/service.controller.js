const serviceService = require('../services/service.service');
const asyncHandler = require('../utils/async-handler');

const list = asyncHandler(async (req, res) => {
  const services = await serviceService.list(req.query);
  res.json(services);
});

const getById = asyncHandler(async (req, res) => {
  const service = await serviceService.getById(req.params.id);
  res.json(service);
});

const create = asyncHandler(async (req, res) => {
  const service = await serviceService.create(req.user.id, req.body);
  res.status(201).json(service);
});

const update = asyncHandler(async (req, res) => {
  const service = await serviceService.update(req.user.id, req.params.id, req.body);
  res.json(service);
});

const remove = asyncHandler(async (req, res) => {
  await serviceService.remove(req.user.id, req.params.id);
  res.status(204).send();
});

module.exports = { list, getById, create, update, remove };
