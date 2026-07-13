require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const routes = require('./routes');
const errorMiddleware = require('./middlewares/error.middleware');
const AppError = require('./utils/app-error');

const app = express();

// ---------- Segurança básica ----------
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    credentials: true,
  })
);

// Limite de requisições por IP — protege contra brute-force e abuso da API.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Muitas requisições. Tente novamente em instantes.' },
});
app.use('/api', apiLimiter);

// Limite mais rígido especificamente para login (evita brute-force de senha).
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Muitas tentativas de login. Tente novamente em instantes.' },
});
app.use('/api/auth/client/login', authLimiter);
app.use('/api/auth/provider/login', authLimiter);

// ---------- Parsing e logs ----------
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ---------- Arquivos estáticos (uploads) ----------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------- Rotas da API ----------
app.use('/api', routes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ---------- 404 e erros ----------
app.use((req, res, next) => next(new AppError(`Rota não encontrada: ${req.originalUrl}`, 404)));
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Solvy API rodando em http://localhost:${PORT}`);
});

module.exports = app;
