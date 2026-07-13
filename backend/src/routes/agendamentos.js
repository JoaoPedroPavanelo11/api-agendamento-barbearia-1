/**
 * Rotas de agendamentos.
 * Gerencia a criacao, consulta, cancelamento e administracao de agendamentos.
 *
 * @module routes/appointments
 */

const { Router } = require('express');
const rateLimit = require('express-rate-limit');
const AppointmentController = require('../controllers/AgendamentoController');
const { autenticar, adminOnly } = require('../middlewares/auth');

const router = Router();

const agendamentoLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { erro: 'Muitas tentativas. Tente novamente em 15 minutos' },
  standardHeaders: true,
  legacyHeaders: false,
});

/** GET /api/agendamentos/horarios - Consulta horarios ocupados (publico) */
router.get('/horarios', AppointmentController.horariosOcupados);
/** GET /api/agendamentos - Lista todos os agendamentos (admin) */
router.get('/', autenticar, adminOnly, AppointmentController.listar);
/** POST /api/agendamentos - Cria novo agendamento (autenticado) */
router.post('/', autenticar, agendamentoLimiter, AppointmentController.criar);
/** PUT /api/agendamentos/:id/status - Atualiza status do agendamento (admin) */
router.put('/:id/status', autenticar, adminOnly, AppointmentController.atualizarStatus);
/** PUT /api/agendamentos/:id/cancelar - Cancela agendamento (autenticado - dono ou admin) */
router.put('/:id/cancelar', autenticar, AppointmentController.cancelar);
/** DELETE /api/agendamentos/:id - Remove agendamento (admin) */
router.delete('/:id', autenticar, adminOnly, AppointmentController.deletar);

module.exports = router;
