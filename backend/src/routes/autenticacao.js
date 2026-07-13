/**
 * Rotas de autenticacao.
 * Gerencia login, cadastro e obtencao de dados do usuario logado.
 *
 * @module routes/auth
 */

const { Router } = require('express');
const rateLimit = require('express-rate-limit');
const AuthController = require('../controllers/AutenticacaoController');
const { autenticar } = require('../middlewares/auth');

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { erro: 'Muitas tentativas. Tente novamente em 15 minutos' },
  standardHeaders: true,
  legacyHeaders: false,
});

/** POST /api/auth/login - Realiza login (publico) */
router.post('/login', authLimiter, AuthController.login);
/** POST /api/auth/cadastrar - Cadastra novo usuario cliente (publico) */
router.post('/cadastrar', authLimiter, AuthController.cadastrar);
/** GET /api/auth/me - Retorna dados do usuario logado (autenticado) */
router.get('/me', autenticar, AuthController.me);

module.exports = router;
