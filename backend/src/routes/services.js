/**
 * Rotas de servicos.
 * Gerencia o CRUD de servicos da barbearia.
 *
 * @module routes/services
 */

const { Router } = require('express');
const ServiceController = require('../controllers/ServiceController');
const { autenticar, adminOnly } = require('../middlewares/auth');

const router = Router();

/** GET /api/servicos - Lista servicos ativos (publico) */
router.get('/', ServiceController.listar);
/** GET /api/servicos/todos - Lista todos os servicos (admin) */
router.get('/todos', autenticar, adminOnly, ServiceController.listarTodos);
/** POST /api/servicos - Cria novo servico (admin) */
router.post('/', autenticar, adminOnly, ServiceController.criar);
/** PUT /api/servicos/:id - Atualiza servico (admin) */
router.put('/:id', autenticar, adminOnly, ServiceController.atualizar);
/** DELETE /api/servicos/:id - Remove servico (admin) */
router.delete('/:id', autenticar, adminOnly, ServiceController.deletar);

module.exports = router;
