const uploadModel = require('../models/upload.model');
const asyncHandler = require('../utils/async-handler');
const AppError = require('../utils/app-error');

const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError('Nenhum arquivo enviado.', 422);

  const tipo = req.body.tipo || 'foto_servico';
  const url = `/uploads/${req.file.filename}`;

  const id = await uploadModel.create({
    userId: req.user.id,
    tipo,
    url,
    nomeOriginal: req.file.originalname,
  });

  res.status(201).json({ id, url, tipo });
});

module.exports = { uploadFile };
