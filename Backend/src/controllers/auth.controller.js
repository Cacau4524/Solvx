const authService = require('../services/auth.service');
const userService = require('../services/user.service');
const asyncHandler = require('../utils/async-handler');

const registerClient = asyncHandler(async (req, res) => {
  const session = await authService.registerClient(req.body);
  res.status(201).json(session);
});

const registerProvider = asyncHandler(async (req, res) => {
  const result = await authService.registerProvider(req.body);
  res.status(201).json(result);
});

const loginClient = asyncHandler(async (req, res) => {
  const { email, senha } = req.body;
  const session = await authService.loginClient(email, senha);
  res.json(session);
});

const loginProvider = asyncHandler(async (req, res) => {
  const { email, senha } = req.body;
  const session = await authService.loginProvider(email, senha);
  res.json(session);
});

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const tokens = await authService.refresh(refreshToken);
  res.json(tokens);
});

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  await authService.logout(refreshToken);
  res.status(204).send();
});

const getProfile = asyncHandler(async (req, res) => {
  const profile = await userService.getProfile(req.user.id);
  res.json(profile);
});

const updateProfile = asyncHandler(async (req, res) => {
  const profile = await userService.updateProfile(req.user.id, req.body);
  res.json(profile);
});

module.exports = {
  registerClient, registerProvider, loginClient, loginProvider,
  refresh, logout, getProfile, updateProfile,
};
