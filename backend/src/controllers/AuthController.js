/**
 * Controlador responsavel pelas operacoes de autenticacao:
 * login, cadastro e consulta do usuario logado.
 *
 * @module controllers/AuthController
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { stripHtml } = require('../helpers/sanitize');
const validate = require('../helpers/validate');

/**
 * Realiza o login do usuario.
 * Valida email e senha e retorna um token JWT.
 *
 * @async
 * @function login
 * @param {Object} req - Request do Express
 * @param {Object} req.body - Corpo da requisicao
 * @param {string} req.body.email - Email do usuario
 * @param {string} req.body.senha - Senha do usuario
 * @param {Object} res - Response do Express
 * @returns {Object} 200 - Token JWT e dados do usuario
 * @returns {Object} 401 - Email ou senha incorretos
 * @throws {Object} 500 - Erro interno ao fazer login
 */
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const erro = validate.validar([
      { fn: validate.campoObrigatorio, args: [email, 'Email'] },
      { fn: validate.campoObrigatorio, args: [senha, 'Senha'] },
    ]);
    if (erro) return res.status(400).json({ erro });

    const emailErro = validate.emailValido(email);
    if (emailErro) return res.status(400).json({ erro: emailErro });

    const usuario = await User.findOne({ where: { email } });
    if (!usuario) return res.status(401).json({ erro: 'Email ou senha incorretos' });

    const valida = await bcrypt.compare(senha, usuario.senha);
    if (!valida) return res.status(401).json({ erro: 'Email ou senha incorretos' });

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role } });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao fazer login' });
  }
};

/**
 * Cadastra um novo usuario (cliente).
 * Verifica se o email ja existe, faz hash da senha e cria o registro.
 *
 * @async
 * @function cadastrar
 * @param {Object} req - Request do Express
 * @param {Object} req.body - Corpo da requisicao
 * @param {string} req.body.nome - Nome do usuario
 * @param {string} req.body.email - Email do usuario
 * @param {string} req.body.senha - Senha em texto puro (sera hasheada)
 * @param {string} [req.body.telefone] - Telefone do usuario
 * @param {Object} res - Response do Express
 * @returns {Object} 201 - Dados do usuario criado (sem senha)
 * @returns {Object} 400 - Email ja cadastrado
 * @throws {Object} 500 - Erro interno ao cadastrar
 */
exports.cadastrar = async (req, res) => {
  try {
    const { nome, email, senha, telefone } = req.body;

    const erro = validate.validar([
      { fn: validate.campoObrigatorio, args: [nome, 'Nome'] },
      { fn: validate.campoObrigatorio, args: [email, 'Email'] },
      { fn: validate.campoObrigatorio, args: [senha, 'Senha'] },
      { fn: validate.stringValida, args: [nome, 'Nome', 2, 100] },
      { fn: validate.emailValido, args: [email] },
    ]);
    if (erro) return res.status(400).json({ erro });
    if (senha.length < 8) {
      return res.status(400).json({ erro: 'Senha deve ter no minimo 8 caracteres' });
    }
    const existe = await User.findOne({ where: { email } });
    if (existe) return res.status(400).json({ erro: 'Email ja cadastrado' });

    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await User.create({ nome: stripHtml(nome), email, senha: senhaHash, telefone: stripHtml(telefone || ''), role: 'cliente' });

    res.status(201).json({ id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao cadastrar' });
  }
};

/**
 * Retorna os dados do usuario autenticado (exceto senha).
 * Requer token JWT valido (middleware autenticar).
 *
 * @async
 * @function me
 * @param {Object} req - Request do Express (req.usuario deve estar preenchido)
 * @param {Object} res - Response do Express
 * @returns {Object} 200 - Dados do usuario (sem senha)
 * @throws {Object} 500 - Erro interno ao buscar usuario
 */
exports.me = async (req, res) => {
  try {
    const usuario = await User.findByPk(req.usuario.id, { attributes: { exclude: ['senha'] } });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar usuario' });
  }
};
