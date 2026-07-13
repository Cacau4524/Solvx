const userService = require('../services/user.service');
const asyncHandler = require('../utils/async-handler');

const listUsers = asyncHandler(async (req, res) => {
  const users = await userService.listUsers(req.query);
  res.json(users);
});

const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.json(user);
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.params.id, req.body);
  res.json(user);
});

const deleteUser = asyncHandler(async (req, res) => {
  await userService.deactivateUser(req.params.id);
  res.status(204).send();
});

module.exports = { listUsers, getUser, updateUser, deleteUser };
