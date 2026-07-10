/**
 * Rotas do cliente (consultar agendamentos, cancelar, perfil).
 * Todas exigem autenticacao.
 *
 * @module routes/cliente
 */

const { Router } = require('express');
const ClienteController = require('../controllers/ClienteController');
const { autenticar } = require('../middlewares/auth');

const router = Router();

/** GET /api/cliente/agendamentos - Lista agendamentos do cliente logado */
router.get('/agendamentos', autenticar, ClienteController.meusAgendamentos);
/** PUT /api/cliente/agendamentos/:id/cancelar - Cancela agendamento do cliente */
router.put('/agendamentos/:id/cancelar', autenticar, ClienteController.cancelarAgendamento);
/** GET /api/cliente/dados - Retorna dados do perfil do cliente */
router.get('/dados', autenticar, ClienteController.meusDados);

module.exports = router;
