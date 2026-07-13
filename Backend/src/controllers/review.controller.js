const reviewService = require('../services/review.service');
const asyncHandler = require('../utils/async-handler');

const create = asyncHandler(async (req, res) => {
  const review = await reviewService.create(req.user.id, req.body);
  res.status(201).json(review);
});

const listForProvider = asyncHandler(async (req, res) => {
  const reviews = await reviewService.listForProvider(req.params.providerId);
  res.json(reviews);
});

const getSummary = asyncHandler(async (req, res) => {
  const summary = await reviewService.getSummary(req.params.providerId);
  res.json(summary);
});

module.exports = { create, listForProvider, getSummary };
