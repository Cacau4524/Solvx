const categoryModel = require('../models/category.model');
const asyncHandler = require('../utils/async-handler');

const list = asyncHandler(async (req, res) => {
  const categories = await categoryModel.listAll();
  res.json(categories);
});

module.exports = { list };
