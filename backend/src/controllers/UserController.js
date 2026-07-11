/**
 * Controlador responsavel pelas operacoes de gerenciamento de usuarios.
 *
 * @module controllers/UserController
 */

const { User } = require('../models');
const { stripHtml } = require('../helpers/sanitize');
const validate = require('../helpers/validate');

/**
 * Lista todos os usuarios cadastrados (admin).
 * Retorna os dados sem a senha.
 *
 * @async
 * @function listar
 * @param {Object} req - Request do Express
 * @param {Object} res - Response do Express
 * @returns {Object} 200 - Lista de usuarios (sem senha)
 */
exports.listar = async (req, res) => {
  const usuarios = await User.findAll({ attributes: { exclude: ['senha'] } });
  res.json(usuarios);
};

/**
 * Busca um usuario pelo ID (autenticado).
 * Retorna os dados sem a senha.
 *
 * @async
 * @function buscar
 * @param {Object} req - Request do Express
 * @param {Object} req.params - Parametros da rota
 * @param {number} req.params.id - ID do usuario
 * @param {Object} res - Response do Express
 * @returns {Object} 200 - Dados do usuario (sem senha)
 * @returns {Object} 404 - Usuario nao encontrado
 */
exports.buscar = async (req, res) => {
  if (req.usuario.role !== 'admin' && Number(req.usuario.id) !== Number(req.params.id)) {
    return res.status(403).json({ erro: 'Voce so pode consultar seus proprios dados' });
  }
  const usuario = await User.findByPk(req.params.id, { attributes: { exclude: ['senha'] } });
  if (!usuario) return res.status(404).json({ erro: 'Usuario nao encontrado' });
  res.json(usuario);
};

/**
 * Atualiza dados de um usuario (autenticado).
 * Permite alterar nome e telefone. Apenas admin pode alterar a role.
 *
 * @async
 * @function atualizar
 * @param {Object} req - Request do Express
 * @param {Object} req.params - Parametros da rota
 * @param {number} req.params.id - ID do usuario
 * @param {Object} req.body - Dados para atualizar (nome, telefone, role)
 * @param {Object} res - Response do Express
 * @returns {Object} 200 - Usuario atualizado (sem senha)
 * @returns {Object} 404 - Usuario nao encontrado
 * @throws {Object} 400 - Erro ao atualizar
 */
exports.atualizar = async (req, res) => {
  try {
    const erroId = validate.idValido(req.params.id);
    if (erroId) return res.status(400).json({ erro: erroId });

    if (req.usuario.role !== 'admin' && Number(req.usuario.id) !== Number(req.params.id)) {
      return res.status(403).json({ erro: 'Voce so pode editar seus proprios dados' });
    }
    const usuario = await User.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ erro: 'Usuario nao encontrado' });

    const dadosPermitidos = {};
    if (req.body.nome) {
      const erroNome = validate.stringValida(req.body.nome, 'Nome', 2, 100);
      if (erroNome) return res.status(400).json({ erro: erroNome });
      dadosPermitidos.nome = stripHtml(req.body.nome);
    }
    if (req.body.telefone) dadosPermitidos.telefone = stripHtml(req.body.telefone);
    if (req.body.role) {
      if (req.usuario.role !== 'admin') return res.status(403).json({ erro: 'Apenas admin pode alterar a role' });
      if (!['admin', 'cliente'].includes(req.body.role)) return res.status(400).json({ erro: 'Role invalida' });
      dadosPermitidos.role = req.body.role;
    }

    await usuario.update(dadosPermitidos);
    const { senha, ...usuarioSemSenha } = usuario.toJSON();
    res.json(usuarioSemSenha);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao atualizar' });
  }
};
