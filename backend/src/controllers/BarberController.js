/**
 * Controlador responsavel pelas operacoes CRUD de barbeiros.
 *
 * @module controllers/BarberController
 */

const { Barber } = require('../models');
const { stripHtml } = require('../helpers/sanitize');
const validate = require('../helpers/validate');

/**
 * Lista apenas os barbeiros ativos (rota publica).
 *
 * @async
 * @function listar
 * @param {Object} req - Request do Express
 * @param {Object} res - Response do Express
 * @returns {Object} 200 - Lista de barbeiros ativos
 */
exports.listar = async (req, res) => {
  const barbeiros = await Barber.findAll({ where: { ativo: true } });
  res.json(barbeiros);
};

/**
 * Lista todos os barbeiros, inclusive inativos (acesso admin).
 *
 * @async
 * @function listarTodos
 * @param {Object} req - Request do Express
 * @param {Object} res - Response do Express
 * @returns {Object} 200 - Lista completa de barbeiros
 */
exports.listarTodos = async (req, res) => {
  const barbeiros = await Barber.findAll();
  res.json(barbeiros);
};

/**
 * Cria um novo barbeiro (admin).
 *
 * @async
 * @function criar
 * @param {Object} req - Request do Express
 * @param {Object} req.body - Dados do barbeiro (nome, foto, dias_trabalho, hora_inicio, hora_fim, ativo)
 * @param {Object} res - Response do Express
 * @returns {Object} 201 - Barbeiro criado
 * @throws {Object} 400 - Erro ao criar barbeiro
 */
exports.criar = async (req, res) => {
  try {
    const { nome, foto, dias_trabalho, hora_inicio, hora_fim, ativo } = req.body;

    const erro = validate.validar([
      { fn: validate.campoObrigatorio, args: [nome, 'Nome'] },
      { fn: validate.stringValida, args: [nome, 'Nome', 2, 100] },
    ]);
    if (erro) return res.status(400).json({ erro });

    const barbeiro = await Barber.create({ nome: stripHtml(nome), foto, dias_trabalho, hora_inicio, hora_fim, ativo });
    res.status(201).json(barbeiro);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao criar barbeiro' });
  }
};

/**
 * Atualiza os dados de um barbeiro (admin).
 *
 * @async
 * @function atualizar
 * @param {Object} req - Request do Express
 * @param {Object} req.params - Parametros da rota
 * @param {number} req.params.id - ID do barbeiro
 * @param {Object} req.body - Dados parciais para atualizar
 * @param {Object} res - Response do Express
 * @returns {Object} 200 - Barbeiro atualizado
 * @returns {Object} 404 - Barbeiro nao encontrado
 * @throws {Object} 400 - Erro ao atualizar
 */
exports.atualizar = async (req, res) => {
  try {
    const erroId = validate.idValido(req.params.id);
    if (erroId) return res.status(400).json({ erro: erroId });

    const barbeiro = await Barber.findByPk(req.params.id);
    if (!barbeiro) return res.status(404).json({ erro: 'Barbeiro nao encontrado' });
    const { nome, foto, dias_trabalho, hora_inicio, hora_fim, ativo } = req.body;

    if (nome) {
      const erroNome = validate.stringValida(nome, 'Nome', 2, 100);
      if (erroNome) return res.status(400).json({ erro: erroNome });
    }

    await barbeiro.update({ nome: stripHtml(nome), foto, dias_trabalho, hora_inicio, hora_fim, ativo });
    res.json(barbeiro);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao atualizar' });
  }
};

/**
 * Remove um barbeiro do banco de dados (admin).
 *
 * @async
 * @function deletar
 * @param {Object} req - Request do Express
 * @param {Object} req.params - Parametros da rota
 * @param {number} req.params.id - ID do barbeiro
 * @param {Object} res - Response do Express
 * @returns {Object} 200 - Mensagem de confirmacao
 * @returns {Object} 404 - Barbeiro nao encontrado
 */
exports.deletar = async (req, res) => {
  const erroId = validate.idValido(req.params.id);
  if (erroId) return res.status(400).json({ erro: erroId });

  const barbeiro = await Barber.findByPk(req.params.id);
  if (!barbeiro) return res.status(404).json({ erro: 'Barbeiro nao encontrado' });
  await barbeiro.destroy();
  res.json({ mensagem: 'Barbeiro removido' });
};
