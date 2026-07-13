/**
 * Rotas de barbeiros.
 * Gerencia o CRUD de barbeiros da barbearia.
 *
 * @module routes/barbers
 */

const { Router } = require('express');
const BarberController = require('../controllers/BarbeiroController');
const { autenticar, adminOnly } = require('../middlewares/auth');

const router = Router();

/** GET /api/barbeiros - Lista barbeiros ativos (publico) */
router.get('/', BarberController.listar);
/** GET /api/barbeiros/todos - Lista todos os barbeiros (admin) */
router.get('/todos', autenticar, adminOnly, BarberController.listarTodos);
/** POST /api/barbeiros - Cria novo barbeiro (admin) */
router.post('/', autenticar, adminOnly, BarberController.criar);
/** PUT /api/barbeiros/:id - Atualiza barbeiro (admin) */
router.put('/:id', autenticar, adminOnly, BarberController.atualizar);
/** DELETE /api/barbeiros/:id - Remove barbeiro (admin) */
router.delete('/:id', autenticar, adminOnly, BarberController.deletar);

module.exports = router;
