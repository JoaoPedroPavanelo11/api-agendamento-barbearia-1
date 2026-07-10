/**
 * Rotas de agendamentos.
 * Gerencia a criacao, consulta, cancelamento e administracao de agendamentos.
 *
 * @module routes/appointments
 */

const { Router } = require('express');
const AppointmentController = require('../controllers/AppointmentController');
const { autenticar, adminOnly } = require('../middlewares/auth');

const router = Router();

/** GET /api/agendamentos/horarios - Consulta horarios ocupados (publico) */
router.get('/horarios', AppointmentController.horariosOcupados);
/** GET /api/agendamentos - Lista todos os agendamentos (admin) */
router.get('/', autenticar, adminOnly, AppointmentController.listar);
/** GET /api/agendamentos/meus - Lista agendamentos do usuario logado (autenticado) */
router.get('/meus', autenticar, AppointmentController.meusAgendamentos);
/** POST /api/agendamentos - Cria novo agendamento (autenticado) */
router.post('/', autenticar, AppointmentController.criar);
/** PUT /api/agendamentos/:id/status - Atualiza status do agendamento (admin) */
router.put('/:id/status', autenticar, adminOnly, AppointmentController.atualizarStatus);
/** PUT /api/agendamentos/:id/cancelar - Cancela agendamento (autenticado - dono ou admin) */
router.put('/:id/cancelar', autenticar, AppointmentController.cancelar);
/** DELETE /api/agendamentos/:id - Remove agendamento (admin) */
router.delete('/:id', autenticar, adminOnly, AppointmentController.deletar);

module.exports = router;
