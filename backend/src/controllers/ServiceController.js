/**
 * Controlador responsavel pelas operacoes CRUD de servicos.
 *
 * @module controllers/ServiceController
 */

const { Service } = require('../models');
const { stripHtml } = require('../helpers/sanitize');

/**
 * Lista apenas os servicos ativos (rota publica).
 *
 * @async
 * @function listar
 * @param {Object} req - Request do Express
 * @param {Object} res - Response do Express
 * @returns {Object} 200 - Lista de servicos ativos
 */
exports.listar = async (req, res) => {
  const servicos = await Service.findAll({ where: { ativo: true } });
  res.json(servicos);
};

/**
 * Lista todos os servicos, inclusive inativos (acesso admin).
 *
 * @async
 * @function listarTodos
 * @param {Object} req - Request do Express
 * @param {Object} res - Response do Express
 * @returns {Object} 200 - Lista completa de servicos
 */
exports.listarTodos = async (req, res) => {
  const servicos = await Service.findAll();
  res.json(servicos);
};

/**
 * Cria um novo servico (admin).
 *
 * @async
 * @function criar
 * @param {Object} req - Request do Express
 * @param {Object} req.body - Dados do servico (nome, descricao, preco, duracao, ativo)
 * @param {Object} res - Response do Express
 * @returns {Object} 201 - Servico criado
 * @throws {Object} 400 - Erro ao criar servico
 */
exports.criar = async (req, res) => {
  try {
    const { nome, descricao, preco, duracao, ativo } = req.body;
    const servico = await Service.create({ nome: stripHtml(nome), descricao: stripHtml(descricao || ''), preco, duracao, ativo });
    res.status(201).json(servico);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao criar servico' });
  }
};

/**
 * Atualiza os dados de um servico (admin).
 *
 * @async
 * @function atualizar
 * @param {Object} req - Request do Express
 * @param {Object} req.params - Parametros da rota
 * @param {number} req.params.id - ID do servico
 * @param {Object} req.body - Dados parciais para atualizar
 * @param {Object} res - Response do Express
 * @returns {Object} 200 - Servico atualizado
 * @returns {Object} 404 - Servico nao encontrado
 * @throws {Object} 400 - Erro ao atualizar
 */
exports.atualizar = async (req, res) => {
  try {
    const servico = await Service.findByPk(req.params.id);
    if (!servico) return res.status(404).json({ erro: 'Servico nao encontrado' });
    const { nome, descricao, preco, duracao, ativo } = req.body;
    await servico.update({ nome: stripHtml(nome), descricao: stripHtml(descricao || ''), preco, duracao, ativo });
    res.json(servico);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao atualizar' });
  }
};

/**
 * Remove um servico do banco de dados (admin).
 *
 * @async
 * @function deletar
 * @param {Object} req - Request do Express
 * @param {Object} req.params - Parametros da rota
 * @param {number} req.params.id - ID do servico
 * @param {Object} res - Response do Express
 * @returns {Object} 200 - Mensagem de confirmacao
 * @returns {Object} 404 - Servico nao encontrado
 */
exports.deletar = async (req, res) => {
  const servico = await Service.findByPk(req.params.id);
  if (!servico) return res.status(404).json({ erro: 'Servico nao encontrado' });
  await servico.destroy();
  res.json({ mensagem: 'Servico removido' });
};
