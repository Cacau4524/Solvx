const { Router } = require('express');
const uploadController = require('../controllers/upload.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

const router = Router();

router.post('/', authMiddleware, upload.single('file'), uploadController.uploadFile);

module.exports = router;
