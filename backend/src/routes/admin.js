const { Router } = require('express');
const AdminController = require('../controllers/AdminController');
const { autenticar, adminOnly } = require('../middlewares/auth');

const router = Router();

router.get('/agendamentos/hoje', autenticar, adminOnly, AdminController.agendamentosDoDia);
router.get('/agendamentos/faturamento', autenticar, adminOnly, AdminController.faturamentoDiario);
router.delete('/agendamentos/:id', autenticar, adminOnly, AdminController.excluirAgendamento);

router.get('/notificacoes', autenticar, adminOnly, AdminController.listarNotificacoes);
router.put('/notificacoes/:id/lida', autenticar, adminOnly, AdminController.marcarNotificacaoLida);
router.put('/notificacoes/ler-todas', autenticar, adminOnly, AdminController.marcarTodasLidas);

module.exports = router;
