const { Router } = require('express');

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const serviceRoutes = require('./service.routes');
const orderRoutes = require('./order.routes');
const reviewRoutes = require('./review.routes');
const categoryRoutes = require('./category.routes');
const uploadRoutes = require('./upload.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/services', serviceRoutes);
router.use('/service-requests', orderRoutes);
router.use('/reviews', reviewRoutes);
router.use('/categories', categoryRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
