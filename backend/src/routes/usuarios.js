/**
 * Rotas de usuarios.
 * Gerencia a consulta e atualizacao de dados dos usuarios.
 *
 * @module routes/users
 */

const { Router } = require('express');
const UserController = require('../controllers/UsuarioController');
const { autenticar, adminOnly } = require('../middlewares/auth');

const router = Router();

/** GET /api/usuarios - Lista todos os usuarios (admin) */
router.get('/', autenticar, adminOnly, UserController.listar);
/** GET /api/usuarios/:id - Busca usuario por ID (autenticado) */
router.get('/:id', autenticar, UserController.buscar);
/** PUT /api/usuarios/:id - Atualiza dados do usuario (autenticado) */
router.put('/:id', autenticar, UserController.atualizar);

module.exports = router;
