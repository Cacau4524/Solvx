const { Router } = require('express');
const { body } = require('express-validator');
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');

const router = Router();
router.use(authMiddleware);

router.post(
  '/',
  requireRole('cliente'),
  [body('descricao').notEmpty().withMessage('Descrição é obrigatória.')],
  validate,
  orderController.create
);

router.get('/me', requireRole('cliente'), orderController.listMine);
router.post('/:id/cancelar', requireRole('cliente'), orderController.cancel);

router.get('/recebidas', requireRole('prestador'), orderController.listReceived);
router.post('/:id/aceitar', requireRole('prestador'), orderController.accept);
router.post('/:id/recusar', requireRole('prestador'), orderController.reject);
router.post('/:id/concluir', requireRole('prestador'), orderController.complete);

module.exports = router;
