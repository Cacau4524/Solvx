const { Router } = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

const router = Router();

const emailSenhaRules = [
  body('email').isEmail().withMessage('Informe um e-mail válido.'),
  body('senha').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres.'),
];

router.post(
  '/client/register',
  [
    body('nomeCompleto').notEmpty().withMessage('Nome completo é obrigatório.'),
    body('email').isEmail().withMessage('Informe um e-mail válido.'),
    body('cpf').notEmpty().withMessage('CPF é obrigatório.'),
    body('senha').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres.'),
  ],
  validate,
  authController.registerClient
);

router.post('/client/login', emailSenhaRules, validate, authController.loginClient);

router.post(
  '/provider/register',
  [
    body('dadosPessoais.nomeCompleto').notEmpty().withMessage('Nome completo é obrigatório.'),
    body('dadosPessoais.email').isEmail().withMessage('Informe um e-mail válido.'),
    body('dadosPessoais.cpf').notEmpty().withMessage('CPF é obrigatório.'),
    body('dadosPessoais.senha').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres.'),
    body('informacoesProfissionais.categoriaPrincipal').notEmpty().withMessage('Categoria principal é obrigatória.'),
  ],
  validate,
  authController.registerProvider
);

router.post('/provider/login', emailSenhaRules, validate, authController.loginProvider);

router.post('/refresh', body('refreshToken').notEmpty(), validate, authController.refresh);
router.post('/logout', body('refreshToken').notEmpty(), validate, authController.logout);

router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);

module.exports = router;
