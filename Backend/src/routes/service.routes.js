const { Router } = require('express');
const { body } = require('express-validator');
const serviceController = require('../controllers/service.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');

const router = Router();

const serviceRules = [
  body('titulo').notEmpty().withMessage('Título é obrigatório.'),
  body('descricao').notEmpty().withMessage('Descrição é obrigatória.'),
  body('preco').isFloat({ min: 0 }).withMessage('Preço inválido.'),
];

router.get('/', serviceController.list);
router.get('/:id', serviceController.getById);

router.post('/', authMiddleware, requireRole('prestador'), serviceRules, validate, serviceController.create);
router.put('/:id', authMiddleware, requireRole('prestador'), serviceRules, validate, serviceController.update);
router.delete('/:id', authMiddleware, requireRole('prestador'), serviceController.remove);

module.exports = router;
