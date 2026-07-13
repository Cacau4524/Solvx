const { Router } = require('express');
const { body } = require('express-validator');
const reviewController = require('../controllers/review.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');

const router = Router();

router.post(
  '/',
  authMiddleware,
  requireRole('cliente'),
  [
    body('orderId').isInt().withMessage('orderId inválido.'),
    body('nota').isInt({ min: 1, max: 5 }).withMessage('Nota deve ser entre 1 e 5.'),
  ],
  validate,
  reviewController.create
);

router.get('/prestador/:providerId', reviewController.listForProvider);
router.get('/prestador/:providerId/resumo', reviewController.getSummary);

module.exports = router;
